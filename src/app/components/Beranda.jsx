import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertTriangle, ChevronDown, Search, Calendar } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// FUNGSI PINTAR FORMAT STOK
const formatNilaiStok = (stok, satuan) => {
  if (stok === undefined || stok === null) return 0;
  const num = Number(stok);
  if (satuan && (satuan.toLowerCase() === "meter" || satuan.toLowerCase() === "kaki")) {
    return parseFloat(num.toFixed(1)); 
  }
  return Math.round(num); 
};

// MENERIMA PROPS DARI App.jsx
export function Beranda({ dataGudang, dataBarangJadi, dataRiwayat, isLoading }) {
  const [category, setCategory] = useState("Tapak");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [filterBulan, setFilterBulan] = useState(currentMonthStr);

  const KATEGORI_LIST = ["Tapak", "Kulit", "Lapis", "Pelengkap", "Barang Jadi (Sepatu)"];
  const isSepatu = category === "Barang Jadi (Sepatu)";

  const currentCategoryData = isSepatu ? dataBarangJadi : dataGudang.filter((item) => item.kategori === category);
  const totalJenis = currentCategoryData.length;
  
  // PENERAPAN FORMAT PADA TOTAL STOK
  const totalStokRaw = currentCategoryData.reduce((sum, item) => sum + Number(item.stok), 0);
  const isDesimal = category === "Lapis" || category === "Kulit";
  const totalStok = isSepatu ? Math.round(totalStokRaw) : (isDesimal ? parseFloat(totalStokRaw.toFixed(1)) : Math.round(totalStokRaw));
  
  const lowStockItemsAll = currentCategoryData.filter((item) => isSepatu ? item.stok <= 10 : item.stok < 20);
  const stokRendah = lowStockItemsAll.length;

  const unitJenis = isSepatu ? "Jenis Sepatu" : `Jenis ${category}`;
  const unitStok = isSepatu ? "Pasang" : category === "Tapak" ? "Pasang" : category === "Kulit" ? "Lembar / Kaki" : category === "Lapis" ? "Meter" : "Pcs";

  const generateChartData = () => {
    const weeks = [
      { week: "Minggu 1", masuk: 0, keluar: 0 },
      { week: "Minggu 2", masuk: 0, keluar: 0 },
      { week: "Minggu 3", masuk: 0, keluar: 0 },
      { week: "Minggu 4", masuk: 0, keluar: 0 },
    ];

    if (isSepatu) return weeks; 

    const riwayatKategoriBulan = dataRiwayat.filter((r) => {
      const dateObj = new Date(r.tanggal);
      const rMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      return r.kategori === category && rMonth === filterBulan;
    });

    riwayatKategoriBulan.forEach((r) => {
      const dateNum = new Date(r.tanggal).getDate(); 
      let weekIndex = 0;
      if (dateNum > 7 && dateNum <= 14) weekIndex = 1;
      else if (dateNum > 14 && dateNum <= 21) weekIndex = 2;
      else if (dateNum > 21) weekIndex = 3;

      if (r.aktivitas === "masuk") weeks[weekIndex].masuk += Number(r.jumlah);
      else if (r.aktivitas === "keluar") weeks[weekIndex].keluar += Number(r.jumlah);
    });

    // Mencegah angka float aneh di Chart (e.g. 0.30000004)
    weeks.forEach(w => {
      w.masuk = parseFloat(w.masuk.toFixed(1));
      w.keluar = parseFloat(w.keluar.toFixed(1));
    });

    return weeks;
  };

  const chartData = generateChartData();
  const filteredSearch = lowStockItemsAll.filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()));

  const sortedLowStock = [...filteredSearch].sort((a, b) => {
    const nameCompare = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
    if (nameCompare !== 0) return nameCompare;
    if (isSepatu) return a.ukuran - b.ukuran;
    return a.type.localeCompare(b.type, undefined, { numeric: true, sensitivity: "base" });
  });

  const totalPages = Math.max(1, Math.ceil(sortedLowStock.length / ITEMS_PER_PAGE));
  const paginatedItems = sortedLowStock.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleCategoryChange(cat) {
    setCategory(cat); setDropdownOpen(false); setPage(1); setSearch("");
  }

  const getStatusStyle = (status) => {
    if (status === "Habis") return { bg: "#fee2e2", text: "#ef4444" };
    if (status === "Menipis") return { bg: "#fef3c7", text: "#d97706" };
    return { bg: "#e8f5f2", text: "#0d7a6b" };
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen items-center justify-center" style={{ backgroundColor: "#f5f7fa" }}>
        <p className="text-gray-500 font-semibold animate-pulse">Menyelaraskan data Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#f5f7fa" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-7 pb-5 gap-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Dashboard Utama</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: 4 }}>Ringkasan data real-time material gudang</p>
        </div>
        <div className="relative w-full sm:w-auto z-20">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 shadow-sm w-full sm:w-auto" style={{ border: "1px solid #e5e7eb", fontSize: "0.9rem", fontWeight: 500, color: "#374151", cursor: "pointer", justifyContent: "space-between" }}>
            <span>Kategori {category}</span><ChevronDown size={16} style={{ color: "#6b7280" }} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-1 bg-white rounded-lg shadow-lg w-full sm:min-w-[160px]" style={{ border: "1px solid #e5e7eb" }}>
              {KATEGORI_LIST.map((cat) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className="w-full text-left px-4 py-2.5 transition-colors" style={{ fontSize: "0.875rem", color: cat === category ? "#0d7a6b" : "#374151", fontWeight: cat === category ? 600 : 400, backgroundColor: cat === category ? "#e8f5f2" : "transparent", border: "none", cursor: "pointer" }}>{cat}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-8 pb-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Jenis {category}</p>
            <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "#111827", marginTop: 8, lineHeight: 1 }}>{totalJenis}</p>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 6 }}>{unitJenis}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Stok {category}</p>
            <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "#111827", marginTop: 8, lineHeight: 1 }}>{totalStok}</p>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: 6 }}>{unitStok}</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm relative" style={{ border: "1px solid #fecaca", backgroundColor: "#fff5f5" }}>
            <div className="flex items-center justify-between"><p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#ef4444", letterSpacing: "0.08em", textTransform: "uppercase" }}>Hampir Habis</p><AlertTriangle size={18} style={{ color: "#ef4444" }} /></div>
            <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "#ef4444", marginTop: 8, lineHeight: 1 }}>{stokRendah}</p>
            <p style={{ fontSize: "0.8125rem", color: "#ef4444", marginTop: 6 }}>perlu restock</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-x-auto" style={{ border: "1px solid #e5e7eb" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-4">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>Tren Inventaris</h2>
            {!isSepatu && (
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                <input type="month" value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="rounded-lg pl-9 pr-4 py-2 outline-none border text-sm" style={{ border: "1px solid #e5e7eb", color: "#374151", backgroundColor: "#f9fafb" }} />
              </div>
            )}
          </div>
          <div className="min-w-[400px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={2}>
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} tickCount={5} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="masuk" name="Masuk" fill="#0d7a6b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="keluar" name="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 pt-5 pb-4 gap-4">
            <div className="flex items-center gap-2"><AlertTriangle size={18} style={{ color: "#ef4444" }} /><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>Peringatan Stok Rendah</h2></div>
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari barang" className="w-full sm:w-[200px] rounded-lg pl-8 pr-4 py-2 outline-none" style={{ border: "1px solid #e5e7eb", fontSize: "0.8125rem", color: "#374151" }} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th className="py-3 px-4 sm:px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Nama Produk</th>
                  <th className="py-3 px-4 sm:px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>{isSepatu ? "Ukuran" : "Type"}</th>
                  <th className="py-3 px-4 sm:px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Jumlah Stok</th>
                  <th className="py-3 px-4 sm:px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center" style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Tidak ada peringatan stok rendah.</td></tr>
                ) : (
                  paginatedItems.map((item) => {
                    const status = getStatusStyle(item.status || (item.stok === 0 ? "Habis" : "Menipis"));
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td className="py-3 px-4 sm:px-6 font-medium" style={{ fontSize: "0.875rem", color: "#111827" }}>{item.nama}</td>
                        <td className="py-3 px-4 sm:px-6" style={{ fontSize: "0.875rem", color: "#374151" }}>{isSepatu ? item.ukuran : item.type}</td>
                        <td className="py-3 px-4 sm:px-6 font-semibold" style={{ fontSize: "0.875rem", color: item.stok === 0 ? "#ef4444" : "#f59e0b" }}>
                          {isSepatu ? Math.round(item.stok) : formatNilaiStok(item.stok, item.satuan)} 
                          <span className="text-gray-400 font-normal">{!isSepatu && ` ${item.satuan}`}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: status.bg, color: status.text }}>{item.status || (item.stok === 0 ? "Habis" : "Menipis")}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ borderTop: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>Hal {page} dari {totalPages || 1}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 cursor-pointer disabled:bg-gray-50">‹</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 cursor-pointer disabled:bg-gray-50">›</button>
            </div>
          </div>
        </div>
        <p className="text-center pb-2 pt-4" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>© USU Agile 2026</p>
      </div>
    </div>
  );
}