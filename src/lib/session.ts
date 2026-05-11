const MEMBER_SESSION_KEY = "aplusfcu_member_session";

export function getMemberSession(): string | null {
  try {
    return sessionStorage.getItem(MEMBER_SESSION_KEY);
  } catch {
    return null;
  }
}

export function setMemberSession(userId: string) {
  try {
    sessionStorage.setItem(MEMBER_SESSION_KEY, userId);
  } catch {}
}

export function clearMemberSession() {
  try {
    sessionStorage.removeItem(MEMBER_SESSION_KEY);
  } catch {}
}
