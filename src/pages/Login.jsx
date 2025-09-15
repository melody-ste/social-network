import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();

    if (data.jwt) {
      setToken(data.jwt);
      setUser(data.user);

      navigate("/profile");
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div>
      <h1>Se connecter</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email ou Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;