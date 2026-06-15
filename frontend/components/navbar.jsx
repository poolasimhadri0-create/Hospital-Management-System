import React from "react";

function Navbar({ pageLabel, pageIcon, userInitials, isOnlineText }) {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
        <div className="topbar-title" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.15rem" }}>🏥</span>
          MediCore
        </div>
        <div className="topbar-sub" style={{ marginLeft: "0.5rem" }}>
          {pageIcon ? `${pageIcon} ` : ""}
          {pageLabel || "Dashboard"}
        </div>
      </div>

      <div className="topbar-right">
        <span className="topbar-badge">{isOnlineText || "🟢 System Online"}</span>
        <div
          className="avatar"
          title="Logged in user"
          style={{ width: 36, height: 36, fontSize: "0.8rem", background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
        >
          {userInitials || "??"}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

