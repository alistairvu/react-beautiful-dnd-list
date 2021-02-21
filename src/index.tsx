import { render } from "react-dom"
import App from "./App"
import "./styles.css"
import "./bootstrap.min.css"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./redux"

const rootElement = document.getElementById("root")
render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  rootElement
)
