@Library(value='kids-first/aws-infra-jenkins-shared-libraries', changelog=false) _
ecs_service_existing_alb {
    projectName                = "kf-ui-release-coordinator"
    deploy_scripts_version     = "feautre/nginx"
    host_based_routing         = "1"
    alb_name                   = "kf-api-release-coordinator"
    orgFullName                = "kids-first"
    environments               = "dev,qa,prd"
    build_environments         = "dev,qa,prd"
    docker_image_type          = "debian"
    create_default_iam_role    = "1"
    entrypoint_command         = "nginx"
    quick_deploy               = "true"
    container_port             = "80"
    health_check_path          = "/"
    external_config_repo       = "false"
    internal_app               = "false"
    dev_cidr                   = "0.0.0.0/0"
    qa_cidr		       = "0.0.0.0/0"
    dependencies               = "ecr"
}
