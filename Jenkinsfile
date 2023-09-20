pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('docker_hub')
    BRANCH = "${env.BRANCH_NAME}"
    COMMIT = "${env.GIT_COMMIT}"
  }

  stages {

    // Removes the old container if it exists due to previous error
    stage("Pruning old containers") {
      steps {
        sh "docker container prune -f"
      }
    }

    // Builds Docker image 
    stage("Building image") {
      steps {
        sh 'pwd'
        script {
          
          if (BRANCH == 'main') {
              DOCKERFILE = "Dockerfile.main"
          } else {
              DOCKERFILE = "Dockerfile.dev"
          }

          try {
            sh "docker build --no-cache -t next-app-${BRANCH} -f ./${DOCKERFILE} ."
          } catch (Exception e) {
              ERROR_MESSAGE = "There was a build error: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    // **DEV ONLY** - Starts Docker container
    stage("Startings container") {
      when {
        branch "dev"
      }
      steps{
        script {
          try {
            sh "docker run -d --rm  -p 4000:3000 --name next-app-dev next-app-dev"
          } catch (Exception e) {
              ERROR_MESSAGE = "There was an error running the container: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    // **DEV ONLY** - Uses ESLint to check for errors
    stage("Linting") {
      when {
        branch "dev"
      }
      steps {
        script {
          try {
            sh "docker exec next-app-dev npm run lint"
          } catch (Exception e) {
              ERROR_MESSAGE = "There was a linting error: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
        
      }
    }

    // **DEV ONLY** - Runs unit tests with Jest
    stage("Testing") {
      when {
        branch "dev"
      }
      steps {
        script {
          try {
            sh 'docker exec next-app-dev npm run test '
          } catch (Exception e) {
              ERROR_MESSAGE = "Testing failed: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
        
      }
    }

    // **DEV ONLY** - Builds code
    stage("Building") {
      when{
        branch "dev"
      }
      steps {
        script {
          try {
            sh 'docker exec next-app-dev npm run build'
          } catch (Exception e) {
              ERROR_MESSAGE = "Building failed: ${e.getMessage()}"
              currentBuild.result = 'FAILURE'
              error("${ERROR_MESSAGE}")
          }
        }
      }
    }

    // **DEV ONLY** - Removes container
    stage("Remove container") {
      when {
        branch "dev"
      }
      steps {
        sh "docker stop next-app-dev"
      }
    }

    // **MAIN ONLY** - Validate push to Docker Hub
    stage('Validate push') {
      when {
        beforeInput true
        branch "main"
      }
      input {
        message "Push to Docker Hub?"
        ok "Push!!"
      }
      steps{
        echo 'Push Accepted'
      }
    }

    // **MAIN ONLY** - Sign in to Docker Hub
    stage('Login to Docker Hub') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }

    // **MAIN ONLY** - Pushes the production image to Docker hub 
    stage("Push to Docker Hub") {
      when {
        branch "main"
      }
      steps {
        sh "docker tag next-app-main rymela/next-project"
        sh "docker push rymela/next-project"
      }
    }

    // **MAIN ONLY** - Validate push to Deploy
    stage('Validate deploy') {
      when {
        beforeInput true
        branch "main"
      }
      input {
        message "Deploy to ECS?"
        ok "Deploy!!"
      }
      steps{
        echo 'Deployed'
      }
    }

    // **MAIN ONLY** - Update ECS Service
    stage("Depoly") {
      when {
        branch "main"
      }
      steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'aws-access-next', // Replace with your actual credentials ID
            accessKeyVariable: 'AWS_ACCESS_KEY_ID',
            secretKeyVariable: 'AWS_SECRET_ACCESS_KEY',
        ]]) {
          sh 'aws ecs update-service --cluster next-project-cluster --service next-project --force-new-deployment'
        }
      }
    }

    // **MAIN ONLY** - Removes image
    stage("Remove repo image") {
      when {
        branch "main"
      }
      steps {
        sh "docker rmi rymela/next-project"
      }
    }

  }

  post {

    failure {
      steps {
        slackSend(color: "#FF0000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline failed: ${ERROR_MESSAGE} \nPlease fix!!") 
      when {
        branch "dev"
      }
        sh "docker stop next-app-dev"
      }
    }

    success {
      slackSend(color: "#008000", message: "BRANCH: ${BRANCH} \nCOMMIT#: ${COMMIT} \n\nMESSAGE: Pipeline succeeded!  \nGood job!!!")
    }
  }
}