import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaSignInAlt } from "react-icons/fa";

export default function Navbar({ userEmail, households }) {
  const logo = "/ako.png";
  const links = [
    { path: "/home", icon: <FaHome />, label: "Accueil" },
    households.length > 0 && { path: `/household/${households[0].id}`, icon: <FaUsers />, label: "Mon foyer" },
    { path: "/", icon: <FaSignInAlt />, label: "Connexion" },
  ].filter(Boolean); // Supprime les valeurs nulles si pas de foyers

  return (
    <nav className="flex justify-center space-x-4 bg-blue-500 p-3 shadow-lg transition-all duration-500">
       <div className="navi" >
       <img src={logo} alt="Logo" className="h-10 w-1 object-contain" id="logo" />

     
      <div className="btnhom">
        {links.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 text-black font-semibold rounded transition-all duration-300 ${
                isActive ? "bg-blue-700 scale-110 shadow-md" : "hover:bg-blue-600"
              }`
            }
            id="btnap"
          >
            {icon} <span>{label}</span>
          </NavLink>
        ))}
      </div>
      </div>
    </nav>
  );
}

