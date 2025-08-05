# ---------------------- ECS Cluster ----------------------
resource "aws_ecs_cluster" "main" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled" # Enables CloudWatch Container Insights
  }

  tags = {
    Name = var.cluster_name
  }
}
