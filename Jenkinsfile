pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = "us-east-1" // deployment region
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

                        // Login to ECR Public (for base images) and to your private ECR
                        sh """
                        set -e
                        aws ecr-public get-login-password --region us-east-1 \
                          | docker login --username AWS --password-stdin public.ecr.aws
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} \
                          | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com
                        """

                        // Ensure repos exist, then build & push
                        services.each { svc ->
                            def key = svc.replace('-service','')                 // "auth-service" -> "auth"
                            def repo = "invoxa-dev-${key}"                      // matches Terraform image_uris
                            sh """
                            set -e
                            aws ecr describe-repositories --repository-names ${repo} --region ${AWS_DEFAULT_REGION} >/dev/null 2>&1 \
                              || aws ecr create-repository --repository-name ${repo} --image-scanning-configuration scanOnPush=true --region ${AWS_DEFAULT_REGION}

                            cd microservices/${svc}
                            docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${repo}:latest .
                            docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${repo}:latest
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
                            def key = svc.replace('-service','')                 // "auth-service" -> "auth"
                            def name = "invoxa-dev-${key}"                      // Lambda function name
                            sh """
                            set -e
                            aws lambda update-function-code \
                              --function-name ${name} \
                              --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${name}:latest \
                              --region ${AWS_DEFAULT_REGION}
                            """
                        }
                    }
                }
            }
        }
    }
}
