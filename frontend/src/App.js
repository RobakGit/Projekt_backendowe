import React, { useEffect, useState } from "react";
import "./App.css";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import Auth from "./views/Auth";
import Application from "./views/Application";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  return (
    <>
      {isLogin ? <Application /> : <Auth />}
      <NotificationContainer />
    </>
  );
};

export default App;
