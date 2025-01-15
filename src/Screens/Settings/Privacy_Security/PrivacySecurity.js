import React, { useEffect, useState } from "react";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { URI } from "../../../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { QRCodeCanvas } from "qrcode.react";
import OtpInput from "react-otp-input";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import refresh_loader from "../../../assets/refresh_loader.svg";
import { encryptedPayload } from "../../../components/commonComponent";
import QRMobileDesign from "../../../assets/QR_Mobile_design.png";
import { FaArrowRight } from "react-icons/fa";
import loader from "../../../assets/loaderMobile.gif";
import { setTwoFAValue } from "../../../redux/actions";

const removeIcon = <FontAwesomeIcon icon={faXmark} width="20" />;
const eye = <FontAwesomeIcon icon={faEye} />;
const slashEye = <FontAwesomeIcon icon={faEyeSlash} />;

// Main component
const PrivacySecurity = () => {
  const { customerId, userContactNo, twoFAValue } = useSelector(
    (state) => state.ChangeState
  );
  const dispatcher = useDispatch();

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const [modalShowPassword, setModalShowPassword] = useState(false);
  const [loginDetails, setLoginDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [twoFacModal, setTwoFacModal] = useState(false);
  const [OTP, setOTP] = useState("");
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [showmodel, setShowmodel] = useState(false);
  let navigate = useNavigate();

  const [activeSession, setActiveSession] = useState({
    browser: "",
    country: "",
    ipType: "",
    recentActivity: "",
    IpAddress: "",
    deviceType: "",
  });
  const [qrCodeString, setQrCodeString] = useState("");

  // Component to change the password
  const [otpField, setOtpField] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState("");
  const [successMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [isOldPasswordStrong, setIsOldPasswordStrong] = useState(false);
  const [isNewPasswordStrong, setIsNewPasswordStrong] = useState(false);
  const [isCPasswordStrong, setIsCPasswordStrong] = useState(false);
  const [oldPswrd, setOldPswrd] = useState("");
  const [newPswrd, setNewPswrd] = useState("");
  const [confirmPswrd, setConfirmPswrd] = useState("");
  const [eblResendBtn, setEblResendBtn] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [PassOtpInvalid, setPassOtpInvalid] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [btnEnable, setBtnEnable] = useState(false);

  const resendOTP = async () => {
    let encryptedRequestBody;
    setEblResendBtn(true);
    const requestBody = {
      customerId: customerId,
      oldPassword: oldPswrd,
      newPassword: newPswrd,
      phoneNumber: userContactNo,
      flagValue: 1,
      countryCode: "US",
      countryPhone: "+1",
    };

    encryptedRequestBody = encryptedPayload(requestBody);

    const response = await axios.post(
      URI.changePassword,
      {
        encryptedRequestBody: encryptedRequestBody,
      },
      {
        headers: headers,
      }
    );

    if (response.data.status === 200 || response.data.status === 201) {
      setSeconds(60);
      setOtpField(true);
      setEblResendBtn(false);
    } else {
      setErrorMsg(response.data.message);
      setOtpField(false);
      setEblResendBtn(false);
    }
  };

  const postToChangePassword = async () => {
    if (oldPswrd === newPswrd) {
      setErrorMsg("Old Password & New Password can't be same!");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
    } else {
      let encryptedRequestBody;
      setDisableBtn(true);
      const requestBody = {
        customerId: customerId,
        oldPassword: oldPswrd,
        newPassword: newPswrd,
        phoneNumber: userContactNo,
        flagValue: 1,
        countryCode: "US",
        countryPhone: "+1",
      };
      encryptedRequestBody = encryptedPayload(requestBody);

      const response = await axios.post(
        URI.changePassword,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      );

      if (response.data.status === 200 || response.data.status === 201) {
        setDisableBtn(false);
        setErrorMsg("");
        setOtpField(true);
        setIsResendActive(true);
      } else {
        setDisableBtn(false);
        setErrorMsg(response.data.message);
        setOtpField(false);
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      }
    }
  };

  const postToSubmitPassword = async () => {
    setBtnEnable(true);
    let encryptedRequestBody;
    setDisableBtn(true);
    const requestBody = {
      customerId: customerId,
      oldPassword: oldPswrd,
      newPassword: newPswrd,
      phoneNumber: userContactNo,
      flagValue: 2,
      countryCode: "US",
      countryPhone: "+1",
      otp: passwordOtp,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(
      URI.changePassword,
      {
        encryptedRequestBody: encryptedRequestBody,
      },
      {
        headers: headers,
      }
    );

    if (response.data.status === 200 || response.data.status === 201) {
      setDisableBtn(false);
      setShowmodel(true);
      setTimeout(() => {
        __onLogOut();
      }, 3000);
      setModalShowPassword(false);
    } else {
      setDisableBtn(false);
      setErrorMsg(response.data.message);
      setOtpField(true);
      setPassOtpInvalid(true);
      setTimeout(() => {
        setBtnEnable(false);
        setModalShowPassword(false);
        setOtpField(false);
        setPasswordOtp("");
        setNewPswrd("");
        setOldPswrd("");
        setConfirmPswrd("");
        setErrorMsg("");
        setPassOtpInvalid(false);
        setShowPasswordConfirm(false);
        setShowPasswordNew(false);
        setShowPasswordOld(false);
        setNewPswrd("");
        setOldPswrd("");
      }, 2000);
    }
  };

  React.useEffect(() => {
    let myInterval = null;
    if (isResendActive) {
      myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          clearInterval(myInterval);
        }
      }, 1000);
    } else if (!isResendActive && seconds !== 0) {
      clearInterval(myInterval);
    }
    return () => clearInterval(myInterval);
  }, [isResendActive, seconds]);

  let strongPswrd =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*.])[a-zA-Z0-9!@#$%^&*.]{8,40}$/;

  const eblResendBtnText = () => {
    if (eblResendBtn) {
      return <p className="activeColor small px-2">Resend PIN</p>;
    } else {
      return condition(
        seconds === 0,
        <p className=" small px-2">
          <span className="text-white">Didn’t receive PIN?</span>
          <span onClick={resendOTP} className="activeColor ps-1 cursorPointer">
            Resend PIN
          </span>
        </p>,
        <p className="activeColor small px-2">
          Resend PIN<span> in {seconds} sec </span>
        </p>
      );
    }
  };

  const resetPasswordValues = () => {
    setModalShowPassword(false);
    setOtpField(false);
    setPasswordOtp("");
    setPassOtpInvalid(false);
    setNewPswrd("");
    setOldPswrd("");
    setConfirmPswrd("");
    setErrorMsg("");
    setShowPasswordConfirm(false);
    setShowPasswordNew(false);
    setShowPasswordOld(false);
  };

  const passwordOtpBtn = () => {
    if (passwordOtp.length === 6) {
      return (
        <div className="privacyChangePassword d-flex justify-content-evenly flex-row w-100">
          <button onClick={() => resetPasswordValues()}>Cancel</button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              postToSubmitPassword();
            }}
            disabled={disableBtn || btnEnable}
          >
            {disableBtn ? (
              <img
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
                alt=""
              />
            ) : null}
            Submit
          </button>
        </div>
      );
    } else {
      return (
        <div className="privacyChangePassword d-flex justify-content-evenly flex-row w-100">
          <button onClick={() => resetPasswordValues()}>Cancel</button>
          <button type="submit" disabled>
            Submit
          </button>
        </div>
      );
    }
  };

  const passwordSave = () => {
    if (
      isOldPasswordStrong &&
      isPasswordStrong === true &&
      confirmPswrd !== "" &&
      newPswrd !== "" &&
      confirmPswrd === newPswrd
    ) {
      return (
        <div className="privacyChangePassword d-flex justify-content-evenly flex-row w-100">
          <button onClick={() => resetPasswordValues()}>Cancel</button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              postToChangePassword();
              setSeconds(60);
            }}
            disabled={disableBtn}
          >
            {disableBtn ? (
              <img
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
                alt=""
              />
            ) : null}
            Save
          </button>
        </div>
      );
    } else {
      return (
        <div className="privacyChangePassword d-flex justify-content-evenly flex-row w-100">
          <button onClick={() => resetPasswordValues()}>Cancel</button>
          <button type="submit" disabled>
            Save
          </button>
        </div>
      );
    }
  };

  const changePasswordModal = () => {
    return (
      <div>
        <div
          className="text-end mb-2 text-white opacity-75 fs-3 cursorPointer"
          onClick={() => resetPasswordValues()}
        >
          {removeIcon}
        </div>

        <div className="changePswrdFields d-flex flex-column justify-content-center">
          <div className="text-white fs-4 text-center mb-5">
            Change password
          </div>
          <label className="changePswrdInput_label text-white">
            Old password
          </label>
          <div className="changePswrdField mx-auto d-flex align-items-center">
            <Input
              className={
                isOldPasswordStrong === true && oldPswrd.length > 7
                  ? `changePswrdInputStrong px-3 text-white`
                  : condition(
                      oldPswrd.length > 0,
                      `changePswrdInputValid px-3 text-white`,
                      `changePswrdInput px-3 text-white`
                    )
              }
              type={showPasswordOld ? `text` : `password`}
              name="oldPswrd"
              value={oldPswrd}
              onChange={(e) => {
                setOldPswrd(e.target.value);
                if (e.target.value.match(strongPswrd)) {
                  setIsOldPasswordStrong(true);
                } else {
                  setIsOldPasswordStrong(false);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onCopy={(e) => {
                e.preventDefault();
                return false;
              }}
              readOnly={otpField}
              autoComplete="new-password"
            />
            <span
              className="show_password mx-2 text-white opacity-75"
              onClick={() => setShowPasswordOld(!showPasswordOld)}
            >
              {showPasswordOld ? <span>{eye}</span> : <span>{slashEye}</span>}
            </span>
          </div>
          <label className="changePswrdInput_label text-white">
            New password
          </label>
          <div className="changePswrdField mx-auto d-flex align-items-center">
            <Input
              className={
                isNewPasswordStrong === true && newPswrd.length > 7
                  ? `changePswrdInputStrong px-3 text-white`
                  : condition(
                      newPswrd.length > 0,
                      `changePswrdInputValid px-3 text-white`,
                      `changePswrdInput px-3 text-white`
                    )
              }
              type={showPasswordNew ? `text` : `password`}
              name="newPswrd"
              value={newPswrd}
              onChange={(e) => {
                setNewPswrd(e.target.value);
                if (e.target.value.match(strongPswrd)) {
                  setIsNewPasswordStrong(true);
                } else {
                  setIsNewPasswordStrong(false);
                }
                if (newPswrd.length > 7 && e.target.value === confirmPswrd) {
                  setIsCPasswordStrong(true);
                } else {
                  setIsCPasswordStrong(false);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onCopy={(e) => {
                e.preventDefault();
                return false;
              }}
              readOnly={otpField}
              autoComplete="new-password"
            />
            <span
              className="show_password mx-2 text-white opacity-75"
              onClick={() => setShowPasswordNew(!showPasswordNew)}
            >
              {showPasswordNew ? <span>{eye}</span> : <span>{slashEye}</span>}
            </span>
          </div>
          <label className="changePswrdInput_label text-white">
            Confirm password
          </label>
          <div className="changePswrdField mx-auto d-flex align-items-center">
            <Input
              className={
                isCPasswordStrong && confirmPswrd.length > 7
                  ? `changePswrdInputStrong px-3 text-white`
                  : condition(
                      confirmPswrd.length > 0,
                      `changePswrdInputValid px-3 text-white`,
                      `changePswrdInput px-3 text-white`
                    )
              }
              type={showPasswordConfirm ? `text` : `password`}
              name="confirmPswrd"
              value={confirmPswrd}
              onChange={(e) => {
                setConfirmPswrd(e.target.value);
                if (
                  e.target.value.match(strongPswrd) &&
                  e.target.value === newPswrd
                ) {
                  setIsCPasswordStrong(true);
                  setIsPasswordStrong(true);
                } else {
                  setIsCPasswordStrong(false);
                  setIsPasswordStrong(false);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                return false;
              }}
              onCopy={(e) => {
                e.preventDefault();
                return false;
              }}
              readOnly={otpField}
              autoComplete="new-password"
            />
            <span
              className="show_password mx-2 text-white opacity-75"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              {showPasswordConfirm ? (
                <span>{eye}</span>
              ) : (
                <span>{slashEye}</span>
              )}
            </span>
          </div>
          {otpField ? (
            <div className="changePswrdField" style={{ marginLeft: "10%" }}>
              <OtpInput
                value={passwordOtp}
                onChange={(e) => {
                  if (isNaN(e) === false && e.charAt(0) !== " ") {
                    setPasswordOtp(e);
                  }
                }}
                shouldAutoFocus
                numInputs={6}
                isInputNum={true}
                focusStyle={{
                  outline: "none",
                }}
                inputStyle={{
                  width: "50%",
                  height: "2.2rem",
                  fontSize: "1.5rem",
                  flex: "none",
                  backgroundColor: "transparent",
                  color: "white",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: PassOtpInvalid
                    ? "2px solid #F65A5A"
                    : "2px solid #73D8C6",
                  borderLeft: "none",
                }}
              />
              <div
                className=" my-3"
                style={{ textAlign: "right", marginRight: "26px" }}
              >
                {eblResendBtnText()}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="text-center">
          {successMsg && (
            <span className="small text-success">{successMsg}</span>
          )}
          {errorMsg && errorMsg !== "" ? (
            <span className="small text-danger">{errorMsg}</span>
          ) : (
            <></>
          )}
        </div>
        {otpField ? (
          <div className="mx-auto d-flex justify-content-center my-2">
            {passwordOtpBtn()}
          </div>
        ) : (
          <div className="mx-auto d-flex justify-content-center my-3">
            {passwordSave()}
          </div>
        )}
      </div>
    );
  };

  const __onLogOut = async () => {
    let encryptedRequestBody;
    let requestBody = {
      customerId: customerId,
      deviceType: "web",
      phoneNumber: userContactNo,
      countryCode: "US",
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    await axios
      .post(URI.logoutUser, {
        encryptedRequestBody: encryptedRequestBody,
      })
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          window.sessionStorage.clear();
          window.history.forward();
          navigate("../");
        }
      });
  };
  const __on2faSetting = async () => {
    if (twoFAValue === 0) {
      let encryptedRequestBody;
      const __oo = {
        customerId: customerId,
        is2FaActivated: 1,
      };
      encryptedRequestBody = encryptedPayload(__oo);
      const response = await axios.post(
        URI.change2FA,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      );
      if (response.data.status === 200) {
        setQrCodeString(
          "otpauth://totp/" +
            "DiamExchange" +
            userContactNo +
            "?secret=" +
            response.data.data.twoFactorAuthKey
        );
        setTwoFacModal(true);
        dispatcher(setTwoFAValue(1));
      }
    } else {
      let encryptedRequestBody;
      const __oo = {
        customerId: customerId,
        is2FaActivated: 0,
      };
      encryptedRequestBody = encryptedPayload(__oo);
      const response = await axios.post(
        URI.change2FA,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      );
      if (response.data.status === 200) {
        setTwoFacModal(false);
        dispatcher(setTwoFAValue(0));
      }
    }
  };

  const fetchLoginHistory = async () => {
    setIsLoading(true);
    axios
      .get(URI.getLoginHistory + `${customerId}`, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setIsLoading(false);
          setLoginDetails(response.data.data.loginHistoryList);
          const {
            browserName,
            ipCountryCode,
            loginIp,
            ipType,
            loginTimestamp,
            deviceType,
          } = response.data.data.loginHistoryList[0];
          setActiveSession({
            browser: browserName,
            country: ipCountryCode,
            ipType: ipType,
            recentActivity: loginTimestamp,
            IpAddress: loginIp,
            deviceType: deviceType,
          });
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const twoWayOTPVerification = async () => {
    let encryptedRequestBody;
    const requestBody = {
      phoneNumber: userContactNo,
      verificationCode: OTP,
      countryCode: "US",
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    const response = await axios.post(
      URI.twowayauthotp,
      {
        encryptedRequestBody: encryptedRequestBody,
      },
      {
        headers: headers,
      }
    );
    if (response.data.status === 200 || response.data.status === 201) {
      dispatcher(setTwoFAValue(1));
      setTwoFacModal(false);
      setOTP("");
      setOtpErrorMsg("");
    } else {
      setOTP("");
      setTimeout(() => {
        const d = document.querySelector(".OTP-area>div>div>input");
        if (d) d.focus();
      }, 100);
      setOtpErrorMsg(response.data.message);
      setTimeout(() => {
        setOtpErrorMsg();
      }, 3000);
    }
  };

  useEffect(() => {
    if (OTP.length === 6) {
      twoWayOTPVerification();
    }
  }, [OTP]);

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  const [faModal, setfaModal] = useState(false);

  const condition = (cond, arg1, arg2) => {
    return cond ? arg1 : arg2;
  };

  return (
    <div className="settingsRightSecPAndS d-flex flex-column w-100 me-5 rounded-3">
      <Modal
        show={modalShowPassword}
        id="dashboardModalsT"
        aria-labelledby="example-custom-modal-styling-title"
        className="dashboardTransaction"
        onHide={() => setModalShowPassword(false)}
      >
        <Modal.Body
          style={{
            backgroundColor: "rgba(10, 12, 20, 1)",
          }}
        >
          {changePasswordModal()}
        </Modal.Body>
      </Modal>

      <div>
        <Modal
          show={twoFacModal}
          onHide={() => setTwoFacModal(false)}
          id="enableTwoFAModal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Body>
            <div
              className="cursorPointer removeIcon_twoFASet pb-4 fs-3 position-absolute end-0 me-4 mt-2 d-flex justify-content-center border border-2 border-light rounded-circle text-white"
              onClick={() => {
                setOtpErrorMsg("");
                setTwoFacModal(false);
                dispatcher(setTwoFAValue(0));
              }}
            >
              {removeIcon}
            </div>
            <div className="row">
              <div className="leftSecModalContent rounded-3 d-flex align-items-center justify-content-center">
                <div>
                  <div className="ms-2">
                    <div className="pb-3">
                      <h5 className="text-white">
                        Let's enhance your security with 2FA
                      </h5>
                      <div className="TwoFATopSectionText pt-4">
                        <p>1. Download and install Google Authenticator</p>
                        <p>2. Tap on plus button, select “Scan a QR Code”</p>
                      </div>
                    </div>
                    <div className="OTP-area mt-5">
                      <h4
                        className="twoFAOTPHeader"
                        style={{ color: "#ffffff" }}
                      >
                        Enter 2FA PIN
                      </h4>
                      <OtpInput
                        className="otpInput mt-1 me-4"
                        value={OTP}
                        onChange={setOTP}
                        isInputNum={true}
                        numInputs={6}
                        focusStyle={{
                          outline: "none",
                        }}
                        inputStyle={{
                          height: "2.5vw",
                          width: "2.5vw",
                          paddingBottom: "5px",
                          fontSize: "1.2rem",
                          backgroundColor: "#1A1A1A",
                          alignItems: "center",
                          border: "none",
                          borderTop: "none",
                          borderRight: "none",
                          borderLeft: "none",
                          color: "#FFFFFF",
                        }}
                        containerStyle={{
                          alignItems: "center",
                        }}
                      />
                    </div>
                    <div
                      className="otpInvalidMsg mt-2"
                      style={{
                        color: "red",
                        fontSize: "0.9rem",
                        minHeight: "2rem",
                      }}
                    >
                      {otpErrorMsg}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 qrcodeCol">
                <div className="qrCanvas qrCanvas_settings">
                  <img
                    src={QRMobileDesign}
                    alt="Home Screen"
                    width="auto"
                    height="100%"
                    className="position-fixed"
                  />
                  <QRCodeCanvas
                    className="QRCodeForTwoFA position-fixed p-2 bg-light"
                    value={qrCodeString}
                    size={240}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div className="d-flex flex-row justify-content-between align-items-center w-100">
        <div className="d-flex flex-column ">
          <span className="whiteHeading mx-2">Change your password</span>
          <span className=" mx-2 small opacity-75" style={{ color: "#F5F5F5" }}>
            Set a unique password to protect your account
          </span>
        </div>
        <FaArrowRight
          onClick={() => setModalShowPassword(true)}
          className="cursorPointer"
        />
      </div>
      <hr />
      <div className="d-flex flex-row justify-content-between align-items-center w-100">
        <div className="d-flex flex-column ">
          <span className="whiteHeading mx-2">Two-Factor Authentication</span>
          <span className=" mx-2 small opacity-75" style={{ color: "#F5F5F5" }}>
            Enable or disable Two-Factor Authentication
          </span>
        </div>
        {twoFAValue === 1 ? (
          <div
            onClick={() => {
              setfaModal(true);
            }}
            className="cursorPointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="26"
              viewBox="0 0 52 26"
              fill="none"
            >
              <rect
                x="0.75"
                y="0.75"
                width="50.5"
                height="24.5"
                rx="12.25"
                fill="#0A0A0A"
              />
              <circle
                cx="39"
                cy="13"
                r="12.35"
                fill="#236dff"
                stroke="black"
                stroke-width="1.3"
              />
              <rect
                x="0.75"
                y="0.75"
                width="50.5"
                height="24.5"
                rx="12.25"
                stroke="#2A2A2A"
                stroke-width="1.5"
              />
            </svg>
          </div>
        ) : (
          <div
            onClick={() => {
              setfaModal(true);
            }}
            className="cursorPointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="52"
              height="26"
              viewBox="0 0 52 26"
              fill="none"
            >
              <rect
                x="0.75"
                y="0.75"
                width="50.5"
                height="24.5"
                rx="12.25"
                fill="#0A0A0A"
              />
              <circle
                cx="13"
                cy="13"
                r="12.35"
                fill="#236dff"
                stroke="black"
                stroke-width="1.3"
              />
              <rect
                x="0.75"
                y="0.75"
                width="50.5"
                height="24.5"
                rx="12.25"
                stroke="#2A2A2A"
                stroke-width="1.5"
              />
            </svg>
          </div>
        )}
      </div>
      <hr />
      <div className="d-flex flex-column justify-content-between  w-100">
        <div className="d-flex flex-column align-items-start py-2">
          <span className="whiteHeading mx-2">Active session</span>
          <span className=" mx-2 small opacity-75" style={{ color: "#F5F5F5" }}>
            All session currently logged in with
            <span className=" px-1">{userContactNo}</span>
          </span>
        </div>

        <div
          className="d-flex flex-row w-100 justify-content-between px-2 gap-2 py-3 mt-2 rounded-2 small"
          style={{
            backgroundColor: "rgba(10, 12, 20, 1)",
            border: "1px solid #2A2A2A",
          }}
        >
          <div className="d-flex flex-column gap-3">
            <span>
              Source &emsp;&emsp;&emsp;&emsp;:&ensp;
              {activeSession.deviceType === "Web" ? (
                <span>{activeSession.browser + " (Web)"}</span>
              ) : (
                <span>Mobile</span>
              )}
            </span>
            <span>
              Date and time &ensp;:&ensp; {activeSession.recentActivity}
            </span>
          </div>
          <div className="d-flex flex-column  gap-3">
            <span>
              IP address &emsp;: &ensp; {activeSession.IpAddress} (
              {activeSession.ipType})
            </span>
            <span>Country &emsp;&emsp;:&ensp; {activeSession.country}</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="d-flex flex-column   w-100">
        <div className="d-flex flex-column ">
          <span className="whiteHeading mx-2">Inactive session</span>
          <span className=" mx-2 small opacity-75" style={{ color: "#F5F5F5" }}>
            10 most recent
          </span>
        </div>
        {isLoading ? (
          // <div className="activity_history_body1 get-login-history-loader"></div>
          <div className="d-flex justify-content-center align-content-center h-auto">
            <img src={loader} alt="loader" width={200} />
          </div>
        ) : (
          condition(
            loginDetails?.length > 0,
            loginDetails.map((history, index) => {
              return (
                <div
                  className="d-flex flex-row w-100 justify-content-between px-2 gap-2 py-3 mt-2 mx-2 rounded-2 small"
                  style={{
                    border: "1px solid #2A2A2A",
                    backgroundColor: "rgb(10, 12, 20)",
                  }}
                  key={history.loginTimestamp}
                >
                  <div className="d-flex flex-column  gap-3">
                    <span>
                      Source &emsp;&emsp;&emsp;&emsp;:&ensp;
                      {history.deviceType === "Web" ? (
                        <span>{history.browserName + " (Web)"}</span>
                      ) : (
                        <span>Mobile</span>
                      )}
                    </span>
                    <span>
                      Date and time &ensp;:&ensp; {history.loginTimestamp}{" "}
                      {history.time}{" "}
                    </span>
                  </div>
                  <div className="d-flex flex-column  gap-3">
                    <span>
                      IP address &emsp;: &ensp; {history.loginIp} (
                      {history.ipType})
                    </span>
                    <span>
                      Country &emsp;&emsp;:&ensp; {history.ipCountryCode}
                    </span>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* modal */}
      <div>
        <Modal
          show={faModal}
          className="numberModal two_factor_modal"
          aria-labelledby="example-custom-modal-styling-title"
          size="md"
        >
          <Modal.Body>
            <div className="text-center rounded-2 py-4 px-1">
              <div className="text-white p-2">
                <div className="fs-5 mb-4">
                  {twoFAValue === 1 ? "Disable" : "Enable"} two factor
                  authentication
                </div>
                <div
                  className="small"
                  style={{ color: "rgba(197, 197, 197, 1)" }}
                >
                  Are you sure you want to{" "}
                  {twoFAValue === 1 ? "disable" : "enable"} two factor
                  authentication? This action will make your account
                  {twoFAValue === 1 ? " less" : " more"} secure.
                </div>
              </div>
              <div className="logoutSectionButton mt-4 d-flex gap-5 justify-content-center">
                <button
                  onClick={() => {
                    setfaModal(false);
                  }}
                  className="rounded-2 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setfaModal(false);
                    __on2faSetting();
                  }}
                  className="rounded-2 text-white border-0"
                >
                  {twoFAValue === 1 ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div>
        <Modal
          show={showmodel}
          id="deleteBeneficiaryModal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <div
            className="text-white text-center p-4"
            style={{
              border: "1px solid #73D8C6 ",
            }}
          >
            <div>
              <h2
                style={{
                  color: "#73D8C6",
                }}
                className="mb-5"
              >
                Successful!
              </h2>
              <p>Your password has been changed!</p>
            </div>

            <button
              className="select_Modal_next_button mx-auto border-0 rounded-2 p-2"
              onClick={() => {
                __onLogOut();
              }}
            >
              Login Again
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PrivacySecurity;
