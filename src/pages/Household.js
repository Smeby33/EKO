import { useState, useEffect } from "react"; 
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AddDevice from "../components/AddDevice";
import ConsumptionChart from "../components/ConsumptionChart";
import AddUserToHousehold from "../components/AddUserToHousehold";
import { FaDiceFive, FaHome, FaPlusCircle, FaStreetView } from "react-icons/fa";
import { FaBuilding, FaChartLine, FaUsers } from "react-icons/fa";
import '../styles/Household.css';


export default function Household() {
  const { householdId, id } = useParams();
  const [devices, setDevices] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // État pour stocker les utilisateurs
  const [showAddFormone, setShowAddFormone] = useState(false); // État pour afficher le formulaire
  const [showAddFormtrois, setShowAddFormtrois] = useState(false); // État pour afficher le formulaire

  const [showAddFormdeux, setShowAddFormdeux] = useState(false); // État pour afficher le formulaire


const fetchUsers = async () => {
  try {
    const response = await axios.get(`https://eko-bak.onrender.com/households/add/${id}/users`);
    setUsers(response.data);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
  }
};
const fetchMembers = async () => {
  try {
    const response = await axios.get(`https://eko-bak.onrender.com/households/viewadd1/${id}/users`);
    setMembers(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des membres :", error);
  }
};


useEffect(() => {
  fetchMembers();
}, [householdId]);
  // ⚡ Charger les appareils
  useEffect(() => {
    if (!id) return; // Éviter les erreurs si id est undefined
   
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`https://eko-bak.onrender.com/devices/${id}`);
        setDevices(response.data);
      } catch (err) {                
        console.error("Erreur lors de la récupération des appareils :", err);
      }
    };

    fetchDevices();
  }, [id]);

  // ⚡ Charger la consommation du foyer
  useEffect(() => {
    if (!id) return;

    const fetchConsumptionData = async () => {
      setLoading(true);  // Commencer le chargement

      try {
        // Appel à l'API pour récupérer les données totalisées par date
        const response = await axios.get(`https://eko-bak.onrender.com/consumption/consumption/${id}`);
        console.log("Données de consommation récupérées :", response.data); // Debugging
        setConsumptionData(response.data); // Mettre à jour l'état avec les données récupérées
        setError(""); // Réinitialiser les erreurs
      } catch (err) {
        console.error("Erreur lors de la récupération des données de consommation :", err);
        setError("Impossible de récupérer les données de consommation.");
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchConsumptionData();
  }, [id]);

  // ⚡ Fonction pour allumer / éteindre un appareil
  const toggleDevice = (deviceId) => {
    axios.put(`https://eko-bak.onrender.com/devices/toggle/${deviceId}`)
      .then(res => {
        setDevices((prevDevices) =>
          prevDevices.map((d) =>
            d.id === deviceId ? { ...d, is_on: !d.is_on } : d
          )
        );

        if (res.data.consumption) {
          setConsumptionData((prevConsumption) => {
            const today = new Date().toISOString().split("T")[0];
            const index = prevConsumption.findIndex(c => c.date === today);

            if (index !== -1) {
              prevConsumption[index].total_consumption += res.data.consumption;
            } else {
              prevConsumption.unshift({ date: today, total_consumption: res.data.consumption });
            }
            return [...prevConsumption];
          });
        }
      })
      .catch(err => console.error(err));
  };

  // ⚡ Fonction pour supprimer un appareil
  const deleteDevice = (deviceId) => {
    axios.delete(`https://eko-bak.onrender.com/devices/${deviceId}`)
      .then(() => {
        setDevices((prevDevices) => prevDevices.filter(d => d.id !== deviceId));
      })
      .catch(err => console.error(err));
  };

  // ⚡ Affichage de l'UI
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center p-3 space-x-2 mb-6">
        <FaDiceFive className="text-blue-600" />
        <span>Gestion des appareils</span>
      </h1>
      <div className="btnhome">
      <button 
              className="btn btn-primary d-flex align-items-center mb-3"
              onClick={() => setShowAddFormone(!showAddFormone)} // Bascule l'affichage du formulaire
            >
              <FaPlusCircle className="me-2" />
              {showAddFormone ? "Fermer" : "Ajouter"}
        </button>
      </div>
        {showAddFormone && ( // Affichage conditionnel du formulaire
              <AddDevice householdId={id} onAdd={(newDevice) => setDevices([...devices, newDevice])} />

      )}

      <ul className="list-unstyled" >
        {devices.map(device => (
          <li key={device.id} id="members-list" className="p-4 bg-white shadow rounded mb-2 flex justify-between items-center">
            <span>{device.name} - {device.power}W - {device.is_on ? "🟢 Allumé" : "🔴 Éteint"}</span>
            <div className="btnsapp">
              <button onClick={() => toggleDevice(device.id)} id="btnapa" className="mr-2 p-2 bg-blue-500 text-orange rounded">
                {device.is_on ? "Éteindre" : "Allumer"}
              </button>
              <button onClick={() => deleteDevice(device.id)} id="btnapa" className="p-2 bg-red-500 text-orange rounded">
                Supprimer
              </button>
              <Link to={`/device/${device.id}`} id="btnapa" className="text-blue-500">Voir détails</Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="btnhome">
            <button 
              className="btn btn-primary d-flex align-items-center mb-3"
              onClick={() => setShowAddFormtrois(!showAddFormtrois)} // Bascule l'affichage du formulaire
            >
              <FaStreetView className="me-2" />
              {showAddFormtrois ? "Fermer" : "voir"}
            </button>
      </div>
      {showAddFormtrois && (
        <div>
      <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2 p-2 mb-4 border-b pb-2">
        <FaBuilding className="text-gray-600" />
        <span>Détails du foyer</span>
      </h2>
      <div className="btnhome">
            <button 
              className="btn btn-primary d-flex align-items-center mb-3"
              onClick={() => setShowAddFormdeux(!showAddFormdeux)} // Bascule l'affichage du formulaire
            >
              <FaPlusCircle className="me-2" />
              {showAddFormdeux ? "Fermer" : "Ajouter"}
            </button>
      </div>
{/* Formulaire d'ajout d'utilisateur */}{showAddFormdeux && ( // Affichage conditionnel du formulaire
        <AddUserToHousehold householdId={id} onUserAdded={fetchUsers} />
      )}

{/* Liste des utilisateurs */}
<div>
    <h2>Membres du foyer</h2>
    <ul >
      {members.map((member) => (
        <li key={member.id}>{member.name} - {member.role}</li>
      ))}
    </ul>
  </div>


      {/* 📊 Graphique de consommation */}
      <div className="p-4" >
      <h2 className="text-2xl font-bold text-gray-700 flex items-center space-x-2 mb-4 border-b pb-2">
        <FaChartLine className="text-green-600" />
        <span>Consommation du foyer</span>
      </h2>
        {loading ? <p>Chargement...</p> : error ? <p style={{ color: "red" }}>{error}</p> : <ConsumptionChart data={consumptionData} />}
      </div>
      </div>
    )}
    </div>
  );
}
