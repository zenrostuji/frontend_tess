export default function HomePage({
  stories,
  categories,
  onSelectStory,
  onToggleLibrary,
  inLibrary,
  setView,
  setSelectedTag
}) {
  // Get featured stories (first 3)
  const featuredStories = stories.slice(0, 3);
  // Get latest stories (first 8)
  const latestStories = stories.slice(0, 8);
  // Get popular stories (shuffle and take 8)
  const popularStories = [...stories].sort(() => 0.5 - Math.random()).slice(0, 8);

  return (
    <div className="home-section">
      {/* Banner */}
      <div className="home-banner">
        <div className="banner-bg" style={{ backgroundImage: `url(${featuredStories[0]?.coverUrl || ''})` }} />
        <div className="banner-overlay" />
        <div className="banner-content">
          <div className="banner-text">
            <div className="banner-badge">
              <span className="banner-badge-icon">✨</span>
              Khám phá ngay hôm nay
            </div>
            <h1 className="banner-title">Thế giới truyện đang chờ bạn</h1>
            <p className="banner-desc">
              Hàng nghìn tác phẩm hay đang chờ đợi. Từ tiểu thuyết tình cảm đến trinh thám hấp dẫn, 
              tất cả đều có tại App Truyện.
            </p>
            <div className="banner-actions">
              <button className="btn-primary" onClick={() => setView("categories")}>
                Khám phá ngay
              </button>
              <button className="btn-ghost" onClick={() => setView("library")}>
                Xem thư viện
              </button>
            </div>
          </div>
          <div className="banner-featured">
            {featuredStories.map((story) => (
              <div
                key={story._id}
                className="banner-story-card"
                onClick={() => onSelectStory(story._id)}
              >
                <div
                  className="banner-story-cover"
                  style={{ backgroundImage: `url(${story.coverUrl})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Stories Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-group">
            <div className="section-icon">🆕</div>
            <div>
              <div className="section-kicker">Cập nhật mới</div>
              <h2 className="section-title">Truyện mới nhất</h2>
            </div>
          </div>
          <button className="view-all-btn" onClick={() => setView("categories")}>
            Xem tất cả →
          </button>
        </div>
        <div className="story-grid">
          {latestStories.map((story, index) => (
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
                      Đọc
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
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Popular Stories Section */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-group">
            <div className="section-icon">🔥</div>
            <div>
              <div className="section-kicker">Phổ biến</div>
              <h2 className="section-title">Được yêu thích nhất</h2>
            </div>
          </div>
          <button className="view-all-btn" onClick={() => setView("categories")}>
            Xem tất cả →
          </button>
        </div>
        <div className="story-grid">
          {popularStories.map((story, index) => (
            <article key={story._id} className="story-card">
              <div className="story-cover-wrapper">
                <div
                  className="story-cover"
                  style={{ backgroundImage: `url(${story.coverUrl})` }}
                  onClick={() => onSelectStory(story._id)}
                />
                {index < 2 && <span className="story-badge hot">Hot</span>}
                <div className="story-overlay">
                  <div className="story-quick-actions">
                    <button className="quick-action-btn" onClick={() => onSelectStory(story._id)}>
                      Đọc
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
                <div className="story-tags-preview">
                  {story.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-mini">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories Quick Access */}
      <section className="section">
        <div className="section-header">
          <div className="section-title-group">
            <div className="section-icon">📂</div>
            <div>
              <div className="section-kicker">Khám phá</div>
              <h2 className="section-title">Thể loại nổi bật</h2>
            </div>
          </div>
        </div>
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className="pill"
              onClick={() => {
                setSelectedTag(cat);
                setView("categories");
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
