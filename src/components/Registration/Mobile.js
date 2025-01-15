import React, { useState, useEffect } from "react";
import "./mobile.css";
import { emailValidation, encryptedPayload } from "../commonComponent";
import refresh_loader from "../../assets/refresh_loader.svg";
import axios from "axios";
import OtpInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { browserName } from "react-device-detect";
import info from "../../assets/info.svg";
import assetIcon from "../../assets/asset.svg";
import assetIcon2 from "../../assets/asset2.svg";
import assetIcon3 from "../../assets/asset3.svg";
import assetIcon4 from "../../assets/assset4.svg";
import assetIcon5 from "../../assets/asset5.svg";
import asset32Icon from "../../assets/32coinIcon.svg";
import { URI } from "../../constants";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import infoImage from "../../assets/Information.svg";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  getCustomerId,
  setCustomerInfo,
  setEmail,
  setPassword,
  setReferralCode,
  setTwoFAValue,
  setUserContact,
} from "../../redux/actions";
import { useDispatch } from "react-redux";
import usFlag from "../../assets/usflag.svg";

const eyeClose = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
  >
    <g clip-path="url(#clip0_326_768)">
      <path
        d="M10.5 3.9375C6.125 3.9375 2.38875 6.65875 0.875 10.5C2.38875 14.3412 6.125 17.0625 10.5 17.0625C14.8794 17.0625 18.6112 14.3412 20.125 10.5C18.6112 6.65875 14.8794 3.9375 10.5 3.9375ZM10.5 14.875C8.085 14.875 6.125 12.915 6.125 10.5C6.125 8.085 8.085 6.125 10.5 6.125C12.915 6.125 14.875 8.085 14.875 10.5C14.875 12.915 12.915 14.875 10.5 14.875ZM10.5 7.875C9.05188 7.875 7.875 9.05188 7.875 10.5C7.875 11.9481 9.05188 13.125 10.5 13.125C11.9481 13.125 13.125 11.9481 13.125 10.5C13.125 9.05188 11.9481 7.875 10.5 7.875Z"
        fill="#F5F5F5"
        fill-opacity="0.8"
      />
      <line
        x1="17.2953"
        y1="3.2938"
        x2="1.89527"
        y2="18.6938"
        stroke="#F5F5F5"
        stroke-opacity="0.8"
        stroke-width="1.4"
      />
    </g>
    <defs>
      <clipPath id="clip0_326_768">
        <rect width="21" height="21" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const eyeOpen = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    viewBox="0 0 21 15"
    fill="none"
  >
    <path
      d="M10.5 0.9375C6.125 0.9375 2.38875 3.65875 0.875 7.5C2.38875 11.3412 6.125 14.0625 10.5 14.0625C14.8794 14.0625 18.6112 11.3412 20.125 7.5C18.6112 3.65875 14.8794 0.9375 10.5 0.9375ZM10.5 11.875C8.085 11.875 6.125 9.915 6.125 7.5C6.125 5.085 8.085 3.125 10.5 3.125C12.915 3.125 14.875 5.085 14.875 7.5C14.875 9.915 12.915 11.875 10.5 11.875ZM10.5 4.875C9.05188 4.875 7.875 6.05188 7.875 7.5C7.875 8.94812 9.05188 10.125 10.5 10.125C11.9481 10.125 13.125 8.94812 13.125 7.5C13.125 6.05188 11.9481 4.875 10.5 4.875Z"
      fill="#F5F5F5"
      fill-opacity="0.8"
    />
  </svg>
);

const SignIn = ({ setMode }) => {
  const [page, setPageName] = useState("signin");
  const [mobileNum, setMobileNum] = useState();
  const [emailId, setEmailId] = useState();
  const [btnLoader, setBtnLoader] = useState();
  const [OTP, setOTP] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpInvalidMessage, setOTPInvalidMessage] = useState("");
  const [otpBtnLoader, setOtpBtnLoader] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [loginIp, setLoginIp] = useState();
  const [ipType, setIpType] = useState();
  const [region, setRegion] = useState();
  const [city, setCity] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [timezone, setTimezone] = useState();
  const [ipPhoneCode, setIpPhoneCode] = useState();
  const [ipCountryCode, setIpCountryCode] = useState();
  const [Msg, setMsg] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [eblResendBtn, setEblResendBtn] = useState(false);

  const [passField, setPassField] = useState(true);
  const [isTwoFactor, setIsTwoFactor] = useState(0);
  const [mobileNumberValue, setMobileNumberValue] = useState("");
  const [forgetOTP, setForgetOTP] = useState("");
  const [mobileNumber, setMobileNumber] = useState();
  const [passwordValue, setPasswordValue] = useState("");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [signinBtnLoader, setSigninBtnLoader] = useState(false);
  const [invalidCredText, setinvalidCredText] = useState("");
  const [otpValid, setOtpInvalid] = useState();
  const [secondBtnLoader, setSecondBtnLoader] = useState(false);

  let navigate = useNavigate();
  const dispatcher = useDispatch();

  const { handleSubmit, trigger } = useForm();

  const signIn2FA = async () => {
    let encryptedRequestBody;
    if (OTP.length === 6) {
      setSigninBtnLoader(true);
      const requestBody2FA = {
        phoneNumber: mobileNum,
        // mobileNo: mobileNum,
        customerCredential: passwordValue,
        verificationCode: OTP,
        countryCode: "US",
      };
      encryptedRequestBody = encryptedPayload(requestBody2FA);
      const response2FA = await axios.post(URI.signIn2fa, {
        encryptedRequestBody: encryptedRequestBody,
      });
      if (response2FA.data.status === 200) {
        // navigate("../dashboard");
        // dispatcher(setEmail(emailId));

        setOtpInvalid(false);
        dispatcher(getCustomerId(response2FA.data.data.customerId));

        const headers = {
          Authorization:
            "Basic cGF5Y2lyY2xlLWluZGl2aWR1YWwtY2xpZW50OlB5Q3RvMzRMY2xlSkRu",
        };

        const req_body = {
          userName: response2FA.data.data.customerId,
          deviceType: "Web",
          phoneNumber: mobileNum,
          countryCode: "US",
          password: passwordValue,
        };
        // encryptedRequestBody = encryptedPayload(req_body);

        const tokenResult = await axios.post(
          URI.getAuthToken,
          req_body,
          // {
          //   encryptedRequestBody: encryptedRequestBody,
          // },

          {
            headers: headers,
          }
        );

        sessionStorage.setItem("accessToken", tokenResult.data.data.token);
        sessionStorage.setItem("user", response2FA.data.data.customerId);
        sessionStorage.setItem("pass", btoa(passwordValue));
        sessionStorage.setItem("phoneNumber", mobileNum);
        sessionStorage.setItem("countryCode", "US");

        const res = await axios.get(
          URI.getCustomerDetails + response2FA.data.data.customerId,
          {
            headers: {
              Authorization: `Bearer ${tokenResult.data.data.token}`,
            },
          }
        );
        if (res.data.data.customerInfo.customerDocStatusId === 0) {
          navigate("../kycqr", {
            state: {
              customerId: response2FA.data.data.customerId,
              countryCode: "US",
              pageNumber: 1,
              docType: "",
            },
          });
        } else if (
          res.data.data.customerInfo.customerKycStatusId === 0 &&
          res.data.data.customerInfo.customerDocStatusId === 1
        ) {
          navigate("../kycqr", {
            state: {
              customerId: response2FA.data.data.customerId,
              countryCode: "US",
              // pageNumber: 2,
              pageNumber: 3,
              docType: res.data.data.customerKycInfo.customerDocType,
            },
          });
        } else {
          dispatcher(setCustomerInfo(res.data.data.customerInfo));
          dispatcher(setReferralCode(res.data.data.customerInfo.referalCode));
          dispatcher(setEmail(res.data.data.customerInfo.custEmail));
          navigate("../profiledashboard", {
            state: {
              customerId: response2FA.data.data.customerId,
              countryCode: "US",
              kybStatus: response2FA.data.data.customerKybStatusId,
            },
          });
        }
      } else {
        setSigninBtnLoader(false);
        setMsg(response2FA.data.message);
        setTimeout(() => {
          setMsg("");
        }, 3000);
      }
    }
  };

  const signInFunction = async () => {
    let encryptedRequestBody;
    if (passwordValue !== "") {
      setSigninBtnLoader(true);

      const requestBody = {
        phoneNumber: mobileNum,
        customerCredential: passwordValue,
        loginIp: loginIp,
        ipType: ipType,
        countryCode: "US",
        region: region,
        city: city,
        latitude: latitude,
        longitude: longitude,
        timezone: timezone,
        phoneCode: "+1",
        ipPhoneCode: ipPhoneCode,
        ipCountryCode: ipCountryCode,
        browserName: browserName,
        deviceType: "Web",
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      const response = await axios.post(URI.signIn, {
        encryptedRequestBody: encryptedRequestBody,
      });
      if (response.data.status === 200 || response.data.status === 201) {
        if (response.data.data.isSessionEnable === 0) {
          setIsSessionActive(false);
          if (response.data.data.isTwoFactor === 1) {
            setIsTwoFactor(response.data.data.isTwoFactor);
            dispatcher(setTwoFAValue(response.data.data.isTwoFactor));
            setSigninBtnLoader(false);
          } else {
            const headers = {
              Authorization:
                "Basic cGF5Y2lyY2xlLWluZGl2aWR1YWwtY2xpZW50OlB5Q3RvMzRMY2xlSkRu",
            };

            const req_body = {
              userName: response.data.data.customerId,
              deviceType: "Web",
              phoneNumber: mobileNum,
              countryCode: "US",
              password: passwordValue,
            };

            // encryptedRequestBody = encryptedPayload(req_body);

            await axios
              .post(
                URI.getAuthToken,
                req_body,

                // {
                //   encryptedRequestBody: encryptedRequestBody,
                // },
                {
                  headers: headers,
                }
              )

              .then(async (__tokenResult) => {
                if (__tokenResult.data.status === 200) {
                  sessionStorage.setItem(
                    "accessToken",
                    __tokenResult.data.data.token
                  );
                  sessionStorage.setItem("user", response.data.data.customerId);
                  sessionStorage.setItem("pass", btoa(passwordValue));

                  sessionStorage.setItem("phoneNumber", mobileNum);
                  sessionStorage.setItem("countryCode", "US");
                  dispatcher(setUserContact(parseInt(mobileNum)));
                  dispatcher(getCustomerId(response.data.data.customerId));

                  const res = await axios.get(
                    URI.getCustomerDetails + response.data.data.customerId,
                    {
                      headers: {
                        Authorization: `Bearer ${__tokenResult.data.data.token}`,
                      },
                    }
                  );

                  if (res.data.data.customerInfo.customerDocStatusId === 0) {
                    setSigninBtnLoader(false);
                    navigate("../kycqr", {
                      state: {
                        customerId: response.data.data.customerId,
                        countryCode: "US",
                        pageNumber: 1,
                        docType: "",
                      },
                    });
                  } else if (
                    res.data.data.customerInfo.customerKycStatusId === 0 &&
                    res.data.data.customerInfo.customerDocStatusId === 1
                  ) {
                    setSigninBtnLoader(false);
                    navigate("../kycqr", {
                      state: {
                        customerId: response.data.data.customerId,
                        countryCode: "US",
                        pageNumber: 3,
                        // pageNumber: 3,
                        docType: res.data.data.customerKycInfo.customerDocType,
                      },
                    });
                  } else {
                    setSigninBtnLoader(false);
                    dispatcher(setCustomerInfo(res.data.data.customerInfo));
                    dispatcher(setUserContact(parseInt(mobileNum)));
                    dispatcher(
                      setReferralCode(res.data.data.customerInfo.referralCode)
                    );

                    dispatcher(setEmail(res.data.data.customerInfo.custEmail));
                    navigate("../profiledashboard", {
                      state: {
                        customerId: response.data.data.customerId,
                        countryCode: "US",
                        // kybStatus: result.data.data.customerKybStatusId,
                      },
                    });
                  }
                }
              })

              .catch((err) => {
                setSigninBtnLoader(false);
                // setMsg("Something went wrong. Please try after sometimes.");
                setTimeout(() => {
                  // setMsg("");
                }, 3000);
              });
          }
        } else {
          setIsSessionActive(true);
          setSigninBtnLoader(false);
        }
      } else {
        setinvalidCredText(response.data.message);
        setTimeout(() => {
          setinvalidCredText("");
        }, 3000);
        setSigninBtnLoader(false);
      }

      // }
    }
  };

  const continueSignIn = async () => {
    let encryptedRequestBody;
    if (passwordValue !== "") {
      setSigninBtnLoader(true);
      const requestBody = {
        phoneNumber: mobileNum,
        customerCredential: passwordValue,
        loginIp: loginIp,
        ipType: ipType,
        countryCode: "US",
        region: region,
        city: city,
        latitude: latitude,
        longitude: longitude,
        timezone: timezone,
        phoneCode: "+1",
        ipPhoneCode: ipPhoneCode,
        ipCountryCode: ipCountryCode,
        browserName: browserName,
        deviceType: "Web",
        isSessionContinue: 1,
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      const response = await axios.post(URI.signIn, {
        encryptedRequestBody: encryptedRequestBody,
      });
      if (response.data.status === 200 || response.data.status === 201) {
        setIsSessionActive(false);
        // setOtpInvalid(false);
        // setInvalidCred(false);
        // setCheckSigninPwd(true);
        dispatcher(getCustomerId(response.data.data.customerId));
        dispatcher(setUserContact(mobileNum));

        // dispatcher(
        //   setCountryCode('US')
        // );
        // dispatcher(setPhoneCode(countryDialCode.substring(1)));
        // dispatcher(setTwoFactorState(response.data.data.isTwoFactor));

        if (response.data.data.isTwoFactor === 1) {
          setIsTwoFactor(response.data.data.isTwoFactor);
          setSigninBtnLoader(false);
          dispatcher(setTwoFAValue(response.data.data.isTwoFactor));
        } else {
          const headers = {
            Authorization:
              "Basic cGF5Y2lyY2xlLWluZGl2aWR1YWwtY2xpZW50OlB5Q3RvMzRMY2xlSkRu",
          };

          const req_body = {
            userName: response.data.data.customerId,
            deviceType: "Web",
            phoneNumber: mobileNum,
            countryCode: "US",
            password: passwordValue,
          };

          // encryptedRequestBody = encryptedPayload(req_body);
          await axios
            .post(URI.getAuthToken, req_body, {
              headers: headers,
            })

            .then(async (__tokenResult) => {
              if (__tokenResult.status === 200) {
                sessionStorage.setItem(
                  "accessToken",
                  __tokenResult.data.data.token
                );
                sessionStorage.setItem("user", response.data.data.customerId);
                sessionStorage.setItem("pass", btoa(passwordValue));
                sessionStorage.setItem("phoneNumber", mobileNum);
                sessionStorage.setItem("countryCode", "US");
                dispatcher(setUserContact(parseInt(mobileNum)));

                const res = await axios.get(
                  URI.getCustomerDetails + response.data.data.customerId,
                  {
                    headers: {
                      Authorization: `Bearer ${__tokenResult.data.data.token}`,
                    },
                  }
                );

                if (res.data.data.customerInfo.customerDocStatusId === 0) {
                  navigate("../kycqr", {
                    state: {
                      customerId: response.data.data.customerId,
                      countryCode: "US",
                      pageNumber: 1,
                      docType: "",
                    },
                  });
                } else if (
                  res.data.data.customerInfo.customerKycStatusId === 0 &&
                  res.data.data.customerInfo.customerDocStatusId === 1
                ) {
                  navigate("../kycqr", {
                    state: {
                      customerId: response.data.data.customerId,
                      countryCode: "US",
                      pageNumber: 3,
                      // pageNumber: 3,
                      docType: res.data.data.customerKycInfo.customerDocType,
                    },
                  });
                } else {
                  dispatcher(setCustomerInfo(res.data.data.customerInfo));
                  dispatcher(setUserContact(parseInt(mobileNum)));
                  dispatcher(
                    setReferralCode(res.data.data.customerInfo.referralCode)
                  );

                  dispatcher(setEmail(res.data.data.customerInfo.custEmail));
                  navigate("../profiledashboard", {
                    state: {
                      customerId: response.data.data.customerId,
                      countryCode: "US",
                      // kybStatus: result.data.data.customerKybStatusId,
                    },
                  });
                }
              }
            })

            .catch((err) => {
              setSigninBtnLoader(false);
              // setMsg("Something went wrong. Please try after sometimes.");
              setTimeout(() => {
                // setMsg("");
              }, 3000);
            });
        }
      } else {
        // setOtpInvalid(true);
        // setinvalidCredText(response.data.message);
        setSigninBtnLoader(false);
        // setInvalidCred(true);
      }
      // }
    }
  };

  const __signInBtn = async () => {
    if (isTwoFactor === 1) {
      signIn2FA();
    } else {
      signInFunction();
    }
  };

  const __setPassword = (e) => {
    setPasswordValue(e.target.value);
  };

  const __signInButton = () => {
    return (
      <div className="d-flex justify-content-center">
        {/* {passwordValue !== "" && mobileNum !== "" ? ( */}

        <button
          type="submit"
          className="btn btn-primary  signUp_cont"
          onClick={__signInBtn}
          disabled={
            passwordValue.length > 7 &&
            !signinBtnLoader &&
            mobileNum.length === 10
              ? false
              : true
          }
        >
          {signinBtnLoader ? (
            <img
              src={refresh_loader}
              style={{ width: 20 }}
              className="spinner"
              alt=""
            />
          ) : null}
          Continue
        </button>

        {/* ) : (
          <button
            type="submit"
            className="btn btn-primary  signUp_cont"
          >
            Continue
          </button>
        )} */}
      </div>
    );
  };

  const __2faView = () => {
    if (isTwoFactor === 1) {
      return (
        <div className="2faView_container d-flex flex-column">
          <span className="text-start pt-2">Enter 2FA PIN</span>
          <OtpInput
            value={OTP}
            onChange={setOTP}
            numInputs={6}
            className="otp_input"
            isInputNum={true}
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
        </div>
      );
    }
  };

  const sessionExpire = () => {
    return (
      <div className="sessionExpire">
        <Modal
          show={isSessionActive}
          className="numberModal sessionModal d-flex justify-content-center"
          aria-labelledby="example-custom-modal-styling-title"
          size="md"
          id="sessionModal"
        >
          <Modal.Body className="ModalBody ">
            <div
              className="modalUS row justify-content-center"
              style={{ margin: "0", gap: "10px", paddingBottom: "10px" }}
            >
              <h5 className="text-white opacity-75">
                {" "}
                Your last session was terminated incorrectly or is currently
                active.
              </h5>
              <h5 className="text-white opacity-75">
                Click on "Proceed" to continue here?
              </h5>

              <div className="d-flex justify-content-evenly pb-2 pt-3">
                <button
                  className="btn btn-secondary btn-sm px-3 py-2 text-white "
                  onClick={() => {
                    setIsSessionActive(false);
                    setMobileNum("");
                    setPasswordValue("");
                    setMsg("");
                    setinvalidCredText("");
                    setPassField(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm px-3 w-25"
                  onClick={continueSignIn}
                  disabled={signinBtnLoader}
                >
                  Proceed
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  };

  const __SignInMainPageView = () => {
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };

    const checkMobileExist = async (__value) => {
      let encryptedRequestBody;
      setBtnLoader(true);
      const requestBody = {
        phoneNumber: __value,
        countryCode: "US",
        accessId: 2,
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      const response = await axios.post(URI.mobileExistenceCheck, {
        encryptedRequestBody: encryptedRequestBody,
      });
      // if (response.data.status === 200) {
      //   if (response.data.data.isRegistered === false) {
      //     dispatcher(setUserContact(parseInt(__value)));
      //     setViewMode("registration");
      //   } else if (
      //     response.data.data.isCred === 0 &&
      //     response.data.data.registeredType === "Mobile"
      //   ) {
      //   } else {
      //     setPassField(true);
      //   }
      // }
      if (response.data.status === 200 || response.data.status === 201) {
        if (response.data.data.isRegistered === false) {
          dispatcher(setUserContact(parseInt(__value)));
          setBtnLoader(false);
          // setPageName("registration");
        } else if (
          response.data.data.isCred === 0 &&
          response.data.data.registeredType === "Mobile"
        ) {
          const request_Body = {
            phoneNumber: __value,
            flagValue: 1,
            countryCode: "US",
            countryPhone: "+1",
            type: "Reset_Password_OTP",
          };
          encryptedRequestBody = encryptedPayload(request_Body);
          const res = await axios.post(URI.mobileVerificationReset, {
            encryptedRequestBody: encryptedRequestBody,
          });
          if (res.data.status === 200 || res.data.status === 201) {
            setMobileNumberValue(__value);
            dispatcher(setUserContact(parseInt(__value)));
            // setPageName("forgetPasswordEnterNewPassword");
            setForgetOTP("");
            setSeconds(60);
            setBtnLoader(false);
          }
        } else {
          setPassField(true);
        }
      } else {
        setMsg(response.data.message);
        setTimeout(() => {
          setMsg("");
          setBtnLoader(false);
        }, 4000);
      }
    };

    const checkMobileValidation = async (e) => {
      // setEmailId("");
      trigger("mobileNumber");
      setMobileNum(e.target.value);
      setIsTwoFactor(0);
      // dispatcher(setTwoFAValue(0));
      // setPassField(false);
      // setPageName("initial");
      const re = /^[0-9\b]+$/;
      if (e.target.value.length === 10 && re.test(e.target.value)) {
        // setMobileBorderColor("registerInputsRegistrationValid");
        checkMobileExist(e.target.value);
      }
      // else if (e.target.value.length === 0) {
      // } else {
      // }
    };

    return (
      <div className="signIn_form_container d-flex flex-column justify-content-between container_bg_color px-2 py-4 rounded-2">
        <div className="sign_upForm_container d-flex  flex-column px-3">
          <h5 className="text-start  opacity-75">Sign In</h5>
          <p className="opacity-75 d-flex text-start">
            Simply enter your mobile number & email address to login or create
            an account.
          </p>

          <form>
            <div className="d-flex gap-2">
              <div className=" d-flex justify-content-center align-items-center  px-3 inputBgColor rounded-2">
                <span className="">
                  <img src={usFlag} alt="img" height={17} width={20} />
                </span>
                <span className="opacity-75 ps-2 pt-1"> US +1 </span>
              </div>
              <input
                className="inputField_onboarding"
                placeholder="Mobile number"
                style={{ width: "72%", border: "1.5px solid #2a2a2a" }}
                autoComplete="off"
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                minLength={10}
                maxLength={10}
                onChange={checkMobileValidation}
                //  value={mobileNum.replace(/[^0-9\s]/gi, "")}
                value={mobileNum}
              />
            </div>

            <div className="password_container py-3 position-relative">
              <div className="inputPassSection ">
                <input
                  className="inputField_onboarding  w-100 pe-5"
                  placeholder="Enter your password "
                  type={passwordShown ? "text" : "password"}
                  onChange={(e) => __setPassword(e)}
                  autoComplete="off"
                  onPaste={(event) => event.preventDefault()}
                  onCopy={(event) => event.preventDefault()}
                />
                <span className="position-absolute end-0 pt-2 pe-2 cursorPointer">
                  <i onClick={togglePasswordVisiblity} className="eyePwd">
                    {passwordShown ? eyeOpen : eyeClose}
                  </i>
                </span>
              </div>
            </div>

            {/* 
            <div className="newPasswordField" style={{ lineHeight: "0.5px" }}>
            <p className="confirmPasswordSubTitle">
              <span>Confirm password</span>{" "}
            </p>
            <div className="inputSectionPassword">
              <input
                className="passWord"
                type={confirmPasswordShown ? "text" : "password"}
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                // onChange={(e) => __enableButton(e)}
                value={userConfirmPassword}
                required
              />
              <i onClick={toggleConfirmPasswordVisiblity} className="eyePwd">
                <img
                  src={confirmPasswordShown ? eyeOpen : eyeClose}
                  style={{ width: "15px", height: "15px" }}
                  alt=""
                />
              </i>
            </div>
          </div> */}

            <div className="d-flex forgotPass_container w-100 justify-content-between">
              <span></span>
              <p
                className="forgotPassWordText cursor"
                onClick={() => setPageName("forgetPasswordEnterNumber")}
              >
                <span className="text-end activeColor ">
                  <u>Forgot Password </u>
                </span>
              </p>
            </div>

            <div>{__2faView()}</div>
            <div className="w-100 d-flex text_danger">{invalidCredText}</div>

            {Msg ? (
              <div
                className="opacity-100 d-flex text_danger w-100"
                // style={{ fontSize: "1vw", width: "70%", color: "red" }}
              >
                {Msg}
              </div>
            ) : null}
          </form>
        </div>
        <div className="btn_container">
          {__signInButton()}
          <div>{isSessionActive ? sessionExpire() : null}</div>

          <div className="d-flex justify-content-center  pt-3 gap-1">
            <span>New to CHAIN XCHANGE? </span>{" "}
            <span
              className="activeColor cursor"
              onClick={() => {
                setMode("signup");
              }}
            >
              <u> Sign up </u>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const checkMobileValidationForForgetPassword = async (e) => {
    trigger("mobileNumber");
    setMobileNumberValue(e.target.value);
    // if (e.target.value.length === 10) {
    //   setEnableBtn(true);
    // } else {
    //   setEnableBtn(false);
    // }
  };

  const onSubmitMobileVerify = async (data) => {
    setSecondBtnLoader(true);
    let encryptedRequestBody;
    const requestBody = {
      phoneNumber: mobileNumberValue,
      flagValue: 1,
      countryCode: "US",
      countryPhone: "+1",
      type: "Reset_Password_OTP",
    };

    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.mobileVerificationReset, {
      encryptedRequestBody: encryptedRequestBody,
    });
    if (response.data.status === 200 || response.data.status === 201) {
      // setMobileNumberValue(data.mobileNumber);
      setPageName("forgetPasswordEnterNewPassword");
      setSecondBtnLoader(false);
      // setMobileVerificationStatus(true);
      setSeconds(60);
    } else {
      setErrorMsg(response.data.message);
      setSecondBtnLoader(false);
      setTimeout(() => {
        setErrorMsg("");
      }, 2000);
      // setMobileVerificationStatus(false);
      // setErrorMessage(response.data.message);
      // setBtnLoader(false);
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const handleChangePassword = (e) => {
    setUserPassword(e.target.value);
    setUserConfirmPassword("");
  };

  const handleChangeConfirmPassword = (e) => {
    setUserConfirmPassword(e.target.value);
  };

  const onSubmitPasswordReset = async (data) => {
    let encryptedRequestBody;
    setSecondBtnLoader(true);
    if (
      userPassword === userConfirmPassword
      // &&
      // OTP.length === 6 &&
      // userPassword.match(
      //   /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,40}$/
      // )
    ) {
      const requestBody = {
        phoneNumber: mobileNumberValue,
        flagValue: 2,
        otp: forgetOTP,
        newPassword: userPassword,
        countryCode: "US",
        countryPhone: "+1",
      };

      encryptedRequestBody = encryptedPayload(requestBody);
      const response = await axios.post(URI.mobileVerificationReset, {
        encryptedRequestBody: encryptedRequestBody,
      });
      if (response.data.status === 200 || response.data.status === 201) {
        // setPageName("initial");
        NotificationManager.success("", response.data.message, 5000);

        setPageName("signin");
        setMobileNumberValue("");
        setMobileNum("");
        setMsg("");
        setinvalidCredText("");
        setPassField(false);
        setUserPassword("");
        setUserConfirmPassword("");
        setOTP("");
        // forgetOTP
        setForgetOTP(" ");
        setSecondBtnLoader(false);
      } else if (response.data.otp !== OTP) {
        if (response.data.status === 421) {
          // setPageName("initial");
        } else {
          // setShowErrorMsg(true);
          setOtpInvalid(true);
          setBtnLoader(false);
          setSecondBtnLoader(false);
          setForgetOTP("");
          setOTP("");
          // setPasswordResetErrorMsg(response.data.message);
          // setenableBtnSecond(false);
          // setDisabled(true);
          setErrorMsg(response.data.message);
          setTimeout(() => {
            setUserConfirmPassword("");
            setUserPassword("");
            setErrorMsg("");
          }, 2000);
        }
      }
    } else if (userPassword !== userConfirmPassword) {
      // setBtnLoader(false);
      setSecondBtnLoader(false);
    } else {
      setSecondBtnLoader(false);
    }
  };

  const resendOTP_OfResetPassword = async () => {
    let encryptedRequestBody;
    if (seconds === 0) {
      const requestBody = {
        phoneNumber: mobileNumberValue,
        flagValue: 1,
        countryCode: "US",
        countryPhone: "+1",
        type: "Reset_Password_OTP",
      };
      encryptedRequestBody = encryptedPayload(requestBody);

      const response = await axios.post(URI.mobileVerificationReset, {
        encryptedRequestBody: encryptedRequestBody,
      });
      if (response.data.status === 200 || response.data.status === 201) {
        // setOTP("");
        setForgetOTP("");
        setSeconds(60);
      }
    }
  };

  const forgotPasswordEnterNumberPage = () => {
    return (
      <div className="signIn_form_container  container_bg_color px-3 py-2  d-flex justify-content-between flex-column rounded-2">
        <div className="inputHeader_container pt-3">
          <span
            className=" d-flex text-start w-100 pt-2"
            onClick={() => setPageName("signin")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="18"
              viewBox="0 0 23 18"
              fill="none"
            >
              <path
                d="M22.0001 8.875H1.00014M1.00014 8.875L8.87514 1M1.00014 8.875L8.87514 16.75"
                stroke="#F5F5F5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <h5 className="text-start opacity-75 py-2 pt-3">
            Let's Recover your password
          </h5>
          <div className="d-flex flex-column gap-2 ">
            <div className="d-flex flex-column ">
              <div className="d-flex gap-2">
                <div className=" d-flex justify-content-center  align-items-center rounded-2 px-2 inputBgColor">
                  <span className="opacity-75">US +1</span>
                </div>
                <input
                  className="inputField"
                  type="text"
                  placeholder="Enter your mobile number"
                  style={{ width: "80%" }}
                  autoComplete="off"
                  onPaste={(event) => event.preventDefault()}
                  onCopy={(event) => event.preventDefault()}
                  minLength={10}
                  maxLength={10}
                  onChange={checkMobileValidationForForgetPassword}
                  value={mobileNumberValue.replace(/[^0-9\s]/gi, "")}
                  required
                />
              </div>
              <span className="text_danger">{errorMsg} </span>
            </div>
          </div>
        </div>

        <div className="btn_container mt-3 py-3 d-flex justify-content-center align-items-center flex-column">
          <button
            type="button"
            className="btn btn-primary  signUp_cont"
            onClick={handleSubmit(onSubmitMobileVerify)}
            disabled={mobileNumberValue.length !== 10 || secondBtnLoader}
          >
            {secondBtnLoader ? (
              <img
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
                alt=""
              />
            ) : null}
            Next
          </button>
          <div className="d-flex w-100 px-4 py-2 justify-content-center">
            <span
              className="activeColor cursor "
              onClick={() => setPageName("signin")}
            >
              <u>Sign In</u>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderTooltip = (props) => (
    <Tooltip
      {...props}
      // style={{
      //   width: "16%",
      //   position: "absolute",
      //   top: "11%",
      //   left: "18%",
      //   padding: "0px",
      //   cursor: "pointer",
      // }}
      className="toolTip"
    >
      {/* <div>
        Enter a combination of at least 8 numbers, lower &amp; uppercase
        letters, and special characters such as !@#$%^&#38;*.
      </div> */}

      <div className="d-flex flex-column ">
        <span>1. Enter a combination of at least 8 numbers.</span>
        <span>2. At least one lower & uppercase letters.</span>
        <span>3. Special characters such as !@#$%^&.</span>
      </div>
    </Tooltip>
  );

  const __forgetPasswordEnterNewPasswordPage = () => {
    return (
      <div className="signIn_form_container  container_bg_color px-3 py-2  d-flex flex-column rounded-2">
        <h5 className="text-start opacity-75 pb-2 pt-3">
          We have sent you a verification PIN on your email & mobile number.
        </h5>

        <form className="d-flex flex-column gap-2">
          {/* <div className="otpContainer">

            <OtpInput
              value={forgetOTP}
              onChange={(e) => {
                if (!isNaN(e) && e.charAt(0) !== " ") {
                  setForgetOTP(e);
                }
              }}
              numInputs={6}
              className="otp_input"
              isInputNum={true}
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
              autoComplete="new-password"
            />
          </div> */}
          <div className="otpContainer">
            <OtpInput
              value={forgetOTP}
              onChange={(e) => {
                if (!isNaN(e) && e.charAt(0) !== " ") {
                  setForgetOTP(e);
                }
              }}
              numInputs={6}
              className="otp_input"
              isInputNum={true}
              focusStyle={{
                outline: "none",
              }}
              inputStyle={{
                marginTop: "1px",
                marginRight: "1.5vw",
                height: "2.5rem",
                width: "2rem",
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
              autoComplete="new-password"
            />
          </div>
          <div className="d-flex resendOtp_container justify-content-end small">
            {seconds !== 0 ? (
              ""
            ) : (
              <span className=""> Didn't receive PIN? </span>
            )}
            <span
              className="resendLink cursor"
              onClick={resendOTP_OfResetPassword}
            >
              <u className="ps-1 activeColor">
                {seconds !== 0 ? ` Resend PIN in ${seconds} sec` : `Resend PIN`}
              </u>
            </span>
          </div>

          <label className="d-flex flex-start opacity-75 gap-2 ">
            {" "}
            Set a new Password
            {/* <span>
              <img src={info} alt="img" height={18} width={18} />
            </span> */}
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip}
              // containerPadding={220}
              // data-tip
              // data-for="registerTip"
              // as="span"
            >
              <a data-tip data-for="registerTip" className="signupTooltip">
                <img
                  // src={infoImage}
                  src={info}
                  alt="img"
                  height={18}
                  width={18}
                  // style={{ height: "15px", width: "15px" }}
                />
              </a>
            </OverlayTrigger>
          </label>
          <div className="otpContainer d-flex align-items-center  position-relative py-1">
            <input
              className="inputField w-100"
              type={passwordShown ? "text" : "password"}
              onPaste={(event) => event.preventDefault()}
              onCopy={(event) => event.preventDefault()}
              value={userPassword}
              onChange={handleChangePassword}
              required
              placeholder="New password"
              readOnly={forgetOTP.length !== 6}
              autoComplete="new-password"
            />
            <span className="position-absolute end-0 pb-1 pe-2 cursorPointer">
              <i onClick={togglePasswordVisiblity} className="eyePwd">
                {passwordShown ? eyeOpen : eyeClose}
              </i>
            </span>
          </div>
          <label className="d-flex flex-start opacity-75">
            {" "}
            Confirm password
          </label>
          <div className="otpContainer d-flex align-items-center  position-relative  py-1">
            <input
              className="inputField w-100"
              placeholder="Confirm password"
              type={confirmPasswordShown ? "text" : "password"}
              onPaste={(event) => event.preventDefault()}
              onCopy={(event) => event.preventDefault()}
              onChange={handleChangeConfirmPassword}
              // onChange={(e) => __enableButton(e)}
              value={userConfirmPassword}
              required
              autoComplete="off"
            />
            <span className="position-absolute end-0 pb-1 pe-2 cursorPointer">
              <i onClick={toggleConfirmPasswordVisiblity} className="eyePwd">
                {confirmPasswordShown ? eyeOpen : eyeClose}
              </i>
            </span>
          </div>

          <div className="text-danger small m" style={{ minHeight: "1.2rem" }}>
            {errorMsg}
          </div>

          <div className="btn_container pt-3 pb-2 d-flex justify-content-center flex-column align-items-center">
            <button
              type="button"
              className="btn btn-primary  signUp_cont "
              onClick={onSubmitPasswordReset}
              disabled={
                userPassword.length > 6 &&
                userConfirmPassword.length > 6 &&
                userConfirmPassword === userPassword &&
                forgetOTP.length === 6
                  ? false
                  : true || secondBtnLoader
              }
            >
              {secondBtnLoader ? (
                <img
                  src={refresh_loader}
                  style={{ width: 20 }}
                  className="spinner"
                  alt=""
                />
              ) : null}
              Continue
            </button>
            <div className="SignIn_button d-flex  justify-content-end  py-2">
              <span
                className="activeColor cursor"
                onClick={() => setPageName("signin")}
              >
                <u> Sign In</u>
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const resendOTP = async () => {
    let encryptedRequestBody;
    setEblResendBtn(true);
    if (seconds === 0) {
      setOTP("");
      // setSeconds(60);
      const requestBody = {
        cid: mobileNumber,
        flagValue: 1,
        countryCode: "US",
        countryPhone: "+1",
        type: "OTP_Registration",
        email: emailId,
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      await axios
        .post(URI.getotp, {
          encryptedRequestBody: encryptedRequestBody,
        })
        .then((response) => {
          if (response.data.status === 200 || response.data.status === 201) {
            setSeconds(60);
            setEblResendBtn(false);
          } else {
            setEblResendBtn(false);
          }
        });
    }
  };

  const __resendOtpBtn = () => {
    if (eblResendBtn) {
      return (
        <p
          className=""
          style={{ cursor: "pointer", fontSize: "0.8rem", marginTop: "0.5rem" }}
        >
          Resend PIN
        </p>
        // {/* <span>Didn't receive PIN? </span>
        //     <span className="activeColor cursor"><u>Resend PIN </u></span> */}
      );
    } else {
      return seconds === 0 ? (
        <span
          className="d-flex justify-content-end "
          style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}
        >
          Didn’t receive PIN?&nbsp;
          <u
            className="activeColor"
            style={{ cursor: "pointer" }}
            onClick={() => {
              resendOTP();
            }}
          >
            Resend PIN
          </u>
        </span>
      ) : (
        <span
          className="d-flex justify-content-end textColor"
          style={{ fontSize: "0.8rem", marginTop: "3%" }}
        >
          Resend PIN in {seconds} sec
        </span>
      );
    }
  };

  const otpView = () => {
    return (
      <>
        <div className="d-flex justify-content-between flex-column gap-5 container_bg_color">
          <div className="container_bg_color px-3 py-3 ">
            {/* <div className="sign_upForm_container px-3 "> */}
            <div className="otp_header_container ">
              <h5 className="text-start ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 23 18"
                  fill="none"
                >
                  <path
                    d="M22.0001 8.875H1.00014M1.00014 8.875L8.87514 1M1.00014 8.875L8.87514 16.75"
                    stroke="#F5F5F5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </h5>
              <h5 className="text-start  opacity-75">Sign Up</h5>
              <p className="opacity-75 d-flex text-start pt-2">
                We have sent you a verification PIN on your mobile & email
                address.
              </p>
            </div>

            <div className="  d-flex justify-content-between flex-column  ">
              <form>
                <div className="otpContainer">
                  <OtpInput
                    value={OTP}
                    onChange={setOTP}
                    numInputs={6}
                    isInputNum={true}
                    className="otp_input"
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
                </div>
                <div className="resend_container d-flex justify-content-end w-100 pt-2 gap-1">
                  {__resendOtpBtn()}
                </div>
              </form>
            </div>
          </div>
          <p
            style={{
              color: "red",
              textAlign: "left",
              fontSize: "1vw",
            }}
          >
            {otpInvalidMessage}
          </p>
          <div className="btn_container mt-5 pt-5 py-2 d-flex justify-content-center ">
            <button
              type="submit"
              className="btn btn-primary  signUp_cont"
              disabled={otpBtnLoader ? true : false}
              // onClick={() => setPageName("createPassword")}
              // onClick={redirectToPassword}
            >
              {btnLoader ? (
                <img
                  src={refresh_loader}
                  style={{ width: 20 }}
                  className="spinner"
                  alt=""
                />
              ) : null}
              Continue
            </button>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    const ipDetails = async () => {
      const response = await axios.get("https://ipwhois.app/json/");
      // setDefaultCountry(response.data.country_code);
      setLoginIp(response.data.ip);
      setIpType(response.data.type);
      setRegion(response.data.region);
      setCity(response.data.city);
      setLatitude(response.data.latitude);
      setLongitude(response.data.longitude);
      setTimezone(response.data.timezone);
      setIpPhoneCode(response.data.country_phone);
      setIpCountryCode(response.data.country_code);
    };

    ipDetails();
  }, []);

  return (
    <>
      {page === "signin" && __SignInMainPageView()}
      {page === "otpPage" && otpView()}
      {page === "forgetPasswordEnterNumber" && forgotPasswordEnterNumberPage()}
      {page === "forgetPasswordEnterNewPassword" &&
        __forgetPasswordEnterNewPasswordPage()}
    </>
  );
};

// ------------signPage end-------------------------------

const Signup = ({ setMode }) => {
  const [page, setPageName] = useState("signup");
  const [mobileNumber, setMobileNumber] = useState();
  const [emailId, setEmailId] = useState();
  const [emailExistMsg, setEmailExistMsg] = useState("");
  const [mobileExistMsg, setMobileExistMsg] = useState("");
  const [checkTerms, setcheckTerms] = useState(true);
  const [modalType, setModalType] = useState("");
  const [checkMarketing, setcheckMarketing] = useState(true);
  const [checkNotification, setcheckNotification] = useState(true);
  const [signupBtnLoader, setSignupBtnLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState();
  const [OTP, setOTP] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpInvalidMessage, setOTPInvalidMessage] = useState("");
  const [otpBtnLoader, setOtpBtnLoader] = useState(false);
  const [userPassword, setUserPassword] = useState();
  const [userConfirmPassword, setUserConfirmPassword] = useState();
  const [referal, setReferal] = useState("");
  const [passwordNotMatched, setPasswordNotMatched] = useState(false);

  const [Msg, setMsg] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [eblResendBtn, setEblResendBtn] = useState(false);
  const [loginIp, setLoginIp] = useState();
  const [ipType, setIpType] = useState();
  const [region, setRegion] = useState();
  const [city, setCity] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [timezone, setTimezone] = useState();
  const [ipPhoneCode, setIpPhoneCode] = useState();
  const [ipCountryCode, setIpCountryCode] = useState();
  const [mobileRegValue, setMobileRegValue] = useState();
  const [emailRegValue, setRegEmailValue] = useState();

  let navigate = useNavigate();
  const dispatcher = useDispatch();

  const { handleSubmit, trigger } = useForm();

  const checkMobileExist = async (__value) => {
    let encryptedRequestBody;
    setSignupBtnLoader(true);
    const requestBody = {
      phoneNumber: __value,
      countryCode: "US",
      accessId: 2,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.mobileExistenceCheck, {
      encryptedRequestBody: encryptedRequestBody,
    });

    if (response.data.status === 200) {
      setMobileRegValue(response.data.data.isRegistered);
      if (response.data.data.isRegistered === false) {
        setSignupBtnLoader(false);

        // setShowPatriotAct(true);
        // redirectToMobileOtp();
      } else {
        setMobileExistMsg(response.data.message);

        setTimeout(() => {
          setMobileExistMsg("");
        }, 3000);
        setSignupBtnLoader(false);
      }
    }
  };

  const __signUpBtn = async (data) => {
    setSignupBtnLoader(true);

    let encryptedRequestBody;
    const requestBody = {
      email: emailId,
    };
    encryptedRequestBody = encryptedPayload(requestBody);

    const response = await axios.post(URI.emailExistCheck, {
      encryptedRequestBody: encryptedRequestBody,
    });
    if (response.data.status === 200) {
      if (response.data.data.isRegistered === false) {
        setRegEmailValue(response.data.data.isRegistered);

        // setShowPatriotAct(true);
        redirectToMobileOtp();
      } else {
        setSignupBtnLoader(false);
        // setShowPatriotAct(false);
        setEmailExistMsg(response.data.message);
        setRegEmailValue(response.data.data.isRegistered);
        setTimeout(() => {
          setEmailExistMsg("");
        }, 3000);
      }
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const redirectToMobileOtp = async () => {
    setBtnLoader(true);
    let encryptedRequestBody;

    const requestBody = {
      cid: mobileNumber,
      flagValue: 1,
      countryCode: "US",
      countryPhone: "+1",
      type: "OTP_Registration",
      email: emailId,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.getotp, {
      encryptedRequestBody: encryptedRequestBody,
    });

    if (response.data.status === 200) {
      setOTP("");
      setSeconds(60);
      setPageName("otpPage");
      dispatcher(setEmail(emailId));
      setBtnLoader(false);
      // if (checkMarketing === true) {
      //   setMarketingVariable(1);
      // }
      // setBtnLoader(false);
      // setTimeout(
      //   () =>
      //     navigate("../mobileotp", {
      //       state: {
      //         userNumber: mobileNum,
      //         countryCode: selectedCountry ? selectedCountry : defaultCountry,
      //         countryDialCode: countryDialCode,
      //         isMarketingComm: marketingVariable,
      //         email: emailId,
      //       },
      //     }),
      //   100
      // );
    } else {
      setBtnLoader(false);
      setErrorMsg(response.data.message);
      setTimeout(() => {
        setErrorMsg("");
        // setShowPatriotAct(false);
      }, 3000);
    }
  };

  const __signupButton = () => {
    if (
      checkTerms &&
      checkNotification &&
      emailValidation(emailId) &&
      mobileRegValue === false &&
      mobileNumber.length === 10 &&
      mobileNumber !== " "
    ) {
      return (
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary  w-100 "
            onClick={__signUpBtn}
            disabled={signupBtnLoader}
          >
            {signupBtnLoader ? (
              <img
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
                alt=""
              />
            ) : null}{" "}
            Continue
          </button>
        </div>
      );
    } else {
      return (
        <div className="d-flex justify-content-center ">
          <button
            type="submit"
            className="btn btn-primary w-100 "
            disabled={true}
          >
            Continue
          </button>
        </div>
      );
    }
  };

  const __registrationPage = () => {
    const checkMobileValidation = async (e) => {
      setEmailId("");
      trigger("mobileNumber");
      // setMobileNumber(e.target.value);
      e.target.value.charAt(0) !== "." &&
        setMobileNumber(
          e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
        );
      // setPassField(false);
      // setViewMode("initial");
      const re = /^[0-9\b]+$/;
      if (e.target.value.length === 10 && re.test(e.target.value)) {
        // setMobileBorderColor("registerInputsRegistrationValid");
        checkMobileExist(e.target.value);
      }
    };

    return (
      <div className="signIn_form_container d-flex flex-column container_bg_color px-2 pt-3 rounded-2">
        <div className="sign_upForm_container d-flex  flex-column px-3 py-2">
          <h5 className="text-start  opacity-75">Sign Up</h5>
          <p className="opacity-75 d-flex text-start">
            Simply enter your mobile number & email address to login or create
            an account.
          </p>

          <form>
            <div className="d-flex gap-2">
              {/* <div className="btn-group d-flex justify-content-center align-items-center  px-2 inputBgColor">
                <span className="opacity-75 small"> US + 1 </span>
              </div> */}
              <div className=" d-flex justify-content-center align-items-center  px-3 inputBgColor rounded-2">
                <span className="">
                  <img src={usFlag} alt="img" height={17} width={20} />
                </span>
                <span className="opacity-75 ps-2 pt-1"> US +1 </span>
              </div>

              <input
                className="inputField "
                placeholder="Mobile number"
                style={{ width: "70%", marginLeft: "11px" }}
                autoComplete="off"
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                minLength={10}
                maxLength={10}
                onChange={checkMobileValidation}
                // value={mobileNumber.replace(/[^0-9\s]/gi, "")}
                value={
                  mobileNumber ? mobileNumber.replace(/[^0-9\s]/gi, "") : ""
                }

                // value={mobileNumber}
              />
            </div>
            <div className="emailId_container pt-3">
              <input
                className="inputField w-100"
                placeholder="Email ID"
                // value={emailId.replace(
                //   /[~`!#$%\^&*()+=_\-\[\]';,/{}|\\":<>\?]|([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                //   ""
                // )}
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                autoComplete="off"
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
              />
            </div>
            {mobileExistMsg !== "" && (
              <div className="d-flex text_danger px-2">{mobileExistMsg}</div>
            )}
            {emailExistMsg !== "" && (
              <div className="d-flex text_danger px-2">{emailExistMsg}</div>
            )}
            <div className="termsAndConditionSection d-flex flex-column opacity-75">
              <div className="d-flex gap-2">
                <input
                  type="checkbox"
                  checked={checkTerms}
                  onChange={(e) => setcheckTerms(!checkTerms)}
                />
                <p className="small_text pt-3">
                  I agree to&nbsp;
                  <span
                    className="cursor activeColor"
                    onClick={() => setModalType("privacy")}
                  >
                    <u>Privacy Policy </u>
                  </span>
                  &{" "}
                  <span
                    className="cursor activeColor"
                    onClick={() => setModalType("terms")}
                  >
                    {" "}
                    <u>Terms of Use.</u>
                  </span>{" "}
                  {/* &
                  <span
                    className="cursor activeColor"
                    onClick={() => setModalType("userAgreement")}
                  >
                    {" "}
                    <u>user agreement</u>
                  </span> */}
                </p>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="checkbox"
                  className=""
                  style={{ height: "30px" }}
                  onChange={(e) => setcheckMarketing(!checkMarketing)}
                  checked={checkMarketing}
                />
                <p className="small_text pt-1">
                  I agree to receive Marketing Communications from CHAIN
                  XCHANGE.
                </p>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="checkbox"
                  style={{ height: "30px" }}
                  onChange={(e) => setcheckNotification(!checkNotification)}
                  checked={checkNotification}
                />
                <p className="text-start small_text pt-1">
                  <span
                    className="cursor"
                    onClick={(e) => setcheckNotification(!checkNotification)}
                  >
                    CHAIN XCHANGE will send you the PIN, Transactional
                    Notifications & new service related updates via SMS. Please
                    click to opt-in.
                  </span>
                </p>
              </div>
            </div>
            <div className="btn_container signUp_btn_container pt-2">
              {__signupButton()}
            </div>
            <span className="text_danger d-flex justify-content-start pt-1 ps-4">
              {errorMsg}
            </span>
            <div className="d-flex justify-content-center ">
              <p className="pt-2 ">
                Already have an account?{" "}
                <u
                  className="activeColor cursor"
                  onClick={() => {
                    setMode("signin");
                  }}
                >
                  Sign In
                </u>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const redirectToPassword = async () => {
    let encryptedRequestBody;
    setOtpBtnLoader(true);
    setBtnLoader(true);
    const requestBody = {
      cid: mobileNumber,
      flagValue: 2,
      otp: OTP,
      countryCode: "US",
      countryPhone: "+1",
      email: emailId,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(URI.getotp, {
      encryptedRequestBody: encryptedRequestBody,
    });
    if (response.data.status === 200 || response.data.status === 201) {
      setPageName("createPassword");
      setOtpBtnLoader(false);
      setBtnLoader(false);
      setOTP("");
    } else {
      if (response.data.status === 421) {
        setTimeout(() => {
          navigate("../");
          setOTP("");
        }, 3000);
      }
      // setOtpInvalid(true);
      // setTimeout(() => {
      //   const D: any = document.querySelector(
      //     ".OTP-areaRegistration>div>div>input"
      //   );
      //   if (D) {
      //     D.focus();
      //   }
      // }, 100);

      setOTPInvalidMessage(response.data.message);
      setTimeout(() => {
        setOTPInvalidMessage("");
      }, 3000);
      setOtpBtnLoader(false);
      setBtnLoader(false);
    }
  };

  const handleChangePassword = (e) => {
    setUserPassword(e.target.value);
    setUserConfirmPassword("");
    // if (
    //   e.target.value.match(
    //     /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,40}$/
    //   ) != null
    // ) {
    //   setValidInputClass("mobilePwdStrengthValid");
    // } else {
    // }
  };

  const __enableButton = (e) => {
    setUserConfirmPassword(e.target.value);
    if (
      userPassword === e.target.value &&
      e.target.value.match(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,40}$/
      )
    ) {
      setPasswordNotMatched(false);
    } else {
      setPasswordNotMatched(true);
    }
  };

  const onSubmit = async (data) => {
    setBtnLoader(true);
    if (checkboxValue) {
      let encryptedRequestBody;

      // navigate("/enter2facode");
      const requestBody = {
        accountTypeId: "1",
        accessTypeId: "2",
        accessId: 2,
        phoneNumber: mobileNumber,
        customerCredential: userPassword,
        // assetId: 1,
        is2FaActivated: 1,
        ipAddress: loginIp,
        // isCountryChange: countryMatch ? "1" : "0",
        isCountryExchange: "1",
        countryCode: "US",
        phoneCode: "+1",
        ipPhoneCode: ipPhoneCode,
        ipCountryCode: ipCountryCode,
        // isMarketingComm: state.isMarketingComm,
        // isMarketingComm: 0,
        email: emailId,
        referalCode: referal,
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      const response = await axios.post(URI.signup, {
        encryptedRequestBody: encryptedRequestBody,
      });

      if (response.data.status === 200) {
        navigate("../enter2facode", {
          state: {
            contactNumber: mobileNumber,
            userEmailId: emailId,
            userPassword: userPassword,
            ipCountryCode: ipCountryCode,
            ipPhoneCode: ipPhoneCode,
            twoFactorAuthKey: response.data.data.twoFactorAuthKey,
          },
        });
        setBtnLoader(false);
      } else {
        setMsg(response.data.message);
        setTimeout(() => {
          setMsg("");
        }, 2000);
        setBtnLoader(false);
      }

      dispatcher(setPassword(userPassword));
    } else {
      let encryptedRequestBody;
      if (userPassword === userConfirmPassword && userPassword.length > 7) {
        const requestBody = {
          accountTypeId: "1",
          accessTypeId: "2",
          accessId: 2,
          phoneNumber: mobileNumber,
          customerCredential: userPassword,
          // assetId: 1,
          is2FaActivated: 0,
          ipAddress: loginIp,
          // isCountryChange: countryMatch ? "1" : "0",
          isCountryExchange: "1",
          countryCode: "US",
          phoneCode: "+1",
          ipPhoneCode: ipPhoneCode,
          ipCountryCode: ipCountryCode,
          // isMarketingComm: state.isMarketingComm,
          // isMarketingComm: 0,
          email: emailId,
          referalCode: referal,
        };
        encryptedRequestBody = encryptedPayload(requestBody);
        const response = await axios.post(URI.signup, {
          encryptedRequestBody: encryptedRequestBody,
        });
        if (response.data.status === 200) {
          dispatcher(getCustomerId(response.data.data.customerId));
          dispatcher(setUserContact(mobileNumber));

          const headers = {
            Authorization:
              "Basic cGF5Y2lyY2xlLWluZGl2aWR1YWwtY2xpZW50OlB5Q3RvMzRMY2xlSkRu",
          };

          const req_body = {
            userName: response.data.data.customerId,
            deviceType: "Web",
            phoneNumber: mobileNumber,
            countryCode: "US",
            password: userPassword,
          };
          // encryptedRequestBody = encryptedPayload(req_body);

          await axios
            .post(URI.getAuthToken, req_body, {
              headers: headers,
            })
            .then((_tokenResult) => {
              if (_tokenResult.status === 200) {
                sessionStorage.setItem(
                  "accessToken",
                  _tokenResult.data.data.token
                );

                const country_code = "US";
                sessionStorage.setItem("user", response.data.data.customerId);
                sessionStorage.setItem("pass", btoa(userPassword));
                sessionStorage.setItem("phoneNumber", mobileNumber);
                sessionStorage.setItem("countryCode", country_code);

                // dispatcher(setAccessToken(_tokenResult.data.data.token));
                // dispatcher(setExpireTime(_tokenResult.data.expireInSeconds));

                setBtnLoader(false);
                navigate("../kycqr", {
                  state: {
                    customerId: response.data.data.customerId,
                    countryCode: "US",
                    pageNumber: 1,
                    docType: "",
                  },
                });
              }
            })
            .catch((err) => {
              setBtnLoader(false);
              setMsg("Something went wrong. Please try after sometimes.");
            });
        } else {
          setMsg(response.data.message);
          setTimeout(() => {
            setMsg("");
          }, 3000);
          setBtnLoader(false);
        }
      } else {
        setBtnLoader(false);
        setPasswordNotMatched(true);
      }
    }
  };

  const resendOTP = async () => {
    let encryptedRequestBody;
    setEblResendBtn(true);
    if (seconds === 0) {
      setOTP("");
      // setSeconds(60);
      const requestBody = {
        cid: mobileNumber,
        flagValue: 1,
        countryCode: "US",
        countryPhone: "+1",
        type: "OTP_Registration",
        email: emailId,
      };
      encryptedRequestBody = encryptedPayload(requestBody);
      await axios
        .post(URI.getotp, {
          encryptedRequestBody: encryptedRequestBody,
        })
        .then((response) => {
          if (response.data.status === 200 || response.data.status === 201) {
            setSeconds(60);
            setEblResendBtn(false);
          } else {
            setEblResendBtn(false);
          }
        });
    }
  };

  const __resendOtpBtn = () => {
    if (eblResendBtn) {
      return (
        <p
          className=""
          style={{ cursor: "pointer", fontSize: "0.8rem", marginTop: "0.5rem" }}
        >
          Resend PIN
        </p>
        // {/* <span>Didn't receive PIN? </span>
        //     <span className="activeColor cursor"><u>Resend PIN </u></span> */}
      );
    } else {
      return seconds === 0 ? (
        <span
          className="d-flex justify-content-end "
          style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}
        >
          Didn’t receive PIN?&nbsp;
          <u
            className="activeColor"
            style={{ cursor: "pointer" }}
            onClick={() => {
              resendOTP();
            }}
          >
            Resend PIN
          </u>
        </span>
      ) : (
        <span
          className="d-flex justify-content-end textColor"
          style={{ fontSize: "0.8rem", marginTop: "3%" }}
        >
          Resend PIN in {seconds} sec
        </span>
      );
    }
  };

  const otpView = () => {
    return (
      <div className="signIn_form_container d-flex justify-content-between flex-column gap-5 container_bg_color">
        <div className="container_bg_color px-3 pb-2 pt-3">
          {/* <div className="sign_upForm_container px-3 "> */}
          <div className="otp_header_container ">
            <h5 className="text-start " onClick={() => setPageName("signup")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 23 18"
                fill="none"
              >
                <path
                  d="M22.0001 8.875H1.00014M1.00014 8.875L8.87514 1M1.00014 8.875L8.87514 16.75"
                  stroke="#F5F5F5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </h5>
            <h5 className="text-start  opacity-75">PIN Verification</h5>
            <p className="opacity-75 d-flex text-start pt-2">
              We have sent you a verification PIN on your mobile & email
              address.
            </p>
          </div>

          <div className="  d-flex justify-content-between flex-column">
            <form>
              <div className="otpContainer">
                {/* <input className="inputField w-100" placeholder="Enter OTP"
                
                
                /> */}
                <OtpInput
                  value={OTP}
                  onChange={setOTP}
                  numInputs={6}
                  isInputNum={true}
                  className="otp_input"
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
              </div>
              <div className="resend_container d-flex justify-content-end w-100 pt-2 gap-1">
                {__resendOtpBtn()}
              </div>
            </form>
            <div className="d-flex text_danger justify-content-center">
              {otpInvalidMessage}
            </div>
          </div>
        </div>

        <div className="btn_container py-5 d-flex justify-content-center ">
          <button
            type="submit"
            className="btn btn-primary  signUp_cont"
            disabled={otpBtnLoader || OTP.length !== 6}
            // onClick={() => setPageName("createPassword")}
            onClick={redirectToPassword}
          >
            {otpBtnLoader ? (
              <img
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
                alt=""
              />
            ) : null}
            Continue
          </button>
        </div>
      </div>
    );
  };

  const createPasswordBtn = () => {
    if (!passwordNotMatched && userPassword && userConfirmPassword) {
      return (
        <button
          type="button"
          className="btn btn-primary w-100  px-3"
          onClick={handleSubmit(onSubmit)}
          disabled={btnLoader}
        >
          {btnLoader ? (
            <img
              src={refresh_loader}
              style={{ width: 20 }}
              className="spinner"
              alt=""
            />
          ) : null}
          Create
        </button>
      );
    } else {
      return (
        <button type="button" className="btn btn-primary w-100 px-3" disabled>
          Create
        </button>
      );
    }
  };

  const changeStyleToggle = () => {
    setCheckboxValue(!checkboxValue);
  };

  const renderTooltip = (props) => (
    <Tooltip {...props} className="toolTip">
      <div>
        Enter a combination of at least 8 numbers, lower &amp; uppercase
        letters, and special characters such as !@#$%^&#38;*.
      </div>
    </Tooltip>
  );

  const createPasswordView = () => {
    return (
      <div className="createPassword_main_container container_bg_color px-3 py-2  d-flex flex-column">
        <h5 className="text-start opacity-75 py-2">Create your password</h5>
        <form className="d-flex flex-column gap-2">
          <label className="d-flex flex-start opacity-75">
            {" "}
            Set a new Password
            <OverlayTrigger
              placement="top"
              overlay={renderTooltip}
              // containerPadding={220}
              // data-tip
              // data-for="registerTip"
              // as="span"
            >
              <a data-tip data-for="registerTip" className="signupTooltip ps-2">
                <img
                  src={infoImage}
                  style={{ height: "15px", width: "15px" }}
                  alt=""
                />
              </a>
            </OverlayTrigger>
          </label>

          <div className="otpContainer d-flex align-items-center  py-1">
            <div className="inputPassSection position-relative">
              <input
                className="inputField_onboarding w-100"
                type={passwordShown ? "text" : "password"}
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                onChange={handleChangePassword}
                value={userPassword}
                required
                placeholder="New password"
              />
              <span className="position-absolute end-0 pt-2 pe-2 cursorPointer">
                <i onClick={togglePasswordVisiblity} className="eyePwd">
                  {passwordShown ? eyeOpen : eyeClose}
                </i>
              </span>
            </div>
          </div>
          <label className="d-flex flex-start opacity-75">
            {" "}
            Confirm password
          </label>
          <div className="otpContainer d-flex align-items-center py-1">
            <div className="inputPassSection position-relative">
              <input
                className="inputField_onboarding w-100"
                placeholder="Confirm password"
                type={confirmPasswordShown ? "text" : "password"}
                onPaste={(event) => event.preventDefault()}
                onCopy={(event) => event.preventDefault()}
                onChange={(e) => __enableButton(e)}
                value={userConfirmPassword}
                required
              />
              <span className="position-absolute end-0 pt-2 pe-2 cursorPointer">
                <i onClick={toggleConfirmPasswordVisiblity} className="eyePwd">
                  {confirmPasswordShown ? eyeOpen : eyeClose}
                </i>
              </span>
            </div>
          </div>
          <div className="otpContainer  ">
            <span className=" d-flex flex-start opacity-75 py-2">
              Referral code
            </span>

            <input
              className="inputField w-100"
              placeholder="referral code"
              type="text"
              onPaste={(event) => event.preventDefault()}
              onCopy={(event) => event.preventDefault()}
              onChange={(e) => setReferal(e.target.value.toUpperCase())}
              value={referal}
            />
          </div>
          <div className="d-flex text_danger justify-content-start">{Msg}</div>

          <div className="2fa_container d-flex  py-1 ">
            <input
              className="labelClass "
              type="checkbox"
              onChange={changeStyleToggle}
              checked={checkboxValue}
              onPaste={(event) => event.preventDefault()}
              onCopy={(event) => event.preventDefault()}
            />
            <div onClick={changeStyleToggle}>
              <label
                style={{
                  color: checkboxValue ? "#236dff" : "",
                }}
                className="px-2 cursor fs-6 opacity-75"
              >
                Enable two factor authentication
              </label>
            </div>
          </div>

          <div className="btn_container  twofaBtn mt-2 py-2">
            {createPasswordBtn()}
          </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    const ipDetails = async () => {
      const response = await axios.get("https://ipwhois.app/json/");
      // setDefaultCountry(response.data.country_code);
      setLoginIp(response.data.ip);
      setIpType(response.data.type);
      setRegion(response.data.region);
      setCity(response.data.city);
      setLatitude(response.data.latitude);
      setLongitude(response.data.longitude);
      setTimezone(response.data.timezone);
      setIpPhoneCode(response.data.country_phone);
      setIpCountryCode(response.data.country_code);
    };

    ipDetails();
  }, []);

  return (
    <>
      {page === "signup" && __registrationPage()}
      {page === "otpPage" && otpView()}
      {page === "createPassword" && createPasswordView()}
    </>
  );
};

const Mobile = () => {
  const { state } = useLocation();
  const [mode, setMode] = useState("");
  const [loginIp, setLoginIp] = useState();
  const [ipType, setIpType] = useState();
  const [region, setRegion] = useState();
  const [city, setCity] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [timezone, setTimezone] = useState();
  const [ipPhoneCode, setIpPhoneCode] = useState();
  const [ipCountryCode, setIpCountryCode] = useState();

  useEffect(() => {
    setMode(state?.pageName);
  }, [state]);

  useEffect(() => {
    window.sessionStorage.clear();
  }, []);

  // useEffect(() => {
  //   console.log("one")
  //   const ipDetails = async () => {
  //     const response = await axios.get("https://ipwhois.app/json/");
  //     // setDefaultCountry(response.data.country_code);
  //     setLoginIp(response.data.ip);
  //     setIpType(response.data.type);
  //     setRegion(response.data.region);
  //     setCity(response.data.city);
  //     setLatitude(response.data.latitude);
  //     setLongitude(response.data.longitude);
  //     setTimezone(response.data.timezone);
  //     setIpPhoneCode(response.data.country_phone);
  //     setIpCountryCode(response.data.country_code);
  //   };

  //   ipDetails();
  // }, []);

  return (
    <div className="signUp_main_Container d-flex flex-column ">
      <header className="signup_header_container justify-content-between  d-flex   mx-3 my-2  ">
        <div></div>

        {/* <div>
          <marquee
            behavior="scroll"
            direction="left"
            onmouseover="this.stop();"
            onmouseout="this.start();"
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
        </div> */}

        {/* <div className="login_register_container d-flex gap-1">
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
        </div> */}
      </header>
      {/* <div className="horizontal_line_recent"></div> */}

      <main className="content_signupForm_container d-flex gap-2  justify-content-center pt-2 align-items-center h-100">
        <div className=" d-flex flex-column  " style={{ width: "55vw" }}>
          <div className=" d-flex   justify-content-center align-items-center ">
            <div className="d-flex justify-content-start w-100">
              <h1 className="ps-4">Welcome to CHAIN XCHANGE</h1>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-start pt-2 text-start">
            <p className="mb-0 fs-5 ps-4">
              Empowering your crypto journey with seamless trades,
            </p>
            <p className="mb-0 fs-5 ps-4">
              real-time analytics, and unparalleled security.
            </p>
          </div>
          <div className="asset_icon_container ps-3 d-flex justify-content-start  gap-2 mt-3">
            <span>
              <img src={assetIcon} alt="img" height={40} width={40} />
            </span>
            <span>
              {" "}
              <img src={assetIcon2} alt="img" height={40} width={40} />
            </span>
            <span>
              {" "}
              <img src={assetIcon3} alt="img" height={40} width={40} />
            </span>
            <span>
              {" "}
              <img src={assetIcon4} alt="img" height={40} width={40} />
            </span>
            <span>
              {" "}
              <img src={assetIcon5} alt="img" height={40} width={40} />
            </span>
            <span>
              {" "}
              <img src={asset32Icon} alt="img" height={40} width={40} />
            </span>
            {/* <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 51 51"
                  fill="none"
                >
                  <g filter="url(#filter0_bii_326_495)">
                    <circle
                      cx="25.2646"
                      cy="25.2646"
                      r="25.2646"
                      fill="white"
                      fill-opacity="0.04"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_bii_326_495"
                      x="-6.66813"
                      y="-6.66813"
                      width="63.8656"
                      height="63.8656"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="3.33406"
                      />
                      <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_326_495"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_326_495"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="4.33428" />
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
                        result="effect2_innerShadow_326_495"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="1.00022" />
                      <feGaussianBlur stdDeviation="0.50011" />
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
                        in2="effect2_innerShadow_326_495"
                        result="effect3_innerShadow_326_495"
                      />
                    </filter>
                  </defs>
                </svg>
              </span> */}
          </div>
        </div>

        <div className="Signup_form_main">
          {
            // state === null ||
            // state.pageName === "signin" ||

            // mode === "signin" ? (
            //   <SignIn setMode={setMode} mode={mode} />
            // ) : (
            //   <>{<Signup setMode={setMode} />}</>
            // )

            mode === "signup" ? (
              <Signup
                setMode={setMode}
                loginIp={loginIp}
                ipType={ipType}
                region={region}
                city={city}
                latitude={latitude}
                longitude={longitude}
                timezone={timezone}
                ipPhoneCode={ipPhoneCode}
                ipCountryCode={ipCountryCode}
              />
            ) : (
              <>
                {" "}
                <SignIn
                  setMode={setMode}
                  mode={mode}
                  //  city={city} latitude={latitude} longitude={longitude} timezone={timezone}

                  //  ipPhoneCode={ipPhoneCode} ipCountryCode={ipCountryCode}
                />
              </>
            )
          }
        </div>
      </main>
      <NotificationContainer />
    </div>
  );
};

export default Mobile;
