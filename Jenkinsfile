pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "ca-central-1" // deployment region
        TF_BACKEND_REGION  = "us-east-1"    // backend state region
        AWS_ACCOUNT_ID     = "857736875915"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature/pipeline-lambda', url: 'https://github.com/rishhi-patel/invoxa.git'
            }
        }

        stage('Terraform Init & Plan') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-credentials']]) {
                    script {
                        sh """
                        cd infra/shared-api
                        terraform init \
                          -backend-config="bucket=invoxa-tfstate-${AWS_ACCOUNT_ID}" \
                          -backend-config="key=terraform.tfstate" \
                          -backend-config="region=${TF_BACKEND_REGION}" \
                          -backend-config="dynamodb_table=invoxa-terraform-locks"
                        """

                        // Run terraform plan and capture exit code without failing
                        def exitCode = sh(
                            returnStatus: true,
                            script: """
                            cd infra/shared-api
                            terraform plan -var-file=dev.ca.tfvars -detailed-exitcode -out=tfplan
                            """
                        )

                        if (exitCode == 2) {
                            echo "🔄 Infra changes detected"
                            env.INFRA_CHANGED = "true"
                            currentBuild.description = "Infra changes detected"
                        } else if (exitCode == 0) {
                            echo "✅ No infra changes"
                            env.INFRA_CHANGED = "false"
                            currentBuild.description = "No infra changes"
                        } else {
                            error("❌ Terraform plan failed with exit code ${exitCode}")
                        }
                    }
                }
            }
        }

        stage('Terraform Apply') {
            when {
                expression { env.INFRA_CHANGED == "true" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-credentials']]) {
                    sh """
                    cd infra/shared-api
                    terraform apply -var-file=dev.ca.tfvars -auto-approve tfplan
                    """
                }
            }
        }

        stage('Build & Push Docker Images') {
            when {
                expression { env.INFRA_CHANGED == "false" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-credentials']]) {
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
        }

        stage('Update Lambda Functions') {
            when {
                expression { env.INFRA_CHANGED == "false" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-jenkins-credentials']]) {
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
}
