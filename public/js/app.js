'use strict';

angular.module('generator', ['perfect']);
angular.module('generator').run();


(function () {
    angular.module('errorRange', []);
    var errorRange = ''+
    '<figure class="essrange flex-row">'+
        '<div class="essrange__min" display="{{low}}%" style="flex: 0 1 {{minWidth}}%"></div>'+
        '<div class="essrange__bar"></div>'+
        '<div class="essrange__max" display="{{high}}%" style="flex: 0 1 {{maxWidth}}%"></div>'+
        '<div ng-class="{\'show-label\': showCircleLabel}" class="essrange__val" display="{{val}}%" style="left: calc({{valPos}}% - .5rem)"></div>'+
    '</figure>';
    angular.module('errorRange').directive('essRange', [function () {
        return {
            scope: {
                min: '=',
                max: '=',
                high: '=',
                low: '=',
                val: '=',
                showCircleLabel: '='
            },
            template: errorRange,
            link: function ($s, element, attrs) {
                $s.$watch('min+max+high+low+val', function () {
                    var range = $s.max - $s.min;
                    $s.minWidth = (($s.low - $s.min) / range) * 100;
                    $s.maxWidth = (($s.max - $s.high) / range) * 100;
                    $s.valPos = (($s.val - $s.min) / range) * 100;
                });
            }
        }
    }]);
}());

(function () {
    'use strict';
    angular.module('perfect', ['errorRange']);
    var perfect = ''+
        '<figure class="perfect flex-col">'+
            '<div class="perfect__header flex-row">'+
                '<div class="perfect__header--question">Q: {{data.question}}</div>'+
                '<div class="perfect__header--relative" ng-if="showRelativeLift">Relative lift</div>'+
                '<div class="perfect__header--observed" ng-class="{wider: !showRelativeLift}">Absolute lift</div>'+
                '<div class="perfect__header--range" ng-class="{wider: !showRelativeLift}">Lift range</div>'+
            '</div>'+
            '<div class="perfect__answer flex-row align-middle" ng-repeat="answer in data.answers">'+
                '<div class="perfect__answer--copy">{{answer.copy}}</div>'+
                '<div class="perfect__answer--split">'+
                    '<div>'+
                        '<progress class="control" max="{{maxPercent}}" value="{{answer.control}}"></progress>'+
                        '<label style="left: {{(answer.control / maxPercent) * 100}}%">{{answer.control | number:barDec}}%</label>'+
                    '</div>'+
                    '<div>'+
                        '<progress class="exposed" max="{{maxPercent}}" value="{{answer.exposed}}"></progress>'+
                        '<label style="left: {{(answer.exposed / maxPercent) * 100}}%">{{answer.exposed | number:barDec}}%</label>'+
                    '</div>'+
                '</div>'+
                '<div class="perfect__answer--relative {{answer.color}}" ng-if="showRelativeLift">{{((answer.exposed / answer.control) - 1) * 100.0 | number:relativeDec | pn}}%</div>'+
                '<div class="perfect__answer--observed {{answer.color}}" ng-class="{wider: !showRelativeLift}">{{answer.exposed - answer.control | number:observedDec | pn}}%</div>'+
                '<div class="perfect__answer--range" ng-class="{wider: !showRelativeLift}">'+
                    '<ess-range min="minRange" max="maxRange" high="answer.range[2]" low="answer.range[0]" val="answer.range[1]" class="{{answer.color}}" show-circle-label="showCircleLabel"></ess-range>'+
                '</div>'+
            '</div>'+
        '</figure>';
    angular.module('perfect').directive('perfect', [function () {
        return {
            scope: {
                data: '=',
                barDec: '=',
                observedDec: '=',
                relativeDec: '=',
                showCircleLabel: '=',
                showRelativeLift: '='
            },
            template: perfect,
            link: function ($s, element, attrs) {
                $s.$watch('data', function () {
                    var _mr = $s.data.answers.reduce(function (r, c) {
                        return (parseFloat(c.range[2]) > r) ? parseFloat(c.range[2]) : r;
                    }, -100);
                    $s.maxRange = _mr + (_mr * 0.1);
                    $s.minRange = $s.data.answers.reduce(function (r, c) {
                        return (parseFloat(c.range[0]) < r) ? parseFloat(c.range[0]) : r;
                    }, 100);

                    $s.maxPercent = $s.data.answers.reduce(function (r, c) {
                        if (c.control > r) r = parseFloat(c.control);
                        if (c.exposed > r) r = parseFloat(c.exposed);
                        return r;
                    }, -100) + 10.0;
                }, true);
            }
        }
    }]);

    angular.module('perfect').filter('pn', function () {
        return function (num) {
            return (num > 0) ? '+' + num : num;
        }
    });

    angular.module('perfect').controller('perfect', ['$scope', function ($s) {

        $s.charts = [];
        function updateCharts() {
            $s.charts = [];
            for ( var i=0,len=localStorage.length; i < len; ++i ) {
                $s.charts.push(localStorage.key(i));
            }
        }
        updateCharts();

        var sessId = window.location.hash.replace('#', '');
        if (sessId == "") {
            sessId = 'default';
        }
        $s.name = sessId.replace('#', '');;

        var session = localStorage.getItem(sessId);

        if (session == null) {
            $s.data = {
                question: 'Which of the following do you associate with Chromebook?',
                answers: [
                    {
                        copy: 'Affordable',
                        control: 29.2,
                        exposed: 33.0,
                        color: 'green',
                        range: [0, 3.8, 8.3],
                    },
                    {
                        copy: 'Comes pre-loaded with apps',
                        control: 20.6,
                        exposed: 23.9,
                        color: 'green',
                        range: [0.5, 3.3, 6.4],
                    },
                    {
                        copy: 'Has lots of RAM',
                        control: 8.9,
                        exposed: 11.9,
                        color: 'green',
                        range: [0.4, 3.0, 6.4],
                    },
                    {
                        copy: 'Lightweight',
                        control: 34.7,
                        exposed: 36.4,
                        color: 'orange',
                        range: [-2.1, 1.7, 6.1],
                    },
                    {
                        copy: 'Runs Google docs',
                        control: 35.5,
                        exposed: 34.5,
                        color: 'red',
                        range: [-2.9, -1.0, 4.5],
                    },
                    {
                        copy: 'The laptop from Google',
                        control: 50.7,
                        exposed: 54.0,
                        color: 'green',
                        range: [0, 3.3, 6.7],
                    }
                ]
            };
        } else {
            $s.data = JSON.parse(session);
        }

        $s.$watch('data', function (n) {
            localStorage.setItem(sessId, JSON.stringify(n));
            updateCharts();
        }, true);

        $s.$watch('name', function (n) {
            window.location.hash = n;
            sessId = window.location.hash.replace('#', '');
        });

        $s.clearCharts = function () {
            localStorage.clear();
            window.location.hash = '';
            window.location.reload();
        };

        $s.changeChart = function (key) {
            window.location.hash = key;
            window.location.reload();
        };

        $s.width = 100;
        $s.bgColor = '';
        $s.fgColor = '';
        $s.theme = '';
        $s.barDec = 1;
        $s.observedDec = 1;
        $s.relativeDec = 1;
        $s.showCircleLabel = true;
        $s.showRelative = true;

        $s.removeAnswer = function (idx) {
            $s.data.answers.splice(idx, 1);
        };

        $s.addAnswer = function () {
            $s.data.answers.push({
                copy: 'Placeholder',
                control: 50,
                exposed: 50,
                color: '',
                range: [0, 0, 0],
            });
        }
    }]);
}());
