import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../atoms/authAtom";
import { Link } from "react-router-dom";

const Home = () => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // ===== CHARGER POST =====
  const fetchPosts = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "http://localhost:1337/api/posts?populate[author]=*&populate[users_likes]=*",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const json = await res.json();

      const postsArray = json.data.map((post) => ({
        id: post.id,
        text: post.attributes.text,
        like: post.attributes.like || 0,
        users_likes: post.attributes.users_likes?.data?.map((u) => u.id) || [],
        author: post.attributes.author?.data
          ? {
              id: post.attributes.author.data.id,
              username: post.attributes.author.data.attributes.username,
            }
          : { id: null, username: "Utilisateur inconnu" },
      }));

      setPosts(postsArray.reverse());
    } catch (err) {
      console.error("Erreur fetchPosts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  // ===== CREER POST =====
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const res = await fetch("http://localhost:1337/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            text: newPost,
            author: { connect: [user.id] },
          },
        }),
      });

      const json = await res.json();
      const newPostData = {
        id: json.data.id,
        text: json.data.attributes.text,
        like: json.data.attributes.like || 0,
        users_likes: [],
        author: { id: user.id, username: user.username },
      };

      setPosts([newPostData, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error("Erreur création post:", err);
    }
  };

  // ===== DELETE POST =====
  const handleDeletePost = async (postId) => {
    try {
      await fetch(`http://localhost:1337/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPosts();
    } catch (err) {
      console.error("Erreur suppression post:", err);
    }
  };

  // ===== LIKE POST =====
  const handleLikePost = async (post) => {
    const hasLiked = post.users_likes.includes(user.id);
    const updatedLikes = hasLiked ? post.like - 1 : post.like + 1;

    try {
      await fetch(`http://localhost:1337/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
           data: {
            like: updatedLikes,
            users_likes: hasLiked? { disconnect: [user.id] } : { connect: [user.id] }},
        }),
      });

      fetchPosts();
    } catch (err) {
      console.error("Erreur like post:", err);
    }
  };

  if (!token) {
    return (
      <div className="container">
        <h1>Bienvenue sur My Network</h1>
        <p>
          Ce site est un entraînement à React, à la gestion d’état global et aux tokens. L’objectif est de mettre en pratique l’authentification et le routage pour créer un petit réseau social.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Accueil</h1>
      <div className="card">
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Exprime-toi..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button type="submit">post</button>
        </form>
      </div>

      <h2>Posts</h2>
      {posts.map((post) => (
        
        <div className="card" key={post.id}>
          <p>{post.text}</p>
          <p>
            Par:{" "}
            <Link to={`/profile/${post.author.id}`}>{post.author.username}</Link>
          </p>
          <button onClick={() => handleLikePost(post)}>
            Like ({post.like})
          </button>
          {post.author.id === user.id && (
            <button onClick={() => handleDeletePost(post.id)}>Supprimer</button>
          )}
        </div>
        
      ))}
    </div>
  );
};

export default Home;