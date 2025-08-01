import {MediaSize} from "../../shared/utils-js/utils";

new Swiper("[data-main-slider]", {
  slidesPerView: 1,
  spaceBetween: 3,
  loop: true,
  autoplay: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    [MediaSize.LG]: {
      slidesPerView: 2,
    }
  }
});
