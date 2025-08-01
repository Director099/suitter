import {MediaSize} from "../../shared/utils-js/utils";

if (window.matchMedia(`(max-width: ${MediaSize.LG - 1}px)`).matches) {
  document.querySelectorAll('[data-gallary-slider]').forEach((elem) => {
    new Swiper(elem, {
      slidesPerView: 1,
      spaceBetween: 2,
      centeredSlides: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
      },
    });
  })
}
