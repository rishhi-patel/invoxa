# 🚀 INVOXA Deployment Setup Guide

## 📋 Pre-Deployment Checklist

### ✅ **STEP 1: AWS Prerequisites**

#### 1.1 Create S3 Backend Buckets
```bash
# Development environment
aws s3 mb s3://inx-dev-terraform-state-9015480 --region us-east-1

# Production environment  
aws s3 mb s3://inx-prd-terraform-state-9015480 --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket inx-dev-terraform-state-9015480 \
    --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
    --bucket inx-prd-terraform-state-9015480 \
    --versioning-configuration Status=Enabled
```

#### 1.2 Create DynamoDB Lock Tables
```bash
# Development environment
aws dynamodb create-table \
    --table-name inx-dev-tf-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1

# Production environment
aws dynamodb create-table \
    --table-name inx-prd-tf-locks \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1
```

#### 1.3 Create IAM Roles for Jenkins
```bash
# Create trust policy for Jenkins
cat > jenkins-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::857736875915:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create development role
aws iam create-role \
    --role-name RINX_DEVAWS_JENKINS_ADM \
    --assume-role-policy-document file://jenkins-trust-policy.json

# Create production role
aws iam create-role \
    --role-name RINX_PRDAWS_JENKINS_ADM \
    --assume-role-policy-document file://jenkins-trust-policy.json

# Attach AdministratorAccess policy (or create custom policies)
aws iam attach-role-policy \
    --role-name RINX_DEVAWS_JENKINS_ADM \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess

aws iam attach-role-policy \
    --role-name RINX_PRDAWS_JENKINS_ADM \
    --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### ✅ **STEP 2: Jenkins Configuration**

#### 2.1 Install Required Jenkins Plugins
- AWS Credentials Plugin
- Docker Pipeline Plugin
- Pipeline Plugin
- Git Plugin
- Blue Ocean (optional)

#### 2.2 Configure AWS Credentials in Jenkins
1. Go to **Manage Jenkins** > **Manage Credentials**
2. Add credentials with ID: `aws-jenkins-credentials`
3. Use your AWS Access Key and Secret Key

#### 2.3 Create Jenkins Jobs

**For Development (cicd branch):**
```bash
# Job Name: invoxa-dev-pipeline
# Branch: cicd
# Pipeline Script: Use Jenkinsfile-dev from SCM
```

**For Production (release branch):**
```bash
# Job Name: invoxa-prod-pipeline  
# Branch: release
# Pipeline Script: Use Jenkinsfile-prod from SCM
```

### ✅ **STEP 3: Git Branch Setup**

#### 3.1 Create Required Branches
```bash
# Ensure you're on main
git checkout main

# Create and push cicd branch for development
git checkout -b cicd
git push -u origin cicd

# Create and push release branch for production
git checkout -b release
git push -u origin release
```

#### 3.2 Configure Branch Protection Rules
- Protect `release` branch
- Require pull request reviews
- Require status checks to pass

### ✅ **STEP 4: Validate Environment**

#### 4.1 Run Validation Script
```bash
# For development
./scripts/validate-deployment.sh dev us-east-1 857736875915

# For production
./scripts/validate-deployment.sh prod us-east-1 857736875915
```

#### 4.2 Test Terraform Configuration
```bash
# Test development
cd terraform
terraform init \
    -backend-config="bucket=inx-dev-terraform-state-9015480" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=us-east-1" \
    -backend-config="dynamodb_table=inx-dev-tf-locks"

terraform validate
terraform plan -var-file=dev.tfvars

# Test production
terraform init \
    -backend-config="bucket=inx-prd-terraform-state-9015480" \
    -backend-config="key=terraform.tfstate" \
    -backend-config="region=us-east-1" \
    -backend-config="dynamodb_table=inx-prd-tf-locks" \
    -reconfigure

terraform validate  
terraform plan -var-file=prod.tfvars
```

### ✅ **STEP 5: MongoDB Configuration**

#### 5.1 Update MongoDB Connection Secrets
```bash
# Store MongoDB credentials in AWS Secrets Manager
aws secretsmanager create-secret \
    --name "invoxa/dev/mongodb-credentials" \
    --description "MongoDB credentials for INVOXA DEV" \
    --secret-string '{
        "username": "your-mongo-username",
        "password": "your-mongo-password", 
        "host": "your-mongo-host",
        "port": "27017",
        "database": "invoxa_dev"
    }' \
    --region us-east-1

aws secretsmanager create-secret \
    --name "invoxa/prod/mongodb-credentials" \
    --description "MongoDB credentials for INVOXA PROD" \
    --secret-string '{
        "username": "your-mongo-username",
        "password": "your-mongo-password",
        "host": "your-mongo-host", 
        "port": "27017",
        "database": "invoxa_prod"
    }' \
    --region us-east-1
```

### ✅ **STEP 6: First Deployment**

#### 6.1 Development Environment
1. Push code to `cicd` branch
2. Trigger Jenkins job: `invoxa-dev-pipeline`
3. Select parameters:
   - **ACTION**: `plan` (first time)
   - **DEPLOY_CONTAINERS**: `false` (first time)
4. Review plan output
5. Run again with:
   - **ACTION**: `apply`
   - **DEPLOY_CONTAINERS**: `true`

#### 6.2 Production Environment  
1. Merge `cicd` to `release` branch
2. Trigger Jenkins job: `invoxa-prod-pipeline`
3. Select parameters:
   - **ACTION**: `plan`
   - **DEPLOYMENT_TICKET**: `PROD-001`
   - **APPROVED_BY**: `Your Name`
   - **DEPLOY_CONTAINERS**: `false`
4. Review plan output carefully
5. Run again with:
   - **ACTION**: `apply`
   - **DEPLOY_CONTAINERS**: `true`

## 🛠️ **Troubleshooting**

### Common Issues:

#### ❌ **"S3 bucket doesn't exist"**
```bash
# Create the missing bucket
aws s3 mb s3://bucket-name --region us-east-1
```

#### ❌ **"DynamoDB table doesn't exist"**
```bash
# Create the missing table
aws dynamodb create-table \
    --table-name table-name \
    --attribute-definitions AttributeName=LockID,AttributeType=S \
    --key-schema AttributeName=LockID,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

#### ❌ **"Access denied" errors**
- Check IAM role permissions
- Verify AWS credentials in Jenkins
- Ensure trust policy allows Jenkins to assume roles

#### ❌ **"ECR repository doesn't exist"**
- This is normal - Terraform will create it
- If manual creation needed: `aws ecr create-repository --repository-name repo-name`

#### ❌ **"Docker build fails"**
- Check Dockerfile syntax
- Ensure all dependencies are available
- Verify base images are accessible

## 📈 **Monitoring & Maintenance**

### Health Checks:
- Monitor ECS service health in AWS Console
- Check ALB target group health
- Monitor CloudWatch logs for application errors

### Regular Tasks:
- Review Terraform plan outputs before applying
- Monitor AWS costs and usage
- Update container images regularly
- Review security group rules

### Security Best Practices:
- Rotate AWS credentials regularly
- Use least-privilege IAM policies
- Enable CloudTrail for audit logging
- Monitor security groups for unnecessary open ports

## 🎯 **Next Steps**

1. ✅ Complete all prerequisites
2. ✅ Run validation script
3. ✅ Test development deployment
4. ✅ Test production deployment
5. ✅ Set up monitoring and alerting
6. ✅ Document any environment-specific configurations

---

**🚨 IMPORTANT REMINDERS:**

- **NEVER** skip approvals for production deployments
- **ALWAYS** test changes in development first
- **VERIFY** Terraform plans before applying
- **BACKUP** important data before destructive operations
- **MONITOR** deployments for issues

**📞 Support:** Contact your DevOps team for assistance with setup or issues.
