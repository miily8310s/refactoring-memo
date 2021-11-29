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

function amountFor(performance: Performance, play: Play) {
  let result = 0;
  switch (play.type) {
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
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}

export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (const [_key, performance] of Object.entries(invoice.performances)) {
    const play = plays[performance.playID];
    const thisAmount = amountFor(performance, play);
    volumeCredits += Math.max(performance.audience - 30, 0);
    if ("comedy" === play.type) {
      volumeCredits += Math.floor(performance.audience / 5);
    }
    result += `  ${play.name}: ${format(thisAmount / 100)} (${
      performance.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

// Use deno run --allow-read abc.ts
// テスト実施時はコンパイルエラーが出るためコメントアウトしておく
const playsData = JSON.parse(Deno.readTextFileSync("../plays.json"));
const invoicesData = JSON.parse(Deno.readTextFileSync("../invoices.json"));

console.log(statement(invoicesData[0], playsData));
