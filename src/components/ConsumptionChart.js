import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Pour afficher la donnée au centre du cercle

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

export default function ConsumptionChart({ data }) {
  console.log(data);  // Vérifier les données reçues
  
  if (!data || data.length === 0) {
    return <p>Aucune donnée de consommation disponible.</p>;
  }

  // Calculer la consommation totale du foyer
  const totalConsumption = data.reduce((acc, entry) => acc + entry.total_consumption, 0);

  const chartData = {
    labels: ["Consommation", "Restant"], // Le cercle sera divisé entre la consommation et le restant
    datasets: [
      {
        label: "Consommation (kWh)",
        data: [totalConsumption, 100 - totalConsumption], // Le second valeur est juste pour donner l'espace restant
        backgroundColor: ["rgb(75, 192, 192)", "rgba(75, 192, 192, 0.2)"], // Couleurs pour la consommation et le reste
        borderWidth: 1,
        tension: 0.3,
        animation: {
          animateRotate: true,  // Animation de rotation
          animateScale: true    // Animation de l'échelle
        }
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} kWh`, // Afficher la consommation en kWh
        },
      },
      datalabels: {
        display: true,
        color: "black",
        font: {
          size: 18,
          weight: "bold"
        },
        formatter: () => `${totalConsumption.toFixed(2)} kWh`, // Afficher la consommation totale au centre
      },
    },
    cutout: "50%", // Pour créer un trou au centre et afficher les données
  };

  return <Doughnut data={chartData} options={options} />;
}
