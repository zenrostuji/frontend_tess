import { useState } from "react";

export default function Sidebar({ 
  view, 
  setView, 
  token, 
  user, 
  categories, 
  selectedTag, 
  setSelectedTag, 
  collapsed, 
  setCollapsed,
  onOpenCategoryModal,
  setShowDetail
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavClick = (newView) => {
    setView(newView);
    setShowDetail(false);
  };

  return (
    <aside className="nav-panel">
      <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "→" : "←"}
      </button>

      <div className="nav-header">Menu chính</div>
      <div className="nav-group">
        <button
          className={view === "home" ? "nav-button active" : "nav-button"}
          onClick={() => handleNavClick("home")}
          title="Trang chủ"
        >
          <span className="nav-icon">🏠</span>
          <span>Trang chủ</span>
        </button>

        {/* Category with Modal */}
        <button
          className={view === "categories" ? "nav-button active" : "nav-button"}
          onClick={onOpenCategoryModal}
          title="Thể loại"
        >
          <span className="nav-icon">📚</span>
          <span>Thể loại</span>
        </button>

        <button
          className={view === "library" ? "nav-button active" : "nav-button"}
          onClick={() => handleNavClick("library")}
          title="Thư viện"
        >
          <span className="nav-icon">📖</span>
          <span>Thư viện</span>
        </button>
      </div>

      <div className="nav-header">Tài khoản</div>
      <div className="nav-group">
        <button
          className={view === "account" ? "nav-button active" : "nav-button"}
          onClick={() => handleNavClick("account")}
          title="Hồ sơ"
        >
          <span className="nav-icon">👤</span>
          <span>Hồ sơ</span>
        </button>

        {/* Admin - only show for admin users */}
        {user?.role === "admin" && (
          <button
            className={view === "admin" ? "nav-button active admin-btn" : "nav-button admin-btn"}
            onClick={() => handleNavClick("admin")}
            title="Quản trị"
          >
            <span className="nav-icon">⚙️</span>
            <span>Quản trị</span>
          </button>
        )}
      </div>

      <div className="nav-footer">
        <div className="nav-label">Trạng thái</div>
        {token ? (
          <div className="user-chip">
            <span className="user-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            <span>Xin chào, {user?.name || "độc giả"}</span>
          </div>
        ) : (
          <div className="user-chip muted">
            <span className="user-avatar">?</span>
            <span>Chế độ khách</span>
          </div>
        )}
      </div>
    </aside>
  );
}
