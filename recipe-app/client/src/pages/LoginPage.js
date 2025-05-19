import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:3001/auth/login", formData);
      console.log("Login response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("username", formData.username);

      setSuccess(true);
      navigate("/recipes");
    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.error || "Something went wrong!";
      setError(message);
    }
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      {success && <p className="success-msg">Login successful!</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />
        <button className="form-btn" type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
