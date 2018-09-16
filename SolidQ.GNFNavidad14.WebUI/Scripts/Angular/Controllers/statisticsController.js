angular.module('statisticsController', ['factory', 'ui.bootstrap'])
.controller("statisticsController", ['$scope','factoryGraphics', '$log', function ($scope,factoryGraphics, $log) {

    $scope.isShow = true;
    $scope.format = 'dd-MM-yyyy';

    //////////////////////////////////////////
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    ///////////////////////////////////////

    $scope.statistics = [];
    $scope.numPage = parseInt($("#selectPage option:eq(0)").val());
    $scope.select = $("#selectPage option:selected").val();
    $scope.limit = $scope.numPage;
    $scope.currentPage = 1;

    $scope.start = 0;
    $scope.end = $scope.numPage;
    $scope.pageCount=1;

    $scope.update = function () {

        $scope.end = parseInt($scope.numPage);
        $scope.limit = parseInt($scope.numPage);
        $scope.totalItems = parseInt((($scope.statistics.length * 10) / $scope.numPage));
    };

    $scope.pageChanged = function () {
        if ($scope.currentPage > $scope.pageCount)
        {
            $scope.start = $scope.start + $scope.limit;
            $scope.end = $scope.end + $scope.limit;
            $scope.pageCount++;
        }
        if ($scope.currentPage < $scope.pageCount) {
            $scope.start = $scope.start - $scope.limit;
            $scope.end = $scope.end - $scope.limit;
            $scope.pageCount--;
        }
        $log.log('Page changed to: ' + $scope.currentPage);
    };
    /////////////////// GRAFICA //////////////////////////
    var chart;
    var chartData = generateChartData();



    function generateChartData() {

        var statistic = factoryGraphics.getDataStatistic().then(function (d) {

            var chartData = [];

            for (var i = 0; i < d.length; i++) {


                $scope.statistics.push
                (
                    {
                        date: d[i].Date,
                        sends: d[i].Sends,
                        fails: d[i].Fails,
                        opens: d[i].Opens
                    }
                );

                //chart.dataDateFormat = 'DD-MMM-YYYY';
                //AmCharts.formatDate(new Date(d[i].email), "DD-MMM-YYYY");

                var visits = Math.round(Math.random() * 40) + 100;
                var hits = Math.round(Math.random() * 80) + 500;
                var views = Math.round(Math.random() * 6000);

                chartData.push({
                    date: AmCharts.stringToDate($scope.statistics[i].date, "YYYY-MM-DD"),//AmCharts.formatDate(new Date(d[i].email), "DD-MMM-YYYY"),//d[i].email,//$scope.statistic[i].email,//
                    visits: $scope.statistics[i].sends,
                    hits: $scope.statistics[i].fails,
                    opens: $scope.statistics[i].opens
                });
            }

            $scope.totalItems = (chartData.length * 10) / $scope.limit;
            //////////////////////////////////////////

            var chart = pintaGrafica(chartData);
            chart.addListener("dataUpdated", chart.zoomToIndexes(chart.dataProvider.length - d.length, chart.dataProvider.length - 1));//zoomChart);
            //zoomChart();
            chart.zoomToIndexes(chart.dataProvider.length - d.length, chart.dataProvider.length - 1);

            //////////////////////////////////////
            return chartData;
        });
        return statistic;

    }


    function zoomChart() {
        chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
    }


    var pintaGrafica = function (chartData) {

        chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "none",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "legend": {
                "useGraphSettings": true
            },
            "dataProvider": chartData,
            "valueAxes": [{
                "id": "v1",
                "axisColor": "#FF6600",
                "axisThickness": 2,
                "gridAlpha": 0.2,
                "axisAlpha": 1,
                "position": "left"
            }, {
                "id": "v2",
                "axisColor": "#FCD202",
                "axisThickness": 2,
                "gridAlpha": 0,
                "axisAlpha": 1,
                "position": "right",
                "synchronizeWith": "v3",
                "synchronizationMultiplier": 5
            },
            ////////
            {
                "id": "v3",
                "axisColor": "#000000",
                "axisThickness": 2,
                "gridAlpha": 0,
                "axisAlpha": 1,
                "position": "right",
                "synchronizeWith": "v1",
                "synchronizationMultiplier": 5
            }
            ///////
            ],
            "graphs": [{
                "valueAxis": "v1",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Enviados",
                "valueField": "visits",
                "fillAlphas": 0
            }, {
                "valueAxis": "v2",
                "lineColor": "#FCD202",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Fallidos",
                "valueField": "hits",
                "fillAlphas": 0
            },
            /////////////////////////
            {
                "valueAxis": "v3",
                "lineColor": "#000000",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Abiertos",
                "valueField": "opens",
                "fillAlphas": 0
            }
            ///////////////////////
            ],
            "chartScrollbar": {},
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "axisColor": "#DADADA",
                "minorGridEnabled": true
            }
        });
        return chart;
    };

    $scope.OrderBy = function (order) {
        $scope.selectedOrder = order;
    };

    $scope.OrderByLink = function (order) {
        console.log("$scope.selectedOrder:_____" + $scope.selectedOrder);
        if (typeof $scope.selectedOrder === 'undefined')
            $scope.selectedOrder = order;
        else if ($scope.selectedOrder === order) {
            if (order.indexOf("-") > -1)
                $scope.selectedOrder = order.substring(order.indexOf('-') + 1, order.length);
            else
                $scope.selectedOrder = '-' + order;
        }
        else {
            $scope.selectedOrder = order
        }

    };

}]);