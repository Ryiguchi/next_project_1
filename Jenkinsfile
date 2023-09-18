pipeline {
  agent any
  stages {
    
    stage("Build image") {
      steps {
        sh "docker build -t next-app ."
      }
    }

    stage("Remove image if present") {
      steps{
          catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
            sh "docker rm next-app-dev"
          }
      }
    }

    stage("Run Image") {
      steps{
            sh "docker run --rm -d --name next-app-dev next-app"
      }
    }

    stage("Health Check") {
      steps{
          sh "chmod +x scripts/health_check.sh"
          sh "docker exec next-app-dev ./scripts/health_check.sh"
      }
    }

    stage("Remove Container") {
      steps{
          sh "docker stop next-app-dev"
      }
    }
  }

  post {
        failure {
          script {
            sh "docker stop next-app-dev"
          }
          script {
            sh "docker rm next-app-dev"
            
          }
        }
    }
}