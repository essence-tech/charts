(function () {
    'use strict';
    angular.module('perfect', ['errorRange']);
    var perfect = ''+
        '<figure class="perfect flex-col">'+
            '<div class="perfect__header flex-row">'+
                '<div class="perfect__header--question">Q: {{data.question}}</div>'+
                '<div class="perfect__header--observed">Observed lift</div>'+
                '<div class="perfect__header--realtive">Relative lift</div>'+
                '<div class="perfect__header--range">Lift range</div>'+
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
                '<div class="perfect__answer--observed {{answer.color}}">{{answer.exposed - answer.control | number:observedDec}}%</div>'+
                '<div class="perfect__answer--relative {{answer.color}}">{{((answer.exposed / answer.control) - 1) * 100.0 | number:relativeDec}}%</div>'+
                '<div class="perfect__answer--range">'+
                    '<ess-range min="minRange" max="maxRange" high="answer.range[2]" low="answer.range[0]" val="answer.range[1]" class="{{answer.color}}"></ess-range>'+
                '</div>'+
            '</div>'+
        '</figure>';
    angular.module('perfect').directive('perfect', [function () {
        return {
            scope: {
                data: '=',
                barDec: '=',
                observedDec: '=',
                relativeDec: '='
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

    angular.module('perfect').controller('perfect', ['$scope', function ($s) {
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

        $s.width = 100;
        $s.bgColor = '#fefefe';
        $s.fgColor = '#000';
        $s.theme = 'google';
        $s.barDec = 1;
        $s.observedDec = 1;
        $s.relativeDec = 1;

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
