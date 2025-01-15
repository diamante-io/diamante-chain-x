import React, { useEffect, useState } from "react";
import SideBar from "../SideBar/SideBar";
import "./BuySellCrypto.css";
import { DropdownButton, Dropdown } from "react-bootstrap";
import appleIcon from "../../assets/appleIcon.svg";
import googleSearch from "../../assets/googleSearch.svg";
import paycircleLogo from "../../assets/paycircleLogo.svg";
import darkTheme from "../../assets/darkTheme.svg";
import sellAsset from "../../assets/sellAssetEmpty.svg";
import arrowDownward from "../../assets/arrowDownward.svg";
import { useSelector } from "react-redux";
import NavComponent from "../NavComponent/NavComponent";
import { URI } from "../../constants";
import axios from "axios";
import SearchIcon from "../../assets/SearchIcon.svg";
import USDT from "../../assets/crypto/USDT.png";
import Topbar from "../Topbar/Topbar";

const BuySellCrypto = () => {
  const { isFromDashboard } = useSelector((stat) => stat.ChangeState);

  const [toggle, setToggle] = useState(false);
  const [selectPage, setSelectPage] = useState("buy");
  const [selectedOption, setSelectedOption] = useState("BNB");
  const [selectedOptionReceive, setSelectedOptionReceive] = useState("BNB");
  const [selectedTab, setSelectedTab] = useState("buy");
  const [assetCoin, setAssetCoins] = useState([]);
  const [receiveAssetModal, setReceiveAssetModal] = useState(false);
  const [inputAssetSearchValue, setInputAssetSearchValue] = useState("");
  const [selectedReceiveAsset, setSelectedReceiveAsset] = useState("ETH");
  const [spendAssetModal, setSpendAssetModal] = useState(false);
  const [inputSpendAssetSearchValue, setInputSpendAssetSearchValue] =
    useState("");
  const [selectedSpendAsset, setSelectedSpendAsset] = useState("BTC");
  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const handleSelectReceive = (eventKey) => {
    setSelectedOptionReceive(eventKey);
  };
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const getAssets = async () => {
    axios
      .get(URI.getAssetsBySearch)
      .then((response) => {
        if (response.data.status === 200) {
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

  const filteredAssets = assetCoin.filter((item) =>
    item.assetSymbol.toLowerCase().includes(inputAssetSearchValue.toLowerCase())
  );

  const filteredSpendAssets = assetCoin.filter((item) =>
    // item.assetSymbol !== selectToAsset &&
    item.assetSymbol
      .toLowerCase()
      .includes(inputSpendAssetSearchValue.toLowerCase())
  );

  const buyCrypto = () => {
    return (
      <div>
        {/* <div className="horizontal_line mt-2"></div> */}
        <div className="d-flex justify-content-around align-items-center dashboard_rightSide_main_container py-4 mt-4">
          {/* //left content start */}
          {selectedTab === "buy" ? (
            <div>
              <div className="text-start">
                <h2 style={{ color: "#ffffff" }}>Buy Crypto</h2>
              </div>
              <div
                className="mt-1 text-start"
                style={{ color: "#f5f5f5", fontSize: "1.2vw", opacity: "0.5" }}
              >
                lorem epsum lorem epsum lorem epsum
              </div>
              <div
                className="mt-1 text-start"
                style={{ color: "#f5f5f5", fontSize: "1.2vw", opacity: "0.5" }}
              >
                lorem epsum lorem epsum lorem epsum
              </div>
              <div className="d-flex gap-3 mt-3">
                <div className="payContent rounded-pill d-flex align-items-center justify-content-center">
                  <img src={appleIcon} alt="apple" />
                  <div className="ms-1">Pay</div>
                </div>
                <div className="payContent rounded-pill d-flex align-items-center justify-content-center">
                  <img src={googleSearch} alt="search" />
                  <div className="ms-1">Pay</div>
                </div>
                <div className="payContent rounded-pill d-flex align-items-center justify-content-center">
                  <img src={paycircleLogo} alt="paycircle" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-start">
                <h2 style={{ color: "#ffffff" }}>Sell Crypto</h2>
              </div>
              <div
                className="mt-1 text-start"
                style={{ color: "#f5f5f5", fontSize: "1.2vw", opacity: "0.5" }}
              >
                lorem epsum lorem epsum lorem epsum
              </div>
              <div
                className="mt-1 text-start"
                style={{ color: "#f5f5f5", fontSize: "1.2vw", opacity: "0.5" }}
              >
                lorem epsum lorem epsum lorem epsum
              </div>

              <div className="d-flex gap-3 mt-3">
                <div className="payContent rounded-pill d-flex align-items-center justify-content-center">
                  <div className="ms-1">CHAIN XCHANGE</div>
                </div>
              </div>
            </div>
          )}

          {/* leftContentEnd */}
          <div className="buyCryptoContent mt-4 d-flex flex-column justify-content-between  ">
            <div>
              <div
                className="d-flex justify-content-around common_border_bg "
                style={{
                  height: "10vh",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
              >
                <div
                  className={`mt-3 text-center flex-grow-1 ${
                    selectedTab === "buy" ? "borderActiveBuySell" : ""
                  }`}
                  style={{ fontSize: "1.2vw" }}
                  onClick={() => {
                    handleTabClick("buy");
                  }}
                >
                  Buy
                </div>
                <div
                  className={`mt-3  text-center flex-grow-1 ${
                    selectedTab === "sell" ? "borderActiveBuySell" : ""
                  }`}
                  style={{ fontSize: "1.2vw" }}
                  onClick={() => {
                    handleTabClick("sell");
                  }}
                >
                  Sell
                </div>
              </div>
              {/* <div className='borderActiveBuySell w-50'></div> */}

              {selectedTab === "buy" ? (
                <>
                  {/* right side start*/}
                  <div className="mt-4 ms-4 d-flex spend_container flex-column position-relative common_border_bg rounded-2 py-2">
                    <div className="text-start ms-4 mt-1">
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: "1vw",
                          opacity: "0.8",
                        }}
                      >
                        Spend
                      </div>
                    </div>

                    <div className=" d-flex justify-content-between mt-2 me-4  ">
                      <div
                        className="pt-2 ps-3"
                        style={{
                          color: "#f5f5f5",
                          opacity: "0.8",
                          fontSize: "1.3vw",
                        }}
                      >
                        15.00 -20.00000
                      </div>
                      <div
                        className="py-1 px-4 mt-3 cursorPointer d-flex align-items-center receiveAssetContainer rounded-2 "
                        onClick={() => {
                          setSpendAssetModal(!spendAssetModal);
                          setReceiveAssetModal(false);
                        }}
                      >
                        {selectedSpendAsset}
                      </div>
                    </div>

                    {spendAssetModal && (
                      <div
                        className="receiveAssetMain_container common_border_bg  rounded-2 position-absolute"
                        style={{ zIndex: "10" }}
                      >
                        <div className="d-flex justify-content-center align-items-center mt-2 pb-2 px-3">
                          <input
                            type="text"
                            value={inputSpendAssetSearchValue}
                            onChange={(e) =>
                              setInputSpendAssetSearchValue(e.target.value)
                            }
                            className="inputbox_searchcoin px-2  py-2"
                            placeholder="Search coin"
                          />
                          <img
                            src={SearchIcon}
                            alt="search"
                            className="SearchIcon"
                          />
                        </div>
                        <div className="assetListContainer">
                          {filteredSpendAssets.map((item, index) => {
                            return (
                              <div className="pb-2">
                                <div
                                  className="d-flex assetListSymbol "
                                  key={index}
                                  onClick={() => {
                                    setSelectedSpendAsset(item.assetSymbol);
                                    setSpendAssetModal(false);
                                  }}
                                >
                                  <div className="d-flex gap-2 px-3 py-1">
                                    <span>
                                      <img
                                        src={USDT}
                                        height={40}
                                        width={40}
                                        alt="symbolImg"
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
                      </div>
                    )}
                  </div>
                  {/* <div className="mt-2">
                  <img src={arrowDownward} alt="downward" />
                </div> */}

                  {/* Receive Component */}
                  <div className="mt-4 ms-4 d-flex flex-column common_border_bg spend_container rounded-2 py-2">
                    <div className="text-start ms-4 mt-2 position-relative ">
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: "1vw",
                          opacity: "0.8",
                        }}
                      >
                        Receive
                      </div>
                    </div>
                    {/* <div className="mt-3 me-4">
                    <DropdownButton
                      title={selectedOptionReceive}
                      id="dropdown-buy"
                      onSelect={handleSelectReceive}
                    >
                      {assetCoin.map((asset) => {
                        return (
                          <Dropdown.Item
                            eventKey={asset.assetSymbol}
                         
                          >
                            {asset.assetSymbol}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </div> */}
                    <div className=" mt-2 me-4 d-flex justify-content-between ">
                      <div
                        className="pt-2 ps-4"
                        style={{
                          color: "#f5f5f5",
                          opacity: "0.8",
                          fontSize: "1.3vw",
                        }}
                      >
                        0.00
                      </div>
                      <div
                        className="py-1 px-4 mt-3 cursorPointer receiveAssetContainer rounded-2 d-flex align-items-center"
                        onClick={() => {
                          setReceiveAssetModal(!receiveAssetModal);
                          setSpendAssetModal(false);
                        }}
                      >
                        {selectedReceiveAsset}
                      </div>
                    </div>
                  </div>
                  {receiveAssetModal && (
                    <div className="receiveAssetMain_container common_border_bg ms-4 rounded-2 ">
                      <div className="d-flex justify-content-center align-items-center mt-2 pb-2 px-3">
                        <input
                          type="text"
                          value={inputAssetSearchValue}
                          onChange={(e) =>
                            setInputAssetSearchValue(e.target.value)
                          }
                          className="inputbox_searchcoin px-2  py-2"
                          placeholder="Search coin"
                        />
                        <img
                          src={SearchIcon}
                          alt="search"
                          className="SearchIcon"
                        />
                      </div>
                      <div className="assetListContainer">
                        {filteredAssets.map((item, index) => {
                          return (
                            <div className="pb-2">
                              <div
                                className="d-flex assetListSymbol "
                                key={index}
                                onClick={() => {
                                  setSelectedReceiveAsset(item.assetSymbol);
                                  setReceiveAssetModal(false);
                                }}
                              >
                                <div className="d-flex gap-2 px-3 py-1">
                                  <span>
                                    <img
                                      src={USDT}
                                      height={40}
                                      width={40}
                                      alt="symbolImg"
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
                    </div>
                  )}
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <div className="text-center">
                    <img src={sellAsset} alt="sell" />
                    <div className="mt-4" style={{ fontSize: "1.2vw" }}>
                      You don't have assets to sell
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* right side end */}
            <div className="mt-4 py-4 d-flex justify-content-center">
              {selectedTab === "buy" ? (
                <button className="continueBuyButton">Buy</button>
              ) : (
                <button className="continueBuyButton">Sell</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <div
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
      <SideBar activePage={"buysell"} setToggle={setToggle} toggle={toggle} />
      <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="ps-4">
          <Topbar />
        </header>
        <main className=" rounded-2  ps-4 " style={{ margin: "auto 72px" }}>
          {selectPage === "buy" && buyCrypto()}
        </main>
      </section>
    </div>
  );
};

export default BuySellCrypto;
