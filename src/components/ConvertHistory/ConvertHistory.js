import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import Topbar from "../Topbar/Topbar";
// import { useNavigate } from "react-router-dom";
import { DropdownButton, Dropdown, Modal, Button } from "react-bootstrap";
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
import moment from "moment";
import { setAssetGlobalSymbol } from "../../components/common/globalVariable";
import { useNavigate } from "react-router-dom";
import {
  __customBcColor,
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

import rejectedIcon from "../../assets/rejected.svg";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const removeIcon = (
  <FontAwesomeIcon icon={faXmark} width="27" height="27" color="#f5f5f5" />
);
const ConvertHistory = () => {
  const [toggle, setToggle] = useState(false);
  const yesterday = new Date();
  const today = new Date();

  const [filterOption, setFilterOption] = useState("ALL");
  const [pairOption, setPairOption] = useState("ALL");
  const [sideOption, setSideOption] = useState("ALL");

  const [selectOrder, setSelectOrder] = useState("convertHistory");
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderData, setOpenOrderData] = useState([]);
  const [convertHistoryData, setConvertHistoryData] = useState([]);
  const [searchAssetList, setSearchAssetList] = useState([]);
  const [dateModal, SetDateModal] = useState(false);
  const [walletFilter, setWalletFilter] = useState("ALL");
  const [coinFilter, setCoinFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("Past 30 days");
  yesterday.setDate(yesterday.getDate() - 30);

  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);

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
        stroke-width="1.17404"
        stroke-linecap="round"
        stroke-linejoin="round"
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
          stroke-width="1.17404"
          stroke-linecap="round"
          stroke-linejoin="round"
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

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("accessToken");
    return Boolean(token);
  };

  const isLoggedIn = isAuthenticated();

  const getAllAssetSearch = async () => {
    axios
      .get(URI.getAssetsBySearch)
      .then((response) => {
        if (response.data.status === 200) {
          const originalAssetList = response.data.data.assetList;

          const modifiedAssetList = [
            {
              assetSymbol: "All",
              isTransfer: 1,
              assetId: 0, // You can set an appropriate ID for "All"
              isWithdraw: 1,
              assetName: "All Assets",
              assetPercision: 8,
              isDeposit: 1,
            },
            ...originalAssetList,
          ];

          setSearchAssetList(modifiedAssetList);
        } else {
          setSearchAssetList([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getConvertHistoryData = async (
    fromDate,
    toDate,
    filterWallet,
    filterCoin,
    pgNumber
  ) => {
    setIsLoading(true);

    const requestBody = {
      flagName: "CONVERT_HISTORY",
      customerId: customerId,
      wallet: filterWallet,
      asset: filterCoin,
      pageNo: pgNumber,
      pageSize: 10,
      fromDate: moment(new Date(fromDate)).format("YYYY-MM-DD"),
      toDate: moment(new Date(toDate)).format("YYYY-MM-DD"),
      // fromDate: fromDate,
      // toDate: toDate,
    };

    await axios
      .post(URI.getConvertHistory, requestBody, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setTotalCount(parseInt(response.data.data.rowCount));
          setPageCount(parseInt(response.data.data.rowCount) / 10);

          setConvertHistoryData(response.data.data.convertTransList);
        } else {
          setIsLoading(false);
          setConvertHistoryData([]);
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
          setOpenOrderData(response.data.data.orderList);
        } else {
          setIsLoading(false);
          setOpenOrderData([]);
        }
      })

      .catch((error) => {});
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
            {/* <th scope="col">Price</th> */}
            <th scope="col">Limit Price</th>
            <th scope="col">Stop Price</th>
            <th scope="col">Amount</th>
            <th scope="col">Filled</th>
            <th scope="col">Total</th>
          </tr>
        </thead>

        {!isLoading ? (
          <>
            {openOrderData.length > 0 ? (
              <tbody className="tableBody_content">
                {openOrderData.map((item, key) => {
                  console.log(item);
                  return (
                    <tr className="text-start" key={key}>
                      <td>{item.ordCreatedDate}</td>
                      <td>{item.assetPairName}</td>
                      <td>{item.ordType}</td>
                      <td>{item.ordSide}</td>
                      {/* <td>{formatNumber(item?.requestedOrdPrice)}</td> */}
                      <td>
                        {formatNumber(
                          item.ordType === "LIMIT"
                            ? formatNumber(item?.requestedOrdPrice)
                            : formatNumber(item?.ordLimitPrice) || "-"
                        )}
                      </td>
                      <td className="ps-3">
                        {item.ordType === "LIMIT"
                          ? "-"
                          : formatNumber(item?.ordStopPrice) || "-"}
                      </td>
                      <td>
                        {formatNumber(item?.requestOrdQty)}&nbsp;
                        {item.baseAsset}
                      </td>
                      <td>
                        {formatNumber(item?.ordFilledQuantity)}&nbsp;
                        {item.baseAsset}
                      </td>
                      <td>{formatNumber(item?.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={12} className="border-0 pt-2 ">
                    <div className="d-flex justify-content-center align-items-center">
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

  const handleDateUpdate = async (type, e) => {
    type === "fromDate" ? setFromDate(new Date(e)) : setToDate(new Date(e));
  };

  // const dateValue = e.target.value;

  const ConvertHistoryTable = () => (
    <>
      <div className="table_main_container_spot">
        <div className="d-flex gap-3 align-items-center mb-3">
          <div>
            <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
              Time
            </div>
            <div className="mt-2">
              <DropdownButton
                title={timeFilter}
                id="dropdown-transaction-history"
                onSelect={(key) => {
                  // getCustomerAllOrdersHistory(
                  //   fromDate,
                  //   toDate,
                  //   key,
                  //   pairOption,
                  //   sideOption,
                  //   1
                  // );
                  // getConvertHistoryDateFilter(key)
                }}
              >
                {/* {baseAssets.map((asset) => {
                return <Dropdown.Item eventKey={asset}>{asset}</Dropdown.Item>;
              })} */}
                <Dropdown.Item
                  eventKey="Past 7 days"
                  onClick={() => {
                    setTimeFilter("Past 7 days");
                    setFromDate(
                      moment().subtract(7, "days").format("YYYY-MM-DD")
                    );
                    getConvertHistoryData(
                      moment().subtract(7, "days").format("YYYY-MM-DD"),
                      moment(today).format("YYYY-MM-DD"),
                      walletFilter,
                      coinFilter,
                      1
                    );
                  }}
                >
                  {" "}
                  Past 7 days
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Past 30 days"
                  onClick={() => {
                    setTimeFilter("Past 30 days");
                    setFromDate(
                      moment().subtract(30, "days").format("YYYY-MM-DD")
                    );

                    getConvertHistoryData(
                      moment().subtract(30, "days").format("YYYY-MM-DD"),
                      moment(today).format("YYYY-MM-DD"),
                      walletFilter,
                      coinFilter,
                      1
                    );
                  }}
                >
                  Past 30 days
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Past 90 days"
                  onClick={() => {
                    setTimeFilter("Past 90 days");
                    setFromDate(
                      moment().subtract(90, "days").format("YYYY-MM-DD")
                    );

                    getConvertHistoryData(
                      moment().subtract(90, "days").format("YYYY-MM-DD"),
                      moment(today).format("YYYY-MM-DD"),
                      walletFilter,
                      coinFilter,
                      1
                    );
                  }}
                >
                  Past 90 days
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="Customized"
                  onClick={() => {
                    SetDateModal(true);

                    setFromDate(
                      new Date(new Date().setDate(new Date().getDate() - 2))
                    );
                    setToDate(today);
                  }}
                >
                  Customized
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          <div>
            <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
              Wallet
            </div>
            <div className="mt-2">
              <DropdownButton
                title={walletFilter}
                id="dropdown-transaction-history"
                onSelect={(key) => {
                  setWalletFilter(key);
                  // getConvertHistoryData(filterOption, pairOption, key, 1);
                  getConvertHistoryData(fromDate, toDate, key, coinFilter, 1);
                }}
              >
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                <Dropdown.Item eventKey="Spot">Spot</Dropdown.Item>
                <Dropdown.Item eventKey="Funding">Funding</Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
          <div>
            <div className="text-start ms-1" style={{ color: "#f5f5f5" }}>
              Coin
            </div>
            <div className="mt-2 convertSelectInput">
              {/* <DropdownButton
              title={filterOption}
              id="dropdown-transaction-history"
              onSelect={(key) => {
                setFilterOption(key);
                 getConvertHistoryData("",key)
              }}
            >
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              <Dropdown.Item eventKey="BTC">BTC</Dropdown.Item>
            </DropdownButton> */}

              <Select
                menuPlacement="auto"
                className="assetListlInput px-2"
                styles={customSelectLocationStyles}
                options={searchAssetList.map((asset) => ({
                  value: asset.assetSymbol,
                  label: asset.assetSymbol,
                }))}
                value={
                  coinFilter ? { value: coinFilter, label: coinFilter } : null
                }
                onChange={(selectedOption) => {
                  const selectedPair = selectedOption
                    ? selectedOption.value
                    : "";
                  setCoinFilter(selectedPair);
                  getConvertHistoryData(
                    fromDate,
                    toDate,
                    walletFilter,
                    selectedPair,
                    1
                  );
                }}
                // isClearable={true}

                placeholder="Search and select..."
              />
            </div>
          </div>
        </div>
        <table className="table text-white">
          <thead className="container_bg_color text-secondary">
            <tr className="text-start ">
              <th scope="col">Trade Date</th>
              <th scope="col">Wallet</th>
              <th scope="col">Pair</th>
              <th scope="col">Type</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Price</th>
              <th scope="col">Settlement Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          {!isLoading ? (
            <>
              {convertHistoryData?.length > 0 ? (
                <tbody className="tableBody_content">
                  {convertHistoryData.map((item, key) => (
                    <tr className="text-start cursorPointer" key={key}>
                      <td>{item.tradeDate}</td>
                      <td>{item.wallet}</td>
                      <td>{item.pair}</td>
                      <td>{item.type}</td>
                      <td>{item.fromValue}</td>
                      <td>{item.toValue}</td>
                      <td>{item.price}</td>
                      <td>{item.settlementDate}</td>
                      <td>{item.transactionStatus}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <>
                  <tbody>
                    <tr>
                      <td colSpan={12} className="border-0 pt-2 ">
                        <div className="d-flex justify-content-center align-items-center mt-4">
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
              <td colSpan={12} className="border-0 pt-4">
                <Loader />
              </td>
            </tbody>
          )}
        </table>
      </div>
      <Modal
        show={dateModal}
        className="numberModal d-flex justify-content-center align-items-center"
        aria-labelledby="example-custom-modal-styling-title"
        size="md"
      >
        <Modal.Body className="ModalBody ">
          <div
            className="modalUS row justify-content-center py-2"
            style={{
              margin: "0",
              gap: "10px",

              // backgroundColor: "#151515",
            }}
          >
            <div className="d-flex justify-content-between pt-2">
              <h3 className="text-white opacity-75">Select a Time Range</h3>
              <span
                className="cursorPointer"
                onClick={() => {
                  SetDateModal(false);
                }}
              >
                {" "}
                {removeIcon}
              </span>
            </div>
            <div>
              <span className="text-white opacity-75">
                Select your time range within 90 days.
              </span>
            </div>
            <div className="date_container d-flex gap-4 ">
              <div className="pt-1 d-flex gap-1 flex-column">
                <label htmlFor="to" className="text-start text-white">
                  From
                </label>
                <DatePicker
                  className="personalInput text-white"
                  dateFormat="MM-dd-yyyy"
                  selected={fromDate}
                  onChange={(e) => handleDateUpdate("fromDate", e)}
                  maxDate={toDate}
                  // minDate={moment().subtract(90, "days").format("YYYY-MM-DD")}
                  minDate={
                    new Date(new Date().setDate(new Date().getDate() - 90))
                  }
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
                <label htmlFor="to" className="text-start text-white">
                  To
                </label>
                <DatePicker
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
            <div className="pt-2">
              <button
                className="btn btn-primary pt-2 timeDateBtn "
                onClick={() => {
                  getConvertHistoryData(
                    fromDate,
                    toDate,
                    walletFilter,
                    coinFilter,
                    1
                  );

                  SetDateModal(false);
                  setTimeFilter("Customized");
                }}
              >
                {" "}
                Continue
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
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
    if (openOrderData?.length > 0 || convertHistoryData?.length > 0) {
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
      if (selectOrder === "convertHistory") {
        return ConvertHistoryTable();
      } else if (selectOrder === "openOrder") {
        return openOrderTable();
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
                  selectOrder === "convertHistory"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  restoreStates();
                  setSelectOrder("convertHistory");
                  if (isLoggedIn) {
                    getConvertHistoryData(
                      fromDate,
                      toDate,
                      walletFilter,
                      coinFilter,
                      1
                    );
                  }
                }}
              >
                Convert History
              </div>
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
            </div>
          </div>
          <div className="horizontal_line mt-4 me-1"></div>
          {selectOrder === "openOrder" && (
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
                <div className="mt-2 pair_dropdown_spot">
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
                    options={searchAssetList.map((asset) => ({
                      value: asset.assetSymbol,
                      label: asset.assetSymbol,
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
                      // getOpenOrderData(filterOption, selectedPair, sideOption, 1);
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
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M47.3337 12.5742C47.3337 16.2426 44.3457 19.2305 40.6774 19.2305H30.3232C28.4891 19.2305 26.8323 18.4909 25.6194 17.278C24.4065 16.065 23.667 14.4084 23.667 12.5742C23.667 8.90589 26.6549 5.91797 30.3232 5.91797H40.6774C42.5116 5.91797 44.1683 6.65756 45.3812 7.87048C46.5942 9.0834 47.3337 10.7401 47.3337 12.5742Z"
                          stroke="#505255"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.667 50.293H47.3337"
                          stroke="#505255"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M23.667 40.457H35.5003"
                          stroke="#505255"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24 30H30"
                          stroke="#505255"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <circle
                          cx="47.5"
                          cy="53.5"
                          r="12"
                          fill="#111111"
                          stroke="#505255"
                          stroke-width="3"
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
            {/* {__getPaginationView()} */}
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
      } else if (selectOrder === "convertHistory") {
        getConvertHistoryData(
          fromDate,
          toDate,
          walletFilter,
          coinFilter,
          pageNumber
        );
      }

      // getConvertHistoryData(
      //   fromDate,
      //   toDate,
      //   walletFilter,
      //   coinFilter,
      //   pageNumber
      // );
    };
    setPageCount(Math.ceil(parseInt(totalCount) / 10));

    fetchData();
  }, [offset, pageNumber]);

  useEffect(() => {
    if (isLoggedIn) {
      getAllAssetSearch();
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
        activePage={"convertHistory"}
      />
      <div style={{ width: "88vw", height: "100vh" }}>
        <div>
          <Topbar />
        </div>
        {openOrder()}
        {__getPaginationView()}
      </div>
    </div>
  );
};

export default ConvertHistory;
