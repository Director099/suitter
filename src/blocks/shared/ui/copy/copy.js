const clipboard = document.querySelectorAll('[data-copy-code]');

clipboard?.forEach(item => item?.addEventListener('click', async () => {
  const inputCopy = item.querySelector('input');
  const text = inputCopy.value;
  inputCopy.select();
  await navigator.clipboard.writeText(text);
}));
