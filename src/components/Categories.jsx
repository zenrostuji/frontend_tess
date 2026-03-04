export default function Categories({
  stories,
  categories,
  selectedTag,
  setSelectedTag,
  sort,
  setSort,
  loading,
  error,
  onSelectStory,
  onToggleLibrary,
  inLibrary
}) {
  return (
    <div className="category-section">
      {/* Category Header */}
      <div className="category-header">
        <div className="category-icon-large">📚</div>
        <div className="category-title-group">
          <h1>{selectedTag || "Tất cả thể loại"}</h1>
          <p className="category-count">{stories.length} truyện</p>
        </div>
      </div>

      {/* Filters */}
      <div className="category-filters">
        <div className="filter-group">
          <span className="filter-label">Sắp xếp:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="az">A → Z</option>
            <option value="popular">Phổ biến</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        <button
          className={!selectedTag ? "pill active" : "pill"}
          onClick={() => setSelectedTag("")}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedTag === cat ? "pill active" : "pill"}
            onClick={() => setSelectedTag(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="state loading">
          <div className="loading-spinner" />
          Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div className="state error">{error}</div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3 className="empty-title">Không có truyện phù hợp</h3>
          <p className="empty-desc">Hãy thử chọn thể loại khác hoặc xóa bộ lọc.</p>
        </div>
      ) : (
        <div className="story-grid">
          {stories.map((story, index) => (
            <article key={story._id} className="story-card">
              <div className="story-cover-wrapper">
                <div
                  className="story-cover"
                  style={{ backgroundImage: `url(${story.coverUrl})` }}
                  onClick={() => onSelectStory(story._id)}
                />
                {index < 3 && <span className="story-badge new">Mới</span>}
                <div className="story-overlay">
                  <div className="story-quick-actions">
                    <button className="quick-action-btn" onClick={() => onSelectStory(story._id)}>
                      Đọc ngay
                    </button>
                    <button
                      className="quick-action-btn ghost"
                      onClick={() => onToggleLibrary(story._id)}
                    >
                      {inLibrary(story._id) ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="story-info" onClick={() => onSelectStory(story._id)}>
                <div className="story-header">
                  <h3>{story.title}</h3>
                  <span className="story-author">{story.author}</span>
                </div>
                <div className="story-meta">
                  <span className="story-meta-item">📖 {story.chapters?.length || 0} chương</span>
                </div>
                <div className="story-tags-preview">
                  {story.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-mini">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
