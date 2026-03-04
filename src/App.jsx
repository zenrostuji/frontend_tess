import { useEffect, useMemo, useState } from "react";
import {
  addToLibrary,
  fetchCategories,
  fetchLibrary,
  fetchStoriesFiltered,
  fetchStoryById,
  fetchCurrentUser,
  loginAccount,
  registerAccount,
  removeFromLibrary
} from "./api.js";
import Sidebar from "./components/Sidebar.jsx";
import HomePage from "./components/HomePage.jsx";
import Categories from "./components/Categories.jsx";
import StoryDetail from "./components/StoryDetail.jsx";
import ReadingPage from "./components/ReadingPage.jsx";
import CategoryModal from "./components/CategoryModal.jsx";
import Library from "./components/Library.jsx";
import Account from "./components/Account.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

const emptyStory = {
  _id: "",
  title: "",
  author: "",
  description: "",
  coverUrl: "",
  tags: [],
  chapters: []
};

export default function App() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(emptyStory);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [library, setLibrary] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Load stories and categories
  useEffect(() => {
    let active = true;
    async function loadBase() {
      try {
        if (active) {
          setLoading(true);
          setError("");
        }
        const [storyData, categoryData] = await Promise.all([
          fetchStoriesFiltered({ search, tag: selectedTag, sort }),
          fetchCategories()
        ]);
        if (!active) return;
        setStories(storyData);
        setCategories(categoryData);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Có lỗi xảy ra.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadBase();
    return () => {
      active = false;
    };
  }, [search, selectedTag, sort]);

  // Restore user session from token
  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!token) return;
      try {
        const userData = await fetchCurrentUser(token);
        if (!active) return;
        setUser(userData);
      } catch (err) {
        // Token invalid, clear it
        if (!active) return;
        console.error("Session restore error:", err);
        setToken("");
        localStorage.removeItem("token");
      }
    }
    restoreSession();
    return () => {
      active = false;
    };
  }, [token]);

  // Load library
  useEffect(() => {
    let active = true;
    async function loadLibrary() {
      if (!token) return;
      try {
        const data = await fetchLibrary(token);
        if (!active) return;
        setLibrary(data);
      } catch (err) {
        if (!active) return;
        console.error("Library load error:", err);
      }
    }
    loadLibrary();
    return () => {
      active = false;
    };
  }, [token]);

  const filteredStories = useMemo(() => stories, [stories]);

  const inLibrary = (storyId) => library.some((item) => item._id === storyId);

  async function handleSelect(storyId) {
    try {
      setError("");
      const story = await fetchStoryById(storyId);
      setSelectedStory(story);
      setSelectedChapterIndex(0);
      setShowDetail(true);
    } catch (err) {
      setError(err.message || "Không tải được truyện.");
    }
  }

  async function handleToggleLibrary(storyId) {
    if (!token) {
      setView("account");
      setError("Vui lòng đăng nhập để lưu thư viện.");
      return;
    }
    try {
      if (inLibrary(storyId)) {
        await removeFromLibrary(token, storyId);
        setLibrary((prev) => prev.filter((item) => item._id !== storyId));
      } else {
        await addToLibrary(token, storyId);
        const story = await fetchStoryById(storyId);
        setLibrary((prev) => [story, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Không thể cập nhật thư viện.");
    }
  }

  async function handleLogin(payload) {
    const data = await loginAccount(payload);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setView("home");
  }

  async function handleRegister(payload) {
    const data = await registerAccount(payload);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setView("home");
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    setLibrary([]);
    localStorage.removeItem("token");
  }

  function handleBackToList() {
    setShowDetail(false);
    setIsReading(false);
    setSelectedStory(emptyStory);
  }

  function handleStartReading(chapterIndex = 0) {
    setSelectedChapterIndex(chapterIndex);
    setIsReading(true);
  }

  function handleBackToDetail() {
    setIsReading(false);
  }

  function renderMainContent() {
    // Reading mode
    if (isReading && selectedStory._id) {
      return (
        <ReadingPage
          story={selectedStory}
          chapterIndex={selectedChapterIndex}
          setChapterIndex={setSelectedChapterIndex}
          onBack={handleBackToDetail}
          onBackToList={handleBackToList}
        />
      );
    }

    if (showDetail) {
      return (
        <StoryDetail
          story={selectedStory}
          selectedChapterIndex={selectedChapterIndex}
          setSelectedChapterIndex={setSelectedChapterIndex}
          onBack={handleBackToList}
          onToggleLibrary={handleToggleLibrary}
          inLibrary={inLibrary}
          setView={setView}
          setSelectedTag={setSelectedTag}
          onStartReading={handleStartReading}
        />
      );
    }

    switch (view) {
      case "home":
        return (
          <HomePage
            stories={filteredStories}
            categories={categories}
            onSelectStory={handleSelect}
            onToggleLibrary={handleToggleLibrary}
            inLibrary={inLibrary}
            setView={setView}
            setSelectedTag={setSelectedTag}
          />
        );
      case "categories":
        return (
          <Categories
            stories={filteredStories}
            categories={categories}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            sort={sort}
            setSort={setSort}
            loading={loading}
            error={error}
            onSelectStory={handleSelect}
            onToggleLibrary={handleToggleLibrary}
            inLibrary={inLibrary}
          />
        );
      case "library":
        return (
          <Library
            token={token}
            library={library}
            onSelectStory={handleSelect}
            onToggleLibrary={handleToggleLibrary}
          />
        );
      case "account":
        return (
          <Account
            token={token}
            user={user}
            library={library}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
          />
        );
      case "admin":
        return (
          <AdminPanel
            token={token}
            user={user}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => { setView("home"); setShowDetail(false); }}>
          <div className="brand-mark">AT</div>
          <div>
            <div className="brand-title">App Truyện</div>
            <div className="brand-subtitle">Không gian đọc truyện hiện đại</div>
          </div>
        </div>
        <div className="topbar-search">
          <span className="search-label">Tìm truyện</span>
          <input
            className="search-input"
            placeholder="Tìm kiếm truyện, tác giả..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="topbar-stats">
          <div className="stat-card">
            <span className="stat-label">Tổng truyện</span>
            <span className="stat-value">{stories.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Thể loại</span>
            <span className="stat-value">{categories.length}</span>
          </div>
        </div>
      </header>

      <div className={`layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Sidebar
          view={view}
          setView={setView}
          token={token}
          user={user}
          categories={categories}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenCategoryModal={() => setShowCategoryModal(true)}
          setShowDetail={setShowDetail}
        />

        <main className={`main-content view-${view}`}>
          {renderMainContent()}
        </main>
      </div>

      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          selectedTag={selectedTag}
          onSelect={(tag) => {
            setSelectedTag(tag);
            setView("categories");
            setShowCategoryModal(false);
            setShowDetail(false);
          }}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
