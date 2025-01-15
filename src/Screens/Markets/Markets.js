import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import "../../components/Dashboard/dashboard.css";
import "../Markets/Market.css";
import DIAM_refer from "../../assets/DIAM_Refer.png";
import DIAM_Amount from "../../assets/DIAM_Amount.png";
import Topbar from "../../components/Topbar/Topbar";
import { emailValidation } from "../../components/common/commonMethods";
import { useSelector } from "react-redux";
import ALGO from "../../assets/crypto/ALGO.png";
import BNB from "../../assets/crypto/BNB.png";
import BTC from "../../assets/crypto/BTC.png";
import DIAM from "../../assets/crypto/DIAM.png";
import DOGE from "../../assets/crypto/DOGE.png";
import FLRNS from "../../assets/crypto/FLRNS.png";
import LTC from "../../assets/crypto/LTC.png";
import USDT from "../../assets/crypto/USDT.png";
import { hotConins } from "../../constants/DummyData";
import { DropdownButton, Dropdown } from "react-bootstrap";
import PriceChnageChart from "./PriceChnageChart";

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

const Markets = () => {
  const [toggle, setToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Crypto");
  const [pageName, setPageName] = useState("marketPageView");
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

  const [topCoin, setTopCoin] = useState("Crypto");
  const [topLosers, setTopLosers] = useState("Crypto");
  const [topVolume, setTopVolume] = useState("Crypto");

  const { isFromDashboard } = useSelector((stat) => stat.ChangeState);
  console.log(isFromDashboard);

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const marketPageView = () => {
    return (
      <>
        {/* <main className="mx-5 d-flex gap-4 pe-5 refer_page">Main</main> */}
        <main
          className="common_border_bg rounded-2 py-5 mt-3 ps-4"
          style={{ margin: "auto 72px" }}
        >
          <div>
            <div className="d-flex gap-4 me-4">
              <div className="w-25 border border-secondary rounded-4 p-3 justify-content-center small">
                <div className="text-start">
                  <p className="ps-3">Hot Coins</p>
                </div>
                {cryptoLogos.slice(0, 3).map((e, i) => {
                  return (
                    <div className="d-flex align-items-center gap-1 mb-2 ps-2">
                      <img
                        alt={e.asset}
                        src={e.logo}
                        // className="d-block w-25"
                        width={40}
                        height={40}
                        key={i}
                      />
                      <div className="w-25 text-start">{e.asset}</div>
                      <div className="w-25">$291.90</div>
                      <div className="w-25 text-end text-success">-0.61%</div>
                    </div>
                  );
                })}
              </div>
              <div className="w-25 border border-secondary rounded-4 p-3 justify-content-center">
                <div className="text-start d-flex  justify-content-between px-3 small">
                  <p className="">New Listing</p>
                  <p>More &gt;</p>
                </div>
                {cryptoLogos.slice(3, 6).map((e, i) => {
                  return (
                    <div className="d-flex align-items-center gap-1 mb-2 ps-2">
                      <img
                        alt={e.asset}
                        src={e.logo}
                        // className="d-block w-25"
                        width={40}
                        height={40}
                        key={i}
                      />
                      <div className="w-25 text-start">{e.asset}</div>
                      <div className="w-25">$291.90</div>
                      <div className="w-25 text-end text-danger">-0.61%</div>
                    </div>
                  );
                })}
              </div>
              <div className="w-25 border border-secondary rounded-4 p-3 justify-content-center">
                <div className="text-start d-flex  justify-content-between px-3 small">
                  <p className="">Top Gainer Coin</p>
                  <p>More &gt;</p>
                </div>
                {cryptoLogos.slice(2, 5).map((e, i) => {
                  return (
                    <div className="d-flex align-items-center gap-1 mb-2 ps-2">
                      <img
                        alt={e.asset}
                        src={e.logo}
                        // className="d-block w-25"
                        width={40}
                        height={40}
                        key={i}
                      />
                      <div className="w-25 text-start">{e.asset}</div>
                      <div className="w-25">$291.90</div>
                      <div className="w-25 text-end text-danger">-0.61%</div>
                    </div>
                  );
                })}
              </div>
              <div className="w-25 border border-secondary rounded-4 p-3 justify-content-center">
                <div className="text-start d-flex  justify-content-between px-3 small">
                  <p className="">Top Volume Coin</p>
                  <p>More &gt;</p>
                </div>
                {cryptoLogos.slice(4, 7).map((e, i) => {
                  return (
                    <div className="d-flex align-items-center gap-1 mb-2 ps-2">
                      <img
                        alt={e.asset}
                        src={e.logo}
                        // className="d-block w-25"
                        width={40}
                        height={40}
                        key={i}
                      />
                      <div className="w-25 text-start">{e.asset}</div>
                      <div className="w-25">$291.90</div>
                      <div className="w-25 text-end text-success">+0.61%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <footer
          className="common_border_bg rounded-2 py-4 mt-3 ps-5"
          style={{ marginRight: "70px", marginLeft: "70px" }}
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
              {cryptoLogos.slice(0, 4).map((e, i) => {
                return (
                  <div
                    className="market_table_values d-flex pt-3 pb-2"
                    style={{ borderTop: "1px solid rgba(245, 245, 245, 0.6)" }}
                  >
                    <span className="w-25 text-start d-flex align-items-center gap-2">
                      <img
                        alt={e.asset}
                        src={e.logo}
                        className=""
                        style={{ width: "2.6rem" }}
                      />
                      <span className="d-flex flex-column">
                        <span>{e.asset}</span>
                        <span className="small opacity-50">{e.assetName}</span>
                      </span>
                    </span>
                    <span className="w-25 text-start d-flex flex-column">
                      <span>38,589</span>
                      <span className="small opacity-50">38,589</span>
                    </span>
                    <span
                      className="w-25 text-start small"
                      style={{ color: "#0AD61E" }}
                    >
                      +2.9%
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
      </>
    );
  };

  const tradingDataPageView = () => {
    return (
      <main
        className="common_border_bg rounded-2 py-5 mt-3 ps-4"
        style={{ margin: "auto 72px" }}
      >
        <div className="tradingView_MainContainer  d-flex justify-content-between gap-1 px-2  flex-wrap">
          <div className="  tradeIndiv_container common_border_bg rounded-3 px-2">
            <div className="trading_header d-flex justify-content-between px-2 pt-2 ">
              <p className="fs-6 opacity-75">Hot Coins</p>
              <div className="dropdown_container">
                <DropdownButton
                  title={selectedOption}
                  onSelect={handleSelect}
                  id="dropdown-trading"
                  // onSelect={(key) => {
                  //   setFilterOption(key);
                  //   getOpenOrderData(key, pairOption, sideOption);
                  // }}
                >
                  <Dropdown.Item eventKey="Crypto">Crypto</Dropdown.Item>
                  <Dropdown.Item eventKey="All Market">
                    All Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="USDT Market">
                    USDT Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BNB Market">
                    BNB Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BTC Market">
                    BTC Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="ETH Market">
                    ETH Market
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
            <div className="d-flex justify-content-between  px-2 opacity-50">
              <span>Name </span>
              <span className="ps-5">Price </span>
              <span>24 Change </span>
            </div>

            {hotConins.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between px-2 tradeData"
              >
                <p className="d-flex gap-1">
                  <span>{index + 1}.</span>

                  <img alt="img" src={item.imagePath} width={30} height={30} />

                  {item.asset}
                </p>
                <span className="fw-bolder">{item.price}</span>
                <span
                  className={item.change < 0 ? "text_danger" : "text_suceess"}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          <div className=" tradeIndiv_container common_border_bg rounded-3 px-2">
            <div className="trading_header d-flex justify-content-between px-2 pt-2 ">
              <p className="fs-6 opacity-75">Top Gainers</p>
              <div className="dropdown_container">
                <DropdownButton
                  title={topCoin}
                  onSelect={(e) => setTopCoin(e)}
                  id="dropdown-trading"
                  // onSelect={(key) => {
                  //   setFilterOption(key);
                  //   getOpenOrderData(key, pairOption, sideOption);
                  // }}
                >
                  <Dropdown.Item eventKey="Crypto">Crypto</Dropdown.Item>
                  <Dropdown.Item eventKey="All Market">
                    All Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="USDT Market">
                    USDT Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BNB Market">
                    BNB Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BTC Market">
                    BTC Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="ETH Market">
                    ETH Market
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
            <div className="d-flex justify-content-between px-2 opacity-50">
              <span>Name </span>
              <span className="ps-5">Price </span>
              <span>24 Change </span>
            </div>
            {hotConins.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between px-2 tradeData"
              >
                <p className="d-flex gap-1">
                  <span>{index + 1}.</span>

                  <img alt="img" src={item.imagePath} width={30} height={30} />

                  {item.asset}
                </p>
                <span className="fw-bolder">{item.price}</span>
                <span
                  className={item.change < 0 ? "text_danger" : "text_suceess"}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          <div className="  tradeIndiv_container common_border_bg rounded-3 px-2">
            <div className="trading_header d-flex justify-content-between px-2 pt-2 ">
              <p className="fs-6 opacity-75 ">Top Losers</p>
              <div className="dropdown_container">
                <DropdownButton
                  title={topLosers}
                  onSelect={(e) => setTopLosers(e)}
                  id="dropdown-trading"
                  // onSelect={(key) => {
                  //   setFilterOption(key);
                  //   getOpenOrderData(key, pairOption, sideOption);
                  // }}
                >
                  <Dropdown.Item eventKey="Crypto">Crypto</Dropdown.Item>
                  <Dropdown.Item eventKey="All Market">
                    All Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="USDT Market">
                    USDT Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BNB Market">
                    BNB Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BTC Market">
                    BTC Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="ETH Market">
                    ETH Market
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
            <div className="d-flex justify-content-between px-2 opacity-50">
              <span>Name </span>
              <span className="ps-5">Price </span>
              <span>24 Change </span>
            </div>
            {hotConins.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between px-2 tradeData"
              >
                <p className="d-flex gap-1">
                  <span>{index + 1}.</span>

                  <img alt="img" src={item.imagePath} width={30} height={30} />

                  {item.asset}
                </p>
                <span className="fw-bolder">{item.price}</span>
                <span
                  className={item.change < 0 ? "text_danger" : "text_suceess"}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
          <div className="  tradeIndiv_container common_border_bg rounded-3 px-2">
            <div className="trading_header d-flex justify-content-between px-2 pt-2 ">
              <p className="fs-6 opacity-75">Top Volume</p>
              <div className="dropdown_container">
                <DropdownButton
                  title={topVolume}
                  onSelect={(e) => setTopVolume(e)}
                  id="dropdown-trading"
                  // onSelect={(key) => {
                  //   setFilterOption(key);
                  //   getOpenOrderData(key, pairOption, sideOption);
                  // }}
                >
                  <Dropdown.Item eventKey="Crypto">Crypto</Dropdown.Item>
                  <Dropdown.Item eventKey="All Market">
                    All Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="USDT Market">
                    USDT Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BNB Market">
                    BNB Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="BTC Market">
                    BTC Market
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="ETH Market">
                    ETH Market
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
            <div className="d-flex justify-content-between px-2 opacity-50">
              <span>Name </span>
              <span className="ps-5">Price </span>
              <span>24 Change </span>
            </div>
            {hotConins.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between px-2 tradeData"
              >
                <p className="d-flex gap-1">
                  <span>{index + 1}.</span>

                  <img alt="img" src={item.imagePath} width={30} height={30} />

                  {item.asset}
                </p>
                <span className="fw-bolder">{item.price}</span>
                <span
                  className={item.change < 0 ? "text_danger" : "text_suceess"}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>

          <div className="w-75   common_border_bg rounded-3 px-2 mt-4">
            <PriceChnageChart />
          </div>
          <div className="tradeIndiv_container   common_border_bg rounded-3 px-2 mt-4">
            <div className="trading_header d-flex justify-content-between px-2 pt-2 ">
              <p className="fs-6 opacity-75 ">Top Movers</p>
            </div>
            <div className="d-flex justify-content-between px-2 opacity-50">
              <div className="headerDiam">Name </div>
              <div className="ps-5">Price </div>
              <div className="headerDiam">24 Change </div>
            </div>
            {hotConins.map((item, index) => (
              <div
                key={index}
                className="d-flex justify-content-between px-2 tradeData"
              >
                <p className="d-flex gap-1">
                  <span>{index + 1}.</span>

                  <img alt="img" src={item.imagePath} width={30} height={30} />

                  {item.asset}
                </p>
                <span className="fw-bolder  text-start ">{item.price}</span>
                <span
                  className={item.change < 0 ? "text_danger" : "text_suceess"}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
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
      {/* sidebar container */}
      <SideBar activePage={"markets"} setToggle={setToggle} toggle={toggle} />

      <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="ps-4">
          <Topbar />
        </header>
        <div className="d-flex align-items-center">
          <h5
            className={` ms-5 ps-4 my-0 cursorPointer ${
              pageName === "marketPageView" ? "activeColor" : "text-white"
            }`}
            onClick={() => setPageName("marketPageView")}
          >
            Markets Overview
          </h5>
          <h5
            // className="text-white my-0 ps-3 cursorPointer"
            className={` my-0 ps-3 my-0 cursorPointer ${
              pageName === "tradingPageView" ? "activeColor" : "text-white"
            }`}
            onClick={() => setPageName("tradingPageView")}
          >
            Trading Data
          </h5>
        </div>
        {pageName === "marketPageView" && marketPageView()}
        {pageName === "tradingPageView" && tradingDataPageView()}
      </section>
    </div>
  );
};

export default Markets;
