#!groovy
properties([
    pipelineTriggers([[$class:"GitHubPushTrigger"]])
])
pipeline {
  agent { label 'docker-slave' }
  stages{
    stage('Get Code') {
      steps {
          deleteDir()
          checkout ([
              $class: 'GitSCM',
              branches: scm.branches,
              doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
              extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
              userRemoteConfigs: scm.userRemoteConfigs,
           ])
           script {
               tag=sh(returnStdout: true, script: "git tag -l --points-at HEAD").trim()
               env.tag = tag
             }
      }
    }
    stage('GetOpsScripts') {
      steps {
        slackSend (color: '#ddaa00', message: ":construction_worker: kf-ui-release-coordinator GETTING SCRIPTS:")
        sh '''
        git clone git@github.com:kids-first/kf-ui-release-coordinator-config.git
        '''
      }
    }
    stage('Test') {
     steps {
       slackSend (color: '#ddaa00', message: ":construction_worker: kf-ui-release-coordinator TESTING STARTED: (${env.BUILD_URL})")
       sh '''
       kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/test_stage/test.sh
       '''
       slackSend (color: '#41aa58', message: ":white_check_mark: kf-ui-release-coordinator TESTING COMPLETED: (${env.BUILD_URL})")
     }
     post {
       failure {
         slackSend (color: '#ff0000', message: ":frowning: kf-ui-release-coordinator Test Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
       }
     }
    }
    stage('Build DEV') {
      steps {
        sh '''
        kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/build_stage/build.sh dev
        '''
      }
    }
    stage('Deploy Dev') {
      when {
        expression {
          return env.BRANCH_NAME != 'master';
        }
      }
      steps {
        slackSend (color: '#005e99', message: ":deploying_dev: DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})")
        sh '''
        export TF_VAR_git_commit=${GIT_COMMIT}
        kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/deploy_stage/deploy.sh dev
        kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/publish_stage/publish.sh dev
        '''
        slackSend (color: '#41aa58', message: ":white_check_mark: kf-ui-release-coordinator DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})")
      }
      post {
        failure {
          slackSend (color: '#ff0000', message: ":frowning: kf-ui-release-coordinator Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
      }
    }
    stage('Build QA') {
        when {
         expression {
             return env.BRANCH_NAME == 'master';
         }
       }
      steps {
        sh '''
        kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/build_stage/build.sh qa
        '''
      }
    }
    stage('Deploy QA') {
      when {
       expression {
           return env.BRANCH_NAME == 'master';
       }
     }
     steps {
       slackSend (color: '#005e99', message: ":deploying_qa: kf-ui-release-coordinator DEPLOYING TO QA: (${env.BUILD_URL})")
       sh '''
       export TF_VAR_git_commit=${GIT_COMMIT}
       kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/deploy_stage/deploy.sh qa
       kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/publish_stage/publish.sh qa
       '''
       slackSend (color: '#41aa58', message: ":white_check_mark: kf-ui-release-coordinator DEPLOYED TO QA: (${env.BUILD_URL})")
     }
     post {
       failure {
         slackSend (color: '#ff0000', message: ":frowning: kf-ui-release-coordinator Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
       }
     }
    }
    stage("Promotion kf-ui-release-coordinator to PRD") {
      when {
             expression {
               return env.BRANCH_NAME == 'master';
             }
             expression {
               return tag != '';
             }
           }
      steps {
             script {
                     env.DEPLOY_TO_PRD = input message: 'User input required',
                                     submitter: 'lubneuskia,heatha',
                                     parameters: [choice(name: 'kf-ui-release-coordinator: Deploy to PRD Environment', choices: 'no\nyes', description: 'Choose "yes" if you want to deploy the PRD server')]
             }
     }
    }
    stage('Build PRD') {
        when {
         environment name: 'DEPLOY_TO_PRD', value: 'yes'
         expression {
             return env.BRANCH_NAME == 'master';
         }
         expression {
           return tag != '';
         }
       }
      steps {
        sh '''
        kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/build_stage/build.sh prd
        '''
      }
    }
    stage('Deploy PRD') {
      when {
       environment name: 'DEPLOY_TO_PRD', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
         return tag != '';
       }
     }
     steps {
       slackSend (color: '#005e99', message: ":deploying_prd: kf-ui-release-coordinator DEPLOYING TO PRD: (${env.BUILD_URL})")
       sh '''
       export TF_VAR_git_commit=${GIT_COMMIT}
       kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/deploy_stage/deploy.sh prd
       kf-ui-release-coordinator-config/aws-cloudfront-static-app/ci-scripts/publish_stage/publish.sh prd
       '''
       slackSend (color: '#41aa58', message: ":white_check_mark: kf-ui-release-coordinator DEPLOYED TO PRD: (${env.BUILD_URL})")
     }
    }
  }
}
