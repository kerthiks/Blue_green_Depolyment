pipeline {
    agent any

    environment {
        BLUE_PORT = '8081'
        GREEN_PORT = '8082'
    }

    stages {
        stage('Checkout') {
            steps {
                // Explicitly specify the main branch here
                git branch: 'main', url: 'https://github.com/kerthiks/Blue_green_Depolyment.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("your-app:${BUILD_NUMBER}")
                }
            }
        }

        stage('Deploy to Green') {
            steps {
                script {
                    sh "docker rm -f green || true"
                    sh "docker run -d --name green -p ${GREEN_PORT}:3000 your-app:${BUILD_NUMBER}"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def status = sh(script: "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:${GREEN_PORT}", returnStdout: true).trim()
                    if (status != "200") {
                        error("Health check failed!")
                    }
                }
            }
        }

        stage('Switch Traffic') {
            steps {
                script {
                    // Use macOS compatible sed command for in-place replacement
                    sh """
                    sed -i '' 's/${BLUE_PORT}/${GREEN_PORT}/' nginx/nginx.conf
                    nginx -s reload
                    """
                }
            }
        }

        stage('Remove Old Version') {
            steps {
                script {
                    sh "docker rm -f blue || true"
                    sh "docker rename green blue"
                }
            }
        }
    }
}
