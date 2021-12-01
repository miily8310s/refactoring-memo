import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { statement, htmlStatement } from "./statement.ts";

Deno.test("statement test #1", () => {
  const testInvoices = {
    customer: "BigCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  };
  const testPlays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };
  const result = statement(testInvoices, testPlays);
  const expect = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits\n`;
  assertEquals(result, expect);
});

Deno.test("statement test #2", () => {
  const testInvoices = {
    customer: "BigCo",
    performances: [
      {
        playID: "hamlet",
        audience: 55,
      },
      {
        playID: "as-like",
        audience: 35,
      },
      {
        playID: "othello",
        audience: 40,
      },
    ],
  };
  const testPlays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };
  const result = htmlStatement(testInvoices, testPlays);
  const expect = `<h1>Statement for BigCo</h1>
<table>
<tr><th>play</th><th>seats</th><th>const</th></tr></table>
  <tr><td>Hamlet</td><td>55</td><td>$65,000.00</td></tr>
  <tr><td>As You like It</td><td>35</td><td>$58,000.00</td></tr>
  <tr><td>Othello</td><td>40</td><td>$50,000.00</td></tr>
<p>Amount owed is <em>$173,000.00</em></p>
<p>You earned <em>47</em> credits</p>\n`;
  assertEquals(result, expect);
});
