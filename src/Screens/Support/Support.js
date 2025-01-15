import React, { useRef, useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import SideBar from "../../components/SideBar/SideBar";
import { condition } from "../../components/commonComponent";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { URI } from "../../constants";
import uploadFile from "../../assets/Upload File.svg";
import refresh_loader from "../../assets/refresh_loader.svg";
import "./Support.css";

const Support = () => {
  const [toggle, setToggle] = useState(false);
  const fileInputRef = useRef(null);

  const [supportFormData, setsupportFormData] = useState({
    name: "",
    from: "",
    subject: "",
    message: "",
    attachments: "",
  });
  const { handleSubmit } = useForm();
  const [supportMsg, setSupportMsg] = useState("");
  const [supportMsgShow, setSupportMsgShow] = useState(false);
  const [supportErrShow, setSupportErrShow] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);

  const { fullName, email_id, customerInfo } = useSelector(
    (stat) => stat.ChangeState
  );

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const handleSupportFormChange = (event) => {
    setsupportFormData((prevItems) => {
      return {
        ...prevItems,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSupportSubmit = async () => {
    setBtnLoader(true);
    let formData = new FormData();
    formData.append("name", fullName);
    formData.append("from", email_id);
    formData.append("subject", supportFormData.subject);
    formData.append("message", supportFormData.message);
    if (supportFormData.attachments !== "") {
      formData.append("attachments", supportFormData.attachments);
    }
    const response = await axios.post(
      URI.submitSupport,
      formData,

      {
        headers: headers,
      }
    );
    if (response.data.status === 200) {
      fileInputRef.current.value = "";
      setSupportMsg(response.data.message);
      resetForm();
      setSupportMsgShow(true);
      setBtnLoader(false);

      setTimeout(() => {
        setSupportMsgShow(false);
      }, 4000);
    } else {
      setSupportMsg(response.data.message);
      setSupportErrShow(true);
      setTimeout(() => {
        setSupportErrShow(false);
      }, 4000);
      setBtnLoader(false);
    }
  };

  const resetForm = () => {
    const updatedFormData = { ...supportFormData };
    updatedFormData.subject = "";
    updatedFormData.message = "";
    updatedFormData.attachments = null;
    setsupportFormData(updatedFormData);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      const errorMessage = `You can select maximum 3 files.`;
      fileInputRef.current.value = "";
      setFileErrorMessage(errorMessage);
      setTimeout(() => {
        setFileErrorMessage("");
      }, 5000);
    } else {
      const selectedFiles = e.target.files;
      const maxSize = 2 * 1024; // 2MB in kilobytes

      const validFiles = [];
      const invalidFiles = [];

      for (const file of selectedFiles) {
        const fileSizeInKB = file.size / 1024;

        if (fileSizeInKB > maxSize) {
          invalidFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      }

      if (invalidFiles.length > 0) {
        const errorMessage = `The following file(s) exceed the 2MB limit: ${invalidFiles.join(
          ", "
        )}`;
        const fileInput = document.getElementById("attachFile"); // replace with your actual input ID
        fileInput.value = "";
        setFileErrorMessage(errorMessage);
        setTimeout(() => {
          setFileErrorMessage("");
        }, 5000);
      } else {
        const updatedFormData = { ...supportFormData };
        updatedFormData.attachments = validFiles;
        setsupportFormData(updatedFormData);
      }
    }
  };

  const commonInputChangeLogic = (e) => {
    return (
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g.test(
        e.target.value
      ) === false &&
      e.target.value.charAt(0) !== " " &&
      !e.target.value.includes("  ")
    );
  };

  return (
    <>
      <div
        className={
          toggle
            ? "dashboard_toggle_main_container"
            : "dashboard_profile_container"
        }
      >
        <SideBar activePage={"support"} setToggle={setToggle} toggle={toggle} />
        <div className="ms-3 dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
          <div>
            <Topbar />
          </div>

          <article className="spotAsset_main_contentContainer w-100  gap-4 d-flex justify-content-center align-items-center flex-column">
            <div className="accountSection w-100">
              <div className="px-3 py-3 ">
                <h3 className="pt-1 ps-4 ms-2">Support</h3>
              </div>
              <div className=" ps-5 ms-1 mx-auto text-center" style={{width:"85vw"}}>
                {/* <div className="d-flex pt-4"> */}
                  <div className="supportInputContent p-4 rounded-2">
                    <form
                      method="POST"
                      encType="multipart/form-data"
                      onSubmit={(e) =>
                        // handleSubmit(
                        //   supportFormData.message.trim().length > 2 &&
                        //     supportFormData.subject.trim().length > 2 &&
                        //     handleSupportSubmit
                        // )
                        {
                          e.preventDefault();
                          console.log("API call");

                          setSupportMsg("Sorry, API is not implemented yet.");
                          setSupportErrShow(true);
                          setTimeout(() => {
                            setSupportErrShow(false);
                          }, 4000);
                        }
                      }
                    >
                      <div className="mainform_conatiner d-flex justify-content-between px-2 gap-3">
                        <div className="leftside_form_container d-flex flex-column gap-2">
                          <div className="pt-3">
                            <div className="d-flex px-2 py-1">
                              <label className="opacity-50">Name</label>
                            </div>
                            <input
                              type="text"
                              name="name"
                              className="supportInputType common_input_bg"
                              defaultValue={
                                customerInfo !== undefined
                                  ? `${customerInfo.firstName} ${customerInfo.custMiddleName} ${customerInfo.lastName}`
                                  : ""
                              }
                              required
                              readOnly
                              autoComplete="off"
                            />
                          </div>
                          <div className="pt-4">
                            <div className="d-flex px-2 py-1">
                              <label className="opacity-50">Email</label>
                            </div>
                            <input
                              type="text"
                              name="from"
                              className="supportInputType common_input_bg"
                              value={email_id}
                              readOnly
                              onPaste={(event) => event.preventDefault()}
                              onCopy={(event) => event.preventDefault()}
                            />
                          </div>
                          <div className="pt-4">
                            <div className="d-flex px-2 py-1">
                              <label className="opacity-50">Subject</label>
                            </div>
                            <input
                              type="text"
                              name="subject"
                              className="supportInputType common_input_bg"
                              value={
                                supportFormData.subject
                                  ? supportFormData.subject.replace(
                                      /[^a-zA-Z0-9\s]/g,
                                      ""
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                commonInputChangeLogic(e) &&
                                handleSupportFormChange(e)
                              }
                              required
                              autoComplete="off"
                              onPaste={(event) => event.preventDefault()}
                              onCopy={(event) => event.preventDefault()}
                            />
                          </div>
                        </div>
                        <div className="rightside_form_container d-flex flex-column gap-2">
                          <div className="query_container pt-3">
                            <div className="d-flex px-2  py-1">
                              <label className="opacity-50">Query</label>
                            </div>
                            <textarea
                              name="message"
                              className="supportInputTypeQuery common_input_bg"
                              onChange={(e) =>
                                commonInputChangeLogic(e) &&
                                handleSupportFormChange(e)
                              }
                              value={
                                supportFormData.message
                                  ? supportFormData.message.replace(
                                      /[^a-zA-Z0-9\s]/g,
                                      ""
                                    )
                                  : ""
                              }
                              required
                              autoComplete="off"
                              onPaste={(event) => event.preventDefault()}
                              onCopy={(event) => event.preventDefault()}
                            />
                          </div>
                          <div className="attach_file_conatiner pt-2">
                            <div className="d-flex px-2 py-2 mt-1">
                              <label className="opacity-50">
                                Attach file (Optional)
                              </label>
                            </div>

                            <div className="d-flex justify-content-between align-items-center px-2 position-relative">
                              <input
                                type="file"
                                name="attachments"
                                max-size="2048"
                                className="supportInputTypeAttachfile common_input_bg"
                                onChange={(e) => handleFileChange(e)}
                                accept=".jpg,.jpeg,.png,.pdf"
                                multiple
                                ref={fileInputRef}
                                id="attachFile"
                              />

                              <span className="uploadFile">
                                <img src={uploadFile} alt="uploadfile" />
                              </span>
                            </div>

                            <div className="d-flex flex-column px-2">
                              <p className="activeColor d-flex flex-column px-2 py-1">
                                Supported file types: PDF,JPG,JPEG,PNG
                                <span>
                                  {" "}
                                  {fileErrorMessage && (
                                    <p className="text-center mt-2 text-danger">
                                      {fileErrorMessage}
                                    </p>
                                  )}{" "}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {supportFormData.message.length > 2 &&
                      supportFormData.subject.length > 2 ? (
                        <div className="d-flex justify-content-center py-2">
                          <button
                            type="submit"
                            className={condition(
                              btnLoader,
                              "disable_formSubmit_button text-muted rounded-1 border-0 fw-bold py-3",
                              "formSubmit_button text-white rounded-1 border-0 fw-bold py-3"
                            )}
                            disabled={btnLoader}
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
                            )}{" "}
                            Submit
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center py-2">
                          <button
                            type="submit"
                            className="disable_formSubmit_button text-muted rounded-1 border-0 fw-bold py-3"
                            disabled
                          >
                            Submit
                          </button>
                        </div>
                      )}

                      {condition(
                        supportMsgShow,
                        <div
                          className="text-center"
                          style={{ color: "#13a919" }}
                        >
                          {supportMsg}
                        </div>,
                        <></>
                      )}
                      {condition(
                        supportErrShow,
                        <div
                          className="text-center"
                          style={{ color: "#FA5a5A" }}
                        >
                          {supportMsg}
                        </div>,
                        <></>
                      )}
                    </form>
                  </div>
                {/* </div> */}
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Support;
