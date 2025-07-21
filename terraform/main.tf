provider "aws" {
  region  = "us-east-1"
  profile = "invoxa-dev"
}

module "client_dynamodb_table" {
  source      = "./modules/dynamodb_client"
  table_name  = "invoxa_clients"
  environment = "dev"
}
