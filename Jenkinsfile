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
            sh "docker run -rm -d -p 3000:3000 --name next-app-dev next-app"
      }
    }

    stage("Health Check") {
      steps{
          sh "docker exec -it next-app-dev ./scripts/health_check.sh"
      }
    }

    stage("Remove Container") {
      steps{
          sh "docker stop next-app-dev"
      }
    }
    
  
  }
}