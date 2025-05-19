import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipeSearchPage from "./pages/RecipeSearchPage";
import SavedRecipesPage from "./pages/SavedRecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import NavBar from "./NavBar"; //  use the reusable nav component

function App() {
  return (
    <BrowserRouter>
      <NavBar /> {/*  Reusable NavBar always rendered */}
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes" element={<RecipeSearchPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/my-recipes" element={<SavedRecipesPage />} />
        <Route path="/my-recipes/:id" element={<RecipeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
