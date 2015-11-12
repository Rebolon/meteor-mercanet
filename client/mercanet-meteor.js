Template.bankSelect.onCreated(function() {
  this.cards = new ReactiveVar();
});

Template.bankSelect.helpers({
  "getBankSelect": function() {
    return Template.instance().cards.get();
  }
});

Template.bankSelect.events({
  "click button": function() {
    Meteor.call("mercanet-list-cards", function(err, res) {
      if (err) {
        console.error(err);
        return;
      }

      Template.instance().cards.set(res);
    });
  };
});

