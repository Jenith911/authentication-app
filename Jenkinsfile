pipeline {
    agent any
    environment {
        APP_NAME = 'authentication-app'
        BUILD_DIR = 'build'
        SERVER_ADDRESS = 'example.com'
        SERVER_USER = 'ubuntu'
        DEPLOY_DIR = '/home/ubuntu/apps/nodejs-app'
        ZIP_FILE_NAME = "${APP_NAME}.zip"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    
        stage('Package') {
            steps {
                sh "zip -r ${ZIP_FILE_NAME} dist"
            }
        }
        stage('Deploy to Test Environment') {
            steps {
                sshagent(['nodejs-server-key']) {
                    sh "scp ${ZIP_FILE_NAME} ${REMOTE_USER}@${REMOTE_HOST}:${DEPLOY_DIR}"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'cd ${DEPLOY_DIR} && unzip -o ${ZIP_FILE_NAME} && npm install && npm start &'"
                }
            }
        }
        post {
            always {
            input "Deploy to Production?"
            }
        }

        stage('Deploy to Production Environment') {
            steps {
                echo("Deploy to production environment here")
            }
        }
    }
}
