import { assert } from "chai";
import jsdom from "mocha-jsdom";

import App from "./app";

describe("App", () => {
    jsdom();

    it("init template on page", () => {
        const slider = document.querySelector(".lrs");

        assert(slider);
    });
});