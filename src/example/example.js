const slider = $(".range1");

slider.rangeSlider({
    min: 0,
    max: 100,
    from: 0,
    step: 1,
    hideTip: false,
});

const sliderApp = slider.data("rangeSlider");
//console.log(sliderApp.init())

// $(".range2").rangeSlider({
//     min: -10,
//     max: 50,
//     from: 11,
//     step: 1,
//     view: "vertical",
//     hideTip: false,
//     range: true,
//     to: 45,
//     theme: "red"
// });

// $(".js-range-slider").ionRangeSlider({
//     min: 10,
//     max: 30,
//     from: 11,
//     skin: "big",
//     step: 3
// });
