import Model from "./../../app/mvc/model.js";
import View from "./../../app/mvc/view.js";
import Controller from "./../../app/mvc/controller.js";

const model = new Model({ value: 0, min: 0, max: 35, step: 3 });
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

        describe("getValueFromHandlePosition", () => {
            it("return numeric type value", () => {
                const handlePosition = 0;

                const value = controller.getValueFromHandlePosition(handlePosition);

                assert.isNumber(value);
            });

            it("return min if handle is leaning against to the start of the slider", () => {
                const handlePosition = 0;

                const value = controller.getValueFromHandlePosition(handlePosition);

                assert.equal(value, model.state.min);
            });

            it("return max if handle is leaning against to the end of the slider", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handle.offsetWidth;

                const value = controller.getValueFromHandlePosition(maxHandlePosition);

                assert.equal(value, model.state.max);
            });
        });

        describe("getHandlePositionFromValue", () => {
            it("return numeric type handle's position", () => {
                const value = 0;

                const handlePosition = controller.getHandlePositionFromValue(value);

                assert.isNumber(handlePosition);
            });

            it("return 0 if value equals 0", () => {
                const value = 0;

                const handlePosition = controller.getHandlePositionFromValue(value);

                assert.equal(handlePosition, 0);
            });

            it("return max handle's position if value equals max", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handle.offsetWidth;
                const value = model.state.max;

                const handlePosition = controller.getHandlePositionFromValue(value);

                assert.equal(handlePosition, maxHandlePosition);
            });
        });

        describe("checkNeedToMoveHandle", () => {
            it("returns boolean type", () => {
                const value = 0;

                assert.isBoolean( controller.checkNeedToMoveHandle(value) );
            });

            it("returns true if handle can be moved", () => {
                const value = 3;

                assert.isOk( controller.checkNeedToMoveHandle(value) );
            });

            it("returns false if handle cannot be moved", () => {
                const value = 1;

                assert.isNotOk( controller.checkNeedToMoveHandle(value) );
            });
        });
    });
});

mocha.run();
