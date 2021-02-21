import storage from "redux-persist/lib/storage"
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
} from "redux-persist"
import toDoReducer from "./toDoSlice"

const rootReducer = combineReducers({
  toDo: toDoReducer,
})

const migrations = {
  1: (state: any) => {
    return {
      ...state,
      toDo: { ...state.toDo, taskCount: Object.keys(state.toDo.tasks).length },
    }
  },
  2: (state: any) => {
    return {
      ...state,
      toDo: {
        ...state.toDo,
        columnCount: Object.keys(state.toDo.column).length,
      },
    }
  },
}

const persistConfig = {
  key: "@drag_drop",
  storage: storage,
  version: 2,
  migrate: createMigrate(migrations, { debug: true }),
  whitelist: ["toDo"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

let persistor = persistStore(store)
export type rootState = ReturnType<typeof store.getState>
export { store, persistor }
