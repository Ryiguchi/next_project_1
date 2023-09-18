pipeline {
  agent any
  stages {
    
    stage("Check node version") {
      agent {
    dockerfile true
  }
      steps {
        sh "node -version"
      }
    }
    stage("Install") {
      steps{
          script {
            sh "nothing"
          }
      }
    }
  
  }
}