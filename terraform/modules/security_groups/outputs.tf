output "ecs_sg_id" {
  value = aws_security_group.ecs_sg.id
}

output "alb_sg_id" {
  value = aws_security_group.alb_sg.id
}

# RDS Security Group output - COMMENTED OUT - USING EXTERNAL MONGODB
# output "rds_sg_id" {
#   value = aws_security_group.rds_sg.id
# }
