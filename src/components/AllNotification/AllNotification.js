import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import Topbar from "../Topbar/Topbar";
import LeftArrow from "../../assets/leftArrowIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { URI } from "../../constants";
import { useSelector } from "react-redux";
import { encryptedPayload } from "../commonComponent";
import Loader from "../common/Loader";
import anonuceIcon from "../../assets/announcement 1.svg";
const AllNotification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { customerId } = useSelector((stat) => stat.ChangeState);
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const [selectNotification, setSelectNotification] = useState(
    location.state?.type
  );

  const [notificationList, setNotificationList] = useState([]);
  const [loader, setLoader] = useState(true);

  const handleTransactionTabClick = (tab) => {
    setSelectNotification(tab);
  };

  const getNotification = async (type) => {
    setLoader(true);
    let encryptedRequestBody;

    const requestBody = {
      customerId: customerId,
      alertType: "ALL",
      size: 10,
      notifyTypeId: type === "User messages" ? 1 : 2,
    };
    encryptedRequestBody = encryptedPayload(requestBody);

    await axios
      .post(
        URI.getCustomerAlerts,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          setNotificationList(response.data.data.custAlertDetails);
          setLoader(false);
        } else {
          setNotificationList([]);
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  useEffect(() => {
    getNotification(selectNotification);
  }, []);

  return (
    <div className="dashboard_main_container">
      {/* <SideBar
        setToggle={setToggle}
        toggle={toggle}
        activePage={"allNotifications"}
      /> */}
      <section className=" ms-4 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="me-1">
          <Topbar />
        </header>
        <div
          className="d-flex ms-4"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profiledashboard")}
        >
          {/* <img src={LeftArrow} alt="leftArrow"   />
        <h5 className='ms-3 mt-1' style={{fontSize:"1.6vw"}}>Notification</h5> */}
        </div>
        <div className="d-flex ms-4 w-100">
          <div className="d-flex gap-4 mt-3 ms-4 flex-column w-25">
            <div
              className={` py-2 px-2 selectAlertTab text-start rounded-1 cursorPointer ${
                selectNotification === "User messages"
                  ? "selected_type text-white"
                  : "bg_unselect text-white"
              }`}
              onClick={() => {
                handleTransactionTabClick("User messages");
                getNotification("User messages");
              }}
            >
              <span className="">
                {" "}
                <img src={anonuceIcon} height={20} width={20} alt="icon" />
              </span>
              <span className="ps-2">User messages</span>
            </div>
            <div
              className={`selectAlertTab   px-2 py-2  text-start rounded-1 cursorPointer ${
                selectNotification === "System messages"
                  ? "selected_type text-white"
                  : "bg_unselect text-white"
              }`}
              onClick={() => {
                handleTransactionTabClick("System messages");
                getNotification("systemMessage");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="17"
                height="17"
                className="pb-1"
              >
                <path
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                  fill="#F5F5F5"
                />
              </svg>
              <span className="ps-2">System messages</span>
            </div>
          </div>
          <div className="w-75 me-5 pe-5 mt-2">
            {/* <h4 className="text-start mb-3">Messages</h4> */}
            <div className=" ">
              <div>
                <h4 className="text-start  pb-2 ps-3">{selectNotification}</h4>
              </div>
              <div className=" msg_container rounded-2">
                {loader ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {notificationList.length > 0 ? (
                      <>
                        {notificationList.map((item, index) => {
                          return (
                            <div
                              className={`  ${
                                index === notificationList.length - 1
                                  ? "mb-3"
                                  : ""
                              }`}
                            >
                              <div className="d-flex ps-2 pe-4 w-100">
                                <div className="w-100 ">
                                  <div
                                    className={`d-flex mt-2 ms-2 justify-content-between gap-3 text-start`}
                                  >
                                    <span className="notification_msg ">
                                      {item.alertHeader}
                                    </span>
                                    <span className="opacity-50">
                                      {item.createDate}
                                      {/* <span className="px-1">|</span>
                            <span className="">{item.time}</span> */}
                                    </span>
                                  </div>
                                  <div
                                    className={`mt-2 ms-2 text-start opacity-50`}
                                    style={{
                                      // width: "10rem",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.alertMessage}
                                  </div>
                                </div>
                              </div>
                              <hr
                                className={`${
                                  index === notificationList.length - 1
                                    ? "d-none"
                                    : ""
                                }`}
                              />
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <h4 className="opacity-75"> No record found</h4>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllNotification;
