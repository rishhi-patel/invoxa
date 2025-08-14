pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ca-central-1" // deployment region
        TF_BACKEND_REGION  = "us-east-1"    // backend state region
        AWS_ACCOUNT_ID     = credentials('aws-account-id') // store this in Jenkins creds
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/rishhi-patel/invoxa.git'
            }
        }

        stage('Terraform Init') {
            steps {
                sh """
                cd infra
                terraform init \
                  -backend-config="bucket=invoxa-tfstate-${AWS_ACCOUNT_ID}" \
                  -backend-config="key=terraform.tfstate" \
                  -backend-config="region=${TF_BACKEND_REGION}" \
                  -backend-config="dynamodb_table=invoxa-terraform-locks"
                """
            }
        }

        stage('Terraform Plan') {
            steps {
                script {
                    def planResult = sh(
                        script: """
                        cd infra
                        terraform plan -detailed-exitcode -out=tfplan
                        """,
                        returnStatus: true
                    )

                    if (planResult == 2) {
                        currentBuild.description = "Infra changes detected"
                        env.INFRA_CHANGED = "true"
                    } else {
                        currentBuild.description = "No infra changes"
                        env.INFRA_CHANGED = "false"
                    }
                }
            }
        }

        stage('Terraform Apply') {
            when {
                expression { env.INFRA_CHANGED == "true" }
            }
            steps {
                sh """
                cd infra
                terraform apply -auto-approve tfplan
                """
            }
        }

        stage('Build & Push Docker Images') {
            when {
                expression { env.INFRA_CHANGED == "false" }
            }
            steps {
                script {
                    def services = ["auth-service", "client-service", "invoice-service", "payment-service", "insights-service"]

                    services.each { svc ->
                        sh """
                        cd microservices/${svc}
                        docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${svc}:latest .
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${svc}:latest
                        cd ../../
                        """
                    }
                }
            }
        }

        stage('Update Lambda Functions') {
            when {
                expression { env.INFRA_CHANGED == "false" }
            }
            steps {
                script {
                    def services = ["auth-service", "client-service", "invoice-service", "payment-service", "insights-service"]

                    services.each { svc ->
                        sh """
                        aws lambda update-function-code \
                            --function-name ${svc} \
                            --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${svc}:latest \
                            --region ${AWS_DEFAULT_REGION}
                        """
                    }
                }
            }
        }
    }
}
