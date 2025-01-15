import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import Topbar from "../Topbar/Topbar";
// import { useNavigate } from "react-router-dom";
import { DropdownButton, Dropdown, Modal } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Select from "react-select";
import "react-circular-progressbar/dist/styles.css";
import editIcon from "../../assets/Edit-schedule.svg";
import deleteIcon from "../../assets/Delete-schedule.svg";
import Loader from "../common/Loader";
import axios from "axios";
import { URI } from "../../constants";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import {
  __customBcColor,
  applyPrecision,
  createLabelValue,
  customerStatus,
  formatNumber,
} from "../commonComponent";
import ReactPaginate from "react-paginate";
import "../SpotOrder/SpotOrder.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filledIcon from "../../assets/filled.svg";
import partiallyFilledIcon from "../../assets/partillayFilled.svg";
import orderCancelIcon from "../../assets/orderCancel.svg";
import refresh_loader from "../../assets/refresh_loader.svg";
import rejectedIcon from "../../assets/rejected.svg";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
const removeIcon = (
  <FontAwesomeIcon icon={faXmark} width="27" height="27" color="#f5f5f5" />
);
const SpotOrder = () => {
  const [toggle, setToggle] = useState(false);
  const yesterday = new Date();
  const today = new Date();
  const [filterOption, setFilterOption] = useState("ALL");
  const [pairOption, setPairOption] = useState("ALL");
  const [sideOption, setSideOption] = useState("ALL");

  const [selectOrder, setSelectOrder] = useState("openorder");
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderData, setOpenOrderData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editAmtValue, setEditAmtValue] = useState();
  const [editPriceValue, setEditPriceValue] = useState();
  const [editLimitValue, setEditLimitValue] = useState();
  const [editTotalAmt, setEditTotalAmt] = useState();
  const [editKeyValue, setEditKeyValue] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteKeyValue, setDeleteKeyValue] = useState();
  const [activeTab, setActiveTab] = useState("price");
  const [selectedAsset, setSelectedAsset] = useState({
    assetPairName: "",
    baseAsset: "BTC",
    ordAssetSymbol: "",
    quoteAsset: "",
  });

  yesterday.setDate(yesterday.getDate() - 7);

  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [assetSymbols, setAssetSymbols] = useState([]);
  const [baseAssets, setBaseAssets] = useState([]);
  const [quoteAssets, setQuoteAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [rightModal, setRightModal] = useState(false);
  const [customerOrder, setCustomerOrder] = useState([]);
  const [customerTradeData, setCustomerTradeData] = useState([]);
  const [customerOrderHistoryData, setCustomerOrderHistoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [assetBalance, setAssetBalance] = useState([]);

  const { customerId } = useSelector((stat) => stat.ChangeState);
  const navigate = useNavigate();
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const customSelectLocationStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: __customBcColor(state.isFocused, state.isSelected),
      color: "#FFFFFF",
    }),
    control: (provided, state) => ({
      ...provided,
      height: 8,
      border: 0,
      marginLeft: 5,
      backgroundColor: "#0a0a0a",
      boxShadow: "none",
      fontSize: 13,
    }),
    input: (base) => ({
      ...base,
      color: "#FFFFFF",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
    menuList: (provided, state) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      "&::-webkit-scrollbar": {
        width: 5,
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#236dff",
        borderRadius: "10px",
      },
    }),
  };

  const nextIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="16"
      viewBox="0 0 21 16"
      fill="none"
    >
      <path
        d="M1.21484 8.21708H19.9995M19.9995 8.21708L12.9552 1.17285M19.9995 8.21708L12.9552 15.2613"
        stroke="#F5F5F5"
        strokeWidth="1.17404"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const prevIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="16"
      viewBox="0 0 21 16"
      fill="none"
    >
      <g opacity="0.5">
        <path
          d="M19.7852 8.21708H1.00054M1.00054 8.21708L8.04477 1.17285M1.00054 8.21708L8.04477 15.2613"
          stroke="white"
          strokeWidth="1.17404"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  const restoreStates = () => {
    setCurrentPage(0);
    setFromDate(yesterday);
    setToDate(today);
    setFilterOption("ALL");
    setPairOption("ALL");
    setSideOption("ALL");
  };

  // const editTotalCal = (section, value) => {
  //   let totalEditAmount;
  //   if (section === "price") {
  //     setEditPriceValue(value);
  //     totalEditAmount =
  //       openOrderData[editKeyValue]?.ordType.toUpperCase() !== "STOP-LIMIT"
  //         ? value * editAmtValue
  //         : editTotalAmt;
  //   } else if (section === "limit") {
  //     totalEditAmount =
  //       openOrderData[editKeyValue]?.ordType.toUpperCase() === "STOP-LIMIT"
  //         ? value * editAmtValue
  //         : 0;
  //     setEditLimitValue(value);
  //   } else {
  //     setEditAmtValue(value);
  //     totalEditAmount = editPriceValue * value;
  //   }
  //   setEditTotalAmt(totalEditAmount);
  // };

  const editTotalCal = (section, value) => {
    let totalEditAmount;
    if (section === "price") {
      setEditPriceValue(value);
      totalEditAmount =
        openOrderData[editKeyValue]?.ordType.toUpperCase() !== "STOP-LIMIT"
          ? value * editAmtValue
          : editTotalAmt;
    } else if (section === "limit") {
      if (openOrderData[editKeyValue]?.ordType.toUpperCase() === "STOP-LIMIT") {
        totalEditAmount = value * editAmtValue;
      }
      setEditLimitValue(value);
    } else {
      totalEditAmount = editLimitValue * value;
      setEditAmtValue(value);
    }
    setEditTotalAmt(totalEditAmount);
  };

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("accessToken");
    return Boolean(token);
  };

  const isLoggedIn = isAuthenticated();

  const getAssetBalance = async (assetSymbol) => {
    axios
      .get(URI.getAssetBalance + "/" + customerId + "/" + assetSymbol, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setAssetBalance(response.data.data);
        } else {
          console.log(response.data.message);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getAssetSymbols = async () => {
    let baseList = [];
    let quoteList = [];
    await axios
      .post(URI.getAssetSymbols, {})
      .then((response) => {
        if (response.data.status === 200) {
          let assetSymbols = response.data.data;
          assetSymbols.unshift({
            isSellAllowed: true,
            assetSymbol: "",
            assetPairName: "ALL",
            "24hChange": "",
            isCancelReplace: true,
            baseAsset: "ALL",
            isBuyAllowed: true,
            volume: "",
            basePrecision: "",
            iSpotTrade: true,
            quotePrecision: "",
            price: "",
            isTrailingStop: true,
            isTrade: true,
            quoteAsset: "ALL",
            isMarginTrade: true,
          });
          setAssetSymbols(response.data.data);
          baseList = [
            ...new Set(response.data.data.map((asset) => asset.baseAsset)),
          ];
          quoteList = [
            ...new Set(response.data.data.map((asset) => asset.quoteAsset)),
          ];
          setBaseAssets(baseList);
          setQuoteAssets(quoteList);

          // baseAssets()
        } else {
          setAssetSymbols([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOpenOrderData = async (
    filterOption,
    pairOption,
    sideOption,
    pgNumber
  ) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      pageNo: pgNumber,
      pageSize: 10,
      ordType: filterOption,
      assetPair: pairOption,
      ordSide: sideOption,
    };

    await axios
      .post(URI.getOpenOrder, requestBody, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setTotalCount(parseInt(response.data.data.rowCount));
          setPageCount(parseInt(response.data.data.rowCount) / 10);

          setOpenOrderData(response.data.data.orderList);
        } else {
          setIsLoading(false);
          setOpenOrderData([]);
        }
      })

      .catch((error) => {});
  };

  const getCustomerAllTrades = async (
    __fromDate,
    __toDate,
    __baseValue,
    __quoteValue,
    __sideValue,
    pgNumber
  ) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      tradeSide: __sideValue,
      tradeStatus: "ALL",
      fromDate: __fromDate,
      toDate: __toDate,
      baseAsset: __baseValue,
      quoteAsset: __quoteValue,
      pageNo: pgNumber,
      pageSize: 10,
    };
    await axios
      .post(URI.getCustomerAllTrades, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setTotalCount(parseInt(response.data.data.rowCount));
          setPageCount(parseInt(response.data.data.rowCount) / 10);
          setOpenOrderData(response.data.data.customerList);
        } else {
          setIsLoading(false);
          setOpenOrderData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCustomerOrders = async (custOrderID) => {
    axios
      .get(URI.getCustomerOrders + "/" + customerId + "/" + custOrderID, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setCustomerOrder(response.data.data.orderDetails);
          setCustomerTradeData(response.data.data.tradeDetails);
          setCustomerOrderHistoryData(response.data.data.orderHistory);
          setRightModal(true);
        } else {
          console.log(response.data.message);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickDeleteOrder = async (__ordType) => {
    setBtnLoader(true);
    const requestBody = {
      customerId: customerId,
      requestOrdQty: openOrderData[deleteKeyValue].requestOrdQty.toString(),
      ordSide: openOrderData[deleteKeyValue].ordSide,
      ordType: __ordType?.toUpperCase(),
      ordAssetSymbol: openOrderData[deleteKeyValue].ordAssetSymbol,
      orderId: openOrderData[deleteKeyValue].orderId,
    };

    if (__ordType?.toUpperCase() === "STOP-LIMIT") {
      requestBody.ordStopPrice =
        openOrderData[deleteKeyValue].ordStopPrice?.toString();
      requestBody.ordLimitPrice =
        openOrderData[deleteKeyValue].ordLimitPrice?.toString();
      requestBody.ordStatus = "CANCEL";
      requestBody.ordName = openOrderData[deleteKeyValue]?.ordSide;
    } else {
      requestBody.ordPrice =
        openOrderData[deleteKeyValue].requestedOrdPrice?.toString();
      requestBody.flagValue = "CANCEL";
      requestBody.ordName = "SPOT";
      // requestBody.ordStatus =
      //   openOrderData[deleteKeyValue].ordStatus?.toString();
    }

    await axios
      .post(URI.updateDeleteOrder, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setSuccessMessage(response.data.message);
          setBtnLoader(false);
          setDeleteModal(false);
          setSelectOrder("openorder");
          getOpenOrderData("ALL", "ALL", "ALL", 1);
          // getCustomerAllOrdersHistory(fromDate, toDate, "ALL", "ALL", "ALL", 1);
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        } else {
          setErrorMessage(response.data.message);
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
          setBtnLoader(false);
        }
      })
      .catch((error) => {
        setBtnLoader(false);
        console.log(error);
      });
  };

  const handleClickEditOrder = async (__ordType) => {
    setBtnLoader(true);
    const requestBody = {
      customerId: customerId,
      requestOrdQty: editAmtValue.toString(),
      ordSide: openOrderData[editKeyValue].ordSide,
      ordType: __ordType?.toUpperCase(),
      ordAssetSymbol: openOrderData[editKeyValue].ordAssetSymbol,
      orderId: openOrderData[editKeyValue].orderId,
    };
    if (__ordType?.toUpperCase() === "STOP-LIMIT") {
      requestBody.ordStopPrice = editPriceValue.toString();
      requestBody.ordLimitPrice = editLimitValue.toString();
      requestBody.ordStatus = "UPDATE";
      requestBody.ordName = openOrderData[editKeyValue].ordSide;
    } else {
      requestBody.ordPrice = editPriceValue.toString();
      requestBody.flagValue =
        activeTab === "price" ? "price_modify" : "amt_modify";
      requestBody.ordName = "SPOT";
      // requestBody.ordStatus= openOrderData[editKeyValue].ordStatus?.toString(),
    }

    await axios
      .post(URI.updateDeleteOrder, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setBtnLoader(false);

          setSelectOrder("openorder");
          getOpenOrderData("ALL", "ALL", "ALL", 1);
          setSuccessMessage(response.data.message);
          setTimeout(() => {
            setSuccessMessage("");
            setEditModal(false);
          }, 3000);
        } else {
          setErrorMessage(response.data.message);
          setTimeout(() => {
            setErrorMessage("");
            setBtnLoader(false);
          }, 3000);
        }
      })
      .catch((error) => {
        setBtnLoader(false);
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      });
  };

  const openOrderTable = () => (
    <div className="table_main_container_spot">
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Date
            </th>
            <th scope="col">Pair</th>
            {/* <th scope="col" className="p-0">
              <DropdownButton
                title={selectedOption}
                id="dropdown_limit"
                onSelect={(eventKey) => setSelectedOption(eventKey)}
              >
                <Dropdown.Item eventKey="Type">Type</Dropdown.Item>
                <Dropdown.Item eventKey="Limit">Limit</Dropdown.Item>
                <Dropdown.Item eventKey="Stop Limit">Stop Limit</Dropdown.Item>
                <Dropdown.Item eventKey="Limit Maker">
                  Limit Maker
                </Dropdown.Item>
                <Dropdown.Item eventKey="Trailing Stop">
                  Trailing Stop
                </Dropdown.Item>
              </DropdownButton>
            </th> */}
            <th scope="col">Type</th>
            <th scope="col">Side</th>
            <th scope="col">Limit Price</th>
            <th scope="col">Stop Price</th>
            <th scope="col">Amount</th>
            <th scope="col">Filled</th>
            <th scope="col">Total</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {openOrderData.length > 0 ? (
              <tbody className="tableBody_content">
                {openOrderData.map((item, key) => (
                  <tr className="text-start" key={key}>
                    <td>{item.ordCreatedDate}</td>
                    <td>{item.assetPairName}</td>
                    <td>{item.ordType}</td>
                    <td>{item.ordSide}</td>
                    <td>
                      {item.ordType === "STOP-LIMIT"
                        ? formatNumber(item?.ordLimitPrice)
                        : formatNumber(item?.requestedOrdPrice) || "-"}
                    </td>
                    <td className="ps-3">
                      {item.ordType === "STOP-LIMIT"
                        ? formatNumber(item?.ordStopPrice || "-")
                        : "-"}
                    </td>
                    <td>
                      {formatNumber(item?.requestOrdQty)}&nbsp;{item.baseAsset}
                    </td>
                    <td>
                      {formatNumber(item?.ordFilledQuantity)}&nbsp;
                      {item.baseAsset}
                    </td>
                    <td>{formatNumber(item?.total)}</td>

                    <td>
                      <button
                        className="editDel_button"
                        disabled={item.ordStatus === "filled"}
                        onClick={() => {
                          getAssetBalance(item.ordAssetSymbol);
                          setSelectedAsset(item);
                          setEditModal(true);
                          //  viewEditModal(item.excOrderId);
                          setEditAmtValue(item.requestOrdQty);
                          setEditPriceValue(
                            item.ordType.toUpperCase() === "STOP-LIMIT"
                              ? item.ordStopPrice
                              : item.requestedOrdPrice || 0
                          );
                          setEditLimitValue(
                            item.ordType === "STOP-LIMIT"
                              ? item?.ordLimitPrice
                              : item?.requestedOrdPrice || 0
                          );
                          setEditTotalAmt(item.total);
                          setEditKeyValue(key);
                        }}
                      >
                        <img
                          src={editIcon}
                          alt="img"
                          width={18}
                          height={22}
                          className="cursorPointer"
                        />
                      </button>

                      <button
                        className="editDel_button"
                        disabled={item.ordStatus === "filled"}
                        onClick={() => {
                          setDeleteModal(true);
                          setDeleteKeyValue(key);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="img"
                          width={18}
                          height={22}
                          className="cursorPointer"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={12} className="border-0 pt-2 ">
                    <div className="mt-4 d-flex justify-content-center align-items-center">
                      <span className="mt-4 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="71"
                          height="71"
                          viewBox="0 0 71 71"
                          fill="none"
                        >
                          <path
                            d="M59.1667 24.4066V53.2503C59.1667 62.1253 53.8712 65.0837 47.3333 65.0837H23.6667C17.1287 65.0837 11.8333 62.1253 11.8333 53.2503V24.4066C11.8333 14.792 17.1287 12.5732 23.6667 12.5732C23.6667 14.4074 24.4062 16.0641 25.6191 17.277C26.832 18.4899 28.4887 19.2295 30.3229 19.2295H40.6771C44.3454 19.2295 47.3333 16.2416 47.3333 12.5732C53.8712 12.5732 59.1667 14.792 59.1667 24.4066Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.3333 12.5732C47.3333 16.2416 44.3454 19.2295 40.6771 19.2295H30.3229C28.4888 19.2295 26.832 18.4899 25.6191 17.277C24.4062 16.0641 23.6667 14.4074 23.6667 12.5732C23.6667 8.90491 26.6546 5.91699 30.3229 5.91699H40.6771C42.5113 5.91699 44.168 6.65659 45.3809 7.8695C46.5938 9.08242 47.3333 10.7391 47.3333 12.5732Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 50.292H47.3333"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 40.458H35.5"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M24 30H30"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="opacity-50 mt-2">
                        No Order History Yet!.
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </>
        ) : (
          <tbody className="tableBody_content">
            <td colSpan={12} className="border-0 pt-4">
              <Loader />
            </td>
          </tbody>
        )}
      </table>

      {/*------------- delete Modal---------------------- */}
      <Modal
        show={deleteModal}
        className="numberModal "
        aria-labelledby="example-custom-modal-styling-title"
        size="md"
      >
        <Modal.Body className="ModalBody ">
          <div
            className="modalUS row justify-content-center"
            style={{
              margin: "0",
              gap: "10px",
              padding: "10% 5%",
              // backgroundColor: "#151515",
            }}
          >
            <p className="text-white text-center">
              {" "}
              Are you sure you want to delete this Order?
            </p>

            <div className="d-flex justify-content-center gap-4 pt-4">
              <button
                type="button"
                className="btn btn-primary btn-sm px-3 w-25"
                onClick={() => {
                  setDeleteModal(false);
                  setBtnLoader(false);
                }}
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm px-3 w-25"
                onClick={() => {
                  // if (openOrderData[deleteKeyValue].ordFilledQuantity !== 0) {
                  //   setErrorMessage("Partially filled order can't be deleted");
                  //   setTimeout(() => {
                  //     setErrorMessage("");
                  //   }, 3000);
                  // } else {
                  handleClickDeleteOrder(openOrderData[deleteKeyValue].ordType);

                  // }
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
                Yes
              </button>
            </div>
            <div style={{ minHeight: "1.4rem" }} className="text-center pt-3">
              <span
                className={`small ${
                  errorMessage ? "text-danger" : "text-success"
                }`}
              >
                {errorMessage || successMessage}
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* ----------------edit Modal ------------------------------ */}

      <Modal
        show={editModal}
        className="numberModal "
        aria-labelledby="example-custom-modal-styling-title"
        // size="md"
      >
        <Modal.Body className="ModalBody ">
          <div
            className="modalUS row justify-content-center"
            style={{
              margin: "0",
              gap: "10px",
              padding: "10% 5%",
              // backgroundColor: "#151515",
            }}
          >
            <div className="selectAmtPrice_container d-flex justify-content-between gap-1 py-1 rounded-2 align-items-center ">
              <div
                className={` w-50 text-white cursorPointer  ${
                  activeTab === "price" ? "bg-primary rounded-2 py-1 my-1" : ""
                }`}
                onClick={() => {
                  setEditAmtValue(openOrderData[editKeyValue].requestOrdQty);
                  setEditPriceValue(
                    openOrderData[editKeyValue].ordType === "STOP-LIMIT"
                      ? openOrderData[editKeyValue]?.ordStopPrice
                      : openOrderData[editKeyValue]?.requestedOrdPrice || 0
                  );
                  setEditLimitValue(
                    openOrderData[editKeyValue]?.ordLimitPrice || 0
                  );
                  setEditTotalAmt(openOrderData[editKeyValue].total);
                  setActiveTab("price");
                }}
              >
                <span className="d-flex justify-content-center  ">Price</span>
              </div>

              <div
                className={` w-50 text-white cursorPointer ${
                  activeTab === "amount" ? "bg-primary rounded-2 py-1 my-1" : ""
                }`}
                onClick={() => {
                  setEditAmtValue(openOrderData[editKeyValue].requestOrdQty);
                  setEditPriceValue(
                    openOrderData[editKeyValue].ordType === "STOP-LIMIT"
                      ? openOrderData[editKeyValue]?.ordStopPrice
                      : openOrderData[editKeyValue]?.requestedOrdPrice || 0
                  );
                  setEditLimitValue(
                    openOrderData[editKeyValue]?.ordLimitPrice || 0
                  );
                  setEditTotalAmt(openOrderData[editKeyValue].total);
                  setActiveTab("amount");
                }}
              >
                <span className=" d-flex justify-content-center">Amount</span>
              </div>
            </div>

            <div className="input_container ">
              <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                {/* <input126
                  className="w-75 bg-transparent text-white border border-secondary rounded py-2 px-2"
                  placeholder="Price"
                  type="text"
                  value={item.price}
                  onChange={(e) => setInput1(e.target.value)}
                  //  disabled={disabledInput === 1}
                /> */}

                <div
                  // className="w-100 d-flex price_field p-2 rounded-1 justify-content-between  bg-secondary opacity-50 "
                  className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between    ${
                    activeTab === "price" ? "" : "bg-secondary opacity-50"
                  }`}
                >
                  <label
                    htmlFor="amount_input_one"
                    className={
                      activeTab === "price"
                        ? "text-secondary"
                        : "text-white opacity-75"
                    }
                  >
                    {openOrderData[editKeyValue]?.ordType?.toUpperCase() ===
                    "STOP-LIMIT"
                      ? "Stop"
                      : "Price"}
                  </label>
                  <input
                    className={`w-75 bg-transparent text-white px-2 text-end `}
                    id="amount_input_one"
                    value={editPriceValue}
                    onChange={(e) => {
                      e.target.value !== "." &&
                        e.target.value.indexOf(".") ===
                          e.target.value.lastIndexOf(".") &&
                        editTotalCal(
                          "price",
                          e.target.value.replace(/[^\d.]/gi, "")
                        );
                    }}
                    disabled={activeTab !== "price"}
                    autoComplete="off"
                  />
                  <label htmlFor="amount_input_one" className="pe-1 text-white">
                    {selectedAsset?.quoteAsset}
                  </label>
                </div>
                {openOrderData[editKeyValue]?.ordType?.toUpperCase() ===
                  "STOP-LIMIT" && (
                  <div
                    // className="w-100 d-flex price_field p-2 rounded-1 justify-content-between  bg-secondary opacity-50 "
                    className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between    ${
                      activeTab === "price" ? "" : "bg-secondary opacity-50"
                    }`}
                  >
                    <label
                      htmlFor="amount_input_two"
                      className={
                        activeTab === "price"
                          ? "text-secondary"
                          : "text-white opacity-75"
                      }
                    >
                      Limit
                    </label>
                    <input
                      className={`w-75 bg-transparent text-white px-2 text-end `}
                      id="amount_input_two"
                      value={editLimitValue}
                      onChange={(e) => {
                        e.target.value !== "." &&
                          e.target.value.indexOf(".") ===
                            e.target.value.lastIndexOf(".") &&
                          editTotalCal(
                            "limit",
                            e.target.value.replace(/[^\d.]/gi, "")
                          );
                      }}
                      disabled={activeTab !== "price"}
                      autoComplete="off"
                    />
                    <label
                      htmlFor="amount_input_two"
                      className="pe-1 text-white"
                    >
                      {selectedAsset?.quoteAsset}
                    </label>
                  </div>
                )}

                <div
                  className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between    ${
                    activeTab === "amount" ? "" : "bg-secondary opacity-50"
                  }`}
                >
                  <label
                    htmlFor="amount_input_one"
                    className={
                      activeTab === "amount"
                        ? "text-secondary"
                        : "text-white opacity-75"
                    }
                  >
                    Amount
                  </label>
                  <input
                    className="w-75 bg-transparent text-white px-2 text-end "
                    id="amount_input_one"
                    value={editAmtValue}
                    disabled={activeTab !== "amount"}
                    onChange={(e) => {
                      e.target.value !== "." &&
                        e.target.value.indexOf(".") ===
                          e.target.value.lastIndexOf(".") &&
                        editTotalCal(
                          "amount",
                          e.target.value.replace(/[^\d.]/gi, "")
                        );
                    }}
                    autoComplete="off"
                  />
                  <label
                    htmlFor="amount_input_one"
                    // style={{ paddingRight: "12px" }}
                    className="pe-1 text-white"
                  >
                    {selectedAsset?.baseAsset}
                  </label>
                </div>

                <div className="w-100 d-flex price_field p-2 rounded-1 justify-content-between bg-secondary opacity-50">
                  <label
                    htmlFor="total_input_two"
                    className="text-white opacity-75"
                  >
                    Total
                  </label>
                  <input
                    className="w-75 bg-transparent text-white px-2 text-end"
                    // placeholder="Price"
                    id="total_input_two"
                    value={editTotalAmt}
                    readOnly
                  />
                  <label htmlFor="total_input_two " className="text-white">
                    {selectedAsset?.quoteAsset}
                  </label>
                </div>

                <div className="buySellStatus_container w-100 px-2 py-1 opacity-75 ">
                  {openOrderData.length > 0 &&
                  openOrderData[editKeyValue]?.ordSide?.toLocaleLowerCase() ===
                    "buy" ? (
                    <div className=" text-start small d-flex justify-content-between">
                      <div className="d-flex ">
                        <span className="text-secondary">Max Buy</span>
                        <span className="ps-2 text-white">
                          {editPriceValue > 0
                            ? applyPrecision(
                                Math.ceil(
                                  assetBalance.quoteAssetBalance /
                                    editPriceValue
                                ),
                                8
                              )
                            : 0}
                          &nbsp;{selectedAsset?.baseAsset}
                        </span>
                      </div>
                      <div className="d-flex">
                        <span className="text-secondary">Est .Fee</span>
                        <span className="ps-3 text-white">
                          {/* 0.044 {selectedAsset?.baseAsset} */}
                          {editAmtValue > 0
                            ? formatNumber(editAmtValue * 0.001)
                            : 0}
                          &nbsp;
                          {selectedAsset?.baseAsset}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className=" text-start small  d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="text-secondary">Max Sell</span>
                        <span className="ps-3 text-white">
                          {/* 0 {selectedAsset?.quoteAsset} */}
                          {editPriceValue > 0
                            ? applyPrecision(
                                assetBalance.baseAssetBalance * editPriceValue,
                                8
                              )
                            : 0}{" "}
                          {selectedAsset?.quoteAsset}
                        </span>
                      </div>
                      <div className="d-flex">
                        <span className="text-secondary">Est .Fee</span>
                        <span className="ps-3 text-white">
                          {/* 0.044 {selectedAsset?.quoteAsset} */}
                          {formatNumber(
                            editPriceValue * editAmtValue * 0.001
                          )}{" "}
                          {selectedAsset?.quoteAsset}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* <div className=" text-start small   justify-content-between">
                    <div className="d-flex">
                      <span className="text-secondary">Max Buy</span>
                      <span className="ps-3 text-white">
                        0 {selectedAsset?.baseAsset}
                      </span>
                    </div>
                    <div className="d-flex">
                      <span className="text-secondary">Est .Fee</span>
                      <span className="ps-3 text-white">
                        0.044 {selectedAsset?.baseAsset}
                      </span>
                    </div>
                  </div>
                  <div className=" text-start small   justify-content-between">
                    <div className="d-flex">
                      <span className="text-secondary">Max Sell</span>
                      <span className="ps-3 text-white">
                        0 {selectedAsset?.quoteAsset}
                      </span>
                    </div>
                    <div className="d-flex">
                      <span className="text-secondary">Est .Fee</span>
                      <span className="ps-3 text-white">
                        0.044 {selectedAsset?.quoteAsset}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 pt-4">
              <button
                type="button"
                className="btn btn-primary btn-sm px-3 w-50 py-2"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm px-3 w-50 py-2"
                onClick={() =>
                  handleClickEditOrder(openOrderData[editKeyValue]?.ordType)
                }
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
                Update
              </button>
            </div>
            <div style={{ minHeight: "1.6rem" }} className="text-center">
              <span
                className={`small ${
                  errorMessage ? "text-danger" : "text-success"
                }`}
              >
                {errorMessage || successMessage}
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );

  const handleDateUpdate = async (type, e) => {
    if (selectOrder === "orderhistory") {
      getCustomerAllOrdersHistory(
        type === "fromDate" ? new Date(e) : fromDate,
        type !== "fromDate" ? new Date(e) : toDate,
        filterOption,
        pairOption,
        sideOption,
        1
      );
    } else {
      getCustomerAllTrades(
        type === "fromDate" ? new Date(e) : fromDate,
        type !== "fromDate" ? new Date(e) : toDate,
        filterOption,
        pairOption,
        sideOption,
        1
      );
    }
    // const dateValue = e.target.value;

    type === "fromDate" ? setFromDate(new Date(e)) : setToDate(new Date(e));
  };

  const getCustomerAllOrdersHistory = async (
    __fromDate,
    __toDate,
    __baseValue,
    __quoteValue,
    __sideValue,
    pgNumber
  ) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      ordStatus: "ALL",
      ordSide: __sideValue,
      // fromDate: __fromDate,
      // toDate: __toDate,
      fromDate: moment(new Date(__fromDate)).format("YYYY-MM-DD"),
      toDate: moment(new Date(__toDate)).format("YYYY-MM-DD"),
      baseAsset: __baseValue,
      quoteAsset: __quoteValue,
      pageNo: pgNumber,
      pageSize: 10,
    };
    await axios
      .post(URI.getCustomerAllOrdersHistory, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setTotalCount(parseInt(response.data.data.rowCount));
          setPageCount(parseInt(response.data.data.rowCount) / 10);
          setOpenOrderData(response.data.data.customerList);
        } else {
          setIsLoading(false);
          setOpenOrderData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const orderHistoryTable = () => (
    <div className="table_main_container_spot">
      <div className="d-flex gap-3 align-items-center mb-3">
        <div className="pt-1 d-flex gap-1 flex-column">
          <label htmlFor="to" className="text-start">
            From
          </label>
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            // className="personalInput text-white"
            className=" text-white ps-2"
            id="dropdown-transaction-history"
            dateFormat="MM-dd-yyyy"
            selected={fromDate}
            onChange={(e) => handleDateUpdate("fromDate", e)}
            maxDate={today}
            // minYear={today.setFullYear(today.getFullYear() - 18)}
            // todayButton={"Today"}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            selectsStart
            yearDropdownItemNumber={50}
            scrollableYearDropdown
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // disabled={!isEditable}
          />{" "}
        </div>
        <div className="pt-1 d-flex gap-1 flex-column">
          <label htmlFor="to" className="text-start">
            To
          </label>
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            className=" text-white ps-2"
            id="dropdown-transaction-history"
            dateFormat="MM-dd-yyyy"
            selected={toDate}
            onChange={(e) => handleDateUpdate("toDate", e)}
            maxDate={today}
            minDate={fromDate}
            // minYear={today.setFullYear(today.getFullYear() - 18)}
            // todayButton={"Today"}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            selectsStart
            yearDropdownItemNumber={50}
            scrollableYearDropdown
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // disabled={!isEditable}
          />{" "}
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Base
          </div>
          <div className="mt-2">
            <DropdownButton
              title={filterOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setFilterOption(key);
                getCustomerAllOrdersHistory(
                  fromDate,
                  toDate,
                  key,
                  pairOption,
                  sideOption,
                  1
                );
              }}
            >
              {baseAssets.map((asset) => {
                return (
                  <Dropdown.Item eventKey={asset} key={asset}>
                    {asset}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Quote
          </div>
          <div className="mt-2">
            <DropdownButton
              title={pairOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setPairOption(key);
                getCustomerAllOrdersHistory(
                  fromDate,
                  toDate,
                  filterOption,
                  key,
                  sideOption,
                  1
                );
              }}
            >
              {quoteAssets.map((asset) => {
                return (
                  <Dropdown.Item eventKey={asset} key={asset}>
                    {asset}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Side
          </div>
          <div className="mt-2">
            <DropdownButton
              title={sideOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setSideOption(key);
                getCustomerAllOrdersHistory(
                  fromDate,
                  toDate,
                  filterOption,
                  pairOption,
                  key,
                  1
                );
              }}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
              <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Time
            </th>
            <th scope="col">Pair</th>
            <th scope="col">Type</th>
            <th scope="col">Side</th>
            <th scope="col">Average</th>
            <th scope="col">Price</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {openOrderData?.length > 0 ? (
              <tbody className="tableBody_content">
                {openOrderData.map((item, key) => (
                  <tr
                    className="text-start cursorPointer"
                    key={item.ordDetId}
                    onClick={() => {
                      getCustomerOrders(item.orderId);
                    }}
                  >
                    <td>{item.ordCreatedDate}</td>
                    <td>{item.assetPairName}</td>
                    <td>{item.ordType}</td>
                    <td>{item.ordSide}</td>
                    <td>{formatNumber(item.ordFilledAvgPrice)}</td>
                    <td>{formatNumber(item.requestedOrdPrice)}</td>
                    <td>{formatNumber(item.total)}</td>
                    <td>{item.ordStatus}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={12} className="border-0 pt-2 ">
                    <div className="mt-4 d-flex justify-content-center align-items-center">
                      <span className="mt-4 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="71"
                          height="71"
                          viewBox="0 0 71 71"
                          fill="none"
                        >
                          <path
                            d="M59.1667 24.4066V53.2503C59.1667 62.1253 53.8712 65.0837 47.3333 65.0837H23.6667C17.1287 65.0837 11.8333 62.1253 11.8333 53.2503V24.4066C11.8333 14.792 17.1287 12.5732 23.6667 12.5732C23.6667 14.4074 24.4062 16.0641 25.6191 17.277C26.832 18.4899 28.4887 19.2295 30.3229 19.2295H40.6771C44.3454 19.2295 47.3333 16.2416 47.3333 12.5732C53.8712 12.5732 59.1667 14.792 59.1667 24.4066Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.3333 12.5732C47.3333 16.2416 44.3454 19.2295 40.6771 19.2295H30.3229C28.4888 19.2295 26.832 18.4899 25.6191 17.277C24.4062 16.0641 23.6667 14.4074 23.6667 12.5732C23.6667 8.90491 26.6546 5.91699 30.3229 5.91699H40.6771C42.5113 5.91699 44.168 6.65659 45.3809 7.8695C46.5938 9.08242 47.3333 10.7391 47.3333 12.5732Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 50.292H47.3333"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 40.458H35.5"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M24 30H30"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="opacity-50 mt-2">
                        No Order History Yet!.
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </>
        ) : (
          <tbody className="tableBody_content">
            <td colSpan={12} className="border-0 pt-4">
              <Loader />
            </td>
          </tbody>
        )}
      </table>
    </div>
  );

  const tradeHistory = () => (
    <div className="table_main_container_spot">
      <div className="d-flex gap-3 align-items-center mb-3">
        <div className="pt-1 d-flex gap-1 flex-column">
          <label htmlFor="to" className="text-start">
            From
          </label>
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            className="personalInput text-white"
            id="dropdown-transaction-history"
            dateFormat="MM-dd-yyyy"
            selected={fromDate}
            onChange={(e) => handleDateUpdate("fromDate", e)}
            maxDate={today}
            // minYear={today.setFullYear(today.getFullYear() - 18)}
            // todayButton={"Today"}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            selectsStart
            yearDropdownItemNumber={50}
            scrollableYearDropdown
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // disabled={!isEditable}
          />{" "}
        </div>
        <div className="pt-1 d-flex gap-1 flex-column">
          <label htmlFor="to" className="text-start">
            To
          </label>
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            id="dropdown-transaction-history"
            className="personalInput text-white"
            dateFormat="MM-dd-yyyy"
            selected={toDate}
            onChange={(e) => handleDateUpdate("toDate", e)}
            maxDate={today}
            minDate={fromDate}
            // minYear={today.setFullYear(today.getFullYear() - 18)}
            // todayButton={"Today"}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            selectsStart
            yearDropdownItemNumber={50}
            scrollableYearDropdown
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // disabled={!isEditable}
          />{" "}
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Base
          </div>
          <div className="mt-2">
            <DropdownButton
              title={filterOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setFilterOption(key);
                getCustomerAllTrades(
                  fromDate,
                  toDate,
                  key,
                  pairOption,
                  sideOption,
                  1
                );
              }}
            >
              {baseAssets.map((asset) => {
                return (
                  <Dropdown.Item eventKey={asset} key={asset}>
                    {asset}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Quote
          </div>
          <div className="mt-2">
            <DropdownButton
              title={pairOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setPairOption(key);
                getCustomerAllTrades(
                  fromDate,
                  toDate,
                  filterOption,
                  key,
                  sideOption,
                  1
                );
              }}
            >
              {quoteAssets.map((asset) => {
                return (
                  <Dropdown.Item eventKey={asset} key={asset}>
                    {asset}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
        </div>
        <div>
          <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
            Side
          </div>
          <div className="mt-2">
            <DropdownButton
              title={sideOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setSideOption(key);
                getCustomerAllTrades(
                  fromDate,
                  toDate,
                  filterOption,
                  pairOption,
                  key,
                  1
                );
              }}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
              <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Date
            </th>
            <th scope="col">Pair</th>
            <th scope="col">Side</th>
            <th scope="col">Price</th>
            <th>Executed</th>
            <th>Fee</th>
            <th>Total</th>
            {/* <th>Total in USDT</th> */}
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {openOrderData?.length > 0 ? (
              <tbody className="tableBody_content">
                {openOrderData.map((item) => (
                  <tr className="text-start" key={item.ordDetId}>
                    <td>{item.tradeTime}</td>
                    <td>{item.assetPairName}</td>
                    <td>{item.tradeSide}</td>
                    <td>{formatNumber(item.tradePrice)}</td>
                    <td>
                      {formatNumber(item.tradeQty)}&nbsp;{item.trdBaseAsset}
                    </td>
                    <td>
                      {/* {formatNumber(item.tradeFee)}&nbsp;{item.trdBaseAsset} */}
                      {formatNumber(item.tradeFee)}&nbsp;
                      {item.tradeSide?.toUpperCase() === "BUY"
                        ? item.trdBaseAsset
                        : item.trdQuoteAsset}
                    </td>
                    <td>{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={12} className="border-0 pt-2 ">
                    <div className="mt-4 d-flex justify-content-center align-items-center">
                      <span className="mt-4 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="71"
                          height="71"
                          viewBox="0 0 71 71"
                          fill="none"
                        >
                          <path
                            d="M59.1667 24.4066V53.2503C59.1667 62.1253 53.8712 65.0837 47.3333 65.0837H23.6667C17.1287 65.0837 11.8333 62.1253 11.8333 53.2503V24.4066C11.8333 14.792 17.1287 12.5732 23.6667 12.5732C23.6667 14.4074 24.4062 16.0641 25.6191 17.277C26.832 18.4899 28.4887 19.2295 30.3229 19.2295H40.6771C44.3454 19.2295 47.3333 16.2416 47.3333 12.5732C53.8712 12.5732 59.1667 14.792 59.1667 24.4066Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.3333 12.5732C47.3333 16.2416 44.3454 19.2295 40.6771 19.2295H30.3229C28.4888 19.2295 26.832 18.4899 25.6191 17.277C24.4062 16.0641 23.6667 14.4074 23.6667 12.5732C23.6667 8.90491 26.6546 5.91699 30.3229 5.91699H40.6771C42.5113 5.91699 44.168 6.65659 45.3809 7.8695C46.5938 9.08242 47.3333 10.7391 47.3333 12.5732Z"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 50.292H47.3333"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M23.6667 40.458H35.5"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M24 30H30"
                            stroke="#505255"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="opacity-50 mt-2">
                        No Order History Yet!.
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </>
        ) : (
          <tbody className="tableBody_content">
            <td colSpan={12} className="border-0 pt-4">
              <Loader />
            </td>
          </tbody>
        )}
      </table>
    </div>
  );

  const loginViewPage = () => (
    <div className="d-flex justify-content-center loginTableView align-items-center">
      <div
        className="cursorPointer"
        onClick={() =>
          // navigate("../signUp")
          navigate("../", {
            state: {
              pageName: "signin",
            },
          })
        }
      >
        <div className="d-flex gap-2">
          {" "}
          <h6 className="loginTradeTex">Log In</h6> or{" "}
          <h6 className="loginTradeTex"> Register </h6>Trade Now
        </div>
      </div>
    </div>
  );

  const __getPaginationView = () => {
    if (openOrderData && openOrderData.length > 0) {
      return (
        <div className="d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center float-end gap-3 ps-2 pe-5 small">
            <ReactPaginate
              nextLabel={nextIcon}
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={Math.ceil(pageCount)}
              previousLabel={prevIcon}
              pageClassName="page-item modItem"
              pageLinkClassName="page-link modLink"
              previousClassName="page-item modItem"
              previousLinkClassName="page-link modLink"
              nextClassName="page-item modItem"
              nextLinkClassName="page-link modLink"
              breakLabel="..."
              breakClassName="page-item modItem"
              breakLinkClassName="page-link modLink"
              containerClassName={
                "pagination modPag " +
                (Math.ceil(pageCount) < 5 ? "w-5" : "w-20")
              }
              activeClassName="active"
              renderOnZeroPageCount={null}
              forcePage={currentPage}
            />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  const allOrderTablePage = () => {
    if (isLoggedIn) {
      if (selectOrder === "openorder") {
        return openOrderTable();
      } else if (selectOrder === "orderhistory") {
        return orderHistoryTable();
      } else if (selectOrder === "tradehistory") {
        return tradeHistory();
      } else {
        return openOrderTable();
      }
    } else {
      return loginViewPage();
    }
  };

  const openOrder = () => {
    return (
      <div>
        <div className="table_main_container_spot ms-5 mt-1">
          {/* <div className="sendPageContent ms-5 mt-1"> */}
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-4 mt-4">
              <div
                className={
                  selectOrder === "openorder"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  restoreStates();
                  setSelectOrder("openorder");
                  if (isLoggedIn) {
                    getOpenOrderData("ALL", "ALL", "ALL", 1);
                  }
                }}
              >
                Open orders
              </div>
              <div
                className={
                  selectOrder === "orderhistory"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  restoreStates();
                  setSelectOrder("orderhistory");
                  if (isLoggedIn) {
                    getCustomerAllOrdersHistory(
                      fromDate,
                      toDate,
                      "ALL",
                      "ALL",
                      "ALL",
                      1
                    );
                  }
                }}
              >
                Order History
              </div>
              <div
                className={
                  selectOrder === "tradehistory"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  restoreStates();
                  setSelectOrder("tradehistory");
                  if (isLoggedIn) {
                    getCustomerAllTrades(
                      yesterday,
                      today,
                      "ALL",
                      "ALL",
                      "ALL",
                      1
                    );
                  }
                }}
              >
                Trade history
              </div>
            </div>
          </div>
          <div className="horizontal_line mt-4 me-1"></div>
          {selectOrder === "openorder" && (
            <div className="d-flex gap-3 mt-2">
              <div>
                <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
                  Filter
                </div>
                <div className="mt-2">
                  <DropdownButton
                    title={filterOption}
                    id="dropdown-transaction-history"
                    onSelect={(key) => {
                      setFilterOption(key);
                      getOpenOrderData(key, pairOption, sideOption, 1);
                    }}
                  >
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    <Dropdown.Item eventKey="Limit">Limit Order</Dropdown.Item>
                    <Dropdown.Item eventKey="Stop-Limit">
                      Stop-Limit Order
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Limit-Maker">
                      Limit-Maker
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Trailing Stop">
                      Trailing Stop
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div>
                <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
                  Pair
                </div>
                <div className="mt-2 pair_dropdown_spot convertSelectInput">
                  {/* <DropdownButton
                    title={pairOption}
                    id="dropdown-transaction-history"
                    onSelect={(key) => {
                      setPairOption(key);
                      getOpenOrderData(filterOption, key, sideOption, 1);
                    }}
                  >
                    {assetSymbols.map((asset) => {
                      return (
                        <Dropdown.Item eventKey={asset.assetPairName}>
                          {asset.assetPairName}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton> */}
                  <Select
                    menuPlacement="auto"
                    className="assetListlInput px-2"
                    styles={customSelectLocationStyles}
                    options={assetSymbols.map((asset) => ({
                      value: asset.assetPairName,
                      label: asset.assetPairName,
                    }))}
                    value={
                      pairOption
                        ? { value: pairOption, label: pairOption }
                        : null
                    }
                    onChange={(selectedOption) => {
                      const selectedPair = selectedOption
                        ? selectedOption.value
                        : "";
                      setPairOption(selectedPair);
                      getOpenOrderData(
                        filterOption,
                        selectedPair,
                        sideOption,
                        1
                      );
                    }}
                    // isClearable={true}

                    placeholder="Search and select..."
                  />

                  {/* {assetSymbolDropDownView()} */}
                </div>
              </div>
              <div>
                <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
                  Side
                </div>
                <div className="mt-2">
                  <DropdownButton
                    title={sideOption}
                    id="dropdown-transaction-history"
                    onSelect={(key) => {
                      setSideOption(key);
                      getOpenOrderData(filterOption, pairOption, key, 1);
                    }}
                  >
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
                    <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div></div>
            </div>
          )}

          <div className="mt-4">
            {/* <table>
              <tr>
                <thead className="d-flex justify-content-between align-items-center tableContentheader">
                  <th className="ms-4">Date</th>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Amount</th>
                  <th>Amount per Iceberg order</th>
                  <th>Filled</th>
                  <th>Total</th>
                  <th>Trigger condition</th>
                  <th className="me-4">Action</th>
                </thead>
              </tr>

              <tbody>
                <tr>
                  {tableContentData.length === 0 ? (
                    <div className="mt-4">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 71 71"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M59.1663 24.4076V53.2513C59.1663 62.1263 53.8709 65.0846 47.333 65.0846H23.6663C17.1284 65.0846 11.833 62.1263 11.833 53.2513V24.4076C11.833 14.793 17.1284 12.5742 23.6663 12.5742C23.6663 14.4084 24.4058 16.065 25.6188 17.278C26.8317 18.4909 28.4884 19.2305 30.3226 19.2305H40.6768C44.3451 19.2305 47.333 16.2426 47.333 12.5742C53.8709 12.5742 59.1663 14.793 59.1663 24.4076Z"
                          stroke="#505255"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M47.3337 12.5742C47.3337 16.2426 44.3457 19.2305 40.6774 19.2305H30.3232C28.4891 19.2305 26.8323 18.4909 25.6194 17.278C24.4065 16.065 23.667 14.4084 23.667 12.5742C23.667 8.90589 26.6549 5.91797 30.3232 5.91797H40.6774C42.5116 5.91797 44.1683 6.65756 45.3812 7.87048C46.5942 9.0834 47.3337 10.7401 47.3337 12.5742Z"
                          stroke="#505255"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23.667 50.293H47.3337"
                          stroke="#505255"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23.667 40.457H35.5003"
                          stroke="#505255"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 30H30"
                          stroke="#505255"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="47.5"
                          cy="53.5"
                          r="12"
                          fill="#111111"
                          stroke="#505255"
                          strokeWidth="3"
                        />
                        <path
                          d="M43.4145 56.2443C44.2456 57.0766 45.3523 57.5762 46.5262 57.649C47.7001 57.7219 48.8601 57.3629 49.7877 56.6398L52.9794 59.8315C53.0926 59.9409 53.2442 60.0013 53.4015 60C53.5589 59.9986 53.7094 59.9355 53.8207 59.8242C53.932 59.7129 53.9951 59.5624 53.9965 59.4051C53.9978 59.2477 53.9373 59.0961 53.828 58.9829L50.6363 55.7912C51.3915 54.822 51.7486 53.6013 51.6346 52.3779C51.5207 51.1546 50.9444 50.0207 50.0232 49.2077C49.1021 48.3946 47.9055 47.9635 46.6774 48.0024C45.4494 48.0413 44.2824 48.5472 43.4145 49.4168C42.9661 49.8651 42.6103 50.3972 42.3676 50.983C42.1249 51.5687 42 52.1966 42 52.8306C42 53.4646 42.1249 54.0924 42.3676 54.6782C42.6103 55.2639 42.9661 55.7961 43.4145 56.2443ZM44.2632 50.2667C44.8565 49.6734 45.6371 49.3042 46.4722 49.2219C47.3072 49.1397 48.1449 49.3495 48.8425 49.8156C49.5402 50.2817 50.0547 50.9754 50.2983 51.7783C50.5419 52.5812 50.4995 53.4437 50.1785 54.2189C49.8575 54.9941 49.2776 55.6341 48.5376 56.0296C47.7977 56.4252 46.9435 56.552 46.1205 56.3884C45.2976 56.2248 44.5568 55.781 44.0244 55.1324C43.492 54.4839 43.201 53.6708 43.2009 52.8318C43.1992 52.355 43.2923 51.8826 43.4746 51.4421C43.657 51.0016 43.925 50.6016 44.2632 50.2655V50.2667Z"
                          fill="#236DFF"
                        />
                      </svg>
                      <div
                        style={{ color: "#505255", fontSize: "1.4vw" }}
                        className="ms-2"
                      >
                        No transactions yet
                      </div>
                    </div>
                  ) : (
                    <div>Hello </div>
                  )}
                </tr>
              </tbody>
            </table> */}
            {allOrderTablePage()}
            {__getPaginationView()}
          </div>
        </div>
      </div>
    );
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;

    setOffset((selectedPage + 1) * 10);
    setPageNumber(e.selected + 1);
    setCurrentPage(selectedPage);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (selectOrder === "openorder") {
        getOpenOrderData(filterOption, pairOption, sideOption, pageNumber);
      } else if (selectOrder === "orderhistory") {
        getCustomerAllOrdersHistory(
          fromDate,
          toDate,
          filterOption,
          pairOption,
          sideOption,
          pageNumber
        );
      } else {
        getCustomerAllTrades(
          fromDate,
          toDate,
          filterOption,
          pairOption,
          sideOption,
          pageNumber
        );
      }
      setPageCount(Math.ceil(parseInt(totalCount) / 10));
    };

    fetchData();
  }, [offset, pageNumber]);

  const customerStatusImage = (Orderstatus) => {
    if (Orderstatus?.toLowerCase() === "filled") {
      return <img src={filledIcon} height={20} width={20} alt="icon" />;
    } else if (Orderstatus?.toLowerCase() === "partially filled") {
      return (
        <img src={partiallyFilledIcon} height={20} width={20} alt="icon" />
      );
    } else if (Orderstatus?.toLowerCase() === "cancel") {
      return (
        <img
          src={orderCancelIcon}
          height={20}
          width={20}
          alt="icon"
          className="mt-1"
        />
      );
    } else {
      return <img src={rejectedIcon} height={20} width={20} alt="icon" />;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getAssetSymbols();
      // getAssetSearchPair()
    }
  }, []);

  return (
    <div
      className={
        toggle
          ? "dashboard_toggle_main_container"
          : "dashboard_profile_container"
      }
      // className="dashboard_main_container"
    >
      <SideBar
        setToggle={setToggle}
        toggle={toggle}
        activePage={"spotorders"}
      />
      <div style={{ width: "89vw", height: "100vh" }} className="ms-2">
        <div>
          <Topbar />
        </div>
        {openOrder()}
      </div>

      <Modal
        show={rightModal}
        id="dashboardModalsT"
        aria-labelledby="example-custom-modal-styling-title"
        className="dashboardTransaction"
        onHide={() => setRightModal(false)}
      >
        <Modal.Body style={{ backgroundColor: "#000000" }}>
          <div style={{ marginTop: "-10px" }}>
            <div className="px-3">
              <div className="d-flex justify-content-end search-removeIcon_summary pt-3">
                <div
                  className="textColor rounded px-2"
                  style={{ cursor: "pointer", fontSize: "27px" }}
                  onClick={() => {
                    setRightModal(false);
                  }}
                >
                  {removeIcon}
                </div>
              </div>
              <div className="d-flex my-2 text-white fw-bold  ">
                <h1 style={{ fontSize: "1.5rem" }}>Order Details</h1>
              </div>
              <div className="d-flex justify-content-between text-white  align-items-center common_border_bg progress_header px-3 py-2  rounded-2 ">
                <div className="d-flex flex-column">
                  <p className="opacity-75">Pair</p>
                  <h6 className="fw-bolder"> {customerOrder.assetPairName}</h6>
                </div>

                <div className="pt-3">
                  <p className="gap-2 d-flex">
                    {customerStatusImage(customerOrder.ordStatus)}
                    <span> {customerOrder.ordStatus}</span>
                  </p>
                </div>

                {(customerOrder.ordStatus?.toLowerCase() ===
                  "partially filled" ||
                  customerOrder.ordStatus?.toLowerCase() === "filled") && (
                  <div style={{ width: 55, height: 55 }}>
                    <CircularProgressbar
                      value={customerOrder.filledPercentage}
                      // text={`${customerOrder.filledPercentage}%`}
                      text={`${applyPrecision(
                        customerOrder.filledPercentage,
                        2
                      )}%`}
                      styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        // rotation: 0.50,

                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        // strokeLinecap: 'butt',

                        // Text size
                        textSize: "23px",

                        // How long animation takes to go from one percentage to another, in seconds
                        // pathTransitionDuration: 0.5,

                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',

                        // Colors
                        // pathColor: `${customerOrder?.ordSide.toUpperCase() === 'BUY' ?'#0ad61e' : '#f81515'}`,

                        pathColor: `${
                          customerOrder?.ordSide === "BUY"
                            ? "#0ad61e"
                            : customerOrder?.ordStatus.toLowerCase() ===
                                "partially filled" &&
                              customerOrder?.ordSide === "SELL"
                            ? "#E9B92E"
                            : "#f81515"
                        }`,

                        textColor: "#fff",
                        trailColor: "#d6d6d6",
                      })}
                    />
                  </div>
                )}
              </div>

              <div className="dashTabular text-white common_border_bg  rounded-2 py-1 opacity-75 mt-2">
                {createLabelValue("Order Id", customerOrder.excOrderId)}
                {createLabelValue(
                  "Order Status",
                  customerStatus(customerOrder.ordStatus)
                )}
                {createLabelValue(
                  "Order Date",
                  customerOrder.ordCreatedDate?.slice(0, 10)
                )}
                {createLabelValue("Total", customerOrder.total)}
                {createLabelValue(
                  "Request Order Quantity",
                  customerOrder.requestOrdQty
                )}
                {createLabelValue(
                  "Order Filled Quantity",
                  customerOrder.ordFilledQuantity
                )}
                {customerOrder.ordType?.toUpperCase() === "LIMIT" &&
                  createLabelValue(
                    "Request Order Price",
                    customerOrder.requestedOrdPrice
                  )}
                {customerOrder.ordType?.toUpperCase() === "STOP-LIMIT" &&
                  createLabelValue(
                    "Limit Order Price",
                    customerOrder.ordLimitPrice
                  )}
                {customerOrder.ordType?.toUpperCase() === "STOP-LIMIT" &&
                  createLabelValue(
                    "Stop Order Price",
                    customerOrder.ordStopPrice
                  )}
                {createLabelValue(
                  "Order Average Price",
                  customerOrder.ordFilledAvgPrice
                )}
                {createLabelValue(
                  "Order Side",
                  customerOrder.ordSide,
                  customerOrder.ordSide
                )}
                {createLabelValue("Order Type", customerOrder.ordType)}
              </div>
              <div className="py-2 text-white mt-4">
                <h1
                  style={{ fontSize: "1.5rem" }}
                  className={
                    customerOrder.ordStatus === "Cancel" ? "d-none" : "pb-2"
                  }
                >
                  Trade Details
                </h1>

                {customerTradeData.map((item, index) => {
                  return (
                    <div
                      className=" px-2 py-1 rounded-2 common_border_bg opacity-75 "
                      key={item.trdCreatedDate}
                    >
                      {createLabelValue("Trade Price", item.tradePrice)}
                      {createLabelValue(
                        "Trade Date",
                        item?.trdCreatedDate.slice(0, 10)
                      )}
                      {createLabelValue("Trade Quantity", item.tradeQty)}
                      {createLabelValue("Trade Fee", item.tradeFee)}
                    </div>
                  );
                })}

                <div className="mt-4">
                  <h1
                    style={{ fontSize: "1.5rem" }}
                    className=" pb-2 text-white"
                  >
                    Order Status
                  </h1>
                  {customerOrderHistoryData.length > 0
                    ? customerOrderHistoryData.map((e, i) => {
                        return (
                          <div className="pt-3 pb-1 mx-2" key={i}>
                            {i !== 0 && (
                              <div className={`line_deposit_rightModal `}></div>
                            )}
                            <div className="d-flex align-items-center gap-2 ">
                              <div className={`${"rounded-circle_rightModal"}`}>
                                <span
                                  className={`inner_dot_rightModal m-auto `}
                                ></span>
                              </div>
                              <div className="">
                                <div className="textCapital text-white">
                                  {e.ordStatus}
                                  <span className="small_label_modal px-1 transSummaryText">
                                    ({e.ordHistCreatedDate})
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SpotOrder;
