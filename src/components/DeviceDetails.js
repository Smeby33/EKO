import { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import DeviceConsumptionChart from "./DeviceConsumptionChart";
import axios from "axios";

export default function DeviceDetails() {
  const { deviceId } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(`https://eko-bak.onrender.com/devices/oneapp/${deviceId}`);
        setDeviceData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des données de l'appareil :", err);
        setError("Impossible de récupérer les données de l'appareil.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [deviceId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!deviceData) return <p>Aucun appareil trouvé.</p>;

  const { device, consumptions } = deviceData;

  // ✅ Calcul de la consommation totale après récupération des données
  const totalConsumption = consumptions ? consumptions.reduce((sum, entry) => sum + entry.consumption, 0) : 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{device.name}</h1>
      <p>⚡ Puissance : {device.power} W</p>
      <p>🕒 Allumé : {device.is_on ? "Oui" : "Non"}</p>
      <p>📊 Consommation totale : {totalConsumption.toFixed(4)} kWh</p>

      <h2 className="text-xl font-bold mt-6">📊 Consommation de cet appareil</h2>
      {consumptions && consumptions.length > 0 ? (
        <DeviceConsumptionChart data={consumptions} />
      ) : (
        <p>Aucune donnée de consommation disponible.</p>
      )}
    </div>
  );
}
