import { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar";
import GlassTable from "../GlassTable";
import { DocIcon, DocEmoji } from "./DocIcon";
import { FaArrowLeft, FaBuilding, FaDownload, FaPlus, FaTimes, FaSearch } from "react-icons/fa";
import { useLocation, useHistory } from "react-router-dom";
import { useFetch, api } from "../../../Components/CommonImports/CommonImports";

// --- CSV export ---------------------------------------------------------------
function exportToExcel(rows, filename = "Documents.csv") {
    const headers = ["Document Category", "Sub Category", "Created Date", "File Type"];
    const csvRows = [
        headers.join(","),
        ...rows.map((doc) =>
            [
                `"${(doc.category || "").replace(/"/g, '""')}"`,
                `"${(doc.subCategory || "").replace(/"/g, '""')}"`,
                `"${doc.createdDate ? new Date(doc.createdDate).toLocaleDateString("en-GB") : ""}"`,
                `"${(doc.type || "").replace(/"/g, '""')}"`,
            ].join(",")
        ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Category badge -----------------------------------------------------------
function getCategoryColor(label) {
    const colors = [
        { color: "#ff6b6b", bg: "rgba(255,107,107,0.15)", border: "rgba(255,107,107,0.28)" },
        { color: "#4dabf7", bg: "rgba(77,171,247,0.15)", border: "rgba(77,171,247,0.28)" },
        { color: "#51cf66", bg: "rgba(81,207,102,0.15)", border: "rgba(81,207,102,0.28)" },
        { color: "#ffd43b", bg: "rgba(255,212,59,0.15)", border: "rgba(255,212,59,0.28)" },
        { color: "#845ef7", bg: "rgba(132,94,247,0.15)", border: "rgba(132,94,247,0.28)" },
        { color: "#f06595", bg: "rgba(240,101,149,0.15)", border: "rgba(240,101,149,0.28)" },
        { color: "#20c997", bg: "rgba(32,201,151,0.15)", border: "rgba(32,201,151,0.28)" },
        { color: "#ffa94d", bg: "rgba(255,169,77,0.15)", border: "rgba(255,169,77,0.28)" },
        { color: "#74c0fc", bg: "rgba(116,192,252,0.15)", border: "rgba(116,192,252,0.28)" },
        { color: "#dee2e6", bg: "rgba(222,226,230,0.15)", border: "rgba(222,226,230,0.28)" },
    ];
    let hash = 0;
    for (let i = 0; i < (label || "").length; i++) {
        hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function CategoryBadge({ label }) {
    const t = getCategoryColor(label || "General");
    return (
        <span
            style={{
                padding: "4px 11px",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: 600,
                color: t.color,
                background: t.bg,
                border: `1px solid ${t.border}`,
                letterSpacing: "0.04em",
            }}
        >
            {label}
        </span>
    );
}

// --- Add Document Popup -------------------------------------------------------
function AddDocumentPopup({ docs, onClose, onSave }) {
    const uniqueNames = [...new Set(docs.map((d) => d.documentName).filter(Boolean))];
    const uniqueSubCats = [...new Set(docs.map((d) => d.subCategory).filter(Boolean))];

    const [form, setForm] = useState({
        documentName: "",
        subCategory: "",
        createdDate: new Date().toISOString().split("T")[0],
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.documentName) e.documentName = "Required";
        if (!form.subCategory) e.subCategory = "Required";
        if (!form.createdDate) e.createdDate = "Required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const fieldStyle = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.13)",
        color: "#e2e8f0",
        fontSize: "13px",
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "6px",
    };

    const labelStyle = {
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    background: "linear-gradient(145deg, rgba(26,26,46,0.98) 0%, rgba(15,52,96,0.98) 100%)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    borderRadius: "20px",
                    padding: "36px 36px 28px",
                    width: "440px",
                    maxWidth: "95vw",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(102,126,234,0.15)",
                    position: "relative",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "18px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        color: "rgba(255,255,255,0.5)",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "13px",
                    }}
                >
                    <FaTimes />
                </button>

                <div style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "24px", letterSpacing: "-0.02em" }}>
                    Add Document
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Document Name</label>
                    <select
                        value={form.documentName}
                        onChange={(e) => setForm({ ...form, documentName: e.target.value })}
                        style={{ ...fieldStyle, cursor: "pointer" }}
                    >
                        <option value=""> Select </option>
                        {uniqueNames.map((n) => (
                            <option key={n} value={n} style={{ background: "#1a1a2e" }}>{n}</option>
                        ))}
                    </select>
                    {errors.documentName && <span style={{ color: "#ff6b6b", fontSize: "11px" }}>{errors.documentName}</span>}
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>Sub Category</label>
                    <select
                        value={form.subCategory}
                        onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                        style={{ ...fieldStyle, cursor: "pointer" }}
                    >
                        <option value=""> Select </option>
                        {uniqueSubCats.map((s) => (
                            <option key={s} value={s} style={{ background: "#1a1a2e" }}>{s}</option>
                        ))}
                    </select>
                    {errors.subCategory && <span style={{ color: "#ff6b6b", fontSize: "11px" }}>{errors.subCategory}</span>}
                </div>

                <div style={{ marginBottom: "28px" }}>
                    <label style={labelStyle}>Created On</label>
                    <input
                        type="date"
                        value={form.createdDate}
                        onChange={(e) => setForm({ ...form, createdDate: e.target.value })}
                        style={{ ...fieldStyle, colorScheme: "dark" }}
                    />
                    {errors.createdDate && <span style={{ color: "#ff6b6b", fontSize: "11px" }}>{errors.createdDate}</span>}
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "9px 22px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.55)",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { if (validate()) onSave(form); }}
                        style={{
                            padding: "9px 24px",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            border: "none",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            boxShadow: "0 4px 14px rgba(102,126,234,0.42)",
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Component -----------------------------------------------------------
export default function DocumentsPage({ user, onLogout }) {
    const location = useLocation();
    const history = useHistory();
    const { post, response } = useFetch({ data: [] });

    const storedCompany = sessionStorage.getItem("doc_company");
    const [company, setCompany] = useState(
        location.state?.company || (storedCompany ? JSON.parse(storedCompany) : null)
    );

    // All hooks declared before any conditional return (Rules of Hooks)
    const [docs, setDocs] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);

    // -- NEW: search bar toggle state + ref for auto-focus ------------------
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Auto-focus input when bar opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Guard: if company is missing, redirect back  placed AFTER all hooks
    if (!company) {
        history.replace("/search");
        return null;
    }

    const fetchDocuments = async (documentTypeId) => {
        if (!documentTypeId) return;
        try {
            setLoading(true);
            const result = await post(api + "/documentTransaction/documentTransaction", {
                id: Math.random(),
                loadTime: Date().toLocaleString(),
            });

            if (response.ok && Array.isArray(result)) {
                const filtered = result.filter(
                    (item) => item?.documentTypeMaster?.documentTypeId === documentTypeId
                );

                const mapped = filtered.map((item) => ({
                    ...item,
                    documentName:
                        item.documentName ||
                        item.name ||
                        item.documentTypeMaster?.documentType ||
                        "Untitled",
                    category: item.folderMaster?.folderCategoryName || "General",
                    subCategory: item.subFolderMaster?.subFolderCategoryName || "General",
                    createdDate: item.createdDate || item.createdOn || item.transactionDate,
                    type:
                        item.fileType ||
                        item.documentTypeMaster?.documentType ||
                        "default",
                }));

                setDocs(mapped);
            } else {
                setDocs([]);
            }
        } catch (err) {
            console.error("fetchDocuments error:", err);
            setDocs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (company?.id) {
            setDocs([]);
            setActiveFilter("All");
            setSearchQuery("");
            setSearchOpen(false);
            fetchDocuments(company.id);
            sessionStorage.setItem("doc_company", JSON.stringify(company));
        }
    }, [company?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const allCategories = ["All", ...new Set(docs.map((d) => d.subCategory || "General"))];

    const filteredDocs = docs
        .filter((d) => activeFilter === "All" || d.subCategory === activeFilter)
        .filter((d) =>
            searchQuery.trim() === "" ||
            (d.documentName || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleOpenDocument = (doc) => {
        history.push({
            pathname: "/document-detail",
            state: { document: doc, company },
        });
    };

    const handleAddSave = (formData) => {
        const newDoc = {
            documentName: formData.documentName,
            subCategory: formData.subCategory,
            createdDate: formData.createdDate,
            category: "General",
            type: "default",
        };
        setDocs((prev) => [newDoc, ...prev]);
        setShowAddPopup(false);
    };

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            marginLeft: 0,
            overflowX: "hidden",
            background:
                "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
            fontFamily: "'Segoe UI', 'SF Pro Display', sans-serif",
            position: "relative",
        },
        orb1: {
            position: "fixed",
            width: "540px",
            height: "540px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(83,52,131,0.3) 0%, transparent 70%)",
            top: "-160px",
            right: "-90px",
            pointerEvents: "none",
            zIndex: 0,
        },
        orb2: {
            position: "fixed",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(15,52,96,0.38) 0%, transparent 70%)",
            bottom: "-90px",
            left: "-70px",
            pointerEvents: "none",
            zIndex: 0,
        },
        body: {
            padding: "40px 40px",
            position: "relative",
            zIndex: 1,
        },
        topRow: {
            display: "flex",
            alignItems: "stretch",
            gap: "20px",
            marginBottom: "32px",
            flexWrap: "wrap",
        },
        backBtn: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            fontSize: "13px",
            padding: "0 18px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)",
            transition: "background 0.2s, color 0.2s",
            fontFamily: "inherit",
            flexShrink: 0,
            minHeight: "52px",
        },
        companyCard: {
            flex: 1,
            minWidth: "240px",
            padding: "18px 24px",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
        companyIconWrap: {
            width: "46px",
            height: "46px",
            borderRadius: "13px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            flexShrink: 0,
            boxShadow: "0 6px 14px rgba(102,126,234,0.38)",
        },
        sectionHeader: {
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
        },
        sectionTitle: {
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.025em",
        },
        badge: {
            padding: "4px 13px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
            background: "rgba(102,126,234,0.18)",
            color: "#a5b4fc",
            border: "1px solid rgba(102,126,234,0.28)",
        },
    };

    const iconBtnBase = {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "8px 18px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        border: "1px solid rgba(255,255,255,0.13)",
        transition: "all 0.18s",
        letterSpacing: "0.03em",
    };

    return (
        <div style={styles.page}>
            <div style={styles.orb1} />
            <div style={styles.orb2} />

            <Navbar
                user={user}
                onLogout={onLogout}
                breadcrumb={["Dashboard", company?.name || "Company", "Documents"]}
            />

            <div style={styles.body}>
                {/* Top row */}
                <div style={styles.topRow}>
                    <button style={styles.backBtn} onClick={() => history.push("/search")}>
                        <FaArrowLeft /> Back
                    </button>

                    <div style={styles.companyCard}>
                        <div style={styles.companyIconWrap}>
                            <FaBuilding />
                        </div>
                        <div>
                            <div style={{ color: "#fff", fontWeight: 700 }}>
                                {company?.name || "Loading..."}
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.5)" }}>
                                {docs.length} documents
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-category filter pills */}
                <div style={{ marginBottom: 20 }}>
                    {allCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            style={{
                                marginRight: 10,
                                padding: "6px 14px",
                                borderRadius: "20px",
                                background:
                                    activeFilter === cat
                                        ? "linear-gradient(135deg,#667eea,#764ba2)"
                                        : "rgba(255,255,255,0.07)",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                fontSize: "12px",
                                fontWeight: activeFilter === cat ? 600 : 400,
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Section header + action icons */}
                <div
                    style={{
                        ...styles.sectionHeader,
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={styles.sectionTitle}>Documents</div>
                        <span style={styles.badge}>{filteredDocs.length} records</span>
                    </div>

                    {/* -- Action bar: search icon + download + add ----------------- */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                        {/* -- Inline expanding search ------------------------------ */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0px",
                                borderRadius: "10px",
                                background: searchOpen ? "rgba(255,255,255,0.07)" : "transparent",
                                border: searchOpen
                                    ? "1px solid rgba(255,255,255,0.18)"
                                    : "1px solid transparent",
                                transition: "all 0.25s ease",
                                overflow: "hidden",
                                width: searchOpen ? "220px" : "36px",
                                height: "36px",
                                boxSizing: "border-box",
                            }}
                        >
                            {/* Search icon  always visible, acts as toggle */}
                            <button
                                title={searchOpen ? "Close search" : "Search documents"}
                                onClick={() => {
                                    if (searchOpen) {
                                        setSearchQuery("");
                                    }
                                    setSearchOpen((prev) => !prev);
                                }}
                                style={{
                                    flexShrink: 0,
                                    width: "34px",
                                    height: "34px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: searchOpen
                                        ? "transparent"
                                        : "rgba(255,255,255,0.07)",
                                    border: searchOpen
                                        ? "none"
                                        : "1px solid rgba(255,255,255,0.13)",
                                    borderRadius: searchOpen ? "0" : "10px",
                                    color: searchOpen
                                        ? "rgba(255,255,255,0.5)"
                                        : "rgba(255,255,255,0.6)",
                                    cursor: "pointer",
                                    transition: "all 0.18s",
                                    padding: 0,
                                }}
                            >
                                {searchOpen ? <FaTimes size={11} /> : <FaSearch size={12} />}
                            </button>

                            {/* Text input  only rendered when open */}
                            {searchOpen && (
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        flex: 1,
                                        background: "transparent",
                                        border: "none",
                                        outline: "none",
                                        color: "#e2e8f0",
                                        fontSize: "12px",
                                        fontFamily: "inherit",
                                        padding: "0 10px 0 4px",
                                        width: "100%",
                                    }}
                                />
                            )}
                        </div>

                        {/* Download CSV */}
                        <button
                            title="Download as CSV"
                            onClick={() => exportToExcel(filteredDocs, `Documents_${company?.name || "export"}.csv`)}
                            style={{
                                ...iconBtnBase,
                                background: "rgba(32,201,151,0.12)",
                                color: "#20c997",
                                borderColor: "rgba(32,201,151,0.28)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(32,201,151,0.22)";
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(32,201,151,0.25)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(32,201,151,0.12)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <FaDownload style={{ fontSize: "13px" }} />
                        </button>

                        {/* Add Document */}
                        <button
                            title="Add Document"
                            onClick={() => setShowAddPopup(true)}
                            style={{
                                ...iconBtnBase,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "#fff",
                                borderColor: "transparent",
                                boxShadow: "0 4px 14px rgba(102,126,234,0.38)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102,126,234,0.55)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(102,126,234,0.38)";
                                e.currentTarget.style.transform = "none";
                            }}
                        >
                            <FaPlus style={{ fontSize: "12px" }} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={{ color: "#fff" }}>Loading documents...</div>
                ) : filteredDocs.length === 0 ? (
                    <div style={{ color: "rgba(255,255,255,0.5)" }}>No documents found</div>
                ) : (
                    <GlassTable
                        headers={["Document Category", "Doc Sub Category", "Created Date", "Doc Icon"]}
                        rows={filteredDocs.map((doc) => [
                            // -- CHANGE 2: doc name is now a clickable link ----------
                            <span
                                style={{ display: "flex", gap: "10px", alignItems: "center" }}
                            >
                                <DocEmoji type={doc.type} />
                                <span
                                    onClick={() => handleOpenDocument(doc)}
                                    title="Open document"
                                    style={{
                                        color: "#e2e8f0",
                                        fontWeight: 500,
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        transition: "color 0.15s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.color = "#a5b4fc";
                                        e.currentTarget.style.textDecoration = "underline";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.color = "#e2e8f0";
                                        e.currentTarget.style.textDecoration = "none";
                                    }}
                                >
                                    {doc.category}
                                </span>
                            </span>,
                            <CategoryBadge label={doc.subCategory} />,
                            <span
                                style={{
                                    color: "rgba(255,255,255,0.45)",
                                    fontFamily: "'Courier New', Courier, monospace",
                                    fontSize: "12px",
                                }}
                            >
                                {formatDate(doc.createdDate)}
                            </span>,
                            <DocIcon type={doc.type} onClick={() => handleOpenDocument(doc)} />,
                        ])}
                    />
                )}
            </div>

            {showAddPopup && (
                <AddDocumentPopup
                    docs={docs}
                    onClose={() => setShowAddPopup(false)}
                    onSave={handleAddSave}
                />
            )}
        </div>
    );
}
