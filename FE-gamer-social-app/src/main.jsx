import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//import assests
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css'
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'

//import react time ago
import TimeAgo from "javascript-time-ago";

import en from 'javascript-time-ago/locale/en-001.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(en)

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
