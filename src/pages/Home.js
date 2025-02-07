import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { auth } from "../components/firebaseConfig";
import AddHousehold from "../components/AddHousehold";
import '../styles/home.css';
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { FaBuilding, FaChartLine, FaUsers } from "react-icons/fa";

export default function Home({ households, setHouseholds }) {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false); // État pour afficher le formulaire

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchHouseholds = async () => {
        try {
          const response = await axios.get("https://eko-bak.onrender.com/households/houseuser", {
            params: { uid: userEmail }
          });
          setHouseholds(response.data);
        } catch (err) {
          console.error("Erreur lors de la récupération des foyers :", err);
          setError("Impossible de récupérer les foyers.");
        }
      };
      fetchHouseholds();
    }
  }, [userEmail, setHouseholds]);

  return (
    <div className="container py-4" id="containerhome">
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2 mb-6">
        <FaBuilding className="text-blue-600" />
        <span>Gestion du foyer</span>
      </h1>

      <div className="btnhome">
        <button 
          className="btn btn-primary d-flex align-items-center mb-3"
          onClick={() => setShowAddForm(!showAddForm)} // Bascule l'affichage du formulaire
        >
          <FaPlusCircle className="me-2" />
          {showAddForm ? "Fermer" : "Ajouter"}
        </button>
      </div>

      {showAddForm && ( // Affichage conditionnel du formulaire
        <AddHousehold onAdd={(newHousehold) => setHouseholds([...households, newHousehold])} />
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-unstyled">
        {households.map(household => (
          <li key={household.id} id="foyer" className="d-flex justify-content-between align-items-center p-3 mb-3 rounded shadow-sm">
            <Link to={`/household/${household.id}`} id="linkhome" className="text-decoration-none text-dark d-flex align-items-center">
              <FaHome className="me-2" />
              {household.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
