import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { URI } from "../../../constants";
import { Modal } from "react-bootstrap";
import loader from "../../../assets/loaderMobile.gif";
import "../Settings.css";
import { encryptedPayload } from "../../../components/commonComponent";

const masterSvg = (
  <svg
    width="34"
    height="34"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_2448_929)">
      <path
        d="M62.7414 56.1168V56.2448H62.8607C62.8831 56.2452 62.9052 56.2395 62.9247 56.2285C62.9325 56.223 62.9388 56.2156 62.943 56.2071C62.9472 56.1985 62.9491 56.189 62.9487 56.1795C62.9491 56.1702 62.9471 56.1609 62.9429 56.1526C62.9387 56.1442 62.9325 56.1371 62.9247 56.1318C62.9054 56.1203 62.8832 56.1146 62.8607 56.1155H62.7414V56.1168ZM62.862 56.0262C62.9132 56.0231 62.9638 56.0378 63.0054 56.0678C63.022 56.0815 63.0352 56.0988 63.044 56.1185C63.0527 56.1382 63.0567 56.1596 63.0556 56.1811C63.0564 56.1996 63.0532 56.2181 63.0462 56.2352C63.0393 56.2524 63.0287 56.2679 63.0153 56.2806C62.9833 56.3085 62.9431 56.3252 62.9007 56.3283L63.0607 56.5107H62.9375L62.7903 56.3296H62.7426V56.5107H62.6396V56.0266H62.8636L62.862 56.0262ZM62.83 56.6778C62.884 56.6783 62.9376 56.6674 62.9871 56.6458C63.0349 56.6252 63.0783 56.5958 63.1151 56.559C63.152 56.5224 63.1814 56.4789 63.2018 56.431C63.2438 56.3296 63.2438 56.2157 63.2018 56.1142C63.1811 56.0666 63.1517 56.0231 63.1151 55.9862C63.0783 55.9495 63.0349 55.9201 62.9871 55.8995C62.9373 55.8791 62.8839 55.8689 62.83 55.8694C62.7752 55.8689 62.7209 55.8792 62.67 55.8995C62.6212 55.9197 62.5767 55.9491 62.5391 55.9862C62.4825 56.0443 62.4442 56.1177 62.429 56.1974C62.4139 56.2771 62.4224 56.3594 62.4537 56.4342C62.4732 56.4823 62.5022 56.5258 62.5391 56.5622C62.5768 56.5993 62.6212 56.6288 62.67 56.649C62.7206 56.6706 62.775 56.6814 62.83 56.681M62.83 55.753C62.9706 55.7528 63.1057 55.808 63.206 55.9066C63.2544 55.9539 63.2929 56.0103 63.3193 56.0726C63.3466 56.1366 63.3607 56.2055 63.3607 56.275C63.3607 56.3446 63.3466 56.4135 63.3193 56.4774C63.2923 56.5394 63.2538 56.5957 63.206 56.6435C63.1569 56.6906 63.0998 56.7285 63.0374 56.7555C62.9718 56.7834 62.9012 56.7975 62.83 56.7971C62.7579 56.7976 62.6865 56.7835 62.6201 56.7555C62.5569 56.7292 62.4993 56.6912 62.4502 56.6435C62.4023 56.594 62.3644 56.5358 62.3385 56.472C62.3111 56.408 62.297 56.3392 62.297 56.2696C62.297 56.2 62.3111 56.1312 62.3385 56.0672C62.3649 56.0049 62.4034 55.9485 62.4518 55.9011C62.5002 55.8527 62.558 55.8146 62.6217 55.7891C62.6881 55.7612 62.7595 55.747 62.8316 55.7475M13.8316 53.8832C13.8316 52.96 14.4364 52.2016 15.4249 52.2016C16.3695 52.2016 17.007 52.9274 17.007 53.8832C17.007 54.839 16.3695 55.5648 15.4249 55.5648C14.4364 55.5648 13.8316 54.8064 13.8316 53.8832M18.0838 53.8832V51.256H16.9417V51.896C16.5794 51.423 16.03 51.1264 15.2828 51.1264C13.8108 51.1264 12.6556 52.281 12.6556 53.8845C12.6556 55.488 13.8102 56.6426 15.2828 56.6426C16.0297 56.6426 16.5794 56.3456 16.9417 55.873V56.5107H18.0825V53.8832H18.0838ZM56.6732 53.8832C56.6732 52.96 57.278 52.2016 58.2668 52.2016C59.2124 52.2016 59.8489 52.9274 59.8489 53.8832C59.8489 54.839 59.2124 55.5648 58.2668 55.5648C57.2783 55.5648 56.6732 54.8064 56.6732 53.8832ZM60.9266 53.8832V49.1472H59.7836V51.896C59.4214 51.423 58.8719 51.1264 58.1247 51.1264C56.6527 51.1264 55.4975 52.281 55.4975 53.8845C55.4975 55.488 56.6521 56.6426 58.1247 56.6426C58.8719 56.6426 59.4214 56.3456 59.7836 55.873V56.5107H60.9266V53.8832ZM32.2585 52.1475C32.9945 52.1475 33.4671 52.609 33.5878 53.4214H30.8626C30.9846 52.663 31.445 52.1475 32.2588 52.1475M32.2815 51.1235C30.7423 51.1235 29.6655 52.2435 29.6655 53.8816C29.6655 55.5517 30.7855 56.6397 32.358 56.6397C33.149 56.6397 33.8735 56.4422 34.511 55.9037L33.9513 55.0573C33.511 55.4093 32.9503 55.6067 32.4233 55.6067C31.6873 55.6067 31.0172 55.2659 30.8524 54.3203H34.7522C34.7634 54.1782 34.775 54.0349 34.775 53.8813C34.7634 52.2438 33.751 51.1232 32.2809 51.1232M46.0697 53.8813C46.0697 52.9581 46.6745 52.1997 47.663 52.1997C48.6076 52.1997 49.245 52.9254 49.245 53.8813C49.245 54.8371 48.6076 55.5629 47.663 55.5629C46.6745 55.5629 46.0694 54.8045 46.0694 53.8813M50.3215 53.8813V51.256H49.1801V51.896C48.8166 51.423 48.2684 51.1264 47.5212 51.1264C46.0492 51.1264 44.894 52.281 44.894 53.8845C44.894 55.488 46.0486 56.6426 47.5212 56.6426C48.2684 56.6426 48.8166 56.3456 49.1801 55.873V56.5107H50.3218V53.8832L50.3215 53.8813ZM39.6201 53.8813C39.6201 55.4746 40.7292 56.6394 42.422 56.6394C43.213 56.6394 43.7401 56.4634 44.31 56.0131L43.7615 55.0899C43.3327 55.3981 42.8825 55.5629 42.3855 55.5629C41.4738 55.5517 40.8034 54.8925 40.8034 53.8813C40.8034 52.8701 41.4738 52.2112 42.3855 52.1997C42.8812 52.1997 43.3314 52.3645 43.7615 52.6726L44.31 51.7494C43.7391 51.2992 43.2121 51.1232 42.422 51.1232C40.7292 51.1232 39.6201 52.2877 39.6201 53.8813M54.3433 51.1232C53.6844 51.1232 53.2553 51.4314 52.9586 51.8928V51.256H51.8268V56.5078H52.9702V53.5638C52.9702 52.6947 53.3436 52.2118 54.0902 52.2118C54.3346 52.2083 54.5774 52.2532 54.8044 52.344L55.1564 51.2675C54.9036 51.168 54.574 51.1242 54.3426 51.1242M23.7302 51.6736C23.1807 51.3114 22.4236 51.1242 21.5884 51.1242C20.2578 51.1242 19.4012 51.7619 19.4012 52.8054C19.4012 53.6618 20.039 54.1901 21.2134 54.3549L21.7529 54.4317C22.3791 54.5197 22.6748 54.6845 22.6748 54.9811C22.6748 55.3872 22.2588 55.6189 21.4777 55.6189C20.6866 55.6189 20.1158 55.3661 19.7308 55.0694L19.1942 55.96C19.8204 56.4214 20.6114 56.6416 21.4681 56.6416C22.9849 56.6416 23.8639 55.9274 23.8639 54.9274C23.8639 54.0042 23.1721 53.5213 22.029 53.3565L21.4908 53.2784C20.9964 53.2144 20.6002 53.1149 20.6002 52.7629C20.6002 52.3789 20.9737 52.1478 21.6002 52.1478C22.2706 52.1478 22.9196 52.4006 23.2377 52.5981L23.7321 51.6749L23.7302 51.6736ZM38.4665 51.1251C37.8076 51.1251 37.3785 51.4333 37.0831 51.8947V51.256H35.9513V56.5078H37.0934V53.5638C37.0934 52.6947 37.4668 52.2118 38.2134 52.2118C38.4578 52.2083 38.7006 52.2532 38.9276 52.344L39.2796 51.2675C39.0268 51.168 38.6972 51.1242 38.4658 51.1242M28.7206 51.256H26.853V49.6627H25.6985V51.256H24.6332V52.2998H25.6985V54.6957C25.6985 55.9142 26.1714 56.64 27.5225 56.64C28.0182 56.64 28.589 56.4864 28.9513 56.2339L28.6214 55.256C28.2806 55.4534 27.9071 55.553 27.6102 55.553C27.0393 55.553 26.853 55.201 26.853 54.6739V52.3008H28.7206V51.256ZM11.6457 56.5091V53.2131C11.6457 51.9718 10.8546 51.1366 9.57945 51.1254C8.90905 51.1142 8.21753 51.3229 7.73337 52.0598C7.37113 51.4774 6.80025 51.1254 5.99769 51.1254C5.43673 51.1254 4.88857 51.2902 4.45945 51.9053V51.256H3.31641V56.5078H4.46841V53.5958C4.46841 52.6842 4.97401 52.1997 5.75481 52.1997C6.51321 52.1997 6.89689 52.6941 6.89689 53.5843V56.5072H8.05145V53.5952C8.05145 52.6835 8.57849 52.199 9.33657 52.199C10.1164 52.199 10.4886 52.6934 10.4886 53.5837V56.5066L11.6457 56.5091Z"
        fill="white"
      />
      <path
        d="M63.3934 39.039V38.271H63.1934L62.9621 38.7981L62.732 38.271H62.5314V39.039H62.6734V38.4605L62.8898 38.9597H63.037L63.2533 38.4592V39.039H63.3941H63.3934ZM62.1246 39.039V38.4025H62.3806V38.2729H61.7266V38.4025H61.9826V39.039H62.1234H62.1246Z"
        fill="#F79410"
      />
      <path
        d="M40.6591 42.3328H23.3516V11.2288H40.6594L40.6591 42.3328Z"
        fill="#FF5F00"
      />
      <path
        d="M24.448 26.7813C24.448 20.4719 27.4022 14.8514 32.0026 11.2293C28.5204 8.48354 24.2134 6.99332 19.7789 6.99987C8.85504 6.99987 0 15.8562 0 26.7813C0 37.7064 8.85504 46.5627 19.7789 46.5627C24.2135 46.5694 28.5206 45.0791 32.0029 42.3333C27.4029 38.7119 24.448 33.0911 24.448 26.7813Z"
        fill="#EB001B"
      />
      <path
        d="M64.0045 26.7815C64.0045 37.7066 55.1494 46.5629 44.2256 46.5629C39.7905 46.5694 35.483 45.0792 32 42.3335C36.6016 38.7114 39.5558 33.0912 39.5558 26.7815C39.5558 20.4717 36.6016 14.8516 32 11.2295C35.4829 8.48379 39.7903 6.9936 44.2253 7.00004C55.1491 7.00004 64.0042 15.8564 64.0042 26.7815"
        fill="#F79E1B"
      />
    </g>
    <defs>
      <clipPath id="clip0_2448_929">
        <rect
          width="64"
          height="49.792"
          fill="white"
          transform="translate(0 7)"
        />
      </clipPath>
    </defs>
  </svg>
);

const visaSvg = (
  <svg
    width="34"
    height="34"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28.4198 40.4464H24.0248L26.7717 23.5654H31.1671L28.4198 40.4464ZM20.3275 23.5654L16.1375 35.1763L15.6417 32.676L15.6422 32.6769L14.1633 25.0854C14.1633 25.0854 13.9845 23.5654 12.0785 23.5654H5.15159L5.07031 23.8513C5.07031 23.8513 7.18856 24.292 9.66761 25.7808L13.486 40.4469H18.0652L25.0576 23.5654H20.3275ZM54.8964 40.4464H58.932L55.4134 23.565H51.8805C50.249 23.565 49.8516 24.823 49.8516 24.823L43.2968 40.4464H47.8783L48.7945 37.9389H54.3816L54.8964 40.4464ZM50.0602 34.475L52.3695 28.1578L53.6686 34.475H50.0602ZM43.6405 27.6249L44.2677 23.9998C44.2677 23.9998 42.3323 23.2638 40.3147 23.2638C38.1337 23.2638 32.9544 24.217 32.9544 28.8523C32.9544 33.2134 39.0332 33.2676 39.0332 35.5583C39.0332 37.8491 33.5807 37.4386 31.7812 35.9941L31.1278 39.7844C31.1278 39.7844 33.0903 40.7377 36.0886 40.7377C39.0879 40.7377 43.6125 39.1848 43.6125 34.9582C43.6125 30.5691 37.479 30.1604 37.479 28.2521C37.4794 26.3434 41.7597 26.5886 43.6405 27.6249Z"
      fill="white"
    />
    <path
      d="M15.6422 32.6764L14.1633 25.0849C14.1633 25.0849 13.9845 23.5649 12.0785 23.5649H5.15159L5.07031 23.8508C5.07031 23.8508 8.39964 24.5408 11.593 27.1259C14.6465 29.5968 15.6422 32.6764 15.6422 32.6764Z"
      fill="white"
    />
  </svg>
);

const LinkedCard = ({ linkedTab, index }) => {
  const [creditCardList, setCreditCardList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { customerId } = useSelector((state) => state.ChangeState);

  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  };

  const __getAuthToken = async () => {
    window.sessionStorage.clear();
    window.history.forward();
    window.location.pathname = "/";
  };

  const __errorCheck = (__error) => {
    if (__error.response) {
      if (__error.response.status === 400) {
        __getAuthToken();
      }
    }
  };

  const fetchCardDetails = async () => {
    await axios
      .get(URI.fetchCreditCard + customerId, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          setCreditCardList(response.data.data.creditCardDetaiList);
          setIsLoading(false);
        } else {
          setCreditCardList([]);
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        __errorCheck(error);
      });
  };

  const handleClickDelete = (deletedCardKeyArg) => {
    setIsLoading(true);
    let encryptedRequestBody;
    const cardName = creditCardList[deletedCardKeyArg].cardName;
    const __reqBody = {
      customerId: customerId,
      cardName,
    };
    encryptedRequestBody = encryptedPayload(__reqBody);
    axios
      .post(
        URI.deleteCreditCard,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      )
      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          fetchCardDetails();
          setSuccessMsg(response.data.message);
          setIsLoading(false);
          setTimeout(() => {
            setSuccessMsg("");
            setShowDeleteModal(false);
          }, 2000);
        } else {
          setErrorMsg(response.data.message);
          setIsLoading(false);
          setTimeout(() => {
            setShowDeleteModal(false);
            setErrorMsg("");
          }, 2000);
        }
      })
      .catch(function (error) {
        __errorCheck(error);
      });
  };

  useEffect(() => {
    if (linkedTab === "card") {
      fetchCardDetails();
    }
  }, [linkedTab]);

  const credit = (__item, key) => {
    return (
      <div>
        <div className={`card_details ms-4`} key={key}>
          <div className="d-flex">
            <div className="mt-2">. {key + 1}</div>
            <div
              className={`card1 text-white ${
                __item.cardNetwork === "Visa"
                  ? "card1_visa ms-4 mb-4"
                  : "card1_mc ms-4 mb-4"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center px-2">
                <span className="">Card Number</span>
                <span>
                  {__item.cardNetwork === "Visa" ? visaSvg : masterSvg}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center px-2 my-1">
                <div className="cardNumber mb-1">
                  <span className="stars_card">**** **** ****</span>
                  <span className="px-1">{__item.lastFour}</span>
                </div>
              </div>
              <div className="px-2">
                <span className="float-end">
                  <span className="holderNameLabel small">Exp:</span>
                  <span className="small px-1">
                    {__item.creditCardExpireDate.slice(0, 2)} /
                    {" " + __item.creditCardExpireDate.slice(-2)}
                  </span>
                </span>
              </div>
              <div className="d-flex justify-content-between p-2">
                <span className="d-flex flex-column">
                  <span style={{ fontSize: "14px" }}>
                    {__item.creditCardName}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const creditCardListText = () => {
    if (creditCardList.length > 0) {
      return (
        <div>
          {creditCardList.map((__item, key) => {
            return credit(__item, key);
          })}
        </div>
      );
    } else {
      return (
        <p
          className="text-center"
          style={{ color: "white", fontSize: "1.5rem", marginLeft: "-8%" }}
        >
          No card found. Please add a card.
        </p>
      );
    }
  };

  return (
    <div>
      {isLoading === true ? (
        <div className="get-bank-details-loader">
          <img src={loader} alt="loader" width={200} />
        </div>
      ) : (
        <div>{creditCardListText()}</div>
      )}

      <div>
        <Modal
          show={showDeleteModal}
          id="deleteBeneficiaryModal"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Body>
            <div className="deleteBeneficiaryModal_content">
              <div
                className="text-white"
                style={{
                  backgroundColor: "rgba(79, 79, 79, 1)",
                  padding: "30px",
                }}
              >
                <div className="fs-5 mb-4">Delete Card</div>
                <div
                  className="small"
                  style={{ color: "rgba(197, 197, 197, 1)" }}
                >
                  Are you sure you want to delete this card? This action can not
                  be undone.
                </div>
                <div className="text-center mt-2">
                  {successMsg && (
                    <span className="password_success_msg text-success">
                      {successMsg}
                    </span>
                  )}
                  {errorMsg && errorMsg !== "" ? (
                    <span
                      className="password_success_msg text-danger"
                      style={{ color: "rgb(246, 90, 90)" }}
                    >
                      {errorMsg}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="delete_buttons_ben d-flex justify-content-end align-items-center gap-3 text-white small">
                <span
                  style={{ color: "rgba(197, 197, 197, 1)" }}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </span>
                <button
                  disabled={isLoading}
                  className="text-white delete_btn_ben py-0"
                  style={{ height: "1.6rem" }}
                  onClick={(event) => {
                    handleClickDelete(event);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default LinkedCard;
