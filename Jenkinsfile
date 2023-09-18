pipeline {
  agent any
  stages {
    stage("Show workspace") {
      steps {
        sh "ls"
      }
    }
    stage("Install") {
      steps{
          script {
            sh "docker ps"
          }
      }
    }
  
  }
}