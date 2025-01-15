import React, { useEffect, useState } from "react";
import Topbar from "../../Topbar/Topbar";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import "../../Dashboard/dashboard.css";
import "../../Deposit/Deposit.css";
import crossIcon from "../../../assets/crossIconx.svg";
import axios from "axios";
import { URI } from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMagnifyingGlass,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../Spot/SpotAsset.css";
import { CountryData } from "../../../constants/countryCodes";
import { useSelector } from "react-redux";
import refresh_loader from "../../../assets/refresh_loader.svg";
import { assetImageMappings, formatNumber } from "../../commonComponent";
import Loader from "../../common/Loader";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import usFlag from "../../../assets/usflag.svg";

const removeIcon = (
  <FontAwesomeIcon icon={faXmark} width="16" style={{ color: "white" }} />
);

const searchIcon = (
  <FontAwesomeIcon
    icon={faMagnifyingGlass}
    width="18"
    style={{ marginTop: "3px" }}
  />
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

const arrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="15"
    height="15"
  >
    <path
      d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"
      fill="#FFFFFF"
      fillOpacity="0.9"
    />
  </svg>
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

const SpotWithdraw = () => {
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
  const minWithdrawals = [
    {
      name: "BTC",
      amount: "0.0008",
    },
    {
      name: "BCH",
      amount: "0.08",
    },
    {
      name: "USDT",
      amount: "20",
    },
    {
      name: "XRP",
      amount: "38",
    },
    {
      name: "ETH",
      amount: "0.01",
    },
    {
      name: "LINK",
      amount: "1.88",
    },
    {
      name: "MATIC",
      amount: "28",
    },
    {
      name: "WBTC",
      amount: "0.00054",
    },
    {
      name: "UNI",
      amount: "2.78",
    },
    {
      name: "MKR",
      amount: "0.013",
    },
    {
      name: "AAVE",
      amount: "0.72",
    },
    {
      name: "SUSHI",
      amount: "18",
    },
  ];

  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [modalType, setModalType] = useState("");
  const [sendToType, setSendToType] = useState("address");
  const [address, setAddress] = useState("");
  const [networks, setNetworks] = useState(tempNetworks);
  const [selectedNetwork, setSelectedNewNetwork] = useState("");
  const [assetCoins, setAssetCoins] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [searchCoin, setSearchCoin] = useState("");
  const [withdraAmount, setWithdraAmount] = useState("");
  const [walletType, setWalletType] = useState({
    isSpot: true,
    isFunding: false,
  });
  const [diamexUserType, setDiamexUserType] = useState("email");
  const [diamexUser, setDiamexUser] = useState("");
  const [countries, setCountries] = useState(CountryData);
  const [selectedCountry, setSelectedCountry] = useState({
    country: "United States",
    calling_code: "1",
    country_code: "US",
  });
  const [searchCountry, setSearchCountry] = useState("");
  const [isShowCountries, setIsShowCountries] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [fundWallet, setFundWallet] = useState([]);
  const [spotWallet, setSpotWallet] = useState([]);
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [recentType, setRecentType] = useState("crypto_address");
  const [recentData, setRecentData] = useState([]);
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
  const [apiLoader, setApiLoader] = useState(false);
  const [isValidAddress, setValidAddress] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [minWithdrawAmount, setMinWithdrawAmount] = useState("0");

  const { customerId } = useSelector((stat) => stat.ChangeState);
  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const changeDiamUserType = (type) => {
    if (diamexUserType !== type) {
      setNote("");
      setIsValid(false);
      setDiamexUser("");
      setDiamexUserType(type);
      setWithdraAmount("");
      setIsShowCountries(false);
      setSelectedCountry({
        country: "United States",
        calling_code: "1",
        country_code: "US",
      });
    }
  };

  const setMaxAmount = () => {
    let amt =
      (walletType.isSpot ? spotWallet[0]?.wallCurrBal : 0) +
      (walletType.isFunding ? fundWallet[0]?.wallCurrBal : 0);

    setWithdraAmount(formatNumber(amt));
  };

  const getAssets = async (searchString, type) => {
    axios
      .get(
        URI.getAssetsBySearch +
          `${searchString !== "" ? `/${searchString}` : ""}`
      )
      .then((response) => {
        if (response.data.status === 200) {
          setAssetCoins(response.data.data.assetList);
          setSelectedCoin(response.data.data.assetList[0]);
          setMinWithdrawAmount(
            minWithdrawals.filter(
              (item) =>
                item.name === response.data.data.assetList[0].assetSymbol
            )[0].amount
          );
          setSelectedNewNetwork(
            response.data.data.assetList[0]?.assetSymbol === "BTC"
              ? "Bitcoin"
              : "Ethereum (ERC20)"
          );

          if (searchString === "") {
            type === "total" && setAllAssets(response.data.data.assetList);
            getFundWalletByType(response.data.data.assetList[0].assetId);
            getSpotWalletByType(response.data.data.assetList[0].assetId);
          }
        } else {
          setAssetCoins([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getFundWalletByType = (id) => {
    axios
      .get(URI.getFundWalletByType + customerId + "/" + id, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setFundWallet(response.data.data.fundWalletDetailsList);
        } else {
          setFundWallet([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSpotWalletByType = (id) => {
    axios
      .get(URI.getSpotWalletByType + customerId + "/" + id, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setSpotWallet(response.data.data);
        } else {
          setSpotWallet([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const withdrawFund = () => {
    let walletId = 1;
    let totlaAmt =
      (walletType.isSpot ? spotWallet[0]?.wallCurrBal : 0) +
      (walletType.isFunding ? fundWallet[0]?.wallCurrBal : 0);
    setBtnLoader(true);
    if (walletType.isFunding && walletType.isSpot) {
      walletId = 3;
    } else if (walletType.isSpot) {
      walletId = 1;
    } else if (walletType.isFunding) {
      walletId = 2;
    }

    if (parseFloat(withdraAmount) > parseFloat(totlaAmt)) {
      setErrorMsg(
        "Please enter an amount no higher than your available balance."
      );
      setBtnLoader(false);
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    } else {
      let requestBody =
        sendToType === "diamex_user"
          ? {
              customerId: customerId,
              reqAmt: parseFloat(withdraAmount),
              assetId: selectedCoin.assetId,
              isDiamUser: 1,
              walletId: walletId,
              receiverDtls: diamexUser,
            }
          : {
              customerId: customerId,
              reqAmt: parseFloat(withdraAmount),
              assetId: selectedCoin.assetId,
              // diamUserId: 0,
              walletId: walletId,
              networkAddress: address,
              network: selectedCoin.assetSymbol === "BTC" ? 2 : 1,
              // network: selectedNetwork,
              isDiamUser: 0,
            };

      axios
        .post(URI.withdrawFunds, requestBody, {
          headers: headers,
        })
        .then((response) => {
          if (response.data.status === 200) {
            NotificationManager.success("", response.data.message, 5000);
            setBtnLoader(false);
            setDiamexUser("");
            setWithdraAmount("");
            setAddress("");
            setIsValid(false);
            getRecentDeposits(
              sendToType === "address" ? "crypto_address" : sendToType
            );
            setRecentType(
              sendToType === "address" ? "crypto_address" : sendToType
            );
            getFundWalletByType(selectedCoin.assetId);
            getSpotWalletByType(selectedCoin.assetId);
          } else {
            NotificationManager.error("", response.data.message, 5000);
            setBtnLoader(false);
          }
        })
        .catch((error) => {
          setBtnLoader(false);
          console.log(error);
        });
    }
  };

  const getRecentDeposits = (type) => {
    setApiLoader(true);
    setRecentType(type);
    let requestBody = {
      flagName: "WITHDRAW",
      customerId: customerId,
      pageNo: 1,
      pageSize: 10,
      isDiamUser: type === "diamex_user" ? 1 : 0,
    };

    axios
      .post(URI.getRecent, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setApiLoader(false);
          setRecentData(response.data.data.recentTransactionDetails);
        } else {
          setRecentData([]);
          setApiLoader(false);
        }
      })
      .catch((error) => {
        setApiLoader(false);
      });
  };

  const __searchValidAsset = (e) => {
    if (e.length > 0) {
      const __reqBody = {
        currency: selectedCoin.assetSymbol,
        walletAddress: e,
        network: "testnet",
      };
      // encryptedRequestBody = encryptedPayload(__reqBody);
      axios
        .post(URI.addressValidation, __reqBody)
        .then((result) => {
          setShowIcon(true);
          if (result.data.status === 200 || result.data.status === 201) {
            setValidAddress(result.data.data.isValid);
          } else {
            setValidAddress(false);
          }
        })
        .catch((er) => {
          console.log(er);
        });
    }
  };

  useEffect(() => {
    getAssets("", "total");
    getRecentDeposits("crypto_address");
  }, []);

  return (
    <div className="spot_withdraw">
      <div className="dashboard_main_container spot_withdraw_container">
        <Topbar />
        <header style={{ backgroundColor: "rgba(16, 18, 27, 1)" }}>
          <div className="py-3 w-75 d-flex align-items-center justify-content-between mx-auto">
            <h4>
              <span
                className="me-2 cursorPointer"
                onClick={() => {
                  navigate("/spotAssets");
                }}
              >
                {arrowLeft}
              </span>{" "}
              Withdraw
            </h4>
            {/* <button className="py-1 px-3 active_bg_color text-white rounded-2 border border-0 small">
              Withdraw Fiat <span className="ps-1">{arrow}</span>
            </button> */}
          </div>
        </header>
        <section className="py-3 w-75 d-flex align-items-center justify-content-between mx-auto ps-4 pe-3">
          <div className="mx-auto w-75">
            <div className="d-flex gap-5">
              <div className="w-25 text-start ps-3 ms-3">Select coin</div>
              <div className="w-75 text-start">
                <label className="">Coin</label>
                <div
                  className="common_input_bg d-flex justify-content-between p-2 rounded-2 w-100"
                  onClick={() => {
                    setAssetCoins(allAssets);
                    setSearchCoin("");
                    setModalType("coin");
                    setAddress("");
                  }}
                >
                  <button className="bg-transparent border-0 text-white w-100 text-start">
                    {selectedCoin.assetSymbol ? (
                      <img
                        src={assetImageMappings(selectedCoin.assetSymbol)}
                        style={{ height: "1.5vw", width: "1.5vw" }}
                        alt="logo"
                        loading="lazy"
                      />
                    ) : (
                      <span className="img_loading_animation"></span>
                    )}
                    <span className="px-2">{selectedCoin.assetSymbol}</span>
                    <span className="small">{selectedCoin.assetName}</span>
                  </button>
                  <span>{down}</span>
                </div>
              </div>
            </div>
            <div className="d-flex gap-5 mt-4">
              <div className="w-25 text-start ps-3 ms-3">Send to</div>
              <div className="w-75 text-start">
                <div className="border-bottom border-secondary mb-4 d-flex gap-3">
                  <span
                    className={`pb-2 cursorPointer ${
                      sendToType === "address"
                        ? "border-top-0 border-start-0 border-end-0 active_border_color"
                        : ""
                    }`}
                    onClick={() => {
                      setWithdraAmount("");
                      setSendToType("address");
                      setDiamexUser("");
                      setAddress("");
                    }}
                  >
                    Address
                  </span>
                  <span
                    className={`pb-2 cursorPointer ${
                      sendToType === "diamex_user"
                        ? "border-top-0 border-start-0 border-end-0 active_border_color"
                        : ""
                    }`}
                    onClick={() => {
                      setDiamexUser("");
                      setWithdraAmount("");
                      setSendToType("diamex_user");
                    }}
                  >
                    Diamex user
                  </span>
                </div>
                {sendToType === "address" ? (
                  <>
                    <label className="">Address</label>
                    <div className="mb-3 pt-2 position-relative w-100">
                      <input
                        type="text"
                        className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100 pe-5"
                        placeholder="Enter address"
                        value={address}
                        onChange={(e) => {
                          setShowIcon(false);
                          ![" "].includes(e.target.value) &&
                            setAddress(e.target.value);
                          // setValidAddress(false);
                        }}
                        onBlur={(e) => {
                          __searchValidAsset(e.target.value);
                        }}
                      />

                      <span
                        className={`position-absolute text-white pt-2 me-2 end-0 ${
                          address.length > 0 && showIcon ? "" : "d-none"
                        }`}
                      >
                        {isValidAddress ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-success fs-5 pt-1"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="text-danger fs-5 pt-1"
                          />
                        )}
                      </span>

                      {/* <span
    className="position-absolute text-white mt-2 me-2 end-0 opacity-75"
  >
    {searchCoin === "" ? searchIcon : removeIcon}
  </span> */}
                    </div>
                    <label className="">Network</label>
                    <div
                      className="common_input_bg d-flex justify-content-between p-2 rounded-2 w-100"
                      onClick={() => {
                        // setModalType("network");
                      }}
                    >
                      <button className="bg-transparent border-0 text-white w-100 text-start">
                        {selectedNetwork}
                        {/* <span className="">TRX</span>
                        <span className="px-2">Tron</span>
                        <span className="small">(TRC20)</span> */}
                      </button>
                      {/* <span>{down}</span> */}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex py-1">
                        <div className="d-flex flex-column w-50">
                          <span className="opacity-50">Network fee</span>
                          <span>
                            0.000001&nbsp;
                            {selectedCoin.assetSymbol === "BTC" ? "BTC" : "ETH"}
                          </span>
                        </div>
                        <div className="d-flex flex-column w-50">
                          <span className="opacity-50">Minimum withdrawal</span>
                          <span>
                            {minWithdrawAmount} {selectedCoin.assetSymbol}
                          </span>
                        </div>
                      </div>

                      {/* <div>
    <div>
      <span>Contract Address</span>
      <span>0.15 ~ 7 USDT</span>
    </div>
  </div> */}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex gap-3">
                      <span
                        className={`active_bg_color px-2 rounded-1 cursorPointer ${
                          diamexUserType === "email" ? "" : "opacity-50"
                        }`}
                        onClick={() => {
                          changeDiamUserType("email");
                        }}
                      >
                        Email
                      </span>
                      <span
                        className={`active_bg_color px-2 rounded-1 cursorPointer ${
                          diamexUserType === "phone" ? "" : "opacity-50"
                        }`}
                        onClick={() => {
                          changeDiamUserType("phone");
                        }}
                      >
                        Phone
                      </span>
                      <span
                        className={`active_bg_color px-2 rounded-1 cursorPointer ${
                          diamexUserType === "diamexId" ? "" : "opacity-50"
                        }`}
                        onClick={() => {
                          changeDiamUserType("diamexId");
                        }}
                      >
                        Diamex ID
                      </span>
                    </div>
                    <div className="position-relative">
                      <div className="d-flex">
                        {diamexUserType === "phone" && (
                          <div
                            className="mt-4 position-relative w-25 me-5 common_border_bg rounded-1 d-flex justify-content-center align-items-center common_input_bg"
                            // onClick={() => {
                            //   setIsShowCountries(!isShowCountries);
                            // }}
                          >
                            <span>
                              <span className="">
                                <img
                                  src={usFlag}
                                  alt="img"
                                  height={17}
                                  width={20}
                                  className="pb-1"
                                />
                              </span>
                              {/* <img
                                alt="logo"
                                src={`https://flagcdn.com/h240/${selectedCountry.country_code.toLowerCase()}.png`}
                                width={26}
                                height={26}
                                className="rounded-circle"
                              /> */}

                              <span className="ps-2">
                                US +1{/* {selectedCountry.calling_code} */}
                              </span>
                            </span>
                            {/* <span className="pb-2">{down}</span> */}
                          </div>
                        )}
                        <div
                          className={`pt-4 position-relative ${
                            diamexUserType === "phone" ? "w-75" : "w-100"
                          }`}
                        >
                          <input
                            onPaste={(e) => e.preventDefault()}
                            type="text"
                            className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100"
                            placeholder={
                              diamexUserType === "email"
                                ? "Recipient's email"
                                : diamexUserType === "phone"
                                ? "Recipient's phone number"
                                : "Recipient's Diamex ID"
                            }
                            value={diamexUser}
                            onChange={(e) => {
                              if (![" "].includes(e.target.value)) {
                                setIsValid(false);
                                setDiamexUser(
                                  diamexUserType !== "email"
                                    ? e.target.value.replace(/[^0-9]/g, "")
                                    : e.target.value
                                );
                                if (diamexUserType === "phone") {
                                  setIsValid(
                                    /^[0-9]{10}$/.test(e.target.value)
                                  );
                                } else if (diamexUserType === "email") {
                                  setIsValid(
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                                      e.target.value
                                    )
                                  );
                                } else {
                                  setIsValid(e.target.value.length > 5);
                                }
                              }
                            }}
                            maxLength={diamexUserType === "phone" ? 10 : ""}
                          />
                        </div>
                      </div>
                      {/* {diamexUserType === "phone" && isShowCountries && (
                        <>
                          <div className="country_list_number position-relative w-100 common_border_bg rounded-1 mt-1">
                            <div className="p-2 position-sticky ">
                              <input
                                type="text"
                                className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100"
                                placeholder="Search"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                value={searchCountry}
                                onChange={(e) => {
                                  setSearchCountry(e.target.value);

                                  let data = CountryData.filter((country) => {
                                    return (
                                      country.country
                                        .toLowerCase()
                                        .includes(e.target.value) ||
                                      country.calling_code.includes(
                                        e.target.value
                                      )
                                    );
                                  });
                                  setCountries(data);
                                  // setCountries
                                }}
                                id="search_country"
                              />
                              <label
                                htmlFor="search_country"
                                className="position-absolute text-white mt-2 me-3 end-0 opacity-75"
                              >
                                {searchCoin === "" ? searchIcon : removeIcon}
                              </label>
                            </div>
                            <div>
                              {countries.map((country) => {
                                return (
                                  <div
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setIsShowCountries(false);
                                      setCountries(CountryData);
                                      setSearchCountry("");
                                    }}
                                    className="d-flex justify-content-between px-3 py-2 asset_item cursorPointer"
                                    key={country.country_code}
                                  >
                                    <span>
                                      <img
                                        alt="logo"
                                        src={`https://flagcdn.com/h240/${country.country_code.toLowerCase()}.png`}
                                        width={26}
                                        height={26}
                                        className="rounded-circle"
                                      />
                                      <span className="ps-2">
                                        {country.country}
                                      </span>
                                    </span>
                                    <span>+{country.calling_code}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )} */}
                    </div>
                    <div
                      style={{ height: "1rem" }}
                      className="small text-start text-danger"
                    >
                      {diamexUserType === "email" && (
                        <span>
                          {isValid === false && diamexUser.length > 2
                            ? "Please enter a valid email"
                            : ""}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            {address.length > 5 && sendToType === "address" ? (
              <>
                <div className="d-flex gap-5 mt-4">
                  <div className="w-25 text-start ps-3 ms-3">
                    Withdraw amount
                  </div>
                  <div className="w-75 text-start mb-1">
                    <label className="">Amount</label>
                    <div className="pt-2 position-relative w-100">
                      <input
                        type="text"
                        className="assetSearchbar searchbar rounded-2 text-white common_input_bg w-100 py-2 ps-2"
                        placeholder={`Minimal ${minWithdrawAmount}`}
                        value={withdraAmount}
                        onChange={(e) => {
                          e.target.value.charAt(0) !== "." &&
                            setWithdraAmount(
                              e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                            );
                        }}
                        style={{ paddingRight: "5.8rem" }}
                      />
                      <span className="position-absolute text-white mt-2 me-2 end-0 opacity-75">
                        <span
                          className="cursorPointer activeColor"
                          onClick={() => {
                            setMaxAmount();
                          }}
                        >
                          MAX
                        </span>{" "}
                        |&nbsp;
                        {selectedCoin.assetSymbol}
                      </span>
                    </div>
                    {/* <div
                      style={{ height: "1rem" }}
                      className="small text-start text-danger"
                    >
                      error
                    </div> */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            name="Spot Wallet"
                            checked={walletType.isSpot}
                            onChange={(e) => {
                              setWalletType({
                                isSpot: e.target.checked,
                                isFunding:
                                  walletType.isFunding || !e.target.checked,
                              });
                            }}
                          />
                          <label className="ms-2">Spot Wallet</label>
                        </div>
                        <div>{spotWallet[0]?.wallCurrBal}</div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex align-items-center">
                          <input
                            type="checkbox"
                            name="Funding Wallet"
                            checked={walletType.isFunding}
                            onChange={(e) => {
                              setWalletType({
                                isFunding: e.target.checked,
                                isSpot: walletType.isSpot || !e.target.checked,
                                // isSpot: walletType.isSpot,
                              });
                            }}
                          />
                          <label className="ms-2">Funding Wallet</label>
                        </div>
                        <div>{fundWallet[0]?.wallCurrBal}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-5 mt-2">
                  <div className="w-25 text-start ps-3 ms-3">
                    Receive amount
                  </div>
                  <div className="w-75 text-start d-flex justify-content-between">
                    <label className="fs-4">
                      {withdraAmount >= minWithdrawAmount
                        ? formatNumber(withdraAmount - 0.000001)
                        : 0}
                      &nbsp;
                      {selectedCoin.assetSymbol}
                    </label>
                    <div className="mb-3 pt-2 position-relative">
                      {parseFloat(withdraAmount) >=
                        parseFloat(minWithdrawAmount) && isValidAddress ? (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => {
                            withdrawFund();
                          }}
                          disabled={btnLoader}
                        >
                          {btnLoader ? (
                            <img
                              src={refresh_loader}
                              style={{ width: 20 }}
                              className="spinner"
                              alt=""
                            />
                          ) : null}
                          Withdraw
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{ minHeight: "1.2rem" }}
                  className="text-center ms-5 ps-5"
                >
                  <span
                    className={`ms-4 small ${
                      errorMsg ? "text-danger" : "text-success"
                    }`}
                  >
                    {errorMsg || successMsg}
                  </span>
                </div>
              </>
            ) : (
              <>
                {isValid && sendToType !== "address" && (
                  <>
                    <div className="d-flex gap-5 mt-4">
                      <div className="w-25 text-start ps-3 ms-3">
                        Send amount
                      </div>
                      <div className="w-75 text-start mb-1">
                        <label className="">Amount</label>
                        <div className="pt-2 position-relative w-100">
                          <input
                            type="text"
                            className="assetSearchbar searchbar rounded-2 text-white py-2 common_input_bg w-100 ps-2"
                            placeholder={`Minimal ${minWithdrawAmount}`}
                            value={withdraAmount}
                            onChange={(e) => {
                              e.target.value.charAt(0) !== "." &&
                                setWithdraAmount(
                                  e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1")
                                );
                            }}
                            style={{ paddingRight: "5.8rem" }}
                          />
                          <span className="position-absolute text-white mt-2 me-2 end-0 opacity-75">
                            <span
                              className="cursorPointer activeColor"
                              onClick={() => {
                                setMaxAmount();
                              }}
                            >
                              MAX
                            </span>{" "}
                            |&nbsp;
                            {selectedCoin.assetSymbol}
                          </span>
                        </div>
                        <div className="mt-3 mb-4">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="Spot Wallet"
                                checked={walletType.isSpot}
                                onChange={(e) => {
                                  setWalletType({
                                    isSpot: e.target.checked,
                                    isFunding:
                                      walletType.isFunding || !e.target.checked,
                                    // isFunding: walletType.isFunding,
                                  });
                                }}
                              />
                              <label className="ms-2">Spot Wallet</label>
                            </div>
                            <div>{spotWallet[0]?.wallCurrBal}</div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                name="Funding Wallet"
                                checked={walletType.isFunding}
                                onChange={(e) => {
                                  setWalletType({
                                    isFunding: e.target.checked,
                                    isSpot:
                                      walletType.isSpot || !e.target.checked,
                                  });
                                }}
                              />
                              <label className="ms-2">Funding Wallet</label>
                            </div>
                            <div>{fundWallet[0]?.wallCurrBal}</div>
                          </div>
                        </div>
                        <label className="">Note(Optional)</label>
                        <div className="pt-2 position-relative w-100">
                          <input
                            type="text"
                            className="assetSearchbar searchbar rounded-2 text-white p-2 common_input_bg w-100"
                            placeholder=""
                            maxLength={30}
                            onChange={(e) => {
                              setNote(e.target.value);
                            }}
                            value={note}
                          />
                          <span className="position-absolute text-white mt-2 me-2 end-0 opacity-75">
                            0/30
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex py-1">
                            <div className="d-flex flex-column w-50">
                              <span className="opacity-50">Network fee</span>
                              <span>
                                0.000001&nbsp;
                                {selectedCoin.assetSymbol === "BTC"
                                  ? "BTC"
                                  : "ETH"}
                              </span>
                            </div>
                            <div className="d-flex flex-column w-50">
                              <span className="opacity-50">
                                Minimum withdrawal
                              </span>
                              <span>
                                {minWithdrawAmount} {selectedCoin.assetSymbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-5 mt-3">
                      <div className="w-25 text-start ps-3 ms-3">
                        Total amount
                      </div>
                      <div className="w-75 text-start d-flex justify-content-between">
                        <label className="fs-4">
                          {withdraAmount >= minWithdrawAmount
                            ? formatNumber(withdraAmount - 0.000001)
                            : "0"}
                          &nbsp;{selectedCoin.assetSymbol}
                        </label>
                        <div className="mb-3 pt-2 position-relative">
                          {parseFloat(withdraAmount) >=
                          parseFloat(minWithdrawAmount) ? (
                            <button
                              type="submit"
                              className="btn btn-primary px-5"
                              onClick={() => {
                                withdrawFund();
                              }}
                              disabled={btnLoader}
                            >
                              {btnLoader ? (
                                <img
                                  src={refresh_loader}
                                  style={{ width: 20 }}
                                  className="spinner"
                                  alt=""
                                />
                              ) : null}
                              Send
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-primary px-5"
                              disabled
                            >
                              Send
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ minHeight: "1.2rem" }}
                      className="text-center ms-5 ps-5"
                    >
                      <span
                        className={`ms-4 small ${
                          errorMsg ? "text-danger" : "text-success"
                        }`}
                      >
                        {errorMsg || successMsg}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="mt-4 ps-3 ms-3">
              <div className="w-100 text-start">
                <div className="text-start fs-5 fw-bold my-2">
                  Recent Withdrawals
                </div>
                <div>
                  <span
                    className={`me-4 cursorPointer ${
                      recentType === "crypto_address"
                        ? "fw-bold active_bg_color text-white rounded-1 px-2 py-1"
                        : "opacity-50"
                    }`}
                    onClick={() => {
                      recentType !== "crypto_address" &&
                        getRecentDeposits("crypto_address");
                    }}
                  >
                    Crypto address
                  </span>
                  <span
                    className={`cursorPointer ${
                      recentType === "diamex_user"
                        ? "fw-bold active_bg_color text-white rounded-1 px-2 py-1"
                        : "opacity-50"
                    }`}
                    onClick={() => {
                      recentType !== "diamex_user" &&
                        getRecentDeposits("diamex_user");
                    }}
                  >
                    Diamex user
                  </span>
                </div>
                <div className="mt-3">
                  {apiLoader ? (
                    <div>
                      <>{<Loader />}</>
                    </div>
                  ) : recentData.length > 0 ? (
                    <>
                      {recentData.map((data, i) => {
                        return (
                          <div
                            key={data.transLedgerId}
                            className={`py-3 cursorPointer recent_data_info_container my-0 rounded-1 border border-dark  ${
                              i === recentData.length - 1
                                ? ""
                                : "border-bottom-0"
                            }`}
                            onClick={() => {
                              setSelectedData(data);
                              setModalType("recent");
                            }}
                          >
                            <div className="d-flex recent_data_info w-100 align-items-center px-2">
                              <div className="d-flex align-items-center w-25 text-break">
                                <img
                                  src={assetImageMappings(data.coin)}
                                  style={{ height: "1.6vw", width: "1.6vw" }}
                                  alt="symbol"
                                  className="me-1"
                                />
                                <span className="ps-1">
                                  {formatNumber(data.depositAmount)}&nbsp;
                                  {data.coin}
                                </span>
                              </div>
                              <div className="w-25 text-center">
                                <span>{data.depositWallet || "-"}</span>
                              </div>
                              <div className="w-25 overFlowValue text-center">
                                {data.network !== null ? (
                                  recentType === "crypto_address" ? (
                                    <span>
                                      {data.network === 2
                                        ? "Bitcoin"
                                        : "Ethereum (ERC20)"}
                                    </span>
                                  ) : (
                                    <span className="">{data.diamexId}</span>
                                  )
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
                      })}
                    </>
                  ) : (
                    <>
                      <p className="pt-3 text-center">
                        No recent withdrawal record.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Coin modal */}
      <Modal
        show={modalType === "coin"}
        id="ConvertModal"
        aria-labelledby="example-custom-modal-styling-title"
        className="withdrw_modal"
      >
        <Modal.Body>
          <div className="modalClass  position-relative">
            <div className="d-flex justify-content-between ">
              <h4 className="text-white">Select coin to withdraw</h4>
              <img
                src={crossIcon}
                alt="cross"
                style={{ cursor: "pointer" }}
                className="ms-1"
                onClick={() => {
                  setModalType("");
                }}
              />
            </div>
            <div className="w-100 position-relative">
              <div className="mb-3 pt-2 position-relative w-100">
                <input
                  type="text"
                  className="assetSearchbar searchbar rounded-2 text-white p-2 pe-5 common_input_bg w-100"
                  placeholder="Search"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  value={searchCoin}
                  onChange={(e) => {
                    if (![" "].includes(e.target.value)) {
                      setSearchCoin(e.target.value);
                      // e.target.value.length > 0 &&
                      getAssets(e.target.value, "");
                    }
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
              </div>
              <div className="text-white opacity-75 asset_container">
                {
                  // searchCoin.length > 0 &&
                  assetCoins.map((asset) => {
                    return (
                      <div
                        key={asset.assetSymbol}
                        className="d-flex gap-2 py-2 cursorPointer asset_item rounded-2 align-items-center"
                        onClick={() => {
                          getFundWalletByType(asset.assetId);
                          getSpotWalletByType(asset.assetId);
                          setSelectedCoin(asset);
                          setMinWithdrawAmount(
                            minWithdrawals.filter(
                              (item) => item.name === asset.assetSymbol
                            )[0]?.amount
                          );
                          setSelectedNewNetwork(
                            asset.assetSymbol === "BTC"
                              ? "Bitcoin"
                              : "Ethereum (ERC20)"
                          );
                          setAssetCoins([]);
                          setModalType("");
                          setSearchCoin("");
                        }}
                      >
                        <img
                          src={assetImageMappings(asset.assetSymbol)}
                          style={{ height: "1.9vw", width: "1.9vw" }}
                          alt=""
                        />
                        <span className="d-flex flex-column ps-2">
                          <span>{asset.assetSymbol}</span>
                          <span className="small">{asset.assetName}</span>
                        </span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={modalType === "network"}
        id="ConvertModal"
        aria-labelledby="example-custom-modal-styling-title"
        className="withdrw_modal"
      >
        <Modal.Body>
          <div className="modalClass  position-relative">
            <div className="d-flex justify-content-between ">
              <h4 className="text-white">Select network</h4>
              <img
                src={crossIcon}
                alt="cross"
                style={{ cursor: "pointer" }}
                className="ms-1"
                onClick={() => {
                  setModalType("");
                }}
              />
            </div>
            <p className="text-white py-3">
              Please ensure your receiving platform supports the token and
              network you are withdrawing. If you are unsure, kindly check with
              the receiving platform first.
            </p>
            <div className="w-100 position-relative">
              <div className="text-white">
                {tempNetworks.length > 0 &&
                  tempNetworks.map((network) => {
                    return (
                      <div
                        key={network.label}
                        className="d-flex gap-2 py-2 cursorPointer asset_item rounded-2 flex-column border-bottom border-dark"
                        onClick={() => {
                          setSelectedNewNetwork(network);
                          // setNetworks([]);
                          setModalType("");
                        }}
                      >
                        <div className="d-flex justify-content-between small">
                          <span className="fs-6">{network.label}</span>
                          <span>
                            <span className="opacity-50">Arrival time ≈ </span>
                            <span className="text-white">{network.time}</span>
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="opacity-50">{network.name}</span>
                          <span>
                            <span className="opacity-50">fee </span>
                            <span className="text-white">{network.fee}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={modalType === "recent"}
        id="ConvertModal"
        aria-labelledby="example-custom-modal-styling-title"
        className="withdrw_modal"
        onHide={() => {
          setModalType("");
        }}
      >
        <Modal.Body>
          <div className="modalClass  position-relative px-3 py-2">
            <div className="d-flex justify-content-between my-2">
              <h4 className="text-white">Withdrawal Details</h4>
              <img
                src={crossIcon}
                alt="cross"
                className="ms-1 cursorPointer"
                onClick={() => {
                  setModalType("");
                }}
              />
            </div>
            <div></div>
            <div
              className="w-100 position-relative rounded-2 p-3"
              style={{ backgroundColor: "#292A2C" }}
            >
              <div className="text-white">
                {recentData.length > 0 && (
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
                      <span>{selectedData.coin}</span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">Withdraw amount</span>
                      <span>{formatNumber(selectedData.depositAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between pb-1 gap-3">
                      <span className="opacity-50">
                        {recentType === "crypto_address"
                          ? "Network"
                          : "User id"}
                      </span>
                      {selectedData.network !== null ? (
                        <span>
                          {recentType === "crypto_address"
                            ? selectedData.network === 2
                              ? "Bitcoin"
                              : "Ethereum (ERC20)"
                            : selectedData.diamexId}
                        </span>
                      ) : (
                        <span className="ps-5">-</span>
                      )}
                    </div>
                    {recentType !== "crypto_address" ? (
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
                    ) : (
                      <div className="d-flex justify-content-between pb-1 gap-3">
                        <span className="opacity-50">Address</span>
                        <span className="overFlowValue">
                          {selectedData.address || "-"}
                        </span>
                      </div>
                    )}
                    {selectedData.depositWallet ? (
                      <div className="d-flex justify-content-between pb-1 gap-3">
                        <span className="opacity-50">Withdraw wallet</span>
                        <span>{selectedData.depositWallet}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <NotificationContainer />
    </div>
  );
};

export default SpotWithdraw;
