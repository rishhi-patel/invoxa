## === modules/ecr/main.tf ===

# Public ECR repository (free tier)
resource "aws_ecrpublic_repository" "this" {
  repository_name = var.repo_name

  catalog_data {
    description = "INVOXA ${upper(split("-", var.repo_name)[1])} Environment - Container Images"
    about_text  = "Container images for INVOXA microservices application"
    usage_text  = "docker pull public.ecr.aws/${data.aws_caller_identity.current.account_id}/${var.repo_name}:latest"
    
    architectures     = ["x86-64"]
    operating_systems = ["Linux"]
  }

  tags = var.tags
}

# Get current AWS account ID
# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Note: Public ECR repositories don't support lifecycle policies
# Images in public repositories don't incur storage costs like private ECR