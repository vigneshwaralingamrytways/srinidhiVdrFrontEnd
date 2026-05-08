import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { api, useFetch } from "../../Components/CommonImports/CommonImports";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { moduleActions } from "../../store/module-slice";

export default function DashboardPage({ user, onLogout, onSelectCompany }) {
  const { post } = useFetch({ data: [] });
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const history = useHistory();
  const loginUserId = parseFloat(localStorage.getItem("userId"));
  const loginUser = parseFloat(localStorage.getItem("roleId"));
  const moduleId = useSelector((state) => state.sideBar.moduleId);

  // ? SAME API AS SEARCH PAGE
  const loadDataRoomList = async () => {
    setLoading(true);
    try {
      const result =
        loginUser === 2
          ? await post(api + "/documentTypeMaster/documentTypeMaster", {
              documentTypeId: null,
            })
          : await post(api + "/docUserMaster/getListByUserId", {
              userId: loginUserId,
              documentTypeId: null,
            });

      if (result && Array.isArray(result)) {
        const formatted =
          loginUser === 2
            ? result.map((item, index) => ({
                sno: index + 1,
                name: item.documentType,
                id: item.documentTypeId,
              }))
            : result.map((item, index) => ({
                sno: index + 1,
                name: item.documentTypeMaster.documentType,
                id: item.documentTypeMaster.documentTypeId,
              }));

        setCompanies(formatted);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("Error fetching data room list:", error);
      setCompanies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDataRoomList();
  }, []);

  const filteredCompanies = companies.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const getMonthLabel = (index) => {
    const d = new Date();
    d.setMonth((d.getMonth() - (index % 4)) % 12);
    return months[((d.getMonth() - (index % 4)) + 12) % 12] + " " + d.getFullYear();
  };

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      marginLeft: "0",
      transition: "margin-left 350ms ease",
      background:
        "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
      fontFamily: "'Segoe UI', 'SF Pro Display', sans-serif",
      position: "relative",
    },
    orb1: {
      position: "fixed",
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(83,52,131,0.28) 0%, transparent 70%)",
      top: "-200px",
      right: "-100px",
      pointerEvents: "none",
      zIndex: 0,
    },
    orb2: {
      position: "fixed",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(15,52,96,0.38) 0%, transparent 70%)",
      bottom: "-100px",
      left: "-80px",
      pointerEvents: "none",
      zIndex: 0,
    },
    body: {
      padding: "40px 40px",
      position: "relative",
      zIndex: 1,
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#fff",
      letterSpacing: "-0.03em",
    },
    badge: {
      padding: "6px 16px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: 600,
      background: "rgba(102,126,234,0.25)",
      color: "#a5b4fc",
      border: "1px solid rgba(102,126,234,0.35)",
      letterSpacing: "0.04em",
    },
    controlsRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "28px",
    },
    searchInput: {
      flex: "0 0 220px",
      padding: "9px 16px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.06)",
      color: "#fff",
      fontSize: "14px",
      outline: "none",
      backdropFilter: "blur(8px)",
      transition: "border-color 0.2s",
    },
    filterSelect: {
      padding: "9px 14px",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.06)",
      color: "#fff",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
      backdropFilter: "blur(8px)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "18px",
    },
    card: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px",
      padding: "22px 22px 18px",
      cursor: "pointer",
      transition: "background 0.2s, border-color 0.2s, transform 0.18s",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      backdropFilter: "blur(12px)",
      minHeight: "140px",
    },
    cardHover: {
      background: "rgba(102,126,234,0.13)",
      border: "1px solid rgba(102,126,234,0.35)",
      transform: "translateY(-3px)",
    },
    cardName: {
      fontSize: "15px",
      fontWeight: 700,
      color: "#fff",
      lineHeight: 1.3,
    },
    cardDesc: {
      fontSize: "13px",
      color: "rgba(255,255,255,0.5)",
      lineHeight: 1.5,
      flex: 1,
    },
    cardDate: {
      fontSize: "12px",
      color: "rgba(255,255,255,0.35)",
      marginTop: "6px",
    },
    emptyState: {
      gridColumn: "1 / -1",
      textAlign: "center",
      color: "rgba(255,255,255,0.35)",
      fontSize: "15px",
      padding: "60px 0",
    },
    skeletonCard: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "22px",
      minHeight: "140px",
      animation: "pulse 1.5s ease-in-out infinite",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .dr-card:hover {
          background: rgba(102,126,234,0.13) !important;
          border-color: rgba(102,126,234,0.35) !important;
          transform: translateY(-3px) !important;
        }
        .search-input:focus {
          border-color: rgba(102,126,234,0.55) !important;
        }
        .filter-select option {
          background: #1a1a2e;
          color: #fff;
        }
        @media (max-width: 1100px) {
          .dr-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 760px) {
          .dr-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .dr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <Navbar
        user={user}
        onLogout={onLogout}
        breadcrumb={["Dashboard", "Data Room"]}
      />

      <div style={styles.body}>
        {/* Header */}
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Data Room</div>
          <span style={styles.badge}>{companies.length} records</span>
        </div>

        {/* Controls */}
        <div style={styles.controlsRow}>
          <input
            className="search-input"
            style={styles.searchInput}
            type="text"
            placeholder="Search Data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            style={styles.filterSelect}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Recent">Recent</option>
          </select>
        </div>

        {/* Card Grid */}
        <div className="dr-grid" style={styles.grid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard} />
            ))
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((item) => (
              <div
                key={item.id}
                className="dr-card"
                style={styles.card}
                onClick={() => {
                  dispatch(
                    moduleActions.selectModuleId({
                      moduleId: moduleId,
                      processTittle: "Digital Repository",
                      activityTittle: item.name,
                    })
                  );
                  history.push({
                    pathname: "/document",
                    state: {
                      company: {
                        id: item.id,
                        name: item.name,
                        industry: item.industry,
                        documents: item.documents,
                      },
                    },
                  });
                }}
              >
                <div style={styles.cardName}>{item.name}</div>
                <div style={styles.cardDesc}>
                  Data room for {item.name} including all documents.
                </div>
                <div style={styles.cardDate}>{getMonthLabel(item.sno)}</div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No Data Found</div>
          )}
        </div>
      </div>
    </div>
  );
}
