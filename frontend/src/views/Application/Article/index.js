import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { getArticle } from "../../../actions/App";

const Article = ({ articleUid, setArticleUid }) => {
  const [article, setArticle] = useState({});

  useEffect(() => {
    (async () => {
      await getArticle(articleUid)
        .then((res) => {
          setArticle(res);
        })
        .catch((err) => {
          setArticleUid();
          console.error(err);
          NotificationManager.error(err.toString());
        });
    })();
  }, [articleUid, setArticleUid]);

  return (
    <>
      <button onClick={() => setArticleUid()}>Wróć</button>
      <h3>{article.title}</h3>
      <span>{article.user && article.user.name}</span>{" "}
      <span>{article.tag}</span>
      <p>{article.content}</p>
    </>
  );
};

export default Article;
