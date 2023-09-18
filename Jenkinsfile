pipeline {
  agent {
    dockerfile true
  }
  stages {
    
    stage("Check node version") {
      
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