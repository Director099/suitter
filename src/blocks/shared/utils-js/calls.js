Fancybox.bind("[data-fancybox]", {
  dragToClose: false,
});

document.querySelectorAll('[type="tel"]').forEach((item) => {
  new IMask(item, {
    mask: '{+375} 00 000 00 00',
    lazy: false,
  });
})

document.querySelectorAll('[data-number-only]').forEach((item) => {
  IMask(item, {
    mask: item.dataset.numberOnly ?? '00'
  });
})

document.querySelectorAll('[data-number]').forEach((item) => {
  IMask(item, {
    mask: '0000000000'
  });
})

document.querySelectorAll('[data-birthday]').forEach((item) => {
  IMask(item, {
    mask: '00.00.0000'
  });
})

// Вспомогательная функция открытия и закрытия
document.querySelectorAll('[data-fancybox-src]')?.forEach(item =>
  item.addEventListener('click', (e) => {
    Fancybox.close();
    Fancybox.show([{
      src: e.target.dataset.fancyboxSrc,
      dragToClose: false,
      defaultType: 'inline'
    }]);
  })
)
