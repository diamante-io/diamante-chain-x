import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Store, { persistor } from "../src/redux/store";

import { PersistGate } from "redux-persist/integration/react";
import Dashboard from "./components/Dashboard/Dashboard";
import Mobile from "./components/Registration/Mobile";
import Verification from "./components/Registration/Verification";
import KycQr from "./components/Registration/KycQr";
import ProfileDashboard from "./Screens/ProfileDashboard/ProfileDashboard";
import ReferAndEarn from "./Screens/ReferAndEarn/ReferAndEarn";
import Spot from "./components/Spot/Spot";
import BuySellCrypto from "./components/BuySellCrypto/BuySellCrypto";
import AllNotification from "./components/AllNotification/AllNotification";
import SpotOrder from "./components/SpotOrder/SpotOrder";
import "react-datepicker/dist/react-datepicker.css";
import Markets from "./Screens/Markets/Markets";
import PrivateRoute from "./utils/PrivateRoute";
import SpotAsset from "./components/Assets/Spot/SpotAsset";
import FundingAsset from "./components/Assets/Funding/Funding";
import OrderBook from "./components/Dashboard/OrderBook";
import ConvertHistory from "./components/ConvertHistory/ConvertHistory";
import Deposit from "./components/Deposit/Deposit";
import SpotWithdraw from "./components/Assets/Spot/SpotWithdraw";
import Settings from "./Screens/Settings/Settings";
import Support from "./Screens/Support/Support";
function App() {
  return (
    <div className="App">
      {/* <Home /> */}
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/allnotification" element={<AllNotification />} />
                <Route path="/spotorders" element={<SpotOrder />} />
              </Route>
              <Route path="/spot-withdraw" element={<SpotWithdraw />}></Route>
              <Route path="/spotAssets" element={<SpotAsset />}></Route>
              <Route path="/" element={<Mobile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orderbook" element={<OrderBook />} />
              <Route path="/fundingAsset" element={<FundingAsset />} />
              <Route path="/convertHistory" element={<ConvertHistory />} />
              <Route path="/enter2facode" element={<Verification />} />
              <Route path="/kycqr" element={<KycQr />} />
              <Route path="/profiledashboard" element={<ProfileDashboard />} />
              <Route path="/refer" element={<ReferAndEarn />} />
              <Route path="/detailorders" element={<Spot />} />
              <Route path="/buysell" element={<BuySellCrypto />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}
export default App;
