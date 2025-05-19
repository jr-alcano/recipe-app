// client/src/pages/SavedRecipesPage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

/** Page to display all recipes saved by the logged-in user */
function SavedRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchRecipes() {
      if (!userId || !token) {
        setError("You must be logged in to view saved recipes.");
        return;
      }

      try {
        const res = await api.get(`/recipes/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setRecipes(res.data);
      } catch (err) {
        console.error("Failed to load recipes:", err);
        const message = err.response?.data?.error || "Error loading recipes.";
        setError(message);
      }
    }

    fetchRecipes();
  }, [userId, token]);

  async function handleDelete(recipeId) {
    try {
      await api.delete(`/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete recipe.");
    }
  }

  if (error) {
    return <div><h2>My Recipes</h2><p className="error">{error}</p></div>;
  }

  return (
    <div className="saved-recipes-container">
      <h2>My Recipes</h2>
      {recipes.length === 0 ? (
        <p>You have no saved recipes yet.</p>
      ) : (
        <ul className="saved-recipe-list">
          {recipes.map(recipe => (
            <li key={recipe.id} className="saved-recipe-item">
              <Link to={`/recipes/${recipe.recipe_id}?savedId=${recipe.id}`}>
                <p><strong>{recipe.title}</strong></p>
                {recipe.image && <img src={recipe.image} alt={recipe.title} width="200" />}
              </Link>
              <br />
              <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedRecipesPage;
