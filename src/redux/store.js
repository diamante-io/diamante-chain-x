import { legacy_createStore as createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";


import reducers from "./reducers"
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer);
const persistor = persistStore(store);
export { persistor };
export default store;

// declare global {
//   type RootState = ReturnType<typeof store.getState>
// }
// declare module 'react-redux' {
//   interface DefaultRootState extends RootState { }
// }
