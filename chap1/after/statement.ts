import { createStatementData } from "./createStatementData.ts";
import { Invoice, Plays, Performance, PerformancePlay } from "./types.ts";

export function statement(invoice: Invoice<Performance>, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays));
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
