FirstSteps = {
  showProgress: function() {
    if ($$(".first_steps").length > 0) { return; }
    var html = Mustache.to_html(Templates.first_steps.progress);
    $('content').insert({ top: html });
  },
  chooseStep: function(step_number) {
    var container = $$(".first_steps")[0];
    container.select('.step').invoke('hide');
    container.down('.step'+step_number).show();
    container.select('.steps img').invoke('removeClassName', 'active');
    container.down('img[data-step='+step_number+']').addClassName('active');
  }
};

document.on("click", ".first_steps .steps img", function(e,el) {
  var step_number = el.readAttribute("data-step");
  FirstSteps.chooseStep(step_number);
});

document.on("dom:loaded", function() {
  FirstSteps.showProgress();
});
