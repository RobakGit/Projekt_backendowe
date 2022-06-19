import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import {
  getArticles,
  getBill,
  getPayments,
  makePayment,
} from "../../actions/App";
import Article from "./Article";

const Application = () => {
  const [articles, setArticles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [articleUid, setArticleUid] = useState();
  const [blik, setBlik] = useState();

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
    await makePayment(blik)
      .then(setPayments([]))
      .catch((err) => {
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
  }, [payments]);

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
        {articles.map((article) => {
          return (
            <tr onClick={() => setArticleUid(article.uid)}>
              <td>{article.title}</td>
              <td>{article.createdAt.slice(0, 10)}</td>
              <td>{article.user.name}</td>
              <td>{article.tag}</td>
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
    </>
  );
};

export default Application;
