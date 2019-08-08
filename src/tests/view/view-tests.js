import View from "./../../app/mvc/view.js";

const view = new View(document.querySelector(".range"), document.querySelector(".lrs"));

describe("View", () => {
    describe("Constructor", () => {});

    describe("Methods", () => {
        describe("changeHandlePosition", () => {
            it("correct change postition", () => {
                const position = 5;

                view.changeHandlePosition(position, "from");

                const hanlePosition = parseFloat(view.handleFrom.style.left);

                assert.equal(position, hanlePosition);
            });
            it("change postition on right handle", () => {
                const position = 4;

                view.changeHandlePosition(position, "to");

                const hanlePosition = parseFloat(view.handleFrom.style.left);

                assert.notEqual(position, hanlePosition);
            });
        });

        describe("changeTipPosition", () => {
            it("correct change postition", () => {
                const position = 16;

                view.changeTipPosition(position, "from");

                const tipPosition = parseFloat(view.tipFrom.style.left);

                assert.equal(position, tipPosition);
            });

            it("change postition on right tip", () => {
                const position = 12;

                view.changeTipPosition(position, "from");

                const tipPosition = parseFloat(view.tipTo.style.left);

                assert.notEqual(position, tipPosition);
            });
        });

        describe("changeValue", () => {
            it("correct change value with 1 arg", () => {
                const value = 500;

                view.changeValue(value);

                assert.equal(value, view.input.value);
            });

            it("correct change value with 2 args", () => {
                const value1 = 12, value2 = 17;

                view.changeValue(value1, value2);

                assert.equal(view.input.value, `${value1} - ${value2}`);
            });
        });
    });
});

mocha.run();
