## === modules/ecr/main.tf ===

# Public ECR repositories (free tier) - one for each microservice
locals {
  services = ["auth-service", "client-service", "invoice-service", "notification-service", "payment-service"]
}

resource "aws_ecrpublic_repository" "services" {
  for_each = toset(local.services)
  
  repository_name = "${lower(replace(var.prefix, "-", ""))}${each.value}"

  catalog_data {
    description = "INVOXA ${upper(replace(var.prefix, "-", ""))} Environment - ${each.value} Container Images"
    about_text  = "Container images for INVOXA microservices application - ${each.value}"
    usage_text  = "docker pull public.ecr.aws/${data.aws_caller_identity.current.account_id}/${lower(replace(var.prefix, "-", ""))}${each.value}:latest"
    
    architectures     = ["x86-64"]
    operating_systems = ["Linux"]
  }

  tags = merge(var.tags, {
    Service = each.value
  })
}

# Get current AWS account ID
# Get current AWS account ID
data "aws_caller_identity" "current" {}

# Note: Public ECR repositories don't support lifecycle policies
# Images in public repositories don't incur storage costs like private ECR