## === modules/s3/outputs.tf ===

output "documents_bucket_id" {
  description = "ID of the documents S3 bucket"
  value       = aws_s3_bucket.invoxa_documents.id
}

output "documents_bucket_arn" {
  description = "ARN of the documents S3 bucket"
  value       = aws_s3_bucket.invoxa_documents.arn
}

output "documents_bucket_domain_name" {
  description = "Domain name of the documents S3 bucket"
  value       = aws_s3_bucket.invoxa_documents.bucket_domain_name
}