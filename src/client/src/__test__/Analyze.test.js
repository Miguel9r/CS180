import React from 'react';
import ReactDOM from 'react-dom';
import {render} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Analyze from "../Analyze";
it('renders without crashing ', () => {
    const div = document.createElement("div");
    ReactDOM.render(<div></div>, div)
});