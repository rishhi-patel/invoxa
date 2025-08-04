#!/bin/bash
# Deployment Validation Script for INVOXA Jenkins Pipeline

set -e

ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-1}
AWS_ACCOUNT_ID=${3:-857736875915}

echo "🔍 Validating deployment readiness for environment: $ENVIRONMENT"
echo "📍 AWS Region: $AWS_REGION"
echo "🏢 AWS Account ID: $AWS_ACCOUNT_ID"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Function to check if command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ $1 is available${NC}"
    fi
}

# Function to check AWS CLI access
check_aws_access() {
    echo -e "\n🔐 Checking AWS CLI access..."
    
    if aws sts get-caller-identity &> /dev/null; then
        echo -e "${GREEN}✅ AWS CLI authentication successful${NC}"
        CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        echo "📋 Current AWS Account: $CURRENT_ACCOUNT"
        
        if [ "$CURRENT_ACCOUNT" != "$AWS_ACCOUNT_ID" ]; then
            echo -e "${YELLOW}⚠️  Warning: Current account ($CURRENT_ACCOUNT) doesn't match expected ($AWS_ACCOUNT_ID)${NC}"
        fi
    else
        echo -e "${RED}❌ AWS CLI authentication failed${NC}"
        ((ERRORS++))
    fi
}

# Function to check ECR repositories
check_ecr_repos() {
    echo -e "\n🐳 Checking ECR repositories..."
    
    REPO_NAME="inx-INX-${ENVIRONMENT^^}-USNV--app"
    
    if aws ecr describe-repositories --repository-names "$REPO_NAME" --region "$AWS_REGION" &> /dev/null; then
        echo -e "${GREEN}✅ ECR repository exists: $REPO_NAME${NC}"
    else
        echo -e "${YELLOW}⚠️  ECR repository doesn't exist: $REPO_NAME${NC}"
        echo "   This will be created by Terraform during deployment"
    fi
}

# Function to check S3 backend bucket
check_s3_backend() {
    echo -e "\n🪣 Checking Terraform backend S3 bucket..."
    
    BUCKET_NAME="inx-${ENVIRONMENT}-terraform-state-9015480"
    
    if aws s3 ls "s3://$BUCKET_NAME" &> /dev/null; then
        echo -e "${GREEN}✅ S3 backend bucket exists: $BUCKET_NAME${NC}"
    else
        echo -e "${RED}❌ S3 backend bucket doesn't exist: $BUCKET_NAME${NC}"
        echo "   Please create this bucket before running Terraform"
        ((ERRORS++))
    fi
}

# Function to check DynamoDB lock table
check_dynamodb_locks() {
    echo -e "\n🔒 Checking DynamoDB lock table..."
    
    TABLE_NAME="inx-${ENVIRONMENT}-tf-locks"
    
    if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$AWS_REGION" &> /dev/null; then
        echo -e "${GREEN}✅ DynamoDB lock table exists: $TABLE_NAME${NC}"
    else
        echo -e "${RED}❌ DynamoDB lock table doesn't exist: $TABLE_NAME${NC}"
        echo "   Please create this table before running Terraform"
        ((ERRORS++))
    fi
}

# Function to check Docker
check_docker() {
    echo -e "\n🐳 Checking Docker..."
    
    if docker info &> /dev/null; then
        echo -e "${GREEN}✅ Docker is running${NC}"
    else
        echo -e "${RED}❌ Docker is not running or not accessible${NC}"
        ((ERRORS++))
    fi
}

# Function to check Terraform files
check_terraform_files() {
    echo -e "\n📋 Checking Terraform configuration..."
    
    if [ -f "terraform/main.tf" ]; then
        echo -e "${GREEN}✅ main.tf exists${NC}"
    else
        echo -e "${RED}❌ main.tf not found${NC}"
        ((ERRORS++))
    fi
    
    if [ -f "terraform/${ENVIRONMENT}.tfvars" ]; then
        echo -e "${GREEN}✅ ${ENVIRONMENT}.tfvars exists${NC}"
    else
        echo -e "${RED}❌ ${ENVIRONMENT}.tfvars not found${NC}"
        ((ERRORS++))
    fi
    
    # Check if all microservice Dockerfiles exist
    MICROSERVICES=("auth-service" "client-service" "invoice-service" "notification-service" "payment-service")
    
    echo -e "\n🐳 Checking microservice Dockerfiles..."
    for service in "${MICROSERVICES[@]}"; do
        if [ -f "microservices/$service/Dockerfile" ]; then
            echo -e "${GREEN}✅ $service Dockerfile exists${NC}"
        else
            echo -e "${RED}❌ $service Dockerfile missing${NC}"
            ((ERRORS++))
        fi
    done
}

# Function to validate IAM roles
check_iam_roles() {
    echo -e "\n👤 Checking IAM roles..."
    
    ROLE_NAME="RINX_${ENVIRONMENT^^}AWS_JENKINS_ADM"
    
    if aws iam get-role --role-name "$ROLE_NAME" &> /dev/null; then
        echo -e "${GREEN}✅ IAM role exists: $ROLE_NAME${NC}"
    else
        echo -e "${YELLOW}⚠️  IAM role doesn't exist: $ROLE_NAME${NC}"
        echo "   This should be created manually or through separate IAM setup"
    fi
}

# Main validation
echo "🚀 Starting deployment validation..."

echo -e "\n📦 Checking required tools..."
check_command "aws"
check_command "docker"
check_command "terraform"
check_command "git"

check_aws_access
check_s3_backend
check_dynamodb_locks
check_ecr_repos
check_iam_roles
check_docker
check_terraform_files

echo -e "\n📊 Validation Summary:"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s). Please fix them before deployment.${NC}"
    exit 1
fi
