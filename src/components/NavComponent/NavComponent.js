import React from "react";
import { setDashboardNavigation } from "../../redux/actions";
import { useDispatch } from "react-redux";
// import diamLogo from "../../assets/Diamex logo white 1.svg";
import diamLogo from "../../assets/chain xchange new.svg";
const NavComponent = () => {
  const dispatcher = useDispatch();

  return (
    <div>
      <div className="d-flex gap-4 align-items-center">
        {![
          "/detailorders",
          "/refer",
          "/spotorders",
          "/profileDashboard",
          "/profiledashboard",
          "/spotAssets",
          "/fundingAsset",
          "/convertHistory",
          "/buysell",
          "/settings",
          "/support",
        ].includes(window.location.pathname) ? (
          // <h4 className="my-0">DIAMex</h4>
          <span>
            <img src={diamLogo} alt="img" height={40} width={120} />
          </span>
        ) : null}

        <div className="d-flex gap-3">
          <a
            href="/buysell"
            className="navigate_link text-decoration-none  fs-5"
            onClick={() => dispatcher(setDashboardNavigation(true))}
          >
            Buy Crypto
          </a>
          <a
            href="/markets"
            className="navigate_link text-decoration-none  fs-5"
            onClick={() => dispatcher(setDashboardNavigation(true))}
          >
            Markets
          </a>
          <a
            href="/dashboard"
            className="navigate_link text-decoration-none  fs-5"
            onClick={() => dispatcher(setDashboardNavigation(true))}
          >
            Spot
          </a>
          <a
            href="/refer"
            className="navigate_link text-decoration-none  fs-5"
            onClick={() => dispatcher(setDashboardNavigation(true))}
          >
            Refer & Earn
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavComponent;
