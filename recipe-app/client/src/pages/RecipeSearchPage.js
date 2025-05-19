// client/src/pages/RecipeSearchPage.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

/** Page for searching and saving recipes */
function RecipeSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  async function handleSearch(evt) {
    evt.preventDefault();
    setError(null);

    try {
      const res = await api.get(`/recipes/search`, {
        params: { query },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch recipes.");
    }
  }

  async function handleSave(recipe) {
    const token = localStorage.getItem("token");

    try {
      const res = await api.post(
        `/recipes/save`,
        {
          recipe_id: recipe.id,
          title: recipe.title,
          image: recipe.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Saved recipe:", res.data);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save recipe. Are you logged in?");
    }
  }

  return (
    <div className="recipe-search-container">
      <h2>Search Recipes</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          placeholder="Search for recipes..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <ul className="recipe-list">
          {results.map((r) => (
            <li key={r.id} className="recipe-item">
              <img src={r.image} alt={r.title} width={100} />
              <br />
              <Link to={`/recipes/${r.id}`} className="recipe-link">
                {r.title}
              </Link>
              <br />
              <button onClick={() => handleSave(r)}>Save</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipeSearchPage;
