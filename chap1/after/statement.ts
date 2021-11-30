interface Performance {
  playID: string;
  audience: number;
}

interface Invoice {
  customer: string;
  performances: Performance[];
}

interface Play {
  name: string;
  type: string;
}

interface Plays {
  [key: string]: Play;
}

export function statement(invoice: Invoice, plays: Plays) {
  function playFor(performance: Performance) {
    return plays[performance.playID];
  }

  function amountFor(performance: Performance) {
    let result = 0;
    switch (playFor(performance).type) {
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
        throw new Error(`unknown type: ${playFor(performance).type}`);
    }
    return result;
  }

  function volumeCreditsFor(performance: Performance) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0);
    if ("comedy" === playFor(performance).type) {
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
    for (const [_key, performance] of Object.entries(invoice.performances)) {
      result += volumeCreditsFor(performance);
    }
    return result;
  }

  function appleSauce() {
    let result = 0;
    for (const [_key, performance] of Object.entries(invoice.performances)) {
      result += amountFor(performance);
    }
    return result;
  }

  let result = `Statement for ${invoice.customer}\n`;

  for (const [_key, performance] of Object.entries(invoice.performances)) {
    result += `  ${playFor(performance).name}: ${usd(
      amountFor(performance) / 100
    )} (${performance.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(appleSauce() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

// Use deno run --allow-read abc.ts
// テスト実施時はコンパイルエラーが出るためコメントアウトしておく
const playsData = JSON.parse(Deno.readTextFileSync("../plays.json"));
const invoicesData = JSON.parse(Deno.readTextFileSync("../invoices.json"));

console.log(statement(invoicesData[0], playsData));
