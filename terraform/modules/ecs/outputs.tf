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

output "auth_service_task_definition_arn" {
  value = aws_ecs_task_definition.auth_service.arn
}

output "client_service_task_definition_arn" {
  value = aws_ecs_task_definition.client_service.arn
}

output "invoice_service_task_definition_arn" {
  value = aws_ecs_task_definition.invoice_service.arn
}

output "notification_service_task_definition_arn" {
  value = aws_ecs_task_definition.notification_service.arn
}

output "payment_service_task_definition_arn" {
  value = aws_ecs_task_definition.payment_service.arn
}