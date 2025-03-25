export function isTestEnv() {
  return process?.env?.NODE_ENV == "test" || process?.env?.NODE_ENV == "TEST";
}

export function isNotTestEnv() {
  return !isTestEnv();
}
