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
     * @param {Number[]} answer.minLift The minimum lift for this answer.
     * @param {Number[]} answer.absLift The absolute lift for this answer.
     * @param {Number[]} answer.maxLift The maximum lift for this answer.
     * @param {String[]} answer.color The color for the lift circle for this answer.
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

        // Normalize answers.
        answers = normamlizeAnswers(answers);

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
     * Normalize answers, which could come in different formats.
     *
     * @param {Object[]} answers Question answer data.
     *
     * @returns {Object[]} Normalized answers.
     */
    function normamlizeAnswers(answers) {
        return answers.map(function (answer) {
            // Required attributes.
            ['minLift', 'absLift', 'maxLift'].map(function (key) {
                if (!Array.isArray(answer[key])) {
                    answer[key] = [answer[key]];
                }
                var invalid = answer[key].some(function (v) {
                    return (v === null || isUndefined(v));
                });
                if (invalid) {
                    answer.minLift = [];
                    answer.absLift = [];
                    answer.maxLift = [];
                }
            });
            // Optional attributes.
            ['color'].map(function (key) {
                if (answer[key] === null || isUndefined(answer[key])) {
                    answer[key] = [];
                }
                if (!Array.isArray(answer[key])) {
                    answer[key] = [answer[key]];
                }
            });
            return answer;
        });
    }

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

        // Numbers
        var n = createElement('dev', 'sqc__h--numbers', 'Headroom Lift');
        header.appendChild(n);

        // Lift
        var l = createElement('div', 'sqc__h--range', 'Absolute Lift');
        header.appendChild(l);

        return header;
    }

    // Scrutineer brand colors.
    var COLORS = [
        "#b8e446", "#39679e", "#f1674a", "#36af63",
        "#134580", "#89b80e", "#c32e0f", "#0b8d3c",
        "#235897", "#a7da24", "#e64827", "#1ca750",
        "#527bad", "#cbf267", "#ff866d", "#51be79",
        "#789bc5", "#d9f68d",
    ];

    var DEFAULT_RANGE_COLOR = 'rgba(0,0,0,.2)';

    /**
     * Generate an answer row.
     *
     * @param {Object} answer The answer object.
     * @param {String} answer.title An answer title.
     * @param {String[]} answer.series The series names.
     * @param {Number[]} answer.percentages The percentages per series for this answer.
     * @param {Number[]} answer.minLift The minimum lift for this answer.
     * @param {Number[]} answer.absLift The absolute lift for this answer.
     * @param {Number[]} answer.maxLift The maximum lift for this answer.
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

        // Answer bars.
        var b = createElement('div', 'sqc__a--bars');

        // Answer numbers.
        var n = createElement('div', 'sqc__a--numbers');

        // Answer lift.
        var l = createElement('div', 'sqc__a--range');

        // Create pairs of branches.
        for (var idx=1,branches=answer.percentages.length;idx < branches; idx++) {
            // Pair
            var p = createElement('div', 'sqc__a__bars');

            // Control
            p.appendChild(createAnswerBar(0, answer.percentages[0], maxResult));

            // Exposed branch
            p.appendChild(createAnswerBar(idx, answer.percentages[idx], maxResult));

            b.appendChild(p);

            // Numbers
            n.appendChild(createNumbers(answer.percentages[0], answer.percentages[idx], answer.absLift[idx-1]));

            // Lift range
            var color = isUndefined(answer.color[idx-1]) ? DEFAULT_RANGE_COLOR : answer.color[idx-1];
            l.appendChild(createLiftRange(answer.minLift[idx-1], answer.maxLift[idx-1], answer.absLift[idx-1], color, minLift, maxLift));

            // Highlight color text, only for two branch and non default color
            if (branches === 2 && color !== DEFAULT_RANGE_COLOR) {
                c.style.color = color;
                c.style.fontWeight = 'bold';
            }
        }

        a.appendChild(c);
        a.appendChild(b);
        a.appendChild(n);
        a.appendChild(l);

        return a;
    }

    /**
     * Creates a bar and its label.
     *
     * @param {Number} idx Index of bar, for colors.
     * @param {Number} percentage What percentage this bar is.
     * @param {Number} maxResult The highest percentage from all answers to keep scale.
     *
     * @returns {Element} The bar element.
     */
    function createAnswerBar(idx, percentage, maxResult) {
        var barBlock = createElement('div', 'sqc__progress-block');
        var barContainer = createElement('span', 'sqc__progress-container');
        var bar = createElement('span', 'sqc__progress-value');

        bar.style.width = ((percentage / maxResult) * 100) + '%';
        bar.style.backgroundColor = COLORS[idx];
        barContainer.appendChild(bar);

        var label = document.createElement('label');
        label.style.left = ((percentage / maxResult) * 100) + '%';
        label.innerHTML = percentage + '%';
        barContainer.appendChild(label);

        barBlock.appendChild(barContainer);

        return barBlock;
    }

    /**
     * Creates the numbers.
     *
     * @param {Number} thisControlPercent Percentage of control bar.
     * @param {Number} thisExposedPercent Percentage of the exposed bar.
     * @param {Number} thisAbsLift The absolute lift.
     *
     * @returns {Element} The numbers element.
     */
    function createNumbers(thisControlPercent, thisExposedPercent, thisAbsLift) {
        thisControlPercent = parseFloat(thisControlPercent);
        thisExposedPercent = parseFloat(thisExposedPercent);
        var r = createElement('div', '');
        var rNum = (((thisExposedPercent - thisControlPercent)/ (100.0 - thisControlPercent) ) * 100.0);
        r.innerHTML = sensible(rNum)+'%';

        var c = createElement('div', 'sqc__a__numbers-container');
        c.appendChild(r);
        return c;
    }

    /**
     * Creates the lift range representation.
     *
     * @param {Number} thisMinLift This answers minimum lift value.
     * @param {Number} thisMaxLift This answers maximum lift value.
     * @param {Number} thisAbsLift This answers absolute lift value.
     * @param {String} thisColor This answers color.
     * @param {Number} minLift The overall mimimum lift value for all answers to keep scale.
     * @param {Number} maxLift The overall maximum lift value for all answers to keep scale.
     *
     * @returns {Element} The lift range element.
     */
    function createLiftRange(thisMinLift, thisMaxLift, thisAbsLift, thisColor, minLift, maxLift) {
        var c = createElement('div', 'sqc__a__range--container');

        // Lift cannot be calculated.
        if (isUndefined(thisMinLift) || isUndefined(thisMaxLift) || isUndefined(thisAbsLift)) {
            var nolift = createElement('div', '');
            c.appendChild(nolift);
            return c;
        }

        // Lift range.
        var range = maxLift - minLift;
        var minWidth = ((parseFloat(thisMinLift) - minLift) / range) * 100;
        var maxWidth = ((maxLift - parseFloat(thisMaxLift)) / range) * 100;
        var valPos = ((parseFloat(thisAbsLift) - minLift) / range) * 100;


        var f = createElement('figure', 'sqc__a__range');

        // Min part
        var min = createElement('div', 'sqc__a__range--min');
        min.style.flex = '0 1 '+minWidth+'%';
        min.setAttribute('display', thisMinLift+'%');

        // Range line
        var line = createElement('div', 'sqc__a__range--line');

        // Max part
        var max = createElement('div', 'sqc__a__range--max');
        max.style.flex = '0 1 '+maxWidth+'%';
        max.setAttribute('display', thisMaxLift+'%');

        // Abs part
        var val = createElement('div', 'sqc__a__range--val');
        val.style.left = 'calc('+valPos+'% - .5rem)';
        val.style.border = '2px solid '+thisColor;
        if (thisColor !== DEFAULT_RANGE_COLOR) {
            val.style.backgroundColor = thisColor;
        }
        val.setAttribute('display', thisAbsLift+'%');

        f.appendChild(min);
        f.appendChild(line);
        f.appendChild(max);
        f.appendChild(val);
        c.appendChild(f);

        return c;
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
            return c.maxLift.reduce(function (red, cur) {
                return (parseFloat(cur) > red) ? parseFloat(cur) : red;
            }, r);
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
            return c.minLift.reduce(function (red, cur) {
                return (parseFloat(cur) < red) ? parseFloat(cur) : red;
            }, r);
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

    /**
     * Format a number sensibly.
     *
     * @param {Number} number number to format.
     *
     * @returns {String} A formated number.
     */
    function sensible(number) {

        return number.toFixed(1);
    }

    function isUndefined(v) { return typeof v === 'undefined'; }

    // Make it available.
    window.ScrutineerQuestionChart = ScrutineerQuestionChart;
})();
