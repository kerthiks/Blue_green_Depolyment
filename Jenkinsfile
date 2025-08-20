pipeline {
    agent any

    environment {
        BLUE_PORT = '8081'
        GREEN_PORT = '8082'
        IMAGE_NAME = 'your-app'
        DOCKER = '/opt/homebrew/bin/docker' // Full path to Docker for macOS
    }

    stages {
        stage('Check Docker') {
            steps {
                sh "${DOCKER} --version"
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "${DOCKER} build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy to Green') {
            steps {
                sh """
                    ${DOCKER} rm -f green || true
                    ${DOCKER} run -d --name green -p ${GREEN_PORT}:3000 ${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def status = sh(script: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:${GREEN_PORT}", returnStdout: true).trim()
                    if (status != "200") {
                        error("❌ Health check failed on green!")
                    } else {
                        echo "✅ Green deployment is healthy."
                    }
                }
            }
        }

        stage('Switch Traffic') {
            steps {
                sh """
                    echo "⚙️ Switching NGINX traffic from blue to green..."
                    sed -i '' 's/${BLUE_PORT}/${GREEN_PORT}/g' nginx/nginx.conf
                    sudo nginx -s reload
                """
            }
        }

        stage('Remove Old Version') {
            steps {
                sh """
                    echo "🧹 Cleaning up old (blue) container..."
                    ${DOCKER} rm -f blue || true
                    ${DOCKER} rename green blue
                """
            }
        }
    }

    post {
        failure {
            echo "❗ Deployment failed. Please check logs and roll back if necessary."
        }
        success {
            echo "🎉 Blue-Green deployment completed successfully!"
        }
    }
}
