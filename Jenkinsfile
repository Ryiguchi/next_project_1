pipeline {
  agent any
  stages {
    
    stage("Build image") {
      steps {
        sh "docker build -t next-app ."
      }
    }

    stage("Run Image") {
      steps{
            sh "docker run --rm -d --name next-app-dev next-app"
      }
    }

    stage("Health Check") {
      steps{
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
          sh "docker stop next-app-dev"
        }
        failure {
          sh "docker rm next-app-dev"
        }
    }
}