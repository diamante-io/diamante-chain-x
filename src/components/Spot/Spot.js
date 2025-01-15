import React, { useEffect, useState } from "react";
import "./Spot.css";
import SideBar from "../SideBar/SideBar";
import { Table, Pagination } from "antd";
import { DropdownButton, Dropdown, Modal, Button } from "react-bootstrap";
import SearchIcon from "../../assets/SearchIcon.svg";
import LeftArrow from "../../assets/leftArrowIcon.svg";
import swapIcon from "../../assets/swapConvert.svg";
import crossIcon from "../../assets/crossIconx.svg";
import downloadIcon from "../../assets/downloadIcon.svg";
import EyeIcon from "../../assets/Eye.svg";
import Topbar from "../Topbar/Topbar";
import reverseIcon from "../../assets/reverseIcon.svg";
import axios from "axios";
import { URI } from "../../constants";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import ReactPaginate from "react-paginate";

import moment from "moment";
import Deposit from "../Deposit/Deposit";
const removeIcon = (
  <FontAwesomeIcon icon={faXmark} width="27" height="27" color="#f5f5f5" />
);
// import 'antd/dist/antd.css'

const Spot = () => {
  // const yesterday = moment().subtract(30, "days").format("YYYY-MM-DD");
  // const today = moment().format("YYYY-MM-DD");

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 30));
  const today = new Date();
  const [selectedOption, setSelectedOption] = useState("Past 30 days");
  const [selectedTimeCrypto, setSelectedTimeCrypto] = useState("Past 30 days");
  const [selectedTimeTransfer, setSelectedTimeTransfer] =
    useState("Past 30 days");
  const [transType, setTransType] = useState("Deposit");
  const [selectedTab, setSelectedTab] = useState("deposit");
  const [selectedSendTab, setSelectedSendTab] = useState("sendto");
  const [selectPage, setSelectPage] = useState("transaction");
  const [selectTransaction, setSelectTransaction] = useState("CRYPTO");
  const [tableContentData, setTableContentData] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [assets, setAssets] = useState([]);
  const [dateModal, SetDateModal] = useState(false);
  const [transactionHistoryList, setTransactionHistoryList] = useState([]);
  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [sourceId, setSourceId] = useState(1);
  const [sourceWallet, setSourceWallet] = useState("Funding");
  const [targetId, setTargetId] = useState(2);
  const [transferHistoryList, setTransferHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { customerId } = useSelector((stat) => stat.ChangeState);
  const [selectedAsset, setSelectedAsset] = useState({
    name: assets[0]?.assetSymbol,
    id: assets[0]?.assetId,
  });

  const [timeFilter, setTimeFilter] = useState("Past 30 days");

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

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const handleSelectFunding = (eventKey) => {
    setTimeFilter(eventKey);
  };

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const handleSelectTranfer = (eventKey) => {
    setSelectedTimeTransfer(eventKey);
  };

  const handleDateUpdate = async (type, e) => {
    type === "fromDate" ? setFromDate(new Date(e)) : setToDate(new Date(e));
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleAddClick = () => {
    setShowContent(!showContent);
    setIsAddButtonDisabled(true);
  };

  const getAssets = async (searchString) => {
    await axios
      .get(
        URI.getAssetsBySearch +
          `${searchString !== "" ? `/${searchString}` : ""}`
      )
      .then((response) => {
        if (response.data.status === 200) {
          const originalAssetList = response.data.data.assetList;
          const modifiedAssetList = [
            {
              assetSymbol: "All",
              isTransfer: 1,
              assetId: 0, // You can set an appropriate ID for "All"
              isWithdraw: 1,
              assetName: "All",
              assetPercision: 8,
              isDeposit: 1,
            },
            ...originalAssetList,
          ];
          setAssets(modifiedAssetList);
          setSelectedAsset({
            name: modifiedAssetList[0].assetName,
            id: modifiedAssetList[0].assetId,
          });
        } else {
          setAssets([]);
        }
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getFundingWallet = async (
    fromDate,
    toDate,
    asset,
    type,
    pgNumber,
    transType
  ) => {
    setIsLoading(true);

    let requestBody;

    if (type === "TRANSFER") {
      requestBody = {
        flagName: type,
        customerId: customerId,
        asset: asset,
        sourceWalletId: sourceWallet === "Funding" ? 2 : 1,
        targetWalletId: sourceWallet === "Funding" ? 1 : 2,
        fromDate: moment(new Date(fromDate)).format("YYYY-MM-DD"),
        toDate: moment(new Date(toDate)).format("YYYY-MM-DD"),
        // fromDate: fromDate,
        // toDate: toDate,
        pageNo: pgNumber,
        pageSize: 10,
      };
    } else if (type === "CRYPTO") {
      // setPageNumber(pgNumber);
      requestBody = {
        flagName: type,
        customerId: customerId,
        asset: asset,
        fromDate: moment(new Date(fromDate)).format("YYYY-MM-DD"),
        toDate: moment(new Date(toDate)).format("YYYY-MM-DD"),
        // fromDate: fromDate,
        // toDate: toDate,
        pageNo: pgNumber,
        pageSize: 10,
        transactionType: transType?.toUpperCase(),
        transId: null,
      };
    } else {
      requestBody = {
        flagName: type,
        customerId: customerId,
        asset: asset,
        fromDate: moment(fromDate).format("YYYY-MM-DD"),
        toDate: moment(toDate).format("YYYY-MM-DD"),
        // fromDate: fromDate,
        // toDate: toDate ,
        pageNo: pgNumber,
        pageSize: 10,
      };
    }

    await axios
      .post(URI.getTransHistoryOfFundingWallet, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setTransactionHistoryList(response.data.data.transactionHistoryList);
          setTotalCount(parseInt(response.data.data.rowCount));
          setPageCount(parseInt(response.data.data.rowCount) / 10);
        } else {
          setIsLoading(false);
          setTransactionHistoryList([]);
        }
      });
  };

  const __getPaginationView = () => {
    if (transactionHistoryList?.length > 0) {
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

  const handlePageClick = (e) => {
    const selectedPage = e.selected;

    setOffset((selectedPage + 1) * 10);
    setPageNumber(e.selected + 1);
    setCurrentPage(selectedPage);
  };

  const TransactionHistoryTable = () => {
    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan={12} className="border-0 pt-4">
              <Loader />
            </td>
          </tr>
        </tbody>
      );
    }

    if (
      transactionHistoryList.length > 0 &&
      selectTransaction === "FUNDING_WALLET"
    ) {
      return (
        <tbody
          className="tableBody_content"
          style={{ borderColor: "#f5f5f550" }}
        >
          {transactionHistoryList.map((item, key) => (
            <tr className="text-start cursorPointer" key={key}>
              <td>{item.time}</td>
              <td>{item.transactionType}</td>
              <td>{item.asset}</td>
              <td>{item.change}</td>
              <td>{item.currentBalance}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (
      transactionHistoryList.length > 0 &&
      selectTransaction === "CRYPTO"
    ) {
      return (
        <tbody
          className="tableBody_content"
          style={{ borderColor: "#f5f5f550" }}
        >
          {transactionHistoryList.map((item, key) => (
            <tr className="text-start cursorPointer" key={key}>
              <td>{item.time}</td>
              <td>{item.transactionType}</td>
              <td>{item.wallet}</td>
              <td>{item.coin}</td>
              <td>{item.actualAmount}</td>
              <td>{item.destinationAdd}</td>
              <td>{item.transHash}</td>
              <td>{item.transactionStatus}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (
      transactionHistoryList.length > 0 &&
      selectTransaction === "TRANSFER"
    ) {
      return (
        <tbody
          className="tableBody_content"
          style={{ borderColor: "#f5f5f550" }}
        >
          {transactionHistoryList.map((item, key) => {
            return (
              <tr className="text-start cursorPointer" key={key}>
                <td>{item.date}</td>
                <td>{item.coin}</td>
                <td>{item.amount}</td>
                <td>{item.fromWall}</td>
                <td>{item.toWall}</td>
                <td>{item.notes}</td>
              </tr>
            );
          })}
        </tbody>
      );
    } else {
      return (
        <tbody>
          <tr>
            <td colSpan={12}>
              {tableContentData.length === 0 ? (
                <div
                  className="mt-4 d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
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
                <div className="text-white">Hello </div>
              )}
            </td>
          </tr>
        </tbody>
      );
    }
  };

  const transactionPageContent = () => {
    return (
      <div>
        {/* <div
          className="d-flex ms-4"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectPage("deposit");
            setSelectedTab("deposit");
          }}
        >
          <img src={LeftArrow} alt="leftArrow" className="mb-1" />
          <h4 style={{ color: "#ffffff", fontSize: "1.6vw" }} className="ms-3">
            Transaction history
          </h4>
        </div> */}
        <div className="sendPageContent ms-4 mt-2">
          <div className="d-flex justify-content-between ms-4 mt-4">
            <div className="d-flex gap-4">
              {/* <div
                className={
                  selectTransaction === "all"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => setSelectTransaction("all")}
              >
                All
              </div> */}
              <div
                className={
                  selectTransaction === "CRYPTO"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  setSelectedTimeCrypto("Past 30 days");
                  setSelectTransaction("CRYPTO");
                  setSelectedAsset({
                    name: "All",
                    id: 0,
                  });
                  getFundingWallet(
                    moment().subtract(30, "days").format("YYYY-MM-DD"),
                    moment(today).format("YYYY-MM-DD"),
                    "All",
                    "CRYPTO",
                    1,
                    "DEPOSIT"
                  );
                  setCurrentPage(0);
                }}
              >
                Crypto
              </div>
              {/* <div
                className={
                  selectTransaction === "fiat"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => setSelectTransaction("fiat")}
              >
                Fiat
              </div> */}
              <div
                className={
                  selectTransaction === "TRANSFER"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  setSelectedTimeTransfer("Past 30 days");
                  setSelectTransaction("TRANSFER");

                  getFundingWallet(
                    moment().subtract(30, "days").format("YYYY-MM-DD"),
                    moment(today).format("YYYY-MM-DD"),
                    "All",
                    "TRANSFER",
                    1
                  );
                  setCurrentPage(0);
                }}
              >
                Transfer
              </div>
              <div
                className={
                  selectTransaction === "FUNDING_WALLET"
                    ? "btn btn-primary"
                    : "btn border-primary text-white"
                }
                onClick={() => {
                  setTimeFilter("Past 30 days");
                  setSelectTransaction("FUNDING_WALLET");
                  getFundingWallet(
                    moment().subtract(30, "days").format("YYYY-MM-DD"),
                    moment(today).format("YYYY-MM-DD"),
                    "All",
                    "FUNDING_WALLET",
                    1
                  );
                  setSelectedAsset({
                    name: "All",
                    id: 0,
                  });
                  setCurrentPage(0);
                }}
              >
                Funding Wallet
              </div>
            </div>
            <div className="me-4">
              <img
                src={downloadIcon}
                alt="downlaad"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="horizontal_line mt-4 ms-4 me-4"></div>

          {selectTransaction === "FUNDING_WALLET" ? (
            <div className="d-flex gap-3 mt-2 ms-4">
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Time
                </div>
                <div>
                  <DropdownButton
                    title={timeFilter}
                    id="dropdown-transaction-history"
                    onSelect={handleSelectFunding}
                    className="transactionHistoryTimeDropdown"
                  >
                    <Dropdown.Item
                      eventKey="Past 7 Days"
                      onClick={() => {
                        setTimeFilter("Past 7 days");
                        setFromDate(
                          moment().subtract(7, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(7, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 7 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 30 Days"
                      onClick={() => {
                        setTimeFilter("Past 30 days");
                        setFromDate(
                          moment().subtract(30, "days").format("YYYY-MM-DD")
                        );

                        getFundingWallet(
                          moment().subtract(30, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 30 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 90 Days"
                      onClick={() => {
                        setTimeFilter("Past 90 days");
                        setFromDate(
                          moment().subtract(90, "days").format("YYYY-MM-DD")
                        );

                        getFundingWallet(
                          moment().subtract(90, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 90 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Customized"
                      onClick={() => {
                        setFromDate(
                          new Date(new Date().setDate(new Date().getDate() - 2))
                        );
                        setToDate(today);
                        SetDateModal(true);
                      }}
                    >
                      Customized
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Coin
                </div>
                <div>
                  <DropdownButton
                    title={selectedAsset.name}
                    id="dropdown-transaction-history"
                    className="order_book_Value_dropdown rounded-2 spot_transfer_dropdown "
                  >
                    {assets.map((asset) => {
                      return (
                        <Dropdown.Item
                          key={asset.assetSymbol}
                          eventKey={asset.assetSymbol}
                          onClick={() => {
                            setSelectedAsset({
                              name: asset.assetSymbol,
                              id: asset.assetId,
                            });
                            getFundingWallet(
                              fromDate,
                              toDate,
                              asset.assetSymbol,
                              selectTransaction,
                              1,
                              "TRANSFER"
                            );
                          }}
                        >
                          {asset.assetSymbol}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-4  ">
                <p
                  className="mb-0 cursorPointer   rounded-2"
                  style={{ marginTop: "1.1rem" }}
                  onClick={() => {
                    setTimeFilter("Past 30 days");
                    getFundingWallet(
                      moment().subtract(30, "days").format("YYYY-MM-DD"),
                      moment(today).format("YYYY-MM-DD"),
                      "All",
                      "FUNDING_WALLET",
                      1
                    );
                    setSelectedAsset({
                      name: "All",
                      id: 0,
                    });
                  }}
                >
                  Reset
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          {selectTransaction === "CRYPTO" ? (
            <div className="d-flex gap-3 mt-2 ms-4">
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Type
                </div>
                <div>
                  <DropdownButton
                    title={transType}
                    id="dropdown-transaction-history"
                    onSelect={(eventKey) => {
                      setTransType(eventKey);
                    }}
                    className="transactionHistoryTimeDropdown"
                  >
                    <Dropdown.Item
                      eventKey="Deposit"
                      onClick={() => {
                        getFundingWallet(
                          moment().subtract(30, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),

                          selectedAsset.name,
                          selectTransaction,
                          1,
                          "DEPOSIT"
                        );
                        setCurrentPage(0);
                      }}
                    >
                      Deposit
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Withdraw"
                      onClick={() => {
                        getFundingWallet(
                          moment().subtract(30, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),

                          selectedAsset.name,
                          selectTransaction,
                          1,
                          "WITHDRAW"
                        );
                        setCurrentPage(0);
                      }}
                    >
                      Withdraw
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>

              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Time
                </div>
                <div>
                  <DropdownButton
                    title={selectedTimeCrypto}
                    id="dropdown-transaction-history"
                    onSelect={(eventKey) => setSelectedTimeCrypto(eventKey)}
                    className="transactionHistoryTimeDropdown"
                  >
                    <Dropdown.Item
                      eventKey="Past 7 Days"
                      onClick={() => {
                        setFromDate(
                          moment().subtract(7, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(7, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1,
                          transType
                        );
                      }}
                    >
                      Past 7 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 30 Days"
                      onClick={() => {
                        setFromDate(
                          moment().subtract(30, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(30, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1,
                          transType
                        );
                      }}
                    >
                      Past 30 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 90 Days"
                      onClick={() => {
                        setFromDate(
                          moment().subtract(90, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(90, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1,
                          transType
                        );
                      }}
                    >
                      Past 90 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Customized"
                      onClick={() => {
                        setFromDate(
                          new Date(new Date().setDate(new Date().getDate() - 2))
                        );
                        setToDate(today);
                        SetDateModal(true);
                      }}
                    >
                      Customized
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Coin
                </div>
                <div className="transactionHistoryDropdown">
                  <DropdownButton
                    title={selectedAsset.name}
                    id="dropdown-transaction-history"
                    className="order_book_Value_dropdown rounded-2 spot_transfer_dropdown"
                  >
                    {assets.map((asset) => {
                      return (
                        <Dropdown.Item
                          key={asset.assetSymbol}
                          eventKey={asset.assetSymbol}
                          onClick={() => {
                            setSelectedAsset({
                              name: asset.assetSymbol,
                              id: asset.assetId,
                            });
                            getFundingWallet(
                              fromDate,
                              toDate,
                              asset.assetSymbol,
                              selectTransaction,
                              1,
                              transType
                            );
                          }}
                        >
                          {asset.assetSymbol}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
              {/* <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Status
                </div>
                <div>
                  <DropdownButton
                    title={selectStatusCrypto}
                    id="dropdown-transaction-history"
                    onSelect={handleStatusCrypto}
                  >
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                    <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                  </DropdownButton>
                </div>
              </div> */}
            </div>
          ) : (
            <></>
          )}

          {selectTransaction === "TRANSFER" ? (
            <div className="d-flex gap-3 mt-2 ms-4">
              <div className="fromSelectContainer ">
                <p className="text-start m-0">From</p>
                <div className="fromToWalletContainer px-2">{sourceWallet}</div>
              </div>
              <span
                className="swapConvertICon cursorPointer"
                onClick={() => {
                  setSelectedAsset({
                    name: "All",
                    id: 0,
                  });
                  setSourceWallet(
                    sourceWallet === "Funding" ? "Fiat and Spot" : "Funding"
                  );
                }}
              >
                <img src={swapIcon} height={40} width={40} alt="img" />
              </span>

              <div className="ToSelectContainer">
                <p className="text-start m-0">To</p>
                <div className="fromToWalletContainer px-2">
                  {" "}
                  {sourceWallet === "Funding" ? "Fiat and Spot" : "Funding"}
                </div>
              </div>
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Time
                </div>
                <div>
                  <DropdownButton
                    title={selectedTimeTransfer}
                    id="dropdown-transaction-history"
                    onSelect={handleSelectTranfer}
                    className="transactionHistoryTimeDropdown"
                  >
                    <Dropdown.Item
                      eventKey="Past 7 Days"
                      onClick={() => {
                        setSelectedTimeTransfer("Past 7 Days");
                        setFromDate(
                          moment().subtract(7, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(7, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 7 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 30 Days"
                      onClick={() => {
                        setSelectedTimeTransfer("Past 30 Days");

                        setFromDate(
                          moment().subtract(30, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(30, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 30 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Past 90 Days"
                      onClick={() => {
                        setSelectedTimeTransfer("Past 90 Days");

                        setFromDate(
                          moment().subtract(90, "days").format("YYYY-MM-DD")
                        );
                        getFundingWallet(
                          moment().subtract(90, "days").format("YYYY-MM-DD"),
                          moment(today).format("YYYY-MM-DD"),
                          selectedAsset.name,
                          selectTransaction,
                          1
                        );
                      }}
                    >
                      Past 90 days
                    </Dropdown.Item>

                    <Dropdown.Item
                      eventKey="Customized"
                      onClick={() => {
                        setFromDate(
                          new Date(new Date().setDate(new Date().getDate() - 2))
                        );
                        setToDate(today);
                        SetDateModal(true);
                      }}
                    >
                      Customized
                    </Dropdown.Item>
                  </DropdownButton>
                </div>
              </div>
              <div>
                <div
                  className="text-start ms-1 mt-1"
                  style={{ color: "#f5f5f5" }}
                >
                  Coin
                </div>
                <div className="transactionHistoryDropdown">
                  <DropdownButton
                    title={selectedAsset.name}
                    id="dropdown-transaction-history"
                    className="order_book_Value_dropdown rounded-2 spot_transfer_dropdown"
                  >
                    {assets.map((asset) => {
                      return (
                        <Dropdown.Item
                          key={asset.assetSymbol}
                          eventKey={asset.assetSymbol}
                          onClick={() => {
                            setSelectedAsset({
                              name: asset.assetSymbol,
                              id: asset.assetId,
                            });
                            getFundingWallet(
                              fromDate,
                              toDate,
                              asset.assetSymbol,
                              selectTransaction,
                              1
                            );
                          }}
                        >
                          {asset.assetSymbol}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="mt-4">
            <table className="table text-white">
              {selectTransaction === "FUNDING_WALLET" ? (
                <thead className="container_bg_color text-secondary">
                  <tr className="text-start ">
                    <th className="ms-4">Date</th>
                    <th>Type</th>
                    <th>Coin</th>
                    <th>Change</th>
                    <th className="me-4">Balance</th>
                  </tr>
                </thead>
              ) : selectTransaction === "TRANSFER" ? (
                <thead className="container_bg_color text-secondary">
                  <tr className="text-start ">
                    <th className="ms-4">Date</th>
                    <th>Coin</th>
                    <th>Amount</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Notes</th>
                  </tr>
                </thead>
              ) : (
                <thead className="container_bg_color text-secondary">
                  <tr className="text-start ">
                    <th className="ms-4">Time</th>
                    <th>Type</th>
                    <th>{transType} Wallet</th>
                    <th>Coin</th>
                    <th>Amount</th>
                    <th>Destination</th>
                    <th>TxID</th>
                    <th>Status</th>
                  </tr>
                </thead>
              )}

              {TransactionHistoryTable()}
            </table>
          </div>
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
                  Select your time range within 3 months.
                </span>
              </div>
              <div className="date_container d-flex gap-4 ">
                <div className="pt-1 d-flex gap-1 flex-column">
                  <label htmlFor="to" className="text-start text-white">
                    Start time
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
                    End time
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
                    getFundingWallet(
                      fromDate,
                      toDate,
                      selectedAsset.name,
                      selectTransaction,
                      1,
                      transType
                    );

                    SetDateModal(false);
                    // setTimeFilter("Customized")
                  }}
                >
                  {" "}
                  Continue
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const handleTransfer = () => {
    return (
      <div>
        <Modal
          show={openModal}
          id="deleteBeneficiaryModal"
          aria-labelledby="example-custom-modal-styling-title"
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
                    setOpenModal(false);
                    setSelectPage("deposit");
                  }}
                />
              </div>
              <div className="mt-4 ms-4">
                <p style={{ color: "#ffffff", fontSize: "1.2vw" }}>
                  lorem ipsum lorem ipsum lorem
                </p>
              </div>
              <div className="FiatBoxContent ms-4 mt-4 position-relative">
                <div className="d-flex justify-content-between px-2 py-2">
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>
                    From
                    <div className="ms-2 mt-3 vertical_line position-relative">
                      <span className="position-absolute arrow_icon_reward" />
                    </div>
                  </div>
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>
                    Fiat and Spot
                  </div>
                  <div className="pt-2">
                    <DropdownButton
                      id="dropdown-transfer"
                      onSelect={handleSelect}
                    >
                      <Dropdown.Item eventKey="Tomorrow">
                        Tomorrow
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Yesterday">
                        Yesterday
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                </div>
                <span className="position-relative reverseIcon">
                  <img
                    src={reverseIcon}
                    height={15}
                    width={15}
                    alt="img"
                    className="cursorPointer"
                  />
                </span>
                <div className="d-flex justify-content-between px-2 py-2">
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>To</div>
                  <div style={{ color: "#f5f5f5", fontSize: "1vw" }}>
                    Cross margin
                  </div>
                  <div className="pt-2">
                    <DropdownButton
                      id="dropdown-transfer"
                      onSelect={handleSelect}
                    >
                      <Dropdown.Item eventKey="Tomorrow">
                        Tomorrow
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Yesterday">
                        Yesterday
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
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
                    title={selectedOption}
                    id="dropdown-transfer-modal"
                    onSelect={handleSelect}
                  >
                    <Dropdown.Item eventKey="Tomorrow">Tomorrow</Dropdown.Item>
                    <Dropdown.Item eventKey="Yesterday">
                      Yesterday
                    </Dropdown.Item>
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
                    className="inputBoxTransfer px-4 py-1"
                    placeholder="search coin"
                  />
                </div>
              </div>
              <div className="d-flex mt-4 ms-4 py-4">
                <button className="continueButtonTransfer">Confirm</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  useEffect(() => {
    getAssets("");
  }, []);

  useEffect(() => {
    // const from = new Date(fromDate);
    // const to = new Date(toDate);
    const fetchData = async () => {
      if (selectTransaction === "CRYPTO") {
        getFundingWallet(
          fromDate,
          toDate,
          "All",
          selectTransaction,
          pageNumber,
          transType
        );
      } else if (selectTransaction === "TRANSFER") {
        getFundingWallet(
          fromDate,
          toDate,
          selectedAsset.name,
          selectTransaction,
          pageNumber
        );
      } else {
        getFundingWallet(
          fromDate,
          toDate,
          selectedAsset.name,
          selectTransaction,
          pageNumber
        );
      }
    };
    fetchData();

    setPageCount(Math.ceil(parseInt(totalCount) / 10));
  }, [offset, pageNumber, sourceWallet]);

  // useEffect(() => {
  //   getFundingWallet(
  //     moment().subtract(30, "days").format("YYYY-MM-DD"),
  //     moment(today).format("YYYY-MM-DD"),
  //     "All",
  //     "CRYPTO",
  //     1,
  //     "DEPOSIT"
  //   );
  // }, [sourceWallet]);

  return (
    <div
      className={
        toggle
          ? "dashboard_toggle_main_container"
          : "dashboard_profile_container"
      }
    >
      <SideBar
        activePage={"detailorders"}
        setToggle={setToggle}
        toggle={toggle}
      />
      <div className="ms-3 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <div>
          <Topbar />
        </div>
        {/* {selectPage === "deposit" && initialPage()}
        {selectPage === "send" && sendPageContent()} */}
        {selectPage === "transaction" && transactionPageContent()}
        {/* {selectPage === "transfer" && transferPageContent()} */}
        {__getPaginationView()}

        {handleTransfer()}
      </div>
    </div>
  );
};

export default Spot;
