import { Link, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";


const Navbar = () => {

  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);

    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        {!token ? (
          <>
            <li>
              <Link to="/login">Connexion</Link>
            </li>
            <li>
              <Link to="/register">Inscription</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile">
                {user?.username || "Mon profil"}
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;