// Enable/disable scrollytelling based on the toggle button state
// function toggleScrollytelling(enable) {
//   if (enable) {
//     // sliding transition for carousel
//     $("#slick").slick("unslick");
//     $("#slick").slick({
//       dots: true,
//       infinite: true,
//       speed: 300,
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       prevArrow: `<button type="button" class="slick-prev slick-arrow" aria-label="Display Previous Photo">Previous</button>`,
//       nextArrow: `<button type="button" class="slick-next slick-arrow" aria-label="Display Next Photo">Next</button>`,
//     });
//   } else {
//     // disable sliding transition for carousel
//     $("#slick").slick("unslick");
//     $("#slick").slick({
//       dots: true,
//       infinite: true,
//       speed: 0,
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       prevArrow: `<button type="button" class="slick-prev slick-arrow" aria-label="Display Previous Photo">Previous</button>`,
//       nextArrow: `<button type="button" class="slick-next slick-arrow" aria-label="Display Next Photo">Next</button>`,
//     });
//   }
// }

// Slick carousel inspired by https://dev.to/beumsk/build-a-carousel-with-slick-45p1
$("#slick").slick({
  dots: true,
  infinite: true,
  speed: $("#scrollToggle")[0].checked ? 300 : 0,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: `<button type="button" class="slick-prev slick-arrow" aria-label="Display Previous Photo">Previous</button>`,
  nextArrow: `<button type="button" class="slick-next slick-arrow" aria-label="Display Next Photo">Next</button>`,
});

// Handle toggle button change
// const scrollToggle = document.getElementById("scrollToggle");
// scrollToggle.addEventListener("change", function () {
//   toggleScrollytelling(this.checked);
//   // console.log(this.checked);
// });

// For keyboard nav:
// before we change slides, make the next slide's audio control the only focusable one (change tabindex to 0)
// and make the current slide's audio control unfocusable (tabindex set back to -1)
document.querySelector(`#audio-${0}`).tabIndex = "0";
$("#slick").on("beforeChange", function (e, slick, currentSlide, nextSlide) {
  document.querySelector(`#audio-${currentSlide}`).tabIndex = "-1";
  document.querySelector(`#audio-${nextSlide}`).tabIndex = "0";
});
// When initializing the slider (including when animation is toggled), set all audio controls
// as untabbable except for the first one
$("#slick").on("init", function () {
  document.querySelectorAll("audio").forEach((el) => (el.tabIndex = "-1"));
  document.querySelector(`#audio-${0}`).tabIndex = "0";
});
