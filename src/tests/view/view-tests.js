import View from "./../../app/mvc/view.js";

describe("View", () => {
    describe("Constructor", () => {
        it("add listener to handle", () => {
            document.body.insertAdjacentHTML("beforeend",
            `<span class="lrs lrs--aqua">
            <span class="lrs__range">
            <span class="lrs__tip"></span>
            <span class="lrs__handle"></span>
            </span>
            </span>
            <input type="text" class="range">`
            );

            const view = new View(document.querySelector(".range"), document.querySelector(".lrs"));

            assert.isOk(view.handle.onmousedown);
        });
    });

    describe("Methods", () => {});
});

mocha.run();
