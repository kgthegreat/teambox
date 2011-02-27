// Badges for achievements

Badge = {
  // Do I have this badge?
  has: function(name) {
    return my_user.badges.intersect([name]).length !== 0;
  },
  // Grant a badge, displaying its animation
  grant: function(name) {
    if (!my_user.show_badges) { return; }
    if (this.has(name)) { return; }
    $$('.overlay_badge').invoke('remove');
    $$('body')[0].insert({ bottom:
      Mustache.to_html(Templates.badges[name])
    });
    var badge = $$('.overlay_badge')[0];
    var pop = new Effect.MoveBottom(badge, {
      bottom: 300,
      transition: Effect.Transitions.spring,
      duration: 2
    });
    badge.highlight({ duration: 3 });
    Sound.play('/sounds/achievement.wav');
    this.showStars(badge);
    // Save this badge to the database so it won't be repeated
    my_user.badges.push(name);
    var save = new Ajax.Request("/account/badge/"+name+"/grant");
    // Redraw the First Steps panel if present
    if ($$('.first_steps')[0]) { FirstSteps.showOverview(); }
    return badge;
  },
  // Special effect when displaying a badge
  showStars: function(container) {
    container = container || $$('body')[0];
    for(var i=0; i<10; i++){
      var starting = {
        x: 16 + Math.floor(Math.random() * 470),
        y: -16
      };
      var star = new Element('img', {
        src: '/famfamfam/star.png',
        style: 'position: fixed; ' +
               'bottom: '+starting.y+'px; ' +
               'right: '+starting.x+'px; '
      });
      star.addClassName('badge_star');
      container.insert({ bottom: star });
      new Effect.Parallel([
        new Effect.MoveBottom(star, {
          sync: true,
          bottom: 250+Math.floor(Math.random() * 100)
        }),
        new Effect.Opacity(star, {
          sync: true, from: 1, to: 0
        })
      ], {
          duration: 2,
          transition: Effect.Transitions.linear,
          delay: Math.random()*2
      });
    }
  }
};

// Fade the badge when clicked
document.on("click", ".overlay_badge", function(e,el) {
  e.stop();
  el.fade();
});

// Used to animate the bottom of a 'position: fixed' element
Effect.MoveBottom = Class.create(Effect.Base, {
  initialize: function(element) {
    this.element = $(element);
    if (!this.element) { throw(Effect._elementDoesNotExistError); }
    var options = Object.extend({
      bottom: 0
    }, arguments[1] || { });
    this.start(options);
  },
  setup: function() {
    this.originalBottom = parseFloat(this.element.getStyle('bottom') || '0');
  },
  update: function(position) {
    this.element.setStyle({
      bottom: (this.options.bottom  * position + this.originalBottom).round() + 'px'
    });
  }
});
