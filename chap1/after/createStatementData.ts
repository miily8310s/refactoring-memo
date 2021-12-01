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
    return {
      ...performance,
      play: simulator.play,
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
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceSimulator {
  get amount() {
    const TRAGEDY_MONEY = 40000;
    if (this.performance.audience > 30) {
      return TRAGEDY_MONEY + 1000 * (this.performance.audience - 30);
    }
    return TRAGEDY_MONEY;
  }
}
class ComedyCalculator extends PerformanceSimulator {
  get amount() {
    const COMEDY_MONEY = 30000 + 300 * this.performance.audience;
    if (this.performance.audience > 20) {
      return COMEDY_MONEY + 10000 + 500 * (this.performance.audience - 20);
    }
    return COMEDY_MONEY;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
