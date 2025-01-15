import React, { useEffect, useState } from "react";
import "../../stylesheets/commonstyle.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { encryptedPayload } from "../commonComponent";
import axios from "axios";
import { URI } from "../../constants";
// import diamLogo from "../../assets/Diamex logo white 1.svg";
import diamLogo from "../../assets/chain xchange new.svg";

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

const SideBar = ({ toggle, setToggle, activePage }) => {
  const [subMenu, setSubMenu] = useState(true);
  const [subAssetMenu, setSubAssetMenu] = useState(true);
  const { customerId, userContactNo } = useSelector((stat) => stat.ChangeState);
  const navigate = useNavigate();
  const { isFromDashboard } = useSelector((stat) => stat.ChangeState);

  const returnToHome = async () => {
    let encryptedRequestBody;
    let requestBody = {
      customerId: customerId,
      deviceType: "web",
      phoneNumber: userContactNo,
      countryCode: "US",
    };

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

  useEffect(() => {
    if (
      ["/detailorders", "/spotorders", "/convertHistory"].includes(
        window.location.pathname
      )
    ) {
      setSubMenu(true);
    } else {
      setSubMenu(false);
    }
    if (["/spotAssets", "/fundingAsset"].includes(window.location.pathname)) {
      setSubAssetMenu(true);
    } else {
      setSubAssetMenu(false);
    }
  }, []);

  return (
    <>
      {" "}
      <aside
        className={
          toggle
            ? `dashboard_toggle_main_container d-flex container_bg_color flex-column ${
                isFromDashboard ? "d-none" : ""
              }`
            : `dashboard_sidebar_main_container d-flex  flex-column ${
                isFromDashboard ? "d-none" : ""
              }`
        }
        // onClick={() => setToggle(!toggle)}
      >
        <div className="sidebar_header pt-4">
          <h4 className="px-1 cursor" style={{ fontSize: "1.6vw" }}>
            {toggle ? (
              "DX"
            ) : (
              <img src={diamLogo} alt="img" height={40} width={140} />
            )}
          </h4>
        </div>

        <div className="module_list pt-5">
          <ul className="list-unstyled ">
            <li
              //   className={`d-flex" ${
              //     selectListitem === "home" ? "selected_tab" : "list_name"
              //   }`}
              className={`d-flex menu_item ${toggle && "flex-row gap-5 px-1"} ${
                activePage === "profileDashboard" ? "selected_item" : ""
              }`}
              onClick={() => {
                setSubMenu(false);
                navigate("/profileDashboard");
              }}
            >
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <path
                    d="M1 13C1 11.8447 1 11.267 1.26005 10.8426C1.40556 10.6052 1.6052 10.4056 1.84265 10.26C2.26701 10 2.84467 10 4 10C5.15533 10 5.73299 10 6.15735 10.26C6.3948 10.4056 6.59444 10.6052 6.73995 10.8426C7 11.267 7 11.8447 7 13C7 14.1553 7 14.733 6.73995 15.1574C6.59444 15.3948 6.3948 15.5944 6.15735 15.74C5.73299 16 5.15533 16 4 16C2.84467 16 2.26701 16 1.84265 15.74C1.6052 15.5944 1.40556 15.3948 1.26005 15.1574C1 14.733 1 14.1553 1 13Z"
                    stroke={"#fff"}
                    stroke-width="1.34211"
                  />
                  <path
                    d="M10.0001 13C10.0001 11.8447 10.0001 11.267 10.2602 10.8426C10.4057 10.6052 10.6053 10.4056 10.8428 10.26C11.2671 10 11.8448 10 13.0001 10C14.1555 10 14.7331 10 15.1575 10.26C15.3949 10.4056 15.5946 10.6052 15.7401 10.8426C16.0001 11.267 16.0001 11.8447 16.0001 13C16.0001 14.1553 16.0001 14.733 15.7401 15.1574C15.5946 15.3948 15.3949 15.5944 15.1575 15.74C14.7331 16 14.1555 16 13.0001 16C11.8448 16 11.2671 16 10.8428 15.74C10.6053 15.5944 10.4057 15.3948 10.2602 15.1574C10.0001 14.733 10.0001 14.1553 10.0001 13Z"
                    stroke={"#fff"}
                    stroke-width="1.34211"
                  />
                  <path
                    d="M1 4C1 2.84467 1 2.26701 1.26005 1.84265C1.40556 1.6052 1.6052 1.40556 1.84265 1.26005C2.26701 1 2.84467 1 4 1C5.15533 1 5.73299 1 6.15735 1.26005C6.3948 1.40556 6.59444 1.6052 6.73995 1.84265C7 2.26701 7 2.84467 7 4C7 5.15533 7 5.73299 6.73995 6.15735C6.59444 6.3948 6.3948 6.59444 6.15735 6.73995C5.73299 7 5.15533 7 4 7C2.84467 7 2.26701 7 1.84265 6.73995C1.6052 6.59444 1.40556 6.3948 1.26005 6.15735C1 5.73299 1 5.15533 1 4Z"
                    stroke={"#fff"}
                    stroke-width="1.34211"
                  />
                  <path
                    d="M10.0001 4C10.0001 2.84467 10.0001 2.26701 10.2602 1.84265C10.4057 1.6052 10.6053 1.40556 10.8428 1.26005C11.2671 1 11.8448 1 13.0001 1C14.1555 1 14.7331 1 15.1575 1.26005C15.3949 1.40556 15.5946 1.6052 15.7401 1.84265C16.0001 2.26701 16.0001 2.84467 16.0001 4C16.0001 5.15533 16.0001 5.73299 15.7401 6.15735C15.5946 6.3948 15.3949 6.59444 15.1575 6.73995C14.7331 7 14.1555 7 13.0001 7C11.8448 7 11.2671 7 10.8428 6.73995C10.6053 6.59444 10.4057 6.3948 10.2602 6.15735C10.0001 5.73299 10.0001 5.15533 10.0001 4Z"
                    stroke={"#fff"}
                    stroke-width="1.34211"
                  />
                </svg>
              </span>
              <span className={`${"text-white"} ${toggle ? "d-none" : ""}`}>
                Dashboard
              </span>
            </li>

            <li
              className={`d-flex menu_item ${toggle && "flex-row gap-5  px-1"}`}
              // onClick={() => {
              //   navigate("/orders");
              // }}
              // onClick={() => {
              //   setSubMenu(!subMenu);
              // }}
            >
              <span className="px-2">
                <svg
                  width="19"
                  height="19"
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
              </span>
              <span
                className={` ${toggle ? "d-none" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent
                  setSubAssetMenu(!subAssetMenu);
                  setSubMenu(false);
                }}
              >
                Assets{" "}
                {subAssetMenu ? (
                  <span className="ps-1 up_arrow">{arrowRight}</span>
                ) : (
                  <span className="ps-1 down_arrow">{arrowRight}</span>
                )}
              </span>

              {/* <span  className = "mx-2" onClick={() => setSubMenu(!subMenu)}>--</span> */}
            </li>

            {subAssetMenu ? (
              <>
                <li
                  className={`d-flex ps-4 menu_item ${
                    toggle && "flex-row gap-5 px-1"
                  } ${activePage === "spotAssets" ? "selected_item" : ""}`}
                  onClick={() => {
                    navigate("/spotAssets");
                  }}
                >
                  {/* <span className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                        stroke={
                          activePage === "spotAssets" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                        stroke={
                          activePage === "spotAssets" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 5H10.1998"
                        stroke={
                          activePage === "spotAssets" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 8.2002H6.99979"
                        stroke={
                          activePage === "spotAssets" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span> */}
                  <span
                    className={`ps-2 ${"text-white"} ${toggle ? "d-none" : ""}`}
                    onClick={() => setSubAssetMenu(true)}
                  >
                    Spot
                  </span>
                  {/* <span className="mx-2">--</span> */}
                </li>
                <li
                  className={`d-flex ps-4 menu_item ${
                    toggle && "flex-row gap-5  px-1"
                  } ${activePage === "fundingAsset" ? "selected_item" : ""}`}
                  onClick={() => {
                    navigate("/fundingAsset");
                  }}
                >
                  {/* <span className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                        stroke={
                          activePage === "fundingAsset" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                        stroke={
                          activePage === "fundingAsset" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 5H10.1998"
                        stroke={
                          activePage === "fundingAsset" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 8.2002H6.99979"
                        stroke={
                          activePage === "fundingAsset" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span> */}
                  <span
                    className={`ps-2 ${"text-white"} ${toggle ? "d-none" : ""}`}
                    onClick={() => setSubAssetMenu(true)}
                  >
                    Funding
                  </span>
                </li>
              </>
            ) : (
              <></>
            )}

            <li
              className={`d-flex menu_item ${toggle && "flex-row gap-5  px-1"}`}
              // onClick={() => {
              //   navigate("/orders");
              // }}
              // onClick={() => {
              //   setSubMenu(!subMenu);
              // }}
            >
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                >
                  <path
                    d="M5.52649 13.9735L5.52649 10.3945"
                    stroke={"#fff"}
                    // stroke-opacity="0.7"
                    stroke-width="1.34211"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10 13.9737L10 5.02637"
                    stroke={"#fff"}
                    // stroke-opacity="0.7"
                    stroke-width="1.34211"
                    stroke-linecap="round"
                  />
                  <path
                    d="M14.4735 13.9739L14.4735 8.60547"
                    stroke={"#fff"}
                    // stroke-opacity="0.7"
                    stroke-width="1.34211"
                    stroke-linecap="round"
                  />
                  <path
                    d="M1.5 9.5C1.5 5.49306 1.5 3.48959 2.7448 2.2448C3.98959 1 5.99306 1 10 1C14.0069 1 16.0104 1 17.2552 2.2448C18.5 3.48959 18.5 5.49306 18.5 9.5C18.5 13.5069 18.5 15.5104 17.2552 16.7552C16.0104 18 14.0069 18 10 18C5.99306 18 3.98959 18 2.7448 16.7552C1.5 15.5104 1.5 13.5069 1.5 9.5Z"
                    stroke={"#fff"}
                    // stroke-opacity="0.7"
                    stroke-width="1.34211"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                className={` ${toggle ? "d-none" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent
                  setSubMenu(!subMenu);
                  setSubAssetMenu(false);
                }}
              >
                Orders{" "}
                {subMenu ? (
                  <span className="ps-1 up_arrow">{arrowRight}</span>
                ) : (
                  <span className="ps-1 down_arrow">{arrowRight}</span>
                )}
              </span>

              {/* <span  className = "mx-2" onClick={() => setSubMenu(!subMenu)}>--</span> */}
            </li>

            {subMenu ? (
              <>
                <li
                  className={`d-flex ps-4 menu_item ${
                    toggle && "flex-row gap-5  px-1"
                  }  ${activePage === "spotorders" ? "selected_item" : ""}`}
                  onClick={() => {
                    navigate("/spotorders");
                  }}
                >
                  {/* <span className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                        stroke={
                          activePage === "spotorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                        stroke={
                          activePage === "spotorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 5H10.1998"
                        stroke={
                          activePage === "spotorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 8.2002H6.99979"
                        stroke={
                          activePage === "spotorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span> */}
                  <span
                    className={`ps-2 ${"text-white"} ${toggle ? "d-none" : ""}`}
                    onClick={() => setSubMenu(true)}
                  >
                    Spot Order
                  </span>
                </li>
                <li
                  className={`d-flex ps-4 menu_item ${
                    toggle && "flex-row gap-5 px-1"
                  }  ${activePage === "detailorders" ? "selected_item" : ""}`}
                  onClick={() => {
                    navigate("/detailorders");
                  }}
                >
                  {/* <span className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                        stroke={
                          activePage === "detailorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                        stroke={
                          activePage === "detailorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 5H10.1998"
                        stroke={
                          activePage === "detailorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 8.2002H6.99979"
                        stroke={
                          activePage === "detailorders" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span> */}
                  <span
                    className={` ps-2 ${"text-white"} ${
                      toggle ? "d-none" : ""
                    }`}
                    onClick={() => setSubMenu(true)}
                  >
                    Transaction History
                  </span>
                  {/* <span className="mx-2">--</span> */}
                </li>
                <li
                  className={`d-flex ps-4 menu_item ${
                    toggle && "flex-row gap-5 px-1"
                  }  ${activePage === "convertHistory" ? "selected_item" : ""}`}
                  onClick={() => {
                    navigate("/convertHistory");
                  }}
                >
                  {/* <span className="px-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 18"
                      fill="none"
                    >
                      <path
                        d="M1 7.4C1 4.38301 1 2.87452 1.99584 1.93726C2.99167 1 4.59445 1 7.8 1H8.41818C11.0271 1 12.3316 1 13.2375 1.63827C13.4971 1.82114 13.7275 2.03802 13.9218 2.28231C14.6 3.13494 14.6 4.36269 14.6 6.81818V8.85455C14.6 11.2251 14.6 12.4104 14.2249 13.357C13.6217 14.8789 12.3463 16.0793 10.7293 16.6469C9.7235 17 8.46415 17 5.94545 17C4.5062 17 3.78657 17 3.21182 16.7982C2.28783 16.4739 1.559 15.7879 1.21437 14.9183C1 14.3773 1 13.7 1 12.3455V7.4Z"
                        stroke={
                          activePage === "convertHistory" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.5998 9C14.5998 10.4728 13.4059 11.6667 11.9331 11.6667C11.4005 11.6667 10.7726 11.5733 10.2547 11.7121C9.79458 11.8354 9.43518 12.1948 9.31189 12.6549C9.17313 13.1728 9.26646 13.8007 9.26646 14.3333C9.26646 15.8061 8.07255 17 6.59979 17"
                        stroke={
                          activePage === "convertHistory" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 5H10.1998"
                        stroke={
                          activePage === "convertHistory" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.59979 8.2002H6.99979"
                        stroke={
                          activePage === "convertHistory" ? "#236DFF" : "#fff"
                        }
                        // stroke-opacity="0.7"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span> */}
                  <span
                    className={` ps-2 ${"text-white"} ${
                      toggle ? "d-none" : ""
                    }`}
                    onClick={() => setSubMenu(true)}
                  >
                    Convert History
                  </span>
                  {/* <span className="mx-2">--</span> */}
                </li>
              </>
            ) : (
              <></>
            )}

            <li
              className={`d-flex menu_item ${
                toggle && "flex-row gap-5  px-1"
              }  ${activePage === "buysell" ? "selected_item" : ""}`}
              onClick={() => {
                setSubMenu(false);
                navigate("/buysell");
              }}
            >
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
              </span>
              <span className={`${"text-white"} ${toggle ? "d-none" : ""}`}>
                Buy Sell
              </span>
            </li>

            <li
              className={`d-flex menu_item ${toggle && "flex-row gap-5 px-1"} ${
                activePage === "refer" ? "selected_item" : ""
              }`}
              onClick={() => {
                setSubMenu(false);
                navigate("/refer");
              }}
            >
              <span className="px-2">
                <svg
                  width="13"
                  height="19"
                  viewBox="0 0 13 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4049 15.967H8.98389"
                    stroke="#F5F5F5"
                    stroke-opacity="0.7"
                    stroke-width="1.02631"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.6938 17.6776V14.2566"
                    stroke="#F5F5F5"
                    stroke-opacity="0.7"
                    stroke-width="1.02631"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.98207 8.58613C6.89654 8.57758 6.79391 8.57758 6.69983 8.58613C4.66432 8.51771 3.04788 6.84996 3.04788 4.79734C3.03933 2.70196 4.74129 1 6.83667 1C8.93205 1 10.634 2.70196 10.634 4.79734C10.634 6.84996 9.00903 8.51771 6.98207 8.58613Z"
                    stroke="#F5F5F5"
                    stroke-opacity="0.7"
                    stroke-width="1.02631"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.83713 17.949C5.28056 17.949 3.73255 17.5556 2.55229 16.7687C0.482569 15.3832 0.482569 13.1253 2.55229 11.7484C4.90425 10.1747 8.76146 10.1747 11.1134 11.7484"
                    stroke="#F5F5F5"
                    stroke-opacity="0.7"
                    stroke-width="1.02631"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span className={"text-white"}>Rewards</span>
            </li>
            <li
              className={`d-flex menu_item ${
                toggle && "flex-row gap-5  px-1"
              } ${activePage === "settings" ? "selected_item" : ""}`}
              onClick={() => {
                setSubMenu(false);
                navigate("/settings");
              }}
            >
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <path
                    d="M9.5 11.875C10.8117 11.875 11.875 10.8117 11.875 9.5C11.875 8.18832 10.8117 7.125 9.5 7.125C8.18832 7.125 7.125 8.18832 7.125 9.5C7.125 10.8117 8.18832 11.875 9.5 11.875Z"
                    stroke={"#fff"}
                    stroke-width="1.2312"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1.5838 10.197V8.80363C1.5838 7.98029 2.25672 7.29946 3.08797 7.29946C4.52088 7.29946 5.10672 6.28613 4.3863 5.04321C3.97463 4.33071 4.22005 3.40446 4.94047 2.9928L6.31005 2.20905C6.93547 1.83696 7.74297 2.05863 8.11505 2.68405L8.20213 2.83446C8.91463 4.07738 10.0863 4.07738 10.8067 2.83446L10.8938 2.68405C11.2659 2.05863 12.0734 1.83696 12.6988 2.20905L14.0684 2.9928C14.7888 3.40446 15.0342 4.33071 14.6226 5.04321C13.9021 6.28613 14.488 7.29946 15.9209 7.29946C16.7442 7.29946 17.4251 7.97238 17.4251 8.80363V10.197C17.4251 11.0203 16.7521 11.7011 15.9209 11.7011C14.488 11.7011 13.9021 12.7145 14.6226 13.9574C15.0342 14.6778 14.7888 15.5961 14.0684 16.0078L12.6988 16.7915C12.0734 17.1636 11.2659 16.942 10.8938 16.3165L10.8067 16.1661C10.0942 14.9232 8.92255 14.9232 8.20213 16.1661L8.11505 16.3165C7.74297 16.942 6.93547 17.1636 6.31005 16.7915L4.94047 16.0078C4.22005 15.5961 3.97463 14.6699 4.3863 13.9574C5.10672 12.7145 4.52088 11.7011 3.08797 11.7011C2.25672 11.7011 1.5838 11.0203 1.5838 10.197Z"
                    stroke={"#fff"}
                    stroke-width="1.2312"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span className={"text-white"}>Settings</span>
            </li>
            <li
              className={`d-flex menu_item ${toggle && "flex-row gap-5 px-1"} ${
                activePage === "support" ? "selected_item" : ""
              }`}
              onClick={() => {
                setSubMenu(false);
                navigate("/support");
              }}
            >
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M14.1672 15.3583H10.8339L7.12556 17.8249C6.57556 18.1916 5.8339 17.8 5.8339 17.1333V15.3583C3.3339 15.3583 1.66724 13.6916 1.66724 11.1916V6.19157C1.66724 3.69157 3.3339 2.0249 5.8339 2.0249H14.1672C16.6672 2.0249 18.3339 3.69157 18.3339 6.19157V11.1916C18.3339 13.6916 16.6672 15.3583 14.1672 15.3583Z"
                    stroke={"#fff"}
                    stroke-width="1.36364"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.99971 9.46729V9.29232C9.99971 8.72565 10.3497 8.42564 10.6997 8.18397C11.0414 7.95064 11.383 7.65065 11.383 7.10065C11.383 6.33398 10.7664 5.71729 9.99971 5.71729C9.23304 5.71729 8.61639 6.33398 8.61639 7.10065"
                    stroke={"#fff"}
                    stroke-width="1.36364"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.99568 11.4582H10.0032"
                    stroke={"#fff"}
                    stroke-width="1.36364"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span className={"text-white"}>Support</span>
            </li>

            {/* <li className={`d-flex ${toggle && "flex-row gap-5  px-1"}`}>
              <span className="px-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 19 19"
                  fill="none"
                >
                  <path
                    d="M9.5 11.875C10.8117 11.875 11.875 10.8117 11.875 9.5C11.875 8.18832 10.8117 7.125 9.5 7.125C8.18832 7.125 7.125 8.18832 7.125 9.5C7.125 10.8117 8.18832 11.875 9.5 11.875Z"
                    stroke="#fff"
                    stroke-width="1.2312"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1.5838 10.197V8.80363C1.5838 7.98029 2.25672 7.29946 3.08797 7.29946C4.52088 7.29946 5.10672 6.28613 4.3863 5.04321C3.97463 4.33071 4.22005 3.40446 4.94047 2.9928L6.31005 2.20905C6.93547 1.83696 7.74297 2.05863 8.11505 2.68405L8.20213 2.83446C8.91463 4.07738 10.0863 4.07738 10.8067 2.83446L10.8938 2.68405C11.2659 2.05863 12.0734 1.83696 12.6988 2.20905L14.0684 2.9928C14.7888 3.40446 15.0342 4.33071 14.6226 5.04321C13.9021 6.28613 14.488 7.29946 15.9209 7.29946C16.7442 7.29946 17.4251 7.97238 17.4251 8.80363V10.197C17.4251 11.0203 16.7521 11.7011 15.9209 11.7011C14.488 11.7011 13.9021 12.7145 14.6226 13.9574C15.0342 14.6778 14.7888 15.5961 14.0684 16.0078L12.6988 16.7915C12.0734 17.1636 11.2659 16.942 10.8938 16.3165L10.8067 16.1661C10.0942 14.9232 8.92255 14.9232 8.20213 16.1661L8.11505 16.3165C7.74297 16.942 6.93547 17.1636 6.31005 16.7915L4.94047 16.0078C4.22005 15.5961 3.97463 14.6699 4.3863 13.9574C5.10672 12.7145 4.52088 11.7011 3.08797 11.7011C2.25672 11.7011 1.5838 11.0203 1.5838 10.197Z"
                    stroke="#fff"
                    stroke-width="1.2312"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                // className={
                //   "text-white"
                // }
                onClick={returnToHome}
              >
                Logout
              </span>
            </li> */}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
