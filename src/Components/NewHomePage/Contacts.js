import { ChevronRight, ChevronLeft, User } from "lucide-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FaChartLine,
  FaCogs,
  FaIndustry,
  FaKey,
  FaMoneyBill,
  FaPallet,
  FaProjectDiagram,
  FaShippingFast,
  FaShoppingCart,
  FaSignOutAlt,
  FaTasks,
  FaUsers,
  FaWarehouse,
  FaUser,
} from "react-icons/fa";

import { useDispatch } from "react-redux";
import useFetch from "use-http";
import { moduleActions } from "../../store/module-slice";
import CustomModal from "../SlidingMenu/CustomModal";
import SlidingChangePassword from "../SlidingMenu/SlidingChangePassword";
import Spinner from "../loader/Spinner";
import styles from "./Contact.module.css";
import AuthContext from "../../store/auth-context";
import { alertActions } from "../../store/alert-slice";
import api from "../../Api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

/* ICON MAP */
const keywordIcons = {
  customer: FaUser,
  relationship: FaUsers,
  crm: FaUsers,
  produce: FaPallet,
  production: FaIndustry,
  plan: FaProjectDiagram,
  supply: FaWarehouse,
  inventory: FaWarehouse,
  order: FaShoppingCart,
  finance: FaMoneyBill,
  financial: FaMoneyBill,
  sales: FaChartLine,
  task: FaTasks,
  workflow: FaCogs,
  logistics: FaShippingFast,
};

function Contacts() {
  // ? ALL HOOKS AT TOP LEVEL - NO CONDITIONS
  const dispatch = useDispatch();
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { post, get, response } = useFetch({ data: [] });

  // ALL STATE HOOKS
  const [waiting, setWaiting] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [openContact, setOpenContact] = useState(null);
  const [mobileStep, setMobileStep] = useState("process");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activityList, setActivityList] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // User data
  const role = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // ALL EFFECTS AND CALLBACKS
  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  const loadInitialData = useCallback(async () => {
    if (!role || !userId) return; // Skip if not authenticated

    // const features = await post(api + "/activityMaster/loadProcess", {
    //   roleId: role,
    //   userId: userId,
    // });

    // const initialModule = await post(api + "/loadMenu/loadModules",{"roleId":role});
    //   console.log(" modules",initialModule)
    //   console.table(initialModule)
    // if (response.ok && Array.isArray(features)) {
    //   const processMap = {};
    //   features.forEach((item) => {
    //     const processName = item?.process?.processName?.toUpperCase();
    //     if (!processMap[processName]) {
    //       processMap[processName] = [];
    //     }
    //     processMap[processName].push({
    //       title: item?.functionName?.toUpperCase(),
    //       moduleId: item.functionId,
    //       processId: item.processId,
    //       processName,
    //       icon: getIconForProcess(item.functionName),
    //     });
    //   });

    //   const menus = Object.entries(processMap).map(([title, items]) => ({
    //     title,
    //     items,
    //     icon: getIconForProcess(title),
    //   }));
    //   setMenuItems(menus);
    // }
    setWaiting(true);
    const process = await get(api + "/processMaster/getAllProcess");
    console.table(process)
    if (response.ok && Array.isArray(process)) {
      const menus = process.map((item) => ({
        title: (item.processName || item.process?.processName)?.toUpperCase(),
        processId: item.processId || item.process?.processId,
        processPath: item.processPath || item.process?.processPath,
        icon: getIconForProcess(item.processName || item.process?.processName || ""),
      }));
      console.log("menus", menus)
      setMenuItems(menus);
    }
    setWaiting(false);
  }, [post, response, role, userId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  useEffect(() => {
    dispatch(
      moduleActions.selectModuleId({
        moduleId: ""
      })
    );
  }, []);
  useEffect(() => {
    loadInitialData();
  }, []);
  // Route check AFTER all hooks
  const currentPath = history.location.pathname;
  const isMainPage = currentPath === "/" || currentPath === "/login" || currentPath === "/main";

  // Early return AFTER all hooks
  if (isMainPage) {
    return (
      <div className={styles.page}>
        <div className={styles.headerInfo}>
          <div className={styles.companySection}>
            <div className={styles.companyName}>
              RYTWAYS SOFTWARE TECHNOLOGIES PVT LTD
            </div>
            <div className={styles.userInfo}>{userName || "User"}</div>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions (no hooks)
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
    await get(api + "/logout");
    if (response.ok) authCtx.logout();
  };

  function getIconForProcess(name = "") {
    const lower = name.toLowerCase();
    for (const [keyword, Icon] of Object.entries(keywordIcons)) {
      if (lower.includes(keyword)) return Icon;
    }
    return FaCogs;
  }
  const toggleSubmenu = async (process) => {
    const processId = process.processId;
    setWaiting(true);

    const activities = await get(api + "/activityMaster/getByProcessId/" + processId);
    console.table(activities)
    if (response.ok && Array.isArray(activities) && activities.length > 0) {
      setOpenContact(process);
      setActivityList(activities);

      if (isMobile) {
        setMobileStep("activities");
      } else {
        const firstActivity = activities[0];
        const navigatePath =
          firstActivity?.devPath ||
          firstActivity?.activityPath ||
          firstActivity?.actvityPath ||
          firstActivity?.path;

        if (navigatePath) {
          dispatch(
            moduleActions.selectModuleId({
              moduleId: process.processId,
              processId: process.processId,
              activityId: firstActivity.activityId,
              activityTittle: firstActivity.activityName,
              processTittle: process.title,
            })
          );
          history.push(navigatePath);
        } else {
          AlertHandler("Navigation Path Not Found for the first activity", "danger");
        }
      }
    } else {
      const processNavigatePath = process.processPath;

      if (processNavigatePath) {
        dispatch(
          moduleActions.selectModuleId({
            moduleId: "",
            processId: process.processId,
            processTittle: process.title,
            activityId: "",
          })
        );
        history.push(processNavigatePath);
      } else {
        AlertHandler("No  process path found", "danger");
      }

      setOpenContact(null);
      setActivityList([]);
    }
    setWaiting(false);
  };

  const handleActivityClick = (activity) => {
    const navigatePath =
      activity?.devPath ||
      activity?.activityPath ||
      activity?.actvityPath ||
      activity?.path;

    if (!navigatePath) {
      AlertHandler("Navigation Path Not Found", "danger");
      return;
    }

    dispatch(
      moduleActions.selectModuleId({
        moduleId: openContact?.processId,
        processId: openContact?.processId,
        activityId: activity?.activityId,
        activityTittle: activity?.activityName,
        processTittle: openContact?.title,
      })
    );

    history.push(navigatePath);
  };

  return (
    <div className={styles.page}>
      {waiting && <Spinner />}

      {/* HEADER */}
      <div className={styles.headerInfo}>
        <div className={styles.companySection}>
          <div className={styles.companyName}>
            RYTWAYS SOFTWARE TECHNOLOGIES PVT LTD
          </div>
          <div className={styles.userInfo}>{userName}</div>
        </div>
      </div>

      <div className={styles.wrapper}>
        {/* PROCESS LIST */}
        {(!isMobile || mobileStep === "process") && (
          <div className={styles.container}>
            <h2 className={styles.heading}>ORGANIZATION PROCESS</h2>
            <table className={styles.table}>
              <tbody>
                {menuItems.map((process) => {
                  const IconComponent = process.icon;
                  return (
                    <tr
                      key={process.title}
                      className={styles.row}
                      onClick={() => toggleSubmenu(process)}
                    >
                      <td className={styles.avatarCell}>
                        <IconComponent className={styles.avatar} />
                      </td>
                      <td className={styles.nameCell}>
                        <strong>{process.title}</strong>
                      </td>
                      <td className={styles.actions}>
                        <ChevronRight />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}


        {/* MOBILE ACTIVITY LIST */}
        {isMobile && mobileStep === "activities" && (
          <div className={styles.submenu}>
            <button
              className={styles.backBtn}
              onClick={() => setMobileStep("process")}
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className={styles.heading}>ACTIVITIES</h3>
            <div className={styles.buttonGroup}>
              {activityList.map((a) => (
                <button
                  key={a.activityId}
                  className={styles.actionBtn}
                  onClick={() => handleActivityClick(a)}
                >
                  <FaTasks size={20} />
                  {a.activityName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* USER DROPDOWN */}
        <div className={styles.logoutWrapper}>
          <User size={22} onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div className={styles.logoutDropdown}>
              <div
                className={styles.dropdownItem}
                onClick={() => setShowChangePasswordModal(true)}
              >
                <FaKey /> Change Password
              </div>
              <div className={styles.dropdownItem} onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>

        {/* CHANGE PASSWORD MODAL */}
        <CustomModal
          show={showChangePasswordModal}
          onHide={() => setShowChangePasswordModal(false)}
        >
          <SlidingChangePassword
            onSubmit={() => { }}
            setShowChangePasswordModal={() => setShowChangePasswordModal(false)}
          />
        </CustomModal>
      </div>
    </div>
  );
}

export default Contacts;
