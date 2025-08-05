# Create ECR repository for each microservice
resource "aws_ecr_repository" "services" {
  for_each = toset(var.services)

  name                 = each.key
  image_tag_mutability = "MUTABLE" # You can change to IMMUTABLE for strict versioning
  force_delete         = true      # Automatically delete images on repo deletion

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "${each.key}-repo"
  }
}
