## === modules/ecr/outputs.tf ===

output "ecr_repository_url" {
  description = "URL of the Public ECR repository"
  value       = aws_ecrpublic_repository.this.repository_uri
}

output "ecr_repository_name" {
  description = "Name of the Public ECR repository"
  value       = aws_ecrpublic_repository.this.repository_name
}

output "ecr_registry_id" {
  description = "Registry ID for the Public ECR repository"
  value       = aws_ecrpublic_repository.this.registry_id
}