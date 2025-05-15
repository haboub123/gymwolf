import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/dashboards/admin/AdminDashboard';
import CoachDashboard from './components/dashboards/coach/CoachDashboard';
import ClientDashboard from './components/dashboards/clients';
import ManageCoachPage from './components/dashboards/admin/ManageCoachPage';
import ManageClientPage from './components/dashboards/admin/ManageClientPage';
import ManageActivitéPage from './components/dashboards/admin/ManageActivitéPage';
import ManageSeancePage from './components/dashboards/admin/ManageSeancePage';
import ManageSallePage from './components/dashboards/admin/ManageSallePage';
import ManageAbonnementPage from "./components/dashboards/admin/ManageAbonnementPage";
import ManageAffectationPage from "./components/dashboards/admin/ManageAffectationPage";
import HomePage from './components/HomePage';
import SeancesByActivite from "./components/SeancesByActivite";
import AllActivitesPage from "./components/AllActivitesPage";
import CoachsPage from './components/CoachsPage';
import AbonnementList from './components/AbonnementList';
import MesAbonnements from './components/MesAbonnements';
import MesFactures from "./components/MesFactures";
import MesReservations from "./components/MesReservations";


import './App.css';

// Composant pour vérifier si l'utilisateur est authentifié
const ProtectedRoute = ({ children, requiredRole }) => {
  // Récupérer l'utilisateur du localStorage
  const userString = localStorage.getItem("user");

  // Si pas d'utilisateur, rediriger vers la page de connexion
  if (!userString) {
    return <Navigate to="/auth/login" />;
  }

  try {
    const user = JSON.parse(userString);

    // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle
    if (requiredRole && user.role !== requiredRole) {
      // Rediriger selon le rôle de l'utilisateur
      if (user.role === "admin") {
        return <Navigate to="/dashboard/admin" />;
      } else if (user.role === "coach") {
        return <Navigate to="/dashboard/coach" />;
      } else {
        return <Navigate to="/" />;
      }
    }

    // Si tout est bon, afficher le composant enfant
    return children;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return <Navigate to="/auth/login" />;
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth Pages */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forget" element={<h2>Forgot Password Page</h2>} />

          {/* Admin Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-coach"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageCoachPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-client"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-activite"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageActivitéPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-seance"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageSeancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-salle"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageSallePage />
              </ProtectedRoute>
            }
          /><Route path="/admin/manage-abonnement" 
          element=
          {<ManageAbonnementPage />} />
          <Route path="/admin/manage-affectation" element={<ManageAffectationPage />} />

          {/* Coach Routes */}
          <Route
            path="/dashboard/coach"
            element={
              <ProtectedRoute requiredRole="coach">
                <CoachDashboard />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/activite/:id" element={<SeancesByActivite />} />
          <Route path="/coachs" element={<CoachsPage />} />
          <Route path="/abonnement" element={<AbonnementList />} />
          <Route path="/activites" element={<AllActivitesPage />} />
         

          {/* Protected Routes (need authentication but no specific role) */}
          <Route
            path="/mes-abonnements"
            element={
              <ProtectedRoute>
                <MesAbonnements />
              </ProtectedRoute>
            }


          /> 
           {/* Nouvelle route protégée pour les factures */}
          <Route 
            path="/mes-factures" 
            element={
              <ProtectedRoute>
                <MesFactures />
              </ProtectedRoute>
            } 
          />
           <Route path="/mes-reservations" element={
          <ProtectedRoute>
            <MesReservations />
          </ProtectedRoute>
        } />
        

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;