pipeline {
  agent any
  stages {
    
    stage("Build image") {
      steps {
        sh "docker build -t next-app ."
      }
    }

    // stage("Remove image if present") {
    //   steps{
    //       catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
    //         sh "docker rm next-app-dev"
    //       }
    //   }
    // }

    stage("Run Image") {
      steps{
            sh "docker run --rm -d -p 4000:3000 --name next-app-dev next-app"
      }
    }

    stage("Health Check") {
      steps{
        script {
            def listeningPorts = sh (
                script: "ss -tuln | awk '{print \$4}' | cut -d':' -f2 | grep -E '^[0-9]+$'",
                returnStdout: true
            ).trim()
            echo "Listening Ports: ${listeningPorts}"
        }
        script {
          def response = sh (
                script: """
                    response=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

                    if [ "\$response" = "200" ]; then
                        echo "Website is up and running."
                        exit 0  # Success
                    else
                        echo "Website is not responding as expected (HTTP \$response)"
                        exit 1  # Failure
                    fi
                """,
                returnStatus: true
            )
            if (response == 0) {
                echo "Health check passed."
            } else {
                error "Health check failed."
            }
        }
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