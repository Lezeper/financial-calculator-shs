(function(){
    app.component('inputAmount', {
        templateUrl: "/common/components/input/amount/amount.view.html",
        controller: function testController(){

        },
        bindings: {
            readonly: '=',
            data: '='
        }
    });
})();