import { Invoice, Plays, Play, Performance, PerformancePlay } from "./types.ts";

export function createStatementData(
  invoice: Invoice<Performance>,
  plays: Plays
) {
  const result = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  return {
    ...result,
    totalAmount: totalAmount(result),
    totalVolumeCredits: totalVolumeCredits(result),
  };

  function enrichPerformance(aPerformance: Performance) {
    const simulator = new PerformanceSimulator(
      aPerformance,
      playFor(aPerformance)
    );
    const performance = Object.assign({}, aPerformance);
    const result = { ...performance, play: simulator.play };
    return {
      ...result,
      amount: amountFor(result),
      volumeCredits: volumeCreditsFor(result),
    };
  }
  function playFor(performance: Performance) {
    return plays[performance.playID];
  }
  function amountFor(aPerformance: Performance) {
    return new PerformanceSimulator(aPerformance, playFor(aPerformance)).amount;
  }
  function volumeCreditsFor(aPerformance: Performance) {
    return new PerformanceSimulator(aPerformance, playFor(aPerformance))
      .volumeCredits;
  }
  function totalVolumeCredits(data: Invoice<PerformancePlay>) {
    return Object.values(data.performances).reduce(
      (total, performance) => total + performance.volumeCredits,
      0
    );
  }

  function totalAmount(data: Invoice<PerformancePlay>) {
    return Object.values(data.performances).reduce(
      (total, performance) => total + performance.amount,
      0
    );
  }
}

class PerformanceSimulator {
  performance: Performance;
  play: Play;
  constructor(aPerformance: Performance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get amount() {
    let result = 0;
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }
  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }
    return result;
  }
}
