import React, { useState, useEffect } from "react";
import AdsClickIcon from "@mui/icons-material/AdsClick"; //LINK CLICKS
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner"; //QR CODE SCANS
import AnalyticsCard from "./AnalyticsCard";
import { useAuth } from "../../store/auth";
function Dashboard() {
  const { isLoggedIn } = useAuth();
  const [role, setUserRole] = useState(+localStorage.getItem("roleId"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  useEffect(() => {
    setUserRole(+localStorage.getItem("roleId"));
    setUsername(localStorage.getItem("username"));
  }, [localStorage.getItem("roleId"), localStorage.getItem("username")]);

  return (
    <>
      {isLoggedIn && role === 1 && (
        <div className="dashboard">
          <div className="dashboard-content">
            <h1 className="roboto-light">Hello, {username}!</h1>
            <h2 className="welcome">Welcome to Dashboard.</h2>
            <div className="cards">
              <AnalyticsCard
                icon={<AdsClickIcon style={{ fontSize: "50px" }} />}
                heading="Link Clicks"
                number={1000}
              />
              <AnalyticsCard
                icon={<QrCodeScannerIcon style={{ fontSize: "50px" }} />}
                heading="QR Code Scans"
                number={1000}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
