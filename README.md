### Dieffiency Metric

![npm version](https://img.shields.io/npm/v/diefficiency)

This is an implementation of the diefficiency metrics introduced in "Diefficiency Metrics: Measuring the Continuous Efficiency of Query Processing Approaches".

## Example Usage
Obtain timestamps of result arrival from an experiment. For example, by running `runExperiment()`. Then calculate the answerDistributionFunction using this package:

```
const granularity = 500 (Any value, higher is more accurate)
const timings = runExperiment()  (Result arrival timings)
const output = DiEfficiencyMetric.answerDistributionFunction(timings, granularity)
```

Using this function you can calculate the Dief@k or Dief@t as follows:

```
const dieffk1 = DiEfficiencyMetric.defAtK(1, output.answerDist, output.linSpace)
const diefft1 = DiEfficiencyMetric.defAtT(1, output.answerDist, output.linSpace)
```