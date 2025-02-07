import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function HouseholdDevices() {
  const router = useRouter();
  const { id } = router.query;
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/devices?household_id=${id}`)
        .then(res => setDevices(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">📡 Appareils</h1>
      <ul>
        {devices.map(device => (
          <li key={device.id} className="p-4 bg-white shadow rounded mb-2">
            {device.name} - {device.power}W - {device.is_on ? "🟢 Allumé" : "🔴 Éteint"}
          </li>
        ))}
      </ul>
    </div>
  );
}
