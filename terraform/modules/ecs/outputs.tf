## === modules/ecs/outputs.tf ===

output "cluster_id" {
  value = aws_ecs_cluster.this.id
}

output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.ecs_log_group.name
}