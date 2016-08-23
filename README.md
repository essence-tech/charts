# Charts

## ScrutineerQuestionChart

### Usage

Include in your template
```
<link rel="stylesheet" type="text/css" href="//raw.githubusercontent.com/essence-tech/charts/master/dist/chart.min.css" />
```
```
<script src="//raw.githubusercontent.com/essence-tech/charts/master/dist/chart.min.js"></script>
```

Then to instantiate a chart:
```javascript
var question = 'This is a question title?';
var series = ['Control', 'Exposed'];
var totals = [123, 215];
var answers = [
  {
    title: 'Answer 1',
    percentages: [21, 54],
    minLift: 1,
    absLift: 2,
    maxLift: 3
  },
  {
    title: 'Answer 2',
    percentages: [...
    ...
  }
];

var chart = new ScrutineerQuestionChart(question, series, totals, answers);
document.body.appendChild(chart);
```
