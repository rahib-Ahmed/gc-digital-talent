<?php

/*
|--------------------------------------------------------------------------
| Role and Permissions Config
|--------------------------------------------------------------------------
|
| Used by the RolePermissionSeeder, based on the Laratrust seeder
|
| REF:
|
*/
return [
    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    |
    | A map of all actions available within the application.
    | This is effectively an enum.
    |
    */
    'actions' => [
        'view' => 'view',
        'create' => 'create',
        'update' => 'update',
        'delete' => 'delete',
        'assign' => 'assign',
        'archive' => 'archive',
        'suspend' => 'suspend',
        'submit' => 'submit',
        'publish' => 'publish',
    ],

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    |
    | A map of all scopes for different actions performed.
    |
    */
    'scopes' => [
        'own' => 'own',
        'any' => 'any',
        'team' => 'team',
    ],

    /*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    |
    | A map of all resources that a specific action can be taken on.
    |
    */
    'resources' => [
        'classification' => 'classification',
        'department' => 'department',
        'genericJobTitle' => 'genericJobTitle',
        'skill' => 'skill',
        'skillFamily' => 'skillFamily',
        'user' => 'user',
        'userBasicInfo' => 'userBasicInfo',
        'userSub' => 'userSub',
        'applicantProfile' => 'applicantProfile',
        'draftPool' => 'draftPool',
        'publishedPool' => 'publishedPool',
        'pool' => 'pool',
        'assessmentPlan' => 'assessmentPlan',
        'application' => 'application',
        'draftApplication' => 'draftApplication',
        'submittedApplication' => 'submittedApplication',
        'applicationAssessment' => 'applicationAssessment',
        'applicationDecision' => 'applicationDecision',
        'applicationPlacement' => 'applicationPlacement',
        'applicationStatus' => 'applicationStatus', // TODO: remove - to be replaced by applicationAssessment and applicationDecision, but can't be fully removed until after #8671.
        'applicantCount' => 'applicantCount',
        'searchRequest' => 'searchRequest',
        'role' => 'role',
        'announcement' => 'announcement',
        'community' => 'community',
        'poolTeamMembers' => 'poolTeamMembers',
        'communityTeamMembers' => 'communityTeamMembers',

        'platformAdminMembership' => 'platformAdminMembership',
        'communityAdminMembership' => 'communityAdminMembership',
        'communityRecruiterMembership' => 'communityRecruiterMembership',
        'processOperatorMembership' => 'processOperatorMembership',

        'teamMembers' => 'teamMembers', // TODO: remove - replaced by more specific poolTeamMembers and communityTeamMembers during #10368 (Post-communities cleanup)
        'team' => 'team', // TODO: remove when Teams are removed during #10368 (Post-communities cleanup)
        'teamRole' => 'teamRole', // TODO: remove - replaced by specific membership resources. Remove during #10368 (Post-communities cleanup)

        'directiveForm' => 'directiveForm',
    ],

    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    |
    | A map of all permissions with $name => $display_name shape.
    |
    */
    'permissions' => [
        'view-any-classification' => [
            'en' => 'View Any Classification',
            'fr' => 'Visionner toute classification',
        ],
        'create-any-classification' => [
            'en' => 'Create Any Classification',
            'fr' => 'Créer toute classification',
        ],
        'update-any-classification' => [
            'en' => 'Update Any Classification',
            'fr' => 'Mettre à jour toute classification',
        ],
        'delete-any-classification' => [
            'en' => 'Delete Any Classification',
            'fr' => 'Supprimer toute classification',
        ],

        'view-any-department' => [
            'en' => 'View Any Department',
            'fr' => 'Visionner tout ministère',
        ],
        'create-any-department' => [
            'en' => 'Create Any Department',
            'fr' => 'Créer tout ministère',
        ],
        'update-any-department' => [
            'en' => 'Update Any Department',
            'fr' => 'Mettre à jour tout ministère',
        ],
        'delete-any-department' => [
            'en' => 'Delete Any Department',
            'fr' => 'Supprimer tout ministère',
        ],

        'view-any-genericJobTitle' => [
            'en' => 'View Any Generic Job Title',
            'fr' => 'Visionner tout titre générique de l\'emploi',
        ],
        'create-any-genericJobTitle' => [
            'en' => 'Create Any Generic Job Title',
            'fr' => 'Créer tout titre générique de l\'emploi',
        ],
        'update-any-genericJobTitle' => [
            'en' => 'Update Any Generic Job Title',
            'fr' => 'Mettre à jour tout titre générique de l\'emploi',
        ],
        'delete-any-genericJobTitle' => [
            'en' => 'Delete Any Generic Job Title',
            'fr' => 'Supprimer tout titre générique de l\'emploi',
        ],

        'view-any-skill' => [
            'en' => 'View Any Skill',
            'fr' => 'Visionner toute compétence',
        ],
        'create-any-skill' => [
            'en' => 'Create Any Skill',
            'fr' => 'Créer toute compétence',
        ],
        'update-any-skill' => [
            'en' => 'Update Any Skill',
            'fr' => 'Mettre à jour toute compétence',
        ],
        'delete-any-skill' => [
            'en' => 'Delete Any Skill',
            'fr' => 'Supprimer toute compétence',
        ],

        'view-any-skillFamily' => [
            'en' => 'View Any Skill Family',
            'fr' => 'Visionner toute famille de compétences',
        ],
        'create-any-skillFamily' => [
            'en' => 'Create Any Skill Family',
            'fr' => 'Créer toute famille de compétences',
        ],
        'update-any-skillFamily' => [
            'en' => 'Update Any Skill Family',
            'fr' => 'Mettre à jour toute famille de compétences',
        ],
        'delete-any-skillFamily' => [
            'en' => 'Delete Any Skill Family',
            'fr' => 'Supprimer toute famille de compétences',
        ],

        'create-any-user' => [
            'en' => 'Create Any User',
            'fr' => 'Créer tout utilisateur',
        ],
        'view-any-user' => [
            'en' => 'View Any User',
            'fr' => 'Visionner tout utilisateur',
        ],
        'view-own-user' => [
            'en' => 'View Own User',
            'fr' => 'Visionner son propre utilisateur',
        ],
        'view-any-userBasicInfo' => [
            'en' => 'View basic info of any User',
            'fr' => 'Afficher les informations de base de tout utilisateur',
        ],
        'update-any-user' => [
            'en' => 'Update Any User (does not include updating the "sub" field or role assignments)',
            'fr' => 'Mettre à jour tout utilisateur (ne comprend pas la mise à jour du champ "sub" ou des attributions de rôles)',
        ],
        'update-any-userSub' => [
            'en' => 'Update the "sub" field of any user',
            'fr' => 'Mettre à jour le champ "sub" de n\'importe quel utilisateur',
        ],
        'update-own-user' => [
            'en' => 'Update Own User (does not include updating the "sub" field or role assignments)',
            'fr' => 'Mettre à jour son propre utilisateur (ne comprend pas la mise à jour du champ "sub" ou des attributions de rôles)',
        ],
        'delete-any-user' => [
            'en' => 'Delete Any User',
            'fr' => 'Supprimer tout utilisateur',
        ],

        'view-any-applicantProfile' => [
            'en' => 'View any Applicant Profile',
            'fr' => 'Visionner tout profil de candidat',
        ],
        'view-team-applicantProfile' => [
            'en' => 'View Team User',
            'fr' => 'Visionner l\'utilisateur de l\'équipe',
        ],
        'view-own-applicantProfile' => [
            'en' => 'View Own Applicant Profile',
            'fr' => 'Visionner son propre profil de candidat',
        ],
        'update-own-applicantProfile' => [
            'en' => 'Update Own Applicant Profile',
            'fr' => 'Mettre à jour son propre profil de candidat',
        ],

        'view-team-draftPool' => [
            'en' => 'View draft Pools in this Team',
            'fr' => 'Voir les bassins de brouillons dans cette équipe',
        ],
        'view-any-pool' => [
            'en' => 'View any Pool, published or not',
            'fr' => 'Voir n\'importe quel bassin, publié ou non',
        ],
        'view-any-publishedPool' => [
            'en' => 'View Any Published Pool',
            'fr' => 'Visionner toute annonce publiée dans un bassin',
        ],
        'create-team-draftPool' => [
            'en' => 'Create Pools in this Team',
            'fr' => 'Créer des bassins dans cette équipe',
        ],
        'update-team-draftPool' => [
            'en' => 'Update unpublished Pools in this Team',
            'fr' => 'Mise à jour des bassins non publiés dans cette équipe',
        ],
        'update-any-publishedPool' => [
            'en' => 'Update published Pools',
            'fr' => 'Mise à jour des bassins publiés',
        ],
        'publish-team-draftPool' => [
            'en' => 'Publish Pools in this Team',
            'fr' => 'Publier des bassins dans cette équipe',
        ],
        'publish-any-draftPool' => [
            'en' => 'Publish any draft Pool',
            'fr' => 'Publier n\'import quel bassin',
        ],
        'update-team-publishedPool' => [
            'en' => 'Update published Pools in this Team',
            'fr' => 'Mise à jour des bassins publiés dans cette équipe',
        ],
        'delete-team-draftPool' => [
            'en' => 'Delete draft Pools in this Team',
            'fr' => 'Supprimer les pools de brouillons dans cette équipe',
        ],
        'archive-team-publishedPool' => [
            'en' => 'Archive the pools in this team',
            'fr' => 'Archiver les pools de cette équipe',
        ],
        'archive-any-publishedPool' => [
            'en' => 'Archive any published pool',
            'fr' => 'Archiver n\'import quel bassin publié',
        ],

        'view-any-assessmentPlan' => [
            'en' => 'View the assessment plan (assessment steps) for any pool.',
            'fr' => 'Consulter le plan d\'évaluation (étapes de l\'évaluation) pour n\'importe quel bassin.',
        ],
        'view-team-assessmentPlan' => [
            'en' => 'View the assessment plan (assessment steps) for pools run by your team only.',
            'fr' => 'Consultez le plan d\'évaluation (étapes de l\'évaluation) pour les pools gérés par votre équipe uniquement.',
        ],
        'update-any-assessmentPlan' => [
            'en' => 'Edit the assessment plan (assessment steps) for any pool.',
            'fr' => 'Modifier le plan d\'évaluation (étapes de l\'évaluation) pour n\'importe quel bassin.',
        ],
        'update-team-assessmentPlan' => [
            'en' => 'Edit the assessment plan (assessment steps) for pools run by your team only.',
            'fr' => 'Modifier le plan d\'évaluation (étapes de l\'évaluation) pour les pools gérés par votre équipe uniquement.',
        ],

        'create-any-application' => [
            'en' => 'Add any user to any Pool, skipping the draft and submission process',
            'fr' => 'Ajoutez n\'importe quel utilisateur à n\'importe quel pool, en sautant le processus de rédaction et de soumission.',
        ],
        'view-own-application' => [
            'en' => 'View Own Application',
            'fr' => 'Visionner sa propre candidature',
        ],
        'view-team-submittedApplication' => [
            'en' => 'View Applications submitted to any of this Team\'s Pools',
            'fr' => 'Voir les candidatures soumises à n\'importe quel bassin de cette équipe.',
        ],
        'view-any-submittedApplication' => [
            'en' => 'View any submitted Applications',
            'fr' => 'Voir n\import quelle candidature soumises à n\'importe quel bassin.',
        ],
        'create-own-draftApplication' => [
            'en' => 'Begin my own Application to any Pool',
            'fr' => 'Créer sa propre candidature provisoire',
        ],
        'update-own-draftApplication' => [
            'en' => 'Update my own draft Application',
            'fr' => 'Mise à jour de mon candidature provisoire',
        ],
        'submit-own-draftApplication' => [
            'en' => 'Submit my own Application',
            'fr' => 'Soumettre ma propre candidature',
        ],
        'delete-own-draftApplication' => [
            'en' => 'Delete Own Draft Application',
            'fr' => 'Supprimer sa propre candidature provisoire',
        ],
        'archive-own-submittedApplication' => [
            'en' => 'Archive Own Submitted Application',
            'fr' => 'Archiver sa propre candidature présentée',
        ],
        'suspend-own-submittedApplication' => [
            'en' => 'Suspend or un-suspend Own Submitted Application',
            'fr' => 'Suspendre ou débloquer sa propre candidature présentée',
        ],

        'view-own-applicationStatus' => [
            'en' => 'View the status of my own Applications',
            'fr' => 'Consulter le statut de mes propres candidatures',
        ],
        'view-team-applicationStatus' => [
            'en' => 'View the status of Applications submitted to this Team\'s Pools',
            'fr' => 'Consulter le statut des candidatures soumises aux bassins de cette équipe.',
        ],
        'view-any-applicationStatus' => [
            'en' => 'View the status of any submitted Application',
            'fr' => 'Consulter le statut de n\'importe quel candidature soumise',
        ],
        'update-team-applicationStatus' => [
            'en' => 'Update the status of Applications submitted to this Team\'s Pools',
            'fr' => 'Mettre à jour le statut des demandes soumises aux bassins de cette équipe.',
        ],
        'update-any-applicationStatus' => [
            'en' => 'Update the status of any submitted Applications',
            'fr' => 'Mettre à jour le statut des demandes soumises aux bassins de cette équipe.',
        ],

        'view-any-applicationAssessment' => [
            'en' => 'View the assessment of any submitted Application',
            'fr' => 'Consulter l\'évaluation de n\'importe quelle candidature soumise',
        ],
        'view-team-applicationAssessment' => [
            'en' => 'View the assessment of Applications submitted to this Team\'s Pools',
            'fr' => 'Consulter l\'évaluation des candidatures soumises aux bassins de cette équipe.',
        ],
        'update-any-applicationAssessment' => [
            'en' => 'Update the assessment of any submitted Application',
            'fr' => 'Mettre à jour l\'évaluation de n\'importe quelle candidature soumise',
        ],
        'update-team-applicationAssessment' => [
            'en' => 'Update the assessment of Applications submitted to this Team\'s Pools',
            'fr' => 'Mettre à jour l\'évaluation des candidatures soumises aux bassins de cette équipe.',
        ],
        'view-any-applicationDecision' => [
            'en' => 'View the decision of any submitted Application',
            'fr' => 'Consulter la décision de n\'importe quelle candidature soumise',
        ],
        'view-team-applicationDecision' => [
            'en' => 'View the decision of Applications submitted to this Team\'s Pools',
            'fr' => 'Consulter la décision des candidatures soumises aux bassins de cette équipe.',
        ],
        'view-own-applicationDecision' => [
            'en' => 'View the decision of my own Applications',
            'fr' => 'Consulter la décision de mes propres candidatures',
        ],
        'update-team-applicationDecision' => [
            'en' => 'Update the decision of Applications submitted to this Team\'s Pools',
            'fr' => 'Mettre à jour la décision des candidatures soumises aux bassins de cette équipe.',
        ],
        'update-any-applicationDecision' => [
            'en' => 'Update the decision of any submitted Application',
            'fr' => 'Mettre à jour la décision de n\'importe quelle candidature soumise',
        ],
        'view-any-applicationPlacement' => [
            'en' => 'View the placement of any submitted Application',
            'fr' => 'Consulter le placement de n\'importe quelle candidature soumise',
        ],
        'view-team-applicationPlacement' => [
            'en' => 'View the placement of Applications submitted to this Team\'s Pools',
            'fr' => 'Consulter le placement des candidatures soumises aux bassins de cette équipe.',
        ],
        'view-own-applicationPlacement' => [
            'en' => 'View the placement of my own Applications',
            'fr' => 'Consulter le placement de mes propres candidatures',
        ],
        'update-team-applicationPlacement' => [
            'en' => 'Update the placement of Applications submitted to this Team\'s Pools',
            'fr' => 'Mettre à jour le placement des candidatures soumises aux bassins de cette équipe.',
        ],
        'update-any-applicationPlacement' => [
            'en' => 'Update the placement of any submitted Application',
            'fr' => 'Mettre à jour le placement de n\'importe quelle candidature soumise',
        ],
        'view-any-applicantCount' => [
            'en' => 'View the count result of any filter-Applicant query',
            'fr' => 'Visualiser le résultat du comptage de n\'importe quelle requête filtre-demandeur',
        ],

        'create-any-searchRequest' => [
            'en' => 'Create Any SearchRequest',
            'fr' => 'Créer toute demande de recherche',
        ],
        'view-team-searchRequest' => [
            'en' => 'View SearchRequests submitted to this Team',
            'fr' => 'Voir les demandes de recherche soumises à cette équipe',
        ],
        'update-team-searchRequest' => [
            'en' => 'Update the notes or status of SearchRequests submitted to this Team',
            'fr' => 'Mettre à jour les notes ou le statut des demandes de recherche soumises à cette équipe.',
        ],
        'delete-team-searchRequest' => [
            'en' => 'Delete SearchRequests submitted to this Team',
            'fr' => 'Supprimer une demande de recherche d’équipe',
        ],
        'view-any-searchRequest' => [
            'en' => 'View any SearchRequests',
            'fr' => 'Voir n\'import quelles demandes de recherche',
        ],
        'update-any-searchRequest' => [
            'en' => 'Update the notes or status of SearchRequests submitted to this Team',
            'fr' => 'Mettre à jour les notes ou le statut de n\'import quelle demande de recherche',
        ],
        'delete-any-searchRequest' => [
            'en' => 'Delete SearchRequests submitted to this Team',
            'fr' => 'Supprimer n\'import quelle demande de recherche',
        ],

        'view-any-team' => [
            'en' => 'View Any Team',
            'fr' => 'Visionner toute équipe',
        ],
        'view-any-teamMembers' => [
            'en' => 'View who is a member of any Team',
            'fr' => 'Voir qui est membre de n\'import quell équipe',
        ],
        'view-team-teamMembers' => [
            'en' => 'View who is a member of this Team',
            'fr' => 'Voir qui est membre de cette équipe',
        ],
        'create-any-team' => [
            'en' => 'Create Any Team',
            'fr' => 'Créer toute équipe',
        ],
        'update-any-team' => [
            'en' => 'Update Any Team',
            'fr' => 'Mettre à jour toute équipe',
        ],
        'update-team-team' => [
            'en' => 'Update this Team',
            'fr' => 'Mettre à jour des équipes',
        ],
        'delete-any-team' => [
            'en' => 'Delete Any Team',
            'fr' => 'Supprimer toute équipe',
        ],

        'view-any-role' => [
            'en' => 'View Any Role',
            'fr' => 'Visionner tout rôle',
        ],
        'assign-any-role' => [
            'en' => 'Assign any Role to any User',
            'fr' => 'Attribuer n\'importe quel rôle à n\'importe quel utilisateur',
        ],
        'assign-team-role' => [
            'en' => 'Assign Roles associated with this Team to any User',
            'fr' => 'Attribuer les rôles associés à cette équipe à tout utilisateur',
        ],
        'update-any-role' => [
            'en' => 'Update metadata associated with any Role',
            'fr' => 'Mettre à jour des métadonnées associées à tout rôle',
        ],
        'assign-any-teamRole' => [
            'en' => 'Assign any user to any team, with any role.',
            'fr' => 'Affecter n\'importe quel utilisateur à n\'importe quelle équipe, avec n\'importe quel rôle.',
        ],

        'create-any-directiveForm' => [
            'en' => 'Create any directive form',
            'fr' => 'Créer tout formulaire de directive',
        ],
        'view-any-directiveForm' => [
            'en' => 'View any directive form',
            'fr' => 'Voir tout formulaire de directive',
        ],
        'update-any-directiveForm' => [
            'en' => 'Update any directive form',
            'fr' => 'Mise à jour de tout formulaire de directive',
        ],
        'delete-any-directiveForm' => [
            'en' => 'Delete any directive form',
            'fr' => 'Supprimer tout formulaire de directive',
        ],

        'view-any-announcement' => [
            'en' => 'View any announcement',
            'fr' => 'Vissioner toutes les annonces',
        ],
        'update-any-announcement' => [
            'en' => 'Update any announcement',
            'fr' => 'Mise à jour de toute annonce',
        ],

        'view-any-community' => [
            'en' => 'View any community',
            'fr' => 'Vissioner toutes les communautés',
        ],
        'view-team-community' => [
            'en' => 'View this community',
            'fr' => 'Vissioner cette communauté',
        ],
        'create-any-community' => [
            'en' => 'Create any community',
            'fr' => 'Créer toute communauté',
        ],
        'update-any-community' => [
            'en' => 'Update any community',
            'fr' => 'Mise à jour de toute communauté',
        ],
        'update-team-community' => [
            'en' => 'Update this commuinty',
            'fr' => 'Mise à jour cette communautés',
        ],
        'delete-any-community' => [
            'en' => 'Delete any community',
            'fr' => 'Supprimer toute communauté',
        ],

        'update-any-platformAdminMembership' => [
            'en' => 'Add or remove the Platform Admin role from any user',
            'fr' => 'Ajouter ou supprimer le rôle d\'administrateur de plateforme de n\'importe quel utilisateur',
        ],
        'update-any-communityAdminMembership' => [
            'en' => 'Add or remove the Community Admin role from any user',
            'fr' => 'Ajouter ou supprimer le rôle d\'administrateur de communauté de n\'importe quel utilisateur',
        ],
        'update-team-communityAdminMembership' => [
            'en' => 'Add or remove the Community Admin role, for this community, to any user',
            'fr' => 'Ajouter ou supprimer le rôle d\'administrateur de communauté, pour cette communauté, à n\'importe quel utilisateur',
        ],
        'update-any-communityRecruiterMembership' => [
            'en' => 'Add or remove the Community Recruiter role from any user',
            'fr' => 'Ajouter ou supprimer le rôle de recruteur de communauté de n\'importe quel utilisateur',
        ],
        'update-team-communityRecruiterMembership' => [
            'en' => 'Add or remove the Community Recruiter role, for this community, to any user',
            'fr' => 'Ajouter ou supprimer le rôle de recruteur de communauté, pour cette communauté, à n\'importe quel utilisateur',
        ],
        'update-any-processOperatorMembership' => [
            'en' => 'Add or remove the Process Operator role from any user',
            'fr' => 'Ajouter ou supprimer le rôle d\'opérateur de processus de n\'importe quel utilisateur',
        ],
        'update-team-processOperatorMembership' => [
            'en' => 'Add or remove the Process Operator role, for any POOL in this COMMUNITY, for any user',
            'fr' => 'Ajouter ou supprimer le rôle d\'opérateur de processus, pour n\'importe quel BASSIN dans cette COMMUNAUTÉ, pour n\'importe quel utilisateur',
        ],

        'view-any-poolTeamMembers' => [
            'en' => 'View the members of any pool',
            'fr' => 'Voir les membres de n\'importe quel bassin',
        ],
        'view-team-poolTeamMembers' => [
            'en' => 'View the members of this pool, or of this community\'s pools',
            'fr' => 'Voir les membres de ce bassin, ou des bassins de cette communauté',
        ],
        'view-any-communityTeamMembers' => [
            'en' => 'View the members of any community',
            'fr' => 'Voir les membres de n\'importe quelle communauté',
        ],
        'view-team-communityTeamMembers' => [
            'en' => 'View the members of this community',
            'fr' => 'Voir les membres de cette communauté',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    |
    | A map of all roles with the shape:
    |
    |   $name => [
    |       'display_name' => LocalizedString,
    |       'description' => LocalizedString,
    |   ]
    |
    */
    'roles' => [
        'guest' => [
            'display_name' => [
                'en' => 'Guest',
                'fr' => 'Invité',
            ],
            'description' => [
                'en' => 'These permissions are available to anyone, even not logged in.',
                'fr' => 'Ces permissions sont accessibles à quiconque, même sans avoir ouvert de session.',
            ],
            'is_team_based' => false,
        ],

        'base_user' => [
            'display_name' => [
                'en' => 'Base User',
                'fr' => 'Utilisateur de base',
            ],
            'description' => [
                'en' => 'Available to any logged-in user.',
                'fr' => 'Accessibles à tout utilisateur qui a ouvert une session.',
            ],
            'is_team_based' => false,
        ],

        'applicant' => [
            'display_name' => [
                'en' => 'Applicant',
                'fr' => 'Candidat',
            ],
            'description' => [
                'en' => 'Can edit their own profile and apply to jobs.',
                'fr' => 'Peut modifier son propre profil et postuler des emplois.',
            ],
            'is_team_based' => false,
        ],

        // TODO: remove during #10368 (Post-communities cleanup)
        'pool_operator' => [
            'display_name' => [
                'en' => 'Pool Operator',
                'fr' => 'Opérateur de bassin',
            ],
            'description' => [
                'en' => 'Runs hiring process by creating Pools (which must be published by other roles) and and screening-in/out applicants.',
                'fr' => 'Gère le processus de recrutement en créant des bassins (qui doivent être publiés par d\'autres rôles) et en filtrant les candidats.',
            ],
            'is_team_based' => true,
        ],

        // TODO: remove during #10368 (Post-communities cleanup)
        'request_responder' => [
            'display_name' => [
                'en' => 'Request Responder',
                'fr' => 'Répondant aux demandes',
            ],
            'description' => [
                'en' => 'Responsible for responding to all talent requests, regardless of Team/Department. This requires viewing all published pools, and the applicants who have been qualified within them.',
                'fr' => 'Responsable de la réponse à toutes les demandes de talents, quelle que soit l\'équipe ou le département. Pour cela, il faut consulter tous les bassins publiés et les candidats qui ont été qualifiés dedans.',
            ],
            'is_team_based' => false,
        ],

        // TODO: remove during #10368 (Post-communities cleanup)
        'community_manager' => [
            'display_name' => [
                'en' => 'Community Manager',
                'fr' => 'Gestionnaire de communauté',
            ],
            'description' => [
                'en' => 'Publishes pools, creates teams, and adds Pool Operators to teams.',
                'fr' => 'Publie des pools, crée des équipes et ajoute des opérateurs des bassins aux équipes.',
            ],
            'is_team_based' => false,
        ],

        'process_operator' => [
            'display_name' => [
                'en' => 'Process Operator',
                'fr' => 'Opérateur de processus',
            ],
            'description' => [
                'en' => 'Runs a hiring process, all the way from editing the details of the poster and assessment plan, to assessing and qualifying candidates. Is specific to only a single process. Does not include the ability to publish the poster, create new posters, or add other operators.',
                'fr' => 'Gère un processus de recrutement, de l\'édition des détails de l\'affiche et du plan d\'évaluation, à l\'évaluation et à la qualification des candidats. Est spécifique à un seul processus. N\'inclut pas la capacité de publier l\'affiche, de créer de nouvelles affiches ou d\'ajouter d\'autres opérateurs.',
            ],
            'is_team_based' => true,
        ],

        'community_recruiter' => [
            'display_name' => [
                'en' => 'Community Recruiter',
                'fr' => 'Recruteur de communauté',
            ],
            'description' => [
                'en' => 'Can create new posters within their community and assign Process Operators to them. Can do anything Process Operators can do, on posters in their community. Can view the profiles of any user who has applied to a community process. Can view and respond to requests to the community.',
                'fr' => 'Peut créer de nouvelles affiches dans sa communauté et y affecter des opérateurs de processus. Ils peuvent faire tout ce que les opérateurs de processus peuvent faire sur les affiches de leur communauté. Ils peuvent consulter le profil de tout utilisateur ayant participé à un processus communautaire. Ils peuvent consulter les demandes adressées à la communauté et y répondre.',
            ],
            'is_team_based' => true,
        ],

        'community_admin' => [
            'display_name' => [
                'en' => 'Community Administrator',
                'fr' => 'Administrateur de communauté',
            ],
            'description' => [
                'en' => 'Can do anything Community Recruiters can do, and can also publish pools in their community and assign Community Recruiters.',
                'fr' => 'Peut faire tout ce que les recruteurs de communauté peuvent faire, et peut également publier des bassins dans leur communauté et affecter des recruteurs de communauté.',
            ],
            'is_team_based' => true,
        ],

        'platform_admin' => [
            'display_name' => [
                'en' => 'Platform Administrator',
                'fr' => 'Administrateur de plateforme',
            ],
            'description' => [
                'en' => 'Makes teams, assigns roles to other users (including assigning users to orgs), publishes pools, manages business data, and has the extraordinary ability to edit or delete other users.',
                'fr' => 'Crée des équipes, attribue des rôles à d\'autres utilisateurs (y compris l\'attribution d\'utilisateurs à des organisations), publie des pools, gère des données commerciales et a la capacité extraordinaire de modifier ou de supprimer d\'autres utilisateurs.',
            ],
            'is_team_based' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Seeders
    |--------------------------------------------------------------------------
    |
    | A map of the values to seed with the shape:
    |
    |   'role_name' => [
    |       'resource' => [
    |           'scope' => [ 'actions' ]
    |       ]
    |   ]
    |
    */
    'seeders' => [
        'guest' => [
            'classification' => [
                'any' => ['view'],
            ],
            'department' => [
                'any' => ['view'],
            ],
            'genericJobTitle' => [
                'any' => ['view'],
            ],
            'skill' => [
                'any' => ['view'],
            ],
            'skillFamily' => [
                'any' => ['view'],
            ],
            'community' => [
                'any' => ['view'],
            ],
            'role' => [
                'any' => ['view'],
            ],
            'publishedPool' => [
                'any' => ['view'],
            ],
            'applicantCount' => [
                'any' => ['view'],
            ],
            'searchRequest' => [
                'any' => ['create'],
            ],
            'team' => [
                'any' => ['view'],
            ],
            'announcement' => [
                'any' => ['view'],
            ],
        ],

        'base_user' => [
            'classification' => [
                'any' => ['view'],
            ],
            'department' => [
                'any' => ['view'],
            ],
            'genericJobTitle' => [
                'any' => ['view'],
            ],
            'skill' => [
                'any' => ['view'],
            ],
            'skillFamily' => [
                'any' => ['view'],
            ],
            'community' => [
                'any' => ['view'],
            ],
            'role' => [
                'any' => ['view'],
            ],
            'user' => [
                'own' => ['view', 'update'],
            ],
            'publishedPool' => [
                'any' => ['view'],
            ],
            'applicantCount' => [
                'any' => ['view'],
            ],
            'searchRequest' => [
                'any' => ['create'],
            ],
            'team' => [
                'any' => ['view'],
            ],
            'announcement' => [
                'any' => ['view'],
            ],
        ],

        'applicant' => [
            'application' => [
                'own' => ['view'],
            ],
            'draftApplication' => [
                'own' => ['create', 'update', 'submit', 'delete'],
            ],
            'submittedApplication' => [
                'own' => ['archive', 'suspend'],
            ],
            'applicationStatus' => [
                'own' => ['view'],
            ],
            'applicationDecision' => [
                'own' => ['view'],
            ],
            'applicationPlacement' => [
                'own' => ['view'],
            ],
        ],

        'pool_operator' => [
            'draftPool' => [
                'team' => ['create', 'view', 'update', 'delete'],
            ],
            'publishedPool' => [
                'team' => ['archive'],
            ],
            'submittedApplication' => [
                'team' => ['view'],
            ],
            'applicationStatus' => [
                'team' => ['view', 'update'],
            ],
            'applicationAssessment' => [
                'team' => ['view', 'update'],
            ],
            'applicationDecision' => [
                'team' => ['view', 'update'],
            ],
            'applicationPlacement' => [
                'team' => ['view', 'update'],
            ],
            'teamMembers' => [
                'team' => ['view'],
            ],
            'role' => [
                'any' => ['view'],
            ],
            'applicantProfile' => [
                'team' => ['view'],
            ],
            'assessmentPlan' => [
                'team' => ['view', 'update'],
            ],
        ],

        'request_responder' => [
            'submittedApplication' => [
                'any' => ['view'],
            ],
            'applicationStatus' => [
                'any' => ['view', 'update'],
            ],
            'applicationAssessment' => [
                'any' => ['view', 'update'],
            ],
            'applicationDecision' => [
                'any' => ['view', 'update'],
            ],
            'applicationPlacement' => [
                'any' => ['view', 'update'],
            ],
            'searchRequest' => [
                'any' => ['view', 'update', 'delete'],
            ],
            'user' => [
                'any' => ['view'],
            ],
            'assessmentPlan' => [
                'any' => ['view'],
            ],
        ],

        'community_manager' => [
            'userBasicInfo' => [
                'any' => ['view'],
            ],
            'pool' => [
                'any' => ['view'],
            ],
            'draftPool' => [
                'any' => ['publish'],
            ],
            'publishedPool' => [
                'any' => ['update', 'archive'],
            ],
            'teamMembers' => [
                'any' => ['view'],
            ],
            'team' => [
                'any' => ['view', 'create', 'update', 'delete'],
            ],
            'teamRole' => [
                'any' => ['assign'],
            ],
            'assessmentPlan' => [
                'any' => ['view'],
            ],
        ],

        'process_operator' => [
            'applicantProfile' => [
                'team' => ['view'],
            ],
            'draftPool' => [
                'team' => ['view', 'update'],
            ],
            'assessmentPlan' => [
                'team' => ['view', 'update'],
            ],
            'submittedApplication' => [
                'team' => ['view'],
            ],
            'applicationStatus' => [
                'team' => ['view'],
            ],
            'applicationAssessment' => [
                'team' => ['view', 'update'],
            ],
            'applicationDecision' => [
                'team' => ['view', 'update'],
            ],
            'applicationPlacement' => [
                'team' => ['view'],
            ],
            'poolTeamMembers' => [
                'team' => ['view'],
            ],
        ],

        'community_recruiter' => [
            'userBasicInfo' => [
                'any' => ['view'],
            ],
            'applicantProfile' => [
                'team' => ['view'],
            ],
            'draftPool' => [
                'team' => ['view', 'create', 'update', 'delete'],
            ],
            'publishedPool' => [
                'team' => ['archive'],
            ],
            'assessmentPlan' => [
                'team' => ['view', 'update'],
            ],
            'submittedApplication' => [
                'team' => ['view'],
            ],
            'applicationStatus' => [
                'team' => ['view'],
            ],
            'applicationAssessment' => [
                'team' => ['view', 'update'],
            ],
            'applicationDecision' => [
                'team' => ['view', 'update'],
            ],
            'applicationPlacement' => [
                'team' => ['view', 'update'],
            ],
            'searchRequest' => [
                'any' => ['view', 'update', 'delete'],
            ],
            'community' => [
                'team' => ['view'],
            ],
            'communityTeamMembers' => [
                'team' => ['view'],
            ],
            'poolTeamMembers' => [
                'team' => ['view'],
            ],
            'processOperatorMembership' => [
                'team' => ['update'],
            ],
        ],

        'community_admin' => [
            'userBasicInfo' => [
                'any' => ['view'],
            ],
            'applicantProfile' => [
                'team' => ['view'],
            ],
            'draftPool' => [
                'team' => ['view', 'create', 'update', 'delete', 'publish'],
            ],
            'publishedPool' => [
                'team' => ['update', 'archive'],
            ],
            'assessmentPlan' => [
                'team' => ['view', 'update'],
            ],
            'submittedApplication' => [
                'team' => ['view'],
            ],
            'applicationStatus' => [
                'team' => ['view'],
            ],
            'applicationAssessment' => [
                'team' => ['view', 'update'],
            ],
            'applicationDecision' => [
                'team' => ['view', 'update'],
            ],
            'applicationPlacement' => [
                'team' => ['view', 'update'],
            ],
            'searchRequest' => [
                'any' => ['view', 'update', 'delete'],
            ],
            'community' => [
                'team' => ['view', 'update'],
            ],
            'communityTeamMembers' => [
                'team' => ['view'],
            ],
            'communityRecruiterMembership' => [
                'team' => ['update'],
            ],
            'poolTeamMembers' => [
                'team' => ['view'],
            ],
            'processOperatorMembership' => [
                'team' => ['update'],
            ],
        ],

        'platform_admin' => [
            'classification' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'department' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'genericJobTitle' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'skill' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'skillFamily' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'community' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'user' => [
                'any' => ['create', 'view', 'update', 'delete'], // TODO: remove update and create during #10368 (Post-communities cleanup)
            ],
            'userSub' => [
                'any' => ['update'],
            ],
            'userBasicInfo' => [
                'any' => ['view'],
            ],
            'applicantProfile' => [
                'any' => ['view'],
            ],
            'pool' => [
                'any' => ['view'],
            ],
            'assessmentPlan' => [
                'any' => ['view'],
            ],
            'application' => [
                'any' => ['create'], // TODO: remove create any application permission during #10368 (Post-communities cleanup)
            ],
            'submittedApplication' => [
                'any' => ['view'],
            ],
            'applicationStatus' => [
                'any' => ['view'],
            ],
            'applicationAssessment' => [
                'any' => ['view'],
            ],
            'applicationDecision' => [
                'any' => ['view'],
            ],
            'applicationPlacement' => [
                'any' => ['view'],
            ],
            'searchRequest' => [
                'any' => ['view'],
            ],
            'teamMembers' => [
                'any' => ['view'],
            ],
            'team' => [
                'any' => ['view', 'create', 'update', 'delete'],
            ],
            'role' => [
                'any' => ['view', 'assign'],
            ],
            'directiveForm' => [
                'any' => ['create', 'view', 'update', 'delete'],
            ],
            'announcement' => [
                'any' => ['view', 'update'],
            ],
            'platformAdminMembership' => [
                'any' => ['update'],
            ],
            'communityAdminMembership' => [
                'any' => ['update'],
            ],
            'communityRecruiterMembership' => [
                'any' => ['update'],
            ],
            'processOperatorMembership' => [
                'any' => ['update'],
            ],
            'communityTeamMembers' => [
                'any' => ['view'],
            ],
            'poolTeamMembers' => [
                'any' => ['view'],
            ],
        ],
    ],
];
