# Create a Virtual Private Cloud (VPC) for Inventory Services
resource "aws_vpc" "inventory_vpc" {
  cidr_block = "10.0.0.0/16"  # The IP range for the VPC, allows 65,536 addresses
}

# Create 2 public subnets within the Inventory VPC
resource "aws_subnet" "inventory_public_az1" {
  vpc_id                  = aws_vpc.inventory_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "eu-north-1a"
}

resource "aws_subnet" "inventory_public_az2" {
  vpc_id                  = aws_vpc.inventory_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "eu-north-1b"
}

# Create Internet Gateways for both VPCs
resource "aws_internet_gateway" "inventory_igw" {
  vpc_id = aws_vpc.inventory_vpc.id
}

# Create Route Tables for the public subnets in both VPCs
resource "aws_route_table" "inventory_public_rt" {
  vpc_id = aws_vpc.inventory_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.inventory_igw.id
  }
}

# Associate the public subnets with their Route Tables
resource "aws_route_table_association" "inventory_public_az1" {
  subnet_id      = aws_subnet.inventory_public_az1.id
  route_table_id = aws_route_table.inventory_public_rt.id
}

resource "aws_route_table_association" "inventory_public_az2" {
  subnet_id      = aws_subnet.inventory_public_az2.id
  route_table_id = aws_route_table.inventory_public_rt.id
}

# Security Groups for Inventory Services
resource "aws_security_group" "inventory_nlb_sg" {
  vpc_id = aws_vpc.inventory_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "inventory_database" {
  vpc_id = aws_vpc.inventory_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "inventory_app" {
  vpc_id = aws_vpc.inventory_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create Network Load Balancers for VPCs
resource "aws_lb" "inventory_nlb" {
  name               = "inventory-nlb"
  internal           = false
  load_balancer_type = "network"
  subnets            = [aws_subnet.inventory_public_az1.id, aws_subnet.inventory_public_az2.id]
}

# Create Target Groups
resource "aws_lb_target_group" "inventory_tg" {
  name       = "inventory-tg"
  port       = 5432
  protocol   = "TCP"
  vpc_id     = aws_vpc.inventory_vpc.id
  target_type = "ip"
}

resource "aws_lb_target_group" "inventory_app_tg" {
  name       = "inventory-app-tg"
  port       = 8080
  protocol   = "TCP"
  vpc_id     = aws_vpc.inventory_vpc.id
  target_type = "ip"
}

# Fetch the secrets from Secrets Manager
data "aws_secretsmanager_secret" "postgres_user" {
  name = "postgres_user"
}

data "aws_secretsmanager_secret_version" "postgres_user_version" {
  secret_id = data.aws_secretsmanager_secret.postgres_user.id
}

data "aws_secretsmanager_secret" "postgres_password" {
  name = "postgres_password"
}

data "aws_secretsmanager_secret_version" "postgres_password_version" {
  secret_id = data.aws_secretsmanager_secret.postgres_password.id
}

data "aws_secretsmanager_secret" "postgres_database" {
  name = "postgres_database"
}

data "aws_secretsmanager_secret_version" "postgres_database_version" {
  secret_id = data.aws_secretsmanager_secret.postgres_database.id
}

data "aws_secretsmanager_secret" "rabbitmq_user" {
  name = "rabbitmq_user"
}

data "aws_secretsmanager_secret_version" "rabbitmq_user_version" {
  secret_id = data.aws_secretsmanager_secret.rabbitmq_user.id
}

data "aws_secretsmanager_secret" "rabbitmq_password" {
  name = "rabbitmq_password"
}

data "aws_secretsmanager_secret_version" "rabbitmq_password_version" {
  secret_id = data.aws_secretsmanager_secret.rabbitmq_password.id
}

data "aws_secretsmanager_secret" "pg_2_database" {
  name = "pg_2_database"
}

data "aws_secretsmanager_secret_version" "pg_2_database_version" {
  secret_id = data.aws_secretsmanager_secret.pg_2_database.id
}

# Create Listeners
resource "aws_lb_listener" "inventory_db_listener" {
  load_balancer_arn = aws_lb.inventory_nlb.arn
  port              = "5432"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.inventory_tg.arn
  }
}

resource "aws_lb_listener" "inventory_app_listener" {
  load_balancer_arn = aws_lb.inventory_nlb.arn
  port              = "8080"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.inventory_app_tg.arn
  }
}

# Create ECS Clusters
resource "aws_ecs_cluster" "inventory_cluster" {
  name = "inventory-cluster"
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high_inventory" {
  alarm_name          = "ecs-cpu-high-inventory"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "70"

  dimensions = {
    ClusterName = aws_ecs_cluster.inventory_cluster.name
    ServiceName = aws_ecs_service.inventory_app.name
  }

  alarm_actions = [aws_appautoscaling_policy.inventory_scale_up_policy.arn]
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_low_inventory" {
  alarm_name          = "ecs-cpu-low-inventory"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "30"

  dimensions = {
    ClusterName = aws_ecs_cluster.inventory_cluster.name
    ServiceName = aws_ecs_service.inventory_app.name
  }

  alarm_actions = [aws_appautoscaling_policy.inventory_scale_down_policy.arn]
}

# Auto Scaling Policies
resource "aws_appautoscaling_target" "inventory_app" {
  max_capacity       = 10
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.inventory_cluster.name}/${aws_ecs_service.inventory_app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "inventory_scale_up_policy" {
  name               = "inventory-scale-up"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.inventory_app.resource_id
  scalable_dimension = aws_appautoscaling_target.inventory_app.scalable_dimension
  service_namespace  = aws_appautoscaling_target.inventory_app.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment = 1
      metric_interval_lower_bound = 0
    }
  }
}

resource "aws_appautoscaling_policy" "inventory_scale_down_policy" {
  name               = "inventory-scale-down"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.inventory_app.resource_id
  scalable_dimension = aws_appautoscaling_target.inventory_app.scalable_dimension
  service_namespace  = aws_appautoscaling_target.inventory_app.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 300
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment = -1
      metric_interval_upper_bound = 0
    }
  }
}

# Create ECS Task Definitions
resource "aws_ecs_task_definition" "inventory_database" {
  family                   = "inventory_database"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name  = "inventory-database"
    image = "danilocangucu/inventory-database:latest"
    essential = true
    portMappings = [{
      containerPort = 5432
      hostPort      = 5432
    }]
    environment = [
      {
        name  = "POSTGRES_USER"
        value = "postgres"
      },
      {
        name  = "POSTGRES_PASSWORD"
        value = "t3st"
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/inventory-database"
        awslogs-region        = "eu-north-1"
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_task_definition" "inventory_app" {
  family                   = "inventory_app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([{
    name  = "inventory-app"
    image = "danilocangucu/inventory-app:latest"
    essential = true
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
    environment = [
      {
        name  = "PGUSER"
        value = "postgres"
      },
      {
        name  = "PGPASSWORD"
        value = "t3st"
      },
      {
        name  = "PGDATABASE"
        value = "movies"
      },
      {
        name  = "PGHOST"
        value = aws_lb.inventory_nlb.dns_name  # Value from LB dynamically
      },
      {
        name  = "PGPORT"
        value = "5432"
      },
      {
        name  = "INVENTORY_PORT"
        value = "8080"
      }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/inventory-app"
        awslogs-region        = "eu-north-1"
        awslogs-stream-prefix = "ecs"
      }
    }
  }])

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

# IAM role for ECS tasks executions
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# CloudWatch log groups
resource "aws_cloudwatch_log_group" "inventory_database" {
  name              = "/ecs/inventory-database"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "inventory_app" {
  name              = "/ecs/inventory-app"
  retention_in_days = 7
}

# Create ECS Services
resource "aws_ecs_service" "inventory_database" {
  name            = "inventory-database-service"
  cluster         = aws_ecs_cluster.inventory_cluster.id
  task_definition = aws_ecs_task_definition.inventory_database.arn
  desired_count   = 1

  launch_type = "FARGATE"
  platform_version = "LATEST"

  network_configuration {
    subnets         = [aws_subnet.inventory_public_az1.id, aws_subnet.inventory_public_az2.id]
    security_groups = [aws_security_group.inventory_database.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.inventory_tg.arn
    container_name   = "inventory-database"
    container_port   = 5432
  }
}

resource "aws_ecs_service" "inventory_app" {
  name            = "inventory-app-service"
  cluster         = aws_ecs_cluster.inventory_cluster.id
  task_definition = aws_ecs_task_definition.inventory_app.arn
  desired_count   = 1

  launch_type = "FARGATE"
  platform_version = "LATEST"

  network_configuration {
    subnets         = [aws_subnet.inventory_public_az1.id, aws_subnet.inventory_public_az2.id]
    security_groups = [aws_security_group.inventory_app.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.inventory_app_tg.arn
    container_name   = "inventory-app"
    container_port   = 8080
  }
}

# Output Load Balancer DNS Names
output "inventory_lb_dns" {
  value = aws_lb.inventory_nlb.dns_name
}