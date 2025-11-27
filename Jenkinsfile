pipeline {
    agent any

    stages {
        stage('Pre-Deployment Checks') {
            steps {
                echo 'Checking cluster health and namespace readiness...'
                sh 'sleep 3' // simulate checks
                echo 'Pre-deployment checks passed!'
            }
        }

        stage('Deploy To Kubernetes') {
            steps {
                withKubeCredentials(kubectlCredentials: [[
                    caCertificate: '', 
                    clusterName: 'kubernetes', 
                    contextName: '', 
                    credentialsId: 'k8s-token', 
                    namespace: 'webapps', 
                    serverUrl: 'https://192.168.228.134:6443'
                ]]) {
                    sh 'sleep 23'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withKubeCredentials(kubectlCredentials: [[
                    caCertificate: '', 
                    clusterName: 'kubernetes', 
                    contextName: '', 
                    credentialsId: 'k8s-token', 
                    namespace: 'webapps', 
                    serverUrl: 'https://192.168.228.134:6443'
                ]]) {
                    sh 'sleep 5' // simulate verification
                }
                echo 'Deployment verified successfully!'
            }
        }

        stage('Rollout Status') {
            steps {
                echo 'Checking rollout status of pods...'
                sh 'sleep 3' // simulate rollout check
                echo 'All pods are running!'
            }
        }



        stage('Notify Team') {
            steps {
                echo 'Sending deployment notification to Slack/email...'
                sh 'sleep 2'
                echo 'Team notified!'
            }
        }
    }
}
