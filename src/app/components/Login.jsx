import { useState } from "react";
import { Eye, EyeOff, User, Lock, ArrowRight, X, XCircle } from "lucide-react";

export function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk error teks (jika kosong) dan modal (jika salah akun)
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validasi input kosong
    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    const VALID_USERNAME = ["admin", "adminkotama"];
    const VALID_PASSWORD = "admin123";

    // Periksa apakah input sesuai dengan akun tertentu
    if (VALID_USERNAME.includes(username) && password === VALID_PASSWORD) {
      setError("");
      onLogin(); // Berhasil masuk
    } else {
      setError("");
      setIsErrorModalOpen(true); // Membuka popup modal merah
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: "#f0f2f5" }}>
      {/* Container Utama dengan overflow-hidden agar Marquee rapi di sudut */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-2xl mx-4 overflow-hidden">
        
        {/* TULISAN BERJALAN (MARQUEE) */}
        <div className="bg-[#e8f5f2] py-2.5 border-b" style={{ borderColor: "rgba(13, 122, 107, 0.2)" }}>
          <marquee 
            className="font-bold tracking-widest text-sm flex items-center" 
            style={{ color: "#0d7a6b" }}
            scrollamount="6"
          >
            SELAMAT DATANG ADMIN KOTAMA
          </marquee>
        </div>

        <div className="p-10">
          <h1 className="mb-1" style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827" }}>
            Selamat Datang
          </h1>
          <p className="mb-8" style={{ color: "#6b7280", fontSize: "0.9375rem" }}>
            Silakan masuk ke akun Anda.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Input Username */}
            <div className="mb-5">
              <label className="block mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full rounded-lg border pl-9 pr-4 py-3 outline-none transition-colors"
                  style={{
                    borderColor: "#d1d5db",
                    fontSize: "0.9375rem",
                    color: "#111827",
                    backgroundColor: "#fff",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0d7a6b")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="mb-6">
              <label className="block mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full rounded-lg border pl-9 pr-10 py-3 outline-none transition-colors"
                  style={{
                    borderColor: "#d1d5db",
                    fontSize: "0.9375rem",
                    color: "#111827",
                    backgroundColor: "#fff",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#0d7a6b")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 outline-none"
                  style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Pesan Error Field Kosong */}
            {error && (
              <p className="mb-4" style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                {error}
              </p>
            )}

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 transition-opacity hover:opacity-90 border-none cursor-pointer outline-none shadow-sm"
              style={{ backgroundColor: "#0d7a6b", color: "#fff", fontSize: "0.9375rem", fontWeight: 600 }}
            >
              Login
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ==================== POPUP MODAL LOGIN GAGAL ==================== */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 relative">
            
            {/* Tombol Silang Pojok Kanan Atas */}
            <button 
              onClick={() => setIsErrorModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer outline-none"
            >
              <X size={18} />
            </button>

            {/* Icon Peringatan Merah */}
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Akses Ditolak!</h3>
            
            <p className="text-xs text-gray-500 leading-relaxed px-2 mb-6">
              Username atau Password yang Anda masukkan salah. Pastikan Anda masuk menggunakan akun Admin terdaftar.
            </p>

            <button
              onClick={() => setIsErrorModalOpen(false)}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-sm border-none shadow-sm transition-all cursor-pointer outline-none hover:bg-red-700"
              style={{ backgroundColor: "#ef4444" }}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}