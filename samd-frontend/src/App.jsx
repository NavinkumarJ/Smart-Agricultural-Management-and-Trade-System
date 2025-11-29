import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import LandingPage from "./LandingPage";
import GeminiChat from "./GeminiChat";
import ToolsInventory from "./ToolsInventory";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* NAVBAR */}
        <header className="w-full bg-white shadow-sm">
          <div className="container-max mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-sm">
                🌾
              </div>
              <div>
                <div className="font-semibold text-lg">Smart Agriculture Trade System</div>
                <div className="text-xs text-gray-500">Empowering farmers with AI technology</div>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              <NavLink
                to="/"
                end
                className={({isActive}) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >Home</NavLink>

              <NavLink
                to="/chat-bot"
                className={({isActive}) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >AI Assistant</NavLink>

              <NavLink
                to="/inventory"
                className={({isActive}) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >Inventory</NavLink>
            </nav>
          </div>
        </header>

        {/* ROUTES */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat-bot" element={<GeminiChat />} />
            <Route path="/inventory" element={<ToolsInventory />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t mt-8">
          <div className="container-max mx-auto px-6 py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Smart Agricultural Management and Trade System — Built with ❤️
          </div>
        </footer>
      </div>
    </Router>
  );
}
