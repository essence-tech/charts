(function () {
    angular.module('errorRange', []);


    var errorRange = ''+
    '<figure class="essrange flex-row">'+
        '<div class="essrange__min" style="flex: 0 1 {{minWidth}}%"></div>'+
        '<div class="essrange__bar"></div>'+
        '<div class="essrange__max" style="flex: 0 1 {{maxWidth}}%"></div>'+
        '<div class="essrange__val" style="left: {{valPos}}%"></div>'+
    '</figure>';
    angular.module('errorRange').directive('essRange', [function () {
        return {
            scope: {
                min: '=',
                max: '=',
                high: '=',
                low: '=',
                val: '='
            },
            template: errorRange,
            link: function ($s, element, attrs) {
                var range = $s.max - $s.min;

                $s.minWidth = (($s.low - $s.min) / range) * 100;
                $s.maxWidth = (($s.max - $s.high) / range) * 100;
                $s.valPos = (($s.val - $s.min) / range) * 100;
            }
        }
    }]);
}());
