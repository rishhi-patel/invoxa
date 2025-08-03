resource "aws_security_group" "ecs_sg" {
  name        = "${var.prefix}-ECS-SG"
  description = "Security Group for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    description     = "App ports from ALB"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  ingress {
    description     = "Flask app ports from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.prefix}ECS-SG"
  })
}

resource "aws_security_group" "alb_sg" {
  name        = "${var.prefix}-ALB-SG"
  description = "Security Group for ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.prefix}ALB-SG"
  })
}

# Database Security Group - COMMENTED OUT - USING EXTERNAL MONGODB
# resource "aws_security_group" "rds_sg" {
#   name        = "${var.prefix}-RDS-SG"
#   description = "Security Group for RDS database"
#   vpc_id      = var.vpc_id

#   ingress {
#     description     = "MySQL/Aurora from ECS"
#     from_port       = 3306
#     to_port         = 3306
#     protocol        = "tcp"
#     security_groups = [aws_security_group.ecs_sg.id]
#   }

#   ingress {
#     description     = "PostgreSQL from ECS"
#     from_port       = 5432
#     to_port         = 5432
#     protocol        = "tcp"
#     security_groups = [aws_security_group.ecs_sg.id]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   tags = merge(var.tags, {
#     Name = "${var.prefix}RDS-SG"
#   })
# }
