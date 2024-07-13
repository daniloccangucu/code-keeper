resource "aws_instance" "rabbitmq-production" {
  ami           = "ami-00ab811808de193f8"
  instance_type = "t3.small"
  key_name      = "code-keeper"
  tags = {
    Name = "rabbitmq-production-server"
  }
  vpc_security_group_ids = [aws_security_group.rabbitmq-production_sg.id]

  user_data = <<-EOF
  #!/bin/bash
  apt-get update
  apt-get install -y curl openssh-server ca-certificates
  # Install Docker
  apt-get install -y apt-transport-https ca-certificates curl software-properties-common
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  apt-get update
  apt-get install -y docker-ce
  systemctl start docker
  systemctl enable docker
  usermod -aG docker ubuntu
  # Install awscli
  apt-get install -y awscli
  aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
  aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
  aws configure set default.region eu-north-1
  # Install and configure UFW
  apt-get install -y ufw
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 5672/tcp
  ufw --force enable
  EOF

  root_block_device {
    volume_size = 10
  }
}

resource "aws_security_group" "rabbitmq-production_sg" {
  name_prefix = "rabbitmq-production-sg"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 5672
    to_port     = 5672
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

output "rabbitmq-production_instance_public_ip" {
  description = "The public IP address of the rabbitmq-production server"
  value       = aws_instance.rabbitmq-production.public_ip
}
