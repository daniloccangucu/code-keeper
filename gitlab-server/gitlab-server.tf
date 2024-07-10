provider "aws" {
  region = "eu-north-1"  # Set the AWS region to Northern Europe
}

resource "aws_instance" "gitlab" {
  ami           = "ami-07c8c1b18ca66bb07"  # Example AMI ID
  instance_type = "t3.large"
  key_name      = "code-keeper"

  tags = {
    Name = "gitlab-server"
  }

  # Reference the security group by its ID
  vpc_security_group_ids = [aws_security_group.gitlab-sg.id]

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

              # Start and enable Docker service
              systemctl start docker
              systemctl enable docker

              # Add the user to the docker group
              usermod -aG docker ubuntu

              # Install Gitlab
              curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh | bash
              apt-get install -y gitlab-ee
              sudo gitlab-ctl reconfigure

              # Install Gitlab-runner
              sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
              sudo chmod +x /usr/local/bin/gitlab-runner

              # Install latest Node.js LTS version and npm
              sudo curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
              sudo apt-get install -y nodejs

              # Install zip
              sudo apt-get install -y zip

              # Install Ansible
              sudo apt-get install -y software-properties-common
              sudo add-apt-repository --yes --update ppa:ansible/ansible
              sudo apt-get install -y ansible

              sudo curl https://static.snyk.io/cli/latest/snyk-linux -o snyk
              sudo chmod +x ./snyk
              sudo mv ./snyk /usr/local/bin/
              EOF

  root_block_device {
    volume_size = 20  # Size in GB
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_security_group" "gitlab-sg" {
  name_prefix = "gitlab-sg"

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
    from_port   = 3000
    to_port     = 3000
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