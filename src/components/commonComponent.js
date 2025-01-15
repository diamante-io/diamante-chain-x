import * as CryptoJS from "crypto-js";
import ALGO from "../assets/crypto/ALGO.png";
import BNB from "../assets/crypto/BNB.png";
import BTC from "../assets/crypto/BTC.png";
import DIAM from "../assets/crypto/DIAM.png";
import DOGE from "../assets/crypto/DOGE.png";
import FLRNS from "../assets/crypto/FLRNS.png";
import LTC from "../assets/crypto/LTC.png";
import USDT from "../assets/crypto/USDT.png";
export function encryptedPayload(requestBody) {
  let encryptedRequestBody;
  const requestBodyString = JSON.stringify(requestBody);
  encryptedRequestBody = CryptoJS.AES.encrypt(
    requestBodyString,
    "PayIndivalKey022"
  ).toString();
  return encryptedRequestBody;
}

export function emailValidation(emailId) {
  if (!emailId || emailId === "") return false;
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (regex.test(emailId) === false) return false;
  return true;
}

export const __customBcColor = (__isFocused, __isSelected) => {
  if (__isFocused) {
    return "#282c42";
  } else {
    if (__isSelected) {
      return "#12141e";
    } else {
      return "#12141e";
    }
  }
};

export function getAmt(__assName, __amount) {
  if (__assName === "USDT") {
    return __amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return __amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }
}

export function formatNumber(number) {
  const numberString = number === undefined || null ? 0 : number?.toString();

  // Check if there are more than 8 digits after the decimal point
  const hasMoreThan8Digits = /\.\d{9,}/.test(numberString);

  if (hasMoreThan8Digits) {
    // If more than 8 digits, apply parseFloat and toFixed
    const formattedNumber = parseFloat(numberString).toFixed(8);
    return formattedNumber;
  } else {
    // If 8 or fewer digits, return the original number
    return number;
  }
}

export function applyPrecision(number, precision) {
  number = Number(number || 0);
  if (Number.isInteger(number)) {
    return number;
  }
  return parseFloat(number.toFixed(precision));
}

export const condition = (cond, arg1, arg2) => {
  return cond ? arg1 : arg2;
};

export const customerStatus = (Orderstatus) => {
  if (Orderstatus?.toLowerCase() === "filled") {
    return "Filled";
  } else if (Orderstatus?.toLowerCase() === "partially filled") {
    return "Partially Filled";
  } else if (Orderstatus?.toLowerCase() === "cancel") {
    return "Cancel";
  } else {
    return "Rejected";
  }
};

export const assetSymbolImage = (assetSymbol) => {
  if (assetSymbol === "USDT") {
    return <img src={USDT} height={40} width={40} alt="icon" />;
  } else if (assetSymbol === "ETH") {
    return (
      <img
        src={
          "https://pcl-asset-img.s3.us-west-1.amazonaws.com/WalletDetailsAssetIcon/ETH.png"
        }
        height={40}
        width={40}
        alt="icon"
      />
    );
  } else if (assetSymbol === "BTC") {
    return <img src={BTC} height={40} width={40} alt="icon" className="mt-1" />;
  } else {
    return <img src={LTC} height={40} width={40} alt="icon" />;
  }
};

export const createLabelValue = (label, value, side) => {
  return (
    <div className="d-flex justify-content-between px-2 py-1" key={label}>
      <span>{label}</span>
      <span
        className={
          side === "BUY" ? "text_suceess" : side === "SELL" ? "text_danger" : ""
        }
      >
        {value}
      </span>
    </div>
  );
};

export const assetImageMappings = (name) => {
  return `https://diam-exchange-assets.s3.ap-south-1.amazonaws.com/assets/${name}.png`;
};
