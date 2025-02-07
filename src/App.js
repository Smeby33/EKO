import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Household from "./pages/Household";
import DeviceDetails from "./components/DeviceDetails";
import Navbar from "./components/Navbaree"; // Utilisation correcte de Navbar
import Auth from "./components/Auth";
import { auth } from "./components/firebaseConfig";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Vérifier l'état d'authentification de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserEmail(currentUser ? currentUser.email : "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Charger les foyers associés à l'utilisateur
  useEffect(() => {
    if (userEmail) {
      const fetchHouseholds = async () => {
        try {
          const response = await axios.get("http://localhost:5000/households/houseuser", {
            params: { uid: userEmail }
          });
          setHouseholds(response.data);
        } catch (err) {
          console.error("Erreur lors de la récupération des foyers :", err);
        }
      };
      fetchHouseholds();
    }
  }, [userEmail]);

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <Router>
      <Navbar userEmail={userEmail} households={households} />
      <div className="min-h-screen bg-gray-100 p-8" id="divapp">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={user ? <Home user={user} households={households} setHouseholds={setHouseholds} /> : <Navigate to="/" />} />
          <Route path="/household/:id" element={user ? <Household /> : <Navigate to="/" />} />
          <Route path="/device/:deviceId" element={user ? <DeviceDetails /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
