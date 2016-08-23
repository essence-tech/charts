(function () {
    'use strict';

    angular.module('perfect').directive('scrChart', [function () {
        return {
            scope: {
                data: '='
            },
            link: function ($s, element, attrs) {
                $s.$watch('data', function (o, n) {
                    console.log($s.data, o, n);

                    var answers = $s.data.answers.map(function (a) {
                        return {
                            title: a.copy,
                            percentages: [a.control, a.exposed],
                            minLift: a.range[0],
                            absLift: a.range[1],
                            maxLift: a.range[2]
                        };
                    });
                    var series =  ['Control', 'Exposed'];
                    var totals = [127, 364];

                    element.empty();
                    var chart = new ScrutineerQuestionChart($s.data.question, series, totals, answers, {});
                    element.append(chart);
                }, true);
            }
        };
    }]);
})();
