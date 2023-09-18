pipeline {
  agent any
  stages {
    
    stage("Build image") {
      // agent {
      //   dockerfile true
      // }
      steps {
        sh "docker compose up"
      }
    }
    stage("Install") {
      steps{
          script {
            sh "echo 'nothing special'"
          }
      }
    }
    
  
  }
}