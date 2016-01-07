Template.bankSelect.onCreated(function() {
  this.cards = new ReactiveVar();
  this.paymentsId = new ReactiveVar();

  Tracker.autorun(() => {
    FlowRouter.watchPathChange();
    var currentContext = FlowRouter.current();
    this.paymentsId = currentContext.params.paymentsId;
    console.log(currentContext.params.paymentsId, this.paymentsId);
  });
});

Template.bankSelect.helpers({
  "getBankSelect": () => {
    // to prevent Spacebar to crash an error because of empty string
    if (!Template.instance().cards.get()) return;

    let html = Spacebars.SafeString(Template.instance().cards.get());
    return html;
  },
  "getError": () => {
    return Template.instance().cards.get();
  },
  "getPayments": () => {
console.log("getPayments", Template.instance().paymentsId.get());

    if (!Template.instance().paymentsId.get()) return;
    return Payments.findOne({"_id": Template.instance().paymentsId.get()});
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
        $('#error').html(`Catch error: ${error.message}`);
      });
  }
});
