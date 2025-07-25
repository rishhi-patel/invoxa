## === root/main.tf ===

#module "backend" {
#  source          = "./modules/backend"
#  bucket_name     = var.bucket_name
#  lock_table_name = var.lock_table_name
#  tags            = var.tags
#}

module "vpc" {
  source              = "./modules/vpc"
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  azs                 = var.azs
  name_prefix         = var.prefix
  tags                = var.tags
}

module "security_groups" {
  source       = "./modules/security_groups"
  vpc_id       = module.vpc.vpc_id
  tags         = var.tags
  prefix       = var.prefix
}

module "ecs" {
  source = "./modules/ecs"
  prefix = var.prefix
  tags   = var.tags
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
  source      = "./modules/ecr"
  repo_name   = "inx-${var.prefix}-app"
  prefix      = var.prefix
  tags        = var.tags
}
