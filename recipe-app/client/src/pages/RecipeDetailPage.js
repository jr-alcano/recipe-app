import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function RecipeDetailPage() {
  const { id } = useParams(); // spoonacular ID
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const savedId = searchParams.get("savedId"); // internal saved recipe ID

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:3001/recipes/${id}/details`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe details:", err);
        setError("Could not load recipe details.");
      }

      if (token && savedId) {
        try {
          const res = await axios.get(`http://localhost:3001/recipes/${savedId}/notes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const latestNote = res.data[0]?.content || "";
          setNoteContent(latestNote);
        } catch (err) {
          console.warn("No saved notes or not authorized to view them.");
        }
      }
    }
    fetchData();
  }, [id, savedId, token]);

  async function handleSaveNote(evt) {
    evt.preventDefault();
    if (!savedId) {
      alert("This recipe must be saved before you can add a note.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3001/recipes/${savedId}/note`,
        { content: noteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Note saved.");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Could not save note.");
    }
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>

      <h3>Ingredients:</h3>
      <ul className="ingredients-list">
        {recipe.ingredients.map((i, idx) => (
          <li key={idx}>{i.amount} {i.unit} {i.name}</li>
        ))}
      </ul>

      <h3>Instructions:</h3>
      <div
        className="instructions"
        dangerouslySetInnerHTML={{
          __html: recipe.instructions || "<p>No instructions.</p>",
        }}
      />

      {token && savedId && (
        <div className="notes-section">
          <h3>Your Note</h3>
          <form onSubmit={handleSaveNote}>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
              cols={60}
              placeholder="Add your note here..."
              className="note-textarea"
            />
            <br />
            <button type="submit" className="note-save-btn">Save Note</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailPage;
