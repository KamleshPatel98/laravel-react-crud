import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Run fetch once after mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Create or Update blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      alert("Please fill in all fields");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/blogs/${editId}` : "/api/blogs";

    try {
      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ title: "", content: "" });
      setEditId(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  // ✏️ Edit existing blog
  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content });
    setEditId(blog.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ Delete blog
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        fetchBlogs();
      } catch (err) {
        console.error("Error deleting blog:", err);
      }
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4" style={{ width: "240px" }}>
        <h4 className="fw-bold text-center mb-4">My Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              <i className="bi bi-house"></i> Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#" className="nav-link text-white">
              <i className="bi bi-journal-text"></i> Blogs
            </a>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-4 bg-light overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Blog Management</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              setForm({ title: "", content: "" });
              setEditId(null);
            }}
          >
            + New Blog
          </button>
        </div>

        {/* Blog Form */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editId ? "Edit Blog" : "Create Blog"}
            </h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Content</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success">
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Blog Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">All Blogs</h5>

            {loading ? (
              <p className="text-center py-3">Loading...</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3">
                          No blogs found.
                        </td>
                      </tr>
                    ) : (
                      blogs.map((blog, i) => (
                        <tr key={blog.id}>
                          <td>{i + 1}</td>
                          <td>{blog.title}</td>
                          <td>{blog.content}</td>
                          <td>
                            <button
                              onClick={() => handleEdit(blog)}
                              className="btn btn-sm btn-warning me-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("app")).render(<App />);