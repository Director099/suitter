import {MediaSize} from "../../shared/utils-js/utils";

if (window.matchMedia(`(min-width: ${MediaSize.LG}px)`).matches) {
  document.querySelectorAll('[data-preview-slider]').forEach((elem) => {
    const slider = new Swiper(elem, {
      speed: 0,
      pagination: {
        el: '.swiper-pagination',
      },
    });

    const paginationBullets = elem.querySelectorAll('.swiper-pagination-bullet');

    paginationBullets.forEach((bullet, index) => {
      bullet.addEventListener('mouseenter', () => slider.slideToLoop(index));
    });
  })
}
