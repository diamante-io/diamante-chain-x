import React from "react";
import "../../stylesheets/commonstyle.css";
import loaderIcon from "../../assets/loaderMobile.gif";
import Lottie from "react-lottie";
import exhangeOptions from "../../assets/lotties/exchangeLoader.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: exhangeOptions,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Loader() {
  return (
    // <div className="mx-auto border-0">
    //   <Lottie options={defaultOptions} height={100} width={100} />
    // </div>
    <div className="d-flex justify-content-center">
      <img
        src={loaderIcon}
        alt="loader"
        width={180}
        className="border-0 my-0 py-0"
      />
    </div>
  );
}
