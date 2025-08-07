## === root/main.tf ===

# BACKEND MODULE - COMMENTED OUT - S3/DynamoDB managed externally via Jenkins
# module "backend" {
#   source          = "./modules/backend"
#   bucket_name     = var.bucket_name
#   lock_table_name = var.lock_table_name
#   tags            = var.tags
# }

module "vpc" {
  source               = "./modules/vpc"
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  azs                  = var.azs
  name_prefix          = var.prefix
  tags                 = var.tags
}

module "security_groups" {
  source = "./modules/security_groups"
  vpc_id = module.vpc.vpc_id
  tags   = var.tags
  prefix = var.prefix
}

module "ecs" {
  source                      = "./modules/ecs"
  prefix                      = var.prefix
  tags                        = var.tags
  aws_region                  = var.aws_region
  vpc_id                      = module.vpc.vpc_id
  private_subnet_ids          = module.vpc.private_subnet_ids
  ecs_sg_id                   = module.security_groups.ecs_sg_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
}

module "iam" {
  source = "./modules/iam"
  prefix = var.prefix
  tags   = var.tags
}

module "alb" {
  source            = "./modules/alb"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  alb_sg_id         = module.security_groups.alb_sg_id
  prefix            = var.prefix
  tags              = var.tags
}

module "ecr" {
  source = "./modules/ecr"
  prefix = var.prefix
  tags   = var.tags
}

# RDS MODULE - COMMENTED OUT - USING EXTERNAL MONGODB INSTEAD
# module "rds" {
#   source                = "./modules/rds"
#   prefix                = var.prefix
#   tags                  = var.tags
#   private_subnet_ids    = module.vpc.private_subnet_ids
#   db_security_group_id  = module.security_groups.rds_sg_id
#   db_password           = var.db_password != "" ? var.db_password : "ChangeMe123!"
# }

module "s3" {
  source = "./modules/s3"
  prefix = var.prefix
  tags   = var.tags
}

module "secrets" {
  source = "./modules/secrets"
  prefix = var.prefix
  tags   = var.tags
  # Using external MongoDB - storing connection string instead
  mongodb_uri       = var.mongodb_uri != "" ? var.mongodb_uri : "mongodb://localhost:27017/invoxa"
  database_name     = var.database_name
  jwt_secret        = var.jwt_secret != "" ? var.jwt_secret : "default-jwt-secret"
  stripe_secret_key = var.stripe_secret_key
  sendgrid_api_key  = var.sendgrid_api_key
}
