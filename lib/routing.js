FlowRouter.route('/bank/paid/:paymentsId', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the post:", params.paymentsId);

    console.log("Payments found", Payments.findOne(params.paymentsId));
  }
});

FlowRouter.route('/bank/fail/:paymentsId', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the post:", params.paymentsId);

    console.log("Payments found", Payments.findOne(params.paymentsId));
  }
});
