pipeline {
  agent { label 'built-in' }

  tools {
    nodejs 'node_v16'
  }

  stages {
    stage('SCM') {
      steps {
        checkout scm
      }
    }

    stage('SonarQube Analysis') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
          script {
            def scannerHome = tool 'SonarScanner'

            withSonarQubeEnv('SonarQube') {
              sh "${scannerHome}/bin/sonar-scanner"
            }
          }
        }
      }

      post {
        failure {
          echo "Something failed"
        }
      }
    }

    stage('build') {
      steps {
        sh 'npm install -g pnpm'
        sh 'pnpm install'
        sh 'pnpm run build'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('deploy') {
      agent { label 'ds2' }
      steps {
        copyArtifacts filter: 'dist/**', fingerprintArtifacts: true, projectName: env.JOB_NAME, selector: specific ('${BUILD_NUMBER}')
        sh 'rm -rf /var/www/dasuka-co'
        sh 'mkdir -p /var/www/dasuka-co'
        sh 'scp -r dist/. /var/www/dasuka-co'
      }
      post {
        success {
          slackSend channel: 'C056R2413N1', color: 'good', message: "Build production success :pepeok:"
        }
      }
    }
  }
}
