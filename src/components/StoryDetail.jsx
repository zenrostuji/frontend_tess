export default function StoryDetail({
  story,
  selectedChapterIndex,
  setSelectedChapterIndex,
  onBack,
  onToggleLibrary,
  inLibrary,
  setView,
  setSelectedTag,
  onStartReading
}) {
  return (
    <div className="story-detail">
      {/* Back Button */}
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>

      {/* Hero Section */}
      <div className="detail-hero">
        <div className="detail-cover-wrapper">
          <div
            className="detail-cover"
            style={{ backgroundImage: `url(${story.coverUrl})` }}
          />
          <div
            className="detail-cover-glow"
            style={{ backgroundImage: `url(${story.coverUrl})` }}
          />
        </div>
        <div className="detail-body">
          <h2>{story.title}</h2>
          <div className="detail-author">
            <span className="detail-author-icon">✍️</span>
            <span>{story.author}</span>
          </div>
          
          <div className="detail-stats">
            <div className="detail-stat">
              <span className="detail-stat-value">{story.chapters?.length || 0}</span>
              <span className="detail-stat-label">Chương</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-value">{story.tags?.length || 0}</span>
              <span className="detail-stat-label">Thể loại</span>
            </div>
          </div>

          <p className="detail-desc">{story.description}</p>

          <div className="detail-tags">
            {story.tags?.map((tag) => (
              <button
                key={tag}
                className="detail-tag"
                onClick={() => {
                  setSelectedTag(tag);
                  setView("categories");
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="detail-actions">
            <button
              className="detail-action-btn primary"
              onClick={() => onStartReading(0)}
            >
              📖 Đọc từ đầu
            </button>
            {story.chapters?.length > 1 && (
              <button
                className="detail-action-btn"
                onClick={() => onStartReading(story.chapters.length - 1)}
              >
                📕 Đọc chương mới nhất
              </button>
            )}
            <button
              className="detail-action-btn secondary"
              onClick={() => onToggleLibrary(story._id)}
            >
              {inLibrary(story._id) ? "💔 Bỏ lưu" : "❤️ Lưu thư viện"}
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Section */}
      <div className="chapter-section">
        <div className="chapter-header">
          <h3 className="chapter-title">📚 Danh sách chương</h3>
          <span className="chapter-count">{story.chapters?.length || 0} chương</span>
        </div>

        <div className="chapter-list">
          {story.chapters?.map((chapter, index) => (
            <button
              key={chapter.title}
              className={index === selectedChapterIndex ? "chapter-button active" : "chapter-button"}
              onClick={() => onStartReading(index)}
            >
              <span className="chapter-num">{index + 1}</span>
              <span className="chapter-name">{chapter.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
