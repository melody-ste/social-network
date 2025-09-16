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


  // ====== UPDATE USER =====
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:1337/api/users-permissions/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          description,
        }),
      });

      const data = await res.json();
      console.log("Réponse mise à jour :", data);

      if (data.error) {
        alert("Erreur lors de la mise à jour : " + data.error.message);
        return;
      }

      setUser(data); // Mets à jour ton atom Jotai
    } catch (err) {
      console.error("Erreur PUT /me:", err);
    }
  };

  if (loading) return <p>Chargement du profil...</p>;
  if (!user) return <p>Vous devez être connecté pour voir cette page.</p>;

  return (
   <div className="container">
      <h1>Mon Profil</h1>
      <div className="card">
        <h3>{user.username}</h3>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Description :</strong> {user.description || "Aucune description"}</p>
      </div>

      <h2>Modifier mon profil</h2>
      <div className="card">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Nouveau username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <textarea
            placeholder="Votre description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Mettre à jour</button>
        </form>
      </div>
   </div>
  );
};

export default Profile;