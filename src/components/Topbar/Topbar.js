import React, { useState, useEffect } from "react";
import darkTheme from "../../assets/darkTheme.svg";
import SearchIconCircle from "../../assets/searchIconCircle.svg";
import NotificationBell from "../../assets/NotificationBell.svg";
import profileSvg from "../../assets/profile_icon.svg";
import { useNavigate } from "react-router-dom";
import NavComponent from "../NavComponent/NavComponent";
import axios from "axios";
import { encryptedPayload } from "../commonComponent";
import { URI } from "../../constants";
import { useSelector } from "react-redux";
import anonuceIcon from "../../assets/announcement 1.svg";

const arrowRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 6 10"
    fill="none"
  >
    <path
      opacity="0.8"
      d="M0.180716 8.86667L3.90303 5L0.180716 1.13333C0.0634465 1.0072 -0.00144246 0.838275 2.43364e-05 0.662932C0.00149113 0.48759 0.0691962 0.319861 0.188558 0.19587C0.307919 0.0718798 0.469386 0.00154896 0.638182 2.52803e-05C0.806978 -0.0014984 0.969597 0.0659071 1.09101 0.187724L5.26655 4.52519C5.32668 4.58739 5.37427 4.66142 5.40655 4.74294C5.43882 4.82446 5.45513 4.91185 5.45453 5C5.45496 5.08812 5.43856 5.17545 5.4063 5.25695C5.37403 5.33845 5.32653 5.4125 5.26655 5.47481L1.09101 9.81228C0.969597 9.93409 0.806978 10.0015 0.638182 9.99998C0.469386 9.99845 0.307919 9.92812 0.188558 9.80413C0.0691962 9.68014 0.00149113 9.51241 2.43364e-05 9.33707C-0.00144246 9.16173 0.0634465 8.9928 0.180716 8.86667Z"
      fill="#FFFFFF"
      fill-opacity="0.7"
    />
  </svg>
);

const Topbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [subMenu, setSubMenu] = useState(false);

  const navigate = useNavigate();
  const { customerId, userContactNo, email_id } = useSelector(
    (stat) => stat.ChangeState
  );

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("accessToken");
    return Boolean(token);
  };

  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".notification-dropdown")) {
        // Click outside the notification dropdown
        setShowNotification(false);
        isShowDropdown && setIsShowDropdown(false);
      }
      if (!e.target.closest(".profile_dropdown")) {
        setIsShowDropdown(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      // Cleanup the event listener
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const __readNotification = (item, isRead) => {
    // Implement your read notification logic here
  };

  const __getNotiView = (item) => {
    return (
      <li
        className="py-1 mb-1"
        key={item.alertId}
        onClick={(e) => {
          e.stopPropagation();
          __readNotification(item, item.isRead === 0 ? 1 : 0);
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <div
            className={`dotRead ${item.isRead === 0 ? "mb-4" : "mb-4"}`}
            style={{ width: "4%" }}
          ></div>
          <div>
            <div className="opacity-75 ms-2" style={{ fontSize: "0.9rem" }}>
              {item.message}
            </div>
            <div className="d-flex gap-3">
              <div className="opacity-50 ms-2" style={{ fontSize: "1vw" }}>
                {item.date}
              </div>
              <div className="opacity-50" style={{ fontSize: "1vw" }}>
                {item.time}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  const handleLogout = async () => {
    let encryptedRequestBody;
    let requestBody = {
      customerId: customerId,
      deviceType: "web",
      phoneNumber: userContactNo,
      countryCode: "US",
    };
    console.log(requestBody);
    encryptedRequestBody = encryptedPayload(requestBody);
    await axios
      .post(URI.logoutUser, {
        encryptedRequestBody: encryptedRequestBody,
      })
      .then((response) => {
        if (response.data.status === 200) {
          window.sessionStorage.clear();
          window.history.forward();
          navigate("../");
        }
      });

    // navigate('../creditlink')
  };

  return (
    <div
      className={`d-flex align-items-center justify-content-between ${
        ["/dashboard"].includes(window.location.pathname)
          ? "px-3 mt-1"
          : "px-5 mt-2"
      }`}
      onClick={() => setIsShowDropdown(false)}
    >
      <NavComponent />
      {isLoggedIn ? (
        <div className="d-flex gap-3 justify-content-end me-2">
          <div className="position-relative">
            <img
              alt="U"
              src={profileSvg}
              className="cursor"
              title="Profile"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
                setIsShowDropdown(!isShowDropdown);
              }}
            />
            {isShowDropdown ? (
              <>
                <span className="triangle position-absolute" />
                <div
                  className="profile_dropdown d-flex flex-column py-2"
                  //  className="notification-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ zIndex: "5" }}
                >
                  <h6 className="fw-bold text-start mt-2 px-4">
                    {email_id.slice(0, 2)}***@
                    {email_id.split("@")[1]}
                  </h6>
                  <div className="d-flex justify-content-between pt-2 px-4">
                    <span className="badge rounded-pill bg-success">
                      Verified
                    </span>
                    <span className="badge rounded-pill bg-secondary">
                      Regular user
                    </span>
                  </div>
                  <div className="d-flex flex-column text-start">
                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 mt-2 py-3 menu_item"
                      onClick={() => {
                        setSubMenu(false);
                        navigate("/profileDashboard");
                        setIsShowDropdown(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 17 17"
                        fill="none"
                        className="me-1"
                      >
                        <path
                          d="M1 13C1 11.8447 1 11.267 1.26005 10.8426C1.40556 10.6052 1.6052 10.4056 1.84265 10.26C2.26701 10 2.84467 10 4 10C5.15533 10 5.73299 10 6.15735 10.26C6.3948 10.4056 6.59444 10.6052 6.73995 10.8426C7 11.267 7 11.8447 7 13C7 14.1553 7 14.733 6.73995 15.1574C6.59444 15.3948 6.3948 15.5944 6.15735 15.74C5.73299 16 5.15533 16 4 16C2.84467 16 2.26701 16 1.84265 15.74C1.6052 15.5944 1.40556 15.3948 1.26005 15.1574C1 14.733 1 14.1553 1 13Z"
                          stroke={"#fff"}
                          strokeWidth="1.34211"
                        />
                        <path
                          d="M10.0001 13C10.0001 11.8447 10.0001 11.267 10.2602 10.8426C10.4057 10.6052 10.6053 10.4056 10.8428 10.26C11.2671 10 11.8448 10 13.0001 10C14.1555 10 14.7331 10 15.1575 10.26C15.3949 10.4056 15.5946 10.6052 15.7401 10.8426C16.0001 11.267 16.0001 11.8447 16.0001 13C16.0001 14.1553 16.0001 14.733 15.7401 15.1574C15.5946 15.3948 15.3949 15.5944 15.1575 15.74C14.7331 16 14.1555 16 13.0001 16C11.8448 16 11.2671 16 10.8428 15.74C10.6053 15.5944 10.4057 15.3948 10.2602 15.1574C10.0001 14.733 10.0001 14.1553 10.0001 13Z"
                          stroke={"#fff"}
                          strokeWidth="1.34211"
                        />
                        <path
                          d="M1 4C1 2.84467 1 2.26701 1.26005 1.84265C1.40556 1.6052 1.6052 1.40556 1.84265 1.26005C2.26701 1 2.84467 1 4 1C5.15533 1 5.73299 1 6.15735 1.26005C6.3948 1.40556 6.59444 1.6052 6.73995 1.84265C7 2.26701 7 2.84467 7 4C7 5.15533 7 5.73299 6.73995 6.15735C6.59444 6.3948 6.3948 6.59444 6.15735 6.73995C5.73299 7 5.15533 7 4 7C2.84467 7 2.26701 7 1.84265 6.73995C1.6052 6.59444 1.40556 6.3948 1.26005 6.15735C1 5.73299 1 5.15533 1 4Z"
                          stroke={"#fff"}
                          strokeWidth="1.34211"
                        />
                        <path
                          d="M10.0001 4C10.0001 2.84467 10.0001 2.26701 10.2602 1.84265C10.4057 1.6052 10.6053 1.40556 10.8428 1.26005C11.2671 1 11.8448 1 13.0001 1C14.1555 1 14.7331 1 15.1575 1.26005C15.3949 1.40556 15.5946 1.6052 15.7401 1.84265C16.0001 2.26701 16.0001 2.84467 16.0001 4C16.0001 5.15533 16.0001 5.73299 15.7401 6.15735C15.5946 6.3948 15.3949 6.59444 15.1575 6.73995C14.7331 7 14.1555 7 13.0001 7C11.8448 7 11.2671 7 10.8428 6.73995C10.6053 6.59444 10.4057 6.3948 10.2602 6.15735C10.0001 5.73299 10.0001 5.15533 10.0001 4Z"
                          stroke={"#fff"}
                          strokeWidth="1.34211"
                        />
                      </svg>{" "}
                      Dashboard
                    </button>
                    {/* <button
                    type="button"
                    className="bg-transparent border-0 text-start text-white px-3 my-2"
                  >
                    <svg
                      width="15"
                      height="15"
                      className="me-1"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 9.97561C1 5.74447 1 3.6289 2.31445 2.31445C3.6289 1 5.74447 1 9.97561 1C14.2068 1 16.3223 1 17.6368 2.31445C18.9512 3.6289 18.9512 5.74447 18.9512 9.97561C18.9512 14.2068 18.9512 16.3223 17.6368 17.6368C16.3223 18.9512 14.2068 18.9512 9.97561 18.9512C5.74447 18.9512 3.6289 18.9512 2.31445 17.6368C1 16.3223 1 14.2068 1 9.97561Z"
                        stroke="white"
                        strokeWidth="1.4172"
                      />
                      <path
                        d="M5.72388 14.7C7.92687 12.3926 12.0004 12.284 14.2271 14.7M12.3328 7.61396C12.3328 8.91845 11.2738 9.97596 9.96748 9.97596C8.66112 9.97596 7.60211 8.91845 7.60211 7.61396C7.60211 6.30946 8.66112 5.25195 9.96748 5.25195C11.2738 5.25195 12.3328 6.30946 12.3328 7.61396Z"
                        stroke="white"
                        strokeWidth="1.4172"
                        stroke-linecap="round"
                      />
                    </svg>{" "}
                    Profile
                  </button> */}

                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 9.5C1 5.49306 1 3.48959 2.2448 2.2448C3.48959 1 5.49306 1 9.5 1C13.5069 1 15.5104 1 16.7552 2.2448C18 3.48959 18 5.49306 18 9.5C18 13.5069 18 15.5104 16.7552 16.7552C15.5104 18 13.5069 18 9.5 18C5.49306 18 3.48959 18 2.2448 16.7552C1 15.5104 1 13.5069 1 9.5Z"
                          stroke="#F5F5F5"
                          stroke-opacity="0.7"
                          stroke-width="1.34211"
                          stroke-linejoin="round"
                        />
                        <circle
                          cx="9.5"
                          cy="9.5"
                          r="2.83"
                          stroke="#F5F5F5"
                          stroke-opacity="0.7"
                          stroke-width="1.34"
                        />
                      </svg>
                      <span
                        className="px-2"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent
                          navigate("/spotAssets");

                          // setSubAssetMenu(!subAssetMenu);
                        }}
                      >
                        Assets
                        {/* {subAssetMenu ? (
                          <span className="ps-1 up_arrow">{arrowRight}</span>
                        ) : (
                          <span className="ps-1 down_arrow">{arrowRight}</span>
                        )}  */}
                      </span>
                    </button>
                    {/* {subAssetMenu ? (
                      <>
                        <button
                          type="button"
                          className="ps-4 bg-transparent border-0 text-start text-white px-3 my-2 "
                          onClick={() => {
                            navigate("/spotAssets");
                            setIsShowDropdown(false);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 20 19"
                            fill="none"
                            className="me-2"
                          >
                            <path
                              d="M5.52649 13.9735L5.52649 10.3945"
                              stroke={"#fff"}
                              strokeWidth="1.34211"
                              stroke-linecap="round"
                            />
                            <path
                              d="M10 13.9737L10 5.02637"
                              stroke={"#fff"}
                              strokeWidth="1.34211"
                              stroke-linecap="round"
                            />
                            <path
                              d="M14.4735 13.9739L14.4735 8.60547"
                              stroke={"#fff"}
                              strokeWidth="1.34211"
                              stroke-linecap="round"
                            />
                            <path
                              d="M1.5 9.5C1.5 5.49306 1.5 3.48959 2.7448 2.2448C3.98959 1 5.99306 1 10 1C14.0069 1 16.0104 1 17.2552 2.2448C18.5 3.48959 18.5 5.49306 18.5 9.5C18.5 13.5069 18.5 15.5104 17.2552 16.7552C16.0104 18 14.0069 18 10 18C5.99306 18 3.98959 18 2.7448 16.7552C1.5 15.5104 1.5 13.5069 1.5 9.5Z"
                              stroke={"#fff"}
                              strokeWidth="1.34211"
                              stroke-linejoin="round"
                            />
                          </svg>
                          Spot
                        </button>
                        <button
                          type="button"
                          className="ps-4 bg-transparent border-0 text-start text-white px-0 my-2 "
                          onClick={() => {
                            navigate("/fundingAsset");
                            setIsShowDropdown(false);
                          }}
                        >
                    
                          Funding
                        </button>
                      </>
                    ) : null} */}

                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        className="me-1"
                        viewBox="0 0 20 19"
                        fill="none"
                      >
                        <path
                          d="M5.52649 13.9735L5.52649 10.3945"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          strokeWidth="1.34211"
                          stroke-linecap="round"
                        />
                        <path
                          d="M10 13.9737L10 5.02637"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          strokeWidth="1.34211"
                          stroke-linecap="round"
                        />
                        <path
                          d="M14.4735 13.9739L14.4735 8.60547"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          strokeWidth="1.34211"
                          stroke-linecap="round"
                        />
                        <path
                          d="M1.5 9.5C1.5 5.49306 1.5 3.48959 2.7448 2.2448C3.98959 1 5.99306 1 10 1C14.0069 1 16.0104 1 17.2552 2.2448C18.5 3.48959 18.5 5.49306 18.5 9.5C18.5 13.5069 18.5 15.5104 17.2552 16.7552C16.0104 18 14.0069 18 10 18C5.99306 18 3.98959 18 2.7448 16.7552C1.5 15.5104 1.5 13.5069 1.5 9.5Z"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          strokeWidth="1.34211"
                          stroke-linejoin="round"
                        />
                      </svg>{" "}
                      <span
                        onClick={(e) => {
                          // e.stopPropagation();
                          // setSubMenu(!subMenu);
                          navigate("/spotorders");
                        }}
                      >
                        Orders{" "}
                        {/* {subMenu ? (
                          <span className="ps-1 up_arrow">{arrowRight}</span>
                        ) : (
                          <span className="ps-1 down_arrow">{arrowRight}</span>
                        )} */}
                      </span>
                    </button>

                    {/* {subMenu ? (
                      <>
                        <button
                          type="button"
                          className="ps-4  bg-transparent border-0 text-start text-white px-3 my-2"
                          onClick={() => {
                            navigate("/spotorders");
                            setIsShowDropdown(false);
                          }}
                        >
                       
                          Spot Order
                        </button>
                        <button
                          type="button"
                          className="ps-4 bg-transparent border-0 text-start text-white px-3 my-2 "
                          onClick={() => {
                            navigate("/detailorders");
                            setIsShowDropdown(false);
                          }}
                        >
                       
                          Transaction history
                        </button>

                        <button
                          type=" button"
                          className="ps-4 bg-transparent border-0 text-start text-white px-3 my-2 "
                          onClick={() => {
                            navigate("/convertHistory");
                            setIsShowDropdown(false);
                          }}
                        >
                    
                          Convert History
                        </button>
                      </>
                    ) : null} */}

                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                      onClick={() => {
                        navigate("/buysell");
                        setIsShowDropdown(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 18"
                        fill="none"
                      >
                        <path
                          d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          stroke-width="1.2"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.59979 5H10.1998"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.59979 8.2002H6.99979"
                          stroke={"#fff"}
                          // stroke-opacity="0.7"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="ps-2">Buy Sell</span>
                    </button>

                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                      onClick={() => {
                        navigate("/refer");
                        setIsShowDropdown(false);
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        className="me-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M17.8527 18.8179H13.9927"
                            stroke="#FFFFFF"
                            strokeWidth="1.158"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15.9221 20.7472V16.8872"
                            stroke="#FFFFFF"
                            strokeWidth="1.158"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.7339 10.4883C11.6374 10.4786 11.5216 10.4786 11.4154 10.4883C9.11875 10.4111 7.2949 8.52931 7.2949 6.21331C7.28525 3.84906 9.2056 1.92871 11.5698 1.92871C13.9341 1.92871 15.8544 3.84906 15.8544 6.21331C15.8544 8.52931 14.0209 10.4111 11.7339 10.4883Z"
                            stroke="#FFFFFF"
                            strokeWidth="1.158"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.5704 21.0462C9.81408 21.0462 8.06743 20.6023 6.73573 19.7145C4.40043 18.1512 4.40043 15.6036 6.73573 14.05C9.38948 12.2744 13.7416 12.2744 16.3954 14.05"
                            stroke="#FFFFFF"
                            strokeWidth="1.158"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                      </svg>
                      Rewards
                    </button>
                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                      onClick={() => {
                        navigate("/settings");
                        setIsShowDropdown(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        className="me-2"
                        viewBox="0 0 19 19"
                        fill="none"
                      >
                        <path
                          d="M9.5 11.875C10.8117 11.875 11.875 10.8117 11.875 9.5C11.875 8.18832 10.8117 7.125 9.5 7.125C8.18832 7.125 7.125 8.18832 7.125 9.5C7.125 10.8117 8.18832 11.875 9.5 11.875Z"
                          stroke="#fff"
                          strokeWidth="1.2312"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M1.5838 10.197V8.80363C1.5838 7.98029 2.25672 7.29946 3.08797 7.29946C4.52088 7.29946 5.10672 6.28613 4.3863 5.04321C3.97463 4.33071 4.22005 3.40446 4.94047 2.9928L6.31005 2.20905C6.93547 1.83696 7.74297 2.05863 8.11505 2.68405L8.20213 2.83446C8.91463 4.07738 10.0863 4.07738 10.8067 2.83446L10.8938 2.68405C11.2659 2.05863 12.0734 1.83696 12.6988 2.20905L14.0684 2.9928C14.7888 3.40446 15.0342 4.33071 14.6226 5.04321C13.9021 6.28613 14.488 7.29946 15.9209 7.29946C16.7442 7.29946 17.4251 7.97238 17.4251 8.80363V10.197C17.4251 11.0203 16.7521 11.7011 15.9209 11.7011C14.488 11.7011 13.9021 12.7145 14.6226 13.9574C15.0342 14.6778 14.7888 15.5961 14.0684 16.0078L12.6988 16.7915C12.0734 17.1636 11.2659 16.942 10.8938 16.3165L10.8067 16.1661C10.0942 14.9232 8.92255 14.9232 8.20213 16.1661L8.11505 16.3165C7.74297 16.942 6.93547 17.1636 6.31005 16.7915L4.94047 16.0078C4.22005 15.5961 3.97463 14.6699 4.3863 13.9574C5.10672 12.7145 4.52088 11.7011 3.08797 11.7011C2.25672 11.7011 1.5838 11.0203 1.5838 10.197Z"
                          stroke="#fff"
                          strokeWidth="1.2312"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Settings
                    </button>
                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                      onClick={() => {
                        navigate("/support");
                        setIsShowDropdown(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        className="me-2"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M14.1672 15.3583H10.8339L7.12556 17.8249C6.57556 18.1916 5.8339 17.8 5.8339 17.1333V15.3583C3.3339 15.3583 1.66724 13.6916 1.66724 11.1916V6.19157C1.66724 3.69157 3.3339 2.0249 5.8339 2.0249H14.1672C16.6672 2.0249 18.3339 3.69157 18.3339 6.19157V11.1916C18.3339 13.6916 16.6672 15.3583 14.1672 15.3583Z"
                          stroke="#fff"
                          strokeWidth="1.36364"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.99971 9.46729V9.29232C9.99971 8.72565 10.3497 8.42564 10.6997 8.18397C11.0414 7.95064 11.383 7.65065 11.383 7.10065C11.383 6.33398 10.7664 5.71729 9.99971 5.71729C9.23304 5.71729 8.61639 6.33398 8.61639 7.10065"
                          stroke="#fff"
                          strokeWidth="1.36364"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.99568 11.4582H10.0032"
                          stroke="#fff"
                          strokeWidth="1.36364"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Support
                    </button>
                    <hr className="my-0 py-0 mt-1" />
                    <button
                      type="button"
                      className="border-0 text-start text-white px-4 py-3 menu_item"
                      onClick={() => handleLogout()}
                    >
                      <span className="pe-2">
                        {" "}
                        <svg
                          width="14"
                          height="15"
                          viewBox="0 0 14 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.98972 14.1905C5.59441 14.1894 4.23132 13.771 3.07562 12.9892C1.91993 12.2073 1.02445 11.0977 0.504282 9.80302C-0.0158898 8.5083 -0.136986 7.0876 0.156557 5.72352C0.4501 4.35944 1.14487 3.11431 2.15157 2.14816C2.1834 2.11606 2.22127 2.09059 2.26299 2.07321C2.30472 2.05582 2.34947 2.04688 2.39467 2.04688C2.43988 2.04688 2.48463 2.05582 2.52635 2.07321C2.56808 2.09059 2.60595 2.11606 2.63778 2.14816C2.70155 2.21231 2.73735 2.29909 2.73735 2.38955C2.73735 2.48001 2.70155 2.56679 2.63778 2.63094C1.72844 3.50175 1.10054 4.62479 0.834906 5.85549C0.569268 7.0862 0.678051 8.36824 1.14725 9.53659C1.61645 10.7049 2.4246 11.7061 3.46766 12.4113C4.51071 13.1164 5.74095 13.4932 6.99999 13.4932C8.25904 13.4932 9.48927 13.1164 10.5323 12.4113C11.5754 11.7061 12.3835 10.7049 12.8527 9.53659C13.3219 8.36824 13.4307 7.0862 13.1651 5.85549C12.8994 4.62479 12.2715 3.50175 11.3622 2.63094C11.2984 2.56679 11.2626 2.48001 11.2626 2.38955C11.2626 2.29909 11.2984 2.21231 11.3622 2.14816C11.394 2.11606 11.4319 2.09059 11.4736 2.07321C11.5154 2.05582 11.5601 2.04688 11.6053 2.04688C11.6505 2.04688 11.6953 2.05582 11.737 2.07321C11.7787 2.09059 11.8166 2.11606 11.8484 2.14816C12.8564 3.11552 13.5516 4.36253 13.8445 5.72854C14.1374 7.09455 14.0146 8.51698 13.4919 9.81256C12.9692 11.1081 12.0705 12.2175 10.9116 12.9978C9.75273 13.7781 8.38678 14.1935 6.98972 14.1905Z"
                            fill="#F5F5F5"
                          />
                          <path
                            d="M6.98986 7.77939C6.89905 7.77939 6.81196 7.74332 6.74775 7.67911C6.68354 7.61489 6.64746 7.5278 6.64746 7.43699V0.342403C6.64746 0.251592 6.68354 0.164501 6.74775 0.100288C6.81196 0.0360745 6.89905 0 6.98986 0C7.08067 0 7.16777 0.0360745 7.23198 0.100288C7.29619 0.164501 7.33227 0.251592 7.33227 0.342403V7.43699C7.33227 7.5278 7.29619 7.61489 7.23198 7.67911C7.16777 7.74332 7.08067 7.77939 6.98986 7.77939Z"
                            fill="#F5F5F5"
                          />
                        </svg>
                      </span>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
          {/* <img src={darkTheme} alt="dark" /> */}
          <div className="position-relative">
            <img
              title="Notification"
              src={NotificationBell}
              alt="notification"
              className="cursor"
              onClick={(e) => {
                e.stopPropagation();
                setIsShowDropdown(false);
                setShowNotification(!showNotification);
              }}
            />
            {showNotification ? (
              <>
                <span className="triangle position-absolute" />
                <div
                  className="notification-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ zIndex: "5" }}
                >
                  <div className="px-2 py-1">
                    <div className="d-flex justify-content-end align-items-center my-2">
                      {/* <div className="d-flex text_primary_color pb-2 fs-5 ms-3">
                  Notifications
                  <div className="notification_icon__badge ms-1">
                    <span className="notificationCount">2</span>
                  </div>
                </div> */}
                      <span
                        className="viewAllContent d-flex justify-content-center align-items-center py-1 px-3 rounded-4 cursor small"
                        onClick={() =>
                          navigate("/allnotification", {
                            state: { type: "User messages" },
                          })
                        }
                      >
                        View all
                        <span className="ps-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="6"
                            height="10"
                            viewBox="0 0 6 10"
                            fill="none"
                          >
                            <path
                              opacity="0.8"
                              d="M0.180716 8.86667L3.90303 5L0.180716 1.13333C0.0634465 1.0072 -0.00144246 0.838275 2.43364e-05 0.662932C0.00149113 0.48759 0.0691962 0.319861 0.188558 0.19587C0.307919 0.0718798 0.469386 0.00154896 0.638182 2.52803e-05C0.806978 -0.0014984 0.969597 0.0659071 1.09101 0.187724L5.26655 4.52519C5.32668 4.58739 5.37427 4.66142 5.40655 4.74294C5.43882 4.82446 5.45513 4.91185 5.45453 5C5.45496 5.08812 5.43856 5.17545 5.4063 5.25695C5.37403 5.33845 5.32653 5.4125 5.26655 5.47481L1.09101 9.81228C0.969597 9.93409 0.806978 10.0015 0.638182 9.99998C0.469386 9.99845 0.307919 9.92812 0.188558 9.80413C0.0691962 9.68014 0.00149113 9.51241 2.43364e-05 9.33707C-0.00144246 9.16173 0.0634465 8.9928 0.180716 8.86667Z"
                              fill="#F5F5F5"
                              fill-opacity="0.8"
                            />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        borderBottom: "1px solid rgba(245, 245, 245, 0.3)",
                      }}
                    ></div>
                    <div className="mt-1">
                      <div
                        className="d-flex gap-3 system_msgs notificationToptab not mt-2 mb-2 cursor"
                        onClick={() =>
                          navigate("/allnotification", {
                            state: { type: "User messages" },
                          })
                        }
                      >
                        <div className="ps-1">
                          <img
                            src={anonuceIcon}
                            height={25}
                            width={25}
                            alt="img"
                          />
                        </div>
                        <div className="d-flex text-start justify-content-between ">
                          <div className="">
                            <div className="text-white fw-bold">
                              User messages
                              <span className="up_arrow">
                                <svg
                                  className="ms-2"
                                  width="10"
                                  height="18"
                                  viewBox="0 0 12 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.46967 20.5303C5.76256 20.8232 6.23744 20.8232 6.53033 20.5303L11.3033 15.7574C11.5962 15.4645 11.5962 14.9896 11.3033 14.6967C11.0104 14.4038 10.5355 14.4038 10.2426 14.6967L6 18.9393L1.75736 14.6967C1.46447 14.4038 0.989593 14.4038 0.6967 14.6967C0.403806 14.9896 0.403806 15.4645 0.6967 15.7574L5.46967 20.5303ZM5.25 3.27835e-08L5.25 20L6.75 20L6.75 -3.27835e-08L5.25 3.27835e-08Z"
                                    fill="#fab446"
                                  />
                                </svg>
                              </span>
                            </div>
                            {/* <div className="opacity-50 small notification_msg">
                              Deposit, Subscribe and Trade to Share Over $50,000
                              in Rewards & 5.5M USDT in Flexible Trial Funds!
                            </div> */}
                          </div>
                          {/* <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="notification_icon__badge ms-1 rounded-circle position-relative">
                              <span className="notificationCount small position-absolute mx-auto">
                                22
                              </span>
                            </div>
                            <div className="opacity-50 small text-start">
                              10-23-2024
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div
                        className="d-flex gap-3 system_msgs notificationToptab mt-2 mb-2 cursor"
                        onClick={() =>
                          navigate("/allnotification", {
                            state: { type: "System messages" },
                          })
                        }
                      >
                        <div className="ps-1">
                          {" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="22"
                            height="22"
                          >
                            <path
                              d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                              fill="#F5F5F5"
                            />
                          </svg>
                        </div>
                        <div className="d-flex cursor text-start justify-content-between ">
                          <div className="">
                            <div className="text-white fw-bold">
                              System messages
                              <span className="up_arrow">
                                <svg
                                  className="ms-2"
                                  width="10"
                                  height="18"
                                  viewBox="0 0 12 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.46967 20.5303C5.76256 20.8232 6.23744 20.8232 6.53033 20.5303L11.3033 15.7574C11.5962 15.4645 11.5962 14.9896 11.3033 14.6967C11.0104 14.4038 10.5355 14.4038 10.2426 14.6967L6 18.9393L1.75736 14.6967C1.46447 14.4038 0.989593 14.4038 0.6967 14.6967C0.403806 14.9896 0.403806 15.4645 0.6967 15.7574L5.46967 20.5303ZM5.25 3.27835e-08L5.25 20L6.75 20L6.75 -3.27835e-08L5.25 3.27835e-08Z"
                                    fill="#fab446"
                                  />
                                </svg>
                              </span>
                            </div>
                            {/* <div className="opacity-50 small notification_msg">
                              Login attempted from new IP
                            </div> */}
                          </div>
                          {/* <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="notification_icon__badge ms-1 rounded-circle position-relative">
                              <span className="notificationCount small position-absolute">
                                02
                              </span>
                            </div>
                            <div className="opacity-50 small"> 10-23-2024</div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <ul style={{ cursor: "pointer", listStyleType: "none" }}>
              {notificationsData.map((item) => __getNotiView(item))}
            </ul> */}
                </div>
              </>
            ) : null}
          </div>
          <img src={SearchIconCircle} alt="search" className="cursor" />
        </div>
      ) : (
        <div
          // className="button_container d-flex mx-2 gap-2"
          className={`button_container d-flex mx-2 gap-2 ${
            ["/orderbook"].includes(window.location.pathname) ? "d-none" : ""
          }`}
        >
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-4 loginBtnStyle"
            onClick={() =>
              // navigate("../signUp")
              navigate("../", {
                state: {
                  pageName: "signin",
                },
              })
            }
          >
            Log In
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm px-3"
            onClick={() =>
              navigate("../", {
                state: {
                  pageName: "signup",
                },
              })
            }
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar;
