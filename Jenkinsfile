pipeline {
    agent any
    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_NAME = "punkk/weather-dashboard"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ./backend"
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh "echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh "sudo kubectl apply -f k8s/mongo-deployment.yaml"
                sh "sudo kubectl apply -f k8s/app-deployment.yaml"
                sh "sudo kubectl rollout restart deployment/weather-app"
            }
        }
        stage('Verify Deployment') {
            steps {
                sh "sudo kubectl get pods"
                sh "sudo kubectl get services"
            }
        }
    }
    post {
        success { echo 'Deployed to Kubernetes successfully!' }
        failure  { echo 'Deployment failed. Check logs.' }
    }
}