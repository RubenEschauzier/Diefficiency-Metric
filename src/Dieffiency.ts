/**
 * Example usage: 
 * 
 * const granularity = 500 (Any value, higher is more accurate)
 * const timings = runExperiment()  (Result arrival timings)
 * const output = DiEfficiencyMetric.answerDistributionFunction(timings, granularity)
 * const dieff = DiEfficiencyMetric.defAtK(1, output.answerDist, output.linSpace)
 */
export class DiEfficiencyMetric {

    static getLinSpace(maxVal: number, granularity: number): number[]{
        const stepSize = maxVal / granularity;
        const linSpace = [0];
        for (let i = 1; i < granularity; i++) {
            linSpace.push(linSpace[i - 1] + stepSize);
        }
        linSpace.push(maxVal);
        return linSpace;
    }

    static answerDistribution(t: number, answerTimings: number[]): number {
        if (t < answerTimings[0]) {
            return 0;
        }
        if (t >= answerTimings[answerTimings.length - 1]) {
            return answerTimings.length;
        }
        for (const [index, timing] of answerTimings.entries()) {
            if (t > timing && t < answerTimings[index + 1] && answerTimings[index + 1] != undefined) {
                return (index + 1) + (t - timing) / (answerTimings[index + 1] - timing);
            }
        }
        return 0;
    }

    static answerDistributionFunction(answerTimings: number[], granularity: number): IAnswerDistributionOutput {
        const linSpace = this.getLinSpace(answerTimings[answerTimings.length - 1], granularity);
        const answerDistributionFunction = [];
        for (const t of linSpace) {
            answerDistributionFunction.push(this.answerDistribution(t, answerTimings));
        }
        return { answerDist: answerDistributionFunction, linSpace: linSpace };
    }
    
    static defAtT(t: number, distribution: number[], linSpace: number[]) {
        // Note: This implementation is not completely correct, we due to rounding of t to nearest point in the linspace
        // Note: We round up to nearest point in linSpace
        let cutoffIndex = 0;
        for (const [index, time] of linSpace.entries()) {
            if (time > t) {
                cutoffIndex = index;
                break;
            }
        }
        if (cutoffIndex == 0) {
            throw new Error(`Invalid time ${t}, should be above ${0} and below ${linSpace[linSpace.length - 1]}`);
        }
        const integral = this.integralTrapezoidalRule(distribution.slice(0, cutoffIndex + 1), linSpace.slice(0, cutoffIndex + 1));
        return integral;
    }

    static defAtK(k: number, distribution: number[], linSpace: number[]) {
        // Note: This rounds up so that atleast k results are obtained. Accuracy can be improved by higher granularity in answer distribution function
        let cutoffIndex = 0;
        for (const [index, results] of distribution.entries()) {
            if (results >= k) {
                cutoffIndex = index;
                break;
            }
        }
        if (cutoffIndex == 0) {
            cutoffIndex = distribution.length - 1;
        }
        const integral = this.integralTrapezoidalRule(distribution.slice(0, cutoffIndex + 1), linSpace.slice(0, cutoffIndex + 1));
        return integral;
    }

    static integralTrapezoidalRule(distribution: number[], linSpace: number[]) {
        let integral = 0.0;
        for (let i = 2; i < distribution.length; i++) {
            // function delta takes two timestamp parameters and calculates 
            // differences as time units (hours, minutes, seconds or milliseconds)
            // not as simple as subtraction 
            let dt = linSpace[i] - linSpace[i - 1];
            integral += (distribution[i] + distribution[i - 1]) * dt; // area of the trapezoid
        }
        integral /= 2.0;
        return integral;
    }
}

export interface IAnswerDistributionOutput {
    answerDist: number[];
    linSpace: number[];
}