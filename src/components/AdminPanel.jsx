import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminPanel({ token, user, onClose }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingStory, setEditingStory] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddStory, setShowAddStory] = useState(false);

  // Load data
  useEffect(() => {
    if (activeTab === "stories") loadStories();
    if (activeTab === "users") loadUsers();
  }, [activeTab]);

  async function loadStories() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stories`);
      const data = await res.json();
      setStories(data);
    } catch (err) {
      setError("Không tải được danh sách truyện");
    }
    setLoading(false);
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Không tải được danh sách người dùng");
    }
    setLoading(false);
  }

  async function handleDeleteStory(id) {
    if (!confirm("Bạn có chắc muốn xóa truyện này?")) return;
    try {
      await fetch(`${API_URL}/api/admin/stories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setStories(stories.filter(s => s._id !== id));
    } catch (err) {
      setError("Không thể xóa truyện");
    }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      setError("Không thể xóa người dùng");
    }
  }

  async function handleSaveStory(storyData) {
    try {
      const isEdit = !!storyData._id;
      const url = isEdit 
        ? `${API_URL}/api/admin/stories/${storyData._id}`
        : `${API_URL}/api/admin/stories`;
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(storyData)
      });
      
      if (!res.ok) throw new Error("Lỗi khi lưu");
      
      loadStories();
      setEditingStory(null);
      setShowAddStory(false);
    } catch (err) {
      setError("Không thể lưu truyện");
    }
  }

  async function handleSaveUser(userData) {
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!res.ok) throw new Error("Lỗi khi lưu");
      
      loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError("Không thể lưu người dùng");
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛡️ Quản trị hệ thống</h1>
        <button className="admin-close" onClick={onClose}>✕ Đóng</button>
      </div>

      <div className="admin-layout">
        {/* Admin Sidebar */}
        <div className="admin-sidebar">
          <button
            className={activeTab === "dashboard" ? "admin-nav-btn active" : "admin-nav-btn"}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === "stories" ? "admin-nav-btn active" : "admin-nav-btn"}
            onClick={() => setActiveTab("stories")}
          >
            📚 Quản lý truyện
          </button>
          <button
            className={activeTab === "users" ? "admin-nav-btn active" : "admin-nav-btn"}
            onClick={() => setActiveTab("users")}
          >
            👥 Quản lý người dùng
          </button>
        </div>

        {/* Admin Content */}
        <div className="admin-content">
          {error && <div className="state error">{error}</div>}

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="admin-dashboard">
              <h2>Tổng quan</h2>
              <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-icon">📚</span>
                  <span className="dashboard-stat-value">{stories.length || "-"}</span>
                  <span className="dashboard-stat-label">Truyện</span>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-icon">👥</span>
                  <span className="dashboard-stat-value">{users.length || "-"}</span>
                  <span className="dashboard-stat-label">Người dùng</span>
                </div>
                <div className="dashboard-stat-card">
                  <span className="dashboard-stat-icon">📖</span>
                  <span className="dashboard-stat-value">0</span>
                  <span className="dashboard-stat-label">Lượt đọc</span>
                </div>
              </div>
              <div className="dashboard-actions">
                <button className="primary" onClick={() => { setActiveTab("stories"); setShowAddStory(true); }}>
                  ➕ Thêm truyện mới
                </button>
              </div>
            </div>
          )}

          {/* Stories Management */}
          {activeTab === "stories" && (
            <div className="admin-stories">
              <div className="admin-section-header">
                <h2>📚 Quản lý truyện</h2>
                <button className="primary" onClick={() => setShowAddStory(true)}>
                  ➕ Thêm truyện
                </button>
              </div>

              {loading ? (
                <div className="state loading">Đang tải...</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Bìa</th>
                      <th>Tên truyện</th>
                      <th>Tác giả</th>
                      <th>Thể loại</th>
                      <th>Chương</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map(story => (
                      <tr key={story._id}>
                        <td>
                          <div 
                            className="admin-story-cover"
                            style={{ backgroundImage: `url(${story.coverUrl})` }}
                          />
                        </td>
                        <td><strong>{story.title}</strong></td>
                        <td>{story.author}</td>
                        <td>{story.tags?.join(", ")}</td>
                        <td>{story.chapters?.length || 0}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn-edit" onClick={() => setEditingStory(story)}>
                              ✏️
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteStory(story._id)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Users Management */}
          {activeTab === "users" && (
            <div className="admin-users">
              <div className="admin-section-header">
                <h2>👥 Quản lý người dùng</h2>
              </div>

              {loading ? (
                <div className="state loading">Đang tải...</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="admin-user-avatar">
                            {u.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        </td>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn-edit" onClick={() => setEditingUser(u)}>
                              ✏️
                            </button>
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u._id === user?._id}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Story Modal */}
      {(editingStory || showAddStory) && (
        <StoryFormModal
          story={editingStory}
          onSave={handleSaveStory}
          onClose={() => { setEditingStory(null); setShowAddStory(false); }}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <UserFormModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

// Story Form Modal
function StoryFormModal({ story, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: story?._id || "",
    title: story?.title || "",
    author: story?.author || "",
    description: story?.description || "",
    coverUrl: story?.coverUrl || "",
    tags: story?.tags?.join(", ") || "",
    chapters: story?.chapters || []
  });
  const [newChapter, setNewChapter] = useState({ title: "", content: "" });

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
    });
  }

  function addChapter() {
    if (!newChapter.title) return;
    setForm({
      ...form,
      chapters: [...form.chapters, newChapter]
    });
    setNewChapter({ title: "", content: "" });
  }

  function removeChapter(index) {
    setForm({
      ...form,
      chapters: form.chapters.filter((_, i) => i !== index)
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{story ? "✏️ Sửa truyện" : "➕ Thêm truyện mới"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên truyện</label>
              <input
                className="form-input"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tác giả</label>
              <input
                className="form-input"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">URL bìa</label>
            <input
              className="form-input"
              value={form.coverUrl}
              onChange={e => setForm({ ...form, coverUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Thể loại (phân cách bằng dấu phẩy)</label>
            <input
              className="form-input"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="Tình cảm, Trinh thám, ..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Chapters */}
          <div className="form-group">
            <label className="form-label">Danh sách chương ({form.chapters.length})</label>
            <div className="chapters-list">
              {form.chapters.map((ch, idx) => (
                <div key={idx} className="chapter-item">
                  <span>Chương {idx + 1}: {ch.title}</span>
                  <button type="button" className="btn-delete small" onClick={() => removeChapter(idx)}>✕</button>
                </div>
              ))}
            </div>
            <div className="add-chapter-form">
              <input
                className="form-input"
                placeholder="Tiêu đề chương"
                value={newChapter.title}
                onChange={e => setNewChapter({ ...newChapter, title: e.target.value })}
              />
              <textarea
                className="form-input"
                placeholder="Nội dung chương"
                rows={2}
                value={newChapter.content}
                onChange={e => setNewChapter({ ...newChapter, content: e.target.value })}
              />
              <button type="button" className="ghost" onClick={addChapter}>+ Thêm chương</button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="primary">💾 Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// User Form Modal
function UserFormModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "user"
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Sửa người dùng</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên</label>
            <input
              className="form-input"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò</label>
            <select
              className="form-input"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="primary">💾 Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
