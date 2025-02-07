import { useEffect, useState } from "react"; 
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DeviceConsumptionChart({ data }) {
  const [loading, setLoading] = useState(false);  // Indicateur de chargement
  const [error, setError] = useState(null);  // Gestion des erreurs

  useEffect(() => {
    if (!data || data.length === 0) {
      setError("Aucune donnée de consommation disponible.");
    }
  }, [data]);

  // Données à passer à Chart.js
  const chartData = {
    labels: data.map((entry) => entry.date),  // Liste des dates
    datasets: [
      {
        label: "Consommation (kWh)",
        data: data.map((entry) => entry.consumption),  // Consommation par date
        borderColor: "rgb(255, 99, 132)",  // Couleur de la ligne
        backgroundColor: "rgba(255, 99, 132, 0.2)",  // Couleur de fond sous la ligne
        tension: 0.3,  // Courbure de la ligne
      },
    ],
  };

  // Affichage conditionnel
  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return <Line data={chartData} />;
}
