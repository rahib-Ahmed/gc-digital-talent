import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales } from "@common/helpers/localize";
import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";
import useLocale from "@common/hooks/useLocale";
import lazyRetry from "@common/helpers/lazyRetry";
import { POST_LOGOUT_URI_KEY } from "@common/components/Auth/AuthenticationContainer";
import { defaultLogger } from "@common/hooks/useLogger";

import Layout from "~/components/Layout/Layout";
import AdminLayout from "~/components/Layout/AdminLayout";
import IAPLayout from "~/components/Layout/IAPLayout";
import { TalentRedirect, ProfileRedirect } from "~/components/Redirects";
import CreateAccountRedirect from "~/pages/Auth/CreateAccountPage/CreateAccountRedirect";
import { LegacyRole } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

/** Home */
const HomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsHomePage" */ "../pages/Home/HomePage/HomePage"
      ),
  ),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsErrorPage" */ "../pages/Errors/ErrorPage/ErrorPage"
      ),
  ),
);
const SupportPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSupportPage" */ "../pages/SupportPage/SupportPage"
      ),
  ),
);
const AccessibilityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsAccessibilityPage" */ "../pages/AccessibilityStatementPage/AccessibilityStatementPage"
      ),
  ),
);

/** Search */
const SearchPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSearchPage" */ "../pages/SearchRequests/SearchPage/SearchPage"
      ),
  ),
);
const RequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRequestPage" */ "../pages/SearchRequests/RequestPage/RequestPage"
      ),
  ),
);
const RequestConfirmationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRequestConfirmationPage" */ "../pages/SearchRequests/RequestConfirmationPage/RequestConfirmationPage"
      ),
  ),
);

/** Auth */
const RegisterPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRegisterPage" */ "../pages/Auth/RegisterPage/RegisterPage"
      ),
  ),
);
const LoggedOutPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoggedOutPage" */ "../pages/Auth/LoggedOutPage/LoggedOutPage"
      ),
  ),
);
const LoginPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoginPage" */ "../pages/Auth/LoginPage/LoginPage"
      ),
  ),
);

/** Profile */
const CreateAccountPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateAccountPage" */ "../pages/Auth/CreateAccountPage/CreateAccountPage"
      ),
  ),
);
const ProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsProfilePage" */ "../pages/Profile/ProfilePage/ProfilePage"
      ),
  ),
);
const GovernmentInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsGovInfoPage" */ "../pages/Profile/GovernmentInfoPage/GovernmentInfoPage"
      ),
  ),
);
const LanguageInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLangInfoPage" */ "../pages/Profile/LanguageInfoPage/LanguageInfoPage"
      ),
  ),
);
const WorkLocationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkLocationPage" */ "../pages/Profile/WorkLocationPage/WorkLocationPage"
      ),
  ),
);
const ExperienceFormPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEditExperiencePage" */ "../pages/Profile/ExperienceFormPage/ExperienceFormPage"
      ),
  ),
);
const WorkPreferencesPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkPrefPage" */ "../pages/Profile/WorkPreferencesPage/WorkPreferencesPage"
      ),
  ),
);
const AboutMePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsAboutMePage" */ "../pages/Profile/AboutMePage/AboutMePage"
      ),
  ),
);
const RoleSalaryPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRoleSalaryPage" */ "../pages/Profile/RoleSalaryPage/RoleSalaryPage"
      ),
  ),
);
const EmploymentEquityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEquityPage" */ "../pages/Profile/EmploymentEquityPage/EmploymentEquityPage"
      ),
  ),
);
const ExperienceAndSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsExperienceSkillsPage" */ "../pages/Profile/ExperienceAndSkillsPage/ExperienceAndSkillsPage"
      ),
  ),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsBrowsePoolsPage" */ "../pages/Pools/BrowsePoolsPage/BrowsePoolsPage"
      ),
  ),
);
const PoolAdvertisementPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsPoolAdvertPage" */ "../pages/Pools/PoolAdvertisementPage/PoolAdvertisementPage"
      ),
  ),
);
const CreateApplicationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateApplicationPage" */ "../pages/CreateApplicationPage/CreateApplicationPage"
      ),
  ),
);
const SignAndSubmitPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsSignSubmitPage" */ "../pages/Applications/SignAndSubmitPage/SignAndSubmitPage"
      ),
  ),
);
const MyApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsMyApplicationsPage" */ "../pages/Applications/MyApplicationsPage/MyApplicationsPage"
      ),
  ),
);
const ReviewApplicationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsReviewApplicationPage" */ "../pages/Applications/ReviewApplicationPage/ReviewApplicationPage"
      ),
  ),
);

/** IAP Home Page */
const IAPHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "iapHomePage" */ "../pages/Home/IAPHomePage/Home"
      ),
  ),
);

/** Admin */
const AdminHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminHomePage" */ "../pages/Home/AdminHomePage/AdminHomePage"
      ),
  ),
);
const AdminErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminErrorPage" */ "../pages/Errors/AdminErrorPage/AdminErrorPage"
      ),
  ),
);
const AdminDashboardPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminAdminDashboardPage" */ "../pages/AdminDashboardPage/AdminDashboardPage"
      ),
  ),
);

/** Users */
const IndexUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexUserPage" */ "../pages/Users/IndexUserPage/IndexUserPage"
      ),
  ),
);
const CreateUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateUserPage" */ "../pages/Users/CreateUserPage/CreateUserPage"
      ),
  ),
);
const UserLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUserLayout" */ "../pages/Users/UserLayout"
      ),
  ),
);
const UpdateUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateUserPage" */ "../pages/Users/UpdateUserPage/UpdateUserPage"
      ),
  ),
);
const ViewUserPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewUserPage" */ "../pages/Users/ViewUserPage/ViewUserPage"
      ),
  ),
);
const ViewUserPageV2 = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewUserPage" */ "../pages/Users/ViewUserPageV2/ViewUserPage"
      ),
  ),
);
const UserPlacementPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUserPlacementPage" */ "../pages/Users/UserPlacementPage/UserPlacementPage"
      ),
  ),
);

/** Teams */
const IndexTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexTeamPage" */ "../pages/Teams/IndexTeamPage/IndexTeamPage"
      ),
  ),
);
const CreateTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateTeamPage" */ "../pages/Teams/CreateTeamPage/CreateTeamPage"
      ),
  ),
);
const ViewTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewTeamPage" */ "../pages/Teams/ViewTeamPage/ViewTeamPage"
      ),
  ),
);
const UpdateTeamPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateTeamPage" */ "../pages/Teams/UpdateTeamPage/UpdateTeamPage"
      ),
  ),
);
const TeamMembersPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminTeamMembersPage" */ "../pages/Teams/TeamMembersPage/TeamMembersPage"
      ),
  ),
);

/** Classifications */
const IndexClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexClassificationPage" */ "../pages/Classifications/IndexClassificationPage"
      ),
  ),
);
const CreateClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateClassificationPage" */ "../pages/Classifications/CreateClassificationPage"
      ),
  ),
);
const UpdateClassificationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateClassificationPage" */ "../pages/Classifications/UpdateClassificationPage"
      ),
  ),
);

/** Pool Candidates */
const IndexPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexPoolCandidatePage" */ "../pages/PoolCandidates/IndexPoolCandidatePage/IndexPoolCandidatePage"
      ),
  ),
);
const ViewPoolCandidatePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewPoolCandidate" */ "../pages/PoolCandidates/ViewPoolCandidatePage/ViewPoolCandidatePage"
      ),
  ),
);

/** Pools */
const IndexPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexPoolPage" */ "../pages/Pools/IndexPoolPage/IndexPoolPage"
      ),
  ),
);
const CreatePoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreatePoolPage" */ "../pages/Pools/CreatePoolPage/CreatePoolPage"
      ),
  ),
);
const EditPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminEditPoolPage" */ "../pages/Pools/EditPoolPage/EditPoolPage"
      ),
  ),
);
const PoolLayout = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminPoolLayout" */ "../pages/Pools/PoolLayout"
      ),
  ),
);
const ViewPoolPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewPoolPage" */ "../pages/Pools/ViewPoolPage/ViewPoolPage"
      ),
  ),
);

/** Departments */
const IndexDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexDepartmentPage" */ "../pages/Departments/IndexDepartmentPage"
      ),
  ),
);
const CreateDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateDepartmentPage" */ "../pages/Departments/CreateDepartmentPage"
      ),
  ),
);
const UpdateDepartmentPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateDepartmentPage" */ "../pages/Departments/UpdateDepartmentPage"
      ),
  ),
);

/** Skill Families */
const IndexSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSkillFamilyPage" */ "../pages/SkillFamilies/IndexSkillFamilyPage"
      ),
  ),
);
const CreateSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateSkillFamilyPage" */ "../pages/SkillFamilies/CreateSkillFamilyPage"
      ),
  ),
);
const UpdateSkillFamilyPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateSkillFamilyPage" */ "../pages/SkillFamilies/UpdateSkillFamilyPage"
      ),
  ),
);

/** Skills */
const IndexSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSkillPage" */ "../pages/Skills/IndexSkillPage"
      ),
  ),
);
const CreateSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminCreateSkillPage" */ "../pages/Skills/CreateSkillPage"
      ),
  ),
);
const UpdateSkillPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminUpdateSkillPage" */ "../pages/Skills/UpdateSkillPage"
      ),
  ),
);

/** Search Requests */
const IndexSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminIndexSearchRequestPage" */ "../pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage"
      ),
  ),
);
const ViewSearchRequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "adminViewSearchRequestPage" */ "../pages/SearchRequests/ViewSearchRequestPage/ViewSearchRequestPage"
      ),
  ),
);

const createRoute = (locale: Locales, loginPath: string) =>
  createBrowserRouter([
    {
      path: `/`,
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: locale,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: "support",
              element: <SupportPage />,
            },
            {
              path: "accessibility-statement",
              element: <AccessibilityPage />,
            },
            {
              path: "search",
              children: [
                {
                  index: true,
                  element: <SearchPage />,
                },
                {
                  path: "request",
                  children: [
                    {
                      index: true,
                      element: <RequestPage />,
                    },
                    {
                      path: ":requestId",
                      element: <RequestConfirmationPage />,
                    },
                  ],
                },
              ],
            },
            {
              path: "register-info",
              element: <RegisterPage />,
            },
            {
              path: "logged-out",
              loader: async () => {
                const redirectUri = sessionStorage.getItem(POST_LOGOUT_URI_KEY);
                if (redirectUri) {
                  sessionStorage.removeItem(POST_LOGOUT_URI_KEY);
                  if (redirectUri.startsWith("/")) {
                    window.location.href = redirectUri; // do a hard redirect here because redirectUri may exist in another router entrypoint (eg admin)
                    return null;
                  }
                  defaultLogger.warning(
                    `Retrieved an unsafe uri from POST_LOGOUT_URI: ${redirectUri}`,
                  );
                }
                return null;
              },
              element: <LoggedOutPage />,
            },
            {
              path: "login-info",
              element: <LoginPage />,
            },
            {
              path: "create-account",
              element: (
                <RequireAuth
                  roles={[LegacyRole.Applicant]}
                  loginPath={loginPath}
                >
                  <CreateAccountPage />
                </RequireAuth>
              ),
            },
            {
              path: "users",
              // Redirect any route in this section to /create-account
              // if no email is set
              element: <CreateAccountRedirect />,
              children: [
                {
                  path: "me",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Applicant]}
                      loginPath={loginPath}
                    >
                      <ProfileRedirect />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  children: [
                    {
                      path: "profile",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <ProfilePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "about-me/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <AboutMePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "government-info/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <GovernmentInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "language-info/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <LanguageInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-location/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <WorkLocationPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-preferences/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <WorkPreferencesPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "employment-equity/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <EmploymentEquityPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "role-salary-expectations/edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <RoleSalaryPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "experiences",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth
                                  roles={[LegacyRole.Applicant]}
                                  loginPath={loginPath}
                                >
                                  <ExperienceAndSkillsPage />
                                </RequireAuth>
                              ),
                            },
                            {
                              path: ":experienceType",
                              children: [
                                {
                                  path: "create",
                                  element: (
                                    <RequireAuth
                                      roles={[LegacyRole.Applicant]}
                                      loginPath={loginPath}
                                    >
                                      <ExperienceFormPage />
                                    </RequireAuth>
                                  ),
                                },
                                {
                                  path: ":experienceId",
                                  children: [
                                    {
                                      path: "edit",
                                      element: (
                                        <RequireAuth
                                          roles={[LegacyRole.Applicant]}
                                          loginPath={loginPath}
                                        >
                                          <ExperienceFormPage edit />
                                        </RequireAuth>
                                      ),
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      path: "applications",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Applicant]}
                          loginPath={loginPath}
                        >
                          <MyApplicationsPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "browse",
              children: [
                {
                  path: "pools",
                  children: [
                    {
                      index: true,
                      element: <BrowsePoolsPage />,
                    },
                    {
                      path: ":poolId",
                      children: [
                        {
                          index: true,
                          element: <PoolAdvertisementPage />,
                        },
                        {
                          path: "create-application",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <CreateApplicationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "applications",
                  children: [
                    {
                      path: ":poolCandidateId",
                      children: [
                        {
                          path: "submit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <SignAndSubmitPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "apply",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Applicant]}
                              loginPath={loginPath}
                            >
                              <ReviewApplicationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "talent/profile/*",
              element: (
                <RequireAuth
                  roles={[LegacyRole.Applicant]}
                  loginPath={loginPath}
                >
                  <TalentRedirect />
                </RequireAuth>
              ),
            },
            {
              path: "*",
              loader: () => {
                throw new Response("Not Found", { status: 404 });
              },
            },
          ],
        },
        {
          path: "*",
          loader: () => {
            throw new Response("Not Found", { status: 404 });
          },
        },
      ],
    },
    {
      path: `${locale}/admin`,
      element: <AdminLayout />,
      errorElement: <AdminErrorPage />,
      children: [
        {
          errorElement: <AdminErrorPage />,
          children: [
            {
              path: "",
              element: <AdminHomePage />,
            },
            {
              path: "dashboard",
              element: (
                <RequireAuth roles={[LegacyRole.Admin]} loginPath={loginPath}>
                  <AdminDashboardPage />
                </RequireAuth>
              ),
            },
            {
              path: "users",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <IndexUserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <CreateUserPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":userId",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <UserLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <ViewUserPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "profile",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <ViewUserPageV2 />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "placement",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <UserPlacementPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <UpdateUserPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "teams",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <IndexTeamPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <CreateTeamPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":teamId",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <ViewTeamPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <UpdateTeamPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "members",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <TeamMembersPage />
                        </RequireAuth>
                      ),
                    },
                  ],
                },
              ],
            },
            {
              path: "pools",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <IndexPoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: "create",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <CreatePoolPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":poolId",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <PoolLayout />
                    </RequireAuth>
                  ),
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <ViewPoolPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "edit",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <EditPoolPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "pool-candidates",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <IndexPoolCandidatePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: ":poolCandidateId",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth
                                  roles={[LegacyRole.Admin]}
                                  loginPath={loginPath}
                                >
                                  <ViewPoolCandidatePage />
                                </RequireAuth>
                              ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "candidates/:poolCandidateId/application",
              element: (
                <RequireAuth roles={[LegacyRole.Admin]} loginPath={loginPath}>
                  <ViewPoolCandidatePage />
                </RequireAuth>
              ),
            },
            {
              path: "talent-requests",
              children: [
                {
                  index: true,
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <IndexSearchRequestPage />
                    </RequireAuth>
                  ),
                },
                {
                  path: ":searchRequestId",
                  element: (
                    <RequireAuth
                      roles={[LegacyRole.Admin]}
                      loginPath={loginPath}
                    >
                      <ViewSearchRequestPage />
                    </RequireAuth>
                  ),
                },
              ],
            },
            {
              path: "settings",
              children: [
                {
                  path: "classifications",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <IndexClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <CreateClassificationPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":classificationId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <UpdateClassificationPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "departments",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <IndexDepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <CreateDepartmentPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":departmentId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <UpdateDepartmentPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                  ],
                },
                {
                  path: "skills",
                  children: [
                    {
                      index: true,
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <IndexSkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: "create",
                      element: (
                        <RequireAuth
                          roles={[LegacyRole.Admin]}
                          loginPath={loginPath}
                        >
                          <CreateSkillPage />
                        </RequireAuth>
                      ),
                    },
                    {
                      path: ":skillId",
                      children: [
                        {
                          path: "edit",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <UpdateSkillPage />
                            </RequireAuth>
                          ),
                        },
                      ],
                    },
                    {
                      path: "families",
                      children: [
                        {
                          index: true,
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <IndexSkillFamilyPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "create",
                          element: (
                            <RequireAuth
                              roles={[LegacyRole.Admin]}
                              loginPath={loginPath}
                            >
                              <CreateSkillFamilyPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: ":skillFamilyId",
                          children: [
                            {
                              path: "edit",
                              element: (
                                <RequireAuth
                                  roles={[LegacyRole.Admin]}
                                  loginPath={loginPath}
                                >
                                  <UpdateSkillFamilyPage />
                                </RequireAuth>
                              ),
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: "*",
              loader: () => {
                throw new Response("Not Found", { status: 404 });
              },
            },
          ],
        },
      ],
    },
    {
      path: `${locale}/indigenous-it-apprentice`,
      element: <IAPLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <IAPHomePage />,
        },
        {
          path: "*",
          loader: () => {
            throw new Response("Not Found", { status: 404 });
          },
        },
      ],
    },
  ]);

const Router = () => {
  const { locale } = useLocale();
  const routes = useRoutes();
  const router = createRoute(locale, routes.login());
  return <RouterProvider router={router} fallbackElement={<Loading />} />;
};

export default Router;
