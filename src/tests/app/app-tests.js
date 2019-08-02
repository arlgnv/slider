import App from "./../../app/app.js";

describe("App", () => {
    it("init template on page", () => {
        let input = document.createElement("input");
        input.classList.add("range");
        document.body.appendChild(input);

        new App(input, {});

        const slider = document.querySelector(".lrs");
        
        assert.isOk(slider);
    });
});

mocha.run();