class FieldNum {
  constructor(field) {
    this.field = field;
    this.input = field.querySelector('.field-num__input');
    this.init();
  }

  init() {
    this.valueMin = this.input.getAttribute('min') ? Number(this.input.getAttribute('min')) : -Infinity;
    this.valueMax = this.input.getAttribute('max') ? Number(this.input.getAttribute('max')) : Infinity;
    this.valueStep = this.input.getAttribute('step') ? Number(this.input.getAttribute('step')) : 1;

    this.bindEvents();
  }

  bindEvents() {
    this.field.addEventListener('click', (event) => {
      if (event.target.classList.contains('field-num__btn') && !this.input.hasAttribute('disabled')) {
        this.handleButtonClick(event.target);
      }
    });
  }

  handleButtonClick(button) {
    let num = parseInt(this.input.value) || 0;

    if (button.classList.contains('field-num__btn--plus') && num < this.valueMax) {
      this.input.value = num + this.valueStep;
    }

    if (button.classList.contains('field-num__btn--minus') && num > this.valueMin) {
      this.input.value = num - this.valueStep;
    }
  }
}

document.querySelectorAll('.field-num')?.forEach(field => new FieldNum(field));
