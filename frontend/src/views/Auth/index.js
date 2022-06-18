import React, { useState } from "react";
import { NotificationManager } from "react-notifications";

import { getJwt, register } from "../../actions/Auth";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [surrname, setSurrname] = useState("");

  const handleLoginButton = async () => {
    await getJwt(login, password)
      .then((res) => {
        localStorage.setItem("token", res.access_token);
        NotificationManager.success("Udało się zalogować");
        window.location.reload();
      })
      .catch((err) => {
        NotificationManager.error("Błędne dane logowania");
      });
  };

  const handleRegisterButton = async () => {
    await register(email, login, password, name, surrname)
      .then((res) => {
        NotificationManager.success("Utworzono nowe konto");
        setIsRegister(false);
      })
      .catch((err) => {
        NotificationManager.error("Błędne dane");
      });
  };

  if (!isRegister)
    return (
      <>
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Login"
        />
        <div></div>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder={"Hasło"}
        />
        <div></div>
        <button onClick={handleLoginButton}>Zaloguj</button>
        <button onClick={() => setIsRegister(true)}>Załóż konto</button>
      </>
    );

  return (
    <>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <div></div>
      <input
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Login"
      />
      <div></div>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder={"Hasło"}
      />
      <div></div>
      <input
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        type="password"
        placeholder={"powtórz hasło"}
      />
      <div></div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Imię"
      />
      <div></div>
      <input
        value={surrname}
        onChange={(e) => setSurrname(e.target.value)}
        placeholder="Nazwisko"
      />
      <div></div>
      <button onClick={() => setIsRegister(false)}>Wróć do logowania</button>
      <button onClick={handleRegisterButton}>Załóż konto</button>
    </>
  );
};

export default Auth;
