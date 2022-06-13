import { NotImplementedException } from "@nestjs/common";

export const isTokenExpired = decodedJwt => {
  if (decodedJwt && decodedJwt.exp) {
    const now = new Date().getTime() / 1000;

    if (now < decodedJwt.exp) return true;
    return false;
  } else {
    return false;
  }
};

export const isAdmin = (role: any): boolean => {
  if (!role) return false;

  return role === "admin";
};

export const isWriter = (role: any): boolean => {
  if (!role) return false;

  return role === "writer" || role === "admin";
};

export const isReader = (role: any): boolean => {
  if (!role) return false;

  return role === "reader" || role === "writer" || role === "admin";
};

export const haveAccess = () => {
  throw new NotImplementedException();
};
