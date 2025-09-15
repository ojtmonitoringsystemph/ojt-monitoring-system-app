// Example decrypt function
export const getToken = (storageType: "local" | "session" | "cookie") => {
  try {
    let auth: any = {};

    if (storageType === "local") {
      auth = JSON.parse(localStorage.getItem("auth") || "{}");
    } else if (storageType === "session") {
      auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
    } else if (storageType === "cookie") {
      const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
      if (match) {
        auth = JSON.parse(decodeURIComponent(match[1]));
      }
    }

    return auth.token || null;
  } catch {
    return null;
  }
};

export const getUser = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    return auth.user || null;
  } catch {
    return null;
  }
};
