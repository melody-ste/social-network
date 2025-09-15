import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";

const Profile = () => {
  const [token] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);

  const [username, setUsername] = useState(user?.username || "");
  const [description, setDescription] = useState(user?.description || "");
  const [loading, setLoading] = useState(true);

  //====== PROFIL USER =====
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Réponse Strapi /users/me :", data);

        if (data.error) {
          console.error("Erreur API:", data.error);
          setLoading(false);
          return;
        }

        setUser(data);
        setUsername(data.username);
        setDescription(data.description || "");
      } catch (err) {
        console.error("Erreur de récupération du profil:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      console.warn("Pas de token, arrêt du chargement.");
      setLoading(false);
    }
  }, [token, setUser]);


  if (loading) return <p>Chargement du profil...</p>;
  if (!user) return <p>Vous devez être connecté pour voir cette page.</p>;

  return (
   <div>
     <h1>Mon Profil</h1>

     <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Username :</strong> {user.username}</p>
      <p><strong>Description :</strong> {user.description || "Aucune description"}</p>
   </div>
  );
};

export default Profile;