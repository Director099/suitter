import {ToggleOverlay} from "../../shared/utils-js/utils";

new autoComplete({
  selector: "[data-autocomplite]",
  data: {
    src: async () => {
      try {
        const source = await fetch(`./js/search-form.json`);
        const data = await source.json();
        return data;
      } catch (error) {
        return error;
      }
    },
    keys: ["text"],
    cache: true,
  },
  resultItem: {
    element: (item, data) => {
      item.innerHTML = `<a class="link-search" href=${data.value.href}>${data.match}</a>`
    },
    highlight: true,
  }
})

class SearchHeader extends ToggleOverlay {
  constructor() {
    super();
    this.formSearch = document.querySelector('[data-search]');
    this.closeSearch = this.formSearch.querySelector('[data-close-search]');
    this.btnFormSearch = this.formSearch.querySelector('[data-btn-search]');

    this._init();
  }

  hiddenForm() {
    this.formSearch.classList.remove('active');
    super.removeOverlay();
  }

  showForm() {
    this.formSearch.classList.add('active');
    this.formSearch.querySelector('input').focus();
    super.addOverlay();
  }

  _init() {
    this.btnFormSearch.addEventListener('click', this.showForm.bind(this));
    this.overlay.addEventListener('click',  this.hiddenForm.bind(this));
    this.closeSearch.addEventListener('click', this.hiddenForm.bind(this));
    document.addEventListener('keydown', (evt) => {
      if(evt.key === 'Escape') {
        this.hiddenForm()
      }
    });
  }
}

new SearchHeader();
