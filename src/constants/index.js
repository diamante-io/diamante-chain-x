import { BASE_URL, TOKEN_BASE_URL } from "../constants/DataConst";

export const TEST_DEV = BASE_URL; //Dev server

export const URI_PREFIX = TEST_DEV; //  HOST_NAME_DEV + ":" + PORT_DEV
export function getHost() {
  return URI_PREFIX;
}

export let URI = getURI();

export function getURI() {
  return {
    /////////////////////  ///////////////////

    userLocation: `${getHost()}/userService/account/v1/identify-user-location`, // Identify user location
    signIn: `${getHost()}/userService/account/v1/sign-in`,
    signIn2fa: `${getHost()}/userService/account/v1/sign-in-2fa`,
    documentVerification: `${getHost()}/userService/account/v1/verify-user-details/docv/`,
    logoutUser: `${getHost()}/userService/account/v1/logout-user`,
    emailExistCheck: `${getHost()}/userService/account/v1/sign-in/check-email-exists`, // check whether email is exist or not

    ///////////////// Trulioo //////////////////
    socketStream: `${getHost()}/socketStream/ws/`,

    ////////////////////  /////////////////////

    getotp: `${getHost()}/userService/account/v1/mOtp`, // post otp
    twowayauthotp: `${getHost()}/userService/account/v1/confirm2Fa`, // post two way verification
    signup: `${getHost()}/userService/account/v1/sign-up`, // sign up api
    mobileVerificationReset: `${getHost()}/userService/account/v1/user-details/reset-credential`, // Password reset Mobile Verification
    getCustomerDetails: `${getHost()}/userService/account/v1/get-customer-details/`, // fetch customer details in dashboard
    mobileExistenceCheck: `${getHost()}/userService/account/v1/sign-in/check-mobile-exists`, // Check whether mobile is existing or not
    change2FA: `${getHost()}/userService/account/v1/change-2fa-settings`,

    /////////////////// Laxman //////////////////////
    updateEmail: `${getHost()}/userService/account/v1/user-details/edit-mail`,
    professionalDetails: `${getHost()}/userService/account/v1/profile/professional-details`,
    familyDetails: `${getHost()}/userService/account/v1/profile/family-details`,
    socialLinks: `${getHost()}/userService/account/v1/profile/social-media-links`,

    deleteFamilyMember: `${getHost()}/userService/account/v1/profile/delete-family-details`,
    getAllProfileDetails: `${getHost()}/userService/account/v1/get-profile-details/`,

    updateFamilyDetails: `${getHost()}/userService/account/v1/profile/family-edit-details/`,
    carOwnershipDetails: `${getHost()}/userService/account/v1/profile/car-ownership-details`,

    changePassword: `${getHost()}/userService/account/v1/user-details/change-credential`, //Change password
    getLoginHistory: `${getHost()}/userService/account/v1/sign-in/login-history/`,
    postNotifications: `${getHost()}/userService/account/v1/insert-customer-notification`,
    getNotifications: `${getHost()}/userService/account/v1/get-customer-notification-details/`,
    setAsPrimary: `${getHost()}/userService/bank/update-is-primary`,

    ////////////////// Customer Settings check /////////////
    customerSettings: `${getHost()}/userService/account/v1/get-customer-settings/`,

    ///////////////// Customer Account ID //////////////////
    customerAccountID: `${getHost()}/userService/payment/v1/get-accountid-scan-pay/`,

    ///////////////// OCR /////////////////////

    getFrontDetails: `${getHost()}/userService/account/v1/get-front-doc-details/`,
    getBackDetails: `${getHost()}/userService/account/v1/get-back-doc-details/`,
    postPersonalInfo: `${getHost()}/userService/account/v1/insert-personal-info`,
    postKycDetails: `${getHost()}/userService/account/v1/verify-customer-kyc-details`,
    verifyDocDetails: `${getHost()}/userService/account/v1/verify-customer-doc-details`,
    getOcr: `${getHost()}/userService/payment/v1/upload-invoice-for-ocr`,
    transferInvoice: `${getHost()}/userService/payment/v1/transfer-funds-for-invoice`,
    checkSsnIdExist: `${getHost()}/userService/account/v1/sign-in/check-ssn-exists`,

    /////////////////// Auth Token //////////////////////
    //getAuthToken: `${getHost()}/oauth/token?username=`,
    getAuthToken: `${TOKEN_BASE_URL}/authentication-service/authenticate`,
    // kybgetAuthToken: `${getHost()}/oauth/token?username=`,
    regenarateAuthToken: `${getHost()}/oauth/token?refresh_token=`,

    //---------------- Main dashboard -----------------------------------

    // -------------socketApi--------------//
    getOrderData: `${getHost()}/socketStream/trade/orderBook/`,
    getMarketData: `${getHost()}/socketStream/trade/marketTrades/`,
    getMarketAmount: `${getHost()}/socketStream/trade/marketAmount/1/`,
    getMarketPrice: `${getHost()}/socketStream/trade/marketPrice/`,
    getTradeVolume: `${getHost()}/socketStream/trade/get-24h-trade-volume/`,

    //------------------ paymentApi----------------------
    getAssetSymbols: `${getHost()}/tradeService/trade/v1/get-asset-symbols`,
    convertWallet: `${getHost()}/paymentService/payment/v1/convert-wallet-asset`,
    getConvertHistory: `${getHost()}/paymentService/payment/v1/get-convert-trans-details`,
    getRefDetail: `${getHost()}/paymentService/payment/v1/get-profile-trans-details`,

    // -------------------tradeServiceApi---------------//
    referralInvite: `${getHost()}/userService/account/v1/invite-by-referral-code`,
    createOrder: `${getHost()}/tradeService/trade/v1/create-order`,
    getOpenOrder: `${getHost()}/tradeService/trade/v1/get-open-orders`,
    getAssetPairSearch: `${getHost()}/tradeService/trade/v1/get-asset-pairs-search`,
    getAssetBalance: `${getHost()}/tradeService/trade/v1/get-balance`,
    getCustomerAllOrdersHistory: `${getHost()}/tradeService/trade/v1/get-customer-all-orders`,
    updateDeleteOrder: `${getHost()}/tradeService/trade/v1/update-delete-order`,
    getCustomerAllTrades: `${getHost()}/tradeService/trade/v1/get-customer-all-trades`,
    getAllfunds: `${getHost()}/tradeService/trade/v1/get-spot-wallet-details/`,
    getStopLimitCreateOrder: `${getHost()}/tradeService/trade/v1/create-stop-limit-order`,
    createWatchList: `${getHost()}/tradeService/trade/v1/create-watchlist`,
    getCustomerOrders: `${getHost()}/tradeService/trade/v1/get-customer-orders`,
    getSpotWallet: `${getHost()}/tradeService/trade/v1/get-spot-wallet-details`,
    getAssetsBySearch: `${getHost()}/tradeService/trade/v1/get-asset-by-search`,
    getTransHistoryOfFundingWallet: `${getHost()}/paymentService/payment/v1/get-transaction-history-details`,

    walletTransfer: `${getHost()}/paymentService/payment/v1/wallet-transfer`,
    getFundWallet: `${getHost()}/paymentService/payment/v1/get-fund-wallet-details`,
    getFundWalletByType: `${getHost()}/paymentService/payment/v1/get-fund-wallet-details-by-type/`,
    getSpotWalletByType: `${getHost()}/tradeService/trade/v1/get-spot-wallet-details-by-type/`,
    withdrawFunds: `${getHost()}/paymentService/payment/v1/withdraw-funds`,
    generateDepositAddress: `${getHost()}/paymentService/payment/v1/generate-deposit-wallet/`,
    getRecent: `${getHost()}/paymentService/payment/v1/get-recent-deposit-withdraw-details`,
    addressValidation: `${getHost()}/paymentService/payment/v1/wallet-address-validation`,
    getCustomerAlerts: `${getHost()}/userService/account/v1/get-customer-alerts`,
  };
}
