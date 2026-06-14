import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Beranda } from "./components/Beranda";
import { DataGudang } from "./components/DataGudang";
import { DataBarangJadi } from "./components/DataBarangJadi";
import { Riwayat } from "./components/Riwayat";
import { Menu, X } from "lucide-react"; 

export default function App() {
  // 1. Menggunakan sessionStorage agar data hancur saat tab/browser ditutup
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });
  
  const [activePage, setActivePage] = useState(() => {
    return sessionStorage.getItem("activePage") || "beranda";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // 2. Simpan setiap perubahan state secara otomatis ke sessionStorage
  useEffect(() => {
    sessionStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    sessionStorage.setItem("activePage", activePage);
  }, [activePage]);

  // Jika status login salah/kosong, kunci di halaman Login
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Fungsi penentuan navigasi halaman
  function renderPage() {
    switch (activePage) {
      case "beranda": return <Beranda />;
      case "data-gudang": return <DataGudang />;
      case "data-barang-jadi": return <DataBarangJadi />;
      case "riwayat": return <Riwayat />;
      default: return <Beranda />;
    }
  }

  const handleNavigate = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage("beranda");
    setIsSidebarOpen(false);
    
    // 3. Bersihkan sessionStorage saat admin menekan tombol logout manual
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("activePage");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative w-full" style={{ backgroundColor: "#f5f7fa" }}>
      
      {/* Mobile Header (Hanya muncul di layar HP) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg w-8 h-8 font-bold" style={{ backgroundColor: "#0d7a6b", color: "#fff" }}>
            K
          </div>
          <span className="font-bold text-gray-900">Kotama App</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-gray-100 rounded-md text-gray-600 outline-none border-none cursor-pointer"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay Slider di HP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Komponen Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {/* Area Konten Utama */}
      <main className="flex-1 w-full overflow-x-hidden">{renderPage()}</main>
    </div>
  );
}