import { getToken } from "@/utils/use.token";
import { apiClient } from "../utils/api.client.utils";

const token = getToken("cookie");

const req = apiClient()
  .config({
    token: token,
  })
  .url([
    {
      key: "local1",
      type: "local",
      client: "http://localhost:5173",
      server: "http://localhost:5000/api",
    },
    {
      key: "dev1",
      type: "development",
      client: "https://ftcc-health-admin-dev.web.app",
      server: "https://ftcc-health-dev-api-789dc06ee50e.herokuapp.com/api",
    },
    {
      key: "test1",
      type: "test",
      client: "https://healthlink-sandbox.web.app",
      server: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com/api",
    },
    {
      key: "test1",
      type: "test",
      client: "https://healthlink-test.web.app",
      server: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com/api",
    },
    {
      key: "prod0",
      type: "production",
      client: "https://ftcc-health-admin-prod.web.app",
      server: "https://healthlink-api-9dbcff95d862.herokuapp.com/api",
    },
    {
      key: "prod1",
      type: "production",
      client: "https://healthlink-app.ftcc.com.ph",
      server: "https://healthlink-api-9dbcff95d862.herokuapp.com/api",
    },
  ]);

export const api = req.api();
