import { LayoutDashboard, Warehouse, Package, History, HelpCircle, LogOut, Users } from "lucide-react";

const navItems = [
  { id: "beranda", label: "Beranda", icon: LayoutDashboard },
  { id: "data-gudang", label: "Data Bahan Baku", icon: Warehouse },
  { id: "data-barang-jadi", label: "Data Barang Jadi", icon: Package },
  { id: "data-pengrajin", label: "Daftar Pengrajin", icon: Users },
  { id: "riwayat", label: "Riwayat", icon: History },
];

export function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 shrink-0"
      style={{ width: 240, backgroundColor: "#fff", borderRight: "1px solid #e5e7eb" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 36, height: 36, backgroundColor: "#0d7a6b", color: "#fff", fontWeight: 700, fontSize: "1rem" }}
        >
          K
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "#111827", lineHeight: 1.2 }}>
            Kotama Warehouse
          </p>
          <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 2 }}>
            Sistem Manajemen Gudang
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                  style={{
                    backgroundColor: isActive ? "#e8f5f2" : "transparent",
                    color: isActive ? "#0d7a6b" : "#4b5563",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.875rem",
                    borderLeft: isActive ? "3px solid #0d7a6b" : "3px solid transparent",
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: "#4b5563", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <HelpCircle size={17} />
          Panduan
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: "#ef4444", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
