import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebaseConfig"; // Importe ton fichier de configuration Firebase
import '../styles/AddHousehold.css';  // Importation de la feuille de style


export default function AddHousehold({ onAdd }) {
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [households, setHouseholds] = useState([]); // État pour stocker les foyers
  const [error, setError] = useState(""); // État pour gérer les erreurs

  // Récupérer l'email de l'utilisateur connecté lors du chargement du composant
  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email); // Récupère l'email de l'utilisateur connecté via Firebase
    }
  }, []);

  // Fonction pour récupérer les foyers en fonction de l'email de l'utilisateur
  useEffect(() => {

    if (userEmail) {
      const fetchHouseholds = async () => {
        try {
          const response = await axios.get("https://eko-bak.onrender.com/households/houseuser", {
            params: { uid: userEmail} // Envoi de l'email comme paramètre de la requête
          });
          setHouseholds(response.data); // Stocke les foyers dans l'état
        } catch (err) {
          console.error("Erreur lors de la récupération des foyers :", err);
          setError("Impossible de récupérer les foyers.");
        }
      };
      console.log("Récupération des foyers pour :", userEmail);
      fetchHouseholds(); // Appel de la fonction pour récupérer les foyers
    }
  }, [userEmail]); // Recharger les foyers lorsque l'email de l'utilisateur change

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      const res = await axios.post("https://eko-bak.onrender.com/households", {
        name,
        uid: userEmail, // Utilise l'email de l'utilisateur comme uid
      });
      onAdd(res.data);
      setName(""); // Réinitialise le champ 'name' après l'ajout
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="add-household-container">
        <form onSubmit={handleSubmit} className="add-household-form">
          <input
            type="text"
            className="add-household-input"
            placeholder="Nom du foyer"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="add-household-button">
            Ajouter
          </button>
        </form>
    
        {/* <h2>Liste des foyers</h2>
        {error && <p className="error-message">{error}</p>}
    
        <ul className="household-list">
          {households.map((household) => (
            <li key={household.id} className="household-item">
              <a href={`/household/${household.id}`}>{household.name}</a>
            </li>
          ))}
        </ul> */}
      </div>
    );
    
  
}
