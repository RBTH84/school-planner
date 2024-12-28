import { Calendar, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg md:relative md:border-b md:border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-center md:justify-start items-center h-16">
          <Link
            to="/"
            className={`flex items-center px-6 py-3 rounded-2xl transition-all ${
              location.pathname === "/"
                ? "text-primary bg-secondary shadow-sm"
                : "text-gray-600 hover:text-primary hover:bg-secondary/50"
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span className="hidden md:inline font-medium">Calendrier</span>
          </Link>
          <Link
            to="/bag"
            className={`flex items-center px-6 py-3 rounded-2xl transition-all ${
              location.pathname === "/bag"
                ? "text-primary bg-secondary shadow-sm"
                : "text-gray-600 hover:text-primary hover:bg-secondary/50"
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            <span className="hidden md:inline font-medium">Mon Sac</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};