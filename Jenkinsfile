pipeline {
    agent any
    stages {
        stage("pipeline node") {
            agent {
                docker { 
                    image 'node:20.11.1-alpine3.19' 
                    reuseNode true
                }
            }
            stages {
                stage('instalar dependencias') {
                    steps {
                        sh 'npm install'
                    }
                }
                stage('ejecutar test') {
                    steps {
                        sh 'npm run test'
                    }
                }
                stage('hacer build') {
                    steps {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage("code quality") {
            stages {
                stage("build & SonarQube analysis") {
                    agent { 
                        docker { 
                            image 'sonarsource/sonar-scanner-cli'
                            args  '--network="devops-infra_default"'
                        }
                    }
                    steps {
                        withSonarQubeEnv('sonarqube') {
                            sh 'sonar-scanner'
                        }
                    }
                }
                stage("Quality Gate") {
                    steps {
                        timeout(time: 1, unit: 'HOURS') {
                            waitForQualityGate abortPipeline: true
                        }
                    }
                }
            }
        }

        stage('delivery to docker') {
            steps {
                script {
                    docker.withRegistry('http://localhost:8082', 'nexus-key') {
                        sh 'docker build -t localhost:8082/clase10-proyecto-devops .'
                        sh "docker tag localhost:8082/clase10-proyecto-devops localhost:8082/clase10-proyecto-devops:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                        sh 'docker push localhost:8082/clase10-proyecto-devops'
                        sh "docker push localhost:8082/clase10-proyecto-devops:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
                    }
                }
            }
        }
        stage('deploy to compose') {
            steps {
                script {
                    docker.withRegistry('http://localhost:8082', 'nexus-key') {
                        sh 'docker-compose pull'
                        sh "docker-compose up --force-recreate --build -d"
                    }
                }
            }
        }
    }
}