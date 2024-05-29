import { Pool } from "@gc-digital-talent/graphql";

import { test, expect } from "~/fixtures";
import PoolPage from "~/fixtures/PoolPage";
import TeamPage from "~/fixtures/TeamPage";
import { getDCM } from "~/utils/teams";
import { getClassifications } from "~/utils/classification";
import { loginBySub } from "~/utils/auth";

test.describe("Process", () => {
  const uniqueTestId = Date.now().valueOf();
  const unassociatedSub = `playwright.sub.unassociated.${uniqueTestId}`;
  const unassociatedPoolManagerEmail = `${unassociatedSub}@example.org`;
  const associatedSub = `playwright.sub.associated.${uniqueTestId}`;
  const associatedPoolManagerEmail = `${associatedSub}@example.org`;
  const poolName = `pool auth test ${uniqueTestId}`;

  let pool: Pool;

  test.beforeAll(async ({ adminPage }) => {
    const poolPage = new PoolPage(adminPage.page);
    const teamPage = new TeamPage(adminPage.page);

    const orphanTeam = await teamPage.createTeam({
      name: `orphan-team.${uniqueTestId}`,
    });

    const unassociatedPoolManager = await adminPage.createUser({
      email: unassociatedPoolManagerEmail,
      sub: unassociatedSub,
    });

    await adminPage.addRolesToUser(unassociatedPoolManager.id, [
      "guest",
      "base_user",
      "applicant",
    ]);

    await adminPage.addRolesToUser(
      unassociatedPoolManager.id,
      ["pool_manager"],
      orphanTeam.id,
    );

    const team = await getDCM();

    const associatedPoolManager = await adminPage.createUser({
      email: associatedPoolManagerEmail,
      sub: associatedSub,
    });

    await adminPage.addRolesToUser(associatedPoolManager.id, [
      "guest",
      "base_user",
      "applicant",
    ]);

    await adminPage.addRolesToUser(
      associatedPoolManager.id,
      ["pool_operator"],
      team.id,
    );

    const classifications = await getClassifications();
    const createdPool = await poolPage.createPool(
      associatedPoolManager.id,
      team.id,
      {
        classification: {
          connect: classifications[0].id,
        },
      },
    );

    await poolPage.updatePool(createdPool.id, {
      name: {
        en: poolName,
        fr: poolName,
      },
    });

    pool = createdPool;
  });

  test("Platform admin can view", async ({ appPage }) => {
    await loginBySub(appPage.page, "admin@test.com");

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });

  test("Community manager can view", async ({ appPage }) => {
    await loginBySub(appPage.page, "community@test.com");

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });

  test("Associated pool manager can view", async ({ appPage }) => {
    await loginBySub(appPage.page, associatedSub);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);
    await appPage.waitForGraphqlResponse("PoolLayout");

    await expect(
      appPage.page.getByRole("heading", {
        name: new RegExp(poolName, "i"),
      }),
    ).toBeVisible();
  });

  test("Unassociated pool manager cannot view", async ({ appPage }) => {
    await loginBySub(appPage.page, unassociatedSub);

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);

    await expect(
      appPage.page.getByRole("heading", {
        name: /not authorized to view this page/i,
      }),
    ).toBeVisible();
  });

  test("Request responder cannot view", async ({ appPage }) => {
    await loginBySub(appPage.page, "request@test.com");

    await appPage.page.goto(`/en/admin/pools/${pool.id}`);

    await expect(
      appPage.page.getByText(/this action is unauthorized/i).first(),
    ).toBeVisible();
  });
});
