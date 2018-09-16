angular.module('ContactController', [])
.controller('ContactController', function ($scope, $http) {

        $scope.users =
            [
                {'image':'./Images/eKPI.jpg','name':'Omar','phone':'7898898','fax':'111111111','gsm':'GSM 1','email':'omar@gmail.com'},
                {'image':'./Images/eKPI.jpg','name':'Mohamed','phone':'899898','fax':'222222222','gsm':'GSM 2','email':'mohamed@gmail.com'},
                {'image':'./Images/eKPI.jpg','name':'Ayman','phone':'1122221','fax':'333333333','gsm':'GSM 3','email':'ayman@gmail.com'}
            ];


});