import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import gymBackground from "../../assets/img/gym-background.jpg";
import { registerUser } from "../../services/apiUser";

export default function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });
  const [error, setError] = useState("");

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
    if (id === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Bouton de soumission cliqué, démarrage de l'inscription...");
    setError("");

    if (!formData.terms) {
      setError("Veuillez accepter la politique de confidentialité.");
      return;
    }

    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      console.log("Réponse :", data);
      if (!data.user) {
        throw new Error(data.message || "Échec de l'inscription.");
      }

      alert("Inscription réussie ! Veuillez vous connecter.");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form register-form">
          <h2 className="login-title register-title">Inscription</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="username">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                className="input"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">
                Mot de passe
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
              <div className={`password-strength strength-${strength}`}>
                <div className="strength-bars">
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                  <div className="strength-bar"></div>
                </div>
                <div className="strength-text">
                  {["Faible", "Moyen", "Bon", "Fort"][strength - 1] || "Trop court"}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                />
                <span className="checkbox-text">
                  J'accepte la{" "}
                  <Link to="#" className="policy-link">
                    Politique de confidentialité
                  </Link>
                </span>
              </label>
            </div>
            <button type="submit" className="submit-btn">
              S'INSCRIRE
            </button>
          </form>
          <div className="links">
            <Link to="/auth/login" className="link">
              Vous avez déjà un compte ?
            </Link>
            <Link to="/auth/forget" className="link">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        <div className="image-section">
          <img src={gymBackground} alt="Image salle de sport" className="gym-image" />
        </div>
      </div>
    </div>
  );
}
