import axios from "axios";
import config from "../../config";

export const getArticles = async () => {
  const { data } = await axios.get(config.api + "/article", {
    headers: { token: localStorage.getItem("token") },
  });
  return data;
};

export const getPayments = async () => {
  const { data } = await axios.get(config.api + "/access/payment", {
    headers: { token: localStorage.getItem("token") },
  });
  return data;
};

export const getArticle = async (articleUid) => {
  const { data } = await axios.get(config.api + "/article/" + articleUid, {
    headers: { token: localStorage.getItem("token") },
  });
  return data;
};

export const getBill = async (paymentUid) => {
  const { data } = await axios.get(config.api + "/access/" + paymentUid, {
    responseType: "blob",
    headers: { token: localStorage.getItem("token") },
  });
  return data;
};

export const makePayment = async (blik) => {
  const { data } = await axios.post(
    config.api + "/access/payment",
    { blik: blik, amount: 100 },
    {
      headers: { token: localStorage.getItem("token") },
    }
  );
  return data;
};

export const makeArticle = async (title, tag, content) => {
  const { data } = await axios.post(
    config.api + "/article",
    { title, tag, content },
    {
      headers: { token: localStorage.getItem("token") },
    }
  );
  return data;
};

export const updateArticle = async (title, tag, content, uid) => {
  const { data } = await axios.post(
    config.api + "/article/" + uid,
    { title, tag, content },
    {
      headers: { token: localStorage.getItem("token") },
    }
  );
  return data;
};
