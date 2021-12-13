import { assertEquals } from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { sampleProvinceData, Province } from "./province.ts";

// TODO: beforeEach的なものを入れる
Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  assertEquals<number>(result.shortfall, 5);
});
Deno.test("statement test #1", () => {
  const result = new Province(sampleProvinceData());
  assertEquals<number>(result.profit, -40);
});
