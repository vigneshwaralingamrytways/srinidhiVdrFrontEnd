import { Octagon } from "lucide-react";
import { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

export default function Navbar() {
  const authCtx = useContext(AuthContext)
  const isAdmin = authCtx.roleId == 1 ? true : false
  console.log(" isAdmin", isAdmin, "roleId", authCtx.roleId)
  const history = useHistory();
  const styles = {
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(15,20,40,0.78)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 36px",
      height: "64px",
      fontFamily: "'Segoe UI', 'SF Pro Display', sans-serif",
    },

    left: { display: "flex", alignItems: "center", gap: "22px" },

    logoWrap: { display: "flex", alignItems: "center", gap: "10px" },

    logoIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(102,126,234,0.4)",
    },

    logoText: {
      fontSize: "19px",
      fontWeight: 700,
      color: "#ffffff",
    },

    right: {
      display: "flex",
      alignItems: "center",
    },

    iconBtn: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "rgba(255,255,255,0.75)",
      transition: "all 0.2s ease",
    },
  };

  return (
    <nav style={styles.nav}>
      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <Octagon />
          </div>
          <span style={styles.logoText}>Srinidhi DataRoom</span>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div
          style={styles.iconBtn}
          onClick={() => history.push(isAdmin ? "/processModule" : "/")}
          // ? SAME AS HOME ICON LOGIC
          title={isAdmin ? "Go to Modules" : "Go to Login"}
        >
          <FaSignOutAlt />

        </div>
      </div>
    </nav>
  );
}