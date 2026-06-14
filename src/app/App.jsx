import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Beranda } from "./components/Beranda";
import { DataGudang } from "./components/DataGudang";
import { DataBarangJadi } from "./components/DataBarangJadi";
import { Riwayat } from "./components/Riwayat";
import { Menu, X } from "lucide-react"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("isLoggedIn") === "true");
  const [activePage, setActivePage] = useState(() => sessionStorage.getItem("activePage") || "beranda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // ==========================================
  // STATE PUSAT UNTUK SELURUH DATA APLIKASI
  // ==========================================
  const [dataGudang, setDataGudang] = useState([]);
  const [dataBarangJadi, setDataBarangJadi] = useState([]);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [dataRiwayatSepatu, setDataRiwayatSepatu] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fungsi Raksasa untuk menarik semua data sekaligus (Paralel)
  const fetchAllData = async () => {
    try {
      setIsLoadingData(true);
      const [resGudang, resBarangJadi, resRiwayat, resRiwayatSepatu] = await Promise.all([
        fetch("https://kotama-backend.vercel.app/api/gudang"),
        fetch("https://kotama-backend.vercel.app/api/barang-jadi"),
        fetch("https://kotama-backend.vercel.app/api/riwayat"),
        fetch("https://kotama-backend.vercel.app/api/riwayat-sepatu")
      ]);
      
      setDataGudang(await resGudang.json());
      setDataBarangJadi(await resBarangJadi.json());
      setDataRiwayat(await resRiwayat.json());
      setDataRiwayatSepatu(await resRiwayatSepatu.json());
    } catch (error) {
      console.error("Gagal mengambil data pusat dari server:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Hanya tarik data API jika pengguna sudah berhasil Login
  useEffect(() => {
    if (isLoggedIn) fetchAllData();
  }, [isLoggedIn]);

  useEffect(() => { sessionStorage.setItem("isLoggedIn", isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { sessionStorage.setItem("activePage", activePage); }, [activePage]);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // ==========================================
  // DISTRIBUSI DATA KE KOMPONEN ANAK (PROPS)
  // ==========================================
  function renderPage() {
    switch (activePage) {
      case "beranda": 
        return <Beranda dataGudang={dataGudang} dataBarangJadi={dataBarangJadi} dataRiwayat={dataRiwayat} isLoading={isLoadingData} />;
      case "data-gudang": 
        return <DataGudang data={dataGudang} refreshData={fetchAllData} isLoading={isLoadingData} />;
      case "data-barang-jadi": 
        return <DataBarangJadi items={dataBarangJadi} refreshData={fetchAllData} isLoading={isLoadingData} />;
      case "riwayat": 
        return <Riwayat historyGudang={dataRiwayat} historySepatu={dataRiwayatSepatu} isLoading={isLoadingData} />;
      default: 
        return <Beranda dataGudang={dataGudang} dataBarangJadi={dataBarangJadi} dataRiwayat={dataRiwayat} isLoading={isLoadingData} />;
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
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("activePage");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative w-full" style={{ backgroundColor: "#f5f7fa" }}>
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg w-8 h-8 font-bold" style={{ backgroundColor: "#0d7a6b", color: "#fff" }}>K</div>
          <span className="font-bold text-gray-900">Kotama App</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-100 rounded-md text-gray-600 outline-none border-none cursor-pointer">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogout} />
      </div>

      <main className="flex-1 w-full overflow-x-hidden">{renderPage()}</main>
    </div>
  );
}