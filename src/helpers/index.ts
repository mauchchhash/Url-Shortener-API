import configKeys from "../config/keys";

export function isTestEnv() {
  return configKeys.appEnv == "test" || configKeys.appEnv == "TEST";
}

export function isNotTestEnv() {
  return !isTestEnv();
}

export function isDevEnv() {
  return configKeys.appEnv == "development" || configKeys.appEnv == "DEVELOPMENT";
}

export function isNotDevEnv() {
  return !isDevEnv();
}

export function isProdEnv() {
  return configKeys.appEnv == "production" || configKeys.appEnv == "PRODUCTION";
}

export function isNotProdEnv() {
  return !isProdEnv();
}
