terraform {
  backend "s3" {
    bucket         = "invoxa-tfstate-857736875915"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "invoxa-terraform-locks"
    encrypt        = true
  }
}
