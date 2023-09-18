pipeline {
  agent any
  stages {
    stage("Show workspace") {
      steps {
        sh "ls"
      }
    }
    stage("Build and run docker image") {
      steps{
          script {
            sh "sudo docker compose up"
          }
      }
    }
  
  }
}