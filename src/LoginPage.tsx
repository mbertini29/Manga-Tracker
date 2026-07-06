import "./LoginPage.css";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import  { app } from "./firebase.ts";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(app);

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();


  const handleLogin = async(): Promise<void> => {
    try{
      await signInWithEmailAndPassword(auth,email,password);
      navigate("/home");
    }
    catch(error: unknown){
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleRegister = async(): Promise<void> => {
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Email e Password registrata");
      
    }
    catch(error: unknown){
      if (error instanceof Error) {
        alert(error.message);
      }
    }
    setEmail("");
    setPassword("");
  };

  const handlePW = async(): Promise<void> => {
     try{
        if(email === ""){
          alert("Inserire email");
          return;
        }
        await sendPasswordResetEmail(auth,email);
        alert("Se l'indirizzo email è registrato riceverai un'email per il reset della password");
      }
      catch(error: unknown){
          if (error instanceof Error) {
              alert(error.message);
          }
      }
      setEmail("");
  }

  return (
    <div className="page-container">
      <div className="login-card">
        <div className="avatar"></div>
        <h2 className="login-title">Manga Tracker</h2>
        <span className="description">
          Accedi al tuo account oppure registrati
        </span>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          className="input-field"
        />

        <div className="button-group1">
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <button className="register-btn" onClick={handleRegister}>
            Registrati
          </button>
          
        </div>
        <div className="button-group2">
            <button className="cambiaPW-btn" onClick={handlePW}>
              Cambia Password
            </button>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;