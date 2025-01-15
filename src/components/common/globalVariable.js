// globalVariables.js

//// variable declaration

var bidGlobalVariable = "initialValue";
var askGlobalVariable = "initialValue";
var marketDataVariable = "initialValue";
var assetGlobalSymbol = "initialValue";

//// value set in variable

export const setBidGlobalVariable = (newValue) => {
  bidGlobalVariable = newValue;
};

export const setAskGlobalVariable = (newValue) => {
  askGlobalVariable = newValue;
};

export const setMarketDataVariable = (newValue) => {
  marketDataVariable = newValue;
};

export const setAssetGlobalSymbol = (newValue) => {
  assetGlobalSymbol = newValue;
};

////get value from variable

export const getBidGlobalVariable = () => {
  return bidGlobalVariable;
};

export const getAskGlobalVariable = () => {
  return askGlobalVariable;
};

export const getMarketDataVariable = () => {
  return marketDataVariable;
};

export const getAssetGlobalSymbol = () => {
  return assetGlobalSymbol;
};
