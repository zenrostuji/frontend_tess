import { useState } from "react";

export default function Account({
  token,
  user,
  library,
  onLogin,
  onRegister,
  onLogout,
  onUpdateProfile
}) {
  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || "", email: user?.email || "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      if (authMode === "login") {
        await onLogin(formData);
      } else {
        await onRegister(formData);
      }
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Không thể xác thực.");
    }
  }

  // If not logged in, show auth form
  if (!token) {
    return (
      <div className="account-section">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">👤</div>
            <h2 className="auth-title">Chào mừng bạn</h2>
            <p className="auth-subtitle">Đăng nhập để lưu truyện yêu thích</p>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === "login" ? "auth-toggle-btn active" : "auth-toggle-btn"}
              onClick={() => setAuthMode("login")}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={authMode === "register" ? "auth-toggle-btn active" : "auth-toggle-btn"}
              onClick={() => setAuthMode("register")}
            >
              Đăng ký
            </button>
          </div>

          {error && <div className="state error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {authMode === "register" && (
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập họ tên của bạn"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="form-input"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>
            <button className="auth-submit" type="submit">
              {authMode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged in - show profile with tabs
  return (
    <div className="account-section">
      {/* Account Tabs */}
      <div className="account-tabs">
        <button
          className={activeTab === "profile" ? "account-tab active" : "account-tab"}
          onClick={() => setActiveTab("profile")}
        >
          👤 Hồ sơ
        </button>
        <button
          className={activeTab === "history" ? "account-tab active" : "account-tab"}
          onClick={() => setActiveTab("history")}
        >
          📖 Lịch sử đọc
        </button>
        <button
          className={activeTab === "settings" ? "account-tab active" : "account-tab"}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Cài đặt
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="account-card">
          <div className="account-header">
            <div className="account-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div className="account-info">
              <h2>{user?.name || "Người dùng"}</h2>
              <p className="account-email">{user?.email || ""}</p>
              <span className="account-role">{user?.role === "admin" ? "🛡️ Quản trị viên" : "👤 Thành viên"}</span>
            </div>
          </div>

          <div className="account-stats">
            <div className="account-stat-card">
              <span className="account-stat-value">{library?.length || 0}</span>
              <span className="account-stat-label">Đã lưu</span>
            </div>
            <div className="account-stat-card">
              <span className="account-stat-value">0</span>
              <span className="account-stat-label">Đã đọc</span>
            </div>
            <div className="account-stat-card">
              <span className="account-stat-value">0</span>
              <span className="account-stat-label">Bình luận</span>
            </div>
          </div>

          {editMode ? (
            <div className="profile-edit-form">
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  className="form-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div className="profile-edit-actions">
                <button className="primary" onClick={() => {
                  onUpdateProfile?.(profileData);
                  setEditMode(false);
                }}>
                  Lưu thay đổi
                </button>
                <button className="ghost" onClick={() => setEditMode(false)}>Hủy</button>
              </div>
            </div>
          ) : (
            <button className="primary" onClick={() => setEditMode(true)}>
              ✏️ Chỉnh sửa hồ sơ
            </button>
          )}

          <button className="ghost logout-btn" onClick={onLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="account-card">
          <h3 className="card-title">📖 Lịch sử đọc</h3>
          <div className="history-list">
            {library?.length > 0 ? (
              library.slice(0, 5).map((story) => (
                <div key={story._id} className="history-item">
                  <div
                    className="history-cover"
                    style={{ backgroundImage: `url(${story.coverUrl})` }}
                  />
                  <div className="history-info">
                    <h4>{story.title}</h4>
                    <p>{story.author}</p>
                    <span className="history-progress">Đọc đến chương 1</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state small">
                <p>Chưa có lịch sử đọc</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="account-card">
          <h3 className="card-title">⚙️ Cài đặt</h3>
          
          <div className="settings-section">
            <h4>Giao diện</h4>
            <div className="setting-item">
              <span>Chế độ tối</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <span>Cỡ chữ đọc truyện</span>
              <select className="setting-select">
                <option>Nhỏ</option>
                <option>Vừa</option>
                <option>Lớn</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h4>Thông báo</h4>
            <div className="setting-item">
              <span>Thông báo cập nhật truyện</span>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="danger-zone">
            <h4>⚠️ Vùng nguy hiểm</h4>
            <p>Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.</p>
            <button className="danger-btn">🗑️ Xóa tài khoản</button>
          </div>
        </div>
      )}
    </div>
  );
}
