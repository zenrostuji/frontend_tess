export default function CategoryModal({
  categories,
  selectedTag,
  onSelect,
  onClose
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content category-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📚 Chọn thể loại</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="category-grid">
            <button
              className={`category-card ${!selectedTag ? "active" : ""}`}
              onClick={() => onSelect("")}
            >
              <span className="category-icon">📖</span>
              <span className="category-name">Tất cả</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-card ${selectedTag === cat ? "active" : ""}`}
                onClick={() => onSelect(cat)}
              >
                <span className="category-icon">
                  {cat === "Tình cảm" ? "💕" :
                   cat === "Trinh thám" ? "🔍" :
                   cat === "Kinh dị" ? "👻" :
                   cat === "Hài hước" ? "😄" :
                   cat === "Phiêu lưu" ? "🗺️" :
                   cat === "Tâm lý" ? "🧠" :
                   cat === "Đô thị" ? "🏙️" :
                   cat === "Tiên hiệp" ? "⚔️" : "📚"}
                </span>
                <span className="category-name">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
