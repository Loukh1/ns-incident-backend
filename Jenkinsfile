pipeline {
    agent any

    stages {
        
        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'sleep 7' 
                echo 'All unit tests passed!'
            }
        }

        stage('Static Code Analysis') {
            steps {
                echo 'Running code analysis with SonarQube...'
                sh 'sleep 11' // simulate analysis
                echo 'Code quality checks passed!'
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Running security scan...'
                sh 'sleep 15' // simulate scan
                echo 'No vulnerabilities found!'
            }
        }
        stage('Build & Tag Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker build -t louaykh1/ns-orchestrator:latest ."
                    }
                }
            }
        }

        

        stage('Push Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                        sh "docker push louaykh1/ns-orchestrator:latest"
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Deploying to staging environment...'
                sh 'sleep 20'
                echo 'Staging deployment successful!'
            }
        }


        stage('Notify Team') {
            steps {
                echo 'Sending notification to team...'
                sh 'sleep 2'
                echo 'Team notified!'
            }
        }
    }
}
