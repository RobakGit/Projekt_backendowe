import axios from "axios";
import config from "../../config";

export const getJwt = async (name, password) => {
  const { data } = await axios.post(config.api + "/auth", {
    name,
    password,
  });

  return data;
};

export const register = async (email, name, password, firstName, lastName) => {
  const { data } = await axios.post(config.api + "/user", {
    email,
    name,
    password,
    firstName,
    lastName,
  });

  return data;
};
