## === modules/ecr/outputs.tf ===

output "ecr_repository_urls" {
  description = "URLs of the Public ECR repositories"
  value       = { for k, v in aws_ecrpublic_repository.services : k => v.repository_uri }
}

output "ecr_repository_names" {
  description = "Names of the Public ECR repositories"
  value       = { for k, v in aws_ecrpublic_repository.services : k => v.repository_name }
}

output "ecr_registry_id" {
  description = "Registry ID for the Public ECR repositories"
  value       = values(aws_ecrpublic_repository.services)[0].registry_id
}