import { createSliderTemplate, checkSettings, EventEmitter } from "./../../app/utilities.js";

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

            it("string has not handle__to--hidden if settings.range: true", () => {
                const settings = {range: true};

                const template = createSliderTemplate(settings);

                assert.equal(template.indexOf("lrs__handle--hidden"), -1);
            });
        });

        describe("checkSettings", () => {
            it("It's ok with correct settings", () => {
                const settings = {from: 0,min: 0,max: 100,step: 1,range: false,view: "horizontal",hideTip: true,theme: "aqua"};
                assert.isOk(checkSettings(settings));
            });

            it("It's wrong if from less than min", () => {
                const settings = {from: 3,min: 10,max: 22,step: 1,range: false,view: "horizontal",hideTip: true,theme: "aqua"};     
                assert.isNotOk(checkSettings(settings));
            });

            it("It's wrong with negative numeric values", () => {
                const settings = {from: -5,min: 3,max: -1,step: -1234,range: false,view: "horizontal",hideTip: true,theme: "aqua"};     
                assert.isNotOk(checkSettings(settings));
            });

            it("It's wrong with incorrect numeric values", () => {
                const settings = {from: [],min: "asdsa",max: {},step: true,range: false,view: "horizontal",hideTip: true,theme: "aqua"};     
                assert.isNotOk(checkSettings(settings));
            });

            it("It's wrong with incorrect boolean values", () => {
                const settings = {from: 0,min: 0,max: 100,step: 1,range: "aga",view: "horizontal",hideTip: "alala",theme: "aqua"};
                assert.isNotOk(checkSettings(settings));
            });

            it("It's wrong with incorrect string values", () => {
                const settings = {from: 0,min: 0,max: 100,step: 1,range: false,view: true,hideTip: true,theme: {}};
                assert.isNotOk(checkSettings(settings));
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
