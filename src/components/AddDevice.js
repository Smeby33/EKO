import { useState } from "react";
import axios from "axios";

export default function AddDevice({ householdId, onAdd }) {
  const [name, setName] = useState("");
  const [power, setPower] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://eko-bak.onrender.com/devices", {
        household_id: householdId,
        name,
        power
      });
      onAdd(res.data);
      setName("");
      setPower("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        className="p-2 border rounded w-full"
        placeholder="Nom de l’appareil"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        className="p-2 border rounded w-full mt-2"
        placeholder="Puissance (W)"
        value={power}
        onChange={(e) => setPower(e.target.value)}
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
        Ajouter
      </button>
    </form>
  );
}
