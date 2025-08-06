#!/bin/bash
# 🚀 AWS Setup Script for INVOXA

set -e

echo "🚀 INVOXA - AWS Infrastructure Setup Script"
echo "============================================="

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="857736875915"

echo ""
echo "📋 Pre-requisites Check:"
echo "========================"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    echo "   Please install AWS CLI v2: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
else
    echo "✅ AWS CLI found: $(aws --version)"
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured"
    echo "   Please run: aws configure"
    exit 1
else
    echo "✅ AWS credentials configured"
    CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    echo "   Account: $CURRENT_ACCOUNT"
    
    if [ "$CURRENT_ACCOUNT" != "$AWS_ACCOUNT_ID" ]; then
        echo "⚠️  Warning: Current account ($CURRENT_ACCOUNT) doesn't match expected account ($AWS_ACCOUNT_ID)"
    fi
fi

echo ""
echo "🪣 Creating S3 Buckets:"
echo "======================="

# Development bucket
DEV_BUCKET="inx-dev-terraform-state"
echo "Creating development bucket: $DEV_BUCKET"

if aws s3 ls "s3://$DEV_BUCKET" 2>/dev/null; then
    echo "✅ Bucket $DEV_BUCKET already exists"
else
    aws s3 mb "s3://$DEV_BUCKET" --region $AWS_REGION
    echo "✅ Created bucket: $DEV_BUCKET"
fi

# Enable versioning for dev bucket
aws s3api put-bucket-versioning \
    --bucket $DEV_BUCKET \
    --versioning-configuration Status=Enabled

echo "✅ Enabled versioning for $DEV_BUCKET"

# Production bucket
PROD_BUCKET="inx-prd-terraform-state"
echo "Creating production bucket: $PROD_BUCKET"

if aws s3 ls "s3://$PROD_BUCKET" 2>/dev/null; then
    echo "✅ Bucket $PROD_BUCKET already exists"
else
    aws s3 mb "s3://$PROD_BUCKET" --region $AWS_REGION
    echo "✅ Created bucket: $PROD_BUCKET"
fi

# Enable versioning for prod bucket
aws s3api put-bucket-versioning \
    --bucket $PROD_BUCKET \
    --versioning-configuration Status=Enabled

echo "✅ Enabled versioning for $PROD_BUCKET"

echo ""
echo "🔒 Creating DynamoDB Lock Tables:"
echo "================================="

# Development lock table
DEV_TABLE="inx-dev-tf-locks"
echo "Creating development lock table: $DEV_TABLE"

if aws dynamodb describe-table --table-name $DEV_TABLE --region $AWS_REGION &>/dev/null; then
    echo "✅ Table $DEV_TABLE already exists"
else
    aws dynamodb create-table \
        --table-name $DEV_TABLE \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $AWS_REGION
    
    # Wait for table to be active
    echo "⏳ Waiting for table to be active..."
    aws dynamodb wait table-exists --table-name $DEV_TABLE --region $AWS_REGION
    echo "✅ Created table: $DEV_TABLE"
fi

# Production lock table
PROD_TABLE="inx-prd-tf-locks"
echo "Creating production lock table: $PROD_TABLE"

if aws dynamodb describe-table --table-name $PROD_TABLE --region $AWS_REGION &>/dev/null; then
    echo "✅ Table $PROD_TABLE already exists"
else
    aws dynamodb create-table \
        --table-name $PROD_TABLE \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $AWS_REGION
    
    # Wait for table to be active
    echo "⏳ Waiting for table to be active..."
    aws dynamodb wait table-exists --table-name $PROD_TABLE --region $AWS_REGION
    echo "✅ Created table: $PROD_TABLE"
fi

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "📋 Summary:"
echo "- S3 Buckets:"
echo "  • Development: s3://$DEV_BUCKET (versioning enabled)"
echo "  • Production:  s3://$PROD_BUCKET (versioning enabled)"
echo ""
echo "- DynamoDB Tables:"
echo "  • Development: $DEV_TABLE"
echo "  • Production:  $PROD_TABLE"
echo ""
echo "🚀 Next Steps:"
echo "1. Ensure Jenkins has AWS credentials with ID: 'aws-jenkins-credentials'"
echo "2. Install Docker Plugin in Jenkins"
echo "3. Create Jenkins jobs pointing to cicd/release branches"
echo "4. Run terraform plan to validate configuration"
echo ""
echo "💡 Test your setup:"
echo "   cd terraform"
echo "   terraform init -backend-config=\"bucket=$DEV_BUCKET\" -backend-config=\"key=terraform.tfstate\" -backend-config=\"region=$AWS_REGION\" -backend-config=\"dynamodb_table=$DEV_TABLE\""
echo "   terraform plan -var-file=dev.tfvars"
