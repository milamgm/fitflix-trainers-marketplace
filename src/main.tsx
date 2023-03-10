import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import App from "./application/App";
import AppProvider from "./application/context/AppContext";
import ChatProvider from "./application/context/ChatContext/ChatContext";
import { i18next } from "./common/utilities/utils"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <BrowserRouter basename="/fitflix-trainers-marketplace/">
        <AppProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AppProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
