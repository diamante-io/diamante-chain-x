import React, { useEffect, useState } from "react";
import axios from "axios";
import { URI } from "../../../constants/index";
import loader from "../../../assets/loaderMobile.gif";
import { useSelector } from "react-redux";
import { encryptedPayload,condition } from "../../../components/commonComponent";
import BankCardBg from "../../../assets/BankCardBg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Bank = ({ bank,}) => {
  const [toggleEye, setToggleEye] = useState(false);
  const [toggleEyeSecond, setToggleEyeSecond] = useState(false);

  
 return (
    <>
      <div className="settingsRightSecBottom ">
        <div
          className="settingCard"
          style={{
            backgroundImage: `url(${BankCardBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p style={{ fontSize: "1.2vw" }}>{bank.bankName} </p>
          <span className="stars_card " style={{ fontSize: "1vw" }}>
            Available balance: ${" "}
            <span className="" style={{ fontSize: "1vw" }}>
              {toggleEye ? (
                <>
                  {bank && (
                    <>
                      {bank.balance.toFixed(2)}&ensp;
                      <FaEye onClick={() => setToggleEye(false)} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {bank && (
                    <>
                      xxx-xxx &ensp;
                      <FaEyeSlash onClick={() => setToggleEye(true)} />
                    </>
                  )}
                </>
              )}
            </span>
          </span>

          <br />
          <span className="stars_card " style={{ fontSize: "1vw" }}>
            Account number:
            <span className="px-1" style={{ fontSize: "1vw" }}>
              {toggleEyeSecond ? (
                <>
                  {bank && (
                    <>
                      **** ****&nbsp;{bank.bankAccountNo}&ensp;
                      <FaEye onClick={() => setToggleEyeSecond(false)} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {bank && (
                    <>
                      xxx-xxx-xxx &ensp;
                      <FaEyeSlash onClick={() => setToggleEyeSecond(true)} />
                    </>
                  )}
                </>
              )}
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

const LinkedBank = () => {
  const { customerId } = useSelector((state) => state.ChangeState);

  const [bankDetails, setBankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bankId, setBankId] = useState();
  const [isChangePrimary, setIsChangePrimary] = useState(false);
  const [, setErrMsg] = useState("");

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

  const fetchBankDetails = async () => {
    await axios
      .get(URI.getBankDetails + `${customerId}`, {
        headers: headers,
      })

      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          setIsLoading(false);

          if (response.data.data.length > 0) {
            setBankDetails(response.data.data);
            response.data.data.forEach((bank) => {
              if (bank.isPrimary === "1") {
                setBankId(bank.customerBankId);
              }
            });
          }
        } else {
          setBankDetails([]);
          setIsLoading(false);
          setErrMsg(response.data.message);
        }
      })
      .catch(function (error) {
        __errorCheck(error);
      });
  };

  const postTochangePrimary = async () => {
    let encryptedRequestBody;
    const _xxx = {
      customerId: customerId,
      customerBankId: bankId,
    };
    encryptedRequestBody = encryptedPayload(_xxx);
    await axios
      .post(
        URI.setAsPrimary,
        {
          encryptedRequestBody: encryptedRequestBody,
        },
        {
          headers: headers,
        }
      )

      .then((response) => {
        if (response.data.status === 200 || response.data.status === 201) {
          fetchBankDetails();
        }
      })
      .catch(function (error) {
        __errorCheck(error);
      });
  };
  useEffect(() => {
    fetchBankDetails();
  }, []);

  useEffect(() => {
    if (isChangePrimary === true) {
      postTochangePrimary();
    }
  }, [bankId, isChangePrimary]);

  const bankDetail = () => {
    if (bankDetails.length > 0) {
      return bankDetails.map((bank, index) => {
        return (
          <Bank
            bank={bank}
            index={index}
            key={bank.customerBankId}
            setBankId={setBankId}
            bankId={bankId}
            setIsChangePrimary={setIsChangePrimary}
          />
        );
      });
    } else {
      return (
        <p style={{ color: "#ffffff", textAlign: "center" }}>
          {"Please add bank details."}
        </p>
      );
    }
  };

  return (
    <>
      {isLoading === true ? (
        <div className="d-flex justify-content-center align-content-center h-auto">
          <img src={loader} alt="loader" width={200} />
        </div>
      ) : (
        <div
          className={condition(
            bankDetails.length !== 1
              , "bankDetailSection"
              ,"bankDetailSection bankDetailSectionOne"
      )}
        >
          {bankDetail()}
        </div>
      )}
    </>
  );
};

export default LinkedBank;
