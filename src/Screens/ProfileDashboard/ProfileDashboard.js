import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import "../../components/Dashboard/dashboard.css";
import "./ProfileDashboard.css";
import userImg from "../../assets/user.png";
import ALGO from "../../assets/crypto/ALGO.png";
import BNB from "../../assets/crypto/BNB.png";
import BTC from "../../assets/crypto/BTC.png";
import DIAM from "../../assets/crypto/DIAM.png";
import DOGE from "../../assets/crypto/DOGE.png";
import FLRNS from "../../assets/crypto/FLRNS.png";
import LTC from "../../assets/crypto/LTC.png";
import USDT from "../../assets/crypto/USDT.png";
import DIAMREFER from "../../assets/DiamProfile (2).svg";
import referAnimation from "../../assets/lotties/refer.json";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar/Topbar";
import { useDispatch, useSelector } from "react-redux";
import { URI } from "../../constants";
import axios from "axios";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { setCustomerInfo, setReferralCode } from "../../redux/actions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import { MdContentCopy } from "react-icons/md";
import {
  assetImageMappings,
  formatNumber,
} from "../../components/commonComponent";
import loader from "../../assets/loaderMobile.gif";

const cryptoLogos = [
  {
    logo: ALGO,
    asset: "ALGO",
    assetName: "Algo",
  },
  {
    logo: BTC,
    asset: "BTC",
    assetName: "Bitcoin",
  },
  {
    logo: BNB,
    asset: "BNB",
    assetName: "BNB",
  },
  {
    logo: DIAM,
    asset: "DIAM",
    assetName: "DIAM",
  },
  {
    logo: DOGE,
    asset: "DOGE",
    assetName: "DOGE",
  },
  {
    logo: FLRNS,
    asset: "FLRNS",
    assetName: "Flourins",
  },
  {
    logo: LTC,
    asset: "LTC",
    assetName: "LTC",
  },
  {
    logo: USDT,
    asset: "USDT",
    assetName: "USDT",
  },
];
const arrowRight = (
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
      fill-opacity="0.7"
    />
  </svg>
);
const sortIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
  >
    <path
      d="M0.844821 7.86328C0.490269 7.86328 0.283384 8.26335 0.488321 8.55268L3.35693 12.6025C3.53104 12.8483 3.89582 12.8483 4.06993 12.6025L6.93853 8.55268C7.14347 8.26335 6.93658 7.86328 6.58203 7.86328H0.844821Z"
      fill="#2D2C2C"
      stroke="#236DFF"
      stroke-width="0.262124"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.58218 5.24219C6.93673 5.24219 7.14362 4.84212 6.93868 4.55279L4.07007 0.502996C3.89596 0.257193 3.53119 0.257193 3.35708 0.502996L0.488469 4.55279C0.283532 4.84212 0.490417 5.24219 0.844969 5.24219H6.58218Z"
      fill="#236DFF"
    />
  </svg>
);

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: referAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ProfileDashboard = () => {
  const [toggle, setToggle] = useState(false);
  const [userData, setUserData] = useState("");
  const [searchAssetList, setSearchAssetList] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [spotWallet, setSpotWallet] = useState([]);
  const [fundWallet, setFundWallet] = useState([]);
  const [spotBalance, setSpotBalance] = useState(0);
  const [fundBalance, setFundBalance] = useState(0);
  const [assetBalance, setAssetBalance] = useState([]);
  const [coinList, setCoinList] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  const navigate = useNavigate();
  const { isFromDashboard, customerId } = useSelector(
    (stat) => stat.ChangeState
  );

  const dispatcher = useDispatch();

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const getUserData = async () => {
    const res = await axios.get(URI.getCustomerDetails + customerId, {
      headers: headers,
    });
    if (res.data.status === 200) {
      dispatcher(setCustomerInfo(res.data.data.customerInfo));
      setUserData(res.data.data.customerInfo);
      dispatcher(setReferralCode(res.data.data.customerInfo.referalCode));
    }
  };

  const getAllAssetSearch = async () => {
    axios
      .get(URI.getAssetsBySearch)
      .then((response) => {
        if (response.data.status === 200) {
          setSearchAssetList(response.data.data.assetList);
        } else {
          setSearchAssetList([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getCurrentBalance = async (data, type) => {
    if (data.length !== 0) {
      const assetData = data.map((e) => e.assetSymbol);
      const parsedData = assetData.join(",");
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${type}&tsyms=${parsedData}`
      );
      const requests = data.map(async (e) => {
        return e.wallCurrBal / parseFloat(response.data[e.assetSymbol]);
      });

      const balances = await Promise.all(requests);
      const totalBalance = balances.reduce((acc, balance) => acc + balance, 0);

      return Number(parseFloat(totalBalance).toFixed(2));
      // return 0;
    } else {
      return 0;
    }
  };

  const getAssets = () => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((res) => {
        // setLoader(false);
        setCoinList(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setCoinList([]);
        // setLoader(false);
      });
  };

  useEffect(() => {
    getAssets();
  }, []);

  const getSpotWalletDetails = async () => {
    axios
      .get(URI.getSpotWallet + "/" + customerId, {
        headers: headers,
      })

      .then(async (response) => {
        if (response.data.status === 200) {
          setSpotWallet(response.data.data);
          setSpotBalance(
            await getCurrentBalance(response.data.data, selectedAsset)
          );
        } else {
          console.log(response.data.message);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getFundWalletDetails = async () => {
    axios
      .get(URI.getFundWallet + `/${customerId}`, {
        headers: headers,
      })
      .then(async (response) => {
        if (response.data.status === 200) {
          setFundWallet(response.data.data.fundWalletDetailsList);
          setFundBalance(
            await getCurrentBalance(
              response.data.data.fundWalletDetailsList,
              selectedAsset
            )
          );
        } else {
          setFundWallet([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCopyText = () => {
    toast.info("User ID Copied");
  };

  useEffect(() => {
    getUserData();
    getAllAssetSearch();

    getSpotWalletDetails();
    getFundWalletDetails();
  }, []);
  const FetchData = async (type) => {
    setSpotBalance(await getCurrentBalance(spotWallet, type));
    setFundBalance(await getCurrentBalance(fundWallet, type));
  };

  return (
    <div
      // className={
      //   toggle
      //     ? "dashboard_toggle_main_container"
      //     : "dashboard_profile_container"
      // }
      className={
        toggle
          ? ` ${
              isFromDashboard
                ? "dashboard_main_container"
                : "dashboard_toggle_main_container"
            }`
          : ` ${
              isFromDashboard
                ? "dashboard_main_container"
                : "dashboard_profile_container"
            }`
      }
    >
      {/* sidebar container */}

      <SideBar
        activePage={"profileDashboard"}
        setToggle={setToggle}
        toggle={toggle}
      />

      {/* {sidebar-end} */}
      {userData != "" ? (
        <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
          {/* heder content */}
          <header className="">
            <Topbar />
          </header>
          {/* <h5 className="text-white text-start mx-5">Dashboard</h5> */}
          <main className="mx-5 d-flex gap-4 pe-5 mt-3">
            <div className="col-4 common_border_bg rounded-2">
              {/* <div className="pt-2 position-relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 87 87"
                fill="none"
              >
                <circle cx="43.5" cy="43.5" r="43" stroke="#236DFF" />
              </svg>

              <img
                src={userImg}
                alt=""
                width={50}
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{ marginTop: "4px" }}
              />
            </div> */}

              <div className="pt-2 profileImage mx-auto mt-2">
                <img
                  src={userImg}
                  alt=""
                  width={48}
                  className="rounded-circle ms-2"
                  // style={{ marginTop: "4px" }}
                />
              </div>

              <h6 className="py-3 d-flex justify-content-center">
                Hi,&nbsp;
                {`${userData.firstName} ${userData.custMiddleName} ${userData.lastName}`}
                !
              </h6>
              <div className="d-flex justify-content-center mx-auto">
                <div className="w-75">
                  <div className="d-flex justify-content-between gap-5">
                    <div className="d-flex flex-column text-start col-5">
                      <span className="opacity-75">User ID</span>
                      <div className="d-flex align-items-center">
                        <span>{userData.excUserId}</span>

                        <CopyToClipboard
                          onCopy={onCopyText}
                          text={userData.excUserId}
                          style={{
                            padding: "4px 8px",
                            margin: "6px 0",
                            // color: "#236dff",
                            borderRadius: "5px",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "1vw",
                          }}
                        >
                          <span className="ps-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path
                                d="M12.4567 0.523163C12.2913 0.356825 12.0946 0.224942 11.8779 0.135143C11.6611 0.0453435 11.4288 -0.000588021 11.1942 5.68284e-06H7.5C7.02657 0.000561457 6.57269 0.188877 6.23792 0.523643C5.90315 0.858409 5.71484 1.31229 5.71428 1.78572V10.3571C5.71484 10.8306 5.90315 11.2845 6.23792 11.6192C6.57269 11.954 7.02657 12.1423 7.5 12.1429H13.2143C13.6877 12.1424 14.1416 11.9541 14.4764 11.6193C14.8112 11.2845 14.9995 10.8306 15 10.3571V3.80615C15.0007 3.5715 14.9548 3.33905 14.865 3.12226C14.7752 2.90547 14.6433 2.70867 14.4768 2.54325L12.4567 0.523163ZM11.4286 0.742934C11.6263 0.786956 11.8076 0.885819 11.9517 1.02818L13.9718 3.04828C14.115 3.19186 14.2143 3.37336 14.2578 3.57143H12.5C12.2159 3.57112 11.9436 3.45814 11.7427 3.25728C11.5419 3.05641 11.4289 2.78407 11.4286 2.5V0.742934ZM14.2857 10.3571C14.2854 10.6412 14.1724 10.9136 13.9715 11.1144C13.7707 11.3153 13.4983 11.4283 13.2143 11.4286H7.5C7.21593 11.4283 6.94359 11.3153 6.74272 11.1144C6.54186 10.9136 6.42888 10.6412 6.42857 10.3571V1.78572C6.42888 1.50165 6.54186 1.22931 6.74272 1.02845C6.94359 0.827583 7.21593 0.714601 7.5 0.714291H10.7143V2.5C10.7148 2.97345 10.9031 3.42737 11.2379 3.76215C11.5726 4.09692 12.0265 4.28522 12.5 4.28572H14.2857V10.3571ZM0 13.2143V4.64286C0.000555774 4.16943 0.188871 3.71555 0.523637 3.38078C0.858403 3.04602 1.31228 2.8577 1.78571 2.85715H4.64285V3.57143H1.78571C1.50165 3.57174 1.22931 3.68473 1.02844 3.88559C0.827577 4.08645 0.714595 4.3588 0.714285 4.64286V13.2143C0.714595 13.4984 0.827577 13.7707 1.02844 13.9716C1.22931 14.1724 1.50165 14.2854 1.78571 14.2857H7.5C7.78406 14.2854 8.0564 14.1724 8.25727 13.9716C8.45813 13.7707 8.57111 13.4984 8.57142 13.2143H9.28571C9.28521 13.6877 9.09692 14.1416 8.76214 14.4764C8.42736 14.8112 7.97344 14.9995 7.5 15H1.78571C1.31228 14.9994 0.858403 14.8111 0.523637 14.4764C0.188871 14.1416 0.000555774 13.6877 0 13.2143Z"
                                fill="#F5F5F5"
                              />
                            </svg>
                          </span>
                        </CopyToClipboard>
                      </div>
                    </div>
                    <div className="d-flex flex-column text-start col-5">
                      <span className="opacity-75">VIP level</span>
                      <span className="d-flex align-items-center">
                        <span>Regular User</span>
                        <span className="ps-2">{arrowRight}</span>
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between pt-3">
                    <div className="d-flex flex-column text-start col-5">
                      <span className="opacity-75">Following</span>
                      <span className="d-flex align-items-center">
                        <span>45</span>
                        <span className="ps-2">{arrowRight}</span>
                      </span>
                    </div>
                    <div className="d-flex flex-column text-start col-5">
                      <span className="opacity-75">Followers</span>
                      <span className="d-flex align-items-center">
                        <span>23k</span>
                        <span className="ps-2">{arrowRight}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-8">
              <div className="common_border_bg mb-4 rounded-2 d-flex py-3">
                <div className="w-50 ps-4 text-start">
                  <div className="py-2">
                    <span className="opacity-75">Estimated Balance</span>
                    <span className="ps-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_260_1294)">
                          <path
                            d="M10.5 3.9375C6.125 3.9375 2.38875 6.65875 0.875 10.5C2.38875 14.3412 6.125 17.0625 10.5 17.0625C14.8794 17.0625 18.6112 14.3412 20.125 10.5C18.6112 6.65875 14.8794 3.9375 10.5 3.9375ZM10.5 14.875C8.085 14.875 6.125 12.915 6.125 10.5C6.125 8.085 8.085 6.125 10.5 6.125C12.915 6.125 14.875 8.085 14.875 10.5C14.875 12.915 12.915 14.875 10.5 14.875ZM10.5 7.875C9.05188 7.875 7.875 9.05188 7.875 10.5C7.875 11.9481 9.05188 13.125 10.5 13.125C11.9481 13.125 13.125 11.9481 13.125 10.5C13.125 9.05188 11.9481 7.875 10.5 7.875Z"
                            fill="#F5F5F5"
                            fill-opacity="0.7"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_260_1294">
                            <rect width="21" height="21" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="d-flex dropdown_container">
                      {/* <select
                      className="rounded-3"
                      style={{
                        outline: "none",
                        color: "#FAB446",
                        backgroundColor: "rgba(81, 81, 81, 0.5)",
                      }}
                    >
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>LTC</option>
                    </select> */}

                      <DropdownButton
                        title={selectedAsset}
                        id="dropdown_Asset_limit"
                        className="order_book_Value_dropdown rounded-2"
                        style={{
                          backgroundColor: "#f5f5f533",
                          color: "#FFFF00",
                        }}
                        onSelect={(key) => {
                          setSelectedAsset(key);
                          FetchData(key);
                        }}
                      >
                        {searchAssetList.map((asset) => {
                          return (
                            <Dropdown.Item eventKey={asset.assetSymbol}>
                              {asset.assetSymbol}
                            </Dropdown.Item>
                          );
                        })}
                      </DropdownButton>
                      <div>
                        <span className="ps-2 pe-3 fs-4">
                          {formatNumber(spotBalance + fundBalance)}
                        </span>
                        {/* <span className="opacity-75"> = $673572338.00</span> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-50 ps-3">
                  <div className="text-start py-2">
                    <span className="opacity-75">Today P&L</span>
                    <span className="ps-2 small" style={{ color: "#0AD61E" }}>
                      0.00 ( 2.98% )
                    </span>
                  </div>
                  <div className="py-2  d-flex gap-3">
                    <button
                      className="btn border-primary text-white "
                      onClick={() => {
                        navigate("/deposit");
                      }}
                    >
                      Deposit
                    </button>
                    <button
                      className="btn border-primary text-white"
                      onClick={() => {
                        navigate("/spot-withdraw");
                      }}
                    >
                      Withdraw
                    </button>
                    <button
                      className="btn border-primary text-white"
                      onClick={() => {
                        navigate("/buysell");
                      }}
                    >
                      CashIn
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="d-flex gap-4 py-2"
                style={{ marginBottom: "-8px" }}
              >
                <div
                  className="w-50 common_border_bg rounded-2 d-flex flex-column text-start ps-4 py-2 refer_box position-relative cursorPointer"
                  onClick={() => {
                    navigate("/refer");
                  }}
                >
                  <span className="opacity-75 my-auto">
                    Refer Friends & Earn
                  </span>
                  <span className="fs-5 my-auto">100 DIAM & 50 USDT</span>
                  <span className="position-absolute refer_animation">
                    <Lottie
                      options={defaultOptions}
                      style={{ width: "5.9rem" }}
                    />
                  </span>
                  <img
                    src={DIAMREFER}
                    alt="DIAM"
                    className="position-absolute refer_diam"
                  />
                  <span className="position-absolute bottom-0 end-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="271"
                      height="50"
                      viewBox="0 0 271 50"
                      fill="none"
                    >
                      <g filter="url(#filter0_f_260_1528)">
                        <ellipse
                          cx="166"
                          cy="72"
                          rx="116"
                          ry="22"
                          fill="#236DFF"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_f_260_1528"
                          x="0.717625"
                          y="0.717625"
                          width="330.565"
                          height="142.565"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="24.6412"
                            result="effect1_foregroundBlur_260_1528"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </span>
                </div>
                <div className="w-50 common_border_bg rounded-2 text-start py-2 d-flex justify-content-between">
                  <div className="d-flex flex-column ps-4 pb-2 my-auto">
                    <span className="opacity-75">Trade crypto with</span>
                    <span className="pt-2">
                      <span className="opacity-75">advanced tools in</span>
                      <span className="ps-1">CHAIN XCHANGE</span>
                    </span>
                  </div>
                  <div className="pe-3 d-flex w-25">
                    <marquee
                      behavior="scroll"
                      direction="up"
                      scrolldelay="250"
                      height="100"
                    >
                      {cryptoLogos
                        .slice(0, 4)
                        .reverse()
                        .map((e, i) => {
                          return (
                            <img
                              alt={e.asset}
                              src={e.logo}
                              className="d-block w-50 mb-2"
                              key={i}
                            />
                          );
                        })}
                    </marquee>
                    <marquee
                      behavior="scroll"
                      direction="down"
                      scrolldelay="250"
                      height="100"
                    >
                      {cryptoLogos.slice(4, cryptoLogos.length).map((e, i) => {
                        return (
                          <img
                            alt={e.asset}
                            src={e.logo}
                            className="d-block w-50 mb-2"
                            key={i}
                          />
                        );
                      })}
                    </marquee>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div
            className="common_border_bg rounded-2 ms-5 py-4 mt-3 ps-4"
            style={{ marginRight: "72px" }}
          >
            <div className="text-start">
              <span>Complete these three steps to receive </span>
              <span className="activeColor">300 DIAM</span>
              <span> & </span>
              <span className="activeColor">60 USDT </span>
            </div>
            <div className="d-flex align-items-center gap-2 py-2 ps-4 pe-1">
              <div className="text-start col-4">
                <div className="d-flex gap-2 align-items-center my-3">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute bg-white rounded-circle inner_circle" />
                  </div>
                  <div
                    className="w-100 position-relative"
                    style={{
                      border: "1px rgba(245, 245, 245, 0.60) solid",
                    }}
                  >
                    <span className="position-absolute arrow_icon" />
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <h6 className="step_header_color">Step 1</h6>
                  <span className="small pe-4 py-2">
                    Verify your identity and receive 100 DIAM & 20 USDT
                  </span>
                </div>
                <div className="pt-2">
                  <span className="pending_btn px-3 py-1">
                    <span>Verify</span>
                    <span className="ps-2">{arrowRight}</span>
                  </span>
                </div>
              </div>
              <div className="text-start col-4">
                <div className="d-flex gap-2 align-items-center my-3">
                  <div
                    className="rounded-circle position-relative outer_circle"
                    style={{ width: "19px" }}
                  >
                    <span
                      className="position-absolute bg-white rounded-circle inner_circle"
                      // style={{ left: "3.5px" }}
                    />
                  </div>
                  <div
                    className="w-100 position-relative"
                    style={{
                      border: "1px rgba(245, 245, 245, 0.60) solid",
                    }}
                  >
                    <span className="position-absolute arrow_icon" />
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <h6 className="step_header_color">Step 2</h6>
                  <span className="small pe-4 py-2">
                    Deposit 2- USDT and receive 100 100 DIAM & 20 USDT
                  </span>
                </div>
                <div className="pt-2">
                  <span className="pending_btn px-3 py-1">Pending</span>
                </div>
              </div>
              <div className="text-start col-4">
                <div className="d-flex gap-2 align-items-center my-3">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute bg-white rounded-circle inner_circle" />
                  </div>
                  <div className="w-100 d-hidden"></div>
                </div>
                <div className="d-flex flex-column">
                  <h6 className="step_header_color">Step 3</h6>
                  <span className="small pe-4 py-2">
                    Get 100 DIAM & 20 USDT upon your first exchange of 20 USDT.
                  </span>
                </div>
                <div className="pt-2">
                  <span className="pending_btn px-3 py-1">Pending</span>
                </div>
              </div>
            </div>
          </div>

          <footer
            className="common_border_bg rounded-2 ms-5 py-4 mt-3 ps-4"
            style={{ marginRight: "72px" }}
          >
            <div className="text-start">
              <h4 className="mb-4">Markets</h4>
              <div>
                <span className="market_label text-white py-2 px-3 rounded-2 me-2">
                  Holdings
                </span>
                <span className="market_label text-white py-2 px-3 rounded-2 mx-3">
                  Trending
                </span>
                <span className="market_label text-white py-2 px-3 rounded-2 mx-3">
                  New listing
                </span>
                <span className="market_label text-white py-2 px-3 rounded-2 mx-3">
                  Favourite
                </span>
                <span className="market_label text-white py-2 px-3 rounded-2 mx-3">
                  Top gainers
                </span>
                <span className="market_label text-white py-2 px-3 rounded-2 mx-3">
                  24h Volume
                </span>
              </div>
            </div>
            <div className="mt-4 me-5">
              <div className="market_table_headings d-flex">
                <span className="w-25 text-start pb-2">
                  Coin <span className="ps-1">{sortIcon}</span>
                </span>
                <span className="w-25 text-start pb-2">
                  Price <span className="ps-1">{sortIcon}</span>
                </span>
                <span className="w-25 text-start pb-2">
                  24h change <span className="ps-1">{sortIcon}</span>
                </span>
                <span className="w-25 text-center pb-2">
                  Trade <span className="ps-1">{sortIcon}</span>
                </span>
              </div>
              <>
                {coinList.slice(0, 5).map((e, i) => {
                  return (
                    <div
                      className="market_table_values d-flex pt-3 pb-2"
                      style={{
                        borderTop: "1px solid rgba(245, 245, 245, 0.6)",
                      }}
                      key={i}
                    >
                      <span className="w-25 text-start d-flex align-items-center gap-2">
                        <img
                          alt={e.name}
                          // src={e.image}
                          src={assetImageMappings(e.symbol.toUpperCase())}
                          className=""
                          height={40}
                          width={40}
                          // style={{ width: "2.6rem" }}
                        />
                        <span className="d-flex flex-column">
                          <span className="">{e.symbol.toUpperCase()}</span>
                          <span className="small opacity-50">
                            {e.assetSymbol}
                          </span>
                        </span>
                      </span>
                      <span className="w-25 text-start d-flex flex-column">
                        <span>{e.current_price}</span>
                        {/* <span className="small opacity-50">38,589</span> */}
                        {/* {console.log("assetBalance123", assetBalance)} */}
                        {/* {assetBalance &&
                        assetBalance.map((item, index) => <span>{item}</span>)} */}
                      </span>
                      <span
                        // className="w-25 text-start small"
                        // className={`{}`}
                        className={`w-25 text-start small ${
                          e.price_change_percentage_24h < 0
                            ? "text_danger"
                            : "text_suceess"
                        }`}
                      >
                        {e.price_change_percentage_24h}
                      </span>
                      <span className="w-25 text-center">
                        <span className="pending_btn px-2 py-1">
                          <span>Trade</span>
                          <span className="ps-2">{arrowRight}</span>
                        </span>
                      </span>
                    </div>
                  );
                })}
              </>
            </div>
          </footer>
        </section>
      ) : (
        <section className="d-flex justify-content-center align-items-center">
          <img src={loader} alt="loader" width={200} />
        </section>
      )}

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
    </div>
  );
};

export default ProfileDashboard;
