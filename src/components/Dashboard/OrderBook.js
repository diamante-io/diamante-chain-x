import React, { useEffect, useState } from "react";
import { applyPrecision, formatNumber } from "../commonComponent";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Topbar from "../Topbar/Topbar";
import { useLocation } from "react-router";
import axios from "axios";
import { URI } from "../../constants";
import Loader from "../common/Loader";
import SockJS from "sockjs-client"; //npm i sockjs-client
import * as Stomp from "stompjs";

var stompClient = "";

const OrderBook = () => {
  const location = useLocation();

  let bidDataList = [];
  let askDataList = [];
  //   const { askDataList, bidDataList, selectedAsset } = location.state;
  const [selectedDepthOption, setSelectedDepthOption] = useState("15");
  const [filteredAskDepthData, setFilteredAskDepthData] = useState([]);
  const [filteredBidDepthData, setFilteredBidDepthData] = useState([]);
  const [askData, setAskData] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [apiLoader, setApiLoader] = useState(true);
  const [selectedOrderBookValue, setSelectedOrderBookValue] = useState("");
  const [selectedOrderBookFilterValues, setSelectedOrderBookFilterValues] =
    useState(["0.01", "0.1", "1", "50", "100"]);
  const [requestNo, setRequestNo] = useState("");

  const changeExpoValue = (value) => {
    value = applyPrecision(value, 8);
    return Math.abs(value) < 1 && value.toString().includes("e")
      ? Math.round(parseInt(value).toFixed(8))
      : value;
  };

  function generateArray(value) {
    const result = new Set();

    const maxValue = Math.min(value * 100, 1);

    for (let i = 0; i <= 4; i++) {
      const newValue = value * Math.pow(10, i);
      if (newValue <= maxValue) {
        result.add(Math.round(newValue * 1e8) / 1e8);
      }
    }
    return [...result];
  }

  const applyDepthFilter = (data, depthOption) => {
    let displayCount = data.length;

    if (depthOption === "15") {
      displayCount = 15;
    } else if (depthOption === "30") {
      displayCount = 30;
    } else if (depthOption === "50") {
      displayCount = 50;
    } else if (depthOption === "100") {
      displayCount = 100;
    }

    return data.slice(0, displayCount);
  };

  function displayWithPrecision(values, precision = 0.01) {
    let newList = [];

    values.forEach((value) => {
      const formattedValue = (
        Math.round(value.price / precision) * precision
      ).toFixed(precision.toString().split(".")[1]?.length || 0);

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

  const _send = (message) => {
    if (stompClient) {
      stompClient.send("/app/sendOStream", {}, JSON.stringify(message));
    } else {
      console.error("WebSocket connection is not established yet.");
    }
  };

  const errorCallBack = (error) => {
    setTimeout(() => {
      _connect(selectedAsset.assetSymbol);
      // _connect(selectedAssetSymbol);
    }, 5000);
  };

  const onMessageReceived = (message, id) => {
    let serverMsg = JSON.parse(message.body);

    if (serverMsg.e !== null) {
      let serverData = JSON.parse(serverMsg.data);

      let eValue = serverMsg.e?.split("@");

      if (eValue[1] === "depth") {
        if (serverData?.action === "NEW" && serverMsg.id == id) {
          var newData = {
            amount: serverData.quantity,
            price: serverData.price,
          };
          if (serverData.side === "BID") {
            bidDataList.push(newData);
            bidDataList.sort((a, b) => a.price - b.price);
            bidDataList = bidDataList.reverse();

            const bidHighValue = Math.max(
              ...bidDataList.map((obj) => obj.price * obj.amount)
            );
            let filteredBidData = bidDataList.map((obj) => ({
              ...obj,
              total: obj.price * obj.amount,
              depth: ((obj.price * obj.amount) / bidHighValue) * 100,
            }));
            // setBidData(filteredBidData);
            // setFilteredBidData(displayWithPrecision(filteredBidData, "0.01"));

            setFilteredBidDepthData(
              applyDepthFilter(
                displayWithPrecision(filteredBidData, selectedOrderBookValue),
                selectedDepthOption
              )
            );
          } else {
            askDataList.push(newData);
            askDataList.sort((a, b) => a.price - b.price);
            askDataList = askDataList;

            const askHighValue = Math.max(
              ...askDataList.map((obj) => obj.price * obj.amount)
            );
            let filteredAskData = askDataList.map((obj) => ({
              ...obj,
              total: obj.price * obj.amount,
              depth: ((obj.price * obj.amount) / askHighValue) * 100,
            }));

            // setAskData(filteredAskData);
            // setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
            setFilteredAskDepthData(
              applyDepthFilter(
                displayWithPrecision(filteredAskData, selectedOrderBookValue),
                selectedDepthOption
              )
            );
          }
        } else if (serverData?.action === "CHANGE" && serverMsg.id == id) {
          if (serverData.side === "BID") {
            if (bidDataList?.length > 0) {
              let objIndex = bidDataList.findIndex(
                (e) => e.price == serverData.price
              );

              if (bidDataList[objIndex].hasOwnProperty("amount")) {
                bidDataList[objIndex].amount = serverData.quantity;

                const bidHighValue = Math.max(
                  ...bidDataList.map((obj) => obj.price * obj.amount)
                );
                let filteredBidData = bidDataList.map((obj) => ({
                  ...obj,
                  total: obj.price * obj.amount,
                  depth: ((obj.price * obj.amount) / bidHighValue) * 100,
                }));
                // setBidData(filteredBidData);
                // setFilteredBidData(
                //   displayWithPrecision(filteredBidData, "0.01")
                // );
                setFilteredBidDepthData(
                  applyDepthFilter(
                    displayWithPrecision(
                      filteredBidData,
                      selectedOrderBookValue
                    ),
                    selectedDepthOption
                  )
                );
              }
            }
          } else {
            if (askDataList?.length > 0) {
              let objIndex = askDataList.findIndex(
                (e) => e.price == serverData.price
              );
              askDataList[objIndex].amount = serverData.quantity;

              const askHighValue = Math.max(
                ...askDataList.map((obj) => obj.price * obj.amount)
              );
              let filteredAskData = askDataList.map((obj) => ({
                ...obj,
                total: obj.price * obj.amount,
                depth: ((obj.price * obj.amount) / askHighValue) * 100,
              }));
              // setAskData(filteredAskData);
              // setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
              setFilteredAskDepthData(
                applyDepthFilter(
                  displayWithPrecision(filteredAskData, selectedOrderBookValue),
                  selectedDepthOption
                )
              );
            }
          }
        } else if (
          (serverData?.action === "DELETE" ||
            serverData?.action === "TRADEDELETE") &&
          serverMsg.id == id
        ) {
          if (serverData.side === "BID") {
            bidDataList = bidDataList.filter(
              (e) => e.price != serverData.price
            );
            const bidHighValue = Math.max(
              ...bidDataList.map((obj) => obj.price * obj.amount)
            );
            let filteredBidData = bidDataList.map((obj) => ({
              ...obj,
              total: obj.price * obj.amount,
              depth: ((obj.price * obj.amount) / bidHighValue) * 100,
            }));
            // setBidData(filteredBidData);
            // setFilteredBidData(displayWithPrecision(filteredBidData, "0.01"));
            setFilteredBidDepthData(
              applyDepthFilter(
                displayWithPrecision(filteredBidData, selectedOrderBookValue),
                selectedDepthOption
              )
            );
          } else {
            askDataList = askDataList.filter(
              (e) => e.price != serverData.price
            );
            const askHighValue = Math.max(
              ...askDataList.map((obj) => obj.price * obj.amount)
            );
            let filteredAskData = askDataList.map((obj) => ({
              ...obj,
              total: obj.price * obj.amount,
              depth: ((obj.price * obj.amount) / askHighValue) * 100,
            }));
            // setAskData(filteredAskData);
            // setFilteredAskData(displayWithPrecision(filteredAskData, "0.01"));
            setFilteredAskDepthData(
              applyDepthFilter(
                displayWithPrecision(filteredAskData, selectedOrderBookValue),
                selectedDepthOption
              )
            );
          }
        }
      }
    }
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
          params: [`${__assetSymb}@depth`],
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

  const getOrderBookData = async (symbol, filteredDecimal) => {
    setApiLoader(true);
    await axios
      .get(URI.getOrderData + symbol + "/100")
      .then((response) => {
        if (response.data.status === 200) {
          setApiLoader(false);
          const askPrimaryData = response.data.data.ask;
          const askHighValue = Math.max(
            ...askPrimaryData.map((obj) => obj.price * obj.amount)
          );
          let filteredAskData = askPrimaryData.map((obj) => ({
            ...obj,
            total: obj.price * obj.amount,
            depth: ((obj.price * obj.amount) / askHighValue) * 100,
          }));
          askDataList = filteredAskData;
          setAskData(filteredAskData);
          const bidHighValue = Math.max(
            ...response.data.data.bid.map((obj) => obj.price * obj.amount)
          );
          let filteredBidData = response.data.data.bid.map((obj) => ({
            ...obj,
            total: obj.price * obj.amount,
            depth: ((obj.price * obj.amount) / bidHighValue) * 100,
          }));
          bidDataList = filteredBidData;
          setBidData(filteredBidData);
          if (filteredDecimal !== "") {
            setFilteredAskDepthData(
              applyDepthFilter(
                displayWithPrecision(askDataList, filteredDecimal),
                selectedDepthOption
              )
            );
            setFilteredBidDepthData(
              applyDepthFilter(
                displayWithPrecision(bidDataList, filteredDecimal),
                selectedDepthOption
              )
            );
          }
        }
      })
      .catch((error) => {
        setApiLoader(false);
        console.log(error);
      });
  };

  const getAssetObj = async (pair) => {
    let selectedObj = {};

    await axios
      .post(URI.getAssetSymbols, {})
      .then((response) => {
        if (response.data.status === 200) {
          selectedObj = response.data.data.find(
            (assetSymbol) => assetSymbol.assetPairName === pair
          );
          let list = generateArray(
            changeExpoValue(selectedObj?.minPriceMovement)
          );
          setSelectedOrderBookFilterValues(list);
          getOrderBookData(
            selectedObj?.assetSymbol,
            selectedObj?.minPriceMovement ||
              response.data.data[0]?.minPriceMovement
          );
          setSelectedOrderBookValue(
            selectedObj.minPriceMovement ||
              response.data.data[0].minPriceMovement
          );
          setSelectedAsset(selectedObj || response.data.data[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedPair = queryParams.get("pairName");
    const assetSymbol = queryParams.get("assetSymbol");

    getAssetObj(selectedPair);
    _connect(assetSymbol);
  }, [location]);

  var askSum = 0;
  var bidSum = 0;

  return (
    <div
      // className={
      //   toggle ? "dashboard_toggle_main_container" : "dashboard_main_container"
      // }
      className="dashboard_main_container small"
    >
      <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="">
          <Topbar />
        </header>
        <div>
          {" "}
          <div className="openOrderView_main_container w-75 h-100 mx-auto  ">
            <div className="openOrder_header d-flex justify-content-between  pt-1">
              <div className="d-flex gap-2 ps-2 w-75 align-items-center">
                <h4 className="my-0 py-0"> Order Book</h4>
                <span className="order_book_line rounded-2 mt-1 mx-2"></span>
                <h6 className="my-0 py-0">{selectedAsset?.assetPairName}</h6>
                {/* <span>-</span>
        <span>MBL/USDT</span> */}
              </div>
              <div className="d-flex gap-3 w-25 ps-5 pe-0">
                <div className="w-50 text-start me-1">
                  <span className="opacity-75">Depth</span>
                  <DropdownButton
                    title={selectedDepthOption}
                    id="dropdown_limit"
                    onSelect={(eventKey) => {
                      setSelectedDepthOption(eventKey);
                      let askDepthData = applyDepthFilter(askData, eventKey);
                      let bidDepthData = applyDepthFilter(bidData, eventKey);
                      setFilteredAskDepthData(
                        displayWithPrecision(
                          askDepthData,
                          selectedOrderBookValue
                        )
                      );
                      setFilteredBidDepthData(
                        displayWithPrecision(
                          bidDepthData,
                          selectedOrderBookValue
                        )
                      );
                      // setFilteredAskDepthData(askDepthData);
                      // setFilteredBidDepthData(bidDepthData);
                    }}
                    className="order_book_Value_dropdown border border-secondary rounded-2 order_book_Value_btn"
                  >
                    <Dropdown.Item eventKey="15">15</Dropdown.Item>
                    <Dropdown.Item eventKey="30">30</Dropdown.Item>
                    <Dropdown.Item eventKey="50">50</Dropdown.Item>
                    <Dropdown.Item eventKey="100">100</Dropdown.Item>
                  </DropdownButton>
                </div>
                <div className="w-50 text-start">
                  <span className="opacity-75">Group</span>
                  <DropdownButton
                    style={{ marginLeft: "-10px" }}
                    title={`${
                      selectedOrderBookValue.toString().split(".")[1]?.length ||
                      0
                    } decimals`}
                    id="dropdown_limit"
                    className="order_book_Value_dropdown border border-secondary rounded-2"
                    onSelect={(eventKey) => {
                      setSelectedOrderBookValue(eventKey);
                      setFilteredAskDepthData(
                        displayWithPrecision(
                          filteredAskDepthData,
                          eventKey ? eventKey : "0.01"
                        )
                      );
                      setFilteredBidDepthData(
                        displayWithPrecision(
                          filteredBidDepthData,
                          eventKey ? eventKey : "0.01"
                        )
                      );
                    }}
                  >
                    {selectedOrderBookFilterValues.map((ele, i) => {
                      return (
                        <Dropdown.Item eventKey={ele} key={i}>
                          {ele.toString().split(".")[1]?.length || 0} decimals
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
            </div>
            <div className="buySellMain_container d-flex justify-content-between  gap-4 mt-2  ">
              <div className="sellOrderView common_border_bg ">
                <h5 className="text-start px-2 py-3">Buy Order</h5>
                {apiLoader ? (
                  <div>
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div className="sellOrderHeader d-flex justify-content-between px-2">
                      <span className="text-start w-25">
                        Price ({selectedAsset?.quoteAsset})
                      </span>
                      <span className="text-center w-25">
                        Amount ({selectedAsset?.baseAsset})
                      </span>
                      <span className="text-center w-25">
                        Total ({selectedAsset?.baseAsset})
                      </span>
                      <span className="text-end pe-2 w-25">
                        Sum ({selectedAsset?.baseAsset})
                      </span>
                    </div>

                    {filteredBidDepthData.length > 0 ? (
                      <>
                        {filteredBidDepthData.map((item) => {
                          bidSum = item.total + bidSum;
                          return (
                            <div
                              className="position-relative mt-1"
                              style={{
                                zIndex: 1,
                              }}
                              key={item.total}
                            >
                              <div
                                className="position-absolute top-0  start-0"
                                style={{
                                  backgroundColor: "#2b4b28",
                                  width: `${item.depth}%`,
                                  height: "100%",
                                }}
                              />
                              <div
                                style={{ zIndex: "10" }}
                                className="buyOrderHeader d-flex justify-content-between align-items-center individual_orderData_success position-relative individual_orderBookData pb-1 pt-2"
                              >
                                <span className="w-25 px-1 text_suceess text-start">
                                  {" "}
                                  {formatNumber(item.price)}
                                </span>
                                <span className="w-25 text-center">
                                  {formatNumber(item.amount)}
                                </span>
                                <span className="w-25 text-center">
                                  {" "}
                                  {formatNumber(item.total)}
                                </span>
                                <span className="w-25 text-end pe-3">
                                  {" "}
                                  {formatNumber(bidSum)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "65vh" }}
                      >
                        <div>
                          <h4 className="opacity-75">No data</h4>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="buyOrder_view common_border_bg   ">
                <h5 className="text-start px-2 py-3">Sell Order</h5>
                {apiLoader ? (
                  <div>
                    <Loader />
                  </div>
                ) : (
                  <>
                    <div className="buyOrderHeader d-flex justify-content-between px-2 w-100">
                      <span className="text-start w-25">
                        Price ({selectedAsset?.quoteAsset})
                      </span>
                      <span className="text-center w-25">
                        Amount ({selectedAsset?.baseAsset})
                      </span>
                      <span className="text-center w-25">
                        Total ({selectedAsset?.quoteAsset})
                      </span>
                      <span className="text-end pe-2 w-25">
                        Sum ({selectedAsset?.quoteAsset})
                      </span>
                    </div>
                    {filteredAskDepthData.length > 0 ? (
                      <>
                        {filteredAskDepthData.map((item) => {
                          askSum = item.total + askSum;
                          return (
                            <div
                              className="position-relative"
                              style={{
                                zIndex: 1,
                              }}
                              key={item.total}
                            >
                              <div
                                className="position-absolute top-0 start-0"
                                style={{
                                  backgroundColor: "#562a2a",
                                  width: `${item.depth}%`,
                                  height: "100%",
                                }}
                              />
                              <div
                                className="buyOrderHeader d-flex justify-content-between align-items-center individual_orderBookData  position-relative pb-1 pt-2 w-100"
                                style={{ zIndex: "10" }}
                              >
                                <span className="px-1 text_danger text-start ps-2 w-25">
                                  {formatNumber(item.price)}
                                </span>
                                <span className="text-center w-25">
                                  {formatNumber(item.amount)}
                                </span>
                                <span className="text-center w-25">
                                  {formatNumber(item.total)}
                                </span>
                                <span className=" text-end pe-2 w-25">
                                  {formatNumber(askSum)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "65vh" }}
                      >
                        <div>
                          <h4 className="opacity-75">No data</h4>
                        </div>
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

export default OrderBook;
