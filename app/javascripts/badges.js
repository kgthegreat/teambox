// Badges for achievements

Badge = {
  showBadge: function(template) {
    $$('.overlay_badge').invoke('remove');
    $$('body')[0].insert({ bottom:
      Mustache.to_html(template)
    });
    var badge = $$('.overlay_badge')[0];
    new Effect.MoveBottom(badge, {
      bottom: 300,
      transition: Effect.Transitions.spring,
      duration: 2
    });
    badge.highlight({ duration: 3 });
    this.showStars(badge);
    Sound.play('/sounds/achievement.wav');
    return badge;
  },
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
