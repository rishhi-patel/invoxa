## === root/outputs.tf ===

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "cluster_name" {
  value = module.ecs.cluster_name
}

output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "ecr_repo_url" {
  value = module.ecr.ecr_repository_url
}

# Database endpoint - COMMENTED OUT - USING EXTERNAL MONGODB
# output "database_endpoint" {
#   value     = module.rds.db_endpoint
#   sensitive = true
# }

output "s3_bucket_name" {
  value = module.s3.documents_bucket_id
}

output "secrets_mongodb_credentials_arn" {
  value = module.secrets.mongodb_credentials_secret_arn
}

output "secrets_jwt_secret_arn" {
  value = module.secrets.jwt_secret_arn
}

output "task_execution_role_arn" {
  value = module.iam.ecs_task_execution_role_arn
}

output "task_role_arn" {
  value = module.iam.ecs_task_role_arn
}

# Required outputs for Jenkins CI/CD pipeline
output "private_subnet_ids" {
  value       = module.vpc.private_subnet_ids
  description = "Private subnet IDs for ECS service deployment"
}

output "public_subnet_ids" {
  value       = module.vpc.public_subnet_ids
  description = "Public subnet IDs for ALB"
}

output "ecs_security_group_id" {
  value       = module.security_groups.ecs_sg_id
  description = "Security group ID for ECS tasks"
}

output "alb_security_group_id" {
  value       = module.security_groups.alb_sg_id
  description = "Security group ID for Application Load Balancer"
}
