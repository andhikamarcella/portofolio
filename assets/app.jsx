const { useState, useMemo, useEffect } = React;

const API_BASE = "./api";

const STORAGE_KEY = "react-portfolio-projects";

const defaultProjects = [
  {
    id: "sunrise-festival",
    title: "Sunrise Music Festival Poster",
    category: "Poster Event",
    status: "concept",
    summary: "Konsep poster festival musik dengan energi sunrise neon.",
    description:
      "Eksplorasi tipografi blok dan gradien neon untuk menghadirkan poster panggung musik sunrise. Menonjolkan line-up artis, jadwal panggung, dan QR code RSVP dalam layout modular.",
    technologies: ["Adobe Photoshop", "Adobe Illustrator", "Gradien Neon"],
    liveUrl: "https://www.behance.net/",
    repoUrl: "",
    createdAt: "2024-08-04",
  },
  {
    id: "brew-day",
    title: "Daily Brew Promo Poster",
    category: "Poster Promosi",
    status: "concept",
    summary: "Poster promo coffee shop bergaya minimalis dengan fokus produk.",
    description:
      "Menggabungkan fotografi produk dan ilustrasi grainy untuk promo buy 1 get 1. Layout grid memudahkan penempatan informasi harga, lokasi, serta highlight rasa signature blend.",
    technologies: ["Adobe Illustrator", "Affinity Photo", "Texture Overlay"],
    liveUrl: "https://www.behance.net/",
    repoUrl: "",
    createdAt: "2024-07-12",
  },
  {
    id: "creative-labs",
    title: "Creative Labs Workshop Poster",
    category: "Poster Komunitas",
    status: "concept",
    summary: "Poster workshop komunitas kreatif dengan layout editorial.",
    description:
      "Poster editorial dengan kolom informasi terstruktur, highlight pembicara, dan palet monokrom biru. Fokus pada keterbacaan tipografi dan konsistensi branding acara komunitas.",
    technologies: ["Figma", "Adobe InDesign", "Editorial Layout"],
    liveUrl: "https://www.behance.net/",
    repoUrl: "",
    createdAt: "2024-05-28",
  },
];

const timelineItems = [
  {
    year: "2024",
    title: "Freelance Poster Designer",
    description:
      "Mulai menerima project poster komersial dengan fokus pada kampanye musik, promo coffee shop, dan acara komunitas.",
    status: "live",
  },
  {
    year: "2023",
    title: "Brand & Visual Intern",
    description:
      "Mendukung tim marketing menyiapkan materi poster kampanye dan adaptasi sosial media dengan tempo mingguan.",
    status: "live",
  },
  {
    year: "2022",
    title: "Graphic Design Student",
    description:
      "Mengasah dasar komposisi poster, eksplorasi tipografi, dan kolaborasi moodboard lintas komunitas desain.",
    status: "prototype",
  },
];

const skills = [
  { label: "Layout & Composition", value: 92 },
  { label: "Typography Pairing", value: 88 },
  { label: "Color Grading", value: 90 },
  { label: "Creative Direction", value: 84 },
];

const servicePackages = [
  {
    id: "launch",
    name: "Campaign Launch Poster",
    tagline: "Poster hero untuk peluncuran produk atau campaign besar.",
    duration: "3 hari kerja",
    bestFor: "Brand activation, konser musik, peluncuran startup",
    features: [
      "Moodboard warna & tipografi khusus brand",
      "2 konsep layout awal sebelum revisi",
      "Export siap cetak (A2/A3) & versi digital",
      "Optimasi QR code & CTA yang terbaca",
    ],
  },
  {
    id: "promo",
    name: "Promo Sosial Media",
    tagline: "Poster promosi yang adaptif untuk feed, story, dan reel cover.",
    duration: "2 hari kerja",
    bestFor: "Promo coffee shop, restoran, retail lokal",
    features: [
      "Template ukuran Instagram & TikTok",
      "Highlight copy promo & harga yang konversi",
      "Eksplorasi tekstur grainy & ilustrasi pendukung",
      "Optimasi warna untuk layar mobile",
    ],
  },
  {
    id: "community",
    name: "Community Poster",
    tagline: "Poster editorial untuk workshop atau acara komunitas.",
    duration: "4 hari kerja",
    bestFor: "Komunitas kreatif, kampus, organisasi sosial",
    features: [
      "Struktur informasi multi-narasumber",
      "Hierarchy tipografi yang mudah dibaca",
      "Sistem grid modular untuk adaptasi media",
      "File sumber editable untuk update berikutnya",
    ],
  },
];

const workflowSteps = [
  {
    title: "Discovery via WhatsApp",
    detail: "Kumpulkan kebutuhan inti (tujuan poster, target audiens, dan batas waktu) langsung dari chat WhatsApp sehingga proses terasa santai.",
  },
  {
    title: "Moodboard & Draft",
    detail: "Saya susun moodboard interaktif dan 1-2 draft awal agar arah visual langsung dapat disetujui sejak awal.",
  },
  {
    title: "Final Touch",
    detail: "Setelah revisi disepakati, poster dirapikan, diexport siap cetak, serta disertai panduan penggunaan warna dan font.",
  },
];

const inspirationPresets = [
  {
    id: "neon",
    label: "Neon Sunrise",
    vibe: ["energetic", "music"],
    palette: ["#FF6B6B", "#FF9F1C", "#5F0A87", "#2EC4B6"],
    typography: "Bold sans + condensed",
    texture: "Noise grain + light streak",
  },
  {
    id: "minimal",
    label: "Mono Minimal",
    vibe: ["minimal", "coffee"],
    palette: ["#0F172A", "#E2E8F0", "#94A3B8", "#FACC15"],
    typography: "Serif editorial + grotesk",
    texture: "Subtle paper grain",
  },
  {
    id: "retro",
    label: "Retro Funk",
    vibe: ["artsy", "event"],
    palette: ["#F15BB5", "#FEE440", "#00BBF9", "#00F5D4"],
    typography: "Rounded display",
    texture: "Halftone dots",
  },
  {
    id: "calm",
    label: "Calm Workshop",
    vibe: ["community", "education"],
    palette: ["#312E81", "#6366F1", "#A5B4FC", "#EEF2FF"],
    typography: "Geometric sans + mono",
    texture: "Soft gradient",
  },
];

const inspirationFilters = [
  { id: "all", label: "Semua" },
  { id: "energetic", label: "Energetic" },
  { id: "minimal", label: "Minimal" },
  { id: "coffee", label: "Coffee Shop" },
  { id: "event", label: "Event" },
  { id: "community", label: "Komunitas" },
  { id: "education", label: "Edukasi" },
  { id: "artsy", label: "Artsy" },
  { id: "music", label: "Musik" },
];

const BASE_POSTER_RATE = 250000;

const posterSizeOptions = [
  { id: "digital", label: "Digital (Feed & Story)", multiplier: 1 },
  { id: "print", label: "Cetak A3/A2", multiplier: 1.35 },
  { id: "billboard", label: "Outdoor / Billboard", multiplier: 1.8 },
];

const posterUrgencyOptions = [
  { id: "normal", label: "Normal 3-4 hari", multiplier: 1 },
  { id: "express", label: "Express 48 jam", multiplier: 1.5 },
  { id: "rush", label: "Rush 24 jam", multiplier: 1.9 },
];

const posterAddOns = [
  { id: "mockup", label: "Mockup poster 3D", price: 75000 },
  { id: "social", label: "Turunan 4 ukuran sosial media", price: 90000 },
  { id: "copywriting", label: "Copywriting CTA & headline", price: 65000 },
];

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Math.round(value));
}

function useLocalStorageProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProjects;
    } catch (error) {
      console.error("Failed to load projects from storage", error);
      return defaultProjects;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  return [projects, setProjects];
}

function useAuth() {
  const [state, setState] = useState({
    authenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const refreshSession = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/session.php`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal memuat status sesi");
      }

      const data = await response.json();
      setState({
        authenticated: Boolean(data.authenticated),
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        authenticated: false,
        user: null,
        loading: false,
        error: error.message || "Tidak dapat terhubung ke server",
      }));
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = React.useCallback(async (credentials) => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login gagal");
      }

      setState({
        authenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
      return { success: true };
    } catch (error) {
      const message = error.message || "Login gagal";
      setState({
        authenticated: false,
        user: null,
        loading: false,
        error: message,
      });
      return { success: false, message };
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setState({
        authenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  return { ...state, login, logout, refreshSession };
}

function useProjectApi() {
  const [projects, setProjects] = useLocalStorageProjects();
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const fetchProjects = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/projects.php`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat project dari server");
      }

      const data = await response.json();
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
        setLastSyncedAt(new Date());
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Tidak dapat memuat data project");
    } finally {
      setLoading(false);
    }
  }, [setProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = React.useCallback(
    async (payload) => {
      setMutating(true);
      try {
        const response = await fetch(`${API_BASE}/projects.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal menambah project");
        }

        if (data.project) {
          setProjects((current) => [
            data.project,
            ...current.filter((item) => String(item.id) !== String(data.project.id)),
          ]);
          setLastSyncedAt(new Date());
        }
        setError(null);
        return data.project;
      } catch (err) {
        const message = err.message || "Gagal menambah project";
        setError(message);
        throw new Error(message);
      } finally {
        setMutating(false);
      }
    },
    [setProjects]
  );

  const updateProject = React.useCallback(
    async (id, payload) => {
      setMutating(true);
      try {
        const response = await fetch(`${API_BASE}/projects.php?id=${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...payload, id }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal memperbarui project");
        }

        if (data.project) {
          setProjects((current) =>
            current.map((project) => (String(project.id) === String(data.project.id) ? data.project : project))
          );
          setLastSyncedAt(new Date());
        }
        setError(null);
        return data.project;
      } catch (err) {
        const message = err.message || "Gagal memperbarui project";
        setError(message);
        throw new Error(message);
      } finally {
        setMutating(false);
      }
    },
    [setProjects]
  );

  const deleteProject = React.useCallback(
    async (id) => {
      setMutating(true);
      try {
        const response = await fetch(`${API_BASE}/projects.php?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal menghapus project");
        }

        setProjects((current) => current.filter((project) => String(project.id) !== String(id)));
        setLastSyncedAt(new Date());
        setError(null);
        return true;
      } catch (err) {
        const message = err.message || "Gagal menghapus project";
        setError(message);
        throw new Error(message);
      } finally {
        setMutating(false);
      }
    },
    [setProjects]
  );

  return {
    projects,
    loading,
    mutating,
    error,
    lastSyncedAt,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}

function StatCard({ label, value, hint }) {
  return (
    <article className="card" style={{ padding: "1.5rem" }}>
      <span className="muted" style={{ fontSize: "0.85rem" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.45rem" }}>
        <strong style={{ fontSize: "2.2rem" }}>{value}</strong>
        {hint && (
          <span className="badge" style={{ background: "rgba(34,197,94,0.15)", color: "var(--success)" }}>
            {hint}
          </span>
        )}
      </div>
    </article>
  );
}

function SkillMeter({ label, value }) {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div style={{ position: "relative", height: "10px", borderRadius: "999px", background: "rgba(148, 163, 184, 0.2)" }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            width: `${value}%`,
            borderRadius: "999px",
            background: "linear-gradient(120deg, var(--primary), var(--accent))",
          }}
        />
      </div>
    </div>
  );
}

function ProjectForm({ onSave, onCancel, initialData, isEditing, disabled }) {
  const [form, setForm] = useState(() =>
    initialData || {
      title: "",
      summary: "",
      description: "",
      technologies: "",
      liveUrl: "",
      repoUrl: "",
      category: "Poster Event",
      status: "concept",
    }
  );

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        technologies: initialData.technologies.join(", "),
      });
    }
  }, [initialData]);

  const resetForm = () => {
    setForm({
      title: "",
      summary: "",
      description: "",
      technologies: "",
      liveUrl: "",
      repoUrl: "",
      category: "Poster Event",
      status: "concept",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (disabled) return;
    if (!form.title.trim()) return alert("Judul project wajib diisi");
    if (!form.summary.trim()) return alert("Ringkasan project wajib diisi");

    onSave({
      ...initialData,
      ...form,
      technologies: form.technologies
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    if (!isEditing) {
      resetForm();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "1.2rem" }}>{isEditing ? "Edit Project" : "Tambah Project Baru"}</h3>
      <div className="form-grid">
        <div>
          <label className="muted" htmlFor="title">
            Judul Project
          </label>
          <input
            id="title"
            name="title"
            className="input"
            placeholder="Contoh: Poster Launching Brand"
            value={form.title}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="muted" htmlFor="category">
            Kategori
          </label>
          <select id="category" name="category" value={form.category} onChange={handleChange} disabled={disabled}>
            <option>Poster Event</option>
            <option>Poster Promosi</option>
            <option>Poster Komunitas</option>
            <option>Poster Edukasi</option>
            <option>Poster Eksperimen</option>
          </select>
        </div>
        <div>
          <label className="muted" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" value={form.status} onChange={handleChange} disabled={disabled}>
            <option value="live">Live</option>
            <option value="concept">Concept</option>
            <option value="prototype">Prototype</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <label className="muted" htmlFor="summary">
          Ringkasan Singkat
        </label>
        <input
          id="summary"
          name="summary"
          className="input"
          placeholder="Highlight utama poster"
          value={form.summary}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <label className="muted" htmlFor="description">
          Deskripsi Detail
        </label>
        <textarea
          id="description"
          name="description"
          className="textarea"
          placeholder="Ceritakan konsep visual, pesan utama, dan proses kreatif poster"
          value={form.description}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <label className="muted" htmlFor="technologies">
          Teknologi / Skill (pisahkan dengan koma)
        </label>
        <input
          id="technologies"
          name="technologies"
          className="input"
          placeholder="Photoshop, Typography, Grain Texture"
          value={form.technologies}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div className="form-grid" style={{ marginTop: "1.2rem" }}>
        <div>
          <label className="muted" htmlFor="liveUrl">
            Link Live
          </label>
          <input
            id="liveUrl"
            name="liveUrl"
            className="input"
            placeholder="https://"
            value={form.liveUrl}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="muted" htmlFor="repoUrl">
            Link Repo / Dokumentasi
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            className="input"
            placeholder="https://github.com/..."
            value={form.repoUrl}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: "1.8rem" }}>
        {isEditing && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Batal
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {isEditing ? "Simpan Perubahan" : "Tambah Project"}
        </button>
      </div>
    </form>
  );
}

function LoginCard({ onLogin, loading, error }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [localError, setLocalError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      setLocalError("Isi username dan password admin.");
      return;
    }

    const result = await onLogin({ username, password });
    if (!result.success) {
      setLocalError(result.message || "Login gagal");
      return;
    }

    setLocalError(null);
    setForm({ username: "", password: "" });
  };

  const message = localError || error;

  return (
    <form className="card login-card" onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: "1rem" }}>Masuk Admin</h3>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Login diperlukan untuk menambah, mengubah, atau menghapus project portofolio.
      </p>
      <label className="muted" htmlFor="login-username">
        Username
      </label>
      <input
        id="login-username"
        name="username"
        className="input"
        placeholder="Username admin"
        value={form.username}
        onChange={handleChange}
        disabled={loading}
        autoComplete="username"
      />
      <label className="muted" htmlFor="login-password" style={{ marginTop: "1rem" }}>
        Password
      </label>
      <input
        id="login-password"
        name="password"
        type="password"
        className="input"
        placeholder="Password admin"
        value={form.password}
        onChange={handleChange}
        disabled={loading}
        autoComplete="current-password"
      />
      {message && (
        <div className="alert" role="alert">
          {message}
        </div>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: "1.5rem" }}>
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}

function ProjectCard({ project, onEdit, onDelete, canManage, isBusy }) {
  const badgeClass = `status-badge ${
    project.status === "live"
      ? "success"
      : project.status === "concept"
      ? "info"
      : project.status === "prototype"
      ? "pending"
      : ""
  }`;

  return (
    <article className="card project-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "flex-start" }}>
        <div>
          <div className="badge" style={{ marginBottom: "0.75rem" }}>
            {project.category}
          </div>
          <h3>{project.title}</h3>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            {project.summary}
          </p>
        </div>
        <span className={badgeClass}>{project.status}</span>
      </div>

      <p>{project.description}</p>

      <div className="links">
        {project.liveUrl && (
          <a className="link" href={project.liveUrl} target="_blank" rel="noreferrer">
            Live Preview ↗
          </a>
        )}
        {project.repoUrl && (
          <a className="link" href={project.repoUrl} target="_blank" rel="noreferrer">
            Source / Docs ↗
          </a>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {project.technologies.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>

      {canManage && (
        <div className="project-actions">
          <button className="btn btn-outline" onClick={() => onEdit(project)} disabled={isBusy}>
            Edit
          </button>
          <button
            className="btn"
            style={{ background: "rgba(239, 68, 68, 0.2)", color: "var(--danger)" }}
            disabled={isBusy}
            onClick={() => {
              const confirmDelete = window.confirm(`Hapus project "${project.title}"?`);
              if (confirmDelete) onDelete(project.id);
            }}
          >
            Hapus
          </button>
        </div>
      )}
    </article>
  );
}

function ProjectsSection({ auth, store }) {
  const { projects, loading, mutating, error, lastSyncedAt, fetchProjects, createProject, updateProject, deleteProject } = store;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.summary.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(search.toLowerCase()))
      )
      .filter((project) => (statusFilter === "all" ? true : project.status === statusFilter))
      .filter((project) => (categoryFilter === "all" ? true : project.category === categoryFilter))
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        return a.title.localeCompare(b.title);
      });
  }, [projects, search, statusFilter, categoryFilter, sortBy]);

  const stats = useMemo(() => {
    const total = projects.length;
    const live = projects.filter((project) => project.status === "live").length;
    const concept = projects.filter((project) => project.status === "concept").length;
    const prototype = projects.filter((project) => project.status === "prototype").length;
    return {
      total,
      live,
      concept,
      prototype,
    };
  }, [projects]);

  const handleSaveProject = async (data) => {
    const basePayload = {
      ...data,
      createdAt: editingProject?.createdAt || new Date().toISOString().slice(0, 10),
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, basePayload);
        setEditingProject(null);
      } else {
        await createProject({ ...basePayload, createdAt: new Date().toISOString().slice(0, 10) });
      }
    } catch (err) {
      alert(err.message || "Gagal menyimpan project");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      if (editingProject && editingProject.id === id) {
        setEditingProject(null);
      }
    } catch (err) {
      alert(err.message || "Gagal menghapus project");
    }
  };

  useEffect(() => {
    if (auth.authenticated) {
      fetchProjects();
    }
  }, [auth.authenticated, fetchProjects]);

  return (
    <section id="projects" style={{ marginTop: "4rem" }}>
      <header className="projects-header">
        <div>
          <h2 className="section-title">Katalog Poster Konsep</h2>
          <p className="section-desc">
            Dokumentasikan eksplorasi poster kamu. Tambah konsep baru, arsipkan hasil client, dan pantau mana yang sudah live maupun masih konsep.
          </p>
        </div>
        <div className="search-bar">
          <input
            className="input"
            placeholder="Cari judul, ringkasan, atau skill..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Semua Status</option>
            <option value="live">Live</option>
            <option value="concept">Concept</option>
            <option value="prototype">Prototype</option>
            <option value="draft">Draft</option>
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">Semua Kategori</option>
            <option value="Poster Event">Poster Event</option>
            <option value="Poster Promosi">Poster Promosi</option>
            <option value="Poster Komunitas">Poster Komunitas</option>
            <option value="Poster Edukasi">Poster Edukasi</option>
            <option value="Poster Eksperimen">Poster Eksperimen</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title">Judul A-Z</option>
          </select>
        </div>
      </header>

      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <StatCard label="Total Project" value={stats.total} />
        <StatCard label="Project Live" value={stats.live} hint="aktif" />
        <StatCard label="Concept" value={stats.concept} hint="perlu validasi" />
        <StatCard label="Prototype" value={stats.prototype} hint="eksperimen" />
      </div>

      <div className="admin-area">
        {auth.loading ? (
          <article className="card muted">Memeriksa status admin...</article>
        ) : auth.authenticated ? (
          <article className="card admin-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <strong>Admin aktif</strong>
              <span className="muted">Anda dapat mengelola project portofolio secara langsung.</span>
              {lastSyncedAt && (
                <span className="badge" style={{ alignSelf: "flex-start" }}>
                  Sinkron {lastSyncedAt.toLocaleString("id-ID")}
                </span>
              )}
            </div>
            <button className="btn btn-outline" onClick={auth.logout} disabled={mutating}>
              Keluar
            </button>
          </article>
        ) : (
          <LoginCard
            onLogin={async (values) => {
              const result = await auth.login(values);
              if (result.success) {
                await fetchProjects();
              }
              return result;
            }}
            loading={auth.loading}
            error={auth.error}
          />
        )}
      </div>

      {auth.authenticated && (
        editingProject ? (
          <ProjectForm
            key={editingProject.id}
            onSave={handleSaveProject}
            onCancel={() => setEditingProject(null)}
            initialData={editingProject}
            isEditing
            disabled={mutating}
          />
        ) : (
          <ProjectForm onSave={handleSaveProject} isEditing={false} disabled={mutating} />
        )
      )}

      {error && (
        <div className="alert" role="alert" style={{ marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {loading && (
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          Memuat data project dari server...
        </p>
      )}

      <div className="grid" style={{ gap: "1.6rem" }}>
        {filteredProjects.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <h3>Belum ada project</h3>
            <p className="muted" style={{ marginTop: "0.6rem" }}>
              Tambahkan project baru melalui form di atas untuk mulai mengisi portfolio kamu.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditingProject}
              onDelete={handleDeleteProject}
              canManage={auth.authenticated}
              isBusy={mutating}
            />
          ))
        )}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section style={{ marginTop: "5rem" }}>
      <h2 className="section-title">Journey & Impact</h2>
      <p className="section-desc">
        Perjalanan singkat sebagai poster designer yang terus mengasah skill visual sekaligus membangun kepercayaan client.
      </p>
      <div className="timeline">
        {timelineItems.map((item) => (
          <article key={item.year} className="timeline-item">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{item.year}</strong>
              <span className={`status-badge ${item.status === "live" ? "success" : "pending"}`}>
                {item.status}
              </span>
            </div>
            <h3 style={{ fontSize: "1.1rem" }}>{item.title}</h3>
            <p className="muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesShowcase() {
  const [activeId, setActiveId] = useState(servicePackages[0]?.id ?? null);

  const activePackage = useMemo(() => {
    return servicePackages.find((item) => item.id === activeId) ?? servicePackages[0];
  }, [activeId]);

  return (
    <section style={{ marginTop: "4rem" }}>
      <span
        className="badge"
        style={{
          background: "rgba(14, 165, 233, 0.18)",
          color: "rgba(224, 242, 254, 0.9)",
          marginBottom: "1.25rem",
        }}
      >
        Poster Design Specialist
      </span>
      <h2 className="section-title">Layanan Poster Interaktif</h2>
      <p className="section-desc">
        Fokus 100% pada poster design sehingga setiap campaign mendapatkan visual yang konsisten, mudah dibaca, dan siap
        publish di semua kanal.
      </p>
      <div className="services-layout">
        <div className="services-switcher">
          {servicePackages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`service-chip${item.id === activePackage.id ? " active" : ""}`}
              onClick={() => setActiveId(item.id)}
              aria-pressed={item.id === activePackage.id}
            >
              <strong>{item.name}</strong>
              <span>{item.duration}</span>
            </button>
          ))}
        </div>
        <article className="card service-detail">
          <p className="muted" style={{ marginBottom: "0.75rem" }}>
            {activePackage.tagline}
          </p>
          <div className="service-meta">
            <span className="service-meta-item">
              Estimasi pengerjaan: <strong>{activePackage.duration}</strong>
            </span>
            <span className="service-meta-item">
              Ideal untuk: <strong>{activePackage.bestFor}</strong>
            </span>
          </div>
          <ul className="service-features">
            {activePackage.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: "1.2rem" }}>
            Semua paket sudah termasuk file sumber edit-ready dan panduan warna sehingga mudah dipakai ulang oleh tim kamu.
          </p>
        </article>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section style={{ marginTop: "3.5rem" }}>
      <h2 className="section-title">Workflow Kolaborasi</h2>
      <p className="section-desc">
        Proses singkat via WhatsApp agar kamu dapat melihat progres setiap hari tanpa harus membuka banyak tools.
      </p>
      <div className="workflow-grid">
        {workflowSteps.map((step, index) => (
          <article key={step.title} className="card workflow-card">
            <div className="workflow-step-number">{String(index + 1).padStart(2, "0")}</div>
            <h3>{step.title}</h3>
            <p className="muted">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PosterPricing() {
  const [size, setSize] = useState(posterSizeOptions[0].id);
  const [urgency, setUrgency] = useState(posterUrgencyOptions[0].id);
  const [addOns, setAddOns] = useState([]);

  const sizeOption = useMemo(
    () => posterSizeOptions.find((option) => option.id === size) ?? posterSizeOptions[0],
    [size],
  );

  const urgencyOption = useMemo(
    () => posterUrgencyOptions.find((option) => option.id === urgency) ?? posterUrgencyOptions[0],
    [urgency],
  );

  const addOnTotal = useMemo(
    () =>
      addOns.reduce((acc, id) => {
        const addOn = posterAddOns.find((item) => item.id === id);
        return acc + (addOn ? addOn.price : 0);
      }, 0),
    [addOns],
  );

  const addOnLabels = useMemo(
    () =>
      addOns
        .map((id) => posterAddOns.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => item.label),
    [addOns],
  );

  const total = useMemo(() => {
    const sizeMultiplier = sizeOption?.multiplier ?? 1;
    const urgencyMultiplier = urgencyOption?.multiplier ?? 1;
    return BASE_POSTER_RATE * sizeMultiplier * urgencyMultiplier + addOnTotal;
  }, [sizeOption, urgencyOption, addOnTotal]);

  const whatsappLink = useMemo(() => {
    const summary = `Halo Dikalfe! Saya mau pesan poster (${sizeOption.label}) dengan timeline ${urgencyOption.label}. Add-on: ${
      addOnLabels.length > 0 ? addOnLabels.join(", ") : "tanpa add-on"
    }. Estimasi harga ${formatCurrency(total)}. Boleh dibantu?`;
    return `https://wa.me/6285163207556?text=${encodeURIComponent(summary)}`;
  }, [sizeOption, urgencyOption, addOnLabels, total]);

  const toggleAddOn = (id) => {
    setAddOns((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <section style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Rate Poster & Kalkulator</h2>
      <p className="section-desc">
        Base rate poster mulai dari {formatCurrency(BASE_POSTER_RATE)}. Gunakan kalkulator ini untuk memetakan kebutuhan kamu
        sebelum menghubungi saya.
      </p>
      <div className="pricing-grid">
        <div className="card pricing-card">
          <div className="option-group">
            <p className="muted option-label">Format Poster</p>
            <div className="option-row">
              {posterSizeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`option${option.id === sizeOption.id ? " active" : ""}`}
                  onClick={() => setSize(option.id)}
                  aria-pressed={option.id === sizeOption.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <p className="muted option-label">Timeline</p>
            <div className="option-row">
              {posterUrgencyOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`option${option.id === urgencyOption.id ? " active" : ""}`}
                  onClick={() => setUrgency(option.id)}
                  aria-pressed={option.id === urgencyOption.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <p className="muted option-label">Add-on Opsional</p>
            <div className="option-row option-row-wrap">
              {posterAddOns.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`option${addOns.includes(option.id) ? " active" : ""}`}
                  onClick={() => toggleAddOn(option.id)}
                  aria-pressed={addOns.includes(option.id)}
                >
                  {option.label}
                  <span className="option-price">{formatCurrency(option.price)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="card pricing-summary">
          <div className="rate-output">
            <span>Estimasi biaya</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
          <ul className="pricing-bullets">
            <li>Format: {sizeOption.label}</li>
            <li>Timeline: {urgencyOption.label}</li>
            <li>Add-on: {addOnLabels.length > 0 ? addOnLabels.join(", ") : "Tidak ada"}</li>
          </ul>
          <a className="btn btn-primary" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            Konsultasi via WhatsApp
          </a>
          <p className="muted" style={{ marginTop: "1rem" }}>
            WhatsApp: <strong>0851 6320 7556</strong> (balasan cepat di jam kerja)
          </p>
        </aside>
      </div>
    </section>
  );
}

function PosterBriefBuilder() {
  const [platform, setPlatform] = useState("Instagram Feed");
  const [goal, setGoal] = useState("Awareness brand baru");
  const [tone, setTone] = useState("Energetic & bold");
  const [color, setColor] = useState("Neon sunrise");
  const [cta, setCta] = useState("Pesan sekarang");
  const [notes, setNotes] = useState("Highlight keunikan produk dan sertakan QR code RSVP.");
  const [copied, setCopied] = useState(false);

  const brief = useMemo(() => {
    return (
      `Platform: ${platform}\n` +
      `Tujuan: ${goal}\n` +
      `Tone visual: ${tone} dengan palet ${color}.\n` +
      `Call-to-action utama: ${cta}.\n` +
      `Catatan penting: ${notes || "(akan diisi saat diskusi)"}`
    );
  }, [platform, goal, tone, color, cta, notes]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <section style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Poster Brief Builder</h2>
      <p className="section-desc">
        Belum punya portfolio banyak? Tenang. Gunakan builder ini untuk merangkum kebutuhan poster kamu supaya diskusi awal
        lebih terarah.
      </p>
      <div className="brief-grid">
        <div className="card brief-panel">
          <label className="field">
            <span>Platform utama</span>
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              <option>Instagram Feed</option>
              <option>Instagram Story</option>
              <option>Poster Cetak A2</option>
              <option>Backdrop LED Event</option>
            </select>
          </label>

          <label className="field">
            <span>Tujuan poster</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value)}>
              <option>Awareness brand baru</option>
              <option>Promo diskon terbatas</option>
              <option>Pengumuman acara komunitas</option>
              <option>Recruitment relawan</option>
            </select>
          </label>

          <label className="field">
            <span>Tone visual</span>
            <select value={tone} onChange={(event) => setTone(event.target.value)}>
              <option>Energetic & bold</option>
              <option>Minimal clean</option>
              <option>Retro playful</option>
              <option>Elegant modern</option>
            </select>
          </label>

          <label className="field">
            <span>Eksplorasi warna</span>
            <select value={color} onChange={(event) => setColor(event.target.value)}>
              <option>Neon sunrise</option>
              <option>Mono biru</option>
              <option>Sunset gradient</option>
              <option>Pastel cream</option>
            </select>
          </label>

          <label className="field">
            <span>Call-to-action</span>
            <input className="input" value={cta} onChange={(event) => setCta(event.target.value)} />
          </label>

          <label className="field">
            <span>Catatan penting</span>
            <textarea
              className="textarea"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </div>
        <div className="card brief-preview">
          <div className="brief-preview-header">
            <h3>Preview brief kamu</h3>
            <button type="button" className="btn btn-outline" onClick={handleCopy}>
              {copied ? "Tersalin!" : "Copy brief"}
            </button>
          </div>
          <pre>{brief}</pre>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Tinggal paste di WhatsApp saat menghubungi saya. Informasi ini membantu saya bergerak cepat menyiapkan moodboard
            pertama.
          </p>
        </div>
      </div>
    </section>
  );
}

function InspirationBoard() {
  const [filter, setFilter] = useState("all");

  const filteredPresets = useMemo(() => {
    if (filter === "all") {
      return inspirationPresets;
    }

    return inspirationPresets.filter((preset) => preset.vibe.includes(filter));
  }, [filter]);

  return (
    <section style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Moodboard & Inspo Cepat</h2>
      <p className="section-desc">
        Pilih suasana yang sesuai dengan brand kamu untuk melihat kombinasi warna, tipografi, dan tekstur rekomendasi poster.
      </p>
      <div className="filter-row">
        {inspirationFilters.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`filter-chip${option.id === filter ? " active" : ""}`}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="inspiration-grid">
        {filteredPresets.map((preset) => (
          <article key={preset.id} className="card inspiration-card">
            <div className="palette">
              {preset.palette.map((color) => (
                <span key={color} className="palette-swatch" style={{ background: color }} aria-label={color} />
              ))}
            </div>
            <h3>{preset.label}</h3>
            <p className="muted">Tipografi: {preset.typography}</p>
            <p className="muted">Tekstur: {preset.texture}</p>
            <div className="inspiration-tags">
              {preset.vibe.map((tag) => (
                <span key={tag} className="badge" style={{ background: "rgba(148, 163, 184, 0.15)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const whatsappLink = useMemo(() => {
    const message = "Halo Dikalfe! Saya ingin diskusi mengenai kebutuhan poster saya.";
    return `https://wa.me/6285163207556?text=${encodeURIComponent(message)}`;
  }, []);

  return (
    <section style={{ marginTop: "4.5rem" }} id="contact">
      <div className="card contact-card">
        <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>
          Siap bantu poster kamu
        </h2>
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          Saya hanya melayani poster design agar fokus menghadirkan detail terbaik. Rate utama mulai dari {formatCurrency(BASE_POSTER_RATE)}
          untuk satu konsep poster lengkap dengan file siap cetak dan versi digital.
        </p>
        <ul className="contact-list">
          <li>
            <span>WhatsApp</span>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              0851 6320 7556
            </a>
          </li>
          <li>
            <span>Email</span>
            <a href="mailto:hello@posterbydikalfe.id">hello@posterbydikalfe.id</a>
          </li>
          <li>
            <span>Jam Operasional</span>
            <span>Senin - Sabtu, 09.00 - 18.00 WIB</span>
          </li>
        </ul>
        <p className="muted" style={{ marginTop: "1.2rem" }}>
          Ceritakan campaign kamu lewat WhatsApp, saya akan bantu susun moodboard awal dalam 24 jam.
        </p>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Skill Matrix</h2>
      <p className="section-desc">
        Fondasi skill yang menopang pengerjaan poster berkualitas: dari komposisi layout, pemilihan tipografi, hingga color grading yang relevan dengan brand.
      </p>
      <div className="grid grid-3">
        {skills.map((skill) => (
          <SkillMeter key={skill.label} {...skill} />
        ))}
      </div>
    </section>
  );
}

function Hero() {
  const handleScrollToProjects = () => {
    const target = document.querySelector("#projects");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="header">
      <div>
        <p className="badge" style={{ marginBottom: "1.5rem", background: "rgba(248, 113, 113, 0.2)" }}>
          Poster Designer | Fokus hanya poster design
        </p>
        <h1 className="hero-title">Poster design yang bikin campaign kamu standout.</h1>
        <p className="hero-subtitle">
          Halo, saya Dikalfe. Graphic designer baru yang serius mengerjakan poster promosi, event, dan komunitas. Walaupun portofolio saya masih berkembang, saya pastikan tiap client mendapat proses kolaborasi rapi, moodboard cepat, dan hasil siap cetak.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={handleScrollToProjects}>
            Lihat Project Konsep
          </button>
          <a
            className="btn btn-outline"
            href="https://wa.me/6285163207556?text=Halo%20Dikalfe!%20Saya%20ingin%20diskusi%20tentang%20poster%20design."
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp 0851 6320 7556
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" alt="Team collaboration" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      Dibangun dengan React tanpa build step sehingga kompatibel dengan hosting statis seperti InfinityFree. Data project tersimpan aman di database MySQL melalui API PHP.
    </footer>
  );
}

function App() {
  const auth = useAuth();
  const projectStore = useProjectApi();

  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const searchInput = document.querySelector(".projects-header .input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <main>
      <Hero />
      <ServicesShowcase />
      <PosterPricing />
      <WorkflowSection />
      <PosterBriefBuilder />
      <InspirationBoard />
      <SkillsSection />
      <ProjectsSection auth={auth} store={projectStore} />
      <Timeline />
      <ContactSection />
      <Footer />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
