FirstSteps = {
  showOverview: function() {
    if ($$(".first_steps")[0]) { return; }
    var html = Mustache.to_html(Templates.first_steps.progress);
    $('content').insert({ top: html });
    this.drawProgressBar();
  },
  chooseStep: function(step_number) {
    var container = $$(".first_steps")[0];
    container.select('.step').invoke('hide');
    container.down('.step'+step_number).show();
    container.select('.steps img').invoke('removeClassName', 'active');
    container.down('img[data-step='+step_number+']').addClassName('active');
  },
  grantStep: function(step_number, display_popup) {
    if (this.steps[step_number].achieved) { return; }
    this.steps[step_number].achieved = true;
    var container = $$(".first_steps")[0];
    if (container) {
      var img = container.down('img[data-step='+step_number+']');
      img.src = img.src.gsub(/-disabled/, '');
      this.drawProgressBar();
    }
    if (display_popup) {
      Badge.showBadge(this.steps[step_number].badge);
    }
  },
  steps: {
    1: { badge: Templates.badges.first_project },
    2: { badge: Templates.badges.first_conversation },
    3: { badge: Templates.badges.first_task },
    4: { badge: Templates.badges.first_page },
    5: { badge: Templates.badges.first_invite }
  },
  drawProgressBar: function() {
    $$(".first_steps .completion").invoke("remove");
    var total = 0, completed = 0;
    for(var i = 1; i <= 5; i++) {
      total++;
      if (this.steps[i].achieved) { completed++; }
    }
    var percentage = Math.floor(completed*100/total);
    var html = Mustache.to_html(Templates.first_steps.progress_bar, {
      width: 100,
      filled: percentage,
      text: percentage+'%' });
    $$(".first_steps")[0].insert({ top: html });
  }
};

document.on("click", ".first_steps .steps img", function(e,el) {
  var step_number = el.readAttribute("data-step");
  FirstSteps.chooseStep(step_number);
  FirstSteps.grantStep(step_number, true);
});

document.on("dom:loaded", function() {
  FirstSteps.showOverview();

  if(my_user.stats.projects > 0) {
    FirstSteps.grantStep(1);
  }
});
