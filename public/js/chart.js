(function () {
    'use strict';

    // Scrutineer brand colors.
    var COLORS = [
        "39679e", "b8e446", "f1674a", "36af63",
        "134580", "89b80e", "c32e0f", "0b8d3c",
        "235897", "a7da24", "e64827", "1ca750",
        "527bad", "cbf267", "ff866d", "51be79",
        "789bc5", "d9f68d"
    ];

    /**
     * Generate a Scrutineer question chart.
     * @constructor
     *
     * @param {String} title The question title.
     * @param {String[]} series The series names.
     * @param {Number[]} totals The total number of answers for this question.
     *
     * @param {Object[]} answers The answer data for this question.
     * @param {String} answer.title An answer title.
     * @param {Number[]} answer.percentages The percentage per series for this answer.
     * @param {Number} answer.minLift The minimum lift for this answer.
     * @param {Number} answer.absLift The absolute lift for this answer.
     * @param {Number} answer.maxLift The maximum lift for this answer.
     *
     * @param {Object} options Associated options to go along with the question.
     *
     * @returns {Element} Markup to display the given data.
     */
    var ScrutineerQuestionChart = function (title, series, totals, answers, options) {
        // Main container.
        var figure = document.createElement('figure');
        figure.className = 'sqc';

        // Header.
        var header = generateQuestionHeader(title);
        figure.appendChild(header);

        // Create answer information.
        var maxLift = getMaxLift(answers);
        var minLift = getMinLift(answers);
        var maxResult = getMaxResult(answers);

        // Answers.
        for (var i=0, len=answers.length; i < len; i++) {
            var a = generateQuestionAnswer(answers[i], minLift, maxLift, maxResult);
            figure.appendChild(a);
        }

        // Footer.
        var footer = generateQuestionFooter(series, totals);
        figure.appendChild(footer);

        return figure;
    };

    /**
     * Generate the question header bar
     *
     * @param {String} title The question title.
     *
     * @returns {Element} The header element.
     */
    function generateQuestionHeader(title) {
        var header = document.createElement('header');
        header.className = 'sqc__h';

        // Question
        var q = document.createElement('div');
        q.className = 'sqc__h--question';
        q.innerHTML = 'Q: '+title;
        header.appendChild(q);

        // Lift
        var l = document.createElement('div');
        l.className = 'sqc__h--range';
        l.innerHTML = 'Lift range';
        header.appendChild(l);

        return header;
    }

    /**
     * Generate an answer row.
     *
     * @param {Object} answer The answer object.
     * @param {String} answer.title An answer title.
     * @param {String[]} answer.series The series names.
     * @param {Number[]} answer.percentages The percentages per series for this answer.
     * @param {Number} answer.minLift The minimum lift for this answer.
     * @param {Number} answer.absLift The absolute lift for this answer.
     * @param {Number} answer.maxLift The maximum lift for this answer.
     * @param {Number} minLift The minimum lift overall.
     * @param {Number} maxLift The maximum lift overall.
     * @param {Number} maxResult The maximum result overall.
     *
     * @returns {Element} The answer row element.
     */
    function generateQuestionAnswer(answer, minLift, maxLift, maxResult) {
        // Answer container.
        var a = document.createElement('div');
        a.className = 'sqc__a';

        // Answer title.
        var c = document.createElement('div');
        c.className = 'sqc__a--title';
        c.innerHTML = answer.title;
        a.appendChild(c);

        // Answer bars.
        var b = document.createElement('div');
        b.className = 'sqc__a--bars';
        for (var i=0,len=answer.percentages.length; i < len; i++) {
            var barBlock = document.createElement('div');

            var barContainer = document.createElement('span');
            barContainer.className = 'sqc__progress-container';

            var bar = document.createElement('span');
            bar.className = 'sqc__progress-value';
            bar.style.width = ((answer.percentages[i] / maxResult) * 100) + '%';
            bar.style.backgroundColor = '#'+COLORS[i];
            barContainer.appendChild(bar);

            var label = document.createElement('label');
            label.style.left = ((answer.percentages[i] / maxResult) * 100) + '%';
            label.innerHTML = answer.percentages[i] + '%';
            barContainer.appendChild(label);

            barBlock.appendChild(barContainer);
            b.appendChild(barBlock);
        }
        a.appendChild(b);

        // Lift range.
        var range = maxLift - minLift;
        var minWidth = ((answer.minLift - minLift) / range) * 100;
        var maxWidth = ((maxLift - answer.maxLift) / range) * 100;
        var valPos = ((answer.absLift - minLift) / range) * 100;

        var l = document.createElement('div');
        l.className = 'sqc__a--range';

        var f = document.createElement('figure');
        f.className = 'sqc__a__range';

        var min = document.createElement('div');
        min.className = 'sqc__a__range--min';
        min.style.flex = '0 1 '+minWidth+'%';
        min.setAttribute('display', answer.minLift+'%');

        var line = document.createElement('div');
        line.className = 'sqc__a__range--line';

        var max = document.createElement('div');
        max.className = 'sqc__a__range--max';
        max.style.flex = '0 1 '+maxWidth+'%';
        max.setAttribute('display', answer.maxLift+'%');

        var val = document.createElement('div');
        val.className = 'sqc__a__range--val';
        val.style.left = 'calc('+valPos+'% - .5rem)';
        val.setAttribute('display', answer.absLift+'%');

        f.appendChild(min);
        f.appendChild(line);
        f.appendChild(max);
        f.appendChild(val);
        l.appendChild(f);
        a.appendChild(l);

        return a;
    }

    /**
     * Generate an answer row.
     *
     * @param {Object[]} answers The answers data set from the constructor.
     *
     * @returns {Element} A footer element.
     */
    function generateQuestionFooter(series, totals) {
        var footer = document.createElement('footer');
        footer.className = 'sqc__f';

        for (var i=0,len=series.length; i < len; i++) {
            var s = document.createElement('div');
            s.className = 'sqc__f__s';

            var icon = document.createElement('i');
            icon.style.backgroundColor = '#'+COLORS[i];

            var name = document.createElement('span');
            name.innerHTML = series[i]+', n='+totals[i];

            s.appendChild(icon);
            s.appendChild(name);
            footer.appendChild(s);
        }

        return footer;
    }

    /**
     * Get maximum lift.
     *
     * @param {Object[]} answers Answer data from the constructor.
     *
     * @returns {Number} The maximum lift percentage.
     */
    function getMaxLift(answers) {
        var _mr = answers.reduce(function (r, c) {
            return (parseFloat(c.maxLift) > r) ? parseFloat(c.maxLift) : r;
        }, -100);
        return _mr + (_mr * 0.1);
    }

    /**
     * Get minimum lift.
     *
     * @param {Object[]} answers Answer data from the constructor.
     *
     * @returns {Number} The minimum lift percentage.
     */
    function getMinLift(answers) {
        return answers.reduce(function (r, c) {
            return (parseFloat(c.minLift) < r) ? parseFloat(c.minLift) : r;
        }, 100);
    }

    /**
     * Get maximum percent result.
     *
     * @param {Object[]} answers Answer data from the constructor.
     *
     * @returns {Number} The maximum result.
     */
    function getMaxResult(answers) {
        var mp = answers.reduce(function (r, c) {
            return c.percentages.reduce(function (red, cur) {
                return (parseFloat(cur) > red) ? parseFloat(cur) : red;
            }, r);
        }, -100);
        if (mp > 10) {
            mp += 10;
        } else if (mp > 1) {
            mp += 1;
        } else if (mp > 0.1) {
            mp += 0.1;
        } else if (mp > 0.01) {
            mp += 0.01;
        } else if (mp > 0.001) {
            mp += 0.001;
        } else if (mp > 0.0001) {
            mp += 0.0001;
        } else if (mp > 0.00001) {
            mp += 0.00001;
        } else if (mp > 0.000001) {
            mp += 0.000001;
        } else if (mp > 0.0000001) {
            mp += 0.0000001;
        }
        return mp;
    }

    // Make it available.
    window.ScrutineerQuestionChart = ScrutineerQuestionChart;
})();
