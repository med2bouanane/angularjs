angular.module('statisticsLanguageController', ['factory'])
.controller("statisticsLanguageController", ['$scope', 'factoryGraphicsLanguages', '$log', function ($scope, factoryGraphicsLanguages,$log) {


    $scope.statisticsLang = [];
    $scope.numPage = parseInt($("#selectPage2 option:eq(0)").val());
    $scope.select = $("#selectPage2 option:selected").val();
    $scope.limit = $scope.numPage;
    $scope.currentPage = 1;

    $scope.start = 0;
    $scope.end = $scope.numPage;
    $scope.pageCount = 1;

    $scope.update = function () {

        $scope.end = parseInt($scope.numPage);
        $scope.limit = parseInt($scope.numPage);
        $scope.totalItems = parseInt((($scope.statisticsLang.length * 10) / $scope.numPage));
    };

    $scope.pageChanged = function () {
        if ($scope.currentPage > $scope.pageCount) {
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

        var statistic = factoryGraphicsLanguages.getDataStatistic().then(function (d) {

            var chartData = [];

            for (var i = 0; i < d.length; i++) {


                $scope.statisticsLang.push
                (
                    {
                        lang: d[i].Languages,
                        sends: d[i].Sends,
                        fails: d[i].Fails
                    }
                );

                //chart.dataDateFormat = 'DD-MMM-YYYY';
                //AmCharts.formatDate(new Date(d[i].email), "DD-MMM-YYYY");


                chartData.push({
                    date: $scope.statisticsLang[i].lang,//AmCharts.stringToDate($scope.statisticsLang[i].date, "YYYY-MM-DD"),//AmCharts.formatDate(new Date(d[i].email), "DD-MMM-YYYY"),//d[i].email,//$scope.statistic[i].email,//
                    visits: $scope.statisticsLang[i].sends,//d[i].sents//visits,//
                    hits: $scope.statisticsLang[i].fails
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

        chart = AmCharts.makeChart("chartdiv2", {
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
                "synchronizeWith": "v1",
                "synchronizationMultiplier": 5
            }
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
            }
            ],
            "chartScrollbar": {},
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
                //"parseDates": true,
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
        else if ($scope.selectedOrder === order)
        {
            if (order.indexOf("-") > -1)
                $scope.selectedOrder = order.substring(order.indexOf('-') + 1, order.length);
            else
                $scope.selectedOrder = '-' + order;
        }
        else
        {
            $scope.selectedOrder = order
        }
       
    };

}]);