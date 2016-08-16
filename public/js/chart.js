(function () {
    'use strict';


    // render renders the chart.
    function render(mutation) {
        var element = this;
        mutation.forEach(function (mutation) {
            console.log(self);
            console.log(mutation.oldValue);
        });
    }

    function init() {
        var config = { attributes: true, childList: true, characterData: true };

        var elements = Array.prototype.slice.call(document.querySelectorAll('scr-chart'));
        console.log(elements);

        for (var i=0, len=elements.length; i < len; i++) {
            var observer = new MutationObserver(render.bind(elements[i]));
            observer.observe(elements[i], config);
        }
    }

    init();
})();
