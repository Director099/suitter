document.querySelectorAll('[data-btn-eye]').forEach(item =>
  item?.addEventListener('click', () => {
    const field = item.parentElement.querySelector('input');
    item.classList.toggle('field-text__btn-password--open');
    item.classList.contains('field-text__btn-password--open') ? field.type = 'text' : field.type = 'password';
  })
)
