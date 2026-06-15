import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const ITEMS_PER_PAGE = 4;
const API_URL = "https://kotama-backend.vercel.app/api/gudang";

const statusStyle = {
  Aman: { bg: "#d1fae5", color: "#059669" },
  Menipis: { bg: "#fef3c7", color: "#d97706" },
  Habis: { bg: "#fee2e2", color: "#ef4444" },
};

function FormBarang({ initial, onSave, onCancel }) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [kategori, setKategori] = useState(initial?.kategori ?? "Tapak");
  const [type, setType] = useState(initial?.type ?? "");
  const [stok, setStok] = useState(initial?.stok?.toString() ?? "");
  const [satuan, setSatuan] = useState(initial?.satuan ?? "pasang");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nama.trim() || !type.trim() || stok === "") return;
    onSave({ nama: nama.trim(), kategori, type: type.trim(), stok: parseInt(stok) || 0, satuan });
  }

  const inputStyle = { width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem", color: "#111827", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" };
  const labelStyle = { fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827" }}>{initial ? "Edit Barang" : "Tambah Barang"}</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div><label style={labelStyle}>Nama Barang</label><input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Masukkan nama barang" style={inputStyle} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Kategori</label>
              <div className="relative">
                <select value={kategori} onChange={(e) => setKategori(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: 36, cursor: "pointer" }}>
                  <option value="Tapak">Tapak</option>
                  <option value="Kulit">Kulit</option>
                  <option value="Lapis">Lapis</option>
                  <option value="Pelengkap">Pelengkap</option>
                </select>
                <ChevronRight size={15} className="absolute right-3 top-1/2 pointer-events-none text-gray-400 transform -translate-y-1/2 rotate-90" />
              </div>
            </div>
            <div><label style={labelStyle}>Type Barang</label><input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Ukuran/Warna" style={inputStyle} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={labelStyle}>Jumlah Stock</label><input type="number" value={stok} onChange={(e) => setStok(e.target.value)} placeholder="0" min={0} style={inputStyle} required /></div>
            <div>
              <label style={labelStyle}>Satuan</label>
              <div className="relative">
                <select value={satuan} onChange={(e) => setSatuan(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: 36, cursor: "pointer" }}>
                  <option value="pasang">Pasang</option>
                  <option value="kaki">Kaki</option>
                  <option value="lembar">Lembar</option>
                  <option value="pcs">PCS</option>
                  <option value="meter">Meter</option>
                </select>
                <ChevronRight size={15} className="absolute right-3 top-1/2 pointer-events-none text-gray-400 transform -translate-y-1/2 rotate-90" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 cursor-pointer border-none">Batal</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer border-none" style={{ backgroundColor: "#0d7a6b" }}>Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UpdateStok({ barang, onSave, onCancel }) {
  const [pergerakan, setPergerakan] = useState("masuk");
  const [jumlah, setJumlah] = useState("");
  const [pengambil, setPengambil] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const DAFTAR_PEKERJA = ["Pengrajin 1", "Pengrajin 2", "Pengrajin 3", "Pengrajin 4", "Pengrajin 5", "Pengrajin 6", "Pengrajin 7", "Pengrajin 8", "Pengrajin 9", "Pengrajin 10", "Pengrajin 11", "Pengrajin 12", "Pengrajin 13", "Pengrajin 14", "Pengrajin 15", "Pengrajin 16", "Pengrajin 17", "Pengrajin 18", "Pengrajin 19", "Pengrajin 20", "Pengrajin 21", "Pengrajin 22", "Pengrajin 23", "Pengrajin 24", "Pengrajin 25", "Pengrajin 26", "Pengrajin 27", "Pengrajin 28", "Pengrajin 29", "Pengrajin 30"];

  function handleSave(e) {
    e.preventDefault();
    const val = parseInt(jumlah);
    if (!val || val <= 0) return;

    if (pergerakan === "keluar" && val > barang.stok) {
      setErrorMsg("Gagal: Jumlah keluar melebihi stok material saat ini!");
      return;
    }
    if (pergerakan === "keluar" && !pengambil) {
      setErrorMsg("Gagal: Pilih nama pekerja yang mengambil barang!");
      return;
    }

    setErrorMsg("");
    onSave(barang.id, val, pergerakan, pengambil);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827" }}>Update Stok Material</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
          <div className="rounded-lg p-3" style={{ backgroundColor: "#f9fafb", border: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Item Terpilih</p>
            <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>{barang.nama}</p>
            <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Type: {barang.type}</p>
          </div>

          <div>
            <label style={{ fontSize: "0.65rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setPergerakan("masuk"); setErrorMsg(""); }} className="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer outline-none font-semibold text-sm" style={{ border: `1px solid ${pergerakan === "masuk" ? "#0d7a6b" : "#e5e7eb"}`, backgroundColor: pergerakan === "masuk" ? "#e8f5f2" : "#fff", color: pergerakan === "masuk" ? "#0d7a6b" : "#6b7280" }}><ArrowUpRight size={16} /> Stok Masuk</button>
              <button type="button" onClick={() => { setPergerakan("keluar"); setErrorMsg(""); }} className="flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors cursor-pointer outline-none font-semibold text-sm" style={{ border: `1px solid ${pergerakan === "keluar" ? "#ef4444" : "#e5e7eb"}`, backgroundColor: pergerakan === "keluar" ? "#fee2e2" : "#fff", color: pergerakan === "keluar" ? "#ef4444" : "#6b7280" }}><ArrowDownLeft size={16} /> Stok Keluar</button>
            </div>
          </div>

          {pergerakan === "keluar" && (
            <div>
              <label style={{ fontSize: "0.65rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Nama Pengambil</label>
              <select value={pengambil} onChange={(e) => { setPengambil(e.target.value); setErrorMsg(""); }} style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem", color: "#111827", outline: "none", backgroundColor: "#fff" }}>
                <option value="">-- Pilih Nama Pekerja --</option>
                {DAFTAR_PEKERJA.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: "0.65rem", fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Jumlah Barang</label>
            <input type="number" value={jumlah} onChange={(e) => { setJumlah(e.target.value); setErrorMsg(""); }} placeholder="Masukkan kuantitas..." min={1} required style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: "0.9rem", color: "#111827", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }} />
            {errorMsg && <p className="text-xs text-red-500 mt-1 font-medium">{errorMsg}</p>}
            <p className="text-[11px] text-gray-400 mt-1">Stok saat ini: <span className="font-bold">{barang.stok} {barang.satuan}</span></p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 cursor-pointer border-none">Batal</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer border-none transition-colors" style={{ backgroundColor: pergerakan === "masuk" ? "#0d7a6b" : "#ef4444" }}>{pergerakan === "masuk" ? "Konfirmasi Masuk" : "Konfirmasi Keluar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDelete({ nama, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.35)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3" style={{ backgroundColor: "#fee2e2" }}><Trash2 size={24} style={{ color: "#ef4444" }} /></div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Hapus Barang?</h3>
        <p className="text-xs text-gray-500 px-2 mb-5">Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-800">"{nama}"</span>?</p>
        <div className="flex items-center justify-center gap-2">
          <button onClick={onCancel} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-none cursor-pointer">Batal</button>
          <button onClick={onConfirm} className="px-4 py-2 flex-1 rounded-lg text-sm font-medium text-white bg-red-500 border-none cursor-pointer">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

// MENERIMA PROPS DARI App.jsx
export function DataGudang({ data, refreshData, isLoading }) {
  const [search, setSearch] = useState("");
  const [filterKat, setFilterKat] = useState("Semua");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = data.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase());
    const matchKat = filterKat === "Semua" || item.kategori === filterKat;
    return matchSearch && matchKat;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    const nameCompare = a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
    if (nameCompare !== 0) return nameCompare;
    return a.type.localeCompare(b.type, undefined, { numeric: true, sensitivity: "base" });
  });

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / ITEMS_PER_PAGE));
  const paginated = sortedFiltered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Fungsi API tetap dipertahankan, namun menggunakan "refreshData" dari induk
  async function handleSaveBarang(formData) {
    try {
      if (editTarget) {
        await fetch(`${API_URL}/${editTarget.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      } else {
        await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      }
      refreshData();
      setShowForm(false);
      setEditTarget(null);
    } catch (error) { console.error("Gagal menyimpan barang", error); }
  }

  async function handleUpdateStok(id, delta, pergerakan, pengambil) {
    try {
      await fetch(`${API_URL}/stok/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delta, pergerakan, pengambil }) });
      refreshData();
      setUpdateTarget(null);
    } catch (error) { console.error("Gagal update stok", error); }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      refreshData();
      setDeleteTarget(null);
      if (paginated.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (error) { console.error("Gagal menghapus barang", error); }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ backgroundColor: "#f5f7fa" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 pt-7 pb-5 gap-4">
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>Data Bahan Baku</h1>
        </div>
        <button onClick={() => { setEditTarget(null); setShowForm(true); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg w-full sm:w-auto transition-colors" style={{ backgroundColor: "#0d7a6b", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
          <Plus size={16} /> Tambah Bahan Baku
        </button>
      </div>

      <div className="px-4 sm:px-8 pb-8 flex flex-col gap-4">
        <div className="bg-white rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm" style={{ border: "1px solid #e5e7eb" }}>
          <div className="relative w-full sm:flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari Nama Bahan Baku..." className="w-full rounded-lg pl-9 pr-4 py-2 outline-none text-sm bg-gray-50 border border-transparent focus:border-[#0d7a6b]" style={{ color: "#374151" }} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: 500 }}>Filter:</span>
            <div className="relative flex-1 sm:flex-none">
              <select value={filterKat} onChange={(e) => { setFilterKat(e.target.value); setPage(1); }} className="w-full sm:w-[150px] rounded-lg px-3 py-2 pr-8 outline-none text-sm bg-white border border-gray-200 focus:border-[#0d7a6b] cursor-pointer appearance-none">
                <option value="Semua">Semua Kategori</option>
                <option value="Tapak">Tapak</option>
                <option value="Kulit">Kulit</option>
                <option value="Lapis">Lapis</option>
                <option value="Pelengkap">Pelengkap</option>
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 pointer-events-none text-gray-500 transform -translate-y-1/2 rotate-90" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                  {[{ label: "Nama Barang", w: "22%" }, { label: "Kategori", w: "15%" }, { label: "Type", w: "12%" }, { label: "Stok", w: "15%" }, { label: "Status Stock", w: "14%" }, { label: "Update Stok", w: "12%" }, { label: "Aksi", w: "10%" }].map((col) => (
                    <th key={col.label} className="py-3.5 px-5 text-left" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", width: col.w }}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 font-semibold text-sm">Mensinkronisasi data...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center text-gray-400 text-sm">Belum ada barang di database.</td></tr>
                ) : (
                  paginated.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors" style={{ borderBottom: idx < paginated.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <td className="py-4 px-5 font-medium text-sm text-gray-900">{item.nama}</td>
                      <td className="py-4 px-5 text-sm text-gray-700">{item.kategori}</td>
                      <td className="py-4 px-5 text-sm text-gray-700">{item.type}</td>
                      <td className="py-4 px-5 font-semibold text-sm text-gray-900">{item.stok} <span className="text-gray-500 font-normal">{item.satuan}</span></td>
                      <td className="py-4 px-5"><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusStyle[item.status]?.bg || "#e5e7eb", color: statusStyle[item.status]?.color || "#374151" }}>{item.status}</span></td>
                      <td className="py-4 px-5"><button onClick={() => setUpdateTarget(item)} className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border-none outline-none" style={{ backgroundColor: "#0d7a6b", color: "#ffffff" }}>Update</button></td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditTarget(item); setShowForm(true); }} className="p-1.5 rounded-md text-gray-400 hover:text-[#0d7a6b] hover:bg-gray-100 transition-colors border-none cursor-pointer"><Pencil size={16} /></button>
                          <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "0.8125rem", color: "#6b7280" }}>Halaman {page} dari {totalPages}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white disabled:bg-gray-50 disabled:text-gray-300 transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white disabled:bg-gray-50 disabled:text-gray-300 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <p className="text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>© USU Agile 2026</p>
      </div>

      {showForm && <FormBarang initial={editTarget ?? undefined} onSave={handleSaveBarang} onCancel={() => { setShowForm(false); setEditTarget(null); }} />}
      {updateTarget && <UpdateStok barang={updateTarget} onSave={handleUpdateStok} onCancel={() => setUpdateTarget(null)} />}
      {deleteTarget && <ConfirmDelete nama={deleteTarget.nama} onConfirm={() => handleDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
