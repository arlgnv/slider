import Model from "./../../app/mvc/model.js";
import View from "./../../app/mvc/view.js";
import Controller from "./../../app/mvc/controller.js";

const model = new Model({ value: 0, min: 10, max: 35 });
const view = new View(document.querySelector(".range"), document.querySelector(".lrs"));
const controller = new Controller(model, view);

describe("Controller", () => {
    describe("Constructor", () => {});

    describe("Methods", () => {
        describe("checkExtremeHandlePositions", () => {
            it("returns 0 if handle's position less than 0", () => {
                let handlePosition = -2;

                const result = controller.checkExtremeHandlePositions(handlePosition);

                assert.equal(result, 0);
            });

            it("returns maxHandlePosition if handle's position more than maxHandlePosition", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handle.offsetWidth;

                let handlePosition = maxHandlePosition + 1;

                const result = controller.checkExtremeHandlePositions(handlePosition);

                assert.equal(result, maxHandlePosition);
            });

            it("returns handle's position if handle's position between 0 and maxHandlePosition", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handle.offsetWidth;

                let handlePosition = Math.floor(Math.random() * (maxHandlePosition - 0 + 1)) + 0;

                const result = controller.checkExtremeHandlePositions(handlePosition);

                assert.equal(result, handlePosition);
            });
        });

        describe("getValue", () => {
            it("return min if handle is leaning against start of the slider", () => {
                const handlePosition = 0;

                const value = controller.getValue(handlePosition);

                assert.equal(value, model.state.min);
            });

            it("return max if handle is leaning against end of the slider", () => {
                const handlePosition = view.range.offsetWidth - view.handle.offsetWidth;

                const value = controller.getValue(handlePosition);

                assert.equal(value, model.state.max);
            });
        });
    });
});

mocha.run();
