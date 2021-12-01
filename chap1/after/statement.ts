import { createStatementData } from "./createStatementData.ts";
import { Invoice, Plays, Performance, PerformancePlay } from "./types.ts";

export function statement(invoice: Invoice<Performance>, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays));
}
export function htmlStatement(invoice: Invoice<Performance>, plays: Plays) {
  return renderHtml(createStatementData(invoice, plays));
}

// TODO: HTML出力用のメソッドを作成
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
}

function renderHtml(
  data: Invoice<PerformancePlay> & {
    totalAmount: number;
    totalVolumeCredits: number;
  }
) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>const</th></tr>";
  result += "</table>\n";
  data.performances.forEach((performance) => {
    result += `  <tr><td>${performance.play.name}</td><td>${performance.audience}</td>`;
    result += `<td>${usd(performance.amount)}</td></tr>\n`;
  });
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}

// Use deno run --allow-read abc.ts
// テスト実施時はコンパイルエラーが出るためコメントアウトしておく
const playsData = JSON.parse(Deno.readTextFileSync("../plays.json"));
const invoicesData = JSON.parse(Deno.readTextFileSync("../invoices.json"));
console.log(statement(invoicesData[0], playsData));
console.log(htmlStatement(invoicesData[0], playsData));
