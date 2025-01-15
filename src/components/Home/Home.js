import React, { useState } from "react";
import "../home.css";
import TradeViewChart from "react-crypto-chart";
import CharPage from "./CharPage";
// import TradingViewChart from "../TradingViewChart/TradingView";

function getLocalLanguage() {
  return navigator.language.split("-")[0] || "en";
}

let Options = {
  locale: getLocalLanguage(),
  debug: false,
  fullscreen: false,
  symbol: "BTCUSDT",
  interval: "60",
  theme: "light",
  allow_symbol_change: true,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  autosize: true,
};

const assetData = [
  {
    logNmae: "",
    assetName: "",
    assetvalue: 1.2,
    assetAmount: 8675,
    volume: "",
    buyPrice: "",
    sellPrice: "",
    OrderVolume: "",
    Time: "",
    assetINR: "",
    assetWRX: "",
    assetBTC: "",
  },
];

for (let i = 2; i <= 11; i++) {
  assetData.push({
    logName: "t" + i,
    assetName: "USDT",
    assetINR: "INR",
    assetValue: 1.2 * i,
    assetAmount: 8675 + i * 100,
    volume: 0.67,
    buyPrice: 32300,
    sellPrice: 3400,
    OrderVolume: 0.1,
    Time: "16:41:27",
    assetWRX: "WRX",
    assetBTC: "BTC",
  });
}

const Home = () => {
  const [seletCurrency, setSelectCurrency] = useState("USDT");

  const data = [12, 18, 19, 16, 78, 13];
  const data1 = [36, 34, 21];

  for (let arr = 0; arr < data.length; arr++) {
    console.log(data[arr]);
  }

  return (
    <div className="dashboard_main_container w-100">
      <div className="header_main_container d-flex justify-content-between bg-primary ">
        <div className="left">one</div>
        <div className="right">two</div>
      </div>

      <section className="dashboard_allcontent_container d-flex justify-content-between">
        <div className="dashboard_sidebar_container border border-secondary h-100 w-25 px-2">
          <div className="sidebar_header d-flex flex-column gap-2 ">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>

            {/* <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="All Assets"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div> */}

            <select name={seletCurrency} id={seletCurrency}>
              <option value="INR">INR</option>
              <option value="USDT">USDT</option>
              <option value="WRX">WRX</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
          <hr />
          <div className="sidebar_data_container d-flex flex-column  ">
            <div className="d-flex justify-content-between">
              <span
                className={seletCurrency === "INR" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("INR")}
              >
                INR
              </span>
              <span
                className={seletCurrency === "USDT" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("USDT")}
              >
                USDT
              </span>
              <span
                className={seletCurrency === "WRX" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("WRX")}
              >
                WRX
              </span>
              <span
                className={seletCurrency === "BTC" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("BTC")}
              >
                BTC
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between text-secondary fs-6">
              <span>Pair</span>
              <span className="text-success">Vol</span>
              <span>Change</span>
            </div>
            <hr />
            {assetData.map((item) => {
              return (
                <div className="asset_data">
                  <div className="assetName_logo_container d-flex  justify-content-between">
                    <div className="asset_container d-flex gap-2">
                      <p className="logo">{item.logNmae}</p>

                      <div className="d-flex flex-column">
                        <span>
                          {seletCurrency === "INR"
                            ? item.assetINR
                            : item.assetName
                            ? seletCurrency === "BTC"
                              ? item.assetBTC
                              : item.assetWRX
                            : item.assetName}
                        </span>
                        <span className="text-danger">
                          -2{item.assetvalue}%
                        </span>
                      </div>
                    </div>
                    <div className="asset_amount">
                      <span className="fw-bolder">$ {item.assetAmount}</span>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
        <div className="dashboard_middle_container flex-column  w-50 border border-secondary ">
          <div className="graph_container border border-secondary pb-2">
            {/* <CharPage/> */}
            {/* <TradingViewChart chartProperties={Options} /> */}
          </div>
          <div className="graph_data_container d-flex   border border-secondary h-50">
            <div className="assetOrder_container d-flex  flex-column w-50">
              <div className="assetOrder_header d-flex flex-column ">
                <span className="text-start fw-bolder">ORDER BOOK</span>

                <div className="d-flex justify-content-between">
                  <span>MARK DEPTH</span>
                  <span>ORDER VOLUME</span>
                </div>
              </div>

              <div className="d-flex flex-column Order_main_container">
                <div
                  className="asset_Orderdata d-flex justify-content-between gap-2 fw-bolder "
                  style={{ fontSize: "12px" }}
                >
                  <span>VOLUME</span>
                  <span>BUY PRICE</span>
                  <span>SELL PRICE</span>
                  <span>VOLUME</span>
                </div>
                <div className="asset_Orderdata d-flex justify-content-between flex-column">
                  {assetData.map((item) => {
                    return (
                      <div className="d-flex justify-content-between">
                        <span>{item.volume}</span>
                        <span>{item.buyPrice}</span>
                        <span>{item.sellPrice}</span>
                        <span>{item.OrderVolume}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="tradeHistory_container_main_container d-flex flex-column border border-secondary px-2 "
              style={{ width: "40%", marginLeft: "2rem" }}
            >
              <div className="tradeHistory_container">
                <p className="tradeHistory_header text-start fw-bolder">
                  TRADE HISTORY
                </p>
              </div>
              <div
                className="tradeHistory_data_container d-flex justify-content-between fw-bolder"
                style={{ fontSize: "12px" }}
              >
                <span>PRICE</span>
                <span>VOLUME</span>
                <span> TIME</span>
              </div>
              {assetData.map((item) => {
                return (
                  <div className="d-flex justify-content-between">
                    <span>{item.buyPrice}</span>
                    <span>{item.volume}</span>

                    <span>{item.Time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="dashboard_right_container  d-flex gap-3 flex-column  px-2"
          style={{ width: "30%" }}
        >
          <div className="dashboard_right_top_container d-flex justify-content-center align-items-center border border-secondary ">
            <div className="button_container d-flex flex-column gap-2">
              <button type="button" class="btn  btn-success btn-lg">
                LOGIN
              </button>
              <span>OR</span>
              <button type="button" class="btn btn-outline-secondary  btn-lg">
                CREATE AN ACCOUNT
              </button>
            </div>
          </div>

          <div className="dashboard_right_bottom_container d-flex flex-column border border-secondary py-4">
            <div className="buysell_content_container  d-flex justify-content-evenly fw-bolder ">
              <p
                className={seletCurrency === "BUY" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("BUY")}
              >
                BUY
              </p>
              <p
                className={seletCurrency === "SELL" ? "selectCurrenncy" : ""}
                onClick={() => setSelectCurrency("SELL")}
              >
                SELL
              </p>
            </div>
            <div className="limitDropdown d-flex justify-content-end px-4 ">
              <h5>LIMIT</h5>
            </div>

            <div className="input_Main_container d-flex flex-column gap-3 px-2">
              <div class="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                  {/* <span className="input-group-text">0.00</span> */}
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>

              <div class="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                  {/* <span className="input-group-text">0.00</span> */}
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>

              <div class="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                  {/* <span className="input-group-text">0.00</span> */}
                </div>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
              <div className="">
                <button type="button" class="btn  btn-success btn-lg">
                  Large button
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
