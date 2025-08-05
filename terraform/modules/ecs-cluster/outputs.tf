
output "cluster_id" {
  description = "The ECS cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "The ECS cluster name"
  value       = aws_ecs_cluster.main.name
}
