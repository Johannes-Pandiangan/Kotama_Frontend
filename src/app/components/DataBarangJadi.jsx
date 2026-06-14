import { useState } from "react";
import { Search, Plus, Pencil, Trash2, ArrowUpRight, ArrowDownLeft, X } from "lucide-react";

const ITEMS_PER_PAGE = 5;
const API_URL = "https://kotama-backend.vercel.app/api/barang-jadi";

// MENERIMA PROPS DARI App.jsx
export function DataBarangJadi({ items, refreshData, isLoading }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateStockModalOpen, setIsUpdateStockModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [formKode, setFormKode] = useState(""); 
  const [formNama, setFormNama] = useState("");
  const [formUkuran, setFormUkuran] = useState("");
  const [formStok, setFormStok] = useState("");
  const [stockType, setStockType] = useState("masuk");
  const [stockDelta, setStockDelta] = useState("");
  const [stockError, setStockError] = useState(""); 

  const getStatusStyle = (status) => {
    if (status === "Habis") return { bg: "#fee2e2", text: "#ef4444" };
    if (status === "Menipis") return { bg: "#fef3c7", text: "#d97706" };
    return { bg: "#e8f5f2", text: "#0d7a6b" };
  };

  const filteredItems = items.filter((item) => {
    const matchNama = item.nama.toLowerCase().includes(search.toLowerCase());
    const matchKode = item.kode_barang ? item.kode_barang.toLowerCase().includes(search.toLowerCase()) : false;
    return matchNama || matchKode;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const nameCompare = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
    if (nameCompare !== 0) return nameCompare;
    return a.ukuran - b.ukuran;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
  const paginatedItems = sortedItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddBarang = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kode_barang: formKode, nama: formNama, ukuran: parseInt(formUkuran), stok: parseInt(formStok) }) });
      refreshData();
      setIsAddModalOpen(false); resetForm();
    } catch (error) { console.error("Gagal menambah sepatu:", error); }
  };

  const openEditModal = (item) => {
    setSelectedItem(item); setFormKode(item.kode_barang || ""); setFormNama(item.nama); setFormUkuran(item.ukuran); setFormStok(item.stok); setIsEditModalOpen(true);
  };

  const handleEditBarang = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/${selectedItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kode_barang: formKode, nama: formNama, ukuran: parseInt(formUkuran), stok: parseInt(formStok) }) });
      refreshData();
      setIsEditModalOpen(false); resetForm();
    } catch (error) { console.error("Gagal mengedit sepatu:", error); }
  };

  const openUpdateStockModal = (item) => {
    setSelectedItem(item); setStockType("masuk"); setStockDelta(""); setStockError(""); setIsUpdateStockModalOpen(true);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const delta = parseInt(stockDelta);
    if (stockType === "keluar" && delta > selectedItem.stok) {
      setStockError("Gagal: Jumlah keluar melebihi kapasitas stok saat ini!"); return;
    }

    try {
      await fetch(`${API_URL}/stok/${selectedItem.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delta, pergerakan: stockType }) });
      refreshData();
      setIsUpdateStockModalOpen(false);
    } catch (error) { console.error("Gagal update stok sepatu:", error); }
  };

  const handleDeleteBarang = async () => {
    try {
      await fetch(`${API_URL}/${selectedItem.id}`, { method: "DELETE" });
      refreshData();
      setIsDeleteModalOpen(false);
      if (paginatedItems.length === 1 && page > 1) setPage(page - 1);
    } catch (error) { console.error("Gagal menghapus sepatu:", error); }
  };

  const resetForm = () => { setFormKode(""); setFormNama(""); setFormUkuran(""); setFormStok(""); setSelectedItem(null); setStockError(""); };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#f5f7fa" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-7 pb-5 gap-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Data Barang Jadi (Sepatu)</h1>
        </div>
        <button onClick={() => { resetForm(); setIsAddModalOpen(true); }} className="flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm outline-none border-none cursor-pointer w-full sm:w-auto" style={{ backgroundColor: "#0d7a6b", fontSize: "0.875rem", fontWeight: 600 }}>
          <Plus size={16} /> Tambah Barang
        </button>
      </div>

      <div className="px-4 sm:px-8 pb-8 flex flex-col gap-5">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 pt-5 pb-4 gap-4">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>Daftar Inventaris Sepatu</h2>
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari kode atau nama sepatu..." className="w-full sm:w-[240px] rounded-lg pl-8 pr-4 py-2 outline-none text-gray-700 bg-gray-50 focus:border-[#0d7a6b]" style={{ border: "1px solid #e5e7eb", fontSize: "0.8125rem" }} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
                  <th className="py-3 px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Kode Barang</th>
                  <th className="py-3 px-6 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>Nama Barang</th>
                  <th className="py-3 px-6 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "12%" }}>Ukuran</th>
                  <th className="py-3 px-6 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "12%" }}>Stok</th>
                  <th className="py-3 px-6 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Status Stok</th>
                  <th className="py-3 px-6 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Update Stok</th>
                  <th className="py-3 px-6 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "15%" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 font-semibold text-sm">Mensinkronisasi data...</td></tr>
                ) : paginatedItems.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 text-sm">Tidak ada produk sepatu di database.</td></tr>
                ) : (
                  paginatedItems.map((item) => {
                    const status = getStatusStyle(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-sm text-gray-600">{item.kode_barang || "-"}</td>
                        <td className="py-3.5 px-6 font-medium text-sm text-gray-900">{item.nama}</td>
                        <td className="py-3.5 px-6 text-center text-sm text-gray-700">{item.ukuran}</td>
                        <td className="py-3.5 px-6 text-center font-bold text-sm text-gray-900">{item.stok}</td>
                        <td className="py-3.5 px-6 text-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium" style={{ fontSize: "0.75rem", backgroundColor: status.bg, color: status.text }}>{item.status}</span></td>
                        <td className="py-3.5 px-6 text-center flex justify-center"><button onClick={() => openUpdateStockModal(item)} className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors border-none outline-none cursor-pointer" style={{ backgroundColor: "#0d7a6b", color: "#ffffff" }}>Update</button></td>
                        <td className="py-3.5 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => openEditModal(item)} className="p-1.5 rounded-md text-gray-500 hover:text-[#0d7a6b] hover:bg-gray-100 transition-colors border-none outline-none cursor-pointer"><Pencil size={15} /></button>
                            <button onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }} className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors border-none outline-none cursor-pointer"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>Halaman {page} dari {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center bg-white disabled:bg-gray-50 disabled:text-gray-300 transition-colors text-sm cursor-pointer">‹</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center bg-white disabled:bg-gray-50 disabled:text-gray-300 transition-colors text-sm cursor-pointer">›</button>
            </div>
          </div>
        </div>
        <p className="text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>© USU Agile 2026</p>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah Barang Baru</h3>
            <form onSubmit={handleAddBarang} className="flex flex-col gap-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Kode Barang</label><input type="text" required value={formKode} onChange={(e) => setFormKode(e.target.value)} placeholder="Contoh: SPT-01" className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Nama Barang</label><input type="text" required value={formNama} onChange={(e) => setFormNama(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Ukuran (Size)</label><input type="number" required value={formUkuran} onChange={(e) => setFormUkuran(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Stok Awal</label><input type="number" required min="0" value={formStok} onChange={(e) => setFormStok(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer border-none">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none" style={{ backgroundColor: "#0d7a6b" }}>Simpan Barang</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Informasi Barang</h3>
            <form onSubmit={handleEditBarang} className="flex flex-col gap-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Kode Barang</label><input type="text" required value={formKode} onChange={(e) => setFormKode(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Nama Barang</label><input type="text" required value={formNama} onChange={(e) => setFormNama(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Ukuran (Size)</label><input type="number" required value={formUkuran} onChange={(e) => setFormUkuran(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Stok saat ini</label><input type="number" required min="0" value={formStok} onChange={(e) => setFormStok(e.target.value)} className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" /></div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer border-none">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none" style={{ backgroundColor: "#0d7a6b" }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUpdateStockModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Update Stok Barang</h3>
              <p className="text-xs text-gray-500 mt-1">{selectedItem.nama} (Size: {selectedItem.ukuran})</p>
            </div>
            <form onSubmit={handleUpdateStock} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Jenis Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setStockType("masuk"); setStockError(""); }} className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors border cursor-pointer outline-none" style={{ backgroundColor: stockType === "masuk" ? "#e8f5f2" : "#fff", color: stockType === "masuk" ? "#0d7a6b" : "#4b5563", borderColor: stockType === "masuk" ? "#0d7a6b" : "#e5e7eb" }}><ArrowUpRight size={16} /> Stok Masuk</button>
                  <button type="button" onClick={() => { setStockType("keluar"); setStockError(""); }} className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors border cursor-pointer outline-none" style={{ backgroundColor: stockType === "keluar" ? "#fee2e2" : "#fff", color: stockType === "keluar" ? "#ef4444" : "#4b5563", borderColor: stockType === "keluar" ? "#ef4444" : "#e5e7eb" }}><ArrowDownLeft size={16} /> Stok Keluar</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Barang</label>
                <input type="number" required min="1" value={stockDelta} onChange={(e) => { setStockDelta(e.target.value); setStockError(""); }} placeholder="Masukkan kuantitas jumlah..." className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]" />
                {stockError && <p className="text-xs text-red-500 mt-1 font-medium">{stockError}</p>}
                <p className="text-[11px] text-gray-400 mt-1">Stok saat ini: <span className="font-bold">{selectedItem.stok}</span></p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsUpdateStockModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border-none cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors border-none cursor-pointer" style={{ backgroundColor: stockType === "masuk" ? "#0d7a6b" : "#ef4444" }}>{stockType === "masuk" ? "Konfirmasi Masuk" : "Konfirmasi Keluar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={24} /></div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Hapus Barang Jadi?</h3>
            <p className="text-xs text-gray-500 px-2 mb-5">Yakin ingin menghapus <span className="font-semibold text-gray-800">"{selectedItem.nama}"</span>?</p>
            <div className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none cursor-pointer">Batal</button>
              <button type="button" onClick={handleDeleteBarang} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium text-white bg-red-500 border-none cursor-pointer">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}