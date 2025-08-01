const dropdown = () => {
  const dropdown = document.querySelectorAll('.dropdown');
  const btnDropdown = document.querySelectorAll('.dropdown__toggler');
  const keycode = {
    ESC: 27,
  };

  const closeDropdown = () => {
    dropdown.forEach((elem) => {
      if(elem.classList.contains('dropdown--open')) {
        elem.classList.remove('dropdown--open');
      }
    })
  };

  btnDropdown.forEach((item) => {
    item.addEventListener('click', function(evt) {
      evt.preventDefault();
      this.closest('.dropdown').classList.toggle('dropdown--open');
    })
  })

  document.addEventListener('click', function(evt) {
    if(!evt.target.matches('.dropdown__toggler')) {
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (evt) => {
    if (evt.keyCode === keycode.ESC) {
      closeDropdown();
    }
  });
}

dropdown();
