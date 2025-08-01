const filterLink = document.querySelectorAll('[data-filter-link]');
const filterCurrentClose = document.querySelectorAll('[data-close-filter-current]');

Fancybox.bind("[href='#modal-filter']", {
  dragToClose: false,
  on: {
    close: () => {
      document.querySelectorAll('[data-filter-current]')
        ?.forEach(elem =>
          elem.classList.remove('active'))
    },
  },
});

const togglefilter = (item) => {
  const parentFilter = item.closest('[data-filter]');
  const currentFilter = parentFilter?.querySelector("[data-filter-current]");
  currentFilter.classList.toggle('active');
}

filterLink?.forEach(item =>
  item.addEventListener('click', () => togglefilter(item))
)

filterCurrentClose?.forEach(item =>
  item.addEventListener('click', () => togglefilter(item))
)
