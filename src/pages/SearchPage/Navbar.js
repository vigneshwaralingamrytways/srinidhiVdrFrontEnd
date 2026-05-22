import { Octagon, User } from "lucide-react";
import { useContext, useState } from "react";
import { FaSignOutAlt, FaKey } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import useFetch from "use-http";
import api from "../../Api";

import { useDispatch } from "react-redux";
import { alertActions } from "../../store/alert-slice";
import CustomModal from "../../Components/SlidingMenu/CustomModal";
import SlidingChangePassword from "../../Components/SlidingMenu/SlidingChangePassword";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function Navbar() {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { post, get, response } = useFetch({ data: [] });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const isAdmin = authCtx.roleId == 1 ? true : false;
  const userName = localStorage.getItem("userName");
  const isTargetSearchPage = location.pathname.includes("search");

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  const handleLogout = async () => {
    if (!isAdmin) {
      const logout = await get(api + '/logout');
      if (response.ok) {
        authCtx.logout();
      }
    } else {
      history.push("/processModule");
    }
    setShowDropdown(false);
  };

  const resetPassword = async (user) => {
    const { oldPassword, newPassword } = user;
    const userId = localStorage.getItem('userId');
    const valuesWithuserId = { password: oldPassword, newPassword: newPassword, userId: userId };

    await post(api + '/reset-password/change_password', valuesWithuserId);
    if (response.ok) {
      setShowChangePasswordModal(false);
      AlertHandler("Password Reset successfully.", "success");
    } else {
      AlertHandler("Password Does Not Match", "danger");
    }
    setShowDropdown(false);
  };

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
      position: "relative",
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
    dropdown: {
      position: "absolute",
      top: "50px",
      right: 0,
      background: "rgba(20, 25, 50, 0.95)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      width: "180px",
      overflow: "hidden",
      zIndex: 101,
    },
    dropdownItem: {
      padding: "12px 16px",
      color: "rgba(255,255,255,0.8)",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      transition: "background 0.2s ease",
    },
    dropdownItemHover: {
      background: "rgba(255,255,255,0.08)",
    }
  };

  return (
    <>
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
          {/* 
            Condition Rule: 
            If Admin OR on Search Page -> Show direct old FaSignOutAlt button.
            Else -> Show standard profile User Icon button with menu dropdown list.
          */}
          {isAdmin  ? (
            <div
              style={styles.iconBtn}
              onClick={handleLogout}
              title={isAdmin ? "Go to Modules" : "Go to Login"}
            >
              <FaSignOutAlt />
            </div>
          ) : (
            <>
              <div
                style={styles.iconBtn}
                onClick={() => setShowDropdown(!showDropdown)}
                title={userName || "User Menu"}
              >
                <User size={20} />
              </div>

              {showDropdown && (
                <div style={styles.dropdown}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => setShowChangePasswordModal(true)}
                    onMouseEnter={(e) => e.currentTarget.style.background = styles.dropdownItemHover.background}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaKey /> Change Password
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={handleLogout}
                    onMouseEnter={(e) => e.currentTarget.style.background = styles.dropdownItemHover.background}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaSignOutAlt /> Logout
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* CHANGE PASSWORD MODAL CONTAINER */}
      <CustomModal
        show={showChangePasswordModal}
        onHide={() => setShowChangePasswordModal(false)}
      >
        <SlidingChangePassword
          onSubmit={resetPassword}
          setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
        />
      </CustomModal>
    </>
  );
}