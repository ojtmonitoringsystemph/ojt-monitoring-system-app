import type { ReactNode } from "react";

// Decode JWT payload (base64)
function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Get user and token from localStorage
export function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null; // SSR check

  try {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Adjust property check to your stored object
    if (parsed && typeof parsed === "object" && "accessToken" in parsed) {
      return parsed;
    }

    return null;
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    return null;
  }
}

// Check if token is valid (exists & not expired)
function isTokenValid(token?: string) {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded?.exp || typeof decoded.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
}

// Helper for authentication check
export function isAuthenticated(
  renderIfTrue: ReactNode,
  renderIfFalse: ReactNode = null
) {
  return function AuthWrapper() {
    const stored = getUserFromLocalStorage();
    const valid = stored?.token && isTokenValid(stored.token);
    return <>{valid ? renderIfTrue : renderIfFalse}</>;
  };
}

// Helper for role check
export function isRole(
  requiredRole: string,
  renderIfTrue: ReactNode,
  renderIfFalse: ReactNode = null
) {
  return function RoleWrapper() {
    const stored = getUserFromLocalStorage();
    const valid = stored?.token && isTokenValid(stored.token);
    return (
      <>
        {valid && stored.user?.role === requiredRole
          ? renderIfTrue
          : renderIfFalse}
      </>
    );
  };
}
