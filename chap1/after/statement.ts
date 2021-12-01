interface Performance {
  playID: string;
  audience: number;
}

interface Invoice<T> {
  customer: string;
  performances: T[];
}
interface Play {
  name: string;
  type: string;
}

interface Plays {
  [key: string]: Play;
}

interface PerformancePlay extends Performance {
  play: Play;
  amount: number;
  volumeCredits: number;
}

export function statement(invoice: Invoice<Performance>, plays: Plays) {
  const result = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  const statementData = {
    ...result,
    totalAmount: totalAmount(result),
    totalVolumeCredits: totalVolumeCredits(result),
  };
  return renderPlainText(statementData);

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
    let result = 0;
    for (const [_key, performance] of Object.entries(data.performances)) {
      result += performance.volumeCredits;
    }
    return result;
  }

  function totalAmount(data: Invoice<PerformancePlay>) {
    let result = 0;
    for (const [_key, performance] of Object.entries(data.performances)) {
      result += performance.amount;
    }
    return result;
  }
}

function renderPlainText(
  data: Invoice<PerformancePlay> & {
    totalAmount: number;
    totalVolumeCredits: number;
  }
) {
  let result = `Statement for ${data.customer}\n`;

  for (const [_key, performance] of Object.entries(data.performances)) {
    result += `  ${performance.play.name}: ${usd(performance.amount / 100)} (${
      performance.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }
}

// Use deno run --allow-read abc.ts
// テスト実施時はコンパイルエラーが出るためコメントアウトしておく
const playsData = JSON.parse(Deno.readTextFileSync("../plays.json"));
const invoicesData = JSON.parse(Deno.readTextFileSync("../invoices.json"));

console.log(statement(invoicesData[0], playsData));
