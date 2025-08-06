## === modules/s3/main.tf ===

# S3 bucket for invoice documents and attachments
resource "aws_s3_bucket" "invoxa_documents" {
  bucket = "${var.prefix}invoxa-documents-${random_id.bucket_suffix.hex}"

  tags = var.tags
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_versioning" "invoxa_documents" {
  bucket = aws_s3_bucket.invoxa_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "invoxa_documents" {
  bucket = aws_s3_bucket.invoxa_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "invoxa_documents" {
  bucket = aws_s3_bucket.invoxa_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "invoxa_documents" {
  bucket = aws_s3_bucket.invoxa_documents.id

  rule {
    id     = "invoice_lifecycle"
    status = "Enabled"
    
    filter {
      prefix = ""
    }

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555  # 7 years for compliance
    }
  }
}