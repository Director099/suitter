(function () {
  var slider = document.getElementById('slider-range');
  var input0 = document.getElementById('input-range-0');
  var input1 = document.getElementById('input-range-1');
  var inputs = [input0, input1];

  if (slider) {
    noUiSlider.create(slider, {
      start: [0, 700000],
      connect: true,
      range: {
        'min': 0,
        'max': 700000
      }
    });

    slider.noUiSlider.on('update', function (values, handle) {
      inputs[handle].value = Math.round(values[handle]);
    });

    inputs.forEach(function (input, handle) {
      input.addEventListener('change', function () {
        slider.noUiSlider.setHandle(handle, this.value);
      });
    });
  }
})();
