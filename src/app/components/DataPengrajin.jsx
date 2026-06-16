import { useState } from "react";
import { Search, Plus, Trash2, Users } from "lucide-react";

export function DataPengrajin({ dataPengrajin, refreshData, isLoading, showNotification }) {
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formNama, setFormNama] = useState("");

  const API_URL = "https://kotama-backend.vercel.app/api/pengrajin";

  // LOGIKA PENCARIAN NAMA PENGRAJIN
  const filteredData = dataPengrajin.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: formNama }),
      });
      if (!res.ok) throw new Error("Gagal menambah atau nama sudah ada");
      refreshData();
      setIsAddModalOpen(false);
      setFormNama("");
      showNotification("Pengrajin baru berhasil ditambahkan!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${selectedWorker.id}`, { method: "DELETE" });
      refreshData();
      setIsDeleteModalOpen(false);
      setSelectedWorker(null);
      showNotification("Data pengrajin berhasil dihapus!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#f5f7fa" }}>
      {/* HEADER UTAMA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-7 pb-5 gap-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Daftar Pengrajin</h1>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: 4 }}>
            Kelola daftar pekerja yang terintegrasi dengan sistem gudang dan alat IoT.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg w-full sm:w-auto transition-colors shadow-sm outline-none"
          style={{ backgroundColor: "#0d7a6b", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          <Plus size={16} /> Tambah Pengrajin
        </button>
      </div>

      <div className="px-4 sm:px-8 pb-8 flex flex-col gap-4">
        {/* BAR PENCARIAN */}
        <div className="bg-white rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pengrajin..."
              className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm bg-gray-50 border border-transparent focus:border-[#0d7a6b]"
              style={{ color: "#374151" }}
            />
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                  <th className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "80%" }}>
                    Nama Pengrajin
                  </th>
                  <th className="py-3.5 px-5 text-center" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", width: "20%" }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="py-14 text-center text-gray-400 font-semibold text-sm">
                      Menyelaraskan data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-14 text-center text-gray-400 text-sm">
                      Belum ada pengrajin terdaftar.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: idx < filteredData.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <td className="py-4 px-5 font-bold text-sm flex items-center gap-2" style={{ color: "#0d7a6b" }}>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <Users size={14} />
                        </div>
                        {item.nama}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => { setSelectedWorker(item); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer outline-none"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL MODAL FORM TAMBAH PEKERJA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah Pengrajin</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nama Lengkap Pekerja</label>
                <input
                  type="text"
                  required
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-lg px-3 py-2 border border-gray-200 outline-none text-sm focus:border-[#0d7a6b]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer border-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer border-none"
                  style={{ backgroundColor: "#0d7a6b" }}
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VALIDASI HAPUS PEKERJA */}
      {isDeleteModalOpen && selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Hapus Data Pekerja?</h3>
            <p className="text-xs text-gray-500 px-2 mb-5">
              Anda yakin ingin menghapus <span className="font-bold text-gray-800">"{selectedWorker.nama}"</span>? Nama ini tidak akan muncul lagi pada daftar dan menu alat IoT.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 flex-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 flex-1 rounded-lg text-sm font-medium text-white bg-red-500 border-none cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}