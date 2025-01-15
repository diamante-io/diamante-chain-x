import React, { useEffect, useState } from "react";
import SideBar from "../../SideBar/SideBar";
import Topbar from "../../Topbar/Topbar";
import SearchIcon from "../../../assets/SearchIcon.svg";
// import DropdownButton from "react-bootstrap/DropdownButton";
import { DropdownButton, Dropdown, Modal } from "react-bootstrap";
import crossIcon from "../../../assets/crossIconx.svg";
import reverseIcon from "../../../assets/reverseIcon2.svg";
import infoIcon from "../../../assets/info (1) 1 (1).svg";
// import Dropdown from "react-bootstrap/Dropdown";
import "../Spot/SpotAsset.css";
import upArrow from "../../../assets/upArrow.svg";
import filterDownArrow from "../../../assets/filterDown.svg";
import { useSelector } from "react-redux";
import { URI } from "../../../constants";
import axios from "axios";
import Loader from "../../common/Loader";
import { assetImageMappings, formatNumber } from "../../commonComponent";
import USDT from "../../../assets/crypto/USDT.png";
import BTC from "../../../assets/crypto/BTC.png";
import SucessGif from "../../../assets/lotties/sucess.json";
import refresh_loader from "../../../assets/refresh_loader.svg";
import Lottie from "react-lottie";
import EyeIcon from "../../../assets/Eye.svg";
import CloseEye from "../../../assets/closeEye.svg";
import { useNavigate } from "react-router-dom";
import downArrow from "../../../assets/Line 9.svg";
import dropdownIcon from "../../../assets/dropdownIcon.svg";

const FundingAsset = () => {
  const [toggle, setToggle] = useState(false);
  const [selectedOption, setSelectOption] = useState("BTC");
  const [openModal, setOpenModal] = useState("");
  const [convertOpenModal, setConvertOpenModal] = useState(false);
  const [fromWalletBal, setFromWalletBal] = useState([]);
  const [convertBalSpot, setConvertBalSpot] = useState([]);
  const [convertBalFund, setConvertBalFund] = useState([]);
  const [fromWallet, setFromWallet] = useState("Funding Wallet");
  const [toWallet, setToWallet] = useState("Spot Wallet");
  const [amount, setAmount] = useState("");
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({
    name: assets[0]?.assetSymbol,
    id: assets[0]?.assetId,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fundBalance, setFundBalance] = useState(0);
  const [toInputConvertValue, setToInputConvertValue] = useState("");
  const [fromInputConvertValue, setFromInputConvertValue] = useState("");
  const [isSpotChecked, setIsSpotChecked] = useState(true);
  const [isFundingChecked, setIsFundingChecked] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [selectSourceAssetId, setSelectSourceAssetId] = useState({
    assetId: 2,
    assetName: "Bitcoin",
    assetPercision: 8,
    assetSymbol: "BTC",
    isDeposit: 1,
    isTransfer: 1,
    isWithdraw: 1,
    minAmountMovement: 0.00001,
  });
  const [selectTargetAssetId, setSelectTargetAssetId] = useState({
    assetId: 3,
    assetName: "Etherium",
    assetPercision: 8,
    assetSymbol: "ETH",
    isDeposit: 1,
    isTransfer: 1,
    isWithdraw: 1,
    minAmountMovement: 0.0001,
  });
  const [rate, setRate] = useState([]);
  const [searchSelectModal, setSearchSelectModal] = useState(false);
  const [selectedInputFromAsset, setSelectedFromAsset] = useState("BTC");
  const [searchSelecToModal, setSearchSelectToModal] = useState(false);
  const [selectToAsset, setSelectedToAsset] = useState("ETH");
  const [assetSearchFromList, setAssetSearchFromList] = useState([]);
  const [inputAssetSearchValue, setInputAssetSearchValue] = useState("");
  const [confirmAssetModal, setConfirmAssetModal] = useState(false);
  const [inputAssetSearchToValue, setInputAssetSerachToValue] = useState("");
  const [assetSearchToList, setAssetSearchToList] = useState([]);
  const [confirmSuccessModal, setConfirmSuccessModal] = useState(false);
  const [filterCoin, setFilterCoin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceShow, setIsBalanceShow] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [spotAssetBalance, setSpotAssetBalance] = useState([]);
  const [fundAssetBalance, setFundAssetBalance] = useState([]);

  const { customerId, isFromDashboard } = useSelector(
    (stat) => stat.ChangeState
  );
  const [walletType, setWalletType] = useState({
    isSpot: false,
    isFunding: true,
  });
  const [sortedFilteredWallets, setSortedFilteredWallets] =
    useState(convertBalSpot);
  const [coinSortOder, setCoinSortOder] = useState(1);
  const [totalSortOder, setTotalSortOder] = useState(1);
  const [availableSortOder, setAvailableSortOder] = useState(1);

  const navigate = useNavigate();
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SucessGif,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getConvertWallet = async () => {
    setIsLoading(true);
    // const sourceWalletId =
    //   isSpotChecked && isFundingChecked
    //     ? 2
    //     : isSpotChecked
    //     ? 1
    //     : isFundingChecked
    //     ? 2
    //     : 0;

    // const spotFundWalletsId = isSpotChecked && isFundingChecked ? 1 : 0;
    const sourceWalletId =
      walletType.isSpot && walletType.isFunding
        ? 2
        : walletType.isSpot
        ? 1
        : walletType.isFunding
        ? 2
        : 0;

    const spotFundWalletsId = walletType.isSpot && walletType.isFunding ? 1 : 0;
    const curPrice =
      activeInput === "to"
        ? Number(toInputConvertValue)
        : Number(fromInputConvertValue);

    let fromAssetId = assetSearchFromList.filter(
      (asset) => asset.assetSymbol === selectedInputFromAsset
    )[0]?.assetId;
    let toAssetId = assetSearchFromList.filter(
      (asset) => asset.assetSymbol === selectToAsset
    )[0]?.assetId;

    const requestBody = {
      customerId: customerId,
      sourceAssetId: fromAssetId,
      targetAssetId: toAssetId,
      // sourceAssetId: selectSourceAssetId?.assetId,
      // targetAssetId: selectTargetAssetId?.assetId,
      assetQty:
        fromInputConvertValue === ""
          ? formatNumber(toInputConvertValue / rate)
          : formatNumber(fromInputConvertValue),
      curPrice: rate,
      sourceWalletId: sourceWalletId,
      spotFundWalletsId: spotFundWalletsId,
    };

    await axios
      .post(URI.convertWallet, requestBody, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          // setConfirmSuccessModal(true);
          getFromWalletBalance("Fund Wallet", "etimatedBalance");
          setTimeout(() => {
            setConfirmSuccessModal(false);
            setToInputConvertValue("");
            setFromInputConvertValue("");
          }, 2000);
        } else {
          setIsLoading(false);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const fetchRateData = async (asset1, asset2) => {
    axios
      .get(
        `https://min-api.cryptocompare.com/data/price?fsym=${asset1}&tsyms=${asset2}`
      )
      .then((res) => {
        setRate(res.data[asset2]);
      });
  };

  const getAssets = async (searchString) => {
    axios
      .get(
        URI.getAssetsBySearch +
          `${searchString !== "" ? `/${searchString}` : ""}`,
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.status === 200) {
          setAssetSearchFromList(response.data.data.assetList);
          setAssetSearchToList(response.data.data.assetList);
          setAssets(response.data.data.assetList);
          setSelectedAsset({
            name: response.data.data.assetList[0]?.assetSymbol,
            id: response.data.data.assetList[0]?.assetId,
          });
        } else {
          setAssets([]);
          setAssetSearchFromList([]);
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

  const getFromWalletBalance = async (walletType, type) => {
    setIsLoading(true);
    let URL =
      walletType === "Spot Wallet" ? URI.getSpotWallet : URI.getFundWallet;
    axios
      .get(URL + "/" + customerId, {
        headers: headers,
      })
      .then(async (response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          if (walletType === "Spot Wallet") {
            setFromWalletBal(response.data.data);
            // setSpotAssetBalance(response.data.data);
            setConvertBalSpot(response.data.data);
          } else {
            setConvertBalFund(response.data.data.fundWalletDetailsList);
            setFromWalletBal(response.data.data.fundWalletDetailsList);
            setSortedFilteredWallets(response.data.data.fundWalletDetailsList);
            if (type !== "") {
              setFundBalance(
                await getCurrentBalance(
                  response.data.data.fundWalletDetailsList,
                  selectedInputFromAsset
                )
              );
            }
          }
        } else {
          setIsLoading(false);
          setConvertBalFund([]);
          console.log(response.data.message);
        }
      })

      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const walletTransfer = async () => {
    setBtnLoader(true);
    const payload = {
      customerId,
      assetId: selectedAsset.id,
      amount,
      sourceWalletId: fromWallet === "Spot Wallet" ? 1 : 2,
      targetWalletId: toWallet === "Spot Wallet" ? 1 : 2,
    };
    axios
      .post(URI.walletTransfer, payload, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setBtnLoader(false);
          setSelectedAsset((prev) => prev);
          setAmount("");
          setSuccessMsg(response.data.message);
          getFromWalletBalance("Fund Wallet", "etimatedBalance");
          setTimeout(() => {
            setSuccessMsg("");
            setOpenModal("");
          }, 3000);
        } else {
          setErrorMsg(response.data.message);
          setTimeout(() => {
            setBtnLoader(false);
            setErrorMsg("");
          }, 3000);
        }
      })

      .catch((error) => {
        setBtnLoader(false);
        setErrorMsg(error.message);
        setTimeout(() => {
          setErrorMsg("");
        }, 4000);
      });
  };

  useEffect(() => {
    getFromWalletBalance("Spot Wallet", "");
    getFromWalletBalance(fromWallet, "etimatedBalance");
    fetchRateData(selectedInputFromAsset, selectToAsset);
    getAssets("");
  }, []);

  const showConvertAssetBal = (assetType) => {
    let valOne =
      spotAssetBalance?.filter((ele) => ele.assetSymbol === assetType).length >
      0
        ? formatNumber(
            spotAssetBalance?.filter((ele) => ele.assetSymbol === assetType)[0]
              .wallCurrBal
          )
        : 0;
    let valTwo =
      fundAssetBalance?.filter((ele) => ele.assetSymbol === assetType).length >
      0
        ? formatNumber(
            fundAssetBalance?.filter((ele) => ele.assetSymbol === assetType)[0]
              .wallCurrBal
          )
        : 0;
    return formatNumber(parseFloat(valOne) + parseFloat(valTwo));
  };

  const FetchData = async (type) => {
    setFundBalance(await getCurrentBalance(convertBalFund, type));
  };

  const sortedData = (type, order) => {
    const filteredWallets = convertBalFund.filter((wallet) =>
      wallet.assetSymbol.toLowerCase().includes(filterCoin.toLowerCase())
    );

    let result = filteredWallets;
    if (order === 1) {
      result =
        type === "coin"
          ? result.sort((a, b) => a.assetSymbol.localeCompare(b.assetSymbol))
          : type === "total"
          ? result.sort((a, b) => a.totalWallBal - b.totalWallBal)
          : result.sort((a, b) => a.wallCurrBal - b.wallCurrBal);
    } else if (order === 2) {
      // result = result.sort((a, b) => b.price - a.price);
      result =
        type === "coin"
          ? result.sort((a, b) => b.assetSymbol.localeCompare(a.assetSymbol))
          : type === "total"
          ? result.sort((a, b) => b.totalWallBal - a.totalWallBal)
          : result.sort((a, b) => b.wallCurrBal - a.wallCurrBal);
    } else {
      result = filteredWallets;
    }

    setSortedFilteredWallets(result);
  };

  const assetSelectModalFromView = () => {
    const filteredAssets = assetSearchFromList.filter(
      (item) =>
        item.assetSymbol !== selectToAsset &&
        item.assetSymbol
          .toLowerCase()
          .includes(inputAssetSearchValue.toLowerCase())
    );

    return (
      <>
        <Modal
          show={searchSelectModal}
          id="assetSearchFromToModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center assetSearchFromTOModal"
        >
          <Modal.Body>
            <div className="modalClass  position-relative">
              <div className="d-flex justify-content-between pt-2 px-2">
                <h5
                  style={{ color: "#ffffff", fontSize: "1.5vw" }}
                  className="ps-2"
                >
                  Select Currency
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setSearchSelectModal(false);
                  }}
                />
              </div>

              <div className="d-flex justify-content-center align-items-center mt-2 pb-2 ms-2">
                <input
                  type="text"
                  value={inputAssetSearchValue}
                  onChange={(e) => setInputAssetSearchValue(e.target.value)}
                  className="inputbox_searchcoin ps-2 py-2 pe-5"
                  placeholder="Search coin"
                />
                <img src={SearchIcon} alt="search" className="SearchIcon" />
              </div>

              {filteredAssets.length > 0 ? (
                <>
                  <div className="text-white justify-content-center d-flex flex-column assetSearch_main">
                    {filteredAssets.map((item) => {
                      return (
                        <div
                          className="pb-2 cursorPointer"
                          key={item.assetSymbol}
                        >
                          <div
                            className="d-flex assetListSymbol "
                            onClick={() => {
                              setSelectedFromAsset(item.assetSymbol);
                              setSelectSourceAssetId(item);
                              setSearchSelectModal(false);
                              fetchRateData(item.assetSymbol, selectToAsset);
                            }}
                          >
                            <div className="d-flex gap-2 px-3 py-1">
                              <span>
                                <img
                                  src={assetImageMappings(item.assetSymbol)}
                                  height={29}
                                  width={30}
                                  alt="logo"
                                />
                              </span>
                              <div className="d-flex flex-column align-items-center justify-content-center">
                                <span> {item.assetSymbol} </span>
                                {/* <span>                         ({item.assetSymbol}) </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const assetSelectModalToView = () => {
    const filteredToAssets = assetSearchToList.filter(
      (item) =>
        item.assetSymbol !== selectedInputFromAsset &&
        item.assetSymbol
          .toLowerCase()
          .includes(inputAssetSearchToValue.toLowerCase())
    );

    return (
      <>
        <Modal
          show={searchSelecToModal}
          id="assetSearchFromToModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center assetSearchFromTOModal"
        >
          <Modal.Body>
            <div className="modalClass  position-relative">
              <div className="d-flex justify-content-between px-2 pt-2">
                <h5
                  style={{ color: "#ffffff", fontSize: "1.5vw" }}
                  className="ps-2"
                >
                  Select Currency
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setSearchSelectToModal(false);
                  }}
                />
              </div>
              <div className=" d-flex justify-content-center align-items-center mt-2 pb-2 ms-2">
                <input
                  type="text"
                  value={inputAssetSearchToValue}
                  onChange={(e) => setInputAssetSerachToValue(e.target.value)}
                  className="inputbox_searchcoin ps-2 py-2 pe-5"
                  placeholder="Search coin"
                />
                <img src={SearchIcon} alt="search" className="SearchIcon" />
              </div>

              {filteredToAssets.length > 0 ? (
                <>
                  <div className=" text-white justify-content-center d-flex flex-column assetSearch_main">
                    {filteredToAssets.map((item) => {
                      return (
                        <div
                          className="pb-2 cursorPointer"
                          key={item.assetSymbol}
                        >
                          <div
                            className="d-flex assetListSymbol "
                            onClick={() => {
                              setSelectedToAsset(item.assetSymbol);
                              setSelectTargetAssetId(item);
                              setSearchSelectToModal(false);
                              fetchRateData(
                                selectedInputFromAsset,
                                item.assetSymbol
                              );
                            }}
                          >
                            <div className="d-flex gap-2 px-3 py-1">
                              <span>
                                <img
                                  src={assetImageMappings(item.assetSymbol)}
                                  height={30}
                                  width={30}
                                  alt="logo"
                                />
                              </span>
                              <div className="d-flex flex-column align-items-center justify-content-center">
                                <span> {item.assetSymbol} </span>
                                {/* <span>                         ({item.assetSymbol}) </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const confirmAssetModalView = () => {
    return (
      <div>
        <Modal
          show={confirmAssetModal}
          id="ConvertModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center"
        >
          <Modal.Body>
            <div className="modalClass  position-relative">
              <div className="d-flex justify-content-between ">
                <h5 style={{ color: "#ffffff", fontSize: "1.5vw" }}>
                  {" "}
                  Confirm
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setConfirmAssetModal(false);
                    setToInputConvertValue("");
                    setFromInputConvertValue("");
                  }}
                />
              </div>

              <div className="convertAsset_main_container d-flex flex-column ">
                <div className="convertFrom_container  px-2  py-2 rounded-2">
                  <div className="d-flex justify-content-between">
                    <p className="text-white d-flex gap-1 pt-2">
                      <img
                        src={assetImageMappings(selectedInputFromAsset)}
                        height={40}
                        width={40}
                        alt="img"
                      />
                      <span className="pt-2 text-break">
                        {" "}
                        {fromInputConvertValue === ""
                          ? formatNumber(toInputConvertValue / rate)
                          : formatNumber(fromInputConvertValue)}
                      </span>
                      {/* <span className="pt-2">USDT</span> */}
                    </p>
                    <p className="py-1  pt-3 px-2 fs-5 text-white opacity-75  rounded-1">
                      {selectedInputFromAsset}
                    </p>
                  </div>
                </div>
                <span className="ps-3">
                  <img src={downArrow} height={20} width={20} alt="img" />
                </span>
                <div className="convertTo_container  px-2 py-2 rounded-2">
                  <div className="d-flex justify-content-between">
                    <p className="text-white d-flex gap-1 pt-2">
                      <img
                        // src={BTC}
                        src={assetImageMappings(selectToAsset)}
                        height={40}
                        width={40}
                        alt="img"
                      />

                      <span className="pt-2 text-break">
                        {toInputConvertValue === ""
                          ? formatNumber(fromInputConvertValue * rate)
                          : formatNumber(toInputConvertValue)}
                      </span>
                    </p>
                    <span className="py-1 px-2 text-white fs-5 opacity-75  rounded-1 pt-3 ">
                      {selectToAsset}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="reverseIconLogoConfirm">
                <span className="position-absolute reverse_img_container_confirmModal">
                  <img src={reverseIcon} alt="img" height={40} width={40} />
                </span>
              </div> */}

              <div className="confirmContent common_border_bg text-white  py-2 rounded-2">
                <div className="d-flex justify-content-between pt-1 px-2 opacity-50">
                  <span>Rate</span>
                  <div className="pt-1 opacity-75 text-white d-flex gap-1">
                    {/* 1USDT=0.99343874 FDUSD */}
                    <span>1 {selectedInputFromAsset} =</span>
                    <span>{rate}</span>
                    <span>{selectToAsset}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between pt-2 px-2 opacity-50">
                  <span>Payment Method</span>
                  <span>
                    {walletType.isSpot && walletType.isFunding
                      ? "Spot Wallet + Funding Wallet"
                      : walletType.isSpot
                      ? "Spot Wallet"
                      : walletType.isFunding
                      ? "Funding Wallet"
                      : "-"}
                  </span>
                </div>
                <div className="d-flex justify-content-between pt-2 px-2 opacity-50">
                  <span>Transaction Fees</span>
                  <span>No Fees</span>
                </div>
                <div className="d-flex justify-content-between pt-2 mt-2  w-100  ">
                  <span className="ps-2 fs-5">You will receive</span>
                  <p className="pe-1 ">
                    {toInputConvertValue === ""
                      ? formatNumber(fromInputConvertValue * rate)
                      : formatNumber(toInputConvertValue)}{" "}
                    {selectToAsset}
                  </p>
                </div>
              </div>

              <div className="d-flex mt-4  py-4 d-flex justify-content-center">
                <button
                  className="continueButtonConvert bg-primary"
                  disabled={isLoading}
                  onClick={() => {
                    setConfirmAssetModal(false);
                    setConfirmSuccessModal(!confirmSuccessModal);
                    getConvertWallet();
                  }}
                >
                  {isLoading ? (
                    <img
                      src={refresh_loader}
                      style={{ width: 20 }}
                      className="spinner"
                      alt=""
                    />
                  ) : null}{" "}
                  Confirm Conversion
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const confirmResultSuccessModal = () => {
    return (
      <div>
        <Modal
          show={confirmSuccessModal}
          id="ConvertModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center"
        >
          <Modal.Body>
            <div className="modalClass  position-relative">
              <div className="d-flex justify-content-between ">
                <h5 style={{ color: "#ffffff", fontSize: "1.2vw" }}>
                  {" "}
                  Conversion Result
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setConfirmSuccessModal(false);
                  }}
                />
              </div>

              <div
                className="convertAsset_main_container d-flex flex-column gap-3 pb-4 "
                style={{ height: "30vh" }}
              >
                <div className="py-4">
                  <Lottie options={defaultOptions} height="18vh" width="25vw" />
                </div>
              </div>

              <div className="confirmContent common_border_bg text-white  py-2 rounded-2">
                <div className="d-flex justify-content-between pt-1 px-2">
                  <span>Rate</span>
                  <div className="pt-1 opacity-75 text-white d-flex gap-1">
                    {/* 1USDT=0.99343874 FDUSD */}
                    <span>1 {selectedInputFromAsset} =</span>
                    <span>{rate}</span>
                    <span>{selectToAsset}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between pt-2 px-2">
                  <span>Payment Method</span>
                  <span>
                    {walletType.isSpot && walletType.isFunding
                      ? "Spot Wallet + Funding Wallet"
                      : walletType.isSpot
                      ? "Spot Wallet"
                      : walletType.isFunding
                      ? "Funding Wallet"
                      : "-"}
                  </span>
                </div>
                <div className="d-flex justify-content-between pt-2 px-2">
                  <span>Transaction Fees</span>
                  <span>No Fees</span>
                </div>
                <div className="d-flex justify-content-between pt-2 mt-2  w-100 receiveContainer ">
                  <span className="ps-2 fs-5">You will receive</span>
                  <p className="pe-1">
                    {toInputConvertValue === ""
                      ? formatNumber(fromInputConvertValue * rate)
                      : formatNumber(toInputConvertValue)}{" "}
                    {selectToAsset}
                  </p>
                </div>
              </div>
              {/* 
              <div className="d-flex  py-3 gap-3">
                <button
                  className="btn btn-secondary successModalbtn "
                  onClick={() => {
                    // getConvertWallet();
                    setConfirmSuccessModal(false);
                  }}
                >
                  Convert Again
                </button>

                <button
                  className="btn btn-primary  successModalbtn"
                  onClick={() => {
                    setConfirmSuccessModal(false);
                  }}
                >
                  Ok
                </button>
              </div> */}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const convertModalView = () => {
    return (
      <div>
        <Modal
          show={convertOpenModal}
          id="ConvertModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center"
        >
          <Modal.Body>
            <div className="modalClass  position-relative">
              <div className="d-flex justify-content-between ">
                <h5 style={{ color: "#ffffff", fontSize: "1.5vw" }}>
                  {" "}
                  Convert
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setConvertOpenModal(false);
                    setToInputConvertValue("");
                    setFromInputConvertValue("");
                  }}
                />
              </div>
              <div className="d-flex justify-content-between pt-2 pb-2">
                <div className="text-white d-flex gap-1">
                  <span className="pt-1 opacity-75 fs-6">Wallet</span>
                  <span className="pt-1">
                    {" "}
                    <img src={infoIcon} alt="img" width={15} height={15} />{" "}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  {/* <input
                    type="checkbox"
                    checked={isSpotChecked}
                    onChange={() => {
                      setIsSpotChecked(!isSpotChecked);
                    }}
                  /> */}
                  <input
                    type="checkbox"
                    checked={walletType.isSpot}
                    onChange={(e) => {
                      e.target.checked
                        ? setSpotAssetBalance(convertBalSpot)
                        : (() => {
                            setFundAssetBalance(convertBalFund);
                            setSpotAssetBalance([]);
                          })();
                      setWalletType({
                        isSpot: e.target.checked,
                        isFunding: walletType.isFunding || !e.target.checked,
                      });
                    }}
                  />
                  <span className="text-white opacity-75">Spot</span>
                  {/* <input
                    type="checkbox"
                    checked={isFundingChecked}
                    onChange={() => {
                      setIsFundingChecked(!isFundingChecked);
                    }}
                  /> */}
                  <input
                    type="checkbox"
                    checked={walletType.isFunding}
                    onChange={(e) => {
                      setWalletType({
                        isFunding: e.target.checked,
                        isSpot: walletType.isSpot || !e.target.checked,
                      });
                      e.target.checked
                        ? setFundAssetBalance(convertBalFund)
                        : (() => {
                            setSpotAssetBalance(convertBalSpot);
                            setFundAssetBalance([]);
                          })();
                    }}
                  />
                  <span className="text-white opacity-75">Funding</span>
                </div>
              </div>
              <div className="convertAsset_main_container d-flex flex-column gap-3">
                <div className="convertFrom_container common_border_bg px-2  py-2 rounded-2 pb-4">
                  <div className="d-flex justify-content-between">
                    <span className="text-white">From</span>
                    <span className="py-1 px-1 text-white opacity-75 balanceText rounded-1">
                      Balance:{" "}
                      {spotAssetBalance?.length > 0 ||
                      fundAssetBalance?.length > 0
                        ? showConvertAssetBal(selectedInputFromAsset)
                        : 0}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between pt-2 w-100">
                    <div
                      className=" pt-3 cursorPointer w-25"
                      onClick={() => {
                        setInputAssetSearchValue("");
                        setSearchSelectModal(!searchSelectModal);
                      }}
                    >
                      <p className="text-white d-flex gap-2 m-0 selectedAssetInput_container cursor_pointer px-3 py-1   rounded-2">
                        {selectedInputFromAsset}
                        <span>
                          <img
                            src={dropdownIcon}
                            height={12}
                            width={12}
                            alt="img"
                          />
                        </span>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between pt-2 mt-2 ps-4 w-75">
                      <input
                        style={{ width: "65%" }}
                        placeholder="0.00"
                        className="convertInput"
                        value={fromInputConvertValue}
                        // onChange={(e) => {
                        //   setToInputConvertValue("");
                        //   setFromInputConvertValue(e.target.value);
                        //   setActiveInput("from");
                        // }}
                        onChange={(e) => {
                          e.target.value.charAt(0) !== "." &&
                            setFromInputConvertValue(
                              e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                            );
                          setActiveInput("from");
                          setToInputConvertValue("");
                        }}
                      />
                      <span
                        className="opacity-75  pt-2  text-white pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        0.01-130000001
                      </span>
                    </div>
                  </div>
                </div>

                <div className="convertTo_container common_border_bg px-2 py-2 rounded-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-white">To</span>
                    <span className="py-1 px-1 text-white opacity-75 balanceText rounded-1 ">
                      Balance:{" "}
                      {spotAssetBalance?.length > 0 ||
                      fundAssetBalance?.length > 0
                        ? showConvertAssetBal(selectToAsset)
                        : 0}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between pt-2 w-100">
                    <div
                      className=" pt-3 cursorPointer w-25"
                      onClick={() => {
                        setInputAssetSerachToValue("");
                        setSearchSelectToModal(!searchSelecToModal);
                      }}
                    >
                      <p className="text-white d-flex gap-2 m-0 selectedAssetInput_container cursor_pointer px-3 py-1   rounded-2">
                        {selectToAsset}
                        <span>
                          <img
                            src={dropdownIcon}
                            height={12}
                            width={12}
                            alt="img"
                          />
                        </span>
                      </p>
                    </div>

                    <div className="d-flex justify-content-between pt-2 mt-2 ps-4 w-75">
                      <input
                        style={{ width: "65%" }}
                        placeholder="0.00"
                        className="convertInput"
                        value={toInputConvertValue}
                        // onChange={(e) => {
                        //   setFromInputConvertValue("");
                        //   setToInputConvertValue(e.target.value);
                        //   setActiveInput("to");
                        // }}

                        onChange={(e) => {
                          e.target.value.charAt(0) !== "." &&
                            setToInputConvertValue(
                              e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                            );
                          setFromInputConvertValue("");
                          setActiveInput("to");
                        }}
                      />
                      <span
                        className="opacity-75  pt-2  text-white pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        0.01-13000000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="reverseIconLogo cursorPointer"
                onClick={() => {
                  fetchRateData(selectToAsset, selectedInputFromAsset);
                  setSelectedFromAsset(selectToAsset);
                  setSelectedToAsset(selectedInputFromAsset);
                  setFromInputConvertValue("");
                  setToInputConvertValue("");
                }}
              >
                <span className="position-absolute reverse_img_container">
                  <img src={reverseIcon} alt="img" height={40} width={40} />
                </span>
              </div>
              <div style={{ height: "1.8rem" }} className="small">
                {Number(fromInputConvertValue) >=
                  Number(showConvertAssetBal(selectedInputFromAsset)) &&
                Number(showConvertAssetBal(selectedInputFromAsset)) !== 0 ? (
                  <span className="text_danger">Insufficient Balance</span>
                ) : (
                  <> </>
                )}{" "}
                {Number(toInputConvertValue) >=
                  Number(showConvertAssetBal(selectToAsset)) &&
                Number(showConvertAssetBal(selectToAsset)) !== 0 ? (
                  <span className="text_danger">Insufficient Balance</span>
                ) : (
                  <> </>
                )}{" "}
              </div>
              <div className="d-flex justify-content-between pt-4">
                <div className="text-white d-flex gap-1">
                  <span className="pt-1 opacity-75 fs-6">Rate</span>
                  <span className="pt-1">
                    {" "}
                    <img src={infoIcon} alt="img" width={15} height={15} />{" "}
                  </span>
                </div>
                <div className="pt-1 opacity-75 text-white d-flex gap-1">
                  {/* 1USDT=0.99343874 FDUSD */}
                  <span>1 {selectedInputFromAsset} =</span>
                  <span>{rate}</span>
                  <span>{selectToAsset}</span>
                </div>
              </div>
              <div className="d-flex d-flex justify-content-center  pt-4 pb-3">
                {toInputConvertValue !== "" ||
                (fromInputConvertValue !== "" && fromInputConvertValue > 0) ? (
                  <button
                    // className="continueButtonConvert bg-primary"
                    className={
                      fromInputConvertValue !== "" &&
                      Number(fromInputConvertValue) >
                        Number(showConvertAssetBal(selectedInputFromAsset))
                        ? "continueButtonConvert bg-primary opacity-75"
                        : "continueButtonConvert bg-primary "
                    }
                    onClick={() => {
                      setConfirmAssetModal(!confirmAssetModal);
                      setConvertOpenModal(!convertOpenModal);
                    }}
                    disabled={
                      fromInputConvertValue !== "" &&
                      Number(fromInputConvertValue) >
                        Number(showConvertAssetBal(selectedInputFromAsset))
                    }
                  >
                    Convert{" "}
                  </button>
                ) : (
                  <button
                    className="continueButtonConvertDisable "
                    style={{ cursor: "not-allowed" }}
                    // onClick={() => {
                    //   setConfirmAssetModal(!confirmAssetModal);
                    //   setOpenModal(!openModal);
                    // }}
                  >
                    Enter Amount{" "}
                  </button>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
        {assetSelectModalFromView()}
        {assetSelectModalToView()}
        {confirmAssetModalView()}
        {confirmResultSuccessModal()}
      </div>
    );
  };

  const handleTransfer = () => {
    return (
      <div>
        <Modal
          show={openModal === "transfer"}
          id="deleteBeneficiaryModal"
          aria-labelledby="example-custom-modal-styling-title"
          className="d-flex justify-content-center align-items-center"
        >
          <Modal.Body>
            <div className="modalClass">
              <div className="d-flex justify-content-between ms-4">
                <h5 style={{ color: "#ffffff", fontSize: "1.2vw" }}>
                  Transfer
                </h5>
                <img
                  src={crossIcon}
                  alt="cross"
                  style={{ cursor: "pointer" }}
                  className="ms-1"
                  onClick={() => {
                    setOpenModal("");
                    setAmount("");
                    setErrorMsg("");
                    setSuccessMsg("");
                    setSelectedAsset({
                      name: assets[0]?.assetSymbol,
                      id: assets[0]?.assetId,
                    });
                    // setSelectedTab("deposit");
                    // setSelectPage("deposit");
                  }}
                />
              </div>
              <div className="mt-4 ms-4">
                <p style={{ color: "#ffffff", fontSize: "1.2vw" }}>
                  lorem ipsum lorem ipsum lorem
                </p>
              </div>
              <div className="FiatBoxContent ms-4 mt-4 position-relative">
                <div className="d-flex gap-3 px-2 py-2">
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>
                    From
                    <div className="ms-2 mt-3 vertical_line position-relative">
                      <span className="position-absolute arrow_icon_reward" />
                    </div>
                  </div>
                  {/* <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>
                    Spot wallet
                  </div> */}
                  <div className="text-white ps-3">{fromWallet}</div>
                </div>
                <span className="position-relative reverseIcon">
                  <img
                    src={reverseIcon}
                    height={30}
                    width={30}
                    alt="img"
                    className="cursorPointer"
                    onClick={() => {
                      setToWallet(fromWallet);
                      setFromWallet(toWallet);
                      setFromWalletBal(
                        toWallet === "Spot Wallet"
                          ? convertBalSpot
                          : convertBalFund
                      );
                    }}
                  />
                </span>

                <div className="d-flex gap-4 px-2 py-2">
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>To</div>
                  <div className="text-white text-center ps-4">{toWallet}</div>
                </div>
              </div>
              <div className="mt-3 ms-4">
                <div className="mt-1">
                  <label
                    style={{ color: "#ffffff", fontSize: "1vw" }}
                    className="ms-2"
                  >
                    Coin
                  </label>
                </div>
                <div className="pt-2">
                  <DropdownButton
                    title={selectedAsset.name || ""}
                    id="dropdown-transfer-modal"
                    className="order_book_Value_dropdown rounded-2 spot_transfer_dropdown"
                  >
                    {assets.map((asset) => {
                      return (
                        <Dropdown.Item
                          eventKey={asset.assetSymbol}
                          onClick={() => {
                            setSelectedAsset({
                              name: asset.assetSymbol,
                              id: asset.assetId,
                            });
                          }}
                          key={asset.assetSymbol}
                        >
                          {asset.assetSymbol}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
                <div
                  className="mt-1 d-flex justify-content-between "
                  style={{ width: "18vw" }}
                >
                  <label
                    style={{ color: "#ffffff", fontSize: "1vw" }}
                    className="mt-2 ms-2"
                  >
                    Amount
                  </label>
                  {/* <span 
                   className="mt-2 ms-2 text-white opacity-75 pt-2"
                  > 0.0000 available/0.0000 in Order</span> */}
                </div>

                <div className="mt-1">
                  <input
                    type="text"
                    className="inputBoxTransfer ps-2 py-1"
                    placeholder="Enter amount"
                    value={/^[0-9.]+$/.test(amount) ? amount : ""}
                    onChange={(e) => {
                      e.target.value !== "." &&
                        !e.target.value.includes("..") &&
                        setAmount(e.target.value);
                    }}
                  />
                </div>
                <div className="text-secondary small">
                  <span>Available balance:</span>
                  <span className="ps-1">
                    {fromWalletBal.filter(
                      (ele) => ele.assetSymbol === selectedAsset.name
                    ).length > 0
                      ? formatNumber(
                          fromWalletBal.filter(
                            (ele) => ele.assetSymbol === selectedAsset.name
                          )[0].wallCurrBal
                        )
                      : "0"}
                  </span>
                </div>
              </div>
              <div className="d-flex mt-3  justify-content-center py-4">
                {amount <=
                  fromWalletBal?.filter(
                    (ele) => ele.assetSymbol === selectedAsset.name
                  )[0]?.wallCurrBal &&
                amount > 0 &&
                selectedAsset?.name !== undefined ? (
                  <button
                    className="btn w-75 btn-primary "
                    onClick={() => {
                      walletTransfer();
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
                    ) : null}{" "}
                    Confirm
                  </button>
                ) : (
                  <button className="btn w-75 btn-primary opacity-50" disabled>
                    Confirm
                  </button>
                )}
              </div>
              <div style={{ minHeight: "1.2rem" }} className="text-center">
                {
                  <span
                    className={`small ${
                      errorMsg ? "text-danger" : "text-success"
                    }`}
                  >
                    {errorMsg || successMsg}
                  </span>
                }
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <div
        // className={
        //   toggle
        //     ? "dashboard_toggle_main_container"
        //     : "dashboard_profile_container"
        // }
        className={
          toggle
            ? `${
                isFromDashboard
                  ? "dashboard_main_container"
                  : "dashboard_toggle_main_container"
              }`
            : `${
                isFromDashboard
                  ? "dashboard_main_container"
                  : "dashboard_profile_container"
              }`
        }
      >
        <SideBar
          activePage={"fundingAsset"}
          setToggle={setToggle}
          toggle={toggle}
        />
        <div className="ms-3 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
          <div>
            <Topbar />
          </div>

          <article className="spotAsset_main_contentContainer w-100  gap-4 d-flex justify-content-center align-items-center flex-column">
            <div className="spotAsset_header   balanceContainer rounded-2">
              <div className="d-flex justify-content-between py-2">
                <div className="d-flex flex-column text-start gap-2">
                  <h2 className=" opacity-75">Funding</h2>
                </div>

                <div className="d-flex h-50 gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/deposit")}
                  >
                    Deposit
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => navigate("/spot-withdraw")}
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      // setSelectedTab("transfer");
                      setOpenModal("transfer");
                      setFromWalletBal(
                        fromWallet === "Spot Wallet"
                          ? convertBalSpot
                          : convertBalFund
                      );
                    }}
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>

            <div className="balanceContainer d-flex justify-content-between gap-2">
              <div className="w-100 common_border_bg   rounded-2 py-3 ">
                <div className="d-flex  justify-content-start gap-5 ps-5  ">
                  <div className="text_dropdown d-flex gap-2 pt-2">
                    <p className="fs-4 opacity-75 d-flex gap-1">
                      Estimated Balance
                      <span
                        className="ps-2"
                        onClick={() => setIsBalanceShow(!isBalanceShow)}
                      >
                        <img
                          src={!isBalanceShow ? CloseEye : EyeIcon}
                          alt="eye"
                          className="ms-2 mb-1"
                          height={20}
                          width={20}
                        />
                      </span>
                    </p>
                  </div>
                  <div className="dropdown pt-2 mt-2">
                    {/* <select
                      className="rounded-3 px-2  "
                      style={{
                        outline: "none",
                        color: "#FAB446",
                        backgroundColor: " #f5f5f533",
                      }}
                    >
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>LTC</option>
                    </select> */}

                    <DropdownButton
                      title={selectedOption}
                      id="dropdown_Asset_limit"
                      onSelect={(key) => {
                        setSelectOption(key);
                        FetchData(key);
                      }}
                      className="order_book_Value_dropdown rounded-2"
                      style={{ backgroundColor: "#f5f5f533", color: "#FFFF00" }}
                    >
                      {/* <Dropdown.Item eventKey="BTC">BTC</Dropdown.Item>
                      <Dropdown.Item eventKey="ETH">ETH</Dropdown.Item>
                      <Dropdown.Item eventKey="LTC">LTC</Dropdown.Item> */}

                      {assets.map((asset) => {
                        return (
                          <Dropdown.Item
                            eventKey={asset.assetSymbol}
                            key={asset.assetSymbol}
                          >
                            {asset.assetSymbol}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </div>
                  <div className="amount_container pt-2">
                    {/* <span className="ps-2 pe-3  fs-3">{fundBalance}</span> */}
                    {/* <span className="opacity-75 ">=$6754974544</span> */}
                    {isBalanceShow ? (
                      <span className="ps-2 pe-3  fs-3">{fundBalance}</span>
                    ) : (
                      <span className="ps-2 pe-3  fs-3">xxx,xxx</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="common_border_bg spotWallet_data_container balanceContainer  rounded-2">
              <div className="d-flex justify-content-between">
                <div className="py-4 d-flex justify-content-start ms-4">
                  <input
                    type="text"
                    className="inputBox ps-2 pe-5 py-2"
                    placeholder="Search coin"
                    value={filterCoin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z]/g, "");
                      setFilterCoin(value.trim());
                      const wallets = convertBalFund.filter((wallet) =>
                        wallet.assetSymbol
                          .toLowerCase()
                          .includes(value.trim().toLowerCase())
                      );
                      setSortedFilteredWallets(wallets);
                    }}
                  />
                  <img src={SearchIcon} alt="search" className="SearchIcon" />
                </div>
              </div>
              <div className="spotData_main_container">
                <div className="spotData_header d-flex justify-content-between px-4 w-100">
                  <span className="fs-5 fw-bolder ps-3 w-25">
                    Coin
                    <img
                      src={coinSortOder === 1 ? upArrow : filterDownArrow}
                      alt="img"
                      height={20}
                      width={20}
                      onClick={() => {
                        setCoinSortOder(coinSortOder === 1 ? 2 : 1);
                        sortedData("coin", coinSortOder === 1 ? 2 : 1);
                      }}
                    />
                  </span>
                  <span className="fs-5  fw-bolder text-center w-25 pe-2">
                    Total
                    <img
                      src={totalSortOder === 1 ? upArrow : filterDownArrow}
                      alt="img"
                      height={20}
                      width={20}
                      onClick={() => {
                        setTotalSortOder(totalSortOder === 1 ? 2 : 1);
                        sortedData("total", totalSortOder === 1 ? 2 : 1);
                      }}
                    />
                  </span>

                  <span className="fs-5  fw-bolder text-center w-25 ps-3">
                    Available
                    <img
                      src={availableSortOder === 1 ? upArrow : filterDownArrow}
                      alt="img"
                      height={20}
                      width={20}
                      onClick={() => {
                        setAvailableSortOder(availableSortOder === 1 ? 2 : 1);
                        sortedData(
                          "available",
                          availableSortOder === 1 ? 2 : 1
                        );
                      }}
                    />
                  </span>
                  <span className="fs-5 fw-bolder pe-3 w-25 text-end">
                    Action
                    {/* <img src={upArrow} alt="img" height={20} width={20} /> */}
                  </span>
                </div>
                <div className="horizontal_line pb-4 mx-4"></div>

                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {sortedFilteredWallets?.length > 0 ? (
                      <>
                        {sortedFilteredWallets.map((item, i) => {
                          return (
                            <React.Fragment key={item.assetSymbol}>
                              <div className="spotData_mainData d-flex justify-content-between ps-2 pe-4 py-2 align-items-center">
                                <div className="ps-3 d-flex align-items-center w-25">
                                  <img
                                    src={assetImageMappings(item.assetSymbol)}
                                    style={{ height: "1.9vw", width: "1.9vw" }}
                                    alt="coinIcon"
                                  />
                                  <span className="ps-2 d-flex flex-column">
                                    <span>{item.assetSymbol}</span>
                                    <span className="small opacity-75">
                                      (
                                      {
                                        assets.filter(
                                          (e) =>
                                            e.assetSymbol === item.assetSymbol
                                        )[0]?.assetName
                                      }
                                      )
                                    </span>
                                  </span>
                                </div>
                                <div className="w-25 text-center pe-2">
                                  <span className="opacity-75 ">
                                    {formatNumber(item.totalWallBal)}
                                  </span>
                                </div>
                                <div className="w-25 text-center ps-3">
                                  <span className="opacity-75">
                                    {formatNumber(item.wallCurrBal)}
                                  </span>
                                </div>
                                <div className="w-25 text-end">
                                  <button
                                    // className="fw-bolder pe-3 btn btn-dark rounded-4 opacity-75"
                                    className="pe-3 border-none text-center rounded-4 text-white btn_border opacity-75 py-1 px-2"
                                    onClick={() => {
                                      setSelectedFromAsset(item.assetSymbol);
                                      let toAsset =
                                        assetSearchToList[
                                          assetSearchToList[0].assetSymbol !==
                                          item.assetSymbol
                                            ? 0
                                            : 1
                                        ].assetSymbol;
                                      fetchRateData(item.assetSymbol, toAsset);
                                      setSelectedToAsset(toAsset);
                                      setFundAssetBalance(convertBalFund);
                                      setSpotAssetBalance([]);
                                      setWalletType({
                                        isSpot: false,
                                        isFunding: true,
                                      });
                                      setConvertOpenModal(!convertOpenModal);
                                    }}
                                  >
                                    Convert
                                  </button>
                                </div>{" "}
                              </div>
                              <div
                                className={`horizontal_line mx-4 ${
                                  i === sortedFilteredWallets?.length - 1
                                    ? "d-none"
                                    : ""
                                }`}
                              ></div>
                            </React.Fragment>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <h6>No record(s)</h6>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </article>
        </div>
        {convertModalView()}
        {handleTransfer()}
      </div>
    </>
  );
};

export default FundingAsset;
