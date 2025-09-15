import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export const routes: RouteConfig = [
  // Guest Routes
  // index("./routes/_index.tsx"),
  route("/login", "./pages/public/login.page.tsx"),
  layout("./components/templates/layout/_main.protected.layout.v2.tsx", [
    route("/", "./pages/private/index.page.tsx"),
    route("/accounts", "./pages/private/account.page.tsx"),
    route("/students", "./pages/private/student.page.tsx"),
    route("/coordinators", "./pages/private/coordinators.page.tsx"),
    route("/companies", "./pages/private/companies.page.tsx"),
    route("/enrollment", "./pages/private/enrollment.page.tsx"),
    route("/messages", "./pages/private/messages.page.tsx"),
    route("/announcement", "./pages/private/announcement.page.tsx"),
    route("/archives", "./pages/private/archives.page.tsx"),
    route("/tasks", "./pages/private/task.page.tsx"),
    route("/submitted-tasks", "./pages/private/submitted.task.page.tsx"),
    route("/reports", "./pages/private/reports.page.tsx"),
    route("/time-tracking", "./pages/private/time.tracking.page.tsx"),
    route("/upload", "./pages/private/upload.page.tsx"),
    route("/my-tasks", "./pages/private/my.task.page.tsx"),
    route("/history", "./pages/private/history.page.tsx"),
  ]),
  // layout("./components/templates/layout/_main.interview.layout.tsx", [
  //   route("counter/interview", "./routes/admin.counter.interview.tsx"),
  //   route("counter/vitals", "./routes/admin.counter.vitals.tsx"),
  //   route("counter/consultation", "./routes/admin.counter.consultation.tsx"),
  //   route("counter/pharmacy", "./routes/admin.counter.pharmacy.tsx"),
  // ]),

  //
  // ...prefix("concerts", [
  //   index("./concerts/home.tsx"),
  //   route(":city", "./concerts/city.tsx"),
  //   route("trending", "./concerts/trending.tsx"),
  // ]),

  // users
];

export default routes;
