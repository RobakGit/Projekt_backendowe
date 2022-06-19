import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import {
  getArticle,
  getArticles,
  getBill,
  getPayments,
  makeArticle,
  makePayment,
  updateArticle,
} from "../../actions/App";
import Article from "./Article";

const Application = () => {
  const [articles, setArticles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [articleUid, setArticleUid] = useState();
  const [blik, setBlik] = useState();
  const [title, setTitle] = useState();
  const [tag, setTag] = useState();
  const [content, setContent] = useState();
  const [eddited, setEddited] = useState();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const downloadBill = async (uid) => {
    await getBill(uid)
      .then((res) => {
        const file = new Blob([res], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((err) => {
        NotificationManager.error(err.toString());
      });
  };

  const buyAccess = async () => {
    NotificationManager.info("Płatność w toku");
    await makePayment(blik)
      .then(() => {
        getPayments().then((res) => {
          setPayments([...res]);
          NotificationManager.success("wykupiono dostęp");
        });
      })
      .catch((err) => {
        NotificationManager.error(err.toString());
      });
  };

  const addArticle = async () => {
    if (eddited) {
      await updateArticle(title, tag, content, eddited)
        .then(() => {
          getArticles().then((res) => {
            setArticles([...res]);
            NotificationManager.success("Zaktualizowano");
          });
        })
        .catch((err) => {
          NotificationManager.error(err.toString());
        });
    } else {
      await makeArticle(title, tag, content)
        .then(() => {
          getArticles().then((res) => {
            setArticles([...res]);
            NotificationManager.success("Dodano");
          });
        })
        .catch((err) => {
          NotificationManager.error(err.toString());
        });
    }
  };

  const edit = async (uid) => {
    setEddited(uid);
    await getArticle(uid)
      .then((res) => {
        setTitle(res.title);
        setTag(res.tag);
        setContent(res.content);
      })
      .catch((err) => {
        setEddited();
        console.error(err);
        NotificationManager.error(err.toString());
      });
  };

  useEffect(() => {
    (async () => {
      await getArticles()
        .then((res) => {
          setArticles([...res]);
        })
        .catch((err) => {
          logout();
          console.error(err);
          NotificationManager.error(err.toString());
        });
      await getPayments()
        .then((res) => {
          setPayments([...res]);
        })
        .catch((err) => {
          logout();
          console.error(err);
          NotificationManager.error(err.toString());
        });
    })();
  }, []);

  if (articleUid)
    return <Article articleUid={articleUid} setArticleUid={setArticleUid} />;

  return (
    <>
      app <button onClick={logout}>Wyloguj</button>
      <h3>Artykuły</h3>
      <table>
        <th>tytuł</th>
        <th>data</th>
        <th>autor</th>
        <th>tag</th>
        <th>akcje</th>
        {articles.map((article) => {
          return (
            <tr>
              <td onClick={() => setArticleUid(article.uid)}>
                {article.title}
              </td>
              <td onClick={() => setArticleUid(article.uid)}>
                {article.createdAt.slice(0, 10)}
              </td>
              <td onClick={() => setArticleUid(article.uid)}>
                {article.user.name}
              </td>
              <td onClick={() => setArticleUid(article.uid)}>{article.tag}</td>
              <td>
                <button onClick={() => edit(article.uid)}>edytuj</button>
              </td>
            </tr>
          );
        })}
      </table>
      <h2>Platnosci</h2>
      <table>
        <th>dostęp od</th>
        <th>dostęp do</th>
        <th>kwota</th>
        <th>faktura</th>
        {payments.map((payment) => {
          return (
            <tr>
              <td>{payment.createdAt.slice(0, 10)}</td>
              <td>{payment.endedAt.slice(0, 10)}</td>
              <td>{payment.payments.amount} pln</td>
              <td>
                <button onClick={() => downloadBill(payment.payments.uid)}>
                  pobierz
                </button>
              </td>
            </tr>
          );
        })}
      </table>
      <input
        placeholder="BLIK"
        type="number"
        onChange={(e) => setBlik(e.target.value)}
        value={blik}
      ></input>
      <button onClick={buyAccess}>Wykup dostęp</button>
      <h2>Nowy artykuł</h2>
      <input
        type="text"
        placeholder="tytuł"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      ></input>
      <select onChange={(e) => setTag(e.target.value)} value={tag}>
        <option>sport</option>
        <option>electronics</option>
        <option>programming</option>
      </select>
      <br />
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        placeholder="treść"
        cols="35"
        rows="10"
      ></textarea>
      <div style={{ display: "inline-block" }}>
        {eddited && (
          <button onClick={() => setEddited()}>zakończ edycję</button>
        )}
        <br />
        <button onClick={addArticle}>
          {eddited ? "Aktualizuj artykuł" : "Dodaj artykuł"}
        </button>
      </div>
    </>
  );
};

export default Application;
