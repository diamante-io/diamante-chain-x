import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { encryptedPayload } from "../commonComponent";
import { URI } from "../../constants";
import { useLocation } from "react-router";

import QrCode from "../../assets/qr-code (2) 1.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCustomerId } from "../../redux/actions";

const Verification = () => {
  const dispatcher = useDispatch();
  const { state } = useLocation();
  console.log(state);
  const [pageName, setPageName] = useState("twoFaPage");
  const [OTP, setOTP] = useState("");
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [loginIp, setLoginIp] = useState();
  const [qrCodeString, setQrCodeString] = useState("");

  const navigate = useNavigate();

  const { userContactNo } = useSelector((state) => state.ChangeState);

  const ipDetails = async () => {
    const response = await axios.get("https://ipwhois.app/json/");
    setLoginIp(response.data.ip);
  };

  const openModal = async () => {
    let encryptedRequestBody;
    await ipDetails();

    const requestBody = {
      // merchantId: "PAYC_MERC_106",
      accountTypeId: "1",
      accessTypeId: "2",
      accessId: 2,
      phoneNumber: state.contactNumber,
      customerCredential: state.userPassword,
      // assetId: 1,
      is2FaActivated: 1,
      ipAddress: loginIp,
      isCountryExchange: "1",
      countryCode: "US",
      phoneCode: "+1",
      ipPhoneCode: state.ipPhoneCode,
      ipCountryCode: state.ipCountryCode,
      // isMarketingComm: 0,
      email: state.userEmailId,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.signup, {
      encryptedRequestBody: encryptedRequestBody,
    });

    if (response.data.status === 200) {
      setQrCodeString(
        "otpauth://totp/" +
          "DiamExchange" +
          state.contactNumber +
          "?secret=" +
          state.twoFactorAuthKey
      );
    }
  };

  const twoWayOTPVerification = async () => {
    let encryptedRequestBody;
    const requestBody = {
      phoneNumber: state.contactNumber,
      verificationCode: OTP,
      countryCode: "US",
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.twowayauthotp, {
      encryptedRequestBody: encryptedRequestBody,
    });
    if (response.data.status === 200 || response.data.status === 201) {
      dispatcher(getCustomerId(response.data.data.customerId));

      // const headers = {
      //   Authorization:
      //     "Basic cGF5Y2lyY2xlLWluZGl2aWR1YWwtY2xpZW50OlB5Q3RvMzRMY2xlSkRu",
      // };

      // const req_body = {
      //   userName: response.data.data.customerId,
      //   deviceType: "Web",
      //   phoneNumber: userContactNo,
      //   countryCode: "US",
      //   password: password_value,
      // };
      // encryptedRequestBody = encryptedPayload(req_body);
      // const tokenResult = await axios.post(
      //   URI.getAuthToken,

      //   {
      //     encryptedRequestBody: encryptedRequestBody,
      //   },
      //   {
      //     headers: headers,
      //   }
      // );
      // sessionStorage.setItem("accessToken", tokenResult.data.data.token);
      // sessionStorage.setItem("user", response.data.data.customerId);
      // sessionStorage.setItem("pass", btoa(password_value));
      // sessionStorage.setItem("phoneNumber", userContactNo);
      // sessionStorage.setItem("countryCode", "US");
      // dispatcher(setAccessToken(tokenResult.data.data.token));
      // dispatcher(setExpireTime(tokenResult.data.expireInSeconds));

      // navigate("../kycqr", {
      //   state: {
      //     customerId: response.data.data.customerId,
      //     countryCode: state.countryCode,
      //     pageNumber: 1,
      //     docType: "",
      //   },
      // });
      navigate("../kycqr");
    } else {
      //  setOtpInvalid(true);
      setOTP("");
      setOtpErrorMsg(response.data.message);
      setTimeout(() => {
        setOtpErrorMsg("");
      }, 3000);
    }
  };

  useEffect(() => {
    ipDetails();
  }, []);

  useEffect(() => {
    if (loginIp) {
      openModal();
    }
  }, [loginIp]);

  useEffect(() => {
    if (OTP.length === 6) {
      twoWayOTPVerification();
    }
  }, [OTP]);

  const twoFaPage = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-around  pt-2 align-items-center h-100">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-center px-5">
            <h1 className="text-start">2FA</h1>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                {" "}
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                {" "}
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="TwofaRight_right_container container_bg_color  px-4  py-2 ">
          {/* <Signup /> */}
          <h5 className="text-start pt-1">
            Let’s enhance your security with 2FA
          </h5>
          <p className="text-start  opacity-75 pt-1 ">
            1. Download and install Google Authenticator
          </p>

          <p className="text-start  opacity-75 pt-2">
            2. Tap on plus button, select “Scan a QR Code”
          </p>

          <div className="qrCode_container pt-4  mx-auto mt-2">
            {/* <img
         src={QrCode}
          alt="Home Screen"
          // width="auto"
          // height="100%"
          style={{ borderRadius: "10px", position: "fixed" }}
        /> */}
            <div className="qrCode mx-auto">
              <QRCodeCanvas
                className="QRCodeForTwoFA"
                // value="https://www.google.co.in/"
                value={qrCodeString}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
                // imageSettings={{
                //   src: require("../../assets/paycircleQRLogo.png"),
                //   width: 45,
                //   excavate: true,
                //   height: 45,
                // }}
              />
            </div>
          </div>

          <div className="2fa input_container d-flex flex-column pt-3">
            <span className="text-start ms-1 pt-1 ">Enter 2FA PIN</span>
            <div className="otpContainer pt-1 pb-2">
              <OtpInput
                className="otp_input"
                value={OTP}
                onChange={setOTP}
                isInputNum={true}
                numInputs={6}
                focusStyle={{
                  outline: "none",
                }}
                inputStyle={{
                  marginTop: "1px",
                  marginRight: "1.5vw",
                  height: "3rem",
                  width: "3rem",
                  paddingBottom: "5px",
                  fontSize: "1rem",
                  alignItems: "center",
                  color: "white",
                  border: "1px solid  #4a4444",
                  backgroundColor: "#0a0a0a",
                  borderRadius: "5px",
                }}
                containerStyle={{
                  alignItems: "center",
                }}
              />
              <p
                style={{ color: "#F65A5A", textAlign: "left", fontSize: "1vw" }}
              >
                {otpErrorMsg}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  };

  const verifcationProcessmainPage = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-center pt-4 align-items-center h-100">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-center px-5">
            <h1>Let’s get you verified</h1>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                {" "}
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                {" "}
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="verificationProcess_right_container container_bg_color  px-4  py-4  ">
          {/* <Signup /> */}
          <div className="2fa_header_container ps-3">
            <h5 className="text-start pt-2 ">Verification Process</h5>
            <p className="text-start  opacity-75 pt-2  ">
              {" "}
              lorem lorem lorem lorem lorem lorem lorem lorem{" "}
            </p>

            <h5 className="text-start  opacity-75 pt-1 pb-1 ">Residency</h5>
            <div className="btn-group d-flex   w-50 ">
              <a
                className="btn text-white btn-sm dropdown-toggle searchbar py-2 "
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                INDIA
              </a>

              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="verifyProcesStep_container  pt-4 ">
            <p className="text-start ps-3">
              Follow these steps to complete the verification process.
            </p>
            <div className="d-flex gap-2 progressstep_main">
              <div className=" rounded-2 p-3 w-50">
                <div className="d-flex flex-column opacity-75">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="rounded-circle position-relative outer_circle">
                      <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                    </div>
                    <div>Document verification</div>
                  </div>
                  <div className="ms-2 vertical_line position-relative">
                    <span className="position-absolute arrow_icon_reward" />
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="rounded-circle position-relative outer_circle">
                      <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                    </div>
                    <div>Personal information</div>
                  </div>
                  <div className="ms-2 vertical_line position-relative">
                    <span className="position-absolute arrow_icon_reward" />
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="rounded-circle position-relative outer_circle">
                      <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                    </div>
                    <div>Address information</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="btn_container text-start mt-4 pt-4 ps-3">
              <button
                type="button"
                className="btn btn-primary px-4 py-2 w-50"
                onClick={() => setPageName("twoFaPage")}
                // onClick={() => setMode("verification")}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <>
      <div className="signUp_main_Container d-flex flex-column ">
        <header className="signup_header_container justify-content-between  d-flex   mx-3 my-2  ">
          <div></div>

          <div>
            <marquee
              behavior="scroll"
              direction="left"
              onmouseover="this.stop();"
              onmouseout="this.start();"
              height="20"
              width="1000"
            >
              <div className="liveAsset_status_container  d-flex  container_bg_color">
                <div className="individual_liveAsset_container d-flex justify-content-evenly align-items-center ">
                  <span className="opacity-75">AAVE/BTC</span>
                  <span className="text_suceess">-10.20%</span>
                  <span className="opacity-75">0.473</span>
                </div>

                <div className="individual_liveAsset_container d-flex justify-content-evenly align-items-center">
                  <span className="opacity-75">AAVE/BTC</span>
                  <span className="text_danger">-10.20%</span>
                  <span className="opacity-75">0.473</span>
                </div>

                <div className="individual_liveAsset_container d-flex justify-content-evenly align-items-center">
                  <span className="opacity-75">AAVE/BTC</span>
                  <span className="text_suceess">-10.20%</span>
                  <span className="opacity-75">0.473</span>
                </div>
                <div className="individual_liveAsset_container d-flex justify-content-evenly align-items-center ">
                  <span className="opacity-75">AAVE/BTC</span>
                  <span className="text_danger">-10.20%</span>
                  <span className="opacity-75">0.473</span>
                </div>
                <div className="individual_liveAsset_container d-flex justify-content-evenly align-items-center">
                  <span className="opacity-75">AAVE/BTC</span>
                  <span className="text_suceess">-10.20%</span>
                  <span className="opacity-75">0.473</span>
                </div>
              </div>
            </marquee>
          </div>

          <div className="login_register_container d-flex gap-1">
            <div className="icon_container d-flex gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 40 40"
                fill="none"
              >
                <g filter="url(#filter0_bii_326_438)">
                  <circle
                    cx="20"
                    cy="20"
                    r="20"
                    fill="white"
                    fill-opacity="0.04"
                  />
                </g>
                <path
                  d="M25 20C25 22.7614 22.7614 25 20 25C17.2386 25 15 22.7614 15 20C15 17.2386 17.2386 15 20 15C22.7614 15 25 17.2386 25 20Z"
                  stroke="white"
                  stroke-width="1.5"
                />
                <path
                  d="M20 10V11.5M20 28.5V30M27.0708 27.0713L26.0101 26.0106M13.9893 13.9893L12.9286 12.9286M30 20H28.5M11.5 20H10M27.0713 12.9287L26.0106 13.9894M13.9897 26.0107L12.9291 27.0714"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <defs>
                  <filter
                    id="filter0_bii_326_438"
                    x="-5.27863"
                    y="-5.27863"
                    width="50.5573"
                    height="50.5573"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur
                      in="BackgroundImageFix"
                      stdDeviation="2.63932"
                    />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_326_438"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_326_438"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="3.43111" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect2_innerShadow_326_438"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="0.791795" />
                    <feGaussianBlur stdDeviation="0.395898" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.16 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect2_innerShadow_326_438"
                      result="effect3_innerShadow_326_438"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </header>
        <div className="horizontal_line_recent"></div>

        {/* {pageName === "verification" && verifcationProcessmainPage()} */}
        {pageName === "twoFaPage" && twoFaPage()}
      </div>
    </>
  );
};

export default Verification;
