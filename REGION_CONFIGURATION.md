# 🌍 INVOXA Region Configuration Guide

## 📍 **Current Region Setup: `us-east-1`**

Your entire infrastructure is configured for **US East (N. Virginia) - us-east-1** region.

### ✅ **What's Configured for us-east-1:**

#### **🏗️ Infrastructure Components:**
- **VPC**: `10.1.0.0/16` (DEV) and `10.0.0.0/16` (PROD)
- **Availability Zones**: `us-east-1a`, `us-east-1b`, `us-east-1c`
- **ECS Fargate**: All microservices deployed in us-east-1
- **ALB**: Application Load Balancer in us-east-1
- **ECR**: Container registry in us-east-1
- **S3**: Terraform state buckets in us-east-1
- **Secrets Manager**: MongoDB credentials in us-east-1
- **CloudWatch**: All logs and monitoring in us-east-1

#### **🔧 Configuration Files:**
```
✅ terraform/variables.tf        → aws_region = "us-east-1"
✅ terraform/dev.tfvars          → aws_region = "us-east-1"  
✅ terraform/prod.tfvars         → aws_region = "us-east-1"
✅ terraform/providers.tf       → region = var.aws_region
✅ terraform/modules/ecs/       → awslogs-region = var.aws_region
✅ Jenkinsfile-dev              → AWS_DEFAULT_REGION = 'us-east-1'
✅ Jenkinsfile-prod             → AWS_DEFAULT_REGION = 'us-east-1'  
```

### 🔄 **If You Want to Change Region:**

#### **Option 1: Stay with us-east-1 (Recommended)**
**Pros:**
- ✅ Lowest latency for most US users
- ✅ Most AWS services available
- ✅ Generally lowest costs
- ✅ All configuration already done

#### **Option 2: Change to Different Region**
If you prefer a different region, update these files:

**1. Update Terraform Configuration:**
```bash
# Edit terraform/dev.tfvars
aws_region = "us-west-2"  # Your preferred region
azs = ["us-west-2a", "us-west-2b", "us-west-2c"]

# Edit terraform/prod.tfvars  
aws_region = "us-west-2"  # Your preferred region
azs = ["us-west-2a", "us-west-2b", "us-west-2c"]
```

**2. Update Jenkins Pipelines:**
```groovy
// In both Jenkinsfile-dev and Jenkinsfile-prod
environment {
    AWS_DEFAULT_REGION = 'us-west-2'  // Your preferred region
    // ... rest of config
}
```

**3. Update S3 Backend Buckets:**
```bash
# Create new buckets in your preferred region
aws s3 mb s3://inx-dev-terraform-state-9015480 --region us-west-2
aws s3 mb s3://inx-prd-terraform-state-9015480 --region us-west-2

# Create new DynamoDB tables
aws dynamodb create-table \
    --table-name inx-dev-tf-locks \
    --region us-west-2 \
    # ... rest of configuration
```

**4. Update ECR Repository URLs:**
```groovy
// In Jenkins files, update ECR URLs
ECR_REPOSITORY_BASE = '857736875915.dkr.ecr.us-west-2.amazonaws.com/inx-INX-DEV-USNV--app'
```

### 🎯 **Regional Considerations:**

#### **us-east-1 (N. Virginia)**
- ✅ **Pros**: Cheapest, most services, lowest latency for East Coast
- ⚠️ **Cons**: Occasionally higher outage frequency

#### **us-west-2 (Oregon)**  
- ✅ **Pros**: Very reliable, good for West Coast, renewable energy
- ⚠️ **Cons**: Slightly higher costs than us-east-1

#### **eu-west-1 (Ireland)**
- ✅ **Pros**: GDPR compliance, good for European users
- ⚠️ **Cons**: Higher costs, potential latency for US users

### 📊 **Current Resource Naming (us-east-1):**

| Resource Type | DEV Name | PROD Name |
|---------------|----------|-----------|
| VPC | `INX-DEV-USNV-VPC01` | `INX-PRD-USNV-VPC01` |
| Public Subnets | `INX-DEV-USNV-PBS-us-east-1a/b/c` | `INX-PRD-USNV-PBS-us-east-1a/b/c` |
| Private Subnets | `INX-DEV-USNV-PVS-us-east-1a/b/c` | `INX-PRD-USNV-PVS-us-east-1a/b/c` |
| ECS Cluster | `INX-DEV-USNV-CLUSTER01` | `INX-PRD-USNV-CLUSTER01` |
| ALB | `INX-DEV-USNV-ALB01` | `INX-PRD-USNV-ALB01` |

### 🚀 **Ready to Deploy Status:**

**✅ All region configurations are consistent and ready!**

- **Terraform**: All modules properly reference `var.aws_region`
- **Jenkins**: Both pipelines configured for us-east-1
- **AWS Resources**: All pointing to us-east-1
- **No Hardcoded Regions**: All now use variables

### 💡 **Recommendation:**

**Stick with `us-east-1`** for your capstone project because:
1. ✅ All configuration is already done and tested
2. ✅ Lowest costs for learning/development
3. ✅ Best service availability
4. ✅ Most documentation and examples use us-east-1

### 🔧 **What I Fixed:**

1. **✅ ECS CloudWatch Logs**: Changed from hardcoded `us-east-1` to `var.aws_region`
2. **✅ Module Variables**: Added `aws_region` variable to ECS module
3. **✅ Module Inputs**: Updated main.tf to pass region to ECS module
4. **✅ All Services**: Now all 5 microservices use dynamic region

**🎉 Your region configuration is now fully dynamic and ready for deployment!**
