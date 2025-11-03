import { getToken } from "@/utils/use.token";
import { apiClient } from "../utils/api.client.utils";
import { getUserFromLocalStorage } from "../utils/auth.helper";
import { APP } from "./const.config";

const token = getToken("cookie");
const getTokenFromStorage = getUserFromLocalStorage()?.accessToken;

const req = apiClient()
  .config({
    token: getTokenFromStorage || token,
  })
  .url(APP.HOSTING);

export const api = req.api();
