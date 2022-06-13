export const isTokenExpired = decodedJwt => {
  if (decodedJwt && decodedJwt.exp) {
    const now = new Date().getTime() / 1000;

    if (now < decodedJwt.exp) return true;
    return false;
  } else {
    return false;
  }
};

export const isWriter = (role: any): boolean => {
  if (!role) return false;

  return role === "writer";
};
