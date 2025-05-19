// client/src/components/NavBar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";

/** Navigation bar for routing and login/logout */
function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/recipes" className="nav-link">Recipe Search</Link>
        {!token && (
          <>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        )}
        {token && (
          <>
            <Link to="/my-recipes" className="nav-link">Saved Recipes</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
      {token && username && (
        <div className="welcome-text">
          Welcome, {username}!
        </div>
      )}
    </nav>
  );
}

export default NavBar;
