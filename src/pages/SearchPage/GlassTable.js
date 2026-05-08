export default function GlassTable({ headers, rows }) {
  const styles = {
    wrapper: {
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.13)",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow:
        "0 24px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "auto",
    },
    th: {
      padding: "16px 22px",
      textAlign: "left",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.11em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.45)",
      background: "rgba(255,255,255,0.04)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "15px 22px",
      fontSize: "13px",
      color: "rgba(255,255,255,0.82)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      verticalAlign: "middle",
    },
    tdLast: {
      borderBottom: "none",
    },
  };

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ transition: "background 0.15s", cursor: "default" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    ...styles.td,
                    ...(ri === rows.length - 1 ? styles.tdLast : {}),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
