import { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Beranda } from "./components/Beranda";
import { DataGudang } from "./components/DataGudang";
import { DataBarangJadi } from "./components/DataBarangJadi";
import { Riwayat } from "./components/Riwayat";
import { DataPengrajin } from "./components/DataPengrajin";
import { Menu, X, CheckCircle2, LogOut } from "lucide-react"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("isLoggedIn") === "true");
  const [activePage, setActivePage] = useState(() => sessionStorage.getItem("activePage") || "beranda");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // ==========================================
  // STATE NOTIFIKASI (TOAST) & MODAL LOGOUT
  // ==========================================
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const showNotification = (message) => {
    setNotification({ show: true, message });
    // Notifikasi akan hilang otomatis setelah 3 detik
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const handleLogoutRequest = () => {
    setIsLogoutModalOpen(true); // Tampilkan modal konfirmasi terlebih dahulu
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setActivePage("beranda");
    setIsSidebarOpen(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("activePage");
    setIsLogoutModalOpen(false);
    showNotification("Anda telah berhasil keluar dari akun.");
  };

  // ==========================================
  // STATE PUSAT UNTUK SELURUH DATA APLIKASI
  // ==========================================
  const [dataGudang, setDataGudang] = useState([]);
  const [dataBarangJadi, setDataBarangJadi] = useState([]);
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [dataRiwayatSepatu, setDataRiwayatSepatu] = useState([]);
  const [dataPengrajin, setDataPengrajin] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchAllData = async () => {
    try {
      setIsLoadingData(true);
      const [resGudang, resBarangJadi, resRiwayat, resRiwayatSepatu, resPengrajin] = await Promise.all([
        fetch("https://kotama-backend.vercel.app/api/gudang"),
        fetch("https://kotama-backend.vercel.app/api/barang-jadi"),
        fetch("https://kotama-backend.vercel.app/api/riwayat"),
        fetch("https://kotama-backend.vercel.app/api/riwayat-sepatu"),
        fetch("https://kotama-backend.vercel.app/api/pengrajin")
      ]);
      
      setDataGudang(await resGudang.json());
      setDataBarangJadi(await resBarangJadi.json());
      setDataRiwayat(await resRiwayat.json());
      setDataRiwayatSepatu(await resRiwayatSepatu.json());
      setDataPengrajin(await resPengrajin.json());
    } catch (error) {
      console.error("Gagal mengambil data pusat dari server:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchAllData();
  }, [isLoggedIn]);

  useEffect(() => { sessionStorage.setItem("isLoggedIn", isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { sessionStorage.setItem("activePage", activePage); }, [activePage]);

  // ==========================================
  // DISTRIBUSI DATA KE KOMPONEN ANAK (PROPS)
  // ==========================================
  function renderPage() {
    switch (activePage) {
      case "beranda": 
        return <Beranda dataGudang={dataGudang} dataBarangJadi={dataBarangJadi} dataRiwayat={dataRiwayat} isLoading={isLoadingData} />;
      case "data-gudang": 
        return <DataGudang data={dataGudang} dataPengrajin={dataPengrajin} refreshData={fetchAllData} isLoading={isLoadingData} showNotification={showNotification} />;
      case "data-barang-jadi": 
        return <DataBarangJadi items={dataBarangJadi} refreshData={fetchAllData} isLoading={isLoadingData} showNotification={showNotification} />;
      case "data-pengrajin":  // HALAMAN BARU
        return <DataPengrajin dataPengrajin={dataPengrajin} historyGudang={dataRiwayat} refreshData={fetchAllData} isLoading={isLoadingData} showNotification={showNotification} />;
      case "riwayat": 
        return <Riwayat historyGudang={dataRiwayat} historySepatu={dataRiwayatSepatu} isLoading={isLoadingData} showNotification={showNotification} />;
      default: 
        return <Beranda dataGudang={dataGudang} dataBarangJadi={dataBarangJadi} dataRiwayat={dataRiwayat} isLoading={isLoadingData} />;
    }
  }

  const handleNavigate = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false); 
  };

  return (
    <>
      {/* GLOBAL TOAST NOTIFICATION (Melayang di Pojok Kanan Atas) */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[99999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg bg-white border border-gray-100 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#d1fae5", color: "#059669" }}>
            <CheckCircle2 size={18} />
          </div>
          <p className="text-sm font-semibold text-gray-800 pr-2">{notification.message}</p>
        </div>
      )}

      {/* GLOBAL MODAL KONFIRMASI KELUAR */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3" style={{ backgroundColor: "#fee2e2" }}>
              <LogOut size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Keluar Akun?</h3>
            <p className="text-xs text-gray-500 px-2 mb-5">Apakah Anda yakin ingin keluar dari sistem Kotama Warehouse?</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none cursor-pointer hover:bg-gray-200 transition-colors">Batal</button>
              <button onClick={confirmLogout} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium text-white border-none cursor-pointer hover:bg-red-700 transition-colors" style={{ backgroundColor: "#ef4444" }}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER APLIKASI (LOGIN / DASHBOARD) */}
      {!isLoggedIn ? (
        <Login onLogin={() => { setIsLoggedIn(true); showNotification("Berhasil Login! Selamat datang, Admin."); }} />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen relative w-full" style={{ backgroundColor: "#f5f7fa" }}>
          <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10 sticky top-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-lg w-8 h-8 font-bold" style={{ backgroundColor: "#0d7a6b", color: "#fff" }}>K</div>
              <span className="font-bold text-gray-900">Kotama Warehouse</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-100 rounded-md text-gray-600 outline-none border-none cursor-pointer">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

          <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* onLogout sekarang memanggil handleLogoutRequest untuk memunculkan modal */}
            <Sidebar activePage={activePage} onNavigate={handleNavigate} onLogout={handleLogoutRequest} />
          </div>

          <main className="flex-1 w-full overflow-x-hidden">{renderPage()}</main>
        </div>
      )}
    </>
  );
}