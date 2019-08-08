import Model from "./../../app/mvc/model.js";
import View from "./../../app/mvc/view.js";
import Controller from "./../../app/mvc/controller.js";

const model = new Model();
const view = new View(document.querySelector(".range"), document.querySelector(".lrs"));
const controller = new Controller(model, view);

describe("Controller", () => {
    describe("Constructor", () => {});

    describe("Methods", () => {
        beforeEach(() => {
            model.state = { min: 0, max: 100, step: 1, from: 0, range: false, view: "horizontal", hideTip: true, theme: "aqua" };
        });

        describe("checkNeedToMoveHandle", () => {
            it("returns boolean type", () => {
                const value = 5;

                assert.isBoolean(controller.checkNeedToMoveHandle(value));
            });

            it("returns true if value equals min", () => {
                const value = model.state.min;

                assert.isOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns true if value equals max", () => {
                const value = model.state.max;

                assert.isOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns true if handle can be moved with value equals 6 and step equals 2", () => {
                const value = 6;
                model.state.step = 2;
                assert.isOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns true if handle can be moved with value equals 42 and step equals 14", () => {
                const value = 42;
                model.state.step = 14;
                assert.isOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns true if handle can be moved with value equals 6 and step equals 2", () => {
                const value = 6;
                model.state.step = 2;
                assert.isOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns false if handle cannot be moved with value equals 5 and step quals 2", () => {
                const value = 5;
                model.state.step = 2;
                assert.isNotOk(controller.checkNeedToMoveHandle(value));
            });

            it("returns false if handle cannot be moved with value equals 16 and step quals 28", () => {
                const value = 32;
                model.state.step = 28;
                assert.isNotOk(controller.checkNeedToMoveHandle(value));
            });
        });

        describe("checkExtremeHandlePositions", () => {
            it("returns 0 if range = false and handle's position less than 0", () => {
                const handlePosition = -2;
                const result = controller.checkExtremeHandlePositions(handlePosition, "from");
                assert.equal(result, 0);
            });

            it("returns max handle's position if range = false and handle's position more than max handle's position", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handleFrom.offsetWidth;
                const handlePosition = maxHandlePosition + 1;
                const result = controller.checkExtremeHandlePositions(handlePosition, "from");
                assert.equal(result, maxHandlePosition);
            });

            it("returns handle's position if range = false and handle's position between 0 and max handle's position", () => {
                const maxHandlePosition = view.range.offsetWidth - view.handleFrom.offsetWidth;
                const handlePosition = Math.floor(Math.random() * (maxHandlePosition - 0 + 1)) + 0;
                const result = controller.checkExtremeHandlePositions(handlePosition, "from");
                assert.equal(result, handlePosition);
            });

            it("returns 0 if range = true, handle is handleFrom and handle's position less than 0", () => {
                const handlePosition = -2;
                const result = controller.checkExtremeHandlePositions(handlePosition, "from");
                assert.equal(result, 0);
            });

            it("returns max handleFrom's position if range = true, handle is handleFrom and handle's position more than max handleFrom's position", () => {
                model.state.range = true;
                model.state.to = 50;
                view.changeHandlePosition(model.state.to, "to");

                const maxHandlePosition = parseFloat(view.handleTo.style.left);
                const handlePosition = maxHandlePosition + 1;

                const result = controller.checkExtremeHandlePositions(handlePosition, view.handleFrom);
                assert.equal(result, maxHandlePosition);
            });

            it("returns handleFrom's position if range = true, handle is handleFrom and handleFrom's position between 0 and max handleFrom's position", () => {
                model.state.range = true;
                model.state.to = 70;
                view.changeHandlePosition(model.state.to, "to");

                const maxHandlePosition = parseFloat(view.handleTo.style.left);
                const handlePosition = Math.floor(Math.random() * (maxHandlePosition - 0 + 1)) + 0;

                const result = controller.checkExtremeHandlePositions(handlePosition, view.handleFrom);
                assert.equal(result, handlePosition);
            });

            it("returns min handleFrom's position if range = true, handle is handleTo and handle's position less than min handleFrom's position", () => {
                model.state.range = true;
                model.state.to = 70;

                view.changeHandlePosition(10, "from");

                const minHandleFromPosition = parseFloat(view.handleFrom.style.left);
                const handlePosition = minHandleFromPosition - 1;
                view.changeHandlePosition(handlePosition, "to");
                
                const result = controller.checkExtremeHandlePositions(handlePosition, view.handleTo);
                assert.equal(result, minHandleFromPosition);
            });

            it("returns max handleTo's position if range = true, handle is handleTo and handleTo's position more than max handleTo's position", () => {
                model.state.range = true;
                model.state.to = 70;

                const maxHandleToPosition = view.range.offsetWidth - view.handleTo.offsetWidth;
   
                const handleToPosition = controller.checkExtremeHandlePositions(maxHandleToPosition + 1, view.handleTo);

                view.changeHandlePosition(handleToPosition, "to");
                
                assert.equal(handleToPosition, maxHandleToPosition);
            });

            it("returns handleTo's position if range = true, handle is handleTo and handleTo's position between min handleTo's position and max handleTo's position", () => {
                model.state.range = true;
                model.state.to = 70;

                view.changeHandlePosition(30, "from");

                const minHandleToPosition = parseFloat(view.handleFrom.style.left);
                const maxHandleToPosition = view.range.offsetWidth - view.handleTo.offsetWidth;
                
                let randomPosition = Math.floor(Math.random() * (maxHandleToPosition - minHandleToPosition + 1)) + minHandleToPosition;

                const handleToPosition = controller.checkExtremeHandlePositions(randomPosition, view.handleTo);

                view.changeHandlePosition(handleToPosition, "to");

                assert.equal(handleToPosition, handleToPosition);
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
                const maxHandlePosition = view.range.offsetWidth - view.handleFrom.offsetWidth;

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
                const maxHandlePosition = view.range.offsetWidth - view.handleFrom.offsetWidth;
                const value = model.state.max;

                const handlePosition = controller.getHandlePositionFromValue(value);

                assert.equal(handlePosition, maxHandlePosition);
            });
        });
    });
});

mocha.run();
