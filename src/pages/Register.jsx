import { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (data.jwt) {
      setToken(data.jwt);
      setUser(data.user);

      Cookies.set("token", data.jwt, { expires: 7 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      navigate("/profile");
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div>
      <h1>S'inscrire</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;