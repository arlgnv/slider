import { createSliderTemplate, checkSettings, checkExtremeHandlePositions, EventEmitter } from "./../../app/utilities.js";

describe("Utilities", () => {
    describe("Functions", () => {
        describe("createSliderTemplate", () => {
            it("returns string type", () => {
                const settings = {};

                assert.isString(createSliderTemplate(settings));
            });

            it("string has basic theme if \"settings.theme\" is unknown", () => {
                const settings = {theme: "parapampampam"};

                const template = createSliderTemplate(settings);

                assert.notEqual(template.indexOf("aqua"), -1);
            });

            it("string has settings' theme", () => {
                const settings = {theme: "aqua"};

                const template = createSliderTemplate(settings);

                assert.notEqual(template.indexOf(settings.theme), -1);
            });
        });

        describe("checkSettings", () => {
            it("It's ok with correct settings", () => {
                const settings = {value: 0,min: 0,max: 100,step: 1,range: false,view: "horizontal",hideTip: true,theme: "aqua"};

                assert.isOk(checkSettings(settings));
            });

            it("It's wrong with incorrect settings", () => {
                let settings = {value: "5",min: [],max: "13",step: false,range: false,view: "horizontal",hideTip: true,theme: "aqua"};     
                assert.isNotOk(checkSettings(settings)); // value, min, max, step must be numbers

                settings = {value: 0,min: 0,max: 100,step: 1,range: 3,view: "horizontal",hideTip: "alala",theme: "aqua"};
                assert.isNotOk(checkSettings(settings)); //range, hideTip are must be boolean

                settings = {value: 0,min: 0,max: 100,step: 1,range: false,view: true,hideTip: true,theme: {}};
                assert.isNotOk(checkSettings(settings)); //view, theme are must be strings
            });
        });

        describe("checkExtremeHandlePositions", () => {
            it("returns min if num less than min", () => {
                const min = 5, max = 15;
                let num = 3;

                const result = checkExtremeHandlePositions(num, min, max);

                assert.equal(result, min);
            });

            it("returns max if num more than min", () => {
                const min = 5, max = 15;
                let num = 20;

                const result = checkExtremeHandlePositions(num, min, max);

                assert.equal(result, max);
            });

            it("returns num if num between min and max 'inclusively'", () => {
                const min = 5, max = 15;
                let num = 7;

                const result = checkExtremeHandlePositions(num, min, max);

                assert.equal(result, num);
            });
        });
    });

    describe("Classes", () => {
        describe("EventEmitter", () => {
            it("attach callback to event", () => {
                const events = new EventEmitter();
                const typeEvent = "drag";
                const callback = () => "It's me";

                events.on(typeEvent, callback);

                assert.equal(callback, events.events[typeEvent]);
            });
        });
    });
});

mocha.run();
