Template.bankSelect.onCreated(function() {
  this.cards = new ReactiveVar();
});

Template.bankSelect.helpers({
  "getBankSelect": function() {
    // to prevent Spacebar to crash an error because of empty string
    if (!Template.instance().cards.get()) return;

    var html = Spacebars.SafeString(Template.instance().cards.get());
    return html;
  }
});

Template.bankSelect.events({
  "click button": function (ev, tpl) {
      Meteor.call("mercanet-list-cards", function (err, res) {
        if (err) {
          console.error(err);
          return;
        } else {
          tpl.cards.set(res);
        }
      });
  }
});
