import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

console.log(process.env.NODE_ENV);
ReactDOM.render(<App />, document.getElementById("root"));
