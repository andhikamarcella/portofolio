const { useState, useMemo, useEffect } = React;

const API_BASE = "./api";

const STORAGE_KEY = "react-portfolio-projects";

const defaultProjects = [
  {
    id: "launchpad",
    title: "Product Launchpad",
    category: "Product",
    status: "live",
    summary: "Landing page with analytics and waitlist automation.",
    description:
      "High converting landing page crafted for SaaS launch. Includes hero storytelling, pricing tiers, testimonials, and a realtime waitlist counter integrated through APIs.",
    technologies: ["React", "Tailwind", "Framer Motion"],
    liveUrl: "https://example.com/launchpad",
    repoUrl: "https://github.com/username/launchpad",
    createdAt: "2024-06-12",
  },
  {
    id: "dashboard",
    title: "Creator Revenue Dashboard",
    category: "Dashboard",
    status: "prototype",
    summary: "Visual dashboard for tracking creator income streams.",
    description:
      "Interactive dashboard with modular widgets, KPI cards, and advanced filtering. Built to help independent creators track sponsorship, ads, and product income in realtime.",
    technologies: ["React", "D3.js", "Supabase"],
    liveUrl: "https://example.com/revenue-dashboard",
    repoUrl: "https://github.com/username/revenue-dashboard",
    createdAt: "2024-04-20",
  },
  {
    id: "uxlab",
    title: "UX Research Lab",
    category: "Case Study",
    status: "live",
    summary: "Portfolio case study with immersive storytelling and micro-interactions.",
    description:
      "Case study that highlights user research methods, persona development, and interaction design. Includes scroll-based animations, persona cards, and interactive journey maps.",
    technologies: ["React", "GSAP", "Notion API"],
    liveUrl: "https://example.com/ux-lab",
    repoUrl: "https://github.com/username/ux-lab",
    createdAt: "2023-11-05",
  },
];

const timelineItems = [
  {
    year: "2025",
    title: "Product Design Lead",
    description:
      "Leading cross-functional squad delivering fintech experience serving 1M+ users with focus on accessibility and performance.",
    status: "live",
  },
  {
    year: "2024",
    title: "Senior Frontend Engineer",
    description:
      "Scaled design system used across 6 micro-frontends and mentored engineers in React patterns & DX automation.",
    status: "live",
  },
  {
    year: "2023",
    title: "UX Engineer",
    description:
      "Bridged design and engineering to ship multi-platform experience with 35% faster iteration cycle.",
    status: "prototype",
  },
];

const skills = [
  { label: "Product Strategy", value: 93 },
  { label: "Design Systems", value: 88 },
  { label: "Frontend Engineering", value: 91 },
  { label: "Motion & Interaction", value: 84 },
];

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
      category: "Case Study",
      status: "prototype",
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
      category: "Case Study",
      status: "prototype",
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
            placeholder="Contoh: Immersive Case Study"
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
            <option>Case Study</option>
            <option>Dashboard</option>
            <option>Product</option>
            <option>Mobile</option>
            <option>Experimental</option>
          </select>
        </div>
        <div>
          <label className="muted" htmlFor="status">
            Status
          </label>
          <select id="status" name="status" value={form.status} onChange={handleChange} disabled={disabled}>
            <option value="live">Live</option>
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
          placeholder="Highlight utama project"
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
          placeholder="Ceritakan tantangan, proses, dan dampak project"
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
          placeholder="React, Motion, Analytics"
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
  const badgeClass = `status-badge ${project.status === "live" ? "success" : project.status === "prototype" ? "pending" : ""}`;

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
    const prototype = projects.filter((project) => project.status === "prototype").length;
    return {
      total,
      live,
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
          <h2 className="section-title">Project Interaktif</h2>
          <p className="section-desc">
            Kelola project portfolio secara langsung. Tambah ide baru, dokumentasikan eksperimen, dan update status hanya dengan beberapa klik.
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
            <option value="prototype">Prototype</option>
            <option value="draft">Draft</option>
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">Semua Kategori</option>
            <option value="Case Study">Case Study</option>
            <option value="Dashboard">Dashboard</option>
            <option value="Product">Product</option>
            <option value="Mobile">Mobile</option>
            <option value="Experimental">Experimental</option>
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
        <StatCard label="Prototype" value={stats.prototype} />
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
        Snapshot perjalanan karier dan peran strategis yang memberikan dampak terbesar terhadap tim dan produk.
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

function SkillsSection() {
  return (
    <section style={{ marginTop: "4rem" }}>
      <h2 className="section-title">Skill Matrix</h2>
      <p className="section-desc">
        Perpaduan kemampuan strategis, visual, dan engineering untuk menghadirkan pengalaman digital yang premium.
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
        <p className="badge" style={{ marginBottom: "1.5rem", background: "rgba(99, 102, 241, 0.2)" }}>
          Product Designer & Frontend Engineer
        </p>
        <h1 className="hero-title">Bangun pengalaman digital yang memorable.</h1>
        <p className="hero-subtitle">
          Saya membantu brand dan startup menghadirkan produk yang indah, interaktif, dan berdampak bisnis melalui perpaduan strategi, desain, dan teknologi.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={handleScrollToProjects}>
            Lihat Project Unggulan
          </button>
          <a className="btn btn-outline" href="mailto:hello@portfolio.dev">
            Hubungi Saya
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
      <SkillsSection />
      <ProjectsSection auth={auth} store={projectStore} />
      <Timeline />
      <Footer />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
