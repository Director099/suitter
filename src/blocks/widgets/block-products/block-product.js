import {MediaSize} from "../../shared/utils-js/utils";

document.querySelectorAll('[data-product-slider]').forEach((elem) => {
  new Swiper(elem, {
    slidesPerView: 'auto',
    spaceBetween: 10,
    freeMode: true,
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    breakpoints: {
      [MediaSize.LG]: {
        slidesPerView: 4,
      }
    }
  });
})

