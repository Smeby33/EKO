import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { motion } from "framer-motion";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;

      if (isRegister) {
        if (!name.trim()) {
          setError("Le nom d'utilisateur est requis.");
          return;
        }

        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const response = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email, name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || response.statusText);
        }

        alert("Compte créé avec succès !");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie !");
      }

      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
              <div className="formeparent">

      <motion.div 
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg transition-all duration-500"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {isRegister ? "Créer un compte" : "Se connecter"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4" id="forme">
          {isRegister && (
            <motion.input
              type="text"
              placeholder="Nom d'utilisateur"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            />
          )}

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          />

          <motion.input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          />

          <motion.button 
            type="submit"
            className="add-household-button"            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRegister ? "S'inscrire" : "Se connecter"}
          </motion.button>
        </form>

        <motion.button
          onClick={() => setIsRegister(!isRegister)}
          className="add-household-button"          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.70 }}
        >
          {isRegister ? "J'ai déjà un compte" : "Créer un compte"}
        </motion.button>
      </motion.div>
      </div>

    </div>
  );
};

export default Auth;
