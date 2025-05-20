import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Login.css';
import gymBackground from '../../assets/img/gym-background.jpg';
import { loginUser } from "../../services/apiUser";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          if (user.role === "admin") {
            navigate("/dashboard/admin");
          } else if (user.role === "coach") {
            navigate("/dashboard/coach");
          } else if (user.role === "client") {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de connexion :", error);
        localStorage.removeItem("user");
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!data.user) {
        throw new Error(data.message || "Échec de la connexion.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      
      const pendingReservation = sessionStorage.getItem("pendingReservation");
      
      if (pendingReservation) {
        setSuccessMessage("Connexion réussie ! Finalisation de votre réservation...");
        
        setTimeout(() => {
          setIsLoading(false);
          navigate("/mes-reservations");
        }, 1500);
      } else {
        setSuccessMessage("Connexion réussie !");
        
        setTimeout(() => {
          setIsLoading(false);
          const role = data.user.role;
          if (role === "admin") {
            navigate("/dashboard/admin");
          } else if (role === "coach") {
            navigate("/dashboard/coach");
          } else if (role === "client") {
            navigate("/");
          } else {
            throw new Error("Rôle inconnu.");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      setError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form">
          <h2 className="login-title">Connexion</h2>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkbox-text">Se souvenir de moi</span>
              </label>
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "CHARGEMENT..." : "SE CONNECTER"}
            </button>
          </form>
          <div className="links">
            <Link to="/auth/forget" className="link">Mot de passe oublié ?</Link>
            <Link to="/auth/register" className="link">Créer un compte</Link>
          </div>
        </div>
        <div className="image-section">
          <img src={gymBackground} alt="Gym Background" className="gym-image" />
        </div>
      </div>
    </div>
  );
}