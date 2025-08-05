output "repository_urls" {
  description = "ECR repository URLs for all microservices"
  value       = { for name, repo in aws_ecr_repository.services : name => repo.repository_url }
}
