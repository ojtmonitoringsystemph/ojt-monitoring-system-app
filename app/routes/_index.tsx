import type { MetaFunction } from "react-router";
import { isAuthenticated, isRole } from "../utils/auth.helper";

import MainProtectedLayout from "../components/templates/layout/_main.protected.layout.v2.children";
import { SamplePage } from "../pages/sample.page";

export const meta: MetaFunction = () => {
  return [
    { title: "HealthLink | Login" },
    {
      name: "description",
      content: "Electronic Medical Records system for FTCC.",
    },
  ];
};

export default function UserLogin() {
  const Authenticated = isAuthenticated(
    // render if authenticated
    <div>
      {isRole(
        "admin",
        <MainProtectedLayout>
          <SamplePage />
        </MainProtectedLayout>,
        <></>
      )()}{" "}
      {isRole("user", <SamplePage />, <></>)()}
    </div>,
    // render if not authenticated
    <div>
      <SamplePage />
    </div>
  );

  return (
    <>
      <Authenticated />
    </>
  );
}
