pipeline {
    agent any

    stages {
        stage('Deploy To Kubernetes') {
            steps {
                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8s-token', namespace: 'webapps', serverUrl: 'https://192.168.228.134:6443']]) {
                    sh "kubectl apply -f deployment.yml"
                    
                }
            }
        }
        
        stage('verify Deployment') {
            steps {
                withKubeCredentials(kubectlCredentials: [[caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8s-token', namespace: 'webapps', serverUrl: 'https://192.168.228.134:6443']]) {
                    sh "kubectl get svc -n webapps"
                }
            }
        }
    }
}
