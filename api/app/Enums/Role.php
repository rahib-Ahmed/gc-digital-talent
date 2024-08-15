<?php

namespace App\Enums;

enum Role: string
{
    case BASE_USER = 'base_user';
    case APPLICANT = 'applicant';
    case POOL_OPERATOR = 'pool_operator';
    case REQUEST_RESPONDER = 'request_responder';
    case COMMUNITY_RECRUITER = 'community_recruiter';
    case COMMUNITY_MANAGER = 'community_manager';
    case COMMUNITY_ADMIN = 'community_admin';
    case PLATFORM_ADMIN = 'platform_admin';
}
