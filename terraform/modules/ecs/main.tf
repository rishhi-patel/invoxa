resource "aws_ecs_cluster" "this" {
  name = "${var.prefix}CLUSTER01"
  tags = var.tags
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name = aws_ecs_cluster.this.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = 1
  }
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/${var.prefix}cluster"
  retention_in_days = 7
  tags              = var.tags
}

# Auth Service Task Definition
resource "aws_ecs_task_definition" "auth_service" {
  family                   = "${var.prefix}auth-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "auth-service"
      image = "${var.ecr_repository_url}:auth-service-latest"
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "auth-service"
        }
      }
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "8080"
        }
      ]
      # Note: Secrets will be added when secret ARNs are available from the secrets module
    }
  ])

  tags = var.tags
}

# Client Service Task Definition
resource "aws_ecs_task_definition" "client_service" {
  family                   = "${var.prefix}client-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "client-service"
      image = "${var.ecr_repository_url}:client-service-latest"
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "client-service"
        }
      }
      environment = [
        {
          name  = "FLASK_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "5000"
        }
      ]
    }
  ])

  tags = var.tags
}

# Invoice Service Task Definition
resource "aws_ecs_task_definition" "invoice_service" {
  family                   = "${var.prefix}invoice-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "invoice-service"
      image = "${var.ecr_repository_url}:invoice-service-latest"
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "invoice-service"
        }
      }
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "8080"
        }
      ]
    }
  ])

  tags = var.tags
}

# Notification Service Task Definition
resource "aws_ecs_task_definition" "notification_service" {
  family                   = "${var.prefix}notification-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "notification-service"
      image = "${var.ecr_repository_url}:notification-service-latest"
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "notification-service"
        }
      }
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "8080"
        }
      ]
    }
  ])

  tags = var.tags
}

# Payment Service Task Definition
resource "aws_ecs_task_definition" "payment_service" {
  family                   = "${var.prefix}payment-service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name  = "payment-service"
      image = "${var.ecr_repository_url}:payment-service-latest"
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "payment-service"
        }
      }
      environment = [
        {
          name  = "FLASK_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "5000"
        }
      ]
    }
  ])

  tags = var.tags
}
