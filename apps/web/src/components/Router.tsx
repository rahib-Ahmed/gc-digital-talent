import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Locales } from "@common/helpers/localize";
import Loading from "@common/components/Pending/Loading";
import RequireAuth from "@common/components/RequireAuth/RequireAuth";
import useLocale from "@common/hooks/useLocale";
import lazyRetry from "@common/helpers/lazyRetry";

import Layout, { IAPLayout } from "~/components/Layout";
import { TalentRedirect, ProfileRedirect } from "~/components/Redirects";
import CreateAccountRedirect from "~/pages/CreateAccountPage/CreateAccountRedirect";
import { Role } from "~/api/generated";

/** Home */
const HomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "tsHomePage" */ "../pages/HomePage/HomePage"),
  ),
);
const ErrorPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsErrorPage" */ "../pages/ErrorPage/ErrorPage"
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
        /* webpackChunkName: "tsSearchPage" */ "../pages/SearchPage/SearchPage"
      ),
  ),
);
const RequestPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRequestPage" */ "../pages/RequestPage/RequestPage"
      ),
  ),
);

/** Auth */
const RegisterPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsRegisterPage" */ "../pages/RegisterPage/RegisterPage"
      ),
  ),
);
const LoggedOutPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoggedOutPage" */ "../pages/LoggedOutPage/LoggedOutPage"
      ),
  ),
);
const LoginPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLoginPage" */ "../pages/LoginPage/LoginPage"
      ),
  ),
);

/** Profile */
const CreateAccountPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsCreateAccountPage" */ "../pages/CreateAccountPage/CreateAccountPage"
      ),
  ),
);
const ProfilePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsProfilePage" */ "../pages/ProfilePage/ProfilePage"
      ),
  ),
);
const GovernmentInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsGovInfoPage" */ "../pages/GovernmentInfoPage/GovernmentInfoPage"
      ),
  ),
);
const LanguageInfoPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsLangInfoPage" */ "../pages/LanguageInfoPage/LanguageInfoPage"
      ),
  ),
);
const WorkLocationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkLocationPage" */ "../pages/WorkLocationPage/WorkLocationPage"
      ),
  ),
);
const ExperienceFormPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEditExperiencePage" */ "../pages/ExperienceFormPage/ExperienceFormPage"
      ),
  ),
);
const WorkPreferencesPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsWorkPrefPage" */ "../pages/WorkPreferencesPage/WorkPreferencesPage"
      ),
  ),
);
const AboutMePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsAboutMePage" */ "../pages/AboutMePage/AboutMePage"
      ),
  ),
);
const EmploymentEquityPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsEquityPage" */ "../pages/EmploymentEquityPage/EmploymentEquityPage"
      ),
  ),
);
const ExperienceAndSkillsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsExperienceSkillsPage" */ "../pages/ExperienceAndSkillsPage/ExperienceAndSkillsPage"
      ),
  ),
);

/** Direct Intake */
const BrowsePoolsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsBrowsePoolsPage" */ "../pages/BrowsePoolsPage/BrowsePoolsPage"
      ),
  ),
);
const PoolAdvertisementPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsPoolAdvertPage" */ "../pages/PoolAdvertisementPage/PoolAdvertisementPage"
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
        /* webpackChunkName: "tsSignSubmitPage" */ "../pages/SignAndSubmitPage/SignAndSubmitPage"
      ),
  ),
);
const MyApplicationsPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsMyApplicationsPage" */ "../pages/MyApplicationsPage/MyApplicationsPage"
      ),
  ),
);
const ReviewApplicationPage = React.lazy(() =>
  lazyRetry(
    () =>
      import(
        /* webpackChunkName: "tsReviewApplicationPage" */ "../pages/ReviewApplicationPage/ReviewApplicationPage"
      ),
  ),
);

/** IAP Home Page */
const IAPHomePage = React.lazy(() =>
  lazyRetry(
    () =>
      import(/* webpackChunkName: "iapHomePage" */ "../pages/IAPHomePage/Home"),
  ),
);

const createRoute = (locale: Locales) =>
  createBrowserRouter([
    {
      path: `/${locale}`,
      children: [
        {
          path: "/",
          element: <Layout />,
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
                  element: <RequestPage />,
                },
              ],
            },
            {
              path: "register-info",
              element: <RegisterPage />,
            },
            {
              path: "logged-out",
              element: <LoggedOutPage />,
            },
            {
              path: "login-info",
              element: <LoginPage />,
            },
            {
              path: "create-account",
              element: (
                <RequireAuth roles={[Role.Applicant]}>
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
                    <RequireAuth roles={[Role.Applicant]}>
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
                            <RequireAuth roles={[Role.Applicant]}>
                              <ProfilePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "about-me/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <AboutMePage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "government-info/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <GovernmentInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "language-info/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <LanguageInfoPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-location/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <WorkLocationPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "work-preferences/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <WorkPreferencesPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "employment-equity/edit",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
                              <EmploymentEquityPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "experiences",
                          children: [
                            {
                              index: true,
                              element: (
                                <RequireAuth roles={[Role.Applicant]}>
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
                                    <RequireAuth roles={[Role.Applicant]}>
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
                                        <RequireAuth roles={[Role.Applicant]}>
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
                        <RequireAuth roles={[Role.Applicant]}>
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
                            <RequireAuth roles={[Role.Applicant]}>
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
                            <RequireAuth roles={[Role.Applicant]}>
                              <SignAndSubmitPage />
                            </RequireAuth>
                          ),
                        },
                        {
                          path: "apply",
                          element: (
                            <RequireAuth roles={[Role.Applicant]}>
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
                <RequireAuth roles={[Role.Applicant]}>
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
          path: "indigenous-it-apprentice",
          element: <IAPLayout />,
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <IAPHomePage />,
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
  ]);

const Router = () => {
  const { locale } = useLocale();
  const router = createRoute(locale);
  return <RouterProvider router={router} fallbackElement={<Loading />} />;
};

export default Router;
