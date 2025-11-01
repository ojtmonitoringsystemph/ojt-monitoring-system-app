import type { EnvType } from "~/app/types/api-clients.types";

export const APP_HOSTING = [
  {
    key: "local1",
    type: "local" as EnvType,
    client: "http://localhost:5173",
    server: "http://localhost:5000/api",
  },
  {
    key: "dev1",
    type: "development" as EnvType,
    client: "https://ojt-ms-app.web.app",
    server: "https://ojt-api-dev-580c28274c50.herokuapp.com/api",
  },
  {
    key: "test1",
    type: "test" as EnvType,
    client: "https://healthlink-sandbox.web.app",
    server: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com/api",
  },
  {
    key: "test1",
    type: "test" as EnvType,
    client: "https://healthlink-test.web.app",
    server: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com/api",
  },
  {
    key: "test2",
    type: "test" as EnvType,
    client: "https://muntinlupa-emr.web.app",
    server: "https://ftcc-health-dev-api-789dc06ee50e.herokuapp.com/api",
  },
  {
    key: "prod0",
    type: "production" as EnvType,
    client: "https://ftcc-health-admin-prod.web.app",
    server: "https://healthlink-api-9dbcff95d862.herokuapp.com/api",
  },
  {
    key: "prod1",
    type: "production" as EnvType,
    client: "https://healthlink-app.ftcc.com.ph",
    server: "https://healthlink-api-9dbcff95d862.herokuapp.com/api",
  },
];

export const APP_SOCKET = [
  {
    key: "local1",
    type: "local",
    client: "http://localhost:5173",
    socket: "http://localhost:5000",
  },
  {
    key: "dev1",
    type: "development",
    client: "https://healthlink-develop.web.app",
    socket: "https://ftcc-health-dev-api-789dc06ee50e.herokuapp.com",
  },
  {
    key: "test1",
    type: "test",
    client: "https://healthlink-sandbox.web.app",
    socket: "https://healthlink-sandbox-api-8ebacbcc8646.herokuapp.com",
  },
];

export const APP_SECURITY = [
  {
    key: "local1",
    type: "local",
    client: "http://localhost:5173",
    isOn: false,
  },
  {
    key: "dev1",
    type: "development",
    client: "https://healthlink-develop.web.app",
    isOn: true,
  },
  {
    key: "test1",
    type: "test",
    client: "https://healthlink-sandbox.web.app",
    isOn: true,
  },
];
