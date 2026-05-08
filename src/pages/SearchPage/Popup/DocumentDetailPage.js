import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Navbar from "../Navbar";
import GlassTable from "../GlassTable";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaComment,
    FaDownload,
    FaHistory,
    FaEye,
    FaTimes,
    FaFile,
    FaFileExcel,
    FaFileAlt,
    FaImage,
    FaFilePowerpoint,
    FaFileWord,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { useFetch, api } from "../../../Components/CommonImports/CommonImports";
import AuthContext from "../../../store/auth-context";

// --- helpers ----------------------------------------------------------------
const getFileExtension = (name) => (name || "").split(".").pop().toLowerCase();

// --- Main Component ---------------------------------------------------------
export default function DocumentDetail({ user, onLogout }) {
    const location = useLocation();

    const authCtx = useContext(AuthContext);
    const history = useHistory();
    const { post, response, get } = useFetch({ data: [] });

    const company = location.state?.company;
    const doc = location.state?.document;

    // -- upload form state --------------------------------------------------
    const [file, setFile] = useState(null);
    const [remark, setRemark] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [uploading, setUploading] = useState(false);

    // -- table / pagination state -------------------------------------------
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // -- comment / history popup state --------------------------------------
    const [commentPopup, setCommentPopup] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [historyPopup, setHistoryPopup] = useState(null);

    // -- view popup state ---------------------------------------------------
    const [viewPopup, setViewPopup] = useState(null);   // record index
    const [viewBlobUrl, setViewBlobUrl] = useState(null);
    const [viewMimeType, setViewMimeType] = useState("");
    const [viewLoading, setViewLoading] = useState(false);

    // -- Excel sheet state (from FileViewer) --------------------------------
    const [sheets, setSheets] = useState([]);
    const [activeSheet, setActiveSheet] = useState(0);

    // keep track of blob URL to revoke on close
    const blobUrlRef = useRef(null);

    // -- guard --------------------------------------------------------------
    if (!doc || !company) {
        history.replace("/documents");
        return null;
    }
    const fetchDownloadHistory = async (index) => {
        const reportDocId = records[index]?.reportDocId;
        if (!reportDocId) return;

        try {
            const payload = {
                reportDocId: reportDocId.toString(),
                userId: authCtx.userId.toString(),
            };
            const res = await post(api + "/downloadHistory/getDownloadHistory", payload);
            console.log(" payload for the fetch hist", payload)
            console.log(" res for  for the fetch hist", res)
            const updated = [...records];
            updated[index].downloadHistory = (res || []).map((h) => ({
                user: authCtx.userName || "Unknown User",
                date: new Date(h.downloadHistoryTime).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }),
            }));
            setRecords(updated);
        } catch (err) {
            console.error("History fetch error:", err);
        }
    };

    // -----------------------------------------------------------------------
    // API: LOAD RECORDS
    // -----------------------------------------------------------------------
    const initialLoadData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await post(api + "/documentTransaction/getListByTransacId", {
                transactionId: company?.id,
            });
            if (response.ok && Array.isArray(result)) {
                const baseRecords = result.map((item) => ({
                    ...item,
                    name: item.fileName,
                    remark: item.remarks,
                    comments: [],
                    downloadHistory: [],
                }));

                setRecords(baseRecords);

                baseRecords.forEach(async (record, index) => {
                    if (!record.reportDocId) return;

                    try {
                        const payload = {
                            reportDocId: record.reportDocId.toString(),
                            userId: authCtx.userId.toString(),
                        };

                        const res = await post(api + "/downloadHistory/getDownloadHistory", payload);

                        setRecords((prev) => {
                            const newRecords = [...prev];
                            if (newRecords[index]) {
                                newRecords[index].downloadHistory = (res || []).map((h) => ({
                                    user: authCtx.userName || "User",
                                    date: new Date(h.downloadHistoryTime).toLocaleString("en-IN"),
                                }));
                            }
                            return newRecords;
                        });
                    } catch (err) {
                        console.error(`History fetch failed for index ${index}`, err);
                    }
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [company?.id]);

    useEffect(() => { initialLoadData(); fetchDownloadHistory() }, [initialLoadData, authCtx.userId]);

    // -----------------------------------------------------------------------
    // API: UPLOAD FILE
    // -----------------------------------------------------------------------
    const handleSave = async () => {
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("remarks", remark);
            formData.append("transactionId", company?.id || 0);
            formData.append("documentType", doc?.name || "General");
            formData.append("folderCategoryName", "RepositoryDocument");
            formData.append("subFolderCategoryName", "GeneralSubFolder");

            const result = await post(api + "/documentTransaction/uploadFile", formData);
            if (response.ok && result?.retValues?.status === 1) {
                const uploaded = result.retValues.reports;
                setRecords((prev) => [
                    ...prev,
                    {
                        ...uploaded,
                        name: uploaded.fileName,
                        remark: uploaded.remarks,
                        comments: [],
                        downloadHistory: [],
                    },
                ]);
                resetForm();
                alert("File uploaded successfully!");
            } else {
                alert("Upload failed: " + (result?.retValues?.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };  

    // const handleUpdate = () => {
    //     const updated = [...records];
    //     updated[editingIndex].remark = remark;
    //     setRecords(updated);
    //     resetForm();
    //     setEditingIndex(null);
    // };

    const resetForm = () => { setFile(null); setRemark(""); };

    // -----------------------------------------------------------------------
    // API: VIEW FILE  ?  blob ? object URL ? popup
    // -----------------------------------------------------------------------
    const handleView = async (index) => {
        // reset any previous state
        setSheets([]);
        setActiveSheet(0);
        setViewPopup(index);
        setViewBlobUrl(null);
        setViewMimeType("");
        setViewLoading(true);

        const rowData = records[index];
        try {
            await post(api + "/documentTransaction/viewFile", {
                reportDocId: rowData.reportDocId,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                if (blobUrlRef.current) window.URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = url;

                const ext = getFileExtension(rowData.name || "");

                // parse Excel sheets before revealing the viewer
                if (["xls", "xlsx", "csv"].includes(ext)) {
                    await loadExcelPreview(blob);
                }

                setViewBlobUrl(url);
                setViewMimeType(blob.type || "");
            }
        } catch (err) {
            console.error("View error:", err);
        } finally {
            setViewLoading(false);
        }
    };

    // -- Excel parser (same logic as FileViewer) ----------------------------
    const loadExcelPreview = async (blob) => {
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const parsedSheets = workbook.SheetNames.map((name) => ({
                name,
                html: XLSX.utils.sheet_to_html(workbook.Sheets[name]),
            }));
            setSheets(parsedSheets);
            setActiveSheet(0);
        } catch (err) {
            console.error("Excel parsing error:", err);
        }
    };

    const closeViewPopup = () => {
        setViewPopup(null);
        setViewBlobUrl(null);
        setViewMimeType("");
        setSheets([]);
        setActiveSheet(0);
        if (blobUrlRef.current) {
            window.URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
    };

    // -----------------------------------------------------------------------
    // API: DOWNLOAD FILE
    // -----------------------------------------------------------------------
    const handleDownload = async (index) => {
        const rowData = records[index];
        try {
            const val = {
                reportDocId: rowData.reportDocId,
            }
            const res = await post(api + "/documentTransaction/downloadFile", val);
            console.log(" res for dpowenload==", res)
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = rowData.name || "document";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                const newEntry = {
                    user: authCtx.userName || "You",
                    date: new Date().toLocaleString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: true,
                    }),
                }; setRecords((prev) =>
                    prev.map((record, i) =>
                        i === index
                            ? {
                                ...record,
                                downloadHistory: [newEntry, ...record.downloadHistory],  // ? new array
                            }
                            : record
                    )
                );

                const now = new Date();
                const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
                await post(api + "/downloadHistory/create", {
                    reportDocId: rowData.reportDocId.toString(),
                    userId: authCtx.userId.toString(),
                    time: istDate.toISOString().replace("Z", ""),
                });
            }

        } catch (err) {
            console.error("Download error:", err);
        }
    };
    // -----------------------------------------------------------------------
    // API: FETCH / SAVE COMMENTS
    // -----------------------------------------------------------------------
    const fetchComments = async (index) => {
        const docsId = records[index]?.docsId;
        if (!docsId) return;
        try {
            const res = await get(api + `/comments/getComments/${docsId}`);
            const updated = [...records];
            updated[index].comments = (res || []).map((c) => {
                const dt = new Date(c.createdOn || new Date());
                return {
                    text: c.comments,
                    date:
                        dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
                        ", " + dt.toLocaleTimeString("en-GB", { hour12: true }),
                };
            });
            setRecords(updated);
        } catch (err) {
            console.error("Comment fetch error:", err);
        }
    };

    const saveComment = async () => {
        if (!commentText.trim()) return;
        const docsId = records[commentPopup]?.docsId;
        try {
            const res = await post(api + "/comments/saveComments", {
                docsId,
                comments: commentText,
            });
            const updated = [...records];
            const now = new Date();
            updated[commentPopup].comments.push({
                text: res?.comments || commentText,
                date:
                    now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
                    ", " + now.toLocaleTimeString("en-GB", { hour12: true }),
            });
            setRecords(updated);
            setCommentText("");
        } catch (err) {
            console.error("Save comment error:", err);
        }
    };

    // -----------------------------------------------------------------------
    // LOCAL: DELETE / EDIT / DRAG-DROP
    // -----------------------------------------------------------------------
    const deleteRecord = async (index) => {
        const rowData = records[index];
        try {
            const result = await post(api + "/documentTransaction/deleteFile", {
                reportDocId: rowData.reportDocId
            });

            if (response.ok && result?.status === 1) {
                setRecords((prev) => prev.filter((_, i) => i !== index));
                alert("File deleted successfully!");
            } else {
                alert("Delete failed: ");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("An error occurred while deleting the file.");
        }
    };
const setupEdit = (index) => {
    const rowData = records[index];
    setEditingIndex(index);
    setRemark(rowData.remark || "");
}

    const handleUpdate= async () => {
        if (editingIndex === null) return;

        const rowData = records[editingIndex];

        const updatedPayload = {
            ...rowData,
            remarks: remark
        };

        try {
            setUploading(true);
            const result = await post(api + "/documentTransaction/updateReportDoc", updatedPayload);

            if (response.ok) {
                const updatedRecords = [...records];
                updatedRecords[editingIndex] = {
                    ...result,
                    name: result.fileName,
                    remark: result.remarks,
                    comments: rowData.comments,
                    downloadHistory: rowData.downloadHistory
                };

                setRecords(updatedRecords);
                resetForm();
                setEditingIndex(null);
                alert("Remarks updated  successfully!");
            } else {
                alert("Failed to update");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred during update.");
        } finally {
            setUploading(false);
        }
    };
     const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    };

    // -- pagination ---------------------------------------------------------
    const totalPages = Math.ceil(records.length / recordsPerPage);
    const paginatedRecords = records.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    // -----------------------------------------------------------------------
    // RENDER: document viewer  (FileViewer's logic, DocumentDetail's popup shell)
    // -----------------------------------------------------------------------
    const renderDocViewer = () => {

        // -- LOADING --
        if (viewLoading) {
            return (
                <div style={styles.docPlaceholder}>
                    <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.5 }}>?</div>
                    <div style={styles.docPlaceholderTitle}>Loading preview</div>
                </div>
            );
        }

        const record = records[viewPopup];
        const lowerFile = (record?.name || "").toLowerCase();
        const ext = getFileExtension(record?.name || "");

        // -- FILE TYPE FLAGS  (same as FileViewer) --
        const isPdf = viewMimeType?.includes("pdf") || lowerFile.endsWith(".pdf");
        const isImage = viewMimeType?.startsWith("image/") || /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i.test(lowerFile);
        const isExcel = /\.(xlsx|xls)$/i.test(lowerFile);
        const isCsv = lowerFile.endsWith(".csv");
        const isWord = /\.(doc|docx)$/i.test(lowerFile);
        const isPpt = /\.(ppt|pptx)$/i.test(lowerFile);
        const isOfficeFile = isWord || isPpt;
        const isTextFile = /\.(txt|csv|json)$/i.test(lowerFile);
        const isVideo = viewMimeType?.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(lowerFile);

        // Office Online viewer URL (Word / PPT)
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewBlobUrl || "")}`;

        // no blob yet
        if (!viewBlobUrl) {
            return (
                <div style={styles.docPlaceholder}>
                    <div style={styles.docPlaceholderIcon}><FaFile /></div>
                    <div style={styles.docPlaceholderTitle}>Preview unavailable</div>
                    <div style={styles.docPlaceholderSub}>Could not load the file. Try downloading instead.</div>
                </div>
            );
        }

        // -- PDF --
        if (isPdf) {
            return (
                <iframe
                    src={viewBlobUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px" }}
                    title={record?.name}
                    allow="fullscreen"
                />
            );
        }

        // -- IMAGE --
        if (isImage) {
            return (
                <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "auto",
                }}>
                    <img
                        src={viewBlobUrl}
                        alt={record?.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }}
                    />
                </div>
            );
        }

        // -- EXCEL  (sheet tabs  same as FileViewer) --
        if (isExcel || isCsv) {
            if (sheets.length === 0) {
                return (
                    <div style={styles.docPlaceholder}>
                        <div style={styles.docPlaceholderIcon}><FaFileExcel style={{ color: "#4ade80" }} /></div>
                        <div style={styles.docPlaceholderTitle}>Parsing spreadsheet</div>
                    </div>
                );
            }
            return (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Sheet tab bar */}
                    <div style={{
                        display: "flex",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        overflowX: "auto",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "8px 8px 0 0",
                    }}>
                        {sheets.map((sheet, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveSheet(idx)}
                                style={{
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    fontSize: "13px",
                                    fontWeight: activeSheet === idx ? 700 : 400,
                                    color: activeSheet === idx ? "#fff" : "rgba(255,255,255,0.5)",
                                    borderBottom: activeSheet === idx
                                        ? "3px solid #667eea"
                                        : "3px solid transparent",
                                    transition: "all 0.15s",
                                }}
                            >
                                {sheet.name}
                            </div>
                        ))}
                    </div>
                    {/* Sheet content */}
                    <div
                        className="excel-preview-wrapper"
                        style={{
                            flex: 1,
                            overflow: "auto",
                            background: "#fff",
                            borderRadius: "0 0 10px 10px",
                            padding: "10px",
                        }}
                        dangerouslySetInnerHTML={{ __html: sheets[activeSheet]?.html }}
                    />
                </div>
            );
        }

        // -- WORD / PPT  via Office Online --
        if (isOfficeFile) {
            return (
                <iframe
                    src={officeViewerUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px" }}
                    title={record?.name}
                    allow="fullscreen"
                />
            );
        }

        // -- TEXT / CSV / JSON --
        if (isTextFile) {
            return (
                <iframe
                    src={viewBlobUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px", background: "#fff" }}
                    title={record?.name}
                />
            );
        }

        // -- VIDEO --
        if (isVideo) {
            return (
                <video controls style={{ width: "100%", borderRadius: "10px", maxHeight: "100%" }}>
                    <source src={viewBlobUrl} type={viewMimeType} />
                </video>
            );
        }

        // -- FALLBACK (coloured icon + name) --
        const iconMap = {
            pdf: <FaFile style={{ color: "#f87171" }} />,
            doc: <FaFileWord style={{ color: "#60a5fa" }} />,
            docx: <FaFileWord style={{ color: "#60a5fa" }} />,
            xls: <FaFileExcel style={{ color: "#4ade80" }} />,
            xlsx: <FaFileExcel style={{ color: "#4ade80" }} />,
            ppt: <FaFilePowerpoint style={{ color: "#fb923c" }} />,
            pptx: <FaFilePowerpoint style={{ color: "#fb923c" }} />,
            png: <FaImage style={{ color: "#a78bfa" }} />,
            jpg: <FaImage style={{ color: "#a78bfa" }} />,
            jpeg: <FaImage style={{ color: "#a78bfa" }} />,
            gif: <FaImage style={{ color: "#a78bfa" }} />,
            webp: <FaImage style={{ color: "#a78bfa" }} />,
        };
        return (
            <div style={styles.docPlaceholder}>
                <div style={styles.docPlaceholderIcon}>
                    {iconMap[ext] || <FaFileAlt />}
                </div>
                <div style={styles.docPlaceholderTitle}>{record?.name}</div>
                <div style={styles.docPlaceholderSub}>
                    Preview not available for this file type.<br />
                    Use the Download button to open it locally.
                </div>
            </div>
        );
    };

    // -----------------------------------------------------------------------
    // STYLES  (100 % unchanged from original DocumentDetail)
    // -----------------------------------------------------------------------
    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            marginLeft: 0,
            overflowX: "hidden",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
        },
        body: { padding: "20px 40px 30px 60px", boxSizing: "border-box" },
        backBtn: {
            display: "flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,0.55)", cursor: "pointer",
            fontSize: "13px", padding: "10px 18px", borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)", width: "fit-content",
        },
        container: {
            maxWidth: "1200px", margin: "0 auto",
            marginTop: "-28px", marginLeft: "10%", padding: "26px",
            borderRadius: "18px", background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)",
        },
        title: { color: "#fff", fontWeight: 700, marginBottom: "15px" },
        dropZone: {
            width: "98%",
            border: dragActive ? "2px dashed #667eea" : "2px dashed rgba(255,255,255,0.25)",
            borderRadius: "12px", padding: "20px", textAlign: "center",
            marginBottom: "10px", color: "#aaa", cursor: "pointer",
            transition: "border-color 0.2s", boxSizing: "border-box",
        },
        remarksTextarea: {
            width: "98%", minHeight: "70px", padding: "10px",
            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)", color: "#fff",
            fontSize: "13px", fontFamily: "inherit", resize: "vertical",
            marginBottom: "15px", boxSizing: "border-box", outline: "none",
        },
        uploadActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" },
        tableScrollWrapper: {
            maxHeight: "420px", overflowY: "auto", overflowX: "auto",
            borderRadius: "10px", position: "relative", scrollbarWidth: "thin",
        },
        commentBadge: {
            marginLeft: "6px", fontSize: "10px", padding: "2px 6px",
            borderRadius: "10px", background: "#667eea", color: "#fff",
        },
        // -- overlays --
        popupOverlay: {
            position: "fixed", top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 99999,
        },
        // -- view popup --
        viewPopupBox: {
            width: "min(1100px, 90vw)", height: "min(680px, 88vh)",
            padding: "24px", borderRadius: "18px",
            background: "rgba(15,15,40,0.97)", backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column", gap: "16px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000,
        },
        viewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
        viewTitle: { color: "#fff", fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" },
        viewBody: {
            flex: 1, borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        },
        closeBtn: {
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: "8px", padding: "6px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontFamily: "inherit",
        },
        // -- comment popup --
        commentPopupBox: {
            width: "min(860px, 90vw)", height: "min(520px, 85vh)", padding: "28px",
            borderRadius: "18px", background: "rgba(20,20,50,0.97)",
            backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", gap: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000, overflow: "hidden",
        },
        commentLeft: {
            flex: 1, borderRight: "1px solid rgba(255,255,255,0.15)",
            paddingRight: "20px", display: "flex", flexDirection: "column", overflow: "hidden",
        },
        commentRight: { flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" },
        commentItem: { padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "14px", color: "#ddd" },
        commentDate: { fontSize: "11px", color: "#888", marginTop: "4px" },
        textarea: {
            width: "100%", boxSizing: "border-box", minHeight: "70px", padding: "10px",
            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px",
            resize: "vertical", fontFamily: "inherit", outline: "none",
        },
        // -- history popup --
        historyPopupBox: {
            width: "min(420px, 90vw)", maxHeight: "80vh", padding: "24px",
            borderRadius: "15px", background: "rgba(20,20,50,0.97)",
            backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000,
            display: "flex", flexDirection: "column", gap: "12px",
        },
        historyItem: { padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#ddd", fontSize: "14px" },
        historyDate: { fontSize: "12px", color: "#888" },
        // -- buttons --
        btnPrimary: {
            padding: "8px 16px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
        },
        btnSecondary: {
            padding: "8px 16px", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent", color: "#aaa",
            cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
        },
        // -- placeholder --
        docPlaceholder: {
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "12px", color: "#aaa", textAlign: "center", padding: "40px",
        },
        docPlaceholderIcon: { fontSize: "64px", lineHeight: 1 },
        docPlaceholderTitle: { color: "#fff", fontWeight: 600, fontSize: "18px" },
        docPlaceholderSub: { fontSize: "13px", color: "#888", lineHeight: 1.6 },
    };

    const globalCSS = `
  .table-scroll-wrapper::-webkit-scrollbar        { height: 8px; width: 8px; }
  .table-scroll-wrapper::-webkit-scrollbar-thumb  { background: rgba(255,255,255,0.2); border-radius: 10px; }
  .table-scroll-wrapper::-webkit-scrollbar-track  { background: transparent; }
  .table-scroll-wrapper table thead th {
    position: sticky; top: 0; z-index: 10;
    background: rgba(30,25,65,0.97); backdrop-filter: blur(16px);
  }
  .excel-preview-wrapper table     { border-collapse: collapse; font-size: 12px; }
  .excel-preview-wrapper td,
  .excel-preview-wrapper th        { border: 1px solid #ccc; padding: 4px 8px; white-space: nowrap; }
`;

    // -----------------------------------------------------------------------
    // RENDER
    // -----------------------------------------------------------------------
    return (
        <div style={styles.page}>
            <style>{globalCSS}</style>

            <Navbar
                user={user}
                onLogout={onLogout}
                breadcrumb={["Dashboard", company?.name || "Company", doc?.name || "Document"]}
            />

            <div style={styles.body}>
                <div style={styles.backBtn} onClick={() => history.push("/documents")}>
                    <FaArrowLeft /> Back
                </div>

                <div style={styles.container}>
                    <div style={styles.title}>{doc?.name}</div>

                    {/* -- UPLOAD FORM ---------------------------------------- */}
                    <div
                        style={styles.dropZone}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        {file
                            ? <span style={{ color: "#a5b4fc", fontWeight: 600 }}>?? {file.name}</span>
                            : "Drag & Drop or Click to Upload"
                        }
                        <input
                            id="fileInput" type="file" hidden
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Enter remarks"
                        style={styles.remarksTextarea}
                    />

                    <div style={styles.uploadActions}>
                        <button style={styles.btnSecondary} onClick={() => { resetForm(); setEditingIndex(null); }}>
                            Cancel
                        </button>
                        <button
                            style={{ ...styles.btnPrimary, opacity: uploading ? 0.65 : 1 }}
                            onClick={editingIndex !== null ? handleUpdate : handleSave}
                            disabled={uploading}
                        >
                            {uploading ? "Saving" : editingIndex !== null ? "Update" : "Save"}
                        </button>
                    </div>

                    {/* -- TABLE ---------------------------------------------- */}
                    {loading ? (
                        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "30px 0" }}>
                            Loading documents
                        </div>
                    ) : (
                        <>
                            <div className="table-scroll-wrapper" style={styles.tableScrollWrapper}>
                                <GlassTable
                                    headers={["Doc Name", "Remarks", "View", "Comment", "Download", "History", "Edit", "Delete"]}
                                    rows={paginatedRecords.map((r, i) => {
                                        const ai = (currentPage - 1) * recordsPerPage + i;
                                        return [
                                            <span
                                                title={r.name}
                                                style={{
                                                    color: "#e2e8f0", fontSize: "13px", whiteSpace: "nowrap",
                                                    maxWidth: "220px", overflow: "hidden",
                                                    textOverflow: "ellipsis", display: "inline-block",
                                                }}
                                            >{r.name}</span>,

                                            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>
                                                {r.remark || ""}
                                            </span>,

                                            <FaEye
                                                title="Preview"
                                                style={{ cursor: "pointer", color: "#67e8f9" }}
                                                onClick={() => handleView(ai)}
                                            />,

                                            <div
                                                title="Comments"
                                                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                                onClick={() => { setCommentPopup(ai); setCommentText(""); fetchComments(ai); }}
                                            >
                                                <FaComment />
                                                {r.comments.length > 0 && (
                                                    <span style={styles.commentBadge}>{r.comments.length}</span>
                                                )}
                                            </div>,

                                            <FaDownload
                                                title="Download"
                                                style={{ cursor: "pointer", color: "#a5b4fc" }}
                                                onClick={() => handleDownload(ai)}
                                            />,

                                            <div
                                                title="View Downloaded history"
                                                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                                                onClick={() => {
                                                    setHistoryPopup(ai);
                                                    fetchDownloadHistory(ai);
                                                }}
                                            >
                                                <FaHistory style={{ color: "#facc15" }} />
                                                {r.downloadHistory.length > 0 && (
                                                    <span style={{ ...styles.commentBadge, background: "#facc15", color: "#1a1a2e" }}>
                                                        {r.downloadHistory.length}
                                                    </span>
                                                )}
                                            </div>,

                                            <FaEdit
                                                title="Edit remark"
                                                style={{ cursor: "pointer", color: "#38bdf8" }}
                                                onClick={() => setupEdit(ai)}
                                            />,

                                            <FaTrash
                                                title="Delete"
                                                style={{ cursor: "pointer", color: "#ff6b6b" }}
                                                onClick={() => deleteRecord(ai)}
                                            />,
                                        ];
                                    })}
                                />
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                                    <button style={styles.btnSecondary} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
                                    {[...Array(totalPages)].map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            style={{
                                                ...styles.btnSecondary,
                                                background: currentPage === idx + 1 ? "linear-gradient(135deg, #667eea, #764ba2)" : "transparent",
                                                color: "#fff",
                                            }}
                                        >{idx + 1}</button>
                                    ))}
                                    <button style={styles.btnSecondary} disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* --------------------------------------------------------------
                VIEW DOCUMENT POPUP
                Shell design = original DocumentDetail (100 % unchanged).
                Body content = FileViewer rendering logic (renderDocViewer).
            -------------------------------------------------------------- */}
            {viewPopup !== null && (
                <div style={styles.popupOverlay} onClick={closeViewPopup}>
                    <div style={styles.viewPopupBox} onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div style={styles.viewHeader}>
                            <div style={styles.viewTitle}>
                                <FaEye style={{ color: "#67e8f9" }} />
                                {records[viewPopup]?.name}
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    style={{ ...styles.btnPrimary, display: "flex", alignItems: "center", gap: "8px" }}
                                    onClick={() => { closeViewPopup(); handleDownload(viewPopup); }}
                                >
                                    <FaDownload /> Download
                                </button>
                                <button style={styles.closeBtn} onClick={closeViewPopup}>
                                    <FaTimes /> Close
                                </button>
                            </div>
                        </div>

                        {/* Body  FileViewer rendering logic */}
                        <div style={styles.viewBody}>
                            {renderDocViewer()}
                        </div>

                    </div>
                </div>
            )}

            {/* --------------------------------------------------------------
                COMMENT POPUP  (two-column  unchanged)
            -------------------------------------------------------------- */}
            {commentPopup !== null && (
                <div style={styles.popupOverlay} onClick={() => setCommentPopup(null)}>
                    <div style={styles.commentPopupBox} onClick={(e) => e.stopPropagation()}>

                        <div style={styles.commentLeft}>
                            <div style={{ color: "#fff", marginBottom: "14px", fontWeight: 600, fontSize: "15px", flexShrink: 0 }}>
                                View Comments ({records[commentPopup]?.comments.length ?? 0})
                            </div>
                            <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
                                {records[commentPopup]?.comments.length === 0 ? (
                                    <div style={{ color: "#888", fontSize: "13px", marginTop: "20px", textAlign: "center" }}>No comments yet.</div>
                                ) : (
                                    records[commentPopup].comments.map((c, idx) => (
                                        <div key={idx} style={styles.commentItem}>
                                            {c.text}
                                            <div style={styles.commentDate}>{c.date}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={styles.commentRight}>
                            <div style={{ color: "#fff", fontWeight: 600, fontSize: "15px", flexShrink: 0 }}>Add New Comment</div>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment"
                                style={{ ...styles.textarea, flex: 1 }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
                                <button style={styles.btnSecondary} onClick={() => setCommentPopup(null)}>Close</button>
                                <button style={styles.btnPrimary} onClick={saveComment}>Add</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* --------------------------------------------------------------
                DOWNLOAD HISTORY POPUP  (unchanged)
            -------------------------------------------------------------- */}
            {historyPopup !== null && (
                <div style={styles.popupOverlay} onClick={() => setHistoryPopup(null)}>
                    <div style={styles.historyPopupBox} onClick={(e) => e.stopPropagation()}>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: "15px", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaDownload style={{ color: "#facc15" }} />
                            View Downloaded History ({records[historyPopup]?.downloadHistory.length ?? 0})
                        </div>
                        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
                            {records[historyPopup]?.downloadHistory.length === 0 ? (
                                <div style={{ color: "#888", fontSize: "13px" }}>No downloads yet.</div>
                            ) : (
                                records[historyPopup].downloadHistory.map((h, idx) => (
                                    <div key={idx} style={styles.historyItem}>
                                        <div>{h.user}</div>
                                        <div style={styles.historyDate}>{h.date}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                            <button style={styles.btnSecondary} onClick={() => setHistoryPopup(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
