import { MAIN_NAVIGATION, PORTAL_NAV } from "./const/navigation.const";
import { ENCOUNTER_FEATURES_TAB, PATIENT_PORTAL_TAB } from "./const/tab.const";
import { MEDICAL_HISTORY_LIBRARY } from "./const/library.const";
import { REGISTRATION_METHOD } from "./const/method.const";
import {
  PATIENT_PORTAL_MAIN_PAGE,
  PATIENT_PORTAL_VIEWS_PAGE,
} from "./const/page.const";
import { APP_HOSTING, APP_SECURITY, APP_SOCKET } from "./const/app.const";

export const APP = {
  HOSTING: APP_HOSTING,
  SOCKET: APP_SOCKET,
  SECURITY: APP_SECURITY,
};

export const NAVIGATION = {
  MAIN: MAIN_NAVIGATION,
  PORTAL: PORTAL_NAV,
};

export const PAGE = {
  PATIENT_PORTAL: {
    MAIN: PATIENT_PORTAL_MAIN_PAGE,
    VIEWS: PATIENT_PORTAL_VIEWS_PAGE,
  },
};

export const TAB = {
  PATIENT_PORTAL: PATIENT_PORTAL_TAB,
  ENCOUNTER_FEATURES: ENCOUNTER_FEATURES_TAB,
};

export const LIBRARY = {
  MEDICAL_HISTORY: MEDICAL_HISTORY_LIBRARY,
};

export const METHOD = {
  REGISTRATION: REGISTRATION_METHOD,
};
