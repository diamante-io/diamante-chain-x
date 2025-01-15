import React, { useState, useEffect } from "react";
import moment from "moment";

import "./dashboard.css";
import Notification from "../../assets/Notification.svg";
import { Modal } from "react-bootstrap";
import bookmark from "../../assets/bookmark-02.svg";
import filledIcon from "../../assets/filled.svg";
import partiallyFilledIcon from "../../assets/partillayFilled.svg";
import cancelIcon from "../../assets/cancelled.svg";
import rejectedIcon from "../../assets/rejected.svg";
import bookmarkFill from "../../assets/bookmarkfill.svg";
import add from "../../assets/add.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import SwapIcon from "../../assets/SWAP_ICON .svg";
import filterIcon from "../../assets/filterNormal.svg";
import deleteIcon from "../../assets/Delete-schedule.svg";
import editIcon from "../../assets/Edit-schedule.svg";
import { useNavigate } from "react-router-dom";
import TradingViewChart from "../TradingViewChart/TradingViewChart";
import { URI } from "../../constants";
import axios from "axios";
import filter2 from "../../assets/filterUp.svg";
import filterdownArrow from "../../assets/filterDown.svg";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import DropdownButton from "react-bootstrap/DropdownButton";
import SockJS from "sockjs-client"; //npm i sockjs-client
import * as Stomp from "stompjs"; //npm i stompjs
import refresh_loader from "../../assets/refresh_loader.svg";
import { useSelector, useDispatch } from "react-redux";
import orderCancelIcon from "../../assets/orderCancel.svg";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  setBidGlobalVariable,
  setAskGlobalVariable,
  setMarketDataVariable,
  setAssetGlobalSymbol,
  getBidGlobalVariable,
  getAskGlobalVariable,
  getMarketDataVariable,
  getAssetGlobalSymbol,
} from "../../components/common/globalVariable";
import {
  applyPrecision,
  condition,
  createLabelValue,
  customerStatus,
  formatNumber,
  getAmt,
} from "../commonComponent";
import orderBookFilter from "../../assets/dashboard-square-01.svg";
import orderBookFilterTwo from "../../assets/dashboard-square-01-1.svg";
import orderBookFilterThree from "../../assets/dashboard-square-01-2.svg";
import { setDashboardNavigation } from "../../redux/actions";
import Loader from "../common/Loader";
import Topbar from "../Topbar/Topbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Slider } from "antd";

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
var stompClient = "";

const Dashboard = () => {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem("accessToken");
    return Boolean(token);
  };

  const isLoggedIn = isAuthenticated();

  const [selectCurrency, setSelectCurrency] = useState("");
  const [selectOrder, setSelectOrder] = useState("openOrder");
  const [assetSearchValue, setAssetSearchValue] = useState("");
  const [marketData, setMarketData] = useState([]);
  const [askData, setAskData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [assetBalance, setAssetBalance] = useState([]);
  const [marketType, setMarketType] = useState("limit");
  const [priceStopValueOne, setPriceStopValueOne] = useState(0);
  const [stopLimitMarketPrice, setStopLimitMarketPrice] = useState({
    ask: 0,
    bid: 0,
  });
  const [apiLoaderType, setApiLoaderType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [amountValueOne, setAmountValueOne] = useState("");
  const [limitTotalValueOne, setLimitTotalValueOne] = useState("");
  const [priceStopValueTwo, setPriceStopValueTwo] = useState("");
  const [amountValueTwo, setAmountValueTwo] = useState("");
  const [limitTotalValueTwo, setLimitTotalValueTwo] = useState("");
  const [stopLimitTotalBuy, setStopLimitTotalBuy] = useState("");
  const [stopLimitTotalSell, setStopLimitTotalSell] = useState("");
  const [stopLimitPreviewModal, setStopLimitPreviewModal] = useState("");
  const [createOrderType, setCreateOrderType] = useState("Buy");
  const [quotePrecision, setQuotePrecision] = useState(0);
  const [buyRangeValue, setBuyRangeValue] = useState(0);
  const [sellRangeValue, setSellRangeValue] = useState(0);
  const [assetSymbols, setAssetSymbols] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedOrderBookValue, setSelectedOrderBookValue] = useState("0.01");
  const [selectedOrderBookFilterValues, setSelectedOrderBookFilterValues] =
    useState(["0.01", "0.1", "1", "50", "100"]);
  const [customerOrderList, setCustomerOrderList] = useState([]);
  const [selectedFilterTab, setSelectedFilterTab] = useState("");
  const [openOrderData, setOpenOrderData] = useState([]);
  const [tradeData, setTradeAllData] = useState([]);
  const [filteredAskData, setFilteredAskData] = useState([]);
  const [filteredBidData, setFilteredBidData] = useState([]);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 7);
  const today = new Date();
  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [deleteKeyValue, setDeleteKeyValue] = useState();
  const [editKeyValue, setEditKeyValue] = useState();
  const [editPriceValue, setEditPriceValue] = useState();
  const [editLimitValue, setEditLimitValue] = useState();
  const [editAmtValue, setEditAmtValue] = useState();
  const [editTotalAmt, setEditTotalAmt] = useState();
  const [requestNo, setRequestNo] = useState("");
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState(1);
  const [tradeVolData, setTradeVolData] = useState({
    baseVol24hrs: 0.0,
    lowPrice24hrs: 0.0,
    assetSymbol: 0,
    quoteVol24hrs: 0.0,
    priceChange24hrs: 0.0,
    priceDiff24hrs: 0.0,
    highPrice24hrs: 0.0,
    lastPrice: 0.0,
  });
  const [fundsData, setFundsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderBookTab, setSelectedOrderBookTab] = useState(1);
  const [activeTab, setActiveTab] = useState("price");
  const [hoveredOrderAskKey, setHoveredOrderAskKey] = useState(askData?.length);
  const [hoveredOrderBidKey, setHoveredOrderBidKey] = useState(-1);
  const [changeData, setChangeData] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectAssetFilter, setSelectAssetFilter] = useState(0);
  const [selectPriceFilter, setSelectPriceFilter] = useState(0);
  const [selectChangeFilter, setSelectChangeFilter] = useState(0);
  const [selectVolumeFilter, setSelectVolumeFilter] = useState(0);
  const [filterOption, setFilterOption] = useState("ALL");
  const [pairOption, setPairOption] = useState("ALL");
  const [sideOption, setSideOption] = useState("ALL");
  const [isFav, setIsfav] = useState(false);
  const [rightModal, setRightModal] = useState(false);
  const [customerOrder, setCustomerOrder] = useState([]);
  const [customerTradeData, setCustomerTradeData] = useState([]);
  const [customerOrderHistoryData, setCustomerHistoryOrderHistory] = useState(
    []
  );
  const [btnLoader, setBtnLoader] = useState(false);
  const [btnLoaderTwo, setBtnLoaderTwo] = useState(false);
  const [internetStatus, setInternetStatus] = useState({
    status: "",
    isConnected: true,
  });
  const [maxVisibleRecords, setMaxVisibleRecords] = useState(0);

  const navigate = useNavigate();
  const dispatcher = useDispatch();
  const { customerId } = useSelector((stat) => stat.ChangeState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  ///////////// socket implementation ////////////////////

  const marks = {
    0: {
      label: <small className="d-none">0</small>,
    },
    25: {
      label: <small className="d-none">25%</small>,
    },
    50: {
      label: <small className="d-none">50%</small>,
    },
    75: {
      label: <small className="d-none">75%</small>,
    },
    100: {
      label: <small className="d-none">100%</small>,
    },
  };

  const formatter = (v) => `${v}%`;

  const changeExpoValue = (value) => {
    value = applyPrecision(value, 8);
    return Math.abs(value) < 1 && value.toString().includes("e")
      ? parseFloat(value)
          .toFixed(8)
          .replace(/\.?0+$/, "")
      : value;
  };

  function generateArray(value) {
    const result = new Set([value]);
    let nextValue = value;
    for (let i = 0; i < 4; i++) {
      nextValue *= 10;
      nextValue = parseFloat(Math.min(nextValue, 100));
      result.add(Math.round(nextValue * 1e8) / 1e8);
    }
    if (result.has(100) && !result.has(50)) {
      result.add(50);
    }
    if (result.has(100) && value !== 0.1 && result.length < 5) {
      result.add(parseFloat((value / 10).toFixed(8)));
    }
    return [...result].sort((a, b) => a - b);
  }

  function sumValuesUpToIndex(numbers, givenIndex, type, dataType) {
    let arr = dataType === "bidData" ? numbers : numbers.slice().reverse();
    let length =
      dataType === "bidData" ? givenIndex : numbers.length - givenIndex - 1;
    let sum = 0;

    for (let i = 0; i <= length; i++) {
      sum +=
        type === "amount"
          ? Number(arr[i]?.amount)
          : arr[i]?.price * arr[i]?.amount;
    }
    return applyPrecision(sum, 7);
  }

  function averageValuesUpToIndex(numbers, givenIndex, type) {
    let arr = type === "bidData" ? numbers : numbers.slice().reverse();
    let sum = 0;
    let length =
      type === "bidData" ? givenIndex : numbers.length - givenIndex - 1;
    for (let i = 0; i <= length; i++) {
      sum += Number(arr[i]?.price);
    }

    const average = sum / (length + 1);
    return applyPrecision(average, 7);
  }

  const handleBuyRangeValue = (e) => {
    setBuyRangeValue(e);

    let selectedValue = assetBalance.quoteAssetBalance * (e / 100);
    // priceStopValueOne > 0 &&
    if (priceStopValueOne > 0) {
      setAmountValueOne(formatNumber(selectedValue / priceStopValueOne));
      setLimitTotalValueOne(applyPrecision(selectedValue, 8));
    }
    // if (e !== 0) {
    // setAmountValueOne(0);
    // priceStopValueOne > 0 &&
    //   setAmountValueOne(formatNumber(selectedValue / priceStopValueOne));
    // setLimitTotalValueOne(applyPrecision(assetBalance.quoteAssetBalance, 8));
    // setLimitTotalValueOne(
    //   applyPrecision(priceStopValueOne * parseFloat(amountValueOne), 8)
    // );
    // } else {
    //   setAmountValueOne(0);
    //   setLimitTotalValueOne(0);
    // }
  };

  const handleSellRangeValue = (e) => {
    let selectedValue = assetBalance.baseAssetBalance * (e / 100);
    // if (e === 0) {
    //   // setLimitTotalValueTwo();
    //   setAmountValueTwo(0);
    // } else {
    //   setLimitTotalValueTwo(
    //     applyPrecision(priceStopValueTwo * selectedValue, 8)
    //   );
    //   // setLimitTotalValueTwo(applyPrecision(selectedValue, 8));
    //   priceStopValueTwo > 0 && setAmountValueTwo(formatNumber(selectedValue));
    // }

    if (priceStopValueTwo > 0) {
      setLimitTotalValueTwo(
        applyPrecision(priceStopValueTwo * selectedValue, 8)
      );
      priceStopValueTwo > 0 && setAmountValueTwo(formatNumber(selectedValue));
    }
  };

  const restoreStatesOrders = () => {
    setSelectedFilterTab("");
    setFromDate(yesterday);
    setToDate(today);
    setFilterOption("ALL");
    setPairOption("ALL");
    setSideOption("ALL");
  };

  const _send = (message) => {
    console.log(message, "message");
    if (stompClient) {
      stompClient.send("/app/sendOStream", {}, JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not established yet.");
    }
  };

  const errorCallBack = (error) => {
    setTimeout(() => {
      _connect(selectedAssetSymbol);
    }, 5000);
  };
  const _connect = (__assetSymb) => {
    const ws = SockJS(URI.socketStream);
    stompClient = Stomp.over(ws);
    stompClient.connect(
      {},
      function (frame) {
        var reqNo = Math.floor(Math.random() * 1000 + 1);

        const req = {
          method: "SUBSCRIBE",
          params: [`${__assetSymb}@depth`, `${__assetSymb}@trade`],
          id: reqNo,
        };

        stompClient.subscribe("/user/topic/oStream", function (sdkEvent) {
          onMessageReceived(sdkEvent, reqNo);
        });
        _send(req);
        setRequestNo(reqNo);
      },
      errorCallBack
    );
  };

  const _disconnect = (__assetSymbol) => {
    const req = {
      method: "UNSUBSCRIBE",
      params: [`${__assetSymbol}@depth`, `${__assetSymbol}@trade`],
      id: requestNo, //random number
    };
    _send(req);

    if (stompClient !== null) {
      stompClient.disconnect();
    }
  };

  const onMessageReceived = (message, id) => {
    let serverMsg = JSON.parse(message.body);

    if (serverMsg.e !== null) {
      let serverData = JSON.parse(serverMsg.data);
      if (serverMsg.e === "24hChange") {
        setTradeVolData(serverData);
        let assetSymbols = getAssetGlobalSymbol();
        let objIndex = assetSymbols.findIndex(
          (e) => e.assetSymbol == serverData.assetSymbol
        );

        assetSymbols[objIndex].price = serverData.lastPrice;
        assetSymbols[objIndex]["24hChange"] = serverData.priceChange24hrs;
        setAssetGlobalSymbol(assetSymbols);
        setAssetSymbols(assetSymbols);
      } else {
        let eValue = serverMsg.e?.split("@");

        if (eValue[1] === "depth") {
          if (serverData?.action === "NEW" && serverMsg.id == id) {
            var newData = {
              amount: serverData.quantity,
              price: serverData.price,
            };
            if (serverData.side === "BID") {
              let bidData = getBidGlobalVariable();

              bidData.push(newData);
              bidData.sort((a, b) => a.price - b.price);
              bidData = bidData.reverse();
              setBidGlobalVariable(bidData);
              const bidHighValue = Math.max(
                ...bidData.map((obj) => obj.price * obj.amount)
              );
              let filteredBidData = bidData.map((obj) => ({
                ...obj,
                total: obj.price * obj.amount,
                depth: ((obj.price * obj.amount) / bidHighValue) * 100,
              }));
              setBidData(filteredBidData);

              setFilteredBidData(displayWithPrecision(filteredBidData, "0.01"));
            } else {
              let askData = getAskGlobalVariable();

              askData.push(newData);
              askData.sort((a, b) => a.price - b.price);
              askData = askData.reverse();

              setAskGlobalVariable(askData);
              const askHighValue = Math.max(
                ...askData.map((obj) => obj.price * obj.amount)
              );
              let filteredAskData = askData.map((obj) => ({
                ...obj,
                total: obj.price * obj.amount,
                depth: ((obj.price * obj.amount) / askHighValue) * 100,
              }));

              setAskData(filteredAskData);
              setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
            }
          } else if (serverData?.action === "CHANGE" && serverMsg.id == id) {
            if (serverData.side === "BID") {
              let bidData = getBidGlobalVariable();
              if (bidData?.length > 0) {
                let objIndex = bidData.findIndex(
                  (e) => e.price == serverData.price
                );

                if (bidData[objIndex].hasOwnProperty("amount")) {
                  bidData[objIndex].amount = serverData.quantity;

                  setBidGlobalVariable(bidData);
                  const bidHighValue = Math.max(
                    ...bidData.map((obj) => obj.price * obj.amount)
                  );
                  let filteredBidData = bidData.map((obj) => ({
                    ...obj,
                    total: obj.price * obj.amount,
                    depth: ((obj.price * obj.amount) / bidHighValue) * 100,
                  }));
                  setBidData(filteredBidData);
                  setFilteredBidData(
                    displayWithPrecision(filteredBidData, "0.01")
                  );
                }
              }
            } else {
              let askData = getAskGlobalVariable();
              if (askData?.length > 0) {
                let objIndex = askData.findIndex(
                  (e) => e.price == serverData.price
                );

                askData[objIndex].amount = serverData.quantity;

                setAskGlobalVariable(askData);
                const askHighValue = Math.max(
                  ...askData.map((obj) => obj.price * obj.amount)
                );
                let filteredAskData = askData.map((obj) => ({
                  ...obj,
                  total: obj.price * obj.amount,
                  depth: ((obj.price * obj.amount) / askHighValue) * 100,
                }));
                setAskData(filteredAskData);
                setFilteredAskData(
                  displayWithPrecision(filteredAskData, "0.01")
                );
              }
            }
          } else if (
            (serverData?.action === "DELETE" ||
              serverData?.action === "TRADEDELETE") &&
            serverMsg.id == id
          ) {
            if (serverData.side === "BID") {
              let bidData = getBidGlobalVariable();

              bidData = bidData.filter((e) => e.price != serverData.price);
              setBidGlobalVariable(bidData);
              const bidHighValue = Math.max(
                ...bidData.map((obj) => obj.price * obj.amount)
              );
              let filteredBidData = bidData.map((obj) => ({
                ...obj,
                total: obj.price * obj.amount,
                depth: ((obj.price * obj.amount) / bidHighValue) * 100,
              }));
              setBidData(filteredBidData);
              setFilteredBidData(displayWithPrecision(filteredBidData, "0.01"));
            } else {
              let askData = getAskGlobalVariable();

              askData = askData.filter((e) => e.price != serverData.price);
              setAskGlobalVariable(askData);
              const askHighValue = Math.max(
                ...askData.map((obj) => obj.price * obj.amount)
              );
              let filteredAskData = askData.map((obj) => ({
                ...obj,
                total: obj.price * obj.amount,
                depth: ((obj.price * obj.amount) / askHighValue) * 100,
              }));
              setAskData(filteredAskData);
              setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
            }
          }
        } else if (eValue[1] === "trade" && serverMsg.id == id) {
          let marketData = getMarketDataVariable();

          let newValue = {
            symbol: serverData.symbol,
            side: serverData.side,
            quantity: serverData.quantity,
            price: serverData.price,
            timestamp: serverData.timestamp,
          };
          marketData.unshift(newValue);
          setMarketDataVariable(marketData.slice(0, 50));
          setMarketData(marketData.slice(0, 50));
        }
      }
    }
  };

  /////////////////////////////////////////////////////////////

  function displayWithPrecision(values, precision = 0.01) {
    let newList = [];

    values.forEach((value) => {
      const formattedValue = (
        Math.round(value.price / precision) * precision
      ).toFixed(precision.toString().split(".")[1]?.length || 0);

      // Create a new object for each value, instead of modifying the same object
      const newObj = {
        amount: value.amount,
        price: formattedValue,
        total: value.total,
        depth: value.depth,
      };

      newList.push(newObj);
    });

    return newList;
  }

  const getAllfunds = async () => {
    axios
      .get(URI.getAllfunds + customerId, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setFundsData(response.data.data);
        } else {
          setFundsData([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getAssetBalance = async (assetSymbol) => {
    axios
      .get(URI.getAssetBalance + "/" + customerId + "/" + assetSymbol, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setAssetBalance(response.data.data);
        } else {
          setAssetBalance([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getCustTradeVolume = async (__assetSymb) => {
    axios
      .get(URI.getTradeVolume + __assetSymb)

      .then((response) => {
        if (response.data.status === 200) {
          setTradeVolData(response.data.data);
        } else {
          setTradeVolData({
            baseVol24hrs: 0.0,
            lowPrice24hrs: 0.0,
            assetSymbol: 0.0,
            quoteVol24hrs: 0.0,
            priceChange24hrs: 0.0,
            priceDiff24hrs: 0.0,
            highPrice24hrs: 0.0,
            lastPrice: 0.0,
          });
        }
      })

      .catch((error) => {
        // console.log(error);
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
          setCustomerHistoryOrderHistory(response.data.data.orderHistory);
          setRightModal(true);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clearState = () => {
    if (marketType !== "stop_limit") {
      setStopLimitMarketPrice({
        ask: 0,
        bid: 0,
      });
      setLimitTotalValueOne("");
      setLimitTotalValueTwo("");
      // setLimitTotalValueOne(bidData[0]?.price);
      // setLimitTotalValueTwo(bidData[0]?.price);
    } else {
      setPriceStopValueOne(bidData[0]?.price);
      setPriceStopValueTwo(bidData[0]?.price);
      setLimitTotalValueOne("");
      setLimitTotalValueTwo("");
    }
    setAmountValueOne("");
    setAmountValueTwo("");
    setErrorMsg("");
    setBuyRangeValue(0);
    setSellRangeValue(0);
  };

  const getOrderBookData = async (assetSymb) => {
    await axios
      .get(URI.getOrderData + assetSymb + "/100")

      .then((response) => {
        if (response.data.status === 200) {
          const askPrimaryData = response.data.data.ask.reverse();
          const askHighValue = Math.max(
            ...askPrimaryData.map((obj) => obj.price * obj.amount)
          );
          let filteredAskData = askPrimaryData.map((obj) => ({
            ...obj,
            total: obj.price * obj.amount,
            depth: ((obj.price * obj.amount) / askHighValue) * 100,
          }));
          setAskData(filteredAskData);
          setHoveredOrderAskKey(filteredAskData.length + 1);

          const bidHighValue = Math.max(
            ...response.data.data.bid.map((obj) => obj.price * obj.amount)
          );
          let filteredBidData = response.data.data.bid.map((obj) => ({
            ...obj,
            total: obj.price * obj.amount,
            depth: ((obj.price * obj.amount) / bidHighValue) * 100,
          }));

          setAskGlobalVariable(askPrimaryData);
          setBidData(filteredBidData);
          if (marketType !== "stop_limit") {
            setPriceStopValueOne(Number(filteredBidData[0]?.price) || "");
            setPriceStopValueTwo(Number(filteredBidData[0]?.price) || "");
          }
          setBidGlobalVariable(response.data.data.bid);
          setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
          setFilteredBidData(displayWithPrecision(filteredBidData, "0.01"));
        } else {
          setAskGlobalVariable([]);
          setBidData([]);
          setBidGlobalVariable([]);
          setFilteredAskData([]);
          setFilteredBidData([]);
          setAskData([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getOpenOrderData = async (filterOption, pairOption, sideOption) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      pageNo: 1,
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
          setOpenOrderData(response.data.data.orderList.slice(0, 5));
        } else {
          setIsLoading(false);
          setOpenOrderData([]);
        }
      })

      .catch((error) => {});
  };

  const getCustomerAllOrdersHistory = async (
    __fromDate,
    __toDate,
    __sideValue,
    __fliterOption,
    type
  ) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      ordStatus: __fliterOption,
      ordSide: __sideValue,
      // fromDate: __fromDate,
      // toDate: __toDate,
      fromDate: moment(new Date(__fromDate)).format("YYYY-MM-DD"),
      toDate: moment(new Date(__toDate)).format("YYYY-MM-DD"),
      baseAsset: "ALL",
      quoteAsset: "ALL",
      pageNo: 1,
      pageSize: 10,
      ordType: type,
    };
    await axios
      .post(URI.getCustomerAllOrdersHistory, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setCustomerOrderList(response.data.data.customerList.slice(0, 5));
        } else {
          setIsLoading(false);
          setCustomerOrderList([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCustomerAllTrades = async (__fromDate, __toDate, __sideValue) => {
    setIsLoading(true);
    const requestBody = {
      customerId: customerId,
      tradeSide: __sideValue,
      tradeStatus: "ALL",
      // fromDate: __fromDate,
      // toDate: __toDate,
      fromDate: moment(new Date(__fromDate)).format("YYYY-MM-DD"),
      toDate: moment(new Date(__toDate)).format("YYYY-MM-DD"),
      baseAsset: "ALL",
      quoteAsset: "ALL",
      pageNo: 1,
      pageSize: 10,
    };
    await axios
      .post(URI.getCustomerAllTrades, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setTradeAllData(response.data.data.customerList.slice(0, 5));
          setIsLoading(false);
        } else {
          setTradeAllData([]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMarketData = async (__assetSymb) => {
    setApiLoaderType("marketTrade");
    await axios
      .get(URI.getMarketData + __assetSymb + "/50")
      .then((response) => {
        if (response.data.status === 200) {
          setApiLoaderType("");
          setMarketDataVariable(response.data.data);
          setMarketData(response.data.data);
        } else {
          setApiLoaderType("");
          setMarketData([]);
        }
      })
      .catch((error) => {
        setApiLoaderType("");
        console.log(error);
      });
  };

  // const getMarketAmount = async (type, value) => {
  //   await axios
  //     .get(URI.getMarketAmount + type + "/" + value)

  //     .then((response) => {
  //       if (response.data.status === 200) {
  //         // if (type === "ASK") {
  //         //   setPriceStopValueOne(
  //         //     parseFloat(response.data.data.price).toFixed(2)
  //         //   );
  //         // } else {
  //         //   setPriceStopValueTwo(
  //         //     parseFloat(response.data.data.price).toFixed(2)
  //         //   );
  //         // }
  //         console.log(response);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const getMarketPrice = async (type, value) => {
    if (value !== "" && value > 0) {
      await axios
        .get(
          URI.getMarketPrice + selectedAssetSymbol + "/" + type + "/" + value
        )
        .then((response) => {
          if (response.data.data.statusCode === "1") {
            if (marketType === "stop_limit") {
              setStopLimitMarketPrice({
                ask:
                  type === "ASK"
                    ? parseFloat(response.data.data.price).toFixed(2)
                    : 0,
                bid:
                  type === "BID"
                    ? parseFloat(response.data.data.price).toFixed(2)
                    : 0,
              });
            } else {
              if (type?.toUpperCase() === "BID") {
                let selectedAmount =
                  Number(value.replace(/[^\d.]/gi, "")) *
                  Number(response.data.data.price);
                setPriceStopValueOne(
                  parseFloat(response.data.data.price).toFixed(2)
                );
                setLimitTotalValueOne(applyPrecision(selectedAmount, 8));
              } else {
                let selectedAmount =
                  Number(value.replace(/[^\d.]/gi, "")) *
                  Number(response.data.data.price);
                setPriceStopValueTwo(
                  parseFloat(response.data.data.price).toFixed(2)
                );
                setLimitTotalValueTwo(applyPrecision(selectedAmount, 8));
              }
              // type === "BID"
              //   ? setPriceStopValueOne(
              //       parseFloat(response.data.data.price).toFixed(2)
              //     )
              //   : setPriceStopValueTwo(
              //       parseFloat(response.data.data.price).toFixed(2)
              //     );
            }
          } else {
            // type === "BID"
            //   ? setPriceStopValueOne("")
            //   : setPriceStopValueTwo("");
            if (marketType === "market") {
              type === "BID"
                ? setLimitTotalValueOne(0)
                : setLimitTotalValueTwo(0);
            }
            setStopLimitMarketPrice({
              ask: 0,
              bid: 0,
            });
            setStopLimitTotalSell(0);
            setStopLimitTotalBuy(0);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const getTabAssetSymbols = async (asset, type, isFav) => {
    setIsfav(isFav);

    setSelectCurrency(asset);
    var requestBody;

    if (isLoggedIn) {
      if (type === "search") {
        requestBody = {
          searchAsset: asset,
          customerId: customerId,
        };
      } else {
        if (asset !== "") {
          requestBody = {
            asset: asset,
            customerId: customerId,
          };
        } else {
          requestBody = {
            customerId: customerId,
          };
        }
      }
    } else {
      if (type === "search") {
        requestBody = {
          searchAsset: asset,
        };
      } else {
        if (asset !== "") {
          requestBody = {
            asset: asset,
          };
        } else {
          requestBody = {};
        }
      }
    }

    await axios
      .post(URI.getAssetSymbols, requestBody)
      .then((response) => {
        if (response.data.status === 200) {
          if (isFav) {
            let favouriteDetails = response.data.data.filter(
              (b) => b.isFavourite
            );
            setAssetSymbols(favouriteDetails);
            setAssetGlobalSymbol(favouriteDetails);
          } else {
            setAssetSymbols(response.data.data);
            setAssetGlobalSymbol(response.data.data);
          }
        } else {
          setAssetSymbols([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssetSymbols = async (asset) => {
    var requestBody;

    if (isLoggedIn) {
      if (asset !== "") {
        requestBody = {
          asset: asset,
          customerId: customerId,
        };
      } else {
        requestBody = {
          customerId: customerId,
        };
      }
    } else {
      if (asset !== "") {
        requestBody = {
          asset: asset,
        };
      } else {
        requestBody = {};
      }
    }

    await axios
      .post(URI.getAssetSymbols, requestBody)
      .then((response) => {
        if (response.data.status === 200) {
          if (isFav) {
            let favouriteDetails = response.data.data.filter(
              (b) => b.isFavourite
            );
            setAssetSymbols(favouriteDetails);
            setAssetGlobalSymbol(favouriteDetails);
            setSelectedAsset(favouriteDetails[0]);
            setQuotePrecision(favouriteDetails[0].quotePrecision);
          } else {
            setAssetSymbols(response.data.data);
            setAssetGlobalSymbol(response.data.data);
            setSelectedAsset(response.data.data[0]);
            setQuotePrecision(response.data.data[0].quotePrecision);
          }
        } else {
          setAssetSymbols([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createAssetWatchList = async (item) => {
    const requestBody = {
      customerId: customerId,
      assetPairId: item.assetSymbol,
      assetWatchStatus: item.isFavourite === 1 ? "0" : "1",
    };

    await axios
      .post(URI.createWatchList, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          getTabAssetSymbols(selectCurrency, "tab", false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createBuyNewOrder = async () => {
    setBtnLoader(true);
    const requestBody = {
      customerId: customerId,
      requestOrdQty: amountValueOne?.toString(),
      ordSide: "BUY",
      ordType: marketType === "limit" ? "LIMIT" : "MARKET",
      ordPrice: priceStopValueOne?.toString(),
      ordName: "SPOT",
      ordAssetSymbol: selectedAsset.assetSymbol,
    };
    await axios
      .post(URI.createOrder, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          NotificationManager.success("", response.data.message, 5000);
          setBtnLoader(false);
          setBuyRangeValue(0);
          // setPriceStopValueOne(" ");
          setAmountValueOne(" ");
          setLimitTotalValueOne(" ");
          setBuyRangeValue(0);
          if (response.data.data.hasOwnProperty("tradeId")) {
            setSelectOrder("orderHistory");
            getCustomerAllOrdersHistory(fromDate, toDate, "ALL", "ALL", "ALL");

            //  getCustomerAllTrades()
          } else {
            setSelectOrder("openOrder");
            getOpenOrderData("ALL", "ALL", "ALL");
          }
          getAllfunds();
          getAssetBalance(selectedAsset.assetSymbol);
        } else {
          // setAssetSymbols([]);
          setBtnLoader(false);
          NotificationManager.error("", response.data.message, 5000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createsellNewOrder = async () => {
    setBtnLoaderTwo(true);
    const requestBody = {
      customerId: customerId,
      requestOrdQty: amountValueTwo.toString(),
      ordSide: "SELL",
      ordType: marketType === "limit" ? "LIMIT" : "MARKET",
      ordPrice: priceStopValueTwo.toString(),
      ordName: "SPOT",
      ordAssetSymbol: selectedAsset.assetSymbol,
    };
    await axios
      .post(URI.createOrder, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          NotificationManager.success("", response.data.message, 5000);
          setBtnLoaderTwo(false);
          // setPriceStopValueTwo(" ");
          setAmountValueTwo(" ");
          setLimitTotalValueTwo("");
          setSellRangeValue(0);
          setStopLimitTotalSell("");
          getAllfunds();
          if (response.data.data.hasOwnProperty("tradeId")) {
            setSelectOrder("orderHistory");
            getCustomerAllOrdersHistory(fromDate, toDate, "ALL", "ALL", "ALL");
          } else {
            setSelectOrder("openOrder");
            getOpenOrderData("ALL", "ALL", "ALL");
          }
          getAssetBalance(selectedAsset.assetSymbol);
        } else {
          NotificationManager.error("", response.data.message, 5000);
          setBtnLoaderTwo(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createStopLimitBuyOrder = async (type) => {
    setErrorMsg("");
    if (type === "BUY") {
      setBtnLoader(true);
    } else {
      setBtnLoaderTwo(true);
    }

    const requestBody = {
      customerId: customerId,
      ordAssetSymbol: selectedAsset.assetSymbol,
      requestOrdQty:
        type === "BUY" ? amountValueOne.toString() : amountValueTwo.toString(),
      ordSide: type,
      ordType: "STOP-LIMIT",
      ordLimitPrice:
        type === "BUY"
          ? limitTotalValueOne.toString()
          : limitTotalValueTwo.toString(),
      ordStopPrice:
        type === "BUY"
          ? priceStopValueOne.toString()
          : priceStopValueTwo.toString(),
    };
    await axios
      .post(URI.getStopLimitCreateOrder, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          NotificationManager.success("", response.data.message, 5000);
          if (type === "BUY") {
            setBtnLoader(false);
          } else {
            setBtnLoaderTwo(false);
          }
          setPriceStopValueOne("");
          setAmountValueOne("");
          setPriceStopValueTwo("");
          setAmountValueTwo("");
          setStopLimitTotalBuy("");
          setStopLimitTotalSell("");
          setBuyRangeValue(0);
          setSellRangeValue(0);
          getOpenOrderData("ALL", "ALL", "ALL");
          getAssetBalance(selectedAsset.assetSymbol);
          // if (marketType !== "stop_limit") {
          setLimitTotalValueOne("");
          setLimitTotalValueTwo("");
          // }
          setStopLimitPreviewModal(false);
        } else {
          NotificationManager.error("", response.data.message, 5000);
          if (type === "BUY") {
            setBtnLoader(false);
          } else {
            setBtnLoaderTwo(false);
          }
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
          setBtnLoader(false);
          setSuccessMsg(response.data.message);
          setDeleteModal(false);
          setSelectOrder("openOrder");
          getOpenOrderData("ALL", "ALL", "ALL");
          // getCustomerAllOrdersHistory(fromDate, toDate, "ALL", "ALL", "");
          setTimeout(() => {
            setSuccessMsg("");
          }, 3000);
        } else {
          setBtnLoader(false);
          setErrorMsg(response.data.message);
          setTimeout(() => {
            setErrorMsg("");
          }, 3000);
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
      requestOrdQty: editAmtValue?.toString(),
      ordSide: openOrderData[editKeyValue].ordSide,
      ordType: __ordType?.toUpperCase(),
      ordAssetSymbol: openOrderData[editKeyValue].ordAssetSymbol,
      orderId: openOrderData[editKeyValue].orderId,
      // flagValue:
      //     activeTab === "price"
      // /      ? "price_modify"
      //       : "amt_modify"
      // ordStopPrice:
      //   __ordType?.toUpperCase() === "STOP-LIMIT"
      //     ? openOrderData[editKeyValue].ordStopPrice.toString()
      //     : null,
      // ordLimitPrice:
      //   __ordType?.toUpperCase() === "STOP-LIMIT"
      //     ? openOrderData[editKeyValue].ordLimitPrice.toString()
      //     : null,
    };

    // if (__ordType?.toUpperCase() !== "STOP-LIMIT") {
    //   requestBody.flagValue =
    //     activeTab === "price" ? "price_modify" : "amt_modify";
    // } else {
    //   requestBody.ordStatus = "UPDATE";
    // }
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
          setEditModal(false);
          setSelectOrder("openOrder");
          getOpenOrderData("ALL", "ALL", "ALL");
          NotificationManager.success("", response.data.message, 5000);
        } else {
          setBtnLoader(false);
          NotificationManager.error("", response.data.message, 5000);
        }
      })
      .catch((error) => {
        setBtnLoader(false);
        NotificationManager.error("", error.message, 5000);
      });
  };

  const handleSelectOrderBookValue = (eventKey) => {
    setSelectedOrderBookValue(eventKey);
    setFilteredAskData(
      displayWithPrecision(askData, eventKey ? eventKey : "0.01")
    );
    setFilteredBidData(
      displayWithPrecision(bidData, eventKey ? eventKey : "0.01")
    );
  };

  useEffect(() => {
    if (askData.length > 0) {
      setFilteredAskData(displayWithPrecision(askData, selectedOrderBookValue));
      setFilteredBidData(displayWithPrecision(bidData, selectedOrderBookValue));
    }
  }, [askData, bidData]);

  const handleDateUpdate = async (type, e) => {
    if (selectOrder === "orderHistory") {
      getCustomerAllOrdersHistory(
        type === "fromDate" ? new Date(e) : fromDate,
        type !== "fromDate" ? new Date(e) : toDate,
        sideOption,
        filterOption,
        "ALL"
      );
    } else {
      getCustomerAllTrades(
        type === "fromDate" ? new Date(e) : fromDate,
        type !== "fromDate" ? new Date(e) : toDate,
        sideOption
      );
    }
    // const dateValue = e.target.value;

    type === "fromDate" ? setFromDate(new Date(e)) : setToDate(new Date(e));
  };

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

  const onSearchAsset = async (assetPair) => {
    const selectedAsset = assetSymbols.find(
      (assetSymbol) => assetSymbol.assetPairName === assetPair
    );
    setSelectedOrderBookValue(changeExpoValue(selectedAsset.minPriceMovement));
    let list = generateArray(changeExpoValue(selectedAsset.minPriceMovement));
    setSelectedOrderBookFilterValues(list);

    const req2 = {
      method: "UNSUBSCRIBE",
      params: [`${selectedAssetSymbol}@depth`, `${selectedAssetSymbol}@trade`],
      id: requestNo, //random number
    };
    _send(req2);
    const req1 = {
      method: "SUBSCRIBE",
      params: [
        `${selectedAsset.assetSymbol}@depth`,
        `${selectedAsset.assetSymbol}@trade`,
      ],
      id: requestNo,
    };
    stompClient.subscribe("/user/topic/oStream", function (sdkEvent) {
      onMessageReceived(sdkEvent, requestNo);
    });
    _send(req1);
    setMarketData([]);
    getMarketData(selectedAsset.assetSymbol);
    getOrderBookData(selectedAsset.assetSymbol);
    getCustTradeVolume(selectedAsset.assetSymbol);
    setSelectedAssetSymbol(selectedAsset.assetSymbol);
    setSelectedAsset(selectedAsset);
  };

  const openOrderTable = () => (
    <div className="table_main_container">
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Date
            </th>
            <th scope="col">Pair</th>
            <th scope="col" className="p-0">
              <DropdownButton
                title={filterOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  setFilterOption(key);
                  getOpenOrderData(key, pairOption, sideOption);
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
            </th>
            <th scope="col " className="p-0">
              <DropdownButton
                title={sideOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  setSideOption(key);
                  getOpenOrderData(filterOption, pairOption, key);
                }}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
                <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
              </DropdownButton>
            </th>
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
                        ? formatNumber(item?.ordLimitPrice) || "-"
                        : formatNumber(item?.requestedOrdPrice)}
                    </td>
                    <td className="ps-3">
                      {item.ordType === "STOP-LIMIT"
                        ? formatNumber(item?.ordStopPrice) || "-"
                        : "-"}
                    </td>
                    <td>
                      {formatNumber(item.requestOrdQty)}&nbsp;{item.baseAsset}
                    </td>
                    <td>
                      {formatNumber(item.ordFilledQuantity)}&nbsp;
                      {item.baseAsset}
                    </td>
                    <td>{item.total}</td>

                    <td className="d-flex gap-2 justify-content-start">
                      <button
                        className="editDel_button"
                        disabled={item.ordStatus === "filled" ? true : false}
                      >
                        <img
                          src={editIcon}
                          alt="img"
                          width={18}
                          height={22}
                          onClick={() => {
                            getAssetBalance(item.ordAssetSymbol);
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
                          className="cursorPointer"
                        />
                      </button>

                      <button
                        className="editDel_button"
                        disabled={item.ordStatus === "filled" ? true : false}
                      >
                        <img
                          src={deleteIcon}
                          alt="img"
                          width={18}
                          height={22}
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteKeyValue(key);
                          }}
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
            <td colSpan={12} className="border-0 pt-2">
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
                  //   setErrorMsg("Partially filled order can't be deleted");
                  //   setTimeout(() => {
                  //     setErrorMsg("");
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
                className={`small ${errorMsg ? "text-danger" : "text-success"}`}
              >
                {errorMsg || successMsg}
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
            className="modalUS row justify-content-center m-0"
            style={{
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
                  className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between  ${
                    activeTab === "price" ? "common_input_bg" : "opacity-50"
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
                    // className="w-75 bg-transparent text-white px-2 text-end"
                    className={`w-75 bg-transparent text-white px-2 text-end`}
                    // placeholder="Price"
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
                  <label
                    htmlFor="amount_input_one"
                    // style={{ paddingRight: "12px" }}
                    className="pe-1 text-white"
                  >
                    {openOrderData[editKeyValue]?.quoteAsset}
                  </label>
                </div>
                {openOrderData[editKeyValue]?.ordType?.toUpperCase() ===
                  "STOP-LIMIT" && (
                  <div
                    className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between  ${
                      activeTab === "price" ? "common_input_bg" : "opacity-50"
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
                      {openOrderData[editKeyValue]?.quoteAsset}
                    </label>
                  </div>
                )}

                <div
                  className={`w-100 d-flex price_field p-2 rounded-1 justify-content-between    ${
                    activeTab === "amount" ? "common_input_bg" : "opacity-50"
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
                    // className="w-75 bg-transparent text-white px-2 text-end"
                    // placeholder="Price"
                    className="w-75 bg-transparent text-white px-2 text-end common_input_bg"
                    id="amount_input_one"
                    value={editAmtValue}
                    // value={openOrderData[editKeyValue].requestOrdQty}
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
                    {openOrderData[editKeyValue]?.baseAsset}
                  </label>
                </div>

                <div className="w-100 d-flex price_field p-2 rounded-1 justify-content-between opacity-50 common_input_bg">
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
                    {openOrderData[editKeyValue]?.quoteAsset}
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
                                quotePrecision
                              )
                            : 0}
                          &nbsp;{openOrderData[editKeyValue]?.baseAsset}
                        </span>
                      </div>
                      <div className="d-flex">
                        <span className="text-secondary">Est .Fee</span>
                        <span className="ps-2 text-white">
                          {/* 0.044 {selectedAsset?.baseAsset} */}
                          {editAmtValue > 0
                            ? Number(
                                parseFloat(editAmtValue) * 0.001
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 8, // Set a large number of fraction digits
                              })
                            : 0}
                          &nbsp;
                          {openOrderData[editKeyValue]?.baseAsset}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className=" text-start small  d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="text-secondary">Max Sell</span>
                        <span className="ps-2 text-white">
                          {/* 0 {selectedAsset?.quoteAsset} */}
                          {editPriceValue > 0
                            ? applyPrecision(
                                assetBalance.baseAssetBalance *
                                  parseFloat(editPriceValue),
                                quotePrecision
                              )
                            : 0}{" "}
                          {openOrderData[editKeyValue]?.quoteAsset}
                        </span>
                      </div>
                      <div className="d-flex">
                        <span className="text-secondary">Est .Fee</span>
                        <span className="ps-2 text-white">
                          {/* 0.044 {selectedAsset?.quoteAsset} */}
                          {Number(
                            parseFloat(editPriceValue) *
                              parseFloat(editAmtValue) *
                              0.001
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 8, // Set a large number of fraction digits
                          })}{" "}
                          &nbsp;{openOrderData[editKeyValue]?.quoteAsset}
                        </span>
                      </div>
                    </div>
                  )}
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
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );

  const orderHistoryTable = () => (
    <div className="table_main_container">
      <div className="orderHistory_filter_container d-flex gap-2 align-items-end ps-2">
        <div
          // className="filterTab px-2 py-1 rounded-2"
          className={`cursorPointer p-2 rounded-2 mb-1 ${
            selectedFilterTab === "1day" ? "selctedTableTab " : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1day");
            getCustomerAllOrdersHistory(
              today,
              today,
              sideOption,
              filterOption,
              "duration"
            );
          }}
        >
          1 Day
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "1week" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1week");

            getCustomerAllOrdersHistory(
              new Date(today.setDate(today.getDate() - 7)),
              new Date(),
              sideOption,
              filterOption,
              "duration"
            );
          }}
        >
          1 Week{" "}
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "1month" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1month");
            getCustomerAllOrdersHistory(
              new Date(today.setMonth(today.getMonth() - 1)),
              new Date(),
              sideOption,
              filterOption,
              "duration"
            );
          }}
        >
          1 Month
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "3month" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("3month");
            getCustomerAllOrdersHistory(
              new Date(today.setMonth(today.getMonth() - 3)),
              new Date(),
              sideOption,
              filterOption,
              "duration"
            );
          }}
        >
          3 Month
        </div>
        <div className="pt-1 d-flex gap-1 flex-column">
          {/* <label htmlFor="to" className="text-start">
            From
          </label> */}
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            className="personalInput text-white"
            dateFormat="MM-dd-yyyy"
            selected={fromDate}
            onChange={(e) => handleDateUpdate("fromDate", e)}
            maxDate={today}
            // minDate={toDate}
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
          {/* <label htmlFor="to" className="text-start">
            To
          </label> */}
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
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
      </div>
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Time
            </th>
            <th scope="col">Pair</th>
            <th scope="col" className="p-0">
              <DropdownButton
                title={pairOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  setPairOption(key);
                  getCustomerAllOrdersHistory(
                    fromDate,
                    toDate,
                    filterOption,
                    sideOption,
                    key
                  );
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
            </th>
            <th scope="col" className="p-0">
              <DropdownButton
                title={sideOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  restoreStatesOrders();
                  setSideOption(key);
                  getCustomerAllOrdersHistory(
                    fromDate,
                    toDate,
                    key,
                    filterOption,
                    "ALL"
                  );
                }}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
                <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
              </DropdownButton>
            </th>

            <th scope="col">Average</th>
            <th scope="col">Price</th>
            <th scope="col">Executed</th>
            <th scope="col">Amount</th>
            <th scope="col">Total</th>
            <th scope="col" className="p-0">
              <DropdownButton
                title={filterOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  restoreStatesOrders();
                  setFilterOption(key);
                  getCustomerAllOrdersHistory(
                    fromDate,
                    toDate,
                    sideOption,
                    key,
                    "ALL"
                  );
                }}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Filled">Filled</Dropdown.Item>
                <Dropdown.Item eventKey="Partially Filled">
                  Partially Filled
                </Dropdown.Item>
                <Dropdown.Item eventKey="Canceled">Canceled</Dropdown.Item>
                <Dropdown.Item eventKey="Expired">Expired</Dropdown.Item>
              </DropdownButton>
            </th>
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {customerOrderList && customerOrderList.length > 0 ? (
              <tbody className="tableBody_content cursorPointer">
                {customerOrderList.map((item, key) => (
                  <tr
                    className="text-start"
                    key={key}
                    onClick={() => {
                      getCustomerOrders(item.orderId);
                    }}
                  >
                    <td>{item.ordCreatedDate}</td>
                    <td>{item.assetPairName}</td>
                    <td>{item.ordType}</td>
                    <td>{item.ordSide}</td>

                    <td>{formatNumber(item.ordFilledAvgPrice)}</td>
                    <td>
                      {item.ordType === "STOP-LIMIT"
                        ? formatNumber(item?.ordLimitPrice) || "-"
                        : formatNumber(item?.requestedOrdPrice)}
                    </td>
                    <td>
                      {formatNumber(item.ordFilledQuantity)}&nbsp;
                      {item.baseAsset}
                    </td>
                    <td>
                      {formatNumber(item.requestOrdQty)}&nbsp;{item.baseAsset}
                    </td>
                    <td>{formatNumber(item.total)}</td>
                    <td>{item.ordStatus}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <>
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
              </>
            )}
          </>
        ) : (
          <tbody className="tableBody_content">
            <td colSpan={12} className="border-0 pt-2">
              <Loader />
            </td>
          </tbody>
        )}
      </table>
    </div>
  );

  const tradeHistory = () => (
    <div className="table_main_container">
      <div className="orderHistory_filter_container d-flex gap-2 align-items-end ps-2">
        <div
          // className="filterTab px-2 py-1 rounded-2"
          className={`cursorPointer p-2 rounded-2 mb-1 ${
            selectedFilterTab === "1day" ? "selctedTableTab " : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1day");
            getCustomerAllTrades(today, today, sideOption);
          }}
        >
          1 Day
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "1week" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1week");
            getCustomerAllTrades(
              new Date(today.setDate(today.getDate() - 7)),
              new Date(),
              sideOption
            );
          }}
        >
          1 Week{" "}
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "1month" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("1month");
            getCustomerAllTrades(
              new Date(today.setMonth(today.getMonth() - 1)),
              new Date(),
              sideOption
            );
          }}
        >
          1 Month
        </div>
        <div
          className={`cursorPointer p-2 mb-1 rounded-2 ${
            selectedFilterTab === "3month" ? "selctedTableTab" : "filterTab"
          }`}
          onClick={() => {
            setSelectedFilterTab("3month");
            getCustomerAllTrades(
              new Date(today.setMonth(today.getMonth() - 3)),
              new Date(),
              sideOption
            );
          }}
        >
          3 Month
        </div>
        <div className="pt-1 d-flex gap-1 flex-column">
          {/* <label htmlFor="to" className="text-start">
            From
          </label> */}
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
            className="personalInput text-white"
            dateFormat="MM-dd-yyyy"
            selected={fromDate}
            onChange={(e) => handleDateUpdate("fromDate", e)}
            maxDate={toDate}
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
          {/* <label htmlFor="to" className="text-start">
            To
          </label> */}
          <DatePicker
            // className={
            //   isEditable
            // /    ? "kycNonEditInputField kycEditInputField"
            //     : "kycNonEditInputField "
            // }
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
      </div>
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Date
            </th>
            <th scope="col">Pair</th>
            <th scope="col" className="p-0">
              <DropdownButton
                title={sideOption}
                id="dropdown_limit"
                onSelect={(key) => {
                  restoreStatesOrders();
                  setSideOption(key);
                  getCustomerAllTrades(fromDate, toDate, key);
                }}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Buy">Buy</Dropdown.Item>
                <Dropdown.Item eventKey="Sell">Sell</Dropdown.Item>
              </DropdownButton>
            </th>
            <th scope="col">Price</th>
            <th>Executed</th>
            <th>Fee</th>
            <th>Total</th>

            {/* <th>Total in USDT</th> */}
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {tradeData.length > 0 ? (
              <tbody className="tableBody_content">
                {tradeData.map((item) => (
                  <tr className="text-start" key={item.id}>
                    <td>{item.tradeTime}</td>
                    <td>{item.assetPairName}</td>
                    <td>{item.tradeSide}</td>
                    <td>{formatNumber(item.tradePrice)}</td>
                    <td>
                      {formatNumber(item.tradeQty)}&nbsp;{item.trdBaseAsset}
                    </td>
                    <td>
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
            <td colSpan={12} className="border-0 pt-2 ">
              <Loader />
            </td>
          </tbody>
        )}
      </table>
    </div>
  );

  const fundTable = () => (
    <div className="table_main_container">
      <table className="table text-white">
        <thead className="container_bg_color text-secondary">
          <tr className="text-start ">
            <th scope="col " className="px-4">
              Coin
            </th>
            <th scope="col">Total balance</th>
            <th scope="col">Available balance</th>
            <th>In order</th>
            {/* <th>Total in USDT</th> */}
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {fundsData?.length > 0 ? (
              <tbody className="tableBody_content">
                {fundsData.map((item, key) => (
                  <tr className="text-start" key={key}>
                    <td className="px-4">{item.assetSymbol}</td>
                    <td>{getAmt(item.assetSymbol, item.totalWallBal)}</td>
                    <td>{getAmt(item.assetSymbol, item.wallCurrBal)}</td>
                    <td>{getAmt(item.assetSymbol, item.wallHoldBal)}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <>
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
              </>
            )}
          </>
        ) : (
          <tbody className="tableBody_content">
            <td colSpan={12} className="border-0 pt-2">
              <Loader />
            </td>
          </tbody>
        )}
      </table>
    </div>
  );

  const dataHoverClassName = (isAsk, key) => {
    if (!isAsk) {
      return key <= hoveredOrderBidKey ? `bg-secondary` : "";
    } else {
      return key <= hoveredOrderAskKey - 1 && hoveredOrderAskKey !== -1
        ? `""`
        : "bg-secondary";
    }
  };

  const orderBookDataList = (item, key, dataType) => {
    return (
      <div
        className={`position-relative ${
          parseFloat(item.price) === 0 ? "d-none" : ""
        }`}
        style={{
          zIndex: 1,
        }}
        key={item.total}
      >
        <div
          className="position-absolute top-0 start-0"
          style={{
            backgroundColor: dataType === "askData" ? "#3d1e28" : "#113534",
            width: `${item.depth}%`,
            height: "100%",
          }}
        />
        <div
          style={{ zIndex: "10" }}
          className={`d-flex px-2 pb-1  justify-content-between individual_orderBookData indvOrder_Dashboard small cursorPointer position-relative ${
            // dataType !== "askData" && key <= hoveredOrderBidKey
            dataHoverClassName(dataType === "askData", key)

            // hoveredOrderBidKey <= askData.length ? "bg-transparent" : ""
          }`}
          // className={` d-flex px-2 pb-1  justify-content-between  small cursorPointer ${
          //   dataType === "bidData" ? "individual_orderData_success " : "individual_orderData_danger"
          // }`}
          key={dataType === "askData" ? askData.length - 1 - key : key}
          onClick={() => {
            if (marketType === "stop_limit") {
              setLimitTotalValueOne(item.price);
              setLimitTotalValueTwo(item.price);
            } else {
              setPriceStopValueOne(item.price);
              setPriceStopValueTwo(item.price);
            }
          }}
          onMouseEnter={() => {
            dataType === "askData"
              ? setHoveredOrderAskKey(key)
              : setHoveredOrderBidKey(key);
          }}
          onMouseLeave={() => {
            dataType === "askData"
              ? setHoveredOrderAskKey(askData.length)
              : setHoveredOrderBidKey(-1);
          }}
        >
          <span
            className={`text-start ${
              dataType === "bidData" ? "text_suceess " : "text_danger"
            }`}
            style={{ width: "30%" }}
          >
            {formatNumber(item.price)}
          </span>
          <span className="text-center ps-2" style={{ width: "30%" }}>
            {formatNumber(item.amount)}
          </span>
          <span
            style={{ width: "40%" }}
            className="overFlowValue text-end ps-1"
          >
            {formatNumber(item.total)}
          </span>
          {dataType === "bidData" ? (
            <div
              className={`position-absolute bottom-0 data_tooltip ${
                key === hoveredOrderBidKey
                  ? // && dataType === "bidData"
                    "bg-transparent"
                  : "d-none"
              }`}
              style={{ top: "-3rem" }}
            >
              <div className="bg-secondary p-2 border border-dark rounded-2">
                <div className="d-flex justify-content-between gap-4">
                  <span>Avg.Price:</span>
                  <span>
                    ≈{" "}
                    {averageValuesUpToIndex(
                      bidData,
                      hoveredOrderBidKey,
                      "bidData"
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-4">
                  <span>Sum {selectedAsset?.baseAsset}:</span>
                  <span>
                    {sumValuesUpToIndex(
                      bidData,
                      hoveredOrderBidKey,
                      "amount",
                      "bidData"
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-4">
                  <span>Sum {selectedAsset?.quoteAsset}:</span>
                  <span>
                    {sumValuesUpToIndex(
                      bidData,
                      hoveredOrderBidKey,
                      "total",
                      "bidData"
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`position-absolute bottom-0 data_tooltip ${
                key === hoveredOrderAskKey ? "bg-transparent" : "d-none"
              }`}
              style={{ top: "-3rem" }}
            >
              <div className="bg-secondary p-2 border border-dark rounded-2">
                <div className="d-flex justify-content-between gap-4">
                  <span>Avg.Price:</span>
                  <span>
                    ≈{" "}
                    {averageValuesUpToIndex(
                      askData,
                      hoveredOrderAskKey,
                      "askData"
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-4">
                  <span>Sum {selectedAsset?.baseAsset}:</span>
                  <span>
                    {sumValuesUpToIndex(
                      askData,
                      hoveredOrderAskKey,
                      "amount",
                      "askData"
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between gap-4">
                  <span>Sum {selectedAsset?.quoteAsset}:</span>
                  <span>
                    {sumValuesUpToIndex(
                      askData,
                      hoveredOrderAskKey,
                      "total",
                      "askData"
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const containerHeight =
      document.querySelector(".orderData_content")?.clientHeight;
    const recordHeight = 19;
    if (containerHeight) {
      const maxRecords = Math.floor(containerHeight / recordHeight);
      setMaxVisibleRecords(maxRecords - 10);
    }
  }, [askData]);

  const orderBookDataPage = () => {
    if (selectedOrderBookTab === 1) {
      return (
        <div className="orderData_content d-flex flex-column w-100 all_order_book">
          <div className="askBidStyle w-100 position-relative">
            <div
              className="position-absolute w-100 mt-5 bottom-0"
              // style={{ bottom: "-0.25rem" }}
            >
              {filteredAskData.length > 0 ? (
                <>
                  {filteredAskData
                    .slice(-20)
                    .map((item, i) => orderBookDataList(item, i, "askData"))}
                </>
              ) : (
                <div className="assetData_container d-flex justify-content-center align-items-center px-2 py-2">
                  <p>No record(s)</p>
                </div>
              )}
            </div>
          </div>

          <div className="order_data_header d-flex justify-content-between px-2 bg-secondary opacity-75">
            <p className=" spreadMore">
              Spread :&nbsp;
              {filteredAskData.length > 0 &&
                filteredBidData.length > 0 &&
                (
                  parseFloat(
                    filteredAskData[filteredAskData.length - 1].price
                  ) - parseFloat(filteredBidData[0]?.price)
                )
                  .toFixed(8)
                  .replace(/\.?0+$/, "")}
            </p>
            <span
              className=" cursorPointer spreadMore"
              // onClick={() =>
              //   navigate("/orderbook", "_blank", {
              //     state: {
              //       askData: askData,
              //       bidData: bidData,
              //       selectedAsset: selectedAsset,
              //     },
              //   })
              // }
              onClick={() => {
                const queryParams = new URLSearchParams({
                  // selectedAsset: JSON.stringify(selectedAsset),
                  pairName: selectedAsset.assetPairName,
                  assetSymbol: selectedAsset.assetSymbol,
                }).toString();
                const url = `/orderbook?${queryParams}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              More
            </span>
          </div>
          <div className="askBidStyle" style={{ marginBottom: "0.4rem" }}>
            {/* <div className="askData_container askBidStyle ask_data_book position-relative w-100"> */}
            <div className="bidData_container ">
              {filteredBidData.length > 0 ? (
                <>
                  {filteredBidData
                    .slice(-20)
                    .map((item, i) => orderBookDataList(item, i, "bidData"))}
                </>
              ) : (
                <div className="assetData_container d-flex justify-content-center align-items-center px-2 py-2">
                  <p>No record(s)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (selectedOrderBookTab === 2) {
      return (
        <div className="orderData_content">
          <div className="order_data_header d-flex justify-content-between px-2 bg-secondary opacity-75">
            <p className="spreadMore">
              Spread :&nbsp;
              {filteredAskData.length > 0 &&
                filteredBidData.length > 0 &&
                (
                  parseFloat(
                    filteredAskData[filteredAskData.length - 1].price
                  ) - parseFloat(filteredBidData[0]?.price)
                )
                  .toFixed(8)
                  .replace(/\.?0+$/, "")}
            </p>
            <span
              className=" cursorPointer spreadMore "
              // onClick={() =>
              //   navigate("/orderbook", "_blank", {
              //     state: {
              //       askData: askData,
              //       bidData: bidData,
              //       selectedAsset: selectedAsset,
              //     },
              //   })
              // }
              onClick={() => {
                const queryParams = new URLSearchParams({
                  // selectedAsset: selectedAsset),
                  pairName: selectedAsset.assetPairName,
                  assetSymbol: selectedAsset.assetSymbol,
                }).toString();
                const url = `/orderbook?${queryParams}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              More
            </span>{" "}
          </div>
          <div className="bidMain_container">
            {filteredBidData.length > 0 ? (
              <>
                {filteredBidData.map((item, i) =>
                  orderBookDataList(item, i, "bidData")
                )}
              </>
            ) : (
              <>
                <div className="assetData_container d-flex justify-content-center align-items-center px-2 py-2">
                  <p>No record(s)</p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="orderData_content d-flex flex-column position-absolute bottom-0 w-100">
          <div className="askData_mainContainer ">
            {filteredAskData.length > 0 ? (
              filteredAskData
                .slice(-maxVisibleRecords)
                .map((item, i) => orderBookDataList(item, i, "askData"))
            ) : (
              <div className="assetData_container d-flex justify-content-center align-items-center px-2 py-2">
                <p>No record(s)</p>
              </div>
            )}
          </div>
          <div className="order_data_header d-flex justify-content-between px-2 bg-secondary opacity-75 rounded-bottom">
            <p className="spreadMore">
              Spread :&nbsp;
              {filteredAskData.length > 0 &&
                filteredBidData.length > 0 &&
                (
                  parseFloat(
                    filteredAskData[filteredAskData.length - 1].price
                  ) - parseFloat(filteredBidData[0]?.price)
                )
                  .toFixed(8)
                  .replace(/\.?0+$/, "")}
            </p>
            <span
              className="cursorPointer spreadMore"
              onClick={() => {
                const queryParams = new URLSearchParams({
                  pairName: selectedAsset.assetPairName,
                  assetSymbol: selectedAsset.assetSymbol,
                }).toString();
                const url = `/orderbook?${queryParams}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              More
            </span>{" "}
          </div>
        </div>
      );
    }
  };

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

  const pairFilterIconView = () => {
    if (selectAssetFilter === 1) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("pair");
              setSelectAssetFilter(2);
              setSelectPriceFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterdownArrow}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    } else if (selectAssetFilter === 2) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("pair");
              setSelectAssetFilter(0);
              setSelectPriceFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filter2}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon cursorPointer"
            />
          </span>
        </>
      );
    } else {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("pair");
              setSelectAssetFilter(1);
              setSelectPriceFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterIcon}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    }
  };

  const priceFilterIconView = () => {
    if (selectPriceFilter === 1) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("price");
              setSelectPriceFilter(2);
              setSelectAssetFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterdownArrow}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    } else if (selectPriceFilter === 2) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("price");
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filter2}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon cursorPointer"
            />
          </span>
        </>
      );
    } else {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              sortAndFilter("price");
              setSelectPriceFilter(1);
              setSelectAssetFilter(0);
              setSelectVolumeFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterIcon}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    }
  };

  const volumeFilterIconView = () => {
    if (selectVolumeFilter === 1) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectVolumeFilter(2);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterdownArrow}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    } else if (selectVolumeFilter === 2) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectVolumeFilter(0);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filter2}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon cursorPointer"
            />
          </span>
        </>
      );
    } else {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectVolumeFilter(1);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
              setSelectChangeFilter(0);
            }}
          >
            <img
              src={filterIcon}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    }
  };

  const changeFilterIconView = () => {
    if (selectChangeFilter === 1) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectChangeFilter(2);
              setSelectVolumeFilter(0);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
            }}
          >
            <img
              src={filterdownArrow}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    } else if (selectChangeFilter === 2) {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectChangeFilter(0);
              setSelectVolumeFilter(0);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
            }}
          >
            <img
              src={filter2}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon cursorPointer"
            />
          </span>
        </>
      );
    } else {
      return (
        <>
          <span
            className="cursorPointer"
            onClick={() => {
              setSelectChangeFilter(1);
              setSelectVolumeFilter(0);
              setSelectPriceFilter(0);
              setSelectAssetFilter(0);
            }}
          >
            <img
              src={filterIcon}
              alt="swap"
              height={15}
              width={15}
              className="swap_icon "
            />
          </span>
        </>
      );
    }
  };

  const sortAndFilter = (type) => {
    let result = [...assetSymbols];
    if (selectAssetFilter === 0 && type === "pair") {
      result = result.sort((a, b) =>
        a.assetPairName.localeCompare(b.assetPairName)
      );
    } else if (selectAssetFilter === 1 && type === "pair") {
      result = result.sort((a, b) =>
        b.assetPairName.localeCompare(a.assetPairName)
      );
    } else if (selectPriceFilter === 0 && type === "price") {
      result = result.sort((a, b) => a.price - b.price);
    } else if (selectPriceFilter === 1 && type === "price") {
      result = result.sort((a, b) => b.price - a.price);
    } else if (selectVolumeFilter === 0 && type === "volume") {
      result = result.sort((a, b) => a.volume - b.volume);
    } else if (selectVolumeFilter === 1 && type === "volume") {
      result = result.sort((a, b) => b.volume - a.volume);
    } else if (selectChangeFilter === 0 && type === "change") {
      result = result.sort((a, b) => a["24hChange"] - b["24hChange"]);
    } else if (selectChangeFilter === 1 && type === "change") {
      result = result.sort((a, b) => b["24hChange"] - a["24hChange"]);
    } else {
      let assetSymbols = getAssetGlobalSymbol();

      result = [...assetSymbols];
    }

    setAssetSymbols(result);
  };

  const assetSymbolDataList = (index, item) => {
    return (
      <React.Fragment key={index}>
        <div
          className="assetData_container pb-1 px-2 pt-1 "
          onClick={() => {
            setPriceStopValueOne("");
            setAmountValueOne("");
            setPriceStopValueTwo("");
            setAmountValueTwo("");
            setStopLimitTotalBuy("");
            setStopLimitTotalSell("");
            setLimitTotalValueOne("");
            setLimitTotalValueTwo("");
            setSelectedOrderBookTab(1);
            onSearchAsset(item.assetPairName);
            setQuotePrecision(item.quotePrecision);
            if (isLoggedIn) {
              setBuyRangeValue("");
              setSellRangeValue("");
              getAssetBalance(item.assetSymbol);
            }
          }}
        >
          <div className="d-flex gap-1">
            <span onClick={() => setIsfav(!isFav)}></span>

            {isLoggedIn ? (
              <span
                className="ml-1 "
                onClick={(e) => {
                  e.stopPropagation();
                  createAssetWatchList(item);
                }}
              >
                <img
                  src={item.isFavourite === 0 ? bookmark : bookmarkFill}
                  alt="img"
                  height={15}
                  width={15}
                  title={
                    item.isFavourite === 0
                      ? "Click to add favourite"
                      : "Click to remove from favourite"
                  }
                />
              </span>
            ) : null}

            <span className="text-start">{item.assetPairName}</span>
          </div>

          <div className="text_suceess ">{item.price}</div>

          <div>
            {changeData ? (
              <span
                className={`text-end ${
                  parseFloat(item["24hChange"]) < 0
                    ? "text-danger"
                    : parseFloat(item["24hChange"]) > 0
                    ? "text_suceess"
                    : "text-white"
                }`}
              >
                {parseFloat(item["24hChange"]).toFixed(2)}&nbsp;%
              </span>
            ) : (
              <span className="text-white">
                {" "}
                {parseFloat(item.volume).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const assetSymbolPageView = () => {
    return (
      <>
        {assetSymbols?.length > 0 ? (
          assetSymbols.map((item, index) => {
            return assetSymbolDataList(index, item);
          })
        ) : (
          <div className="assetData_container d-flex justify-content-center align-items-center px-2 py-2">
            <p>No record(s)</p>
          </div>
        )}

        {/* favourite Item List */}
      </>
    );
  };

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

  const allOrderTablePage = () => {
    if (isLoggedIn) {
      if (selectOrder === "openOrder") {
        return openOrderTable();
      } else if (selectOrder === "orderHistory") {
        return orderHistoryTable();
      } else if (selectOrder === "trade") {
        return tradeHistory();
      } else if (selectOrder === "funds") {
        return fundTable();
      } else {
        return openOrderTable();
      }
    } else {
      return loginViewPage();
    }
  };

  const orderHistoryModalView = () => {
    return (
      <>
        <Modal
          show={rightModal}
          id="dashboardModalsT"
          aria-labelledby="example-custom-modal-styling-title"
          className="dashboardTransaction"
          onHide={() => setRightModal(false)}
        >
          <Modal.Body style={{ backgroundColor: "#000000" }}>
            <div style={{ marginTop: "-8px" }}>
              <div className="px-3">
                <div className="d-flex justify-content-end search-removeIcon_summary pt-1">
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
                    <h6 className="fw-bolder">
                      {" "}
                      {customerOrder.assetPairName}
                    </h6>
                  </div>

                  <div className="pt-3">
                    <p className="gap-2 d-flex">
                      {customerStatusImage(customerOrder.ordStatus)}
                      <span className="textCapital">
                        {" "}
                        {customerOrder.ordStatus}
                      </span>
                    </p>
                  </div>

                  <div style={{ width: 55, height: 55 }}>
                    <CircularProgressbar
                      value={customerOrder.filledPercentage}
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
                            : customerOrder?.ordStatus === "partially filled" &&
                              customerOrder?.ordSide === "SELL"
                            ? "#E9B92E"
                            : "#f81515"
                        }`,

                        textColor: "#fff",
                        trailColor: "#d6d6d6",
                      })}
                    />
                  </div>
                </div>

                <div className="dashTabular text-white common_border_bg  rounded-2 py-1 opacity-75 mt-2">
                  <div className="d-flex justify-content-between px-2 py-1">
                    <span className="">Order Id </span>
                    <span className="transSummaryText ">
                      {/* {customerOrder[0].excOrderId} */}
                      {customerOrder.excOrderId}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between px-2 py-1">
                    <span>Order Status</span>
                    <span>{customerStatus(customerOrder.ordStatus)}</span>
                  </div>
                  <div className="d-flex justify-content-between px-2 py-1">
                    <span>Order Date </span>
                    <span>{customerOrder.ordCreatedDate?.slice(0, 10)} </span>
                  </div>
                  <div className="d-flex justify-content-between  align-items-center  px-2 pt-1 py-1 ">
                    <span>Total</span>
                    <span>{customerOrder.total} </span>
                  </div>
                  <div className="d-flex justify-content-between px-2 pt-1 py-1">
                    <span>Request Order Quantity</span>
                    <span>{customerOrder.requestOrdQty}</span>
                  </div>
                  <div className="d-flex justify-content-between px-2 pt-1 py-1">
                    <span>Order Filled Quantity</span>
                    <span className="firstLetterUpperCase ">
                      {customerOrder.ordFilledQuantity}
                    </span>
                  </div>
                  {customerOrder.ordType?.toUpperCase() === "STOP-LIMIT" && (
                    <div className="d-flex justify-content-between px-2 pt-1 py-1">
                      <span>Limit Order Price</span>
                      <span className="firstLetterUpperCase ">
                        {customerOrder.ordLimitPrice}
                      </span>
                    </div>
                  )}
                  {customerOrder.ordType?.toUpperCase() === "STOP-LIMIT" && (
                    <div className="d-flex justify-content-between px-2 pt-1 py-1">
                      <span>Stop Order Price</span>
                      <span className="firstLetterUpperCase ">
                        {customerOrder.ordStopPrice}
                      </span>
                    </div>
                  )}

                  {customerOrder.ordType?.toUpperCase() === "LIMIT" && (
                    <div className="d-flex justify-content-between px-2 pt-1 py-1">
                      <span>Request Order Price</span>
                      <span className="firstLetterUpperCase ">
                        {formatNumber(customerOrder.requestedOrdPrice)}
                      </span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between px-2 pt-1 py-1">
                    <span>Order Average Price</span>
                    <span
                      className="transSummaryText"
                      style={{ textAlign: "right" }}
                    >
                      {customerOrder.ordFilledAvgPrice}
                    </span>
                  </div>
                  <div
                    className="d-flex justify-content-between px-2 pt-1"
                    //  className={`d-flex justify-content-between align-items-center py-1 ${customerOrder.ordSide === "BUY" ? "buyBg" :"sellbg"}`}
                  >
                    <span>Order Side</span>
                    <span
                      //  className="transSummaryText "
                      className={
                        customerOrder.ordSide === "BUY"
                          ? "text_suceess"
                          : "text_danger"
                      }
                      style={{ textAlign: "right" }}
                    >
                      &nbsp;{customerOrder.ordSide}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between px-2 pt-1">
                    <span>Order Type</span>
                    <span>{customerOrder.ordType}</span>
                  </div>
                </div>
                <div className="py-2 text-white mt-4">
                  {customerTradeData?.length > 0 && (
                    <h1 style={{ fontSize: "1.5rem" }} className="pb-2">
                      Trade Details
                    </h1>
                  )}

                  {customerTradeData?.map((item, index) => {
                    return (
                      <div
                        className=" px-2 py-1 rounded-2 common_border_bg opacity-75 mt-3 "
                        key={index}
                      >
                        <div className="d-flex justify-content-between py-1">
                          <span>Trade Price </span>
                          <span
                            className="transSummaryText"
                            style={{ textAlign: "right" }}
                          >
                            {item.tradePrice}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                          <span>Trade Date</span>
                          <span
                            className="transSummaryText"
                            style={{ textAlign: "right" }}
                          >
                            {item.trdCreatedDate?.slice(0, 10)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                          <span>Trade Quantity </span>
                          <span
                            className="transSummaryText"
                            style={{ textAlign: "right" }}
                          >
                            {item.tradeQty}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                          <span>Trade Fee </span>
                          <span
                            className="transSummaryText"
                            style={{ textAlign: "right" }}
                          >
                            {item.tradeFee}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

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
          </Modal.Body>
        </Modal>
      </>
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      getAssetBalance(1);
      getOpenOrderData("ALL", "ALL", "ALL");
    }
    getOrderBookData(1);
    getMarketData(1);
    getCustTradeVolume(1);
    getAssetSymbols("");

    _connect(1);
    setBidGlobalVariable([]);
    setAskGlobalVariable([]);
    setMarketDataVariable([]);
    dispatcher(setDashboardNavigation(false));
  }, []);

  function handleConnectionChange() {
    if (navigator.connection) {
      setInternetStatus((prevStatus) => ({
        ...prevStatus,
        status: navigator.connection.effectiveType,
      }));
    } else {
      console.log("navigator.connection API is not supported");
    }
  }

  function handleOnlineStatusChange() {
    setInternetStatus((prevStatus) => ({
      ...prevStatus,
      isConnected: navigator.onLine,
    }));
  }

  useEffect(() => {
    handleConnectionChange();
    if (navigator.connection) {
      navigator.connection?.addEventListener("change", handleConnectionChange);
    } else {
      console.log("navigator.connection API is not supported");
    }
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      if (navigator.connection) {
        navigator.connection.removeEventListener(
          "change",
          handleConnectionChange
        );
      }
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  return (
    <>
      <div
        // className={
        //   toggle ? "dashboard_toggle_main_container" : "dashboard_main_container"
        // }
        className="dashboard_main_container small position-relative"
      >
        {/* sidebar container */}

        {/* <SideBar activePage={"dashboard"} setToggle={setToggle} toggle={toggle} /> */}

        {/* {sidebar-end} */}
        <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 pb-2">
          {/* heder content */}
          <header className="main_header py-2">
            <Topbar />
          </header>

          <article className="dashboard_content_main_container d-flex gap-2  h-100 mx-3 ">
            {/* searchbar_market_container */}

            <div
              className="searchbar_marketTrade_main_container d-flex flex-column   gap-2"
              style={{ width: "30%" }}
            >
              <div className="searchbar_container  container_bg_color ps-2 d-flex flex-column common_border_bg rounded-2">
                <div className="input_main_container d-flex   pt-2 ">
                  <div
                    className="input-group mb-3 pt-2 d-flex position-relative d-flex  "
                    style={{ marginLeft: "14px" }}
                  >
                    <input
                      type="text"
                      className="assetSearchbar  searchbar rounded-2 text-white p-2 common_input_bg pe-5"
                      placeholder="Search"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      value={assetSearchValue}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z]/g, "");
                        setAssetSearchValue(value);
                        /^[a-zA-Z]+$/.test(value) &&
                          getTabAssetSymbols(value, "search", false);
                      }}
                    />

                    <span
                      className="SearchIcon_dashboard px-2"
                      onClick={() => setAssetSearchValue("")}
                    >
                      {assetSearchValue === "" ? searchIcon : removeIcon}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-around align-items-center px-2 gap-2 mb-2 ">
                  {isLoggedIn ? (
                    <>
                      <div
                        className={`cursorPointer py-1 small ${
                          selectCurrency === "" && isFav
                            ? "selectAssetTav rounded-2 "
                            : "assetTab rounded-2 "
                        }`}
                      >
                        {isLoggedIn ? (
                          <span
                            onClick={() => {
                              getTabAssetSymbols("", "tab", true);
                            }}
                          >
                            <img
                              src={bookmark}
                              alt="bookmark"
                              height={20}
                              width={20}
                            />
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div
                    className={`cursorPointer py-1 small  ${
                      selectCurrency === "" && !isFav
                        ? "selectAssetTav rounded-2"
                        : "assetTab common_border_bg  rounded-2"
                    }`}
                    onClick={
                      () => {
                        getTabAssetSymbols("", "tab", false);
                      }

                      // getTabAssetSymbols(" ","tab")
                    }
                  >
                    All
                  </div>

                  <div
                    className={`cursorPointer py-1 small ${
                      selectCurrency === "USDT"
                        ? "selectAssetTav rounded-2"
                        : "assetTab common_border_bg  rounded-2 "
                    }`}
                    onClick={() => {
                      getTabAssetSymbols("USDT", "tab", false);
                    }}
                  >
                    USDT
                  </div>
                  <div
                    className={`cursorPointer py-1 small ${
                      selectCurrency === "BTC"
                        ? "selectAssetTav rounded-2"
                        : "assetTab common_border_bg  rounded-2"
                    }`}
                    onClick={() => {
                      getTabAssetSymbols("BTC", "tab", false);
                    }}
                  >
                    BTC
                  </div>

                  <div
                    className={`cursorPointer py-1 small ${
                      selectCurrency === "ETH"
                        ? "selectAssetTav rounded-2"
                        : "assetTab common_border_bg  rounded-2"
                    }`}
                    onClick={() => {
                      getTabAssetSymbols("ETH", "tab", false);
                    }}
                  >
                    ETH
                  </div>
                </div>

                <div className="d-flex justify-content-between opacity-75 fs-6 px-2 py-2">
                  <div className="text-start small " style={{ width: "33%" }}>
                    Pair
                    {pairFilterIconView()}
                  </div>
                  <div
                    className="text-center  ps-3 small"
                    style={{ width: "33%" }}
                  >
                    Price
                    {priceFilterIconView()}
                  </div>
                  <div className="d-flex justify-content-between small">
                    <div
                      className="text-center  d-flex"
                      style={{ width: "30%" }}
                    >
                      <span>{changeData ? "Change" : "Volume"} </span>
                      <span
                        className="cursorPointer"
                        onClick={() =>
                          sortAndFilter(changeData ? "change" : "volume")
                        }
                      >
                        {" "}
                        {changeData
                          ? changeFilterIconView()
                          : volumeFilterIconView()}
                      </span>
                    </div>
                    <div
                      className="px-1 cursorPointer"
                      onClick={() => setChangeData(!changeData)}
                    >
                      <img
                        src={SwapIcon}
                        alt="filter"
                        height={15}
                        width={15}
                        className="swap_icon"
                      />
                    </div>
                  </div>
                </div>
                <hr className="my-1" />
                <div
                  className="assetData_main_container"
                  style={{ fontSize: "0.75rem" }}
                >
                  {assetSymbolPageView()}
                </div>
              </div>
              <div className="market_trade_container  container_bg_color common_border_bg rounded-2">
                <div className="header d-flex gap-4 px-2 pt-2">
                  <span className="primary_Textcolor fs-6">Market Trades</span>
                </div>
                <div className="marketData_container">
                  <div
                    className="marketData_headder d-flex justify-content-between px-2 py-2  opacity-75"
                    style={{ fontSize: "0.8rem" }}
                  >
                    <span>Price({selectedAsset?.quoteAsset})</span>
                    <span>Amount({selectedAsset?.baseAsset})</span>
                    <span>Time</span>
                  </div>
                  <div
                    className="marketData_main_container"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {/* ///////////// market data */}
                    {marketData?.length > 0 ? (
                      marketData.map((item, i) => {
                        return (
                          <React.Fragment key={i}>
                            <div className=" d-flex justify-content-between align-items-center px-2 pb-1">
                              <span
                                className={
                                  item.side === "ASK"
                                    ? "text_danger w-25 text-start"
                                    : "text_suceess w-25 text-start"
                                }
                              >
                                {/* <span>U</span> */}
                                {formatNumber(item.price)}
                              </span>
                              <span>{formatNumber(item.quantity)}</span>
                              <span
                              // className={
                              //   item.volume % 0.13 === 0
                              //     ? "text_danger"
                              //     : "text_suceess"
                              // }
                              >
                                {item.timestamp.slice(11, 19)}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : apiLoaderType === "marketTrade" ? (
                      <>{<Loader />}</>
                    ) : (
                      <div className="text-center mt-3">
                        {" "}
                        <h6>No record(s)</h6>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* assetStatus_container      */}

            <div className="graph_assetData_main_container  d-flex flex-column w-100 gap-2 ">
              <div className="assetStatus_container  container_bg_color d-flex justify-content-around py-2 common_border_bg rounded-2">
                <div className="d-flex flex-column justify-content-center  asset_Individual">
                  <span className="fs-4">{selectedAsset?.assetPairName}</span>
                </div>
                <div className="d-flex flex-column gap-3">
                  <span className="opacity-75 fs-6">24h Change</span>
                  <span
                    // className="text_danger"
                    className={
                      parseFloat(tradeVolData?.priceChange24hrs) < 0
                        ? "text_danger"
                        : parseFloat(tradeVolData?.priceChange24hrs) > 0
                        ? "text_suceess"
                        : "text-white"
                    }
                  >
                    {parseFloat(tradeVolData?.priceDiff24hrs || 0).toFixed(2)}{" "}
                    &nbsp;
                    {parseFloat(tradeVolData?.priceChange24hrs || 0).toFixed(2)}
                    %
                  </span>
                </div>

                <div className="d-flex flex-column gap-3  small_text">
                  <span className="fs-6 opacity-75">24h High</span>
                  <span className="">
                    {parseFloat(tradeVolData?.highPrice24hrs).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex flex-column  gap-3 small_text">
                  <span className="fs-6 opacity-75">24h Low</span>
                  <span className="">
                    {parseFloat(tradeVolData?.lowPrice24hrs).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex flex-column  gap-3 small_text">
                  <span className="fs-6 opacity-75">
                    24h Volume({selectedAsset?.baseAsset})
                  </span>
                  <span className="">
                    {parseFloat(tradeVolData?.baseVol24hrs).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex flex-column  gap-3  small_text">
                  <span className="opacity-75 fs-6">
                    24h Volume({selectedAsset?.quoteAsset})
                  </span>
                  <span className="">
                    {parseFloat(tradeVolData?.quoteVol24hrs).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="graph_assetData_container d-flex gap-2  ">
                <div className="graph_assetBuy_main_container d-flex flex-column gap-2  w-75 ">
                  <div className="graph_container container_bg_color">
                    <TradingViewChart
                      baseAsset={selectedAsset?.baseAsset}
                      quoteAsset={selectedAsset?.quoteAsset}
                    />
                  </div>

                  {/* Buy sell  container */}
                  <div
                    className="assetBuySell_container container_bg_color common_border_bg rounded position-relative small "
                    // style={{ minHeight: "68vh" }}
                  >
                    <div className="assetBuySell_header d-flex justify-content-between px-2 py-2">
                      <span className="text-white fs-4">Spot</span>
                      <div className="d-flex gap-4">
                        <span
                          className={`fs-6 cursorPointer ${
                            marketType === "limit" ? "primary_Textcolor" : ""
                          }`}
                          onClick={() => {
                            marketType !== "limit" && setMarketType("limit");
                            clearState();
                          }}
                        >
                          Limit
                        </span>
                        <span
                          className={`cursorPointer fs-6 ${
                            marketType === "market" ? "primary_Textcolor" : ""
                          }`}
                          onClick={() => {
                            marketType !== "market" && setMarketType("market");
                            clearState();
                          }}
                        >
                          Market
                        </span>
                        <span
                          className={`cursorPointer fs-6 pe-2 ${
                            marketType === "stop_limit"
                              ? "primary_Textcolor"
                              : ""
                          }`}
                          onClick={() => {
                            setPriceStopValueOne("");
                            setPriceStopValueTwo("");
                            marketType !== "stop_limit" &&
                              setMarketType("stop_limit");
                            clearState();
                          }}
                        >
                          Stop-limit
                        </span>

                        {/* <span className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                        >
                          <path
                            d="M0.728027 7.61475H15.0513"
                            stroke="#F5F5F5"
                            strokeOpacity="0.8"
                            strokeWidth="1.19361"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.2769 4.43213L11.8683 4.43213"
                            stroke="#F5F5F5"
                            strokeOpacity="0.8"
                            strokeWidth="1.19361"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.0513 10.0021V8.41066C15.0513 5.03463 15.0513 3.34662 14.0025 2.29782C12.9537 1.24902 11.2657 1.24902 7.88966 1.24902C4.51363 1.24902 2.82562 1.24902 1.77682 2.29782C0.728027 3.34662 0.728027 5.03463 0.728027 8.41066V10.0021C0.728027 13.3782 0.728027 15.0662 1.77682 16.115C2.82562 17.1638 4.51363 17.1638 7.88966 17.1638C11.2657 17.1638 12.9537 17.1638 14.0025 16.115C15.0513 15.0662 15.0513 13.3782 15.0513 10.0021Z"
                            stroke="#F5F5F5"
                            strokeOpacity="0.8"
                            strokeWidth="1.19361"
                          />
                          <path
                            d="M3.91089 10.7979H4.3297M7.68017 10.7979H8.09898M11.4495 10.7979H11.8683"
                            stroke="#F5F5F5"
                            strokeOpacity="0.8"
                            strokeWidth="1.19361"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.91089 13.981H4.3297M7.68017 13.981H8.09898M11.4495 13.981H11.8683"
                            stroke="#F5F5F5"
                            strokeOpacity="0.8"
                            strokeWidth="1.19361"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span> */}
                      </div>
                    </div>
                    <div className="assetBuySell_input_container">
                      <div className="d-flex justify-content-between px-2 pt-3">
                        <div className="d-flex buySell_btn">
                          <p className="d-flex gap-2">
                            Avbl {assetBalance.quoteAssetBalance}{" "}
                            {selectedAsset?.quoteAsset}
                            <span>
                              <img
                                src={add}
                                height="20vh"
                                width="18vw"
                                alt="img"
                              />
                            </span>
                          </p>
                        </div>

                        <div className="d-flex  buySell_btn ">
                          <p className="d-flex gap-2">
                            Avbl {assetBalance.baseAssetBalance}{" "}
                            {selectedAsset?.baseAsset}
                            <span>
                              <img
                                src={add}
                                height="20vh"
                                width="18vw"
                                alt="img"
                              />
                            </span>
                          </p>
                          {/* <span>sdf</span> */}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
                        <div className="w-100 d-flex justify-content-between gap-4 px-2">
                          <div
                            className={`w-50 d-flex price_field p-2 rounded-1 justify-content-between ${
                              marketType === "market"
                                ? "opacity-50"
                                : "common_input_bg"
                            }`}
                          >
                            <label
                              htmlFor="price_input_one"
                              className={`text-secondary ${
                                marketType === "market"
                                  ? "text-white opacity-75"
                                  : ""
                              }`}
                            >
                              {marketType === "stop_limit" ? "Stop" : "Price"}
                            </label>
                            <input
                              className="w-75 bg-transparent text-white px-2 text-end common_input_bg"
                              // placeholder="Price"
                              id="price_input_one"
                              value={
                                marketType === "market"
                                  ? "Market"
                                  : priceStopValueOne || ""
                              }
                              onChange={(e) => {
                                const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                const value = reg.test(e.target.value)
                                  ? e.target.value
                                  : priceStopValueOne;
                                if (
                                  value !== "." &&
                                  value.indexOf(".") === value.lastIndexOf(".")
                                ) {
                                  setPriceStopValueOne(value);
                                  if (marketType !== "stop_limit") {
                                    setLimitTotalValueOne(
                                      formatNumber(
                                        Number(value.replace(/[^\d.]/gi, "")) *
                                          Number(amountValueOne)
                                      )
                                    );

                                    let selectedAmount =
                                      Number(value.replace(/[^\d.]/gi, "")) *
                                      Number(amountValueOne);
                                    setBuyRangeValue(
                                      applyPrecision(
                                        (selectedAmount /
                                          assetBalance.quoteAssetBalance) *
                                          100,
                                        0
                                      )
                                    );
                                  }
                                }
                              }}
                              maxLength={17}
                              readOnly={marketType === "market"}
                              autoComplete="off"
                            />
                            <label htmlFor="price_input_one">
                              {selectedAsset?.quoteAsset}
                            </label>
                          </div>
                          <div
                            className={`w-50 d-flex price_field p-2 rounded-1 justify-content-between ${
                              marketType === "market"
                                ? "opacity-50"
                                : "common_input_bg"
                            }`}
                          >
                            <label
                              htmlFor="price_input_two"
                              className={`text-secondary ${
                                marketType === "market"
                                  ? "text-white opacity-75"
                                  : ""
                              }`}
                            >
                              {marketType === "stop_limit" ? "Stop" : "Price"}
                            </label>
                            <input
                              className="w-75 bg-transparent text-white px-2 text-end"
                              // placeholder="Price"
                              id="price_input_two"
                              readOnly={marketType === "market"}
                              maxLength={17}
                              value={
                                marketType === "market"
                                  ? "Market"
                                  : priceStopValueTwo || ""
                              }
                              onChange={(e) => {
                                const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                const value = reg.test(e.target.value)
                                  ? e.target.value
                                  : priceStopValueTwo;
                                if (
                                  value !== "." &&
                                  value.indexOf(".") === value.lastIndexOf(".")
                                ) {
                                  setPriceStopValueTwo(
                                    value.replace(/[^\d.]/gi, "")
                                  );
                                  if (marketType !== "stop_limit") {
                                    setLimitTotalValueTwo(
                                      formatNumber(
                                        Number(value.replace(/[^\d.]/gi, "")) *
                                          Number(amountValueTwo)
                                      )
                                    );
                                    let selectedAmount =
                                      Number(value.replace(/[^\d.]/gi, "")) *
                                      Number(amountValueTwo);
                                    setSellRangeValue(
                                      applyPrecision(
                                        (selectedAmount /
                                          assetBalance.quoteAssetBalance) *
                                          100,
                                        0
                                      )
                                    );
                                  }
                                }
                              }}
                              autoComplete="off"
                            />
                            <label htmlFor="price_input_two">
                              {selectedAsset?.quoteAsset}
                            </label>
                          </div>
                        </div>
                        {marketType === "stop_limit" && (
                          <div className="w-100 d-flex justify-content-between gap-4 px-2 mt-2">
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg">
                              <label
                                htmlFor="total_input_one"
                                className="text-secondary"
                              >
                                Limit
                              </label>
                              <input
                                className="w-75 bg-transparent text-white px-2 text-end"
                                // placeholder="Price"
                                id="total_input_one"
                                value={limitTotalValueOne}
                                onChange={(e) => {
                                  const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                  const value = reg.test(e.target.value)
                                    ? e.target.value
                                    : limitTotalValueOne;
                                  if (
                                    value !== "." &&
                                    value.indexOf(".") ===
                                      value.lastIndexOf(".")
                                  ) {
                                    setLimitTotalValueOne(
                                      value.replace(/[^\d.]/gi, "")
                                    );
                                    let total =
                                      value.replace(/[^\d.]/gi, "") *
                                      amountValueOne;
                                    setStopLimitTotalBuy(
                                      applyPrecision(total),
                                      quotePrecision
                                    );
                                    setBuyRangeValue(
                                      (total / assetBalance.quoteAssetBalance) *
                                        100,
                                      0
                                    );
                                  }
                                }}
                                autoComplete="off"
                              />
                              <label htmlFor="total_input_one">
                                {selectedAsset?.quoteAsset}{" "}
                              </label>
                            </div>
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg">
                              <label
                                htmlFor="total_input_two"
                                className="text-secondary"
                              >
                                Limit
                              </label>
                              <input
                                className="w-75 bg-transparent text-white px-2 text-end"
                                // placeholder="Price"
                                id="total_input_two"
                                value={limitTotalValueTwo}
                                onChange={(e) => {
                                  const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                  const value = reg.test(e.target.value)
                                    ? e.target.value
                                    : limitTotalValueTwo;
                                  setLimitTotalValueTwo(
                                    value.replace(/[^\d.]/gi, "")
                                  );

                                  if (
                                    value !== "." &&
                                    value.indexOf(".") ===
                                      value.lastIndexOf(".")
                                  ) {
                                    setLimitTotalValueTwo(
                                      value.replace(/[^\d.]/gi, "")
                                    );
                                    let total =
                                      value.replace(/[^\d.]/gi, "") *
                                      amountValueTwo;
                                    setStopLimitTotalSell(
                                      applyPrecision(total),
                                      quotePrecision
                                    );
                                  }
                                }}
                                autoComplete="off"
                              />
                              <label htmlFor="total_input_two">
                                {selectedAsset?.quoteAsset}
                              </label>
                            </div>
                          </div>
                        )}

                        <div className="w-100 d-flex justify-content-between gap-4 px-2 mt-2">
                          <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg">
                            <label
                              htmlFor="amount_input_one"
                              className="text-secondary"
                            >
                              Amount
                            </label>
                            <input
                              className="w-75 bg-transparent text-white px-2 text-end"
                              // placeholder="Price"
                              id="amount_input_one"
                              value={amountValueOne}
                              // maxLength={
                              //   selectedAsset?.minAmountMovement.toString()
                              //     .length
                              // }
                              onChange={(e) => {
                                const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                const value = reg.test(e.target.value)
                                  ? e.target.value
                                  : amountValueOne;

                                if (
                                  value !== "." &&
                                  value.indexOf(".") === value.lastIndexOf(".")
                                ) {
                                  setAmountValueOne(
                                    value.replace(/[^\d.]/gi, "")
                                  );
                                  if (marketType === "stop_limit") {
                                    let total =
                                      limitTotalValueOne *
                                      value.replace(/[^\d.]/gi, "");
                                    setStopLimitTotalBuy(
                                      applyPrecision(total, quotePrecision)
                                    );
                                    setBuyRangeValue(
                                      applyPrecision(
                                        total / assetBalance.quoteAssetBalance
                                      ) * 100,
                                      0
                                    );
                                  } else if (marketType === "limit") {
                                    let selectedAmount =
                                      Number(value.replace(/[^\d.]/gi, "")) *
                                      Number(
                                        priceStopValueOne || bidData[0]?.price
                                      );

                                    let amt =
                                      (selectedAmount /
                                        assetBalance.quoteAssetBalance) *
                                      100;
                                    setLimitTotalValueOne(
                                      applyPrecision(selectedAmount, 8)
                                    );
                                    setBuyRangeValue(applyPrecision(amt, 0));
                                  }

                                  marketType !== "limit" &&
                                    getMarketPrice("BID", value);
                                }
                              }}
                              autoComplete="off"
                            />
                            <label
                              htmlFor="amount_input_one"
                              // style={{ paddingRight: "12px" }}
                              className="pe-1"
                            >
                              {selectedAsset?.baseAsset}
                            </label>
                          </div>

                          <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg">
                            <label
                              htmlFor="amount_input_two"
                              className="text-secondary"
                            >
                              Amount
                            </label>
                            <input
                              className="w-75 bg-transparent text-white px-2 text-end"
                              // placeholder="Price"
                              id="amount_input_two"
                              value={amountValueTwo}
                              // maxLength={
                              //   selectedAsset?.minAmountMovement.toString()
                              //     .length
                              // }
                              onChange={(e) => {
                                const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                const value = reg.test(e.target.value)
                                  ? e.target.value
                                  : amountValueTwo;
                                if (
                                  value !== "." &&
                                  value.indexOf(".") === value.lastIndexOf(".")
                                  //  &&
                                  // Number(e.target.value) >=
                                  //   selectedAsset?.minAmountMovement
                                ) {
                                  setAmountValueTwo(
                                    value.replace(/[^\d.]/gi, "")
                                  );
                                  if (marketType === "stop_limit") {
                                    let amt =
                                      Number(value.replace(/[^\d.]/gi, "")) /
                                      assetBalance.baseAssetBalance;
                                    setSellRangeValue(
                                      applyPrecision(amt * 100),
                                      0
                                    );
                                    setStopLimitTotalSell(
                                      applyPrecision(
                                        limitTotalValueTwo *
                                          value.replace(/[^\d.]/gi, ""),
                                        quotePrecision
                                      )
                                    );
                                  } else if (marketType === "limit") {
                                    setLimitTotalValueTwo(
                                      applyPrecision(
                                        priceStopValueTwo *
                                          value.replace(/[^\d.]/gi, ""),
                                        8
                                      )
                                    );
                                    setAmountValueTwo(
                                      value.replace(/[^\d.]/gi, "")
                                    );

                                    let amt =
                                      (Number(value.replace(/[^\d.]/gi, "")) /
                                        assetBalance.baseAssetBalance) *
                                      100;
                                    setSellRangeValue(applyPrecision(amt, 0));
                                  }

                                  marketType !== "limit" &&
                                    getMarketPrice("ASK", value);
                                }
                              }}
                              autoComplete="off"
                            />

                            <label htmlFor="amount_input_two" className="pe-1">
                              {selectedAsset?.baseAsset}
                            </label>
                          </div>
                        </div>
                        {marketType !== "stop_limit" && (
                          <div className="w-100 d-flex justify-content-between gap-4 px-2 mt-2">
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between bg-secondary opacity-50">
                              <label
                                htmlFor="total_input_one"
                                className="text-white opacity-75"
                              >
                                Total
                              </label>
                              <input
                                className="w-75 bg-transparent text-white px-2 text-end"
                                // placeholder="Price"
                                id="total_input_one"
                                // value={Number(
                                //   parseFloat(limitTotalValueOne) || 0
                                // ).toLocaleString(undefined, {
                                //   maximumFractionDigits: 8, // Set a large number of fraction digits
                                // })}
                                value={
                                  amountValueOne === ""
                                    ? 0
                                    : Number(
                                        parseFloat(limitTotalValueOne) || 0
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 8,
                                      })
                                }
                                // onChange={(e) => {
                                //   e.target.value !== "." &&
                                // /    !e.target.value.includes("..") &&
                                //     setLimitTotalValueOne(
                                //       e.target.value.replace(/[^\d.]/gi, "")
                                //     );
                                // }}
                                readOnly
                              />
                              <label htmlFor="total_input_one">
                                {selectedAsset?.quoteAsset}
                              </label>
                            </div>
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between bg-secondary opacity-50">
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
                                // value={Number(
                                //   parseFloat(limitTotalValueTwo) || 0
                                // ).toLocaleString(undefined, {
                                //   maximumFractionDigits: 8,
                                // })}

                                value={
                                  amountValueTwo === ""
                                    ? 0
                                    : Number(
                                        parseFloat(limitTotalValueTwo) || 0
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 8,
                                      })
                                }
                                onChange={(e) => {
                                  const value = e.target.value;
                                  value !== "." &&
                                    value.indexOf(".") ===
                                      value.lastIndexOf(".") &&
                                    setLimitTotalValueTwo(
                                      value.replace(/[^\d.]/gi, "")
                                    );
                                }}
                                readOnly
                              />
                              <label htmlFor="total_input_two">
                                {selectedAsset?.quoteAsset}
                              </label>
                            </div>
                          </div>
                        )}
                        {marketType !== "market" && (
                          <div className="w-100 d-flex justify-content-between gap-4 px-2 mt-2 slider_box">
                            <Slider
                              marks={marks}
                              value={
                                assetBalance.quoteAssetBalance === 0 ||
                                (bidData.length === 0 &&
                                  askData.length === 0) ||
                                !isLoggedIn
                                  ? 0
                                  : buyRangeValue
                              }
                              onChange={(e) => {
                                if (marketType === "stop_limit") {
                                  setBuyRangeValue(e);
                                  let total =
                                    (e / 100) * assetBalance.quoteAssetBalance;

                                  if (limitTotalValueOne > 0) {
                                    setAmountValueOne(
                                      applyPrecision(
                                        total / limitTotalValueOne,
                                        quotePrecision
                                      )
                                    );
                                    setStopLimitTotalBuy(
                                      applyPrecision(total, quotePrecision)
                                    );
                                  }
                                } else {
                                  // amountValueOne > 0 &&
                                  handleBuyRangeValue(e);
                                }
                              }}
                              className="mx-2 w-50"
                              tooltip={{
                                formatter,
                                placement: "bottom",
                              }}
                              styles={{
                                track: {
                                  background: "#236dff",
                                },
                                rail: {
                                  background: "rgb(71, 77, 87)",
                                },
                                handle: {
                                  size: 30,
                                  type: "square",
                                },
                              }}
                              disabled={
                                assetBalance.quoteAssetBalance === 0 ||
                                (bidData.length === 0 &&
                                  askData.length === 0) ||
                                !isLoggedIn
                              }
                            />
                            <Slider
                              marks={marks}
                              value={
                                assetBalance.baseAssetBalance === 0 ||
                                (bidData.length === 0 &&
                                  askData.length === 0) ||
                                !isLoggedIn
                                  ? 0
                                  : sellRangeValue
                              }
                              onChange={(e) => {
                                setSellRangeValue(e);
                                if (marketType === "stop_limit") {
                                  let total =
                                    (e / 100) * assetBalance.baseAssetBalance;
                                  setAmountValueTwo(
                                    applyPrecision(total, quotePrecision)
                                  );
                                  setStopLimitTotalSell(
                                    applyPrecision(
                                      total * limitTotalValueTwo,
                                      quotePrecision
                                    )
                                  );
                                } else {
                                  handleSellRangeValue(e);
                                }
                              }}
                              className="mx-2 w-50"
                              tooltip={{
                                formatter,
                                placement: "bottom",
                              }}
                              styles={{
                                track: {
                                  background: "#236dff",
                                },
                                rail: {
                                  background: "rgb(71, 77, 87)",
                                },
                                handle: {
                                  size: 30,
                                  type: "square",
                                },
                              }}
                              disabled={
                                assetBalance.baseAssetBalance === 0 ||
                                (bidData.length === 0 &&
                                  askData.length === 0) ||
                                !isLoggedIn
                              }
                            />
                          </div>
                        )}
                        {marketType === "stop_limit" && isLoggedIn && (
                          <div className="w-100 d-flex justify-content-between gap-4 px-2 mt-1">
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg bg-secondary opacity-50">
                              <label
                                htmlFor="stop_limit_buy"
                                className="text-white opacity-75"
                              >
                                Total
                              </label>
                              <input
                                className="w-75 bg-transparent text-white px-2 text-end"
                                // placeholder="Price"
                                id="stop_limit_buy"
                                value={Number(
                                  parseFloat(stopLimitTotalBuy) || 0
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 8, // Set a large number of fraction digits
                                })}
                                onChange={(e) => {
                                  const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                  const value = reg.test(e.target.value)
                                    ? e.target.value
                                    : stopLimitTotalBuy;
                                  value !== "." &&
                                    value.indexOf(".") ===
                                      value.lastIndexOf(".") &&
                                    setStopLimitTotalBuy(
                                      value.replace(/[^\d.]/gi, "")
                                    );
                                }}
                                autoComplete="off"
                                readOnly
                              />
                              <label htmlFor="stop_limit_buy">
                                {selectedAsset?.quoteAsset}
                              </label>
                            </div>
                            <div className="w-50 d-flex price_field p-2 rounded-1 justify-content-between common_input_bg opacity-50 bg-secondary">
                              <label
                                htmlFor="stop_limit_sell"
                                className="text-white opacity-75"
                              >
                                Total
                              </label>
                              <input
                                className="w-75 bg-transparent text-white px-2 text-end"
                                // placeholder="Price"
                                id="stop_limit_sell"
                                // value={
                                //   Number(priceStopValueTwo) *
                                //   Number(amountValueTwo)
                                // }
                                value={Number(
                                  parseFloat(stopLimitTotalSell) || 0
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 8, // Set a large number of fraction digits
                                })}
                                onChange={(e) => {
                                  const reg = /^(\d{0,8}\.)?\d{0,8}$/;

                                  const value = reg.test(e.target.value)
                                    ? e.target.value
                                    : stopLimitTotalSell;
                                  value !== "." &&
                                    value.indexOf(".") ===
                                      value.lastIndexOf(".") &&
                                    setStopLimitTotalSell(
                                      value.replace(/[^\d.]/gi, "")
                                    );
                                }}
                                readOnly
                                autoComplete="off"
                              />
                              <label htmlFor="stop_limit_sell">
                                {selectedAsset?.quoteAsset}
                              </label>
                            </div>
                          </div>
                        )}

                        {/* <div className="buySell_btn d-flex justify-content-between" style={{background:"blue", width: "50%"}}>
                        <div className="d-flex flex-row " style={{background:"red", width: "50%"}}>
                        <li className="outerCircle">
                            1
                        </li>
                        <div className="lineProgressbar">4</div>
2
                        </div>
                     
                        <li className="outerCircle"></li>
                        <li className="outerCircle"></li>
                        <li className="outerCircle"></li>


                      </div>
                      <div className="buySell_btn">2</div> */}
                        {/* <div
                        className="progressBarLine_main_container justify-content-between w-100 d-flex mt-2 position-absolute"
                        style={{
                          bottom: "5.9rem",
                        }}
                      >
                        <div className="buySell_btn d-flex justify-content-between ">
                          <div className="stepper-wrapper w-100  ">
                            <div className="stepper-item completedDashboard ">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item completedDashboard">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item active">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item">
                              <div className="step-counter"></div>
                            </div>
                          </div>
                        </div>
                        <div className="buySell_btn ">
                          <div className="stepper-wrapper w-100  ">
                            <div className="stepper-item completedDashboard">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item completedDashboard">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item active">
                              <div className="step-counter"></div>
                            </div>
                            <div className="stepper-item">
                              <div className="step-counter"></div>
                            </div>
                          </div>{" "}
                        </div>
                      </div> */}

                        {/* <input
                        className="inputField"
                        placeholder="Total"
                        readOnly
                      />
                      <input
                        className="inputField"
                        placeholder="Total"
                        readOnly
                      /> */}
                      </div>
                      <div
                        // className="w-100"
                        className={
                          marketType === "market" ? "w-100 pt-4" : "w-100 "
                        }
                      >
                        <div className="buySellStatus_container d-flex justify-content-between px-2 py-1 opacity-75">
                          <div className="buySell_btn text-start small d-flex  justify-content-between">
                            <div className="">
                              <span className="text-secondary">Max Buy</span>

                              {isLoggedIn ? (
                                <>
                                  {marketType !== "stop_limit" ? (
                                    <span className="ps-2">
                                      {priceStopValueOne > 0
                                        ? applyPrecision(
                                            Math.ceil(
                                              assetBalance.quoteAssetBalance /
                                                priceStopValueOne
                                            ),
                                            quotePrecision
                                          )
                                        : 0}
                                      &nbsp;{selectedAsset?.baseAsset}
                                    </span>
                                  ) : (
                                    <span className="ps-2">
                                      {limitTotalValueOne > 0
                                        ? applyPrecision(
                                            Math.ceil(
                                              assetBalance.quoteAssetBalance /
                                                limitTotalValueOne
                                            ),
                                            quotePrecision
                                          )
                                        : 0}
                                      &nbsp;{selectedAsset?.baseAsset}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="ps-2">
                                  0 &nbsp;{selectedAsset?.baseAsset}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-secondary">Est .Fee</span>
                              <span className="ps-2">
                                {amountValueOne > 0
                                  ? Number(
                                      parseFloat(amountValueOne) * 0.001
                                    ).toLocaleString(undefined, {
                                      maximumFractionDigits: 8, // Set a large number of fraction digits
                                    })
                                  : 0}
                                &nbsp;
                                {selectedAsset?.baseAsset}
                              </span>
                            </div>
                          </div>
                          <div className="buySell_btn text-start small  d-flex  justify-content-between">
                            <div>
                              <span className="text-secondary">Max Sell</span>
                              {isLoggedIn ? (
                                <>
                                  {marketType === "stop_limit" ? (
                                    <span className="ps-2">
                                      {/* 0 {selectedAsset?.quoteAsset} */}
                                      {limitTotalValueTwo > 0
                                        ? Math.ceil(
                                            assetBalance.baseAssetBalance *
                                              limitTotalValueTwo
                                          )
                                        : 0}{" "}
                                      {selectedAsset?.quoteAsset}
                                    </span>
                                  ) : (
                                    <span className="ps-2">
                                      {/* 0 {selectedAsset?.quoteAsset} */}
                                      {priceStopValueTwo > 0
                                        ? applyPrecision(
                                            assetBalance.baseAssetBalance *
                                              parseFloat(priceStopValueTwo),
                                            quotePrecision
                                          )
                                        : 0}{" "}
                                      {selectedAsset?.quoteAsset}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="ps-2">
                                  0 &nbsp;
                                  {selectedAsset?.quoteAsset}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="text-secondary">Est .Fee</span>
                              <span className="ps-2">
                                {Number(
                                  limitTotalValueTwo * amountValueTwo * 0.001
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 8, // Set a large number of fraction digits
                                })}
                                &nbsp;{selectedAsset?.quoteAsset}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between px-2 pb-2">
                          {isLoggedIn ? (
                            <>
                              <div className="buySell_btn">
                                <button
                                  className=" py-2 btnSucess text-white w-100"
                                  disabled={btnLoader}
                                  onClick={() => {
                                    if (
                                      priceStopValueOne !== "" &&
                                      amountValueOne !== ""
                                    ) {
                                      if (marketType === "stop_limit") {
                                        if (
                                          stopLimitMarketPrice.bid > 0 &&
                                          amountValueOne > 0 &&
                                          stopLimitTotalBuy > 0
                                        ) {
                                          setErrorMsg("");
                                          Number(priceStopValueOne) >
                                          Number(stopLimitMarketPrice.bid)
                                            ? setStopLimitPreviewModal(true)
                                            : setErrorMsg(
                                                "Stop price must be greater than Market price"
                                              );
                                          setTimeout(() => {
                                            setErrorMsg("");
                                          }, 3000);
                                          setCreateOrderType("Buy");
                                        }
                                      } else {
                                        if (
                                          Number(priceStopValueOne) *
                                            Number(amountValueOne) <=
                                            assetBalance.quoteAssetBalance &&
                                          limitTotalValueOne > 0
                                        ) {
                                          createBuyNewOrder("BUY");
                                        }
                                      }
                                    }
                                  }}
                                >
                                  {btnLoader ? (
                                    <img
                                      src={refresh_loader}
                                      style={{ width: 20 }}
                                      className="spinner"
                                      alt=""
                                    />
                                  ) : null}{" "}
                                  Buy {selectedAsset?.baseAsset}
                                </button>
                              </div>
                              <div className="buySell_btn">
                                <button
                                  className="btnDanger btnSucess text-white py-2 w-100"
                                  disabled={btnLoaderTwo}
                                  // onClick={() =>{if (amountValueTwo <= assetBalance.baseAssetBalance)
                                  //   createsellNewOrder()} }
                                  onClick={() => {
                                    if (
                                      priceStopValueTwo !== "" &&
                                      amountValueTwo !== ""
                                    ) {
                                      if (marketType === "stop_limit") {
                                        if (
                                          stopLimitMarketPrice.ask > 0 &&
                                          amountValueTwo > 0 &&
                                          stopLimitTotalSell > 0
                                        ) {
                                          setErrorMsg("");
                                          Number(limitTotalValueTwo) >
                                          Number(stopLimitMarketPrice.ask)
                                            ? setStopLimitPreviewModal(true)
                                            : setErrorMsg(
                                                "Limit price must be greater than Market price"
                                              );
                                          setTimeout(() => {
                                            setErrorMsg("");
                                          }, 3000);
                                          setCreateOrderType("Sell");
                                        }
                                      } else {
                                        if (
                                          Number(amountValueTwo) <=
                                            Number(
                                              assetBalance.baseAssetBalance
                                            ) &&
                                          limitTotalValueTwo > 0
                                        ) {
                                          createsellNewOrder();
                                        }
                                      }
                                    }
                                  }}
                                >
                                  {btnLoaderTwo ? (
                                    <img
                                      src={refresh_loader}
                                      style={{ width: 20 }}
                                      className="spinner"
                                      alt=""
                                    />
                                  ) : null}
                                  Sell {selectedAsset?.baseAsset}
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <button
                                className="buySell_btn py-2 btnSucess text-white"
                                onClick={() =>
                                  // navigate("../signUp")
                                  navigate("../", {
                                    state: {
                                      pageName: "signin",
                                    },
                                  })
                                }
                              >
                                Login to Buy
                              </button>
                              <button
                                className="buySell_btn btnDanger btnSucess text-white"
                                onClick={() =>
                                  // navigate("../signUp")
                                  navigate("../", {
                                    state: {
                                      pageName: "signin",
                                    },
                                  })
                                }
                              >
                                Login to Sell
                              </button>
                            </>
                          )}
                        </div>

                        <div
                          className={`d-flex justify-content-between px-2 pb-1 ${
                            Number(amountValueTwo) >
                            Number(assetBalance.baseAssetBalance)
                              ? "justify-content-end"
                              : Number(limitTotalValueOne) >
                                assetBalance.quoteAssetBalance
                              ? "justify-content-start"
                              : "justify-content-between"
                          }`}
                          style={{ height: "1.2rem" }}
                        >
                          <div className=" w-50">
                            {Number(limitTotalValueOne) >
                            assetBalance.quoteAssetBalance ? (
                              <span className="text_danger ps-1">
                                Insufficient Balance
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className=" w-50 d-flex justify-content-end">
                            {priceStopValueTwo !== "" &&
                            Number(amountValueTwo) >
                              Number(assetBalance.baseAssetBalance) ? (
                              <span className="text_danger pe-1 ">
                                Insufficient Balance
                              </span>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {marketType === "stop_limit" && errorMsg && (
                          <div
                            className={`text_danger px-2  ${
                              errorMsg.includes("Limit price")
                                ? "text-end pb-2"
                                : "text-start pb-2"
                            }`}
                          >
                            {errorMsg}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="orderBook_main_container container_bg_color w-25 common_border_bg rounded position-relative">
                  <div className="d-flex order_book_header__container justify-content-between px-2 py-1">
                    <div className="btn-group d-flex gap-2 pt-1">
                      <span
                        // className="filter_icon cursorPointer  "
                        className={`${
                          selectedOrderBookTab === 1
                            ? "filter_icon cursorPointer"
                            : "filter_icon cursorPointer opacity-50"
                        }`}
                        onClick={() => setSelectedOrderBookTab(1)}
                        title="Order Book"
                      >
                        <img
                          src={orderBookFilter}
                          height={20}
                          width={20}
                          alt="filter_img"
                        />
                      </span>
                      <span
                        className={`${
                          selectedOrderBookTab === 2
                            ? "filter_icon cursorPointer"
                            : "filter_icon cursorPointer opacity-50"
                        }`}
                        title="Buy Order"
                        onClick={() => setSelectedOrderBookTab(2)}
                      >
                        <img
                          src={orderBookFilterTwo}
                          height={20}
                          width={20}
                          alt="filter_img"
                        />
                      </span>
                      <span
                        className={`${
                          selectedOrderBookTab === 3
                            ? "filter_icon cursorPointer"
                            : "filter_icon cursorPointer opacity-50"
                        }`}
                        onClick={() => setSelectedOrderBookTab(3)}
                        title="Sell Order"
                      >
                        <img
                          src={orderBookFilterThree}
                          height={20}
                          width={20}
                          alt="filter_img"
                        />
                      </span>
                    </div>

                    <DropdownButton
                      title={selectedOrderBookValue}
                      id="dropdown_limit"
                      className="order_book_Value_dropdown"
                      onSelect={handleSelectOrderBookValue}
                    >
                      {selectedOrderBookFilterValues.map((ele, i) => {
                        return (
                          <Dropdown.Item eventKey={ele} key={i}>
                            {ele}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>

                    {/* <span className="filter_icon">
                          <img
                            src={filter}
                            height={20}
                            width={20}
                            alt="filter_img"
                          />
                        </span> */}
                  </div>
                  <div className=" d-flex flex-column w-100">
                    <div
                      className="orderData_header justify-content-between d-flex px-2 opacity-75"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <span style={{ width: "30%" }} className="text-start">
                        Price({selectedAsset?.quoteAsset})
                      </span>
                      <span
                        style={{ width: "30%" }}
                        className="text-center ps-2"
                      >
                        Amount({selectedAsset?.baseAsset})
                      </span>
                      <span style={{ width: "40%" }} className="text-end pe-2">
                        Total
                      </span>
                    </div>

                    {/* <div className="orderData_content pt-4">
                   
                   
                   </div> */}
                    <div className="order_book_data w-100">
                      {orderBookDataPage()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <footer className="dashboard_footer_container mb-3 py-2 mx-3 container_bg_color common_border_bg rounded-2">
            <div className="footer_header">
              <div className="d-flex gap-2 mx-1">
                <span
                  className={`cursorPointer p-2 rounded-2 ${
                    selectOrder === "openOrder"
                      ? "selctedTableTab "
                      : "TableTab  "
                  }`}
                  onClick={() => {
                    setSelectOrder("openOrder");
                    restoreStatesOrders();
                    setSelectOrder("openOrder");
                    if (isLoggedIn) {
                      getOpenOrderData("ALL", "ALL", "ALL");
                    }
                  }}
                >
                  Open Order
                </span>
                <span
                  className={`cursorPointer p-2 rounded-2 ${
                    selectOrder === "orderHistory"
                      ? "selctedTableTab"
                      : "TableTab"
                  }`}
                  onClick={() => {
                    setSelectOrder("orderHistory");
                    restoreStatesOrders();
                    if (isLoggedIn) {
                      getCustomerAllOrdersHistory(
                        fromDate,
                        toDate,
                        "ALL",
                        "ALL",
                        "ALL"
                      );
                    }
                  }}
                >
                  Order History
                </span>

                <span
                  className={`cursorPointer p-2 rounded-2 ${
                    selectOrder === "trade" ? "selctedTableTab" : "TableTab"
                  }`}
                  onClick={() => {
                    setSelectOrder("trade");
                    restoreStatesOrders();
                    if (isLoggedIn) {
                      getCustomerAllTrades(yesterday, today, "ALL");
                    }
                  }}
                >
                  Trade History
                </span>
                <span
                  className={`cursorPointer p-2 rounded-2 ${
                    selectOrder === "funds" ? "selctedTableTab" : "TableTab"
                  }`}
                  onClick={() => {
                    setSelectOrder("funds");
                    if (isLoggedIn) {
                      getAllfunds();
                    }
                  }}
                >
                  Funds
                </span>
              </div>
              <hr />

              {allOrderTablePage()}
            </div>
          </footer>

          {/* Stop-Limit Preview modal */}
          <Modal
            show={stopLimitPreviewModal}
            className="numberModal "
            aria-labelledby="example-custom-modal-styling-title"
            // size="md"
          >
            <Modal.Body className="ModalBody ">
              <div className="modalUS row justify-content-center">
                <h5 className="text-start fw-bold text-white pb-3">
                  Order Confirmation
                </h5>
                <div className="text-white">
                  <div className="d-flex justify-content-between align-items-center py-1 fw-bold fs-6">
                    <span>{selectedAsset?.assetPairName}</span>
                    <span
                      className={`${
                        createOrderType === "Buy"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {createOrderType}/Stop-limit
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-secondary">Stop</span>
                    <span>
                      {createOrderType === "Buy"
                        ? priceStopValueOne
                        : priceStopValueTwo}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-secondary">Limit</span>
                    <span>
                      {createOrderType === "Buy"
                        ? limitTotalValueOne
                        : limitTotalValueTwo}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-secondary">Amount</span>
                    <span>
                      {createOrderType === "Buy"
                        ? amountValueOne
                        : amountValueTwo}
                      &nbsp;
                      {selectedAsset?.baseAsset}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-secondary">Total</span>
                    <span>
                      {createOrderType === "Buy"
                        ? stopLimitTotalBuy
                        : stopLimitTotalSell}
                      &nbsp;
                      {selectedAsset?.quoteAsset}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="text-secondary">Est. Fee</span>
                    <span>
                      {createOrderType === "Buy"
                        ? Number(
                            applyPrecision(
                              parseFloat(amountValueOne) * 0.001,
                              8
                            ) || 0
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 8, // Set a large number of fraction digits
                          })
                        : Number(
                            applyPrecision(
                              parseFloat(limitTotalValueTwo) *
                                parseFloat(amountValueTwo) *
                                0.001,
                              8
                            ) || 0
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 8, // Set a large number of fraction digits
                          })}
                      &nbsp;
                      {createOrderType === "Buy"
                        ? selectedAsset?.baseAsset
                        : selectedAsset?.quoteAsset}
                    </span>
                  </div>
                </div>
                <hr className="text-secondary mt-2 mb-0" />
                <div className="text-white small mt-1">
                  <span className="opacity-50 pe-1">
                    {" "}
                    If the last price drops to or below
                  </span>
                  <span className="text-white opacity-100">
                    {createOrderType === "Buy"
                      ? priceStopValueOne
                      : priceStopValueTwo}
                    &nbsp;
                    {selectedAsset?.quoteAsset},
                  </span>
                  <span className="opacity-50 px-1">
                    an order to {createOrderType.toLocaleLowerCase()}
                  </span>
                  <span>
                    {createOrderType === "Buy"
                      ? amountValueOne
                      : amountValueTwo}
                    &nbsp;
                    {selectedAsset?.baseAsset}
                  </span>
                  <span className="opacity-50 ps-1"> at a price of </span>
                  <span>
                    {createOrderType === "Buy"
                      ? limitTotalValueOne
                      : limitTotalValueTwo}
                    &nbsp;
                    {selectedAsset?.quoteAsset}
                  </span>
                  <span className="opacity-50 ps-1">will be placed.</span>
                </div>

                <div className="d-flex justify-content-center gap-4 pt-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm px-3 w-50 py-2"
                    onClick={() => setStopLimitPreviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm px-3 w-50 py-2"
                    disabled={btnLoaderTwo || btnLoader}
                    onClick={() =>
                      createOrderType === "Buy"
                        ? createStopLimitBuyOrder("BUY")
                        : createStopLimitBuyOrder("SELL")
                    }
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </section>
      </div>
      <div
        className="text-start ps-2 small fw-bold common_border_bg container_bg_color position-absolute bottom-0 w-100"
        style={{ zIndex: "1" }}
      >
        {internetStatus.isConnected ? (
          <>
            {internetStatus.status >= "3g" ? (
              <span className="d-flex align-items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="9.667"
                    width="1.67"
                    height="2.5"
                    fill="#0ECB81"
                  ></rect>
                  <rect
                    x="4.44446"
                    y="5.667"
                    width="1.66667"
                    height="6.67"
                    fill="#0ECB81"
                  ></rect>
                  <rect
                    x="8.88892"
                    y="3"
                    width="1.66667"
                    height="10.83"
                    fill="#0ECB81"
                  ></rect>
                  <rect
                    x="13.3333"
                    width="1.66667"
                    height="15"
                    fill="#0ECB81"
                  ></rect>
                </svg>
                <span style={{ color: "#0ECB81" }}>Stable connection</span>
              </span>
            ) : (
              <span className="d-flex align-items-center gap-1">
                <svg
                  width="16"
                  height="12"
                  viewBox="0 0 16 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="9.667"
                    width="1.67"
                    height="2.5"
                    fill="#0ECB81"
                  ></rect>
                  <rect
                    x="4.44446"
                    y="5.667"
                    width="1.66667"
                    height="6.67"
                    fill="#0ECB81"
                  ></rect>
                </svg>
                <span style={{ color: "#0ECB81" }}>Unstable connection</span>
              </span>
            )}
          </>
        ) : (
          <>
            <span className="d-flex align-items-center gap-1">
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="9.667"
                  width="1.67"
                  height="2.5"
                  fill="rgb(174 8 8)"
                ></rect>
                <rect
                  x="4.44446"
                  y="5.667"
                  width="1.66667"
                  height="6.67"
                  fill="gray"
                ></rect>
                <rect
                  x="8.88892"
                  y="3"
                  width="1.66667"
                  height="10.83"
                  fill="gray"
                ></rect>
                <rect
                  x="8.88892"
                  y="3"
                  width="1.66667"
                  height="10.83"
                  fill="gray"
                ></rect>
              </svg>
              <span style={{ color: "rgb(174 8 8)" }}>Disconnected</span>
            </span>
          </>
        )}
      </div>

      {orderHistoryModalView()}
      <NotificationContainer />
    </>
  );
};

export default Dashboard;
