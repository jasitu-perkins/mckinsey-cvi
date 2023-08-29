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
// Imported from HTML page
$("#slick").on("afterChange", function () {
  const transcripts = [
  "“My vision is very unpredictable. It likes to do what it wants. It gets frustrating because I want to be able to see things, I want to be able to participate in things, but sometimes it’s hard for me because my vision just completely goes at the wrong time! For me, my vision can go from probably visually impaired to only seeing movement, light, shadows, and color... I guess kinda like Monet paintings. Very distorted. I wish people understood more that our brains decide when it wants to work, visually, and when it wants to “peace out”, I’m done for the day.”", 
  "“If I’m feeling tired, I like to relax. If I’m feeling energetic, I like to play video games. And then, if I’m in an upset mood, I just take a vision break. If I’m at school, I’d just ask the teacher and if she says yes, I either take a walk or put my head down on the desk. It sometimes helps and sometimes stays the same, but it never gets worse.”",
  "“I do art, painting sometimes, at home. I paint postcards. It’s not easy to do because it’s a small little square thing, but it comes out really well... usually! I mostly like painting when I’m at my house. I like to paint how I feel.”", 
  "“I do well with color. Like, color in terms of color contrast. They help me distinguish things, like cartoon characters that I’ve seen a bunch of times, like Scooby Doo and Mickey and Winnie the Pooh, and things that I have come before. When I see them, I have a mental picture of them in my head, so I know how to map them. Yeah, it’s like a landmark, almost.”", 
  "“A lot of people call that a white cane, so... I call it an extender because I think of it as extending my vision. I always thought of it like, “OK, it’s extending my vision, so it’s an extend<em>er</em>. And not a lot of people think of it that way.<br><br>But a lot of people probably don’t understand that just because you see someone with a white cane — or extender as I like to call it — doesn’t mean that they are completely blind. There are different levels of blindness; you may have a white cane, but you’re not completely blind, necessarily.”", 
  "Zeke: On a random note, can I just say something random? A man with a blue puppet, once said, “Pizza is a circle that is cut into triangles that comes in a square”! [I like] really, really bad jokes.<br>Why did the boy throw a stick of butter? Because he wanted to see a butter-fly<br><br>Another voice: There we go! <em>laughter</em>"]

  const transcriptTitles = [
  "Tina's vision is like a Monet painting",
  "Sometimes, Omer needs a vision break",
  "Aidan likes to paint watercolors",
  "Color is like a landmark for Micah",
  "Kyle calls his white cane an “extender” because it extends his vision",
  "Zeke likes to tell jokes"    
  ]

  var dataId = $(".slick-current").attr("data-slick-index");
  document.querySelector('#cvi-audio-transcript').innerHTML = transcripts[dataId]
  document.querySelector('#cvi-audio-transcript-header').innerHTML = transcriptTitles[dataId]
});

// Multi map tabbed content with attributes
var divs = document.querySelectorAll(".tabbed-content");
for(var i = 0; i < divs.length; i++) {
    divs[i].setAttribute("role", "region");
    divs[i].setAttribute("aria-label", "Geographic analysis of CVI diagnosis and support");
}