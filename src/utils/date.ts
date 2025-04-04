export const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
export const minutesToSeconds = (minutes: number) => minutes * 60;
export const daysToSeconds = (days: number) => days * 24 * 60 * 60;
export const daysToMilliseconds = (days: number) => days * 24 * 60 * 60 * 1000;

export const nMinutesFromNow = (n: number) => new Date().getTime() + minutesToMilliseconds(n);
