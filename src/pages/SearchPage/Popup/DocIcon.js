import { FaFileAlt, FaFileExcel, FaFilePowerpoint, FaFileWord } from "react-icons/fa";

const TYPE_MAP = {
  pdf:  { color: "#ff6b6b", label: "PDF", bg: "rgba(255,107,107,0.15)", border: "rgba(255,107,107,0.3)" },
  xlsx: { color: "#51cf66", label: "XLS", bg: "rgba(81,207,102,0.15)",  border: "rgba(81,207,102,0.3)"  },
  doc:  { color: "#74c0fc", label: "DOC", bg: "rgba(116,192,252,0.15)", border: "rgba(116,192,252,0.3)" },
  pptx: { color: "#ffa94d", label: "PPT", bg: "rgba(255,169,77,0.15)",  border: "rgba(255,169,77,0.3)"  },
};

const DOC_EMOJI = {
  pdf: <FaFileAlt/>, 
  xlsx: <FaFileExcel/>, 
  pptx: <FaFilePowerpoint/>, 
  doc: <FaFileWord/>,
};

export function DocIcon({ type, onClick }) {
  const t = TYPE_MAP[type] || TYPE_MAP.doc;

  const styles = {
    badge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "3px 9px",
      borderRadius: "6px",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.09em",
      color: t.color,
      background: t.bg,
      border: `1px solid ${t.border}`,
      fontFamily: "'Courier New', Courier, monospace",
      userSelect: "none",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.2s ease",
    },
  };

  return (
    <span
      style={styles.badge}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!onClick) return;
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.boxShadow = `0 0 10px ${t.color}`;
      }}
      onMouseLeave={(e) => {
        if (!onClick) return;
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {t.label}
    </span>
  );
}

export function DocEmoji({ type }) {
  return (
    <span style={{ fontSize: 18 }}>
      {DOC_EMOJI[type] || <FaFileAlt/>}
    </span>
  );
}