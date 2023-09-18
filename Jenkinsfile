pipeline {
  agent any
  stages {
    stage("Show workspace") {
      steps {
        sh "ls"
      }
    }
    stage("Show Directory") {
      steps{
          sh "pwd"
      }
    }
    stage("Build and run docker image") {
      steps{
          script {
            sh "docker compose up"
          }
      }
    }
  
  }
}