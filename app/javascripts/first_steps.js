FirstSteps = {
  // Displays the global progress for the first steps
  showOverview: function() {
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
  steps: { completed: 0, total: 5 },
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

document.on("dom:loaded", function() {
  FirstSteps.showOverview();

  // If the badge is not granted with JS, then we check the stats
  if (my_user.stats.conversations > 0 && !Badge.has("first_conversation")) {
    Badge.grant("first_conversation");
  } else if (my_user.stats.tasks > 0 && !Badge.has("first_task")) {
    Badge.grant("first_task");
  } else if (my_user.stats.pages > 0 && !Badge.has("first_page")) {
    Badge.grant("first_page");
  } else if (my_user.stats.invites > 0 && !Badge.has("first_invite")) {
    Badge.grant("first_invite");
  } else if (my_user.stats.projects > 0 && !Badge.has("first_projects")) {
    Badge.grant("first_project");
  }
});
