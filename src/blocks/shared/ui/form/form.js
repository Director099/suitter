document.querySelectorAll("[data-form]").forEach((itemForm) => {
  const pristine = new Pristine(itemForm, {
    classTo: 'field-text',
    errorTextParent: 'field-text',
  }, false);

  const onSubmitForm = (e) =>  {
    const valid = pristine.validate();
    return valid ? true : e.preventDefault();
  }

  const onChangeForm = (e) =>  {
    const parent = e.target.closest('.field-text');
    parent.classList.remove('has-danger');

    if(!!parent.querySelector('.pristine-error')) {
      parent.querySelector('.pristine-error').textContent = "";
    }
  }

  itemForm.addEventListener("submit", onSubmitForm);
  itemForm.addEventListener("input", onChangeForm);
})
