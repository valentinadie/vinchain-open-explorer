(function () {
    'use strict';

    angular.module('app.fees')
        .controller('feesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'appConfig', 'utilities', feesCtrl]);

    function feesCtrl($scope, $filter, $routeParams, $http, appConfig, utilities) {

        $http.get(appConfig.urls.python_backend + "/fees")
            .then(function(response) {
                //console.log(response.data.parameters.current_fees);
                var fees = [];
                var basic_fee = 0;
                var premium_fee = 0;
                var price_per_kbyte = 0;
                for(var i = 0; i < response.data.parameters.current_fees.parameters.length; i++) {
                    if (response.data.parameters.current_fees.parameters[i][1].fee)
                        basic_fee = response.data.parameters.current_fees.parameters[i][1].fee;
                    else
                        basic_fee = response.data.parameters.current_fees.parameters[i][1].basic_fee;
                    
                    var op_type  = utilities.operationType(response.data.parameters.current_fees.parameters[i][0]);

                    var parsed = { identifier: response.data.parameters.current_fees.parameters[i][0], operation: op_type[0], color: op_type[1], basic_fee: utilities.formatBalance(basic_fee, 5), premium_fee: utilities.formatBalance(response.data.parameters.current_fees.parameters[i][1].premium_fee, 5), price_per_kbyte: utilities.formatBalance(response.data.parameters.current_fees.parameters[i][1].price_per_kbyte, 5) };
                    fees.push(parsed);
                }
                $scope.fees = fees;
            });

        // column to sort
        $scope.column = 'identifier';
        // sort ordering (Ascending or Descending). Set true for desending
        $scope.reverse = false;
        // called on header click
        $scope.sortColumn = function(col){
            $scope.column = col;
            if($scope.reverse){
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            }else{
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
        // remove and change class
        $scope.sortClass = function(col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }
    }
})();
