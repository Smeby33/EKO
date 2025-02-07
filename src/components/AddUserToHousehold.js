    import { useState } from "react";
    import axios from "axios";

    export default function AddUserToHousehold({ householdId, onUserAdded }) {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [role, setRole] = useState("member");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 🔍 Recherche des utilisateurs par nom ou email
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);
        setUsers([]); // Réinitialiser la liste des résultats

        if (query.length < 3) return; // Ne pas chercher si moins de 3 caractères

        try {
        const response = await axios.get(`http://localhost:5000/users/search?q=${query}`);
        setUsers(response.data);
        } catch (err) {
        console.error("Erreur de recherche :", err);
        setUsers([]);
        }
    };

    // ✅ Sélectionner un utilisateur dans la liste
    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearch(""); // Effacer le champ de recherche
        setUsers([]); // Cacher la liste des résultats
    };

    // 🚀 Ajouter l'utilisateur sélectionné au foyer
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
        setError("Veuillez sélectionner un utilisateur.");
        return;
        }

        setError("");
        setSuccess("");

        try {
        const response = await axios.post(`http://localhost:5000/households/add1/${householdId}/users`, {
            userId: selectedUser.id,
            role: role,
        });

        setSuccess(response.data.message);
        setSelectedUser(null);
        setRole("member");
        onUserAdded(); // Recharger la liste des membres
        } catch (err) {
        setError(err.response?.data?.error || "Une erreur est survenue");
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-2">👤 Ajouter un utilisateur</h2>

        {/* 🔍 Champ de recherche */}
        <input
            type="text"
            placeholder="Rechercher par nom ou email"
            value={search}
            onChange={handleSearch}
            className="p-2 border rounded w-full"
        />

        {/* 📜 Liste des résultats */}
        {users.length > 0 && (
            <ul className="bg-gray-100 p-2 mt-2 rounded shadow">
            {users.map((user) => (
                <li
                key={user.id}
                className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectUser(user)}
                >
                {user.name} ({user.email})
                </li>
            ))}
            </ul>
        )}

        {/* ✅ Affichage de l'utilisateur sélectionné */}
        {selectedUser && (
            <div className="mt-4 p-4 border rounded bg-green-100">
            <p>
                <strong>Utilisateur sélectionné :</strong> {selectedUser.name} ({selectedUser.email})
            </p>
            <label className="block mt-2">
                <span>Rôle :</span>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="ml-2 p-2 border rounded">
                <option value="member">Membre</option>
                <option value="owner">Propriétaire</option>
                </select>
            </label>
            <button onClick={handleSubmit} className="mt-2 p-2 bg-blue-500 text-white rounded">
                Ajouter au foyer
            </button>
            </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
    }
