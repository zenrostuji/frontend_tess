export default function ReadingPage({
  story,
  chapterIndex,
  setChapterIndex,
  onBack
}) {
  const chapter = story.chapters?.[chapterIndex];
  const totalChapters = story.chapters?.length || 0;
  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < totalChapters - 1;

  return (
    <div className="reading-page">
      {/* Reading Header */}
      <div className="reading-header">
        <button className="reading-back" onClick={onBack}>
          ← Quay lại
        </button>
        <div className="reading-info">
          <h2 className="reading-story-title">{story.title}</h2>
          <span className="reading-chapter-info">
            Chương {chapterIndex + 1}/{totalChapters}
          </span>
        </div>
        <div className="reading-chapter-select">
          <select
            value={chapterIndex}
            onChange={(e) => setChapterIndex(Number(e.target.value))}
          >
            {story.chapters?.map((ch, idx) => (
              <option key={idx} value={idx}>
                Chương {idx + 1}: {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapter Content */}
      <article className="reading-content">
        <h1 className="chapter-main-title">{chapter?.title}</h1>
        <div className="chapter-text">
          {chapter?.content?.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* Reading Navigation */}
      <div className="reading-nav">
        <button
          className="reading-nav-btn prev"
          disabled={!hasPrev}
          onClick={() => setChapterIndex(chapterIndex - 1)}
        >
          ← Chương trước
        </button>
        <button className="reading-nav-btn list" onClick={onBack}>
          📚 Danh sách chương
        </button>
        <button
          className="reading-nav-btn next"
          disabled={!hasNext}
          onClick={() => setChapterIndex(chapterIndex + 1)}
        >
          Chương sau →
        </button>
      </div>

      {/* Reading Settings Bar */}
      <div className="reading-settings">
        <span className="reading-progress">
          📖 {Math.round(((chapterIndex + 1) / totalChapters) * 100)}% hoàn thành
        </span>
      </div>
    </div>
  );
}
