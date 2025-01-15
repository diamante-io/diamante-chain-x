import React, { useState, useEffect } from "react";
import "./kyc.css";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import holdingIcon from "../../assets/holding-cell.svg";
import uploadIcon from "../../assets/uploadDocIcon.svg";
import EditIcon from "../../assets/Edit.svg";
import Verification from "./Verification";
import SucessGif from "../../assets/lotties/kycSucessfull.json";
import Lottie from "react-lottie";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import { URI } from "../../constants";
import moment from "moment";
import axios from "axios";
import { TRULIOO_URL } from "../../constants/DataConst";
import { __customBcColor, encryptedPayload } from "../commonComponent";
import DatePicker from "react-datepicker";
import Select from "react-select";
import refresh_loader from "../../assets/refresh_loader.svg";
import FadeLoader from "react-spinners/FadeLoader";
import { FaInfo } from "react-icons/fa";
import calenderIcon from "../../assets/calender_icon.svg";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

import { addYears, subYears } from "date-fns";

var stompClient = "";

const genderJson = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];
const KycQr = () => {
  const [pageName, setPageName] = useState("kycHomePage");
  const [QRCodeValue, setQRCodeValue] = useState("");
  const [verifySession, setVerifySession] = useState(false); // testing purpose done true
  const [frontImageData, setFrontImageData] = useState("");
  const [backImageData, setBackImageData] = useState("");
  const [selfieImageData, setSelfieImageData] = useState("");
  const [requestNo, setRequestNo] = useState("");
  const [documentDataChecked, setDocumentDataChecked] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(false);
  const [fstName, setFstName] = useState("");
  const [mdlName, setMdlName] = useState("");
  const [lstName, setLstName] = useState("");
  const [taxId, setTaxId] = useState("");

  const [gender, setGender] = useState("Male");
  const [showGender, setShowGender] = useState({ value: "M", label: "Male" });
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [provinceState, setProvinceState] = useState("");
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [personalErrorMsg, setPersonalErrorMsg] = useState("");
  const [kycErrorMsg, setKYCErrorMsg] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableLocation, setIsEditableLocation] = useState(false);
  const [ssnPage, setSsnPage] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [isCheckedFrontImage, setIsCheckedFrontImage] = useState(false);
  const [isCheckedBackImage, setIsCheckedBackImage] = useState(false);
  const [isCheckedSelfieImage, setIsCheckedSelfieImage] = useState(false);
  const [ssnErrorMessage, setSsnErrorMessage] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [dob, setDob] = useState("");
  const [kycLoader, setKycLoader] = useState(false);
  const { customerId, userContactNo } = useSelector((stat) => stat.ChangeState);

  console.log(customerId, "cust....");

  let navigate = useNavigate();

  // Calculate the minimum and maximum dates based on age range
  const minDate = subYears(new Date(), 99); // 99 years ago from today
  const maxDate = subYears(new Date(), 18);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const submitPersonal = async () => {
    // setBtnLoader(true);
    if (!isEditable) {
      // let encryptedRequestBody;
      // let _payLoad = {
      //   customerId: customerId,
      //   custFirstName: fstName,
      //   custMiddleName: mdlName,
      //   custLastName: lstName,
      //   custDateOfBirth: moment(dob).format("YYYY-MM-DD"),
      //   custGender: gender,
      //   custTaxId: taxId,
      // };

      // let _payLoad = {
      //   customerId: customerId,
      //   firstName: fstName,
      //   lastName:lstName,
      //   custDateOfBirth:dob,
      //   custTaxId:taxId,
      //   address:address,
      //   city:city,
      //   countryRegion:provinceState
      // }

      // encryptedRequestBody = encryptedPayload(_payLoad);

      // await axios
      //   .post(
      //     URI.postPersonalInfo,
      //     {
      //       encryptedRequestBody: encryptedRequestBody,
      //     },
      //     {
      //       headers: headers,
      //     }
      //   )

      // .then((response) => {
      //   if (response.data.status === 200 || response.data.status === 201) {
      //     setBtnLoader(false);
      setDocumentDataChecked(false);
      setPersonalInfo(true);
      //   } else {
      //     setPersonalErrorMsg(response.data.message);
      //     setTimeout(() => {
      //       setPersonalInfo(false);
      //       setDocumentDataChecked(true);
      //       setPersonalErrorMsg("");
      //       setBtnLoader(false);
      //     }, 3000);
      //   }
      // })
      // .catch(function (error) {
      //   setBtnLoader(false);
      //   __errorCheck(error);
      // });
    } else {
      setBtnLoader(false);
      setIsEditable(false);
    }
  };

  const returnToHome = async () => {
    let encryptedRequestBody;
    let requestBody = {
      customerId: customerId,
      deviceType: "web",
      phoneNumber: userContactNo,
      countryCode: "US",
    };

    encryptedRequestBody = encryptedPayload(requestBody);
    // console.log("request",requestBody)
    await axios
      .post(URI.logoutUser, {
        encryptedRequestBody: encryptedRequestBody,
      })

      .then((response) => {
        if (response.data.status === 200) {
          window.sessionStorage.clear();
          window.history.forward();
          navigate("../dashboard");
        }
      });

    // navigate('../creditlink')
  };

  const today = new Date();

  const __errorCheck = (__error) => {
    if (__error.response) {
      if (__error.response.status === 400) {
        // __getAuthToken();
        setPersonalInfo(false);
      }
    }
  };

  const _send = (message) => {
    stompClient.send("/app/send", {}, JSON.stringify(message));
  };

  // const _disconnect = () => {
  //   const req = {
  //     method: "UNSUBSCRIBE",
  //     event: "docv",
  //     userId: customerId,
  //     id: requestNo, //random number
  //   };
  //   _send(req);

  //   if (stompClient !== null) {
  //     stompClient.disconnect();
  //   }
  // };

  const encodeBase64 = (data) => {
    return Buffer.from(data).toString("base64");
  };

  function isAbove18(birthdate) {
    const birthDate = new Date(birthdate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return (
      age > 18 ||
      (age === 18 &&
        new Date().getTime() >=
          birthDate.setFullYear(birthDate.getFullYear() + 18))
    );
  }

  const handleDateUpdate = (e) => {
    if (e) {
      setDob(new Date(e));
      if (isAbove18(new Date(e))) {
        setPersonalErrorMsg("");
      }
    }
  };

  const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: __customBcColor(state.isFocused, state.isSelected),
      color: "#FFFFFF",
    }),
    control: (provided) => ({
      ...provided,
      border: 0,
      backgroundColor: "transparent",
      // This line disable the blue border
      boxShadow: "none",
      fontSize: 13,
      // width: "22vw",
      textAlign: "start",
    }),
    input: (base) => ({
      ...base,
      color: "#FFFFFF",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),

    menuList: (provided, state) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
      "&::-webkit-scrollbar": {
        width: 5,
      },

      "&::-webkit-scrollbar-thumb": {
        background: "#00EEFD",
        borderRadius: "10px",
      },
    }),
  };

  const getFrontDoc = async () => {
    await axios
      .get(URI.getFrontDetails + customerId, {
        headers: headers,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response, "responseGetFrontDetails.....");
          if (response.data.data.totalCount > 0) {
            console.log(response.data.data, "frontUploadDocs....responeTTTT");
            let dofBirth = response.data.data.items[0].formFields[9].value;
            if (dofBirth.slice(0, 2) > 12) {
              dofBirth = moment(dofBirth, "DD/MM/YYYY").format("MM/DD/YYYY");
              setDob(dofBirth ? new Date(dofBirth) : today);
            }
            if (!isAbove18(new Date(dofBirth))) {
              setPersonalErrorMsg("Age should be 18 years");
            }
            setFstName(response.data.data.items[0].formFields[0].value);
            setMdlName(response.data.data.items[0].formFields[2].value);
            setLstName(response.data.data.items[0].formFields[1].value);

            setAddress(response.data.data.items[0].formFields[10].value);
            setCity(response.data.data.items[0].formFields[11].value);
            setPostal(
              response.data.data.items[0].formFields[12].value?.slice(0, 5)
            );
            setProvinceState(
              response.data.data.items[0].formFields[13].value?.slice(0, 2)
            );
          }
        }
      });
  };

  const handleChange = (selectedGender) => {
    setShowGender(selectedGender);
    setGender(selectedGender.value);
  };

  const onMessageReceived = (message) => {
    let serverMsg = JSON.parse(message.body);
    setRequestNo(serverMsg.id);
    if (serverMsg.e === "frontImage" && serverMsg.userId === customerId) {
      setFrontImageData(serverMsg.docContentType);
      setIsCheckedFrontImage(true);
    } else if (serverMsg.e === "backImage" && serverMsg.userId === customerId) {
      setBackImageData(serverMsg.docContentType);
      setIsCheckedBackImage(true);
    } else if (
      serverMsg.e === "selfieImage" &&
      serverMsg.userId === customerId
    ) {
      setSelfieImageData(serverMsg.docContentType);
      setIsCheckedSelfieImage(true);
      setTimeout(() => {
        setSelfieUploaded(true);
      }, 3000);
      getFrontDoc();
    } else if (
      serverMsg.e === "verifySession" &&
      serverMsg.userId === customerId
    ) {
      setVerifySession(true);
    }
  };
  const _connect = () => {
    const ws = SockJS(URI.socketStream);
    stompClient = Stomp.over(ws);
    stompClient.connect(
      {},
      function (frame) {
        var momentDate = moment().format();

        var reqNo = Math.random().toString(36).slice(2) + momentDate;
        var session_id = encodeBase64(reqNo).toLowerCase();
        console.log(session_id, "session id...........");
        const req = {
          method: "SUBSCRIBE",
          event: "docv",
          userId: customerId,
          id: session_id, //random number
        };

        _send(req);
        stompClient.subscribe("/user/topic/stream", function (sdkEvent) {
          onMessageReceived(sdkEvent);
        });

        const SCAN_URL = TRULIOO_URL;

        var QRCode_Value = "";
        QRCode_Value =
          SCAN_URL +
          "?sessionId=" +
          session_id +
          "&event=docv" +
          "&countryCode=" +
          "US" +
          "&page=" +
          "1";

        setQRCodeValue(QRCode_Value);

        console.log(QRCode_Value, "qrCodevalu...");
      },
      errorCallBack
    );
  };

  const toggleContinueButton = async () => {
    let encryptedRequestBody;
    const requestBody = {
      ssnNumber: taxId,
    };
    encryptedRequestBody = encryptedPayload(requestBody);
    await axios
      .post(
        URI.checkSsnIdExist,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      )

      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          if (response.data.data.isExist === false) {
            setSsnPage(!ssnPage);
          } else {
            setSsnErrorMessage(response.data.message);
            setTimeout(() => {
              setSsnErrorMessage("");
            }, 3000);
          }
        }
      })
      .catch(function (error) {
        __errorCheck(error);
      });
  };

  const toggleEditButtonLocation = () => {
    setIsEditableLocation(!isEditableLocation);
  };

  const __personalSubmitBtn = () => {
    if (
      fstName !== "" &&
      dob !== today &&
      taxId !== "" &&
      taxId.length > 8 &&
      lstName !== "" &&
      gender !== "" &&
      isAbove18(dob)
    ) {
      return (
        <div className="">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 w-50"
            disabled={btnLoader}
            onClick={(e) => {
              e.preventDefault();
              submitPersonal();
            }}
          >
            {" "}
            {btnLoader ? (
              <img
                alt=""
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
              />
            ) : null}{" "}
            {isEditable ? "Save" : "Continue"}
          </button>
        </div>
      );
    } else {
      return (
        <div className="">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 w-50"
            disabled
          >
            {isEditable ? "Save" : "Continue"}
          </button>
        </div>
      );
    }
  };

  const submitKYC = async () => {
    console.log("kycTwo");
    // setBtnLoader(true);
    setKycLoader(true);
    if (!isEditableLocation) {
      if (
        provinceState.toUpperCase() === "NY" ||
        provinceState.toUpperCase() === "HI" ||
        provinceState.toUpperCase() === "TX" ||
        provinceState.toUpperCase() === "SD" ||
        provinceState.toUpperCase() === "NEW YORK" ||
        provinceState.toUpperCase() === "HAWAII" ||
        provinceState.toUpperCase() === "TEXAS" ||
        provinceState.toUpperCase() === "SOUTH DAKOTA"
      ) {
        setKYCErrorMsg(
          "We regret to inform you that PayCircle is not currently available in your region."
        );
        setTimeout(() => {
          //  setBtnLoader(false);
          setKYCErrorMsg("");
        }, 3000);
      } else {
        let encryptedRequestBody;
        // let _payLoad = {
        //   customerId: customerId,
        //   custFirstName: fstName,
        //   custMiddleName: mdlName,
        //   custLastName: lstName,
        //   // custDateOfBirth: dob,
        //   custDateOfBirth: moment(dob).format("YYYY-MM-DD"),
        //   custGender: gender,
        //   custTaxId: taxId,
        //   country: "US",
        //   city: city,
        //   streetAddress: address,

        //   stateProvinceCode: provinceState,
        //   postalCode: postal,
        // };

        let _payLoad = {
          customerId: customerId,
          firstName: fstName,
          middleName: mdlName,
          lastName: lstName,
          dob: moment(dob).format("YYYY-MM-DD"),
          custGender: gender,
          custTaxId: taxId,
          country: "India",
          city: city,
          fullAddress: address,
          countryRegion: provinceState,
          // stateProvinceCode: provinceState,
          postalCode: Number(postal),
        };

        encryptedRequestBody = encryptedPayload(_payLoad);
        console.log(headers, "headers...........");

        await axios
          .post(
            URI.postPersonalInfo,
            {
              encryptedRequestBody: encryptedRequestBody,
            },
            {
              headers: headers,
            }
          )
          .then((response) => {
            if (response.data.status === 200 || response.data.status === 201) {
              console.log("kyc2...");
              // setBtnLoader(false);
              setKycLoader(false);

              setVerificationSuccessful(true);
            } else if (response.data.status === 402) {
              setKYCErrorMsg(response.data.message);
              setTimeout(() => {
                setKycLoader(false);
                setKYCErrorMsg("");
                navigate("../");
              }, 3000);
            } else {
              setKYCErrorMsg(response.data.message);
              setTimeout(() => {
                setKycLoader(false);
                setKYCErrorMsg("");
              }, 3000);
            }
          })
          .catch(function (error) {
            setKycLoader(false);
            __errorCheck(error);
          });
      }
    } else {
      setKycLoader(false);
      setIsEditableLocation(false);
    }
  };

  const __kycSubmitBtn = () => {
    console.log("kycOne");
    if (
      fstName !== "" &&
      dob !== "" &&
      taxId !== "" &&
      taxId.length > 8 &&
      lstName !== "" &&
      gender !== "" &&
      city !== "" &&
      address !== "" &&
      provinceState !== "" &&
      postal !== "" &&
      postal.length > 4
    ) {
      return (
        <div className="">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 w-75"
            onClick={submitKYC}
            disabled={kycLoader}
          >
            {kycLoader ? (
              <img
                alt=""
                src={refresh_loader}
                style={{ width: 20 }}
                className="spinner"
              />
            ) : null}{" "}
            {isEditableLocation ? "Save" : "Continue"}
          </button>
        </div>
      );
    } else {
      return (
        <div className="">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 w-50"
            disabled
          >
            {isEditableLocation ? "Save" : "Continue"}
          </button>
        </div>
      );
    }
  };

  // const __kycSubmitBtn = () => {

  //   return (
  //     <>
  //         <div className="">
  //         <button
  //           type="submit"
  //           className="btn btn-primary px-4 py-2 w-50"
  //           onClick={submitKYC}
  //           disabled={kycLoader}
  //         >
  //           {kycLoader ? (
  //             <img
  //               alt=""
  //               src={refresh_loader}
  //               style={{ width: 20 }}
  //               className="spinner"
  //             />
  //           ) : null}{" "}
  //           {isEditableLocation ? "Save" : "Continue"}
  //         </button>

  //       </div>
  //     </>
  //   )
  // }

  const errorCallBack = () => {
    setTimeout(() => {
      _connect();
    }, 5000);
  };

  const kycHomePage = () => {
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
                // onClick={() => setMode("verification")}
              >
                Contniue
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  };

  const kycVerificationHomePage = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-around pt-4 align-items-center h-100 w-100  ">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-center px-5">
            <h1 className="text-start w-100">Let’s verify your KYC</h1>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="TwofaRight_right_container container_bg_color  px-4  py-2 ">
          {/* <Signup /> */}
          <h5 className="text-start pt-2">Let’s Verify your KYC</h5>
          <p className="text-start   pt-1">
            To capture image on your mobile device{" "}
          </p>
          <p className="text-start  opacity-75 pt-1 ">
            1. Open your camera app from your mobile phone and scan the QR code
            below.
          </p>

          <p className="text-start  opacity-75 pt-1">
            2. Tap the push notification to open the account.{" "}
            <span className="activeColor">paycircle.io.website. </span>
          </p>

          <div className="qrCode_container pt-3  mx-auto mt-3">
            {/* <img
         src={QrCode}
          alt="Home Screen"
        //   width="auto"
        //   height="100%"
          style={{ borderRadius: "10px", position: "fixed" }}
        /> */}
            <div className="qrCode mx-auto">
              <QRCodeCanvas
                className="QRCodeForTwoFA"
                value={QRCodeValue}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
                //   imageSettings={{
                //     src: require("../../assets/paycircleQRLogo.png"),
                //     width: 45,
                //     excavate: true,
                //     height: 45,
                //   }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  };

  const stepIdicatorView = () => {
    return (
      <>
        <div className="stepWise pt-3  mx-auto ">
          <div className="d-flex align-items-center gap-2 py-2">
            <div className="text-start " style={{ width: "30%" }}>
              <div className="d-flex gap-2 align-items-center my-3">
                <div className="rounded-circle position-relative outer_circle">
                  <span className="position-absolute bg-white rounded-circle inner_circle" />
                </div>
                <div
                  className={
                    frontImageData !== "" && frontImageData != null
                      ? "indicator-line active"
                      : "w-100 indicator_inactive indicator-line"
                  }
                ></div>
              </div>
            </div>
            <div className="text-start " style={{ width: "38%" }}>
              <div className="d-flex gap-2 align-items-center my-3">
                <div
                  className="rounded-circle position-relative outer_circle"
                  style={{ width: "19px" }}
                >
                  <span
                    className="position-absolute bg-white rounded-circle inner_circle"
                    // style={{ left: "3.5px" }}
                  />
                </div>
                <div
                  // className="w-100"
                  // style={{
                  //   border: "0.50px rgba(245, 245, 245, 0.60) solid",
                  // }}
                  className={
                    backImageData !== "" && backImageData != null
                      ? "indicator-line active"
                      : " indicator_inactive indicator-line"
                  }
                ></div>
              </div>
            </div>
            <div
              className="text-start"

              // style={{width: "23%"}}
            >
              <div className="d-flex gap-2 align-items-center my-3">
                <div className="rounded-circle position-relative outer_circle">
                  <span className="position-absolute bg-white rounded-circle inner_circle" />
                </div>
                {/* <div 
                      className={
                        selfieImageData !== "" && selfieImageData != null
                          ? "indicator-line active"
                          : " indicator_inactive indicator-line" 
                      }
                  ></div> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const documentVerificationPage = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-between py-2 align-items-center h-100 px-5">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column align-items-start px-5">
            {/* <h1 className="text-start">01/03</h1> */}
            <div className="d-flex">
              <h1>01</h1>
              <h1>/</h1>
              <h1 className="opacity-75">03</h1>
            </div>
            <h5>Document Verification</h5>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="doc_container  border_onboarding container_bg_color  px-4  py-2  w-50">
          <h5 className="text-start pt-2">Document Verification</h5>
          <p className="text-start  opacity-75 pt-2 ">
            We’re required by law to verify your identity.
          </p>

          <p className="text-start  pt-2">
            Follow the prompt on your phone to capture all three required
            images:
          </p>

          <>{stepIdicatorView()}</>

          <div className="uploadDocuments_main_container d-flex gap-2 pt-2">
            <div className="d-flex flex-column frontSide ">
              <span
                className={
                  frontImageData ? "activeColor text-start" : " text-start"
                }
              >
                Front side of the document
              </span>

              {frontImageData !== "" && frontImageData != null ? (
                <div className="docs_container d-flex justify-content-center align-items-center mt-2">
                  <img
                    src={frontImageData}
                    className="iDVSubmitted"
                    alt="image1"
                  />
                </div>
              ) : (
                <div className="docs_container d-flex justify-content-center align-items-center mt-2">
                  <span>
                    <img src={uploadIcon} height={34} width={34} alt="img" />
                  </span>
                </div>
              )}
            </div>

            <div className="d-flex flex-column backSide">
              <span
                className={
                  backImageData ? "activeColor text-start" : " text-start"
                }
              >
                Back side of the document
              </span>

              {backImageData !== "" && backImageData != null ? (
                <div className="docs_container d-flex justify-content-center align-items-center mt-2">
                  <img
                    src={backImageData}
                    className="iDVSubmitted"
                    alt="image1"
                  />
                </div>
              ) : (
                <div className="docs_container d-flex justify-content-center align-items-center mt-2">
                  <span>
                    <img src={uploadIcon} height={34} width={34} alt="img" />
                  </span>
                </div>
              )}
            </div>

            <div className="selfie_container d-flex flex-column  ">
              <div className="d-flex flex-column backSide ">
                <span
                  className={
                    selfieImageData ? "activeColor text-start" : " text-start"
                  }
                >
                  Take a Selfie
                </span>

                {selfieImageData !== "" && selfieImageData != null ? (
                  <div
                    className="docs_container d-flex justify-content-center align-items-center mt-2"
                    style={{ width: "11vw" }}
                  >
                    <img
                      src={selfieImageData}
                      className="iDVSubmittedSelfie"
                      alt="image1"
                    />
                  </div>
                ) : (
                  <div className="selfie_docs_container  d-flex justify-content-center align-items-center mt-2">
                    <span>
                      <img src={holdingIcon} height={34} width={34} alt="img" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="opacity-75 text-start pt-2">
            Note: Please ensure that the documents and selfie photo you provide
            are of good quality, clear, valid, and without blurriness or glare.
          </p>
        </div>
      </main>
    );
  };

  const documentVerificationSecondPage = () => {
    return (
      <main className="content_signupForm_container d-flex   justify-content-around pt-4 gap-4 align-items-center h-100 ">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-start px-5">
            {/* <h1 className="text-start">01/03</h1> */}
            <div className="d-flex">
              <h1>01</h1>
              <h1>/</h1>
              <h1 className="opacity-75">03</h1>
            </div>
            <h5>KYC Verification</h5>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="TwofaRight_right_container d-flex justify-content-between flex-column container_bg_color  px-4  py-4 ">
          {/* <Signup /> */}

          <div className="header">
            <h3 className="text-start pt-2">SSN ID Verification</h3>
            <p className="text-start  opacity-75 pt-2 ">
              We’re required by law to verify your identity.
            </p>

            <div className="2fa input_container d-flex flex-column pt-5">
              <span className="text-start ms-1">Enter SSN ID</span>
              <div className="otpContainer pt-1">
                <input
                  className="personalInput w-100"
                  placeholder="SSN ID"
                  id="taxId"
                  type="text"
                  value={taxId.replace(/[^0-9\s]/gi, "")}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    inputValue.charAt(0) !== "." &&
                      setTaxId(
                        e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1")
                      );
                    // setTaxId(inputValue);
                    setIsButtonEnabled(inputValue.length === 9);
                  }}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={9}
                />
              </div>
            </div>
          </div>
          {ssnErrorMessage && (
            <p className="error-message">{ssnErrorMessage}</p>
          )}
          <div className="btn_container text-start mt-4">
            <button
              className="btn btn-primary px-4 py-2 w-100 "
              type="submit"
              onClick={toggleContinueButton}
              disabled={!isButtonEnabled}
            >
              Create
            </button>
          </div>
        </div>
      </main>
    );
  };

  const documentPersonalViewPage = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-between pt-4 align-items-center h-100 px-5">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-center px-5">
            {/* <h1 className="text-start">01/03</h1> */}
            <div className="d-flex  w-100 text-start">
              <h1>02</h1>
              <h1>/</h1>
              <h1 className="opacity-75">03</h1>
            </div>
            <h5 className="d-flex  w-100 text-start">Document Verification</h5>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="personView_rightSide_container  border_onboarding container_bg_color d-flex flex-column justify-content-between  px-4  py-4  ">
          <div className="header_and_input_main_container">
            <div className="d-flex justify-content-between">
              <h5 className="text-start pt-2">
                Verify your personal information
              </h5>
              <p
                className="searchbar px-2 py-1 d-flex rounded align-items-center justify-content-center gap-1 cursorPointer"
                onClick={() => {
                  setIsEditable(!isEditable);
                }}
              >
                {/* Edit */}
                {isEditable ? "Cancel" : "Edit"}

                <span>
                  <img src={EditIcon} alt="img" height={18} width={20} />
                </span>
              </p>
            </div>

            <div className="PersonalInputContainer_main_container d-flex flex-wrap gap-4  pt-2">
              <div className="inputDivContainer">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  First name
                </label>

                <input
                  className="personalInput"
                  type="text"
                  value={fstName.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) => setFstName(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={25}
                  disabled={!isEditable}
                />
              </div>
              <div className="inputDivContainer">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Middle name
                </label>

                <input
                  className="personalInput"
                  id="middleName"
                  type="text"
                  value={mdlName.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) => setMdlName(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={25}
                  // className="inputTypeBox"
                  disabled={!isEditable}
                />
              </div>{" "}
              <div className="inputDivContainer">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Last name
                </label>

                <input
                  className="personalInput"
                  type="text"
                  value={lstName.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) => setLstName(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={25}
                  // className="inputTypeBox"
                  disabled={!isEditable}
                />
              </div>
              <div className="inputDivContainer pt-4 ">
                <label className="d-flex flex-start opacity-75 pb-2">
                  Date of birth
                </label>
                <div className="position-relative datePicker_input">
                  {/* <DatePicker
                    // className={
                    //   isEditable
                    // /    ? "kycNonEditInputField kycEditInputField"
                    //     : "kycNonEditInputField "
                    // }
                    className="personalInput"
                    dateFormat="MM-dd-yyyy"
                    selected={dob === "Invalid Date" ? today : dob}
                    onChange={(e) => handleDateUpdate(e)}
                    // maxDate={today}
                    // maxDate={new Date(maxYear, 11, 31)}
                    maxDate={new Date(maxYear, 11, 31)}
                    minDate={new Date(minYear, 0, 1)}
                    minYear={today.setFullYear(today.getFullYear() - 18)}
                    yearDropdownItemNumber={99 - 18 + 1}
                    yearDropdownMinOffset={18}
                    showDisabledMonthNavigation
                    // todayButton={"Today"}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    selectsStart
                    // yearDropdownItemNumber={50}
                    scrollableYearDropdown
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    disabled={!isEditable}
                    style={{ width: "90%" }}
                  />{" "} */}
                  <DatePicker
                    className="personalInput"
                    dateFormat="MM-dd-yyyy"
                    selected={dob === "Invalid Date" ? today : dob}
                    onChange={(e) => handleDateUpdate(e)}
                    minDate={minDate}
                    maxDate={maxDate}
                    yearDropdownItemNumber={99 - 18 + 1}
                    yearDropdownMinOffset={18}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    selectsStart
                    scrollableYearDropdown
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    disabled={!isEditable}
                    style={{ width: "90%" }}
                  />
                  <div className="calenderImage position-absolute">
                    {isEditable ? (
                      <span className="calenderIconContainer pe-2 ">
                        <img
                          src={calenderIcon}
                          alt="calender"
                          style={{ height: "1.5rem" }}
                        />
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="inputDivContainer pt-4">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  SSN ID
                </label>

                <input
                  className="personalInput"
                  id="taxId"
                  type="text"
                  value={taxId.replace(/[^0-9\s]/gi, "")}
                  onChange={(e) => setTaxId(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={9}
                  // className="inputTypeBox"
                  disabled={!isEditable}
                />
              </div>
              <div className="inputDivContainer pt-4">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Gender
                </label>

                {/* <input className="personalInput" placeholder="Price" /> */}

                {isEditable ? (
                  <Select
                    className="personalInput_datepicker"
                    menuPlacement="auto"
                    label="Please select gender"
                    styles={customSelectStyles}
                    options={genderJson}
                    isSearchable
                    onChange={(e) => handleChange(e)}
                    value={showGender}
                    disabled={!isEditable}
                  />
                ) : (
                  <input
                    value={showGender.label}
                    disabled={true}
                    className="personalInput"
                  />
                )}
              </div>
            </div>
          </div>

          {personalErrorMsg !== "" ? (
            <p style={{ color: "#F65A5A", textAlign: "center" }}>
              {personalErrorMsg}
            </p>
          ) : (
            <></>
          )}

          <div className="btn_container text-start pt-4">
            {/* <button
              type="button"
              className="btn btn-primary px-4 py-2 w-50 "
              // onClick={() => setMode("verification")}
            >
              Contniued
            </button> */}
            {__personalSubmitBtn()}
          </div>
        </div>
      </main>
    );
  };

  const docAddressInformation = () => {
    return (
      <main className="content_signupForm_container d-flex gap-2  justify-content-between pt-4 align-items-center h-100 px-5">
        <div
          className=" d-flex  verifyProcess_left_container"
          style={{ width: "40vw" }}
        >
          <div className=" d-flex flex-column   justify-content-center align-items-start px-5">
            {/* <h1 className="text-start">01/03</h1> */}
            <div className="d-flex">
              <h1>03</h1>
              <h1>/</h1>
              <h1 className="opacity-75">03</h1>
            </div>
            <h5>Address Verification</h5>
            <div className="d-flex flex-column  pt-2 text-start">
              <p className="mb-0 fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
              <p className="fs-5">
                lorem lorem lorem lorem lorem lorem lorem lorem{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="personView_rightSide_container border_onboarding container_bg_color d-flex flex-column justify-content-between  px-4  py-4  ">
          <div className="header_and_input_main_container">
            <div className="d-flex justify-content-between">
              <h5 className="text-start pt-2">
                Verify your address information
              </h5>
              <p
                className="searchbar px-2 py-1 d-flex rounded align-items-center justify-content-center gap-1 cursorPointer"
                onClick={toggleEditButtonLocation}
              >
                {/* Edit */}
                {isEditableLocation ? "Cancel" : "Edit"}

                <span>
                  <img src={EditIcon} alt="img" height={18} width={20} />
                </span>
              </p>
            </div>

            <div className="PersonalInputContainer_main_container d-flex flex-wrap gap-4  pt-2">
              <div className="inputDivContainer w-100">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Address
                </label>

                <input
                  className="personalInput"
                  id="address"
                  type="text"
                  value={address.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={75}
                  disabled={!isEditableLocation}
                />
              </div>

              <div className="inputDivContainer pt-4">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Province state code
                </label>

                <input
                  className="personalInput"
                  id="province"
                  type="text"
                  value={provinceState.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) =>
                    e.target.value.match(/^[A-Za-z]+$/)
                      ? setProvinceState(e.target.value)
                      : setProvinceState("")
                  }
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={6}
                  disabled={!isEditableLocation}
                />
              </div>

              <div className="inputDivContainer pt-4">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  City
                </label>

                <input
                  className="personalInput"
                  id="city"
                  type="text"
                  value={city.replace(
                    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                    ""
                  )}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={75}
                  disabled={!isEditableLocation}
                />
              </div>
              <div className="inputDivContainer pt-4">
                <label className="d-flex flex-start opacity-75 pb-2">
                  {" "}
                  Zip code
                </label>

                <input
                  className="personalInput"
                  id="postalCode"
                  type="text"
                  value={postal}
                  pattern="[0-9]*"
                  onChange={(e) =>
                    setPostal((v) =>
                      e.target.validity.valid ? e.target.value : v
                    )
                  }
                  autoComplete="off"
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  maxLength={5}
                  disabled={!isEditableLocation}
                />
              </div>
            </div>
          </div>
          {kycErrorMsg !== "" ? (
            <p
              style={{
                color: "#F65A5A",
                textAlign: "center",
                marginTop: "25px",
              }}
            >
              {kycErrorMsg}
            </p>
          ) : (
            <></>
          )}

          <div className="btn_container text-start">
            {/* <button
              type="button"
              className="btn btn-primary px-4 py-2 w-50 "
            >
              Contniued
            </button> */}

            {__kycSubmitBtn()}
          </div>
        </div>
      </main>
    );
  };

  const VerificationSucesspage = () => {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: SucessGif,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <div className="d-flex  d-flex justify-content-center align-items-center w-100 h-100 ">
        <div className="sucessMain_container border_onboarding container_bg_color d-flex justify-content-center align-items-center w-50 h-75">
          <div className="d-flex flex-column ">
            <Lottie
              options={defaultOptions}
              height="25vh"
              width="10vw"
              color="bluez"
            />
            <h3 className="pt-3">Verification Successful!</h3>
            <div className="btn_container text-start pt-5">
              <button
                type="button"
                className="btn btn-primary px-4 py-2 w-100"
                onClick={returnToHome}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentView = () => {
    if (verifySession) {
      if (!selfieUploaded) {
        return <>{documentVerificationPage()}</>;
      } else {
        if (!ssnPage) {
          return <>{documentVerificationSecondPage()}</>;
        } else {
          if (!documentDataChecked) {
            if (!personalInfo) {
              return <>{documentPersonalViewPage()}</>;
            } else if (verificationSuccessful) {
              return <>{VerificationSucesspage()}</>;
            } else {
              return <>{docAddressInformation()}</>;
            }
          }
        }
      }
    } else {
      if (QRCodeValue !== "") {
        return <>{kycVerificationHomePage()}</>;
      } else {
        return (
          <div className="loader-container d-flex justify-content-center align-items-center mt-5">
            <FadeLoader
              color="rgb(51, 102, 255)"
              loading={QRCodeValue === "" ? true : false}
            />
          </div>
        );
      }
    }
  };

  useEffect(() => {
    sessionStorage.setItem("page", "kycqr");
    _connect();

    // setTimeout(() => {
    //   _disconnect();
    // }, 15 * 60 * 1000);
  }, []);

  return (
    <div className="signUp_main_Container d-flex flex-column ">
      <header className="signup_header_container justify-content-between  d-flex   mx-3 my-2  ">
        {/* <div></div> */}

        <div>
          <marquee
            behavior="scroll"
            direction="left"
            onmouseover="this.stop();"
            onmouseout="this.start();"
            height="20"
            width="1000"
          >
            <div className="liveAsset_status_container  d-flex">
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
      {/* {pageName === "kycVerification" && kycVerificationHomePage()}  */}

      {/* {pageName === "kycVerification" && kycVerificationHomePage()}
      {pageName === "docVerification" && documentVerificationPage()}
      {pageName === "docVerificationSecondPage" &&
        documentVerificationSecondPage()}
      {pageName === "docPersonalInformation" && documentPersonalViewPage()}
      {pageName === "docAddressInformation" && docAddressInformation()}
      {pageName === "verificationSucessFull" && VerificationSucesspage()} */}
      {getCurrentView()}
    </div>
  );
};

export default KycQr;
