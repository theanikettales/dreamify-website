import { useState, useRef, useEffect, useCallback } from "react";

/* ─── FONTS & GLOBAL STYLES ─────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      background: #0e0c0a;
      color: #faf8f5;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #1a1714; }
    ::-webkit-scrollbar-thumb { background: #c9a96e55; border-radius: 2px; }

    .serif { font-family: 'Cormorant Garamond', serif; }

    /* Animations */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes slideIn  { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
    @keyframes scaleIn  { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
    @keyframes shimmer  { 0%,100%{opacity:.4} 50%{opacity:.9} }
    @keyframes spin     { to { transform: rotate(360deg); } }
    @keyframes toastIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)} }
    @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(201,169,110,.4)} 50%{box-shadow:0 0 0 8px rgba(201,169,110,0)} }

    .fade-up   { animation: fadeUp  .6s ease both; }
    .fade-up-1 { animation: fadeUp  .6s ease .05s both; }
    .fade-up-2 { animation: fadeUp  .6s ease .1s  both; }
    .fade-up-3 { animation: fadeUp  .6s ease .15s both; }
    .fade-up-4 { animation: fadeUp  .6s ease .2s  both; }
    .fade-up-5 { animation: fadeUp  .6s ease .25s both; }
    .fade-up-6 { animation: fadeUp  .6s ease .3s  both; }
    .slide-in  { animation: slideIn .5s ease both; }

    /* Sidebar */
    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 20px; border-radius: 6px;
      font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
      color: #6b6460; transition: all .2s; cursor: pointer;
      border: none; background: none; width: 100%; text-align: left;
    }
    .sidebar-link:hover { background: rgba(201,169,110,.08); color: #c9a96e; }
    .sidebar-link.active { background: rgba(201,169,110,.12); color: #c9a96e; }
    .sidebar-link .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor; flex-shrink: 0;
    }

    /* Table */
    .prod-row {
      display: grid;
      grid-template-columns: 64px 1fr 100px 90px 90px 80px 120px;
      gap: 16px; align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #2a2420;
      transition: background .15s;
    }
    .prod-row:hover { background: rgba(201,169,110,.03); }

    /* Input base */
    .inp {
      padding: 12px 16px;
      border: 1px solid #2e2a26;
      background: #17140f;
      font-family: 'Jost', sans-serif;
      font-size: .85rem;
      color: #faf8f5;
      width: 100%;
      border-radius: 4px;
      outline: none;
      transition: border-color .2s;
    }
    .inp:focus { border-color: #c9a96e; }
    .inp::placeholder { color: #4a4440; }
    .inp-label {
      display: block;
      font-size: .65rem; letter-spacing: .2em;
      text-transform: uppercase; color: #6b6460;
      margin-bottom: 8px;
    }
    select.inp {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b6460'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }

    /* Btn */
    .btn-gold {
      padding: 12px 28px; background: #c9a96e; color: #0e0c0a;
      border: none; border-radius: 4px;
      font-family: 'Jost', sans-serif; font-size: .72rem;
      letter-spacing: .18em; text-transform: uppercase; font-weight: 400;
      cursor: pointer; transition: all .2s; white-space: nowrap;
    }
    .btn-gold:hover { background: #e8d5b0; }
    .btn-ghost {
      padding: 12px 24px; background: transparent; color: #6b6460;
      border: 1px solid #2e2a26; border-radius: 4px;
      font-family: 'Jost', sans-serif; font-size: .72rem;
      letter-spacing: .15em; text-transform: uppercase;
      cursor: pointer; transition: all .2s; white-space: nowrap;
    }
    .btn-ghost:hover { border-color: #6b6460; color: #faf8f5; }
    .btn-danger {
      padding: 8px 16px; background: transparent; color: #e07070;
      border: 1px solid #3a2020; border-radius: 4px;
      font-family: 'Jost', sans-serif; font-size: .65rem;
      letter-spacing: .12em; text-transform: uppercase;
      cursor: pointer; transition: all .2s;
    }
    .btn-danger:hover { background: rgba(224,112,112,.1); border-color: #e07070; }
    .btn-edit {
      padding: 8px 16px; background: transparent; color: #6b6460;
      border: 1px solid #2e2a26; border-radius: 4px;
      font-family: 'Jost', sans-serif; font-size: .65rem;
      letter-spacing: .12em; text-transform: uppercase;
      cursor: pointer; transition: all .2s;
    }
    .btn-edit:hover { border-color: #c9a96e; color: #c9a96e; }

    /* Badge */
    .badge {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 20px;
      font-size: .58rem; letter-spacing: .15em; text-transform: uppercase;
    }
    .badge-new      { background: rgba(201,169,110,.15); color: #c9a96e; border: 1px solid rgba(201,169,110,.3); }
    .badge-best     { background: rgba(90,158,106,.15);  color: #5a9e6a; border: 1px solid rgba(90,158,106,.3); }
    .badge-none     { background: rgba(107,100,96,.1);   color: #6b6460; border: 1px solid rgba(107,100,96,.2); }
    .badge-active   { background: rgba(90,158,106,.12);  color: #5a9e6a; border: 1px solid rgba(90,158,106,.25); }
    .badge-hidden   { background: rgba(224,112,112,.1);  color: #e07070; border: 1px solid rgba(224,112,112,.2); }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(10,8,6,.8);
      backdrop-filter: blur(6px); z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn .2s ease;
    }
    .modal-box {
      background: #17140f; border: 1px solid #2e2a26;
      border-radius: 8px; width: 640px; max-width: 95vw;
      max-height: 92vh; overflow-y: auto;
      animation: scaleIn .3s ease;
    }

    /* Toast */
    .toast {
      position: fixed; bottom: 28px; right: 28px;
      padding: 14px 22px;
      background: #17140f; border: 1px solid #2e2a26;
      border-left: 3px solid #c9a96e;
      border-radius: 6px; z-index: 9999;
      font-size: .78rem; letter-spacing: .06em;
      color: #faf8f5; min-width: 220px;
    }
    .toast.show { animation: toastIn .3s ease forwards; }
    .toast.hide { animation: toastOut .3s ease forwards; }
    .toast.error { border-left-color: #e07070; }
    .toast.success { border-left-color: #5a9e6a; }

    /* Drag drop zone */
    .dropzone {
      border: 1.5px dashed #2e2a26; border-radius: 6px;
      padding: 28px; text-align: center;
      transition: all .2s; cursor: pointer;
    }
    .dropzone:hover, .dropzone.drag-over {
      border-color: #c9a96e; background: rgba(201,169,110,.04);
    }

    /* Stats card */
    .stat-card {
      background: #17140f; border: 1px solid #2e2a26;
      border-radius: 8px; padding: 24px 28px;
      transition: border-color .2s;
    }
    .stat-card:hover { border-color: #3a3430; }

    /* Search */
    .search-wrap { position: relative; }
    .search-wrap input { padding-left: 38px; }
    .search-icon {
      position: absolute; left: 12px; top: 50%;
      transform: translateY(-50%); color: #4a4440;
      font-size: .9rem; pointer-events: none;
    }

    /* Category pill */
    .cat-pill {
      padding: 6px 16px; border-radius: 20px;
      border: 1px solid #2e2a26; background: transparent;
      font-family: 'Jost',sans-serif; font-size: .65rem;
      letter-spacing: .15em; text-transform: uppercase;
      color: #6b6460; cursor: pointer; transition: all .2s;
    }
    .cat-pill:hover { border-color: #c9a96e44; color: #c9a96e; }
    .cat-pill.active { border-color: #c9a96e; color: #c9a96e; background: rgba(201,169,110,.08); }

    /* Checkbox */
    .check-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .check-box {
      width: 18px; height: 18px; border: 1px solid #2e2a26;
      border-radius: 3px; background: #17140f;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all .2s;
    }
    .check-box.checked { background: #c9a96e; border-color: #c9a96e; }

    /* Image preview tile */
    .img-tile {
      width: 60px; height: 76px; border-radius: 4px;
      background: #1e1b17; border: 1px solid #2e2a26;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.6rem; position: relative; overflow: hidden;
      flex-shrink: 0;
    }
    .img-tile img { width:100%; height:100%; object-fit:cover; }

    /* Confirm modal */
    .confirm-box {
      background: #17140f; border: 1px solid #2e2a26;
      border-radius: 8px; padding: 36px; width: 400px;
      max-width: 95vw; animation: scaleIn .25s ease;
      text-align: center;
    }

    /* Nav tab */
    .nav-tab {
      padding: 8px 20px; border-radius: 4px;
      font-size: .7rem; letter-spacing: .15em; text-transform: uppercase;
      color: #6b6460; cursor: pointer; background: none; border: none;
      transition: all .2s;
    }
    .nav-tab:hover { color: #c9a96e; }
    .nav-tab.active { background: rgba(201,169,110,.12); color: #c9a96e; }

    /* Switch toggle */
    .switch { position: relative; width: 40px; height: 22px; cursor: pointer; }
    .switch input { display: none; }
    .switch-track {
      position: absolute; inset: 0; border-radius: 11px;
      background: #2e2a26; transition: background .2s;
    }
    .switch input:checked + .switch-track { background: #c9a96e55; }
    .switch-thumb {
      position: absolute; top: 3px; left: 3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #6b6460; transition: all .2s;
    }
    .switch input:checked ~ .switch-thumb { left: 21px; background: #c9a96e; }

    /* Progress bar */
    .prog-bar { height: 3px; background: #2e2a26; border-radius: 2px; overflow: hidden; }
    .prog-fill { height: 100%; background: #c9a96e; border-radius: 2px; transition: width .4s; }
  `}</style>
);

/* ─── INITIAL DATA ───────────────────────────────────────────────────────── */
const INIT_PRODUCTS = [
  { id: 1, name: "Resin Ring", material: "Sterling Silver", price: 599, category: "rings", tag: "New", status: "active", stock: 12, emoji: "💍", img: null, desc: "Handcrafted resin ring with embedded botanicals, set in sterling silver." },
  { id: 2, name: "Floral Oxidised Earrings", material: "Bold Florals", price: 1099, category: "earrings", tag: "Bestseller", status: "active", stock: 8, emoji: "✨", img: null, desc: "Bold oxidised floral earrings, statement pieces for everyday wear." },
  { id: 3, name: "Teardrop Resin Pendant", material: "Silver Chain", price: 699, category: "necklaces", tag: null, status: "active", stock: 15, emoji: "⭐", img: null, desc: "Elegant teardrop resin pendant on a delicate silver chain." },
  { id: 4, name: "Rose Preservation Earrings", material: "Sterling Silver", price: 1299, category: "earrings", tag: "New", status: "active", stock: 5, emoji: "🌸", img: null, desc: "Real rose petals preserved in clear resin, encased in sterling silver." },
  { id: 5, name: "Resin Keychain", material: "Hammered Brass", price: 320, category: "bracelets", tag: null, status: "active", stock: 20, emoji: "🟡", img: null, desc: "Charming resin keychain in hammered brass, perfect gift." },
  { id: 6, name: "Celeste Ring", material: "Rose Gold-filled", price: 499, category: "rings", tag: "Bestseller", status: "active", stock: 9, emoji: "🌙", img: null, desc: "Celestial-inspired ring in rose gold-filled wire with moonstone." },
];

const CATEGORIES = ["rings", "necklaces", "earrings", "bracelets", "other"];
const TAGS = ["New", "Bestseller", "Sale", "Limited", null];
const STATUSES = ["active", "hidden", "draft"];

/* ─── TOAST ─────────────────────────────────────────────────────────────── */
function useToast() {
  const [state, setState] = useState({ msg: "", type: "success", visible: false });
  const timer = useRef(null);
  const show = useCallback((msg, type = "success") => {
    clearTimeout(timer.current);
    setState({ msg, type, visible: true });
    timer.current = setTimeout(() => setState(s => ({ ...s, visible: false })), 3000);
  }, []);
  return { toast: state, showToast: show };
}

/* ─── IMAGE UPLOADER ─────────────────────────────────────────────────────── */
function ImageUploader({ value, onChange }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`dropzone${drag ? " drag-over" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
      {value ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <img src={value} alt="preview" style={{ width: 100, height: 130, objectFit: "cover", borderRadius: 4, border: "1px solid #2e2a26" }} />
          <button onClick={e => { e.stopPropagation(); onChange(null); }}
            style={{ background: "none", border: "none", color: "#e07070", fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer" }}>
            Remove Image
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "2rem", marginBottom: 10, opacity: .4 }}>◈</div>
          <p style={{ fontSize: ".75rem", color: "#6b6460", lineHeight: 1.7 }}>Drop image here or click to upload</p>
          <p style={{ fontSize: ".62rem", color: "#3a3430", marginTop: 6 }}>PNG, JPG, WEBP · max 5MB</p>
        </>
      )}
    </div>
  );
}

/* ─── PRODUCT FORM MODAL ─────────────────────────────────────────────────── */
function ProductModal({ mode, product, onSave, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(product || {
    name: "", material: "", price: "", category: "rings", tag: null,
    status: "active", stock: "", emoji: "✦", img: null, desc: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.material.trim()) e.material = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock), id: isEdit ? form.id : Date.now() });
  };

  const inputGroup = (label, key, type = "text", ph = "") => (
    <div>
      <label className="inp-label">{label}</label>
      <input className="inp" type={type} placeholder={ph}
        value={form[key] ?? ""} onChange={e => set(key, e.target.value)}
        style={errors[key] ? { borderColor: "#e07070" } : {}} />
      {errors[key] && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 32px 20px", borderBottom: "1px solid #2a2420" }}>
          <div>
            <p style={{ fontSize: ".62rem", letterSpacing: ".3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 6 }}>
              {isEdit ? "Edit Product" : "New Product"}
            </p>
            <h2 className="serif" style={{ fontSize: "1.6rem", fontWeight: 300 }}>
              {isEdit ? form.name : "Add to Collection"}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b6460", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Image + emoji row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label className="inp-label">Product Image</label>
              <ImageUploader value={form.img} onChange={v => set("img", v)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="inp-label">Emoji Fallback</label>
                <input className="inp" value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="💍" />
                <p style={{ fontSize: ".6rem", color: "#4a4440", marginTop: 6 }}>Shown when no image is available</p>
              </div>
              <div>
                <label className="inp-label">Status</label>
                <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="inp-label">Tag / Badge</label>
                <select className="inp" value={form.tag ?? ""} onChange={e => set("tag", e.target.value || null)}>
                  <option value="">None</option>
                  {TAGS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Name + material */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {inputGroup("Product Name *", "name", "text", "e.g. Resin Ring")}
            {inputGroup("Material / Subtitle *", "material", "text", "e.g. Sterling Silver")}
          </div>

          {/* Price + stock + category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label className="inp-label">Price (₹) *</label>
              <input className="inp" type="number" min="0" placeholder="599"
                value={form.price ?? ""} onChange={e => set("price", e.target.value)}
                style={errors.price ? { borderColor: "#e07070" } : {}} />
              {errors.price && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors.price}</p>}
            </div>
            <div>
              <label className="inp-label">Stock *</label>
              <input className="inp" type="number" min="0" placeholder="10"
                value={form.stock ?? ""} onChange={e => set("stock", e.target.value)}
                style={errors.stock ? { borderColor: "#e07070" } : {}} />
              {errors.stock && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors.stock}</p>}
            </div>
            <div>
              <label className="inp-label">Category</label>
              <select className="inp" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="inp-label">Description</label>
            <textarea className="inp" rows={3} placeholder="Describe this piece..."
              value={form.desc} onChange={e => set("desc", e.target.value)}
              style={{ resize: "vertical", minHeight: 80 }} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #2a2420" }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-gold" onClick={handleSave}>
              {isEdit ? "Save Changes" : "Add Product"} ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CONFIRM MODAL ──────────────────────────────────────────────────────── */
function ConfirmModal({ msg, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="confirm-box">
        <div style={{ fontSize: "2rem", marginBottom: 16 }}>⬦</div>
        <p style={{ fontSize: ".95rem", marginBottom: 8, lineHeight: 1.6 }}>{msg}</p>
        <p style={{ fontSize: ".75rem", color: "#6b6460", marginBottom: 28 }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" style={{ padding: "12px 24px" }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
function Sidebar({ activeTab, setActiveTab }) {
  const links = [
    { id: "products", label: "Products", icon: "◈" },
    { id: "add",      label: "Add Product", icon: "+" },
    { id: "stats",    label: "Analytics", icon: "⬦" },
  ];
  return (
    <aside style={{ width: 220, background: "#13110e", borderRight: "1px solid #1e1b17", display: "flex", flexDirection: "column", padding: "32px 12px", flexShrink: 0, minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ padding: "0 8px 32px", borderBottom: "1px solid #1e1b17", marginBottom: 24 }}>
        <div className="serif" style={{ fontSize: "1.2rem", letterSpacing: ".3em", textTransform: "uppercase" }}>
          DRE<span style={{ color: "#c9a96e" }}>A</span>MIFY
        </div>
        <div style={{ fontSize: ".55rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#3a3430", marginTop: 6 }}>
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {links.map(l => (
          <button key={l.id} className={`sidebar-link${activeTab === l.id ? " active" : ""}`} onClick={() => setActiveTab(l.id)}>
            <span style={{ fontSize: ".8rem", width: 14, textAlign: "center" }}>{l.icon}</span>
            {l.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ paddingTop: 24, borderTop: "1px solid #1e1b17" }}>
        <div style={{ fontSize: ".6rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#3a3430", padding: "0 8px", lineHeight: 2 }}>
          <div>Logged in as</div>
          <div style={{ color: "#6b6460" }}>Admin ✦</div>
        </div>
      </div>
    </aside>
  );
}

/* ─── STATS TAB ──────────────────────────────────────────────────────────── */
function StatsTab({ products }) {
  const total = products.length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock <= 5).length;
  const hidden = products.filter(p => p.status !== "active").length;

  const catCounts = CATEGORIES.map(c => ({ cat: c, count: products.filter(p => p.category === c).length }));
  const max = Math.max(...catCounts.map(c => c.count), 1);

  return (
    <div style={{ padding: "40px 48px" }}>
      <div className="fade-up">
        <p style={{ fontSize: ".65rem", letterSpacing: ".3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 8 }}>Overview</p>
        <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 300, marginBottom: 40 }}>Analytics</h1>
      </div>

      {/* KPI cards */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 48 }}>
        {[
          { label: "Total Products", value: total, icon: "◈", accent: "#c9a96e" },
          { label: "Inventory Value", value: `₹${totalValue.toLocaleString("en-IN")}`, icon: "⬦", accent: "#5a9e6a" },
          { label: "Low Stock", value: lowStock, icon: "△", accent: "#e0a070" },
          { label: "Hidden / Draft", value: hidden, icon: "○", accent: "#e07070" },
        ].map(({ label, value, icon, accent }) => (
          <div key={label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span style={{ fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#6b6460" }}>{label}</span>
              <span style={{ color: accent, fontSize: "1rem" }}>{icon}</span>
            </div>
            <div className="serif" style={{ fontSize: "2rem", color: accent }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, padding: 28 }}>
          <p style={{ fontSize: ".65rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 24 }}>By Category</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {catCounts.map(({ cat, count }) => (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: ".72rem", textTransform: "capitalize" }}>{cat}</span>
                  <span style={{ fontSize: ".72rem", color: "#c9a96e" }}>{count}</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, padding: 28 }}>
          <p style={{ fontSize: ".65rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 24 }}>Stock Levels</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {products.slice(0, 6).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="img-tile" style={{ width: 36, height: 46, fontSize: "1rem", flexShrink: 0 }}>
                  {p.img ? <img src={p.img} alt="" /> : p.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: ".72rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>{p.name}</div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${Math.min(p.stock * 5, 100)}%`, background: p.stock <= 5 ? "#e0a070" : "#c9a96e" }} />
                  </div>
                </div>
                <span style={{ fontSize: ".72rem", color: p.stock <= 5 ? "#e0a070" : "#6b6460", flexShrink: 0 }}>{p.stock}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PRODUCTS TABLE ─────────────────────────────────────────────────────── */
function ProductsTab({ products, setProducts, onEdit, showToast, setActiveTab }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.material.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggleStatus = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "hidden" : "active" } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast("Product deleted", "error");
    setConfirmId(null);
  };

  const tagClass = (tag) => {
    if (tag === "New") return "badge badge-new";
    if (tag === "Bestseller") return "badge badge-best";
    return "badge badge-none";
  };

  return (
    <div style={{ padding: "40px 48px" }}>
      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <p style={{ fontSize: ".65rem", letterSpacing: ".3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 8 }}>Manage</p>
          <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 300 }}>Products <span style={{ color: "#3a3430", fontSize: "1.4rem" }}>({products.length})</span></h1>
        </div>
        <button className="btn-gold" onClick={() => setActiveTab("add")}>+ Add Product</button>
      </div>

      {/* Filters */}
      <div className="fade-up-1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <div className="search-wrap" style={{ flex: 1, minWidth: 200, maxWidth: 320 }}>
          <span className="search-icon">⌕</span>
          <input className="inp" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", ...CATEGORIES].map(c => (
            <button key={c} className={`cat-pill${catFilter === c ? " active" : ""}`} onClick={() => setCatFilter(c)}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="fade-up-2" style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "64px 1fr 100px 90px 90px 80px 120px", gap: 16, padding: "12px 20px", borderBottom: "1px solid #2a2420", background: "#13110e" }}>
          {["", "Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
            <span key={h} style={{ fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#4a4440" }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div className="serif" style={{ fontSize: "3rem", color: "#2e2a26", marginBottom: 12 }}>◈</div>
            <p style={{ fontSize: ".8rem", color: "#4a4440" }}>No products found</p>
          </div>
        ) : filtered.map((p, i) => (
          <div key={p.id} className="prod-row" style={{ opacity: 0, animation: `fadeUp .5s ease ${i * .04}s forwards` }}>
            {/* Image */}
            <div className="img-tile">
              {p.img ? <img src={p.img} alt={p.name} /> : p.emoji}
            </div>

            {/* Name */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: ".88rem" }}>{p.name}</span>
                {p.tag && <span className={tagClass(p.tag)}>{p.tag}</span>}
              </div>
              <span style={{ fontSize: ".68rem", color: "#6b6460" }}>{p.material}</span>
            </div>

            {/* Category */}
            <span style={{ fontSize: ".72rem", color: "#6b6460", textTransform: "capitalize" }}>{p.category}</span>

            {/* Price */}
            <span style={{ fontSize: ".88rem", color: "#c9a96e" }}>₹{p.price.toLocaleString("en-IN")}</span>

            {/* Stock */}
            <span style={{ fontSize: ".88rem", color: p.stock <= 5 ? "#e0a070" : "#faf8f5" }}>
              {p.stock}
              {p.stock <= 5 && <span style={{ fontSize: ".55rem", marginLeft: 4, color: "#e0a070" }}>low</span>}
            </span>

            {/* Status toggle */}
            <div>
              <label className="switch" title={p.status === "active" ? "Click to hide" : "Click to activate"}>
                <input type="checkbox" checked={p.status === "active"} onChange={() => toggleStatus(p.id)} />
                <div className="switch-track" />
                <div className="switch-thumb" />
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn-edit" onClick={() => onEdit(p)}>Edit</button>
              <button className="btn-danger" onClick={() => setConfirmId(p.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <ConfirmModal
          msg={`Delete "${products.find(p => p.id === confirmId)?.name}"?`}
          onConfirm={() => deleteProduct(confirmId)}
          onClose={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

/* ─── ADD PRODUCT QUICK FORM ─────────────────────────────────────────────── */
function AddProductTab({ onAdd, showToast }) {
  const blank = { name: "", material: "", price: "", category: "rings", tag: null, status: "active", stock: "", emoji: "✦", img: null, desc: "" };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.material.trim()) e.material = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onAdd({ ...form, price: Number(form.price), stock: Number(form.stock), id: Date.now() });
    showToast(`"${form.name}" added to collection ✦`, "success");
    setForm(blank);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = (label, key, type = "text", ph = "") => (
    <div>
      <label className="inp-label">{label}</label>
      <input className="inp" type={type} placeholder={ph} value={form[key] ?? ""}
        onChange={e => set(key, e.target.value)}
        style={errors[key] ? { borderColor: "#e07070" } : {}} />
      {errors[key] && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ padding: "40px 48px", maxWidth: 800 }}>
      <div className="fade-up">
        <p style={{ fontSize: ".65rem", letterSpacing: ".3em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 8 }}>Add New</p>
        <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 300, marginBottom: 8 }}>Add to Collection</h1>
        <p style={{ fontSize: ".8rem", color: "#6b6460", marginBottom: 40 }}>New pieces will appear live on the storefront immediately.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Image + basic */}
        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28, alignItems: "start" }}>
          <div>
            <label className="inp-label">Product Image</label>
            <ImageUploader value={form.img} onChange={v => set("img", v)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {inp("Product Name *", "name", "text", "e.g. Pearl Stud Earrings")}
            {inp("Material / Subtitle *", "material", "text", "e.g. 14K Gold-filled")}
            <div>
              <label className="inp-label">Description</label>
              <textarea className="inp" rows={3} placeholder="Describe this piece with care..."
                value={form.desc} onChange={e => set("desc", e.target.value)}
                style={{ resize: "vertical" }} />
            </div>
          </div>
        </div>

        {/* Details row */}
        <div className="fade-up-2" style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, padding: 24 }}>
          <p style={{ fontSize: ".62rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20 }}>Pricing & Inventory</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <div>
              <label className="inp-label">Price (₹) *</label>
              <input className="inp" type="number" min="0" placeholder="599"
                value={form.price ?? ""} onChange={e => set("price", e.target.value)}
                style={errors.price ? { borderColor: "#e07070" } : {}} />
              {errors.price && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors.price}</p>}
            </div>
            <div>
              <label className="inp-label">Stock *</label>
              <input className="inp" type="number" min="0" placeholder="10"
                value={form.stock ?? ""} onChange={e => set("stock", e.target.value)}
                style={errors.stock ? { borderColor: "#e07070" } : {}} />
              {errors.stock && <p style={{ fontSize: ".62rem", color: "#e07070", marginTop: 4 }}>{errors.stock}</p>}
            </div>
            <div>
              <label className="inp-label">Category</label>
              <select className="inp" value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="inp-label">Tag / Badge</label>
              <select className="inp" value={form.tag ?? ""} onChange={e => set("tag", e.target.value || null)}>
                <option value="">None</option>
                {TAGS.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="fade-up-3" style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, padding: 24 }}>
          <p style={{ fontSize: ".62rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20 }}>Appearance</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className="inp-label">Emoji Fallback</label>
              <input className="inp" value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="💍" />
              <p style={{ fontSize: ".6rem", color: "#4a4440", marginTop: 6 }}>Used when no image is uploaded</p>
            </div>
            <div>
              <label className="inp-label">Visibility</label>
              <select className="inp" value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Preview card */}
        <div className="fade-up-4" style={{ background: "#17140f", border: "1px solid #2e2a26", borderRadius: 8, padding: 24 }}>
          <p style={{ fontSize: ".62rem", letterSpacing: ".25em", textTransform: "uppercase", color: "#c9a96e", marginBottom: 20 }}>Live Preview</p>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ width: 100, aspectRatio: "3/4", background: "#1e1b17", border: "1px solid #2e2a26", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", borderRadius: 4, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              {form.img ? <img src={form.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : form.emoji || "✦"}
              {form.tag && <span style={{ position: "absolute", top: 8, left: 8, fontSize: ".55rem", letterSpacing: ".15em", textTransform: "uppercase", background: "#1a1714", color: "#c9a96e", padding: "3px 7px" }}>{form.tag}</span>}
            </div>
            <div style={{ paddingTop: 4 }}>
              <p className="serif" style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: 4 }}>{form.name || "Product Name"}</p>
              <p style={{ fontSize: ".7rem", color: "#6b6460", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>{form.material || "Material"}</p>
              <p style={{ fontSize: ".9rem", color: "#c9a96e" }}>₹{form.price || "—"}</p>
              {form.desc && <p style={{ fontSize: ".72rem", color: "#4a4440", marginTop: 10, lineHeight: 1.6, maxWidth: 300 }}>{form.desc}</p>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up-5" style={{ display: "flex", gap: 12 }}>
          <button className="btn-gold" onClick={handleSave} style={{ minWidth: 180 }}>
            {saved ? "Added ✓" : "Add to Collection ✦"}
          </button>
          <button className="btn-ghost" onClick={() => { setForm(blank); setErrors({}); }}>Clear Form</button>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function DreamifyAdmin() {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [activeTab, setActiveTab] = useState("products");
  const [editProduct, setEditProduct] = useState(null);
  const { toast, showToast } = useToast();

  const handleAdd = (product) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleSaveEdit = (updated) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditProduct(null);
    showToast(`"${updated.name}" updated ✦`, "success");
  };

  return (
    <>
      <GlobalStyles />

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", background: "#0e0c0a" }}>
          {/* Top bar */}
          <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(14,12,10,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1b17", padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "products", label: "Products" }, { id: "add", label: "Add Product" }, { id: "stats", label: "Analytics" }].map(t => (
                <button key={t.id} className={`nav-tab${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ fontSize: ".68rem", color: "#4a4440", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5a9e6a", display: "inline-block", animation: "pulse 2s infinite" }} />
                Store Live
              </div>
              <a href="#" style={{ fontSize: ".65rem", letterSpacing: ".15em", textTransform: "uppercase", color: "#6b6460", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#c9a96e"} onMouseLeave={e => e.target.style.color = "#6b6460"}>
                View Store →
              </a>
            </div>
          </div>

          {/* Page content */}
          {activeTab === "products" && (
            <ProductsTab
              products={products}
              setProducts={setProducts}
              onEdit={handleEdit}
              showToast={showToast}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "add" && (
            <AddProductTab onAdd={handleAdd} showToast={showToast} />
          )}
          {activeTab === "stats" && (
            <StatsTab products={products} />
          )}
        </main>
      </div>

      {/* Edit modal */}
      {editProduct && (
        <ProductModal
          mode="edit"
          product={editProduct}
          onSave={handleSaveEdit}
          onClose={() => setEditProduct(null)}
        />
      )}

      {/* Toast */}
      {toast.msg && (
        <div className={`toast ${toast.visible ? "show" : "hide"} ${toast.type}`}>
          {toast.type === "success" && <span style={{ color: "#5a9e6a", marginRight: 8 }}>✦</span>}
          {toast.type === "error" && <span style={{ color: "#e07070", marginRight: 8 }}>⬦</span>}
          {toast.msg}
        </div>
      )}
    </>
  );
}
