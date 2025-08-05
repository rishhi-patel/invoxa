output "service_names" {
  description = "Deployed ECS service names"
  value       = keys(aws_ecs_service.service)
}

output "service_target_groups" {
  description = "Target Group ARNs for all ECS services"
  value       = { for k, tg in aws_lb_target_group.service_tg : k => tg.arn }
}
