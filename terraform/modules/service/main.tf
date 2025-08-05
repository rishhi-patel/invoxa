# ---------------------- Task Execution Role ----------------------
resource "aws_iam_role" "ecs_task_execution" {
  name               = "${var.project_name}-ecs-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_exec_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ---------------------- Create ECS Services for Each Microservice ----------------------
resource "aws_ecs_task_definition" "service_task" {
  for_each = var.services

  family                   = each.key
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = each.value.cpu
  memory                   = each.value.memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = each.key
      image     = "${var.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${each.key}:latest"
      essential = true
      portMappings = [
        {
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol      = "tcp"
        }
      ]
    }
  ])
}

# ---------------------- Create Target Groups ----------------------
resource "aws_lb_target_group" "service_tg" {
  for_each    = var.services
  name        = replace("${each.key}-tg", "_", "-")
  port        = each.value.port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

# ---------------------- Listener Rules ----------------------
resource "aws_lb_listener_rule" "service_rule" {
  for_each = var.services

  listener_arn = var.alb_listener_arn
  priority     = each.value.priority

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.service_tg[each.key].arn
  }

  condition {
    path_pattern {
      values = [each.value.path]
    }
  }
}

# ---------------------- ECS Services ----------------------
resource "aws_ecs_service" "service" {
  for_each = var.services

  name            = each.key
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.service_task[each.key].arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnets
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_service_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.service_tg[each.key].arn
    container_name   = each.key
    container_port   = each.value.port
  }

  depends_on = [aws_lb_listener_rule.service_rule]
}

# ---------------------- ECS Service Security Group ----------------------
resource "aws_security_group" "ecs_service_sg" {
  name        = "${var.project_name}-ecs-service-sg"
  description = "Allow ALB to reach ECS services"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [var.alb_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-service-sg"
  }
}
