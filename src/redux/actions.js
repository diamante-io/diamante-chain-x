import { ActionTypes } from "./constants";

const {
  EMAIL_ID,
  PASSWORD_VALUE,
  CUSTOMER_ID,
  USER_CONTACTNO,
  TWOFA_VALUE,
  REFERRALCODE,
  ISFROMDASHBOARD,
  CUSTOMERINFO,
} = ActionTypes;

export function setPassword(state) {
  return {
    type: PASSWORD_VALUE,
    payload: state,
  };
}

export function setEmail(state) {
  return {
    type: EMAIL_ID,
    payload: state,
  };
}

export function getCustomerId(state) {
  return {
    type: CUSTOMER_ID,
    payload: state,
  };
}

export function setUserContact(state) {
  return {
    type: USER_CONTACTNO,
    payload: state,
  };
}

export function setTwoFAValue(state) {
  return {
    type: TWOFA_VALUE,
    payload: state,
  };
}

export function setReferralCode(state) {
  return {
    type: REFERRALCODE,
    payload: state,
  };
}
export function setDashboardNavigation(state) {
  return {
    type: ISFROMDASHBOARD,
    payload: state,
  };
}
export function setCustomerInfo(state) {
  return {
    type: CUSTOMERINFO,
    payload: state,
  };
}
