import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { sampleProvinceData, Province } from "./province.ts";

Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  assertEquals<number>(result.shortfall, 5);
});
Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  assertEquals<number>(result.profit, -40);
});
Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  result.getProducers[0].production = 20;
  assertEquals<number>(result.shortfall, 5);
  assertEquals<number>(result.profit, -150);
});
Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  result.setDemand = "0";
  assertEquals<number>(result.shortfall, -25);
  assertEquals<number>(result.profit, 0);
  result.setDemand = "-1";
  assertEquals<number>(result.shortfall, -26);
  assertEquals<number>(result.profit, 706);
  result.setDemand = "";
  assertEquals<boolean>(isNaN(result.shortfall), true);
  assertEquals<boolean>(isNaN(result.profit), true);
});
Deno.test("statement test #1", () => {
  const result = new Province({
    name: "No producers",
    producers: [],
    demand: 30,
    price: 20,
  });
  assertEquals<number>(result.shortfall, 30);
  assertEquals<number>(result.profit, 0);
});
