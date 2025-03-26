import configKeys from "../config/keys";

export function isTestEnv() {
  return configKeys.appEnv == "test" || configKeys.appEnv == "TEST";
}

export function isNotTestEnv() {
  return !isTestEnv();
}
