## === root/providers.tf ===

provider "aws" {
  region = var.aws_region
}

## === root/backend.tf ===

terraform {
  backend "s3" {
    bucket         = "inx-dev-terraform-state-9015480"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "inx-dev-tf-locks"
    encrypt        = true
  }
}