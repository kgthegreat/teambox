FirstSteps = {
  steps: { completed: 0, total: 5 },
  // Displays the global progress for the first steps
  showOverview: function() {
    if (!my_user.show_badges) { return; }
    $$(".first_steps").invoke('remove');
    var html = Mustache.to_html(Templates.first_steps.overview);
    $('content').insert({ top: html });

    this.steps.completed = 0;
    $w("first_conversation first_task first_page first_project first_invite").each(function(name) {
      if(Badge.has(name)) { FirstSteps.activateStep(name); }
    });

    this.drawProgressBar();
  },
  // Highlight a step, keep track of the progress
  activateStep: function(name) {
    var container = $$(".first_steps")[0];
    if (!container) { return; }
    var img = container.down("img[data-name='"+name+"']");
    img.src = img.src.gsub(/-disabled/, '');
    this.steps.completed++;
  },
  // Show the text for a given step
  chooseStep: function(step_number) {
    var container = $$(".first_steps")[0];
    container.select('.step').invoke('hide');
    container.down('.step'+step_number).show();
    container.select('.steps img').invoke('removeClassName', 'active');
    container.down('img[data-step='+step_number+']').addClassName('active');
  },
  // Draws progress bar for the overview
  drawProgressBar: function() {
    var container = $$(".first_steps")[0];
    if (!container) { return; }
    container.select(".completion").invoke("remove");
    var percentage = Math.floor(this.steps.completed*100/this.steps.total);
    var html = Mustache.to_html(Templates.first_steps.progress_bar, {
      width: 100,
      filled: percentage,
      text: percentage+'%' });
    container.insert({ top: html });
  }
};

document.on("click", ".first_steps .steps img", function(e,el) {
  var step_number = el.readAttribute("data-step");
  FirstSteps.chooseStep(step_number);
});

// Redraw the First Steps panel if present
document.on("badge:new_badge", function() {
  if ($$('.first_steps')[0]) { FirstSteps.showOverview(); }
});
