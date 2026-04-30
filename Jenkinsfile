pipeline {
    agent any
    environment {
        WEATHER_API_KEY = credentials('weather-api-key')
    }
    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/YOUR_GITHUB_USERNAME/weather-dashboard.git'
            }
        }
        stage('Build & Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d --build'
            }
        }
        stage('Health Check') {
            steps {
                sh 'sleep 8 && curl -f http://localhost:3000 || exit 1'
            }
        }
    }
    post {
        success { echo 'Deployment successful!' }
        failure  { echo 'Deployment failed. Check logs.' }
    }
}