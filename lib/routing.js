FlowRouter.route('/bank/paid/:orderId', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the post:", params.postId);

    $("<h2>Paiement en cours</h2>").appendTo("body");
  }
});