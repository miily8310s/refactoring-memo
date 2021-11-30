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
}

export function statement(invoice: Invoice<Performance>, plays: Plays) {
  const statementData = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };
  return renderPlainText(statementData);

  function enrichPerformance(aPerformance: Performance) {
    const performance = Object.assign({}, aPerformance);
    return { ...performance, play: playFor(performance) };
  }
  function playFor(performance: Performance) {
    return plays[performance.playID];
  }
}

function renderPlainText(data: Invoice<PerformancePlay>) {
  let result = `Statement for ${data.customer}\n`;

  for (const [_key, performance] of Object.entries(data.performances)) {
    result += `  ${performance.play.name}: ${usd(
      amountFor(performance) / 100
    )} (${performance.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(appleSauce() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function amountFor(performance: PerformancePlay) {
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

  function volumeCreditsFor(performance: PerformancePlay) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0);
    if ("comedy" === performance.play.type) {
      result += Math.floor(performance.audience / 5);
    }
    return result;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  }

  function totalVolumeCredits() {
    let result = 0;
    for (const [_key, performance] of Object.entries(data.performances)) {
      result += volumeCreditsFor(performance);
    }
    return result;
  }

  function appleSauce() {
    let result = 0;
    for (const [_key, performance] of Object.entries(data.performances)) {
      result += amountFor(performance);
    }
    return result;
  }
}

// Use deno run --allow-read abc.ts
// テスト実施時はコンパイルエラーが出るためコメントアウトしておく
const playsData = JSON.parse(Deno.readTextFileSync("../plays.json"));
const invoicesData = JSON.parse(Deno.readTextFileSync("../invoices.json"));

console.log(statement(invoicesData[0], playsData));
