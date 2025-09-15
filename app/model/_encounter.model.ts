import type { Interview } from "./interview.model";
import type { NCD } from "./ncd.model";
import type { Vital } from "./vitals.model";

export type EncounterForm = {
  interview?: Interview;
  ncd?: NCD;
  vital?: Vital;
};
