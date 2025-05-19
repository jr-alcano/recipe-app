import React, { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:3001/auth/register", formData);
      console.log("Registered:", res.data);
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      const message = err.response?.data?.error || "Something went wrong!";
      setError(message);
    }
  }

  return (
    <div className="form-container">
      <h2>Register</h2>
      {success && <p className="success-msg">Registration successful!</p>}
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
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <button className="form-btn" type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
