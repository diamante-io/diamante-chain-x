import React, { useEffect } from "react";
import { useState } from "react";
import { DropdownButton, Dropdown, Modal, Button } from "react-bootstrap";
import "./Deposit.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import QrCode from "../../assets/qr-code (2) 1.svg";
import Topbar from "../Topbar/Topbar";
import axios from "axios";
import { URI } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import "../../stylesheets/commonstyle.css";
import { QRCodeCanvas } from "qrcode.react";
import Loader from "../common/Loader";
import { assetImageMappings, formatNumber } from "../commonComponent";
import crossIcon from "../../assets/crossIconx.svg";

const removeIcon = (
  <FontAwesomeIcon icon={faXmark} width="16" style={{ color: "white" }} />
);

const tick = (
  <FontAwesomeIcon icon={faCheck} width="20" style={{ color: "white" }} />
);

const searchIcon = (
  <FontAwesomeIcon
    icon={faMagnifyingGlass}
    width="18"
    style={{ marginTop: "3px" }}
  />
);

const down = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    width="15"
    height="15"
  >
    <path
      d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
      fill="#FFFFFF"
      fillOpacity="0.6"
    />
  </svg>
);

const up = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    width="15"
    height="15"
    className="upIcon"
  >
    <path
      d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"
      fill="#FFFFFF"
      fillOpacity="0.6"
    />
  </svg>
);

const arrowLeft = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    width="20"
    height="20"
  >
    <path
      d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
  </svg>
);

function Deposit() {
  const tempNetworks = [
    {
      label: "TRX",
      name: "Tron (TRC20)",
      time: "2 mins",
      fee: "1 USDT( ≈ $1)",
    },
    {
      label: "BSC",
      name: "BNB Smart Chain (BEP20)",
      time: "3 mins",
      fee: "0.19 USDT( ≈ $0.19)",
    },
    {
      label: "ETH",
      name: "Ethereum (ERC20)",
      time: "5 mins",
      fee: "7 USDT( ≈ $7)",
    },
    {
      label: "MATIC",
      name: "Polygon",
      time: "8 mins",
      fee: "1 USDT( ≈ $1)",
    },
  ];

  const [toggle, setToggle] = useState(false);
  const [assetCoins, setAssetCoins] = useState([]);
  const [searchCoin, setSearchCoin] = useState("");
  const [showSearchAssetDp, setShowSearchAssetDp] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({
    assetId: "",
    assetName: "",
    assetSymbol: "",
  });
  const [recentAssetCoins, setRecentAssetCoins] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("Select a network");
  // const [selectedNetwork, setSelectedNetwork] = useState({
  //   label: "",
  //   name: "",
  //   time: "",
  //   fee: "",
  // });
  const [showSearchNetworkDp, setShowSearchNetworkDp] = useState(false);
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [apiLoader, setApiLoader] = useState(false);
  const [recentData, setRecentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState({
    date: "",
    depositAmount: "",
    transLedgerId: "",
    depositWallet: "",
    rnum: "",
    address: "",
    network: "",
    transactionHash: "",
    status: "",
    coin: "",
  });

  const navigate = useNavigate();
  const { customerId } = useSelector((stat) => stat.ChangeState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const getAssets = async (searchString, type) => {
    axios
      .get(
        URI.getAssetsBySearch +
          `${searchString !== "" ? `/${searchString}` : ""}`
      )
      .then((response) => {
        if (response.data.status === 200) {
          if (type === "recent") {
            setRecentAssetCoins(response.data.data.assetList);
            setAssetCoins(response.data.data.assetList);
          }
          setAssetCoins(response.data.data.assetList);
          // setSelectedCoin(response.data.data.assetList[0]);
        } else {
          setAssetCoins([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const generateAddress = (asset) => {
    setErrorMsg("");
    setBtnLoader(true);
    setAddress("");
    axios
      .get(
        URI.generateDepositAddress +
          `${customerId}/${asset.assetId}/${
            asset.assetSymbol === "BTC" ? 2 : 1
          }`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          setAddress(response.data.data.address);
          setBtnLoader(false);
          // Temporary
          setErrorMsg(
            response.data.data.address === "" ? "Wallet address not found!" : ""
          );
          setTimeout(() => {
            setErrorMsg("");
          }, 3000);
        } else {
          setErrorMsg(response.data.data.message);
          setTimeout(() => {
            setBtnLoader(false);
            setErrorMsg("");
          }, 3000);
        }
      })
      .catch((error) => {
        setErrorMsg(error.message);
        setBtnLoader(false);
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      });
  };

  const getRecentDeposits = () => {
    setApiLoader(true);

    let requestBody = {
      flagName: "DEPOSIT",
      customerId: customerId,
      pageNo: 1,
      pageSize: 10,
      isDiamUser: 0,
    };

    axios
      .post(URI.getRecent, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setRecentData(response.data.data.recentTransactionDetails);
          setApiLoader(false);
        } else {
          setErrorMsg(response.data.data.message);
          setTimeout(() => {
            setApiLoader(false);
            setErrorMsg("");
          }, 5000);
        }
      })
      .catch((error) => {
        setApiLoader(false);
        console.log(error.message);
      });
  };

  useEffect(() => {
    getAssets("", "recent");
    setNetworks(tempNetworks);
    getRecentDeposits();
  }, []);

  return (
    <div
      className="dashboard_main_container"
      onClick={() => {
        setShowSearchAssetDp(false);
        setShowSearchNetworkDp(false);
      }}
    >
      <section className=" ms-4 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="me-1">
          <Topbar />
        </header>
        <div className="position-relative">
          <div className="position-absolute mt-2 px-4 mx-4">
            <h4>
              <span
                className="me-2 cursorPointer"
                onClick={() => {
                  navigate("/spotAssets");
                }}
              >
                {arrowLeft}
              </span>{" "}
              Deposit
            </h4>
          </div>
          <div className="deposit_container gap-4 pt-3 rounded-2 px-2">
            <div className="d-flex mt-5 justify-content-center rounded-3 deposit_container_one">
              <div className="d-flex mt-5 flex-column" style={{ width: "5%" }}>
                <div className="text-start">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="rounded-circle position-relative outer_circle_send_deposit outer_circle_send_deposit_done small">
                      {/* <span className="position-absolute bg-white rounded-circle inner_circle " /> */}

                      {selectedCoin.assetSymbol === "" ? (
                        <span>1</span>
                      ) : (
                        <span className="fw-bolder">{tick}</span>
                      )}
                    </div>
                    {/* <h6 className="step_header_color ">1</h6> */}
                  </div>
                  <div className="vertical-line_deposit position-relative">
                    <div className=" arrow_icon_spot ms-1 position-absolute"></div>
                  </div>
                </div>
                <div className="text-start">
                  <div className="d-flex gap-2 align-items-start">
                    <div
                      className={`rounded-circle position-relative outer_circle_send_deposit small ${
                        selectedNetwork !== "Select a network" &&
                        "outer_circle_send_deposit_done"
                      }`}
                    >
                      {/* <span className="position-absolute bg-white rounded-circle inner_circle" /> */}
                      {selectedNetwork === "Select a network" ? (
                        <span>2</span>
                      ) : (
                        <span className="fw-bolder">{tick}</span>
                      )}
                    </div>
                    {/* <h6 className="step_header_color">2</h6> */}
                  </div>
                  <div className="vertical-line_deposit position-relative">
                    <div className=" arrow_icon_spot ms-1 position-absolute"></div>
                  </div>
                </div>
                <div className="text-start">
                  <div className="d-flex gap-2 align-items-start">
                    <div
                      // className="rounded-circle position-relative outer_circle_send_deposit small"
                      className={`rounded-circle position-relative outer_circle_send_deposit small ${
                        address !== "" ? "outer_circle_send_deposit_done" : ""
                      }`}
                    >
                      {/* <span className="position-absolute bg-white rounded-circle inner_circle " /> */}
                      <span>3</span>
                    </div>
                    {/* <h6 className="step_header_color">3</h6> */}
                  </div>
                </div>
              </div>

              <div
                className="d-flex mt-5 gap-5 flex-column"
                style={{ width: "85%" }}
              >
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column ms-4">
                    <p className="text-start">Select Coin</p>
                    <div className="position-relative">
                      {selectedCoin.assetSymbol === "" ? (
                        <label
                          htmlFor="selectedCoin"
                          className="mb-1 position-relative w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSearchAssetDp(true);
                          }}
                        >
                          <input
                            id="selectedCoin"
                            type="text"
                            className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100 pe-4"
                            placeholder="Search"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={searchCoin}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^a-zA-Z]/g,
                                ""
                              );
                              setShowSearchAssetDp(true);
                              setSearchCoin(value);
                              // value.length > 0 &&
                              /^[a-zA-Z]+$/.test(value) && getAssets(value, "");
                            }}
                          />
                          <span
                            className="position-absolute text-white mt-2 me-2 end-0 opacity-75"
                            onClick={() => {
                              setSearchCoin("");
                            }}
                          >
                            {searchCoin === "" ? searchIcon : removeIcon}
                          </span>
                        </label>
                      ) : (
                        <div className="mb-1 position-relative w-100">
                          <label
                            htmlFor="selectedCoin"
                            className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100 d-flex gap-2 align-items-center position-relative"
                          >
                            <input
                              type="text"
                              className="d-none"
                              id="selectedCoin"
                            />
                            <img
                              src={assetImageMappings(selectedCoin.assetSymbol)}
                              style={{ height: "1.4vw", width: "1.4vw" }}
                              alt="symbol"
                            />
                            <span>{selectedCoin.assetSymbol}</span>
                            <span className="small opacity-50">
                              {selectedCoin.assetName}
                            </span>
                            <div
                              className="cursorPointer position-absolute text-white mt-1 me-2 end-0 opacity-75"
                              onClick={(e) => {
                                getAssets("", "");
                                setSelectedCoin({
                                  assetId: "",
                                  assetName: "",
                                  assetSymbol: "",
                                });
                                setAddress("");
                                // setSelectedNetwork({
                                //   label: "",
                                //   name: "",
                                //   time: "",
                                //   fee: "",
                                // });
                                setSelectedNetwork("Select a network");
                                setShowSearchAssetDp(true);
                              }}
                            >
                              {removeIcon}
                            </div>
                          </label>
                        </div>
                      )}

                      {showSearchAssetDp && (
                        <div
                          className="position-absolute w-100 common_input_bg  asset_container rounded-2"
                          style={{ zIndex: "1" }}
                        >
                          <div className="text-white opacity-75 border border-1 border-dark">
                            {assetCoins.map((asset) => {
                              return (
                                <div
                                  key={asset.assetSymbol}
                                  className="d-flex gap-2 p-2 cursorPointer asset_item rounded-2 border-bottom border-dark  align-items-center"
                                  onClick={() => {
                                    generateAddress(asset);
                                    setSelectedCoin(asset);
                                    setAssetCoins([]);
                                    setSearchCoin("");
                                    setSelectedNetwork(
                                      asset.assetSymbol === "BTC"
                                        ? "Bitcoin"
                                        : "Ethereum (ERC20)"
                                    );
                                  }}
                                >
                                  <img
                                    src={assetImageMappings(asset.assetSymbol)}
                                    style={{ height: "1.4vw", width: "1.4vw" }}
                                    alt=""
                                  />
                                  <span>{asset.assetSymbol}</span>
                                  <span className="small opacity-50">
                                    {asset.assetName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-3 ms-4 mt-1 flex-wrap">
                    {recentAssetCoins.slice(0, 6).map((asset) => {
                      return (
                        <div
                          key={asset.assetSymbol}
                          className="common_input_bg px-2 py-1 d-flex gap-2 rounded-1 align-items-center cursorPointer"
                          onClick={() => {
                            generateAddress(asset);
                            setSelectedCoin(asset);
                            setAssetCoins([]);
                            setSearchCoin("");
                            setSelectedNetwork(
                              asset.assetSymbol === "BTC"
                                ? "Bitcoin"
                                : "Ethereum (ERC20)"
                            );
                          }}
                        >
                          <img
                            src={assetImageMappings(asset.assetSymbol)}
                            style={{ height: "1.1vw", width: "1.1vw" }}
                            alt="symbol"
                          />
                          <span>{asset.assetSymbol}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="d-flex flex-column">
                  <div className="d-flex flex-column ms-4">
                    <p className="text-start">Select Network</p>
                    <div
                      className="position-relative"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        className={`cursorPointer assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100 d-flex gap-2 align-items-center position-relative ${
                          selectedCoin.assetSymbol === "" && "opacity-50"
                        }`}
                        onClick={() => {
                          if (selectedCoin.assetSymbol !== "") {
                            setShowSearchNetworkDp(!showSearchNetworkDp);
                            setNetworks(tempNetworks);
                          }
                        }}
                        style={{
                          cursor:
                            selectedCoin.assetSymbol === "" && "not-allowed",
                        }}
                      >
                        <>
                          <span className="small opacity-50">
                            {selectedNetwork}
                          </span>
                        </>

                        {/* {selectedNetwork.label === "" ? (
                          <span>Select Network</span>
                        ) : (
                          <>
                            <span>{selectedNetwork.label}</span>
                            <span className="small opacity-50">
                              {selectedNetwork.name}
                            </span>
                          </>
                        )} */}
                        {/* <div className="cursorPointer position-absolute text-white me-2 end-0 opacity-75">
                          {showSearchNetworkDp ? up : down}
                        </div> */}
                      </div>

                      {/* <div
                        className="position-absolute w-100"
                        style={{ backgroundColor: "#000000" }}
                      >
                        {showSearchNetworkDp && (
                          <div className="text-white opacity-75 border border-1 border-dark">
                            {networks?.map((network) => {
                              return (
                                <div
                                  key={network.label}
                                  className="d-flex gap-2 p-2 cursorPointer asset_item rounded-2 border-bottom border-dark  align-items-center"
                                  onClick={() => {
                                    setSelectedNetwork(network);
                                    setNetworks([]);
                                  }}
                                >
                                  <span>{network.label}</span>
                                  <span className="small opacity-50">
                                    {network.name}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column mt-4">
                  <div className="d-flex flex-column ms-4 mt-4">
                    <div className="d-flex justify-content-between pt-4">
                      <p className="text-start pt-1">Deposit Address</p>
                      {/* <p>Manage &gt;</p> */}
                    </div>
                    <ToastContainer
                      position="bottom-right"
                      autoClose={2000}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
                    {selectedNetwork !== "Select a network" && (
                      <>
                        {btnLoader ? (
                          <div>
                            <Loader />
                          </div>
                        ) : (
                          <div className="d-flex justify-content-center gap-2 border border-1 border-dark rounded-1 py-3 px-2">
                            <div className="d-flex align-items-center">
                              <div className="qrCodeCryptoKYC border bg-light m-1 p-1 d-flex align-items-center">
                                <QRCodeCanvas
                                  value={address}
                                  size={120}
                                  bgColor={"#fff"}
                                  fgColor={"#000000"}
                                  level={"H"}
                                  includeMargin={false}
                                  // imageSettings={{
                                  //   src: require("../../assets/qr-code (2) 1.svg"),
                                  //   // src: require("../../assets/black_PIcon.png"),
                                  //   width: 45,
                                  //   height: 45,
                                  // }}
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center w-50">
                              <p className="opacity-50 text-start d-flex align-items-center justify-content-between mx-1">
                                <span>Address</span>
                                <CopyToClipboard
                                  text={address}
                                  onCopy={() => {
                                    address !== "" &&
                                      toast.info("Public address copied");
                                  }}
                                >
                                  <span className=" cursorPointer">
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 34 34"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g id="Frame 313">
                                        <path
                                          id="Vector"
                                          d="M27.5917 2.07676C27.2293 1.71236 26.7983 1.42344 26.3235 1.22672C25.8488 1.03 25.3397 0.929376 24.8258 0.930677H16.733C15.6958 0.931894 14.7015 1.34444 13.9681 2.07781C13.2348 2.81118 12.8222 3.80549 12.821 4.84263V23.62C12.8222 24.6572 13.2348 25.6515 13.9681 26.3849C14.7015 27.1182 15.6958 27.5308 16.733 27.532H29.2512C30.2884 27.5309 31.2828 27.1184 32.0162 26.385C32.7496 25.6516 33.1621 24.6572 33.1632 23.62V9.2688C33.1647 8.75475 33.0642 8.2455 32.8675 7.77059C32.6708 7.29567 32.3817 6.86453 32.0171 6.50217L27.5917 2.07676ZM25.3393 2.55821C25.7724 2.65465 26.1696 2.87123 26.4853 3.1831L30.9108 7.60851C31.2245 7.92306 31.4419 8.32068 31.5374 8.75459H27.6864C27.0641 8.75391 26.4675 8.5064 26.0275 8.06637C25.5875 7.62634 25.3399 7.02972 25.3393 6.40742V2.55821ZM31.5984 23.62C31.5977 24.2423 31.3502 24.839 30.9102 25.279C30.4701 25.719 29.8735 25.9665 29.2512 25.9672H16.733C16.1107 25.9665 15.514 25.719 15.074 25.279C14.634 24.839 14.3865 24.2423 14.3858 23.62V4.84263C14.3865 4.22033 14.634 3.62372 15.074 3.18368C15.514 2.74365 16.1107 2.49614 16.733 2.49546H23.7745V6.40742C23.7756 7.4446 24.1881 8.43899 24.9215 9.17239C25.6549 9.90579 26.6493 10.3183 27.6864 10.3194H31.5984V23.62ZM0.302734 29.8792V11.1018C0.303952 10.0646 0.716495 9.07031 1.44987 8.33694C2.18324 7.60357 3.17755 7.19103 4.21469 7.18981H10.4738V8.75459H4.21469C3.59239 8.75527 2.99577 9.00278 2.55574 9.44282C2.11571 9.88285 1.8682 10.4795 1.86752 11.1018V29.8792C1.8682 30.5015 2.11571 31.0981 2.55574 31.5381C2.99577 31.9782 3.59239 32.2257 4.21469 32.2263H16.733C17.3553 32.2257 17.9519 31.9782 18.3919 31.5381C18.8319 31.0981 19.0795 30.5015 19.0801 29.8792H20.6449C20.6438 30.9163 20.2313 31.9107 19.4979 32.6441C18.7645 33.3775 17.7701 33.79 16.733 33.7911H4.21469C3.17755 33.7899 2.18324 33.3774 1.44987 32.644C0.716495 31.9106 0.303952 30.9163 0.302734 29.8792Z"
                                          fill="white"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                </CopyToClipboard>
                              </p>
                              <p className="overFlowValue">{address || "-"}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div
                    style={{ minHeight: "1rem" }}
                    className="text-center mt-4"
                  >
                    <span className="text-danger">{errorMsg}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column mt-5 px-3 pt-2 rounded-3 me-2 deposit_container_two">
              <div className="d-flex justify-content-between align-items-center w-100 my-3">
                <p className="mb-0 fs-5">Recent Deposits</p>
                <p
                  className="mb-0 p-1 cursorPointer"
                  onClick={() => {
                    navigate("/detailorders");
                  }}
                >
                  More &gt;
                </p>
              </div>
              {recentData.length > 0 ? (
                recentData.map((data) => {
                  return (
                    <div
                      key={data.transLedgerId}
                      className="py-3 cursorPointer recent_data_info_container my-0 rounded-1"
                      onClick={() => {
                        setSelectedData(data);
                        setShowModal(true);
                      }}
                    >
                      <div className="d-flex recent_data_info w-100 align-items-center px-2">
                        <div className="d-flex align-items-center w-25 text-break">
                          <img
                            src={assetImageMappings(data.coin)}
                            style={{ height: "1.2vw", width: "1.2vw" }}
                            alt="symbol"
                            className="me-1"
                          />
                          <span className="ps-1">
                            {formatNumber(data.depositAmount)}&nbsp;{data.coin}
                          </span>
                        </div>
                        <div className="w-25 text-center">
                          <span>{data.depositWallet}</span>
                        </div>
                        <div className="w-25 overFlowValue text-center">
                          {data.network !== null ? (
                            <span>
                              {data.network === 2
                                ? "Bitcoin"
                                : "Ethereum (ERC20)"}
                            </span>
                          ) : (
                            <span className="">-</span>
                          )}
                        </div>

                        <div className="w-25 text-end">
                          <span>{data.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  {apiLoader ? (
                    <>
                      <Loader />
                    </>
                  ) : (
                    <p className="pt-3 text-center">
                      No recent deposit record.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Modal
        show={showModal}
        id="ConvertModal"
        aria-labelledby="example-custom-modal-styling-title"
        className="withdrw_modal"
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Body>
          <div className="modalClass position-relative px-3 py-2">
            <div className="d-flex justify-content-between my-2">
              <h4 className="text-white">Deposit Details</h4>
              <img
                src={crossIcon}
                alt="cross"
                className="ms-1 cursorPointer"
                onClick={() => {
                  setShowModal(false);
                }}
              />
            </div>
            <div
              className="w-100 position-relative rounded-2 p-3"
              style={{ backgroundColor: "#292A2C" }}
            >
              <div className="text-white">
                {recentData?.length > 0 && (
                  <div className="d-flex gap-2 py-2 cursorPointer rounded-2 flex-column">
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Status</span>
                      <span className="firstLetterCapital">
                        {selectedData.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Date</span>
                      <span>{selectedData.date}</span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Coin</span>
                      <span>
                        <img
                          src={assetImageMappings(selectedData.coin)}
                          style={{ height: "1.4vw", width: "1.35vw" }}
                          alt="symbol"
                          className="me-2"
                        />
                        {selectedData.coin}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Deposit amount</span>
                      <span>{formatNumber(selectedData.depositAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Network</span>
                      {/* <span>
                        {selectedData.network === 2
                          ? "Bitcoin"
                          : "Ethereum (ERC20)"}
                      </span> */}
                      {selectedData.network !== null ? (
                        <span>
                          {selectedData.network === 2
                            ? "Bitcoin"
                            : "Ethereum (ERC20)"}
                        </span>
                      ) : (
                        <span className="ps-5">-</span>
                      )}
                    </div>
                    <>
                      {selectedData.diamexId !== null ? (
                        <>
                          <div className="d-flex justify-content-between pb-1 gap-3">
                            <span className="opacity-50">Name</span>
                            <span className="overFlowValue">
                              {selectedData.name || "-"}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pb-1 gap-3">
                            <span className="opacity-50">Email</span>
                            <span className="overFlowValue">
                              {selectedData.emailId || "-"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-between pb-1 gap-3">
                          <span className="opacity-50">Address</span>
                          <span className="overFlowValue">
                            {selectedData.address || "-"}
                          </span>
                        </div>
                      )}
                    </>
                    {selectedData.depositWallet ? (
                      <div className="d-flex justify-content-between pb-1 gap-3">
                        <span className="opacity-50">Withdraw wallet</span>
                        <span>{selectedData.depositWallet}</span>
                      </div>
                    ) : null}
                    {/* <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Address</span>
                      <span className="overFlowValue w-75">
                        {selectedData.address}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Deposit wallet</span>
                      <span>{selectedData.depositWallet}</span>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Deposit;
