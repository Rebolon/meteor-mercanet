Template.bankSelect.onCreated(function() {
  this.cards = new ReactiveVar();
});

Template.bankSelect.helpers({
  "getBankSelect": () => {
    return Template.instance().cards.get();
  }
});

Template.bankSelect.events({
  "click button": () => {
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
        Template.instance().cards.set(result);
      })
      .catch( error => {
        console.error(error);
      });
  }
});

