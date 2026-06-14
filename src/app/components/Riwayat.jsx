import { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronLeft, FileSpreadsheet, CheckCircle2, X, Calendar } from "lucide-react";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 5;

// MENERIMA PROPS DARI App.jsx
export function Riwayat({ historyGudang, historySepatu, isLoading }) {
  const [tipeData, setTipeData] = useState("Bahan Baku");
  const [search, setSearch] = useState("");
  const [filterAktivitas, setFilterAktivitas] = useState("Semua");
  const [timeFilterMode, setTimeFilterMode] = useState("Semua"); 
  const [timeFilterValue, setTimeFilterValue] = useState(""); 
  const [page, setPage] = useState(1);
  const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);

  const currentData = tipeData === "Bahan Baku" ? historyGudang : historySepatu;

  const filteredHistory = currentData.filter((item) => {
    const isSepatu = tipeData === "Barang Jadi";
    
    const matchSearch = isSepatu 
      ? (item.nama.toLowerCase().includes(search.toLowerCase()) || (item.kode_barang && item.kode_barang.toLowerCase().includes(search.toLowerCase())))
      : (item.nama.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase()));

    const matchAktivitas = filterAktivitas === "Semua" || item.aktivitas === filterAktivitas.toLowerCase();
    
    let matchWaktu = true;
    if (timeFilterMode !== "Semua" && timeFilterValue) {
      const itemDateObj = new Date(item.tanggal);
      const yyyy = itemDateObj.getFullYear();
      const mm = String(itemDateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(itemDateObj.getDate()).padStart(2, '0');

      if (timeFilterMode === "Tanggal") matchWaktu = `${yyyy}-${mm}-${dd}` === timeFilterValue;
      else if (timeFilterMode === "Bulan") matchWaktu = `${yyyy}-${mm}` === timeFilterValue;
      else if (timeFilterMode === "Tahun") matchWaktu = `${yyyy}` === timeFilterValue;
    }
    return matchSearch && matchAktivitas && matchWaktu;
  });

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / ITEMS_PER_PAGE));
  const paginatedHistory = filteredHistory.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [tipeData, filterAktivitas, timeFilterMode, timeFilterValue, search]);

  const handleExportExcel = () => {
    if (filteredHistory.length === 0) return alert("Tidak ada data untuk diexport!");

    let dataToExport = [];
    let wscols = [];

    if (tipeData === "Bahan Baku") {
      dataToExport = filteredHistory.map((item, index) => ({
        "No": index + 1, "Nama Barang": item.nama, "Kategori": item.kategori, "Type": item.type, "Aktivitas": item.aktivitas === "masuk" ? "Stok Masuk" : "Stok Keluar", "Jumlah": item.aktivitas === "masuk" ? `+${item.jumlah}` : `-${item.jumlah}`, "Pengambil": item.pengambil || "-", "Tanggal Update": new Date(item.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      }));
      wscols = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 25 }];
    } else {
      dataToExport = filteredHistory.map((item, index) => ({
        "No": index + 1, "Kode Barang": item.kode_barang || "-", "Nama Barang": item.nama, "Ukuran": item.ukuran, "Aktivitas": item.aktivitas === "masuk" ? "Stok Masuk" : "Stok Keluar", "Jumlah": item.aktivitas === "masuk" ? `+${item.jumlah}` : `-${item.jumlah}`, "Tanggal Update": new Date(item.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      }));
      wscols = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 25 }];
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Riwayat_${tipeData}`);
    XLSX.writeFile(workbook, `Laporan_Riwayat_${tipeData.replace(" ", "_")}.xlsx`);
    setIsExportSuccessOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#f5f7fa" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-7 pb-5 gap-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Riwayat Logistik</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: 4 }}>Memantau jejak otomatis arus masuk dan keluar barang</p>
        </div>
        <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm outline-none border-none cursor-pointer w-full sm:w-auto hover:bg-emerald-700" style={{ backgroundColor: "#107c41", fontSize: "0.875rem", fontWeight: 600 }}>
          <FileSpreadsheet size={16} /> Export Excel
        </button>
      </div>

      <div className="px-4 sm:px-8 pb-8 flex flex-col gap-4">
        <div className="bg-white rounded-xl px-4 py-3 flex flex-col lg:flex-row items-start lg:items-center gap-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500, minWidth: "60px" }}>Tabel:</span>
            <div className="relative flex-1 lg:w-[170px]">
              <select value={tipeData} onChange={(e) => setTipeData(e.target.value)} className="w-full rounded-lg px-3 py-2 pr-8 outline-none text-sm bg-gray-50 border border-transparent focus:border-[#0d7a6b] cursor-pointer appearance-none text-gray-900 font-medium">
                <option value="Bahan Baku">Data Bahan Baku</option>
                <option value="Barang Jadi">Data Barang Jadi</option>
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 pointer-events-none text-gray-500 transform -translate-y-1/2 rotate-90" />
            </div>
          </div>

          <div className="hidden lg:block h-8 w-px bg-gray-200"></div>

          <div className="relative w-full lg:flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tipeData === "Barang Jadi" ? "Cari kode atau nama sepatu..." : "Cari nama barang atau tipe..."} className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm bg-gray-50 border border-transparent focus:border-[#0d7a6b]" style={{ color: "#374151" }} />
          </div>

          <div className="relative w-full lg:w-auto">
            <select value={filterAktivitas} onChange={(e) => setFilterAktivitas(e.target.value)} className="w-full lg:w-[140px] rounded-lg px-3 py-2 pr-8 outline-none text-sm bg-white border border-gray-200 focus:border-[#0d7a6b] cursor-pointer appearance-none text-gray-700">
              <option value="Semua">Semua Aktivitas</option>
              <option value="Masuk">Stok Masuk</option>
              <option value="Keluar">Stok Keluar</option>
            </select>
            <ChevronRight size={14} className="absolute right-2.5 top-1/2 pointer-events-none text-gray-500 transform -translate-y-1/2 rotate-90" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-[130px]">
              <select value={timeFilterMode} onChange={(e) => { setTimeFilterMode(e.target.value); setTimeFilterValue(""); }} className="w-full rounded-lg px-3 py-2 pr-8 outline-none text-sm bg-white border border-gray-200 focus:border-[#0d7a6b] cursor-pointer appearance-none text-gray-700">
                <option value="Semua">Semua Waktu</option>
                <option value="Tanggal">Per Tanggal</option>
                <option value="Bulan">Per Bulan</option>
                <option value="Tahun">Per Tahun</option>
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 pointer-events-none text-gray-500 transform -translate-y-1/2 rotate-90" />
            </div>

            {timeFilterMode !== "Semua" && (
              <div className="relative w-full sm:w-[160px] flex items-center">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
                {timeFilterMode === "Tanggal" && <input type="date" value={timeFilterValue} onChange={(e) => setTimeFilterValue(e.target.value)} className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm border focus:border-[#0d7a6b] cursor-pointer" style={{ borderColor: "#e5e7eb", color: timeFilterValue ? "#374151" : "#9ca3af", backgroundColor: "#fff" }} />}
                {timeFilterMode === "Bulan" && <input type="month" value={timeFilterValue} onChange={(e) => setTimeFilterValue(e.target.value)} className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm border focus:border-[#0d7a6b] cursor-pointer" style={{ borderColor: "#e5e7eb", color: timeFilterValue ? "#374151" : "#9ca3af", backgroundColor: "#fff" }} />}
                {timeFilterMode === "Tahun" && <input type="number" placeholder="Tahun (cth: 2026)" min="2000" max="2100" value={timeFilterValue} onChange={(e) => setTimeFilterValue(e.target.value)} className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm border focus:border-[#0d7a6b]" style={{ borderColor: "#e5e7eb", color: timeFilterValue ? "#374151" : "#9ca3af", backgroundColor: "#fff" }} />}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px]">
              <thead>
                {tipeData === "Bahan Baku" ? (
                  <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "20%" }}>Nama Barang</th>
                    <th className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "12%" }}>Kategori</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "10%" }}>Type</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "12%" }}>Aktivitas</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "12%" }}>Jumlah</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "18%" }}>Pengambil</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "16%" }}>Tanggal Update</th>
                  </tr>
                ) : (
                  <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <th className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Kode Barang</th>
                    <th className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "25%" }}>Nama Barang</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "10%" }}>Ukuran</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Aktivitas</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Jumlah</th>
                    <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "20%" }}>Tanggal Update</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 font-semibold text-sm">Mengambil rekaman riwayat...</td></tr>
                ) : paginatedHistory.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 text-sm">Tidak ada rekaman riwayat log yang ditemukan.</td></tr>
                ) : (
                  paginatedHistory.map((item, idx) => {
                    const isMasuk = item.aktivitas === "masuk";
                    const formattedDate = new Date(item.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
                    
                    if (tipeData === "Bahan Baku") {
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: idx < paginatedHistory.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <td className="py-4 px-5 font-medium" style={{ fontSize: "0.875rem", color: "#111827" }}>{item.nama}</td>
                          <td className="py-4 px-5" style={{ fontSize: "0.875rem", color: "#374151" }}>{item.kategori}</td>
                          <td className="py-4 px-5 text-center" style={{ fontSize: "0.875rem", color: "#374151" }}>{item.type}</td>
                          <td className="py-4 px-5 text-center"><span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor: isMasuk ? "#e8f5f2" : "#fee2e2", color: isMasuk ? "#0d7a6b" : "#ef4444" }}>{item.aktivitas}</span></td>
                          <td className="py-4 px-5 text-center font-bold" style={{ fontSize: "0.875rem", color: isMasuk ? "#0d7a6b" : "#ef4444" }}>{isMasuk ? `+${item.jumlah}` : `-${item.jumlah}`}</td>
                          <td className="py-4 px-5 text-center" style={{ fontSize: "0.875rem", color: "#111827", fontWeight: 500 }}>{item.pengambil || "-"}</td>
                          <td className="py-4 px-5 text-center text-gray-500" style={{ fontSize: "0.8125rem" }}>{formattedDate}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: idx < paginatedHistory.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                          <td className="py-4 px-5 font-bold" style={{ fontSize: "0.875rem", color: "#6b7280" }}>{item.kode_barang || "-"}</td>
                          <td className="py-4 px-5 font-medium" style={{ fontSize: "0.875rem", color: "#111827" }}>{item.nama}</td>
                          <td className="py-4 px-5 text-center" style={{ fontSize: "0.875rem", color: "#374151" }}>{item.ukuran}</td>
                          <td className="py-4 px-5 text-center"><span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor: isMasuk ? "#e8f5f2" : "#fee2e2", color: isMasuk ? "#0d7a6b" : "#ef4444" }}>{item.aktivitas}</span></td>
                          <td className="py-4 px-5 text-center font-bold" style={{ fontSize: "0.875rem", color: isMasuk ? "#0d7a6b" : "#ef4444" }}>{isMasuk ? `+${item.jumlah}` : `-${item.jumlah}`}</td>
                          <td className="py-4 px-5 text-center text-gray-500" style={{ fontSize: "0.8125rem" }}>{formattedDate}</td>
                        </tr>
                      );
                    }
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>Halaman {page} dari {totalPages || 1}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white disabled:opacity-50 transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white disabled:opacity-50 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <p className="text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>© USU Agile 2026</p>
      </div>

      {isExportSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setIsExportSuccessOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer outline-none"><X size={18} /></button>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Export Berhasil!</h3>
            <p className="text-xs text-gray-500 leading-relaxed px-2 mb-6">Seluruh data laporan riwayat logistik telah berhasil dikonversi dan diunduh ke perangkat Anda dalam format <span className="font-semibold text-emerald-700">.xlsx (Excel)</span>.</p>
            <button onClick={() => setIsExportSuccessOpen(false)} className="w-full py-2.5 rounded-xl text-white font-semibold text-sm border-none shadow-sm transition-all cursor-pointer outline-none hover:bg-emerald-700" style={{ backgroundColor: "#107c41" }}>Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}