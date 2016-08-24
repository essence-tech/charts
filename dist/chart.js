(function () {
    'use strict';

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
        var figure = createElement('figure', 'sqc');

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
        var header = createElement('header', 'sqc__h');

        // Question
        var q = createElement('div', 'sqc__h--question', 'Q: '+title);
        header.appendChild(q);

        // Lift
        var l = createElement('div', 'sqc__h--range', 'Lift range');
        header.appendChild(l);

        return header;
    }

    // Scrutineer brand colors.
    var COLORS = [
        "#39679e", "#b8e446", "#f1674a", "#36af63",
        "#134580", "#89b80e", "#c32e0f", "#0b8d3c",
        "#235897", "#a7da24", "#e64827", "#1ca750",
        "#527bad", "#cbf267", "#ff866d", "#51be79",
        "#789bc5", "#d9f68d"
    ];

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
        var a = createElement('div', 'sqc__a');

        // Answer title.
        var c = createElement('div', 'sqc__a--title', answer.title);
        a.appendChild(c);

        // Answer bars.
        var b = createElement('div', 'sqc__a--bars');
        for (var i=0,len=answer.percentages.length; i < len; i++) {
            var barBlock = document.createElement('div');

            var barContainer = createElement('span', 'sqc__progress-container');

            var bar = createElement('span', 'sqc__progress-value');
            bar.style.width = ((answer.percentages[i] / maxResult) * 100) + '%';
            bar.style.backgroundColor = COLORS[i];
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
        var minWidth = ((parseFloat(answer.minLift) - minLift) / range) * 100;
        var maxWidth = ((maxLift - parseFloat(answer.maxLift)) / range) * 100;
        var valPos = ((parseFloat(answer.absLift) - minLift) / range) * 100;

        var l = createElement('div', 'sqc__a--range');

        var f = createElement('figure', 'sqc__a__range');

        var min = createElement('div', 'sqc__a__range--min');
        min.style.flex = '0 1 '+minWidth+'%';
        min.setAttribute('display', answer.minLift+'%');

        var line = createElement('div', 'sqc__a__range--line');

        var max = createElement('div', 'sqc__a__range--max');
        max.style.flex = '0 1 '+maxWidth+'%';
        max.setAttribute('display', answer.maxLift+'%');

        var val = createElement('div', 'sqc__a__range--val');
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
        var footer = createElement('footer', 'sqc__f');

        for (var i=0,len=series.length; i < len; i++) {
            var s = createElement('div', 'sqc__f__s');

            var icon = document.createElement('i');
            icon.style.backgroundColor = COLORS[i];

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

    /**
     * Create an element with a class.
     *
     * @param {String} element The element type.
     * @param {String} cls The class.
     * @param {String} content What to set the innerHTML to.
     *
     * @returns {Element} A newly created element.
     */
    function createElement(element, cls, content) {
        var e = document.createElement(element);
        e.className = cls;
        if (content) e.innerHTML = content;
        return e;
    }

    // Make it available.
    window.ScrutineerQuestionChart = ScrutineerQuestionChart;
})();
