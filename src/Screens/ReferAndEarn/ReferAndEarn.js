import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import "../../components/Dashboard/dashboard.css";
import "./ReferAndEarn.css";
import DIAM_refer from "../../assets/DIAM_Refer.png";
import DIAM_Amount from "../../assets/DIAM_Amount.png";
import Topbar from "../../components/Topbar/Topbar";
import { emailValidation } from "../../components/common/commonMethods";
import { useSelector } from "react-redux";
import axios from "axios";
import { URI } from "../../constants";
import { encryptedPayload } from "../../components/commonComponent";
import { MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReferAndEarn = () => {
  const [toggle, setToggle] = useState(false);
  const [mail, setMail] = useState("");
  const [validMail, setValidMail] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [referralData, setReferralData] = useState([]);

  const { isFromDashboard } = useSelector((stat) => stat.ChangeState);
  const { customerId, referralCode } = useSelector((stat) => stat.ChangeState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const inviteByEmail = async () => {
    let encryptedRequestBody;

    setBtnLoader(true);

    let req_body = {
      customerId: customerId,
      email: inviteEmail,
    };
    encryptedRequestBody = encryptedPayload(req_body);

    await axios
      .post(
        URI.referralInvite,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          setInviteEmail(" ");
          setBtnLoader(false);
          // setInviteSuccessModel(true);
        } else {
          // setEmailExistMsg(response.data.message);
          console.log(response.data.message);
        }
        setBtnLoader(false);
      })
      .catch(function (error) {
        console.log(error);
        setBtnLoader(false);
      });
  };

  const getReferralDetails = async () => {
    let requestBody = {
      customerId: customerId,
      pageNo: 1,
      pageSize: 10,
    };

    await axios
      .post(URI.getRefDetail, requestBody, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setReferralData(response.data.data.getUserReferalDetls);
        } else {
          setReferralData([]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getReferralDetails();
  }, []);

  const onCopyText = () => {
    toast.info("Referral code copied");
  };

  return (
    <div
      // className={
      //   toggle
      //     ? "dashboard_toggle_main_container"
      //     : "dashboard_profile_container"
      // }
      className={
        toggle
          ? `${
              isFromDashboard
                ? "dashboard_main_container"
                : "dashboard_toggle_main_container"
            }`
          : `${
              isFromDashboard
                ? "dashboard_main_container"
                : "dashboard_profile_container"
            }`
      }
    >
      {/* sidebar container */}
      <SideBar activePage={"refer"} setToggle={setToggle} toggle={toggle} />
      <section className="dashboard_rightSide_main_container d-flex flex-column gap-2 py-2">
        <header className="ps-4">
          <Topbar />
        </header>
        <h5 className="text-white text-start ms-5 ps-4">Refer & Earn</h5>
        {/* <main className="mx-5 d-flex gap-4 pe-5 refer_page">Main</main> */}
        <main
          className="common_border_bg rounded-2 py-5 mt-3 ps-4 refer_page"
          style={{ margin: "auto 72px" }}
        >
          <div className="d-flex justify-content-between ps-3 pb-3">
            <div className="">
              <h5 className="text-start mt-2 mb-5">
                Refer CHAIN XCHANGE to your friends & Earn DIAM!
              </h5>
              <div className="d-flex gap-4">
                <div className="refer_field rounded-2 d-flex justify-content-between">
                  <input
                    type="text"
                    placeholder="Referral code"
                    className="bg-transparent border-0 text-white"
                    // value={referral.toLocaleUpperCase()}
                    // onChange={(e) => {
                    //   setReferral(e.target.value);
                    // }}
                    readOnly
                    value={`Referral Code: ${referralCode}`}
                  />
                  {/* <button className="btn-primary btn px-3 py-0">Copy</button> */}
                  <CopyToClipboard
                    onCopy={onCopyText}
                    text={referralCode}
                    style={{
                      padding: "0 8px",
                      margin: "6px 0",
                      // color: "#236dff",
                      borderRadius: "5px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "1vw",
                    }}
                  >
                    <span className="copybtn" style={{ fontSize: "10px" }}>
                      <MdContentCopy />
                    </span>
                  </CopyToClipboard>
                </div>
                <div className="refer_field rounded-2">
                  <input
                    type="text"
                    placeholder="Enter email ID"
                    className="bg-transparent border-0 text-white py-2 ps-1"
                    value={inviteEmail}
                    // onChange={(e) => {
                    //   if (referral.length > 5) setInviteEmail(e.target.value);
                    //   setValidMail(emailValidation(e.target.value));
                    // }}
                    onChange={(e) => {
                      if (![" "].includes(e.target.value)) {
                        setInviteEmail(e.target.value);
                        setIsValid(
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                            e.target.value
                          )
                        );
                      }
                    }}
                  />
                  <button
                    className="btn-primary btn px-3 py-0 ms-0"
                    // disabled={!validMail}
                    disabled={!isValid}
                    onClick={() => {
                      inviteByEmail();
                      // setTimeout(() => {
                      //   setBtnLoader(false);
                      // }, 500);
                    }}
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
            <div className="">
              <img src={DIAM_Amount} alt="" className="w-50 p-3" />
              <img src={DIAM_refer} alt="" className="diam_refer" />
            </div>
          </div>
          <div className="d-flex justify-content-between gap-4 ps-3 my-4 pe-5">
            <div className="common_border_bg rounded-2 p-3 w-50">
              <h6 className="text-start">They’ll get</h6>
              <div className="ps-2 d-flex flex-column">
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
                <div className="ms-2 vertical_line position-relative">
                  <span className="position-absolute arrow_icon_reward" />
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
              </div>
            </div>
            <div className="common_border_bg rounded-2 p-3 w-50">
              <h6 className="text-start">You’ll get</h6>
              <div className="ps-2 d-flex flex-column">
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
                <div className="ms-2 vertical_line position-relative">
                  <span className="position-absolute arrow_icon_reward" />
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
                <div className="ms-2 vertical_line position-relative">
                  <span className="position-absolute arrow_icon_reward" />
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum</div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between gap-4 ps-3 mt-4 pe-5">
            <div className="common_border_bg rounded-2 p-3 w-50">
              <h6 className="text-start border-bottom pb-3 border-secondary">
                Friends invited
              </h6>
              <div className="ps-2">
                {referralData.length !== 0 ? (
                  <>
                    {referralData.map((referral, index) => (
                      <div
                        className="d-flex align-items-center border-bottom border-dark py-2"
                        key={index}
                      >
                        <span className="col-3 text-start">
                          {referral.referredCustName}
                        </span>
                        <span className="col-5 small opacity-50">
                          {referral.transactionTimestamp}
                        </span>
                        <span className="col-4 text-end">
                          {"DIAM " + referral.referralAmount}{" "}
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="21"
                              viewBox="0 0 20 21"
                              fill="none"
                            >
                              <circle
                                cx="10.2441"
                                cy="10.624"
                                r="9.67476"
                                fill="#0BCD41"
                              />
                              <path
                                d="M6.37427 10.6212L8.9542 13.5236L14.1141 7.71875"
                                stroke="black"
                                stroke-width="0.967476"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    className="d-flex flex-column"
                    style={{ fontSize: "1vw", height: "25vh" }}
                  >
                    <h5
                      style={{
                        fontSize: "1.2vw",
                        marginTop: "50px",
                        color: "#F5F5F599",
                        opacity: "0.6",
                      }}
                    >
                      Oops! Empty referrals? Let's change that.
                    </h5>
                  </div>
                )}
              </div>
            </div>
            <div className="common_border_bg rounded-2 p-3 w-50">
              <h6 className="text-start border-bottom pb-3 border-secondary">
                How it works?
              </h6>
              <div className="ps-2 d-flex flex-column">
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
                <div className="ms-2 vertical_line position-relative">
                  <span className="position-absolute arrow_icon_reward" />
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum Lorem ipsum Lorem ipsum Lorem</div>
                </div>
                <div className="ms-2 vertical_line position-relative">
                  <span className="position-absolute arrow_icon_reward" />
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <div className="rounded-circle position-relative outer_circle">
                    <span className="position-absolute rounded-circle inner_circle inner_circle_refer" />
                  </div>
                  <div>Lorem ipsum</div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </section>
    </div>
  );
};

export default ReferAndEarn;
