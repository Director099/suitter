const swiper = new Swiper("[data-cert-card-slider]", {
  spaceBetween: 4,
  slidesPerView: 6,
});

new Swiper("[data-thumbs-slider]", {
  spaceBetween: 10,
  effect: "fade",
  thumbs: {
    swiper: swiper,
  },
});

const selectCertCard = document.querySelector("[data-select-cert] select");
const inputCertCard = document.querySelector("[data-input-cert] input");
const textPriceCertCard = document.querySelector("[data-text-price]");
const inputValueCertCard = document.querySelector("[data-input-value-cert]");

selectCertCard?.addEventListener("change", () => {
  textPriceCertCard.textContent = selectCertCard.value;
  inputValueCertCard.value = selectCertCard.value;
})

inputCertCard?.addEventListener("input", () => {
  textPriceCertCard.textContent = inputCertCard.value;
  inputValueCertCard.value = inputCertCard.value;
})

