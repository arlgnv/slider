import View from "./../../app/mvc/view.js";

const view = new View(document.querySelector(".range"), document.querySelector(".lrs"));

describe("View", () => {
    describe("Constructor", () => {
        
    });

    describe("Methods", () => {
        it("change handle position", () => {
            const shift = 5;
            view.changeHandlePosition(shift);

            const hanlePosition = parseFloat(view.handle.style.left);

            assert.equal(shift, hanlePosition);
        });

        it("change tip position", () => {
            const shift = 16;
            view.changeTipPosition(shift);

            const tipPosition = parseFloat(view.tip.style.left);

            assert.equal(shift, tipPosition);
        });

        it("change value", () => {
            const value = 500;
            view.changeValue(value);

            assert.equal(value, view.input.value);
        });
    });
});

mocha.run();
