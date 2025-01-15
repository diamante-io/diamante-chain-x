import React, { useState, useEffect, useRef } from "react";
import { URI } from "../../../constants/index";
import axios from "axios";
// import kycVerified from "../../../assets/kycDocument.png";
// import kycFailed from "../../../assets/Failed.png";
// import kycPending from "../../../assets/Pending.png";
import Select from "react-select";
// import {
//   __customBcColor,
//   condition,
// } from "../../../components/commonComponent";
import refresh_loader from "../../../assets/refresh_loader.svg";
// import { setDocStatusId } from "../../../redux/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import loader from "../../../assets/loaderMobile.gif";
import { condition } from "../../../components/commonComponent";

const UploadDocument = () => {
  const { customerId } = useSelector((stat) => stat.ChangeState);
  const dispatcher = useDispatch();

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };
  const documentTypeList = [
    { value: "identificationCard", label: "Identification Card" },
    { value: "license", label: "Driver's license" },
    { value: "passport", label: "Passport" },
  ];

  const [docStatus, setDocStatus] = useState();
  const [pageName, setPageName] = useState("statusPage");
  const [selectedDocument, setSelectedDocument] = useState("license");
  const [selectedFile_1, setSelectedFile_1] = useState("");
  const [selectedFile_2, setSelectedFile_2] = useState("");
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const __onDocumentSubmit = (selectedOption) => {
    if (selectedOption.value) {
      setSelectedDocument(selectedOption.value);
    }
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    await axios
      .get(URI.getCustomerDetails + `${customerId}`, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setBtnDisable(false);
          // dispatcher(
          //   setDocStatusId(response.data.data.customerInfo.customerDocStatusId)
          // );
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(function (error) {});
  };
  const __onSubmit = async () => {
    setBtnLoader(true);
    setBtnDisable(true);
    let formData = new FormData();
    formData.append("customerId", customerId);
    formData.append("documentType", selectedDocument);
    formData.append("frontSide", selectedFile_1);
    formData.append("backSide", selectedFile_2);

    const response = await axios.post(
      URI.updateDocument,
      formData,

      {
        headers: headers,
      }
    );

    if (response.data.status === 200) {
      setBtnLoader(false);

      setFileErrorMessage(response.data.message);
      fetchUserData();

      setTimeout(() => {
        setPageName("statusPage");
        setFileErrorMessage("");
      }, 3000);
    } else {
      setBtnLoader(false);
      setFileErrorMessage(response.data.message);
      setTimeout(() => {
        setFileErrorMessage("");
      }, 3000);
    }
  };

  const frontDoc = useRef(null);
  const backDoc = useRef(null);

  const __onFileChange_1 = (event) => {
    setSelectedFile_1("");

    if (event.target.files[0]) {
      const fileSizeKiloBytes = event.target.files[0].size / 1024;
      let fileInput = document.getElementById("kycdocfrontdoc");

      let filePath = fileInput.value;

      let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(filePath)) {
        setFileErrorMessage("Only JPEG, PNG, JPG files are accepted");
        setTimeout(() => {
          setFileErrorMessage("");
          event.target.value = null;
        }, 4000);
        // fileInput.value = "";
        return false;
      } else if (fileSizeKiloBytes > 2048) {
        setFileErrorMessage("File size must be below 2MB");
        setTimeout(() => {
          setFileErrorMessage("");
          event.target.value = null;
        }, 4000);
        return false;
      } else {
        setSelectedFile_1(event.target.files[0]);
      }
    }
  };

  const __onFileChange_2 = (event) => {
    setSelectedFile_2("");

    if (event.target.files[0]) {
      const fileSizeKiloBytes = event.target.files[0].size / 1024;

      let fileInput = document.getElementById("kycbackdoc");
      let filePath = fileInput.value;
      let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(filePath)) {
        setFileErrorMessage("Only JPEG, PNG, JPG files are accepted");
        setTimeout(() => {
          setFileErrorMessage("");
          event.target.value = null;
        }, 4000);
        fileInput.value = "";
        return false;
      } else if (fileSizeKiloBytes > 2048) {
        setFileErrorMessage("File size must be below 2MB");
        setTimeout(() => {
          setFileErrorMessage("");
          event.target.value = null;
        }, 4000);
        return false;
      } else {
        setSelectedFile_2(event.target.files[0]);
      }
    }
  };

  const handleDragEnter1 = () => frontDoc.current?.classList.add("dragOver");
  const handleDragLeave1 = () => frontDoc.current?.classList.remove("dragOver");
  const handleDrop1 = () => frontDoc.current?.classList.add("dragOver");

  const handleDragEnter2 = () => backDoc.current?.classList.add("dragOver");
  const handleDragLeave2 = () => backDoc.current?.classList.remove("dragOver");
  const handleDrop2 = () => backDoc.current?.classList.add("dragOver");

  const setOne = (a, b, c) => {
    return a ? b : c;
  };

  const customSelectLocationStyles = {
    option: (provided, state) => ({
      ...provided,
      // backgroundColor: __customBcColor(state.isFocused, state.isSelected),
      color: "#FFFFFF",
      // width: "50%",
    }),
    control: (provided, state) => ({
      ...provided,
      height: 8,
      border: 0,
      // marginLeft: 5,
      backgroundColor: "transparent",
      boxShadow: "none",
      fontSize: 13,
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

  const getCustSettings = async () => {
    await axios
      .get(URI.customerSettings + customerId, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          setIsLoading(false);
          // setDocStatus(
          //   response.data.data.cust_contrl_sett_record[0].custAccountIsOpen
          // );
        } else {
          setIsLoading(false);
        }
      });
  };
  const upload = (
    <svg
      width="40"
      height="40"
      viewBox="0 0 82 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M41 64.9159V40.9992M41 40.9992L33.3125 48.9713M41 40.9992L48.6875 48.9713M22.55 60.9296C15.7569 60.9296 10.25 55.3208 10.25 48.4021C10.25 42.7007 13.9891 37.889 19.1059 36.372C19.3234 36.3074 19.475 36.1048 19.475 35.8742C19.475 25.4958 27.7353 17.0825 37.925 17.0825C48.1145 17.0825 56.375 25.4958 56.375 35.8742C56.375 36.073 56.5581 36.2206 56.7488 36.1772C57.618 35.9787 58.522 35.8742 59.45 35.8742C66.243 35.8742 71.75 41.483 71.75 48.4021C71.75 55.3208 66.243 60.9296 59.45 60.9296"
        stroke="#00F0FF"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  const __getCurrentView = () => {
    if (pageName === "statusPage") {
      if (docStatus === 0) {
        // if (docStatus === 0 && docStatusId === 1) {
        return (
          <div
            className="settingsRightSecKyc"
            // style={{ backgroundColor: "rgb(21, 21, 21)" }}
          >
            {/* <img
              // src={kycPending}
              style={{ height: "auto", width: "100px" }}
              alt="kycPending"
            /> */}
            <p style={{ color: "#ffffff", fontSize: "20px" }}>
              {" "}
              Your KYC documents are being verified.
            </p>
          </div>
        );
      } else if (docStatus === 1) {
        // } else if (docStatus === 1 && docStatusId === 1) {
        return (
          <div
            className="settingsRightSecKyc"
            style={{ backgroundColor: "rgb(21, 21, 21)" }}
          >
            <img
              // src={kycVerified}
              style={{ height: "auto", width: "100px" }}
              alt="kycverified"
            />
            <p style={{ color: "#ffffff", fontSize: "20px" }}>
              KYC documents verification successful!
            </p>
          </div>
        );
      } else if (docStatus === 1 || docStatus === 0) {
        // } else if ((docStatus === 1 || docStatus === 0) && docStatusId === 2) {
        return (
          <div
            className="settingsRightSecKyc"
            style={{ backgroundColor: "rgb(21, 21, 21)" }}
          >
            <img
              // src={kycFailed}
              style={{ height: "auto", width: "100px" }}
              alt="kycFailed"
            />
            <p style={{ color: "#ffffff", fontSize: "20px", margin: "3%" }}>
              KYC documents verification failed! Please upload your documents
              again.
            </p>
            <button
              className="enable-button"
              onClick={() => {
                setPageName("uploadPage");
              }}
            >
              Upload again
            </button>
          </div>
        );
      } else {
        return (
          <div
            className="settingsRightSecKyc"
            // style={{ backgroundColor: "rgb(21, 21, 21)" }}
          >
            {/* <img
              // src={kycPending}
              style={{ height: "auto", width: "100px" }}
              alt="kycPending"
            /> */}
            <p style={{ color: "#ffffff", fontSize: "20px" }}>
              {" "}
              Your KYC documents are being verified.
            </p>
          </div>
        );
      }
    } else {
      return (
        <div
          className="settingsdocumentSecKyc px-4"
          style={{ backgroundColor: "rgb(21, 21, 21)" }}
        >
          <p className="inputlabels pt-4">Select Document Type</p>
          <div style={{ width: "40%" }}>
            <Select
              className="bankDetailInput px-2"
              menuPlacement="auto"
              // defaultValue={selectedDocument}
              defaultValue={{
                label: "Driver's license",
                value: selectedDocument,
              }}
              options={documentTypeList}
              onChange={__onDocumentSubmit}
              styles={customSelectLocationStyles}
            />
          </div>

          <div
            className=" d-flex justify-content-between  mt-2 "
            style={{ width: "100%" }}
          >
            <div>
              <p>1. Upload Front Image</p>
              <div className="additionalText">
                <span className="d-flex justify-content-center">{upload}</span>
                <div>
                  <label
                    htmlFor="kycdocfrontdoc"
                    className={`form-group files mx-auto  adtInfo-fileSignup position-relative `}
                    ref={frontDoc}
                    onDrop={handleDrop1}
                    onDragEnter={handleDragEnter1}
                    onDragLeave={handleDragLeave1}
                  >
                    <div className="d-flex align-items-center">
                      <div className="additionalText text-center mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                        {/* <span className="">{upload}</span> */}
                        <div
                          style={{ lineBreak: "anywhere", fontSize: "12px" }}
                        >
                          {setOne(selectedFile_1, selectedFile_1.name, "")}
                        </div>
                        <p
                          className="mb-0 pt-2 mt-2"
                          style={{
                            border: "1.5px solid #00F0FF",
                            // marginLeft: "25%",
                            color: "#00F0FF",
                            borderRadius: "0.3rem",
                            height: "40px",
                            width: "150px",
                          }}
                        >
                          Choose a file
                        </p>
                        <p className="mb-0 px-2 mt-2 p-1">Or drop a file</p>
                      </div>
                      <input
                        type="file"
                        className="custome"
                        id="kycdocfrontdoc"
                        name="front"
                        max-size="2048"
                        required
                        // value={selectedFile_1}
                        onChange={(e) => __onFileChange_1(e)}
                        accept=".doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </label>
                </div>
              </div>
              <p
                className="d-flex flex-column align-items-center mt-4 py-4"
                style={{ fontSize: "0.9vw", color: "#515151" }}
              >
                Only JPEG, PNG, JPG <br /> files with Max size of 2MB.
              </p>
            </div>
            <div>
              <p>2. Upload back Image</p>
              <div className="additionalText">
                <span className="d-flex justify-content-center mt-2">
                  {upload}
                </span>
                <div className="mb-4">
                  <label
                    htmlFor="kycbackdoc"
                    className={`form-group files mx-auto  adtInfo-fileSignup position-relative `}
                    ref={frontDoc}
                    onDrop={handleDrop2}
                    onDragEnter={handleDragEnter2}
                    onDragLeave={handleDragLeave2}
                  >
                    <div className="d-flex align-items-center">
                      <div className="additionalText text-center mx-auto d-flex flex-column justify-content-center align-items-center h-100">
                        {/* <span className="">{upload}</span> */}
                        <div
                          style={{ lineBreak: "anywhere", fontSize: "12px" }}
                        >
                          {setOne(selectedFile_2, selectedFile_2.name, "")}
                        </div>
                        <p
                          className="mb-0 pt-2 mt-2 "
                          style={{
                            border: "1.5px solid #00F0FF",
                            // marginLeft: "25%",
                            color: "#00F0FF",
                            borderRadius: "0.3rem",
                            height: "40px",
                            width: "150px",
                          }}
                        >
                          Choose a file
                        </p>
                        <p className="mb-0 px-2 mt-2 p-1">Or drop a file</p>
                      </div>
                      <input
                        type="file"
                        className="custome"
                        id="kycbackdoc"
                        name="front"
                        max-size="2048"
                        required
                        // value={selectedFile_1}
                        onChange={(e) => __onFileChange_2(e)}
                        accept=".doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </label>
                </div>
              </div>
              <p
                className="d-flex flex-column align-items-center mt-4 py-4"
                style={{ fontSize: "0.9vw", color: "#515151" }}
              >
                Only JPEG, PNG, JPG <br /> files with Max size of 2MB.
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            {selectedFile_1 && selectedFile_2 ? (
              <button
                className="enable-button-document"
                disabled={btnLoader || btnDisable}
                onClick={__onSubmit}
              >
                {condition(
                  btnLoader,
                  <img
                    src={refresh_loader}
                    style={{ width: 20 }}
                    className="spinner"
                    alt=""
                  />,
                  null
                )}
                Submit
              </button>
            ) : (
              <button className="enable-button-document" disabled>
                Submit
              </button>
            )}
          </div>

          {fileErrorMessage && (
            <p className="text-center" style={{ color: "#d73749" }}>
              {fileErrorMessage}
            </p>
          )}
        </div>
      );
    }
  };

  useEffect(() => {
    getCustSettings();
    fetchUserData();
  }, []);

  return isLoading ? (
    <div className="settingsRightSecActivity mx-auto">
      <div className="d-flex justify-content-center align-content-center h-auto">
        <img src={loader} alt="loader" width={200} />
      </div>
    </div>
  ) : (
    <div className="mx-auto d-flex justify-content-center">
      {__getCurrentView()}
    </div>
  );
};

export default UploadDocument;
