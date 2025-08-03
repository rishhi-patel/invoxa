## === modules/rds/main.tf ===
## RDS MODULE - COMMENTED OUT - USING EXTERNAL MONGODB INSTEAD

# # DB Subnet Group
# resource "aws_db_subnet_group" "this" {
#   name       = "${var.prefix}db-subnet-group"
#   subnet_ids = var.private_subnet_ids

#   tags = merge(var.tags, {
#     Name = "${var.prefix}DB-SubnetGroup"
#   })
# }

# # RDS Parameter Group
# resource "aws_db_parameter_group" "this" {
#   family = "mysql8.0"
#   name   = "${var.prefix}db-params"

#   parameter {
#     name  = "innodb_buffer_pool_size"
#     value = "{DBInstanceClassMemory*3/4}"
#   }

#   tags = var.tags
# }

# # RDS Instance
# resource "aws_db_instance" "this" {
#   identifier     = "${var.prefix}invoxa-db"
#   engine         = "mysql"
#   engine_version = "8.0"
#   instance_class = var.db_instance_class
  
#   allocated_storage     = var.allocated_storage
#   max_allocated_storage = var.max_allocated_storage
#   storage_type          = "gp2"
#   storage_encrypted     = true

#   db_name  = var.db_name
#   username = var.db_username
#   password = var.db_password

#   vpc_security_group_ids = [var.db_security_group_id]
#   db_subnet_group_name   = aws_db_subnet_group.this.name
#   parameter_group_name   = aws_db_parameter_group.this.name

#   backup_retention_period = 7
#   backup_window          = "03:00-04:00"
#   maintenance_window     = "sun:04:00-sun:05:00"

#   skip_final_snapshot = true
#   deletion_protection = false

#   tags = merge(var.tags, {
#     Name = "${var.prefix}InvoxaDB"
#   })
# }
