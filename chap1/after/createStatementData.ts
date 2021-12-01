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
    const simulator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const performance = Object.assign({}, aPerformance);
    const result = { ...performance, play: simulator.play };
    return {
      ...result,
      amount: simulator.amount,
      volumeCredits: simulator.volumeCredits,
    };
  }
  function playFor(performance: Performance) {
    return plays[performance.playID];
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

  function createPerformanceCalculator(aPerformance: Performance, aPlay: Play) {
    switch (aPlay.type) {
      case "tragedy":
        return new TragedyCalculator(aPerformance, aPlay);
      case "comedy":
        return new ComedyCalculator(aPerformance, aPlay);
      default:
        throw new Error(`unknown type: ${aPlay.type}`);
    }
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
    return 0;
  }
  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    return result;
  }
}

class TragedyCalculator extends PerformanceSimulator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceSimulator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
