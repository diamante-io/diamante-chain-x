import { ActionTypes } from "../constants";

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

export let initialState = {
  email_id: "",
  userContactNo: "",
  twoFAValue: 0,
  isFromDashboard: false,
  customerInfo: {},
};

export const ChangeState = (state = initialState, action) => {
  switch (action.type) {
    case EMAIL_ID: {
      return {
        ...state,
        email_id: action.payload,
      };
    }
    case PASSWORD_VALUE: {
      return {
        ...state,
        password_value: action.payload,
      };
    }

    case CUSTOMER_ID:
      return {
        ...state,
        customerId: action.payload,
      };

    case USER_CONTACTNO:
      return {
        ...state,
        userContactNo: action.payload,
      };

    case TWOFA_VALUE:
      return {
        ...state,
        twoFAValue: action.payload,
      };

    case REFERRALCODE:
      return {
        ...state,
        referralCode: action.payload,
      };
    case ISFROMDASHBOARD:
      return {
        ...state,
        isFromDashboard: action.payload,
      };
    case CUSTOMERINFO:
      return {
        ...state,
        customerInfo: action.payload,
      };

    default:
      return state;
  }
};
