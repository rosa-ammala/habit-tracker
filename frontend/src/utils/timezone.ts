// In future, we can refactor this function to get the user's 
// timezone from users own settings or store/API.
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}