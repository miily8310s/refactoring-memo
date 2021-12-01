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
    const performance = Object.assign({}, aPerformance);
    const result = { ...performance, play: playFor(performance) };
    return {
      ...result,
      amount: amountFor(result),
      volumeCredits: volumeCreditsFor(result),
    };
  }
  function playFor(performance: Performance) {
    return plays[performance.playID];
  }
  function amountFor(performance: Performance & { play: Play }) {
    let result = 0;
    switch (performance.play.type) {
      case "tragedy":
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${performance.play.type}`);
    }
    return result;
  }
  function volumeCreditsFor(performance: Performance & { play: Play }) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0);
    if ("comedy" === performance.play.type) {
      result += Math.floor(performance.audience / 5);
    }
    return result;
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
