import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";
import { Link } from "react-router-dom";

const Home = () => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Charger les posts
  const fetchPosts = async () => {
    const res = await fetch("http://localhost:1337/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    
    setPosts(data.reverse()); 
  };

  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  // Créer un post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    await fetch("http://localhost:1337/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: newPost,
        user: user.id,
      }),
    });

    setNewPost("");
    fetchPosts();
  };

  if (!token) {
    return (
      <div>
        <h1>Bienvenue sur My Network</h1>
        <p>
          Ce site est un entraînement à React, à la gestion d’état global et aux tokens. L’objectif est de mettre en pratique l’authentification et le routage pour créer un petit réseau social.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Accueil</h1>

      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Exprime-toi..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit">post</button>
      </form>

      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <p>
            Par:{" "}
            <Link to={`/profile/${post.user.id}`}>
              {post.user.username}
            </Link>
          </p>
          {post.user.id === user.id && (
            <button>Supprimer</button>
          )}
          <button>Like ({post.like})</button>
        </div>
      ))}
    </div>
  );
};

export default Home;