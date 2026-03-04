export default function Library({ token, library, onSelectStory, onToggleLibrary }) {
  return (
    <div className="library-section">
      <div className="section-header">
        <div className="section-title-group">
          <div className="section-icon">📖</div>
          <div>
            <div className="section-kicker">Thư viện của bạn</div>
            <h2 className="section-title">Truyện đã lưu</h2>
          </div>
        </div>
        <div className="section-meta">{library.length} truyện</div>
      </div>

      {!token ? (
        <div className="library-empty">
          <div className="library-empty-icon">🔐</div>
          <h3>Đăng nhập để xem thư viện</h3>
          <p>Hãy đăng nhập để lưu và quản lý truyện yêu thích của bạn.</p>
        </div>
      ) : library.length === 0 ? (
        <div className="library-empty">
          <div className="library-empty-icon">📭</div>
          <h3>Thư viện trống</h3>
          <p>Bạn chưa lưu truyện nào. Hãy khám phá và thêm truyện yêu thích!</p>
        </div>
      ) : (
        <div className="story-grid">
          {library.map((story) => (
            <article key={story._id} className="story-card">
              <div className="story-cover-wrapper">
                <div
                  className="story-cover"
                  style={{ backgroundImage: `url(${story.coverUrl})` }}
                  onClick={() => onSelectStory(story._id)}
                />
                <div className="story-overlay">
                  <div className="story-quick-actions">
                    <button className="quick-action-btn" onClick={() => onSelectStory(story._id)}>
                      Đọc tiếp
                    </button>
                    <button
                      className="quick-action-btn ghost"
                      onClick={() => onToggleLibrary(story._id)}
                    >
                      ✕
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
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
