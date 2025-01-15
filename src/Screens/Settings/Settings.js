import React, { useState } from "react";
import Loader from "../../components/common/Loader";
import Topbar from "../../components/Topbar/Topbar";
import SideBar from "../../components/SideBar/SideBar";
import MyAccount from "./MyAccount/MyAccount";
import Activity from "./Activity/Activity";
import PrivacySecurity from "./Privacy_Security/PrivacySecurity";
import UploadDocument from "./MyAccount/UploadDocument";
import "./settings.css";

const Settings = () => {
  const [toggle, setToggle] = useState(false);
  const [selectedTab, setSelectedTab] = useState("privacyAndsecurity");
  const [linkedTab, setLinkedTab] = useState("bank");
  const [selectWallet, setSelectWallet] = useState(false);
  const [addBank, setAddBank] = useState("");

  const __leftSec = () => {
    return (
      <>
        <div className="settingsleftSec">
          {/* <div
            className={
              selectedTab === "myAccount"
                ? "settingsMyAccount selectedBoxBorder"
                : "settingsMyAccount"
            }
            onClick={() => setSelectedTab("myAccount")}
          >
            <h5>My account</h5>
            <p>Manage bank details</p>
          </div>
          <div
            className={
              selectedTab === "activity"
                ? "settingsMyAccount selectedBoxBorder"
                : "settingsMyAccount"
            }
            onClick={() => setSelectedTab("activity")}
          >
            <h5>Activity</h5>
            <p>View account activity</p>
          </div>
          <div
            className={
              selectedTab === "kycDetail"
                ? "settingsMyAccount selectedBoxBorder"
                : "settingsMyAccount"
            }
            onClick={() => setSelectedTab("kycDetail")}
          >
            <h5>KYC</h5>
            <p>Review KYC details</p>
          </div> */}
          <div
            className={
              selectedTab === "privacyAndsecurity"
                ? "settingsMyAccount selectedBoxBorder"
                : "settingsMyAccount"
            }
            onClick={() => setSelectedTab("privacyAndsecurity")}
          >
            <h5>Privacy & security</h5>
            <p>Password, 2FA and session info</p>
          </div>
        </div>
      </>
    );
  };

  const getCurrentView = () => {
    if (selectedTab === "myAccount") {
      return (
        <MyAccount
          setSelectWallet={setSelectWallet}
          setLinkedTab={setLinkedTab}
          linkedTab={linkedTab}
          selectWallet={selectWallet}
          addBank={addBank}
          setAddBank={setAddBank}
        />
      );
    } else if (selectedTab === "kycDetail") {
      return <UploadDocument />;
    } else if (selectedTab === "activity") {
      return <Activity />;
    } else if (selectedTab === "privacyAndsecurity") {
      return <PrivacySecurity />;
    } else {
      return null;
    }
  };

  const __rightSec = () => {
    return <>{getCurrentView()}</>;
  };

  return (
    <>
      <div
        className={
          toggle
            ? "dashboard_toggle_main_container"
            : "dashboard_profile_container"
        }
      >
        <SideBar
          activePage={"settings"}
          setToggle={setToggle}
          toggle={toggle}
        />
        <div className="ms-3 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
          <div>
            <Topbar />
          </div>

          <article className="spotAsset_main_contentContainer w-100  gap-4 d-flex justify-content-center align-items-center flex-column">
            <div className="accountSection w-100">
              <div className="d-flex flex-row justify-content-between align-items-center px-3 py-3 ">
                <h3 className="pt-1">Settings</h3>
              </div>
              <div className="settingsMainSection d-flex gap-5">
                {__leftSec()}
                {__rightSec()}
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Settings;
