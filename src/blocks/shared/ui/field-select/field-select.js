const choiceSelect = document.querySelectorAll('[data-choices-select]');

//todo: на мобилке наверное стоит убить
choiceSelect.forEach((item) => {
  new Choices(item, {
    searchChoices: false,
    searchEnabled: false,
    itemSelectText: '',
    renderSelectedChoices: 'asd',
    placeholder: true,
    placeholderValue: 'ads',
    sorter: () => false,
  })
})
