Template.bankSelect.onCreated(function() {
  this.cards = new ReactiveVar();
});

Template.bankSelect.helpers({
  "getBankSelect": () => {
    // to prevent Spacebar to crash an error because of empty string
    if (!Template.instance().cards.get()) return;

    let html = Spacebars.SafeString(Template.instance().cards.get());
    return html;
  }
});

Template.bankSelect.events({
  "click button": (ev, tpl) => {
    let promise = new Promise( (resolve, reject) => {
      Meteor.call("mercanet-list-cards", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    promise
      .then( result => {
        tpl.cards.set(result);
      })
      .catch( error => {
        console.error(error);
      });
  }
});

