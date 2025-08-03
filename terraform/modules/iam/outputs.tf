## === modules/iam/outputs.tf ===

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_execution_role_name" {
  value = aws_iam_role.ecs_task_execution.name
}

output "ecs_task_role_arn" {
  value = aws_iam_role.ecs_task_role.arn
}

output "ecs_task_role_name" {
  value = aws_iam_role.ecs_task_role.name
}
