export type EnvType = "local" | "test" | "development" | "production";

export interface UnifiedURLMapping {
  key: string;
  type: EnvType;
  client: string;
  server: string;
}
