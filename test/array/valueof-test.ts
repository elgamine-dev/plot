import assert from "assert";
import {valueof} from "../../src/options.js";

it("valueof reads arrays", () => {
  assert.deepStrictEqual(
    valueof([1, 2, 3], (d: unknown) => d as number),
    [1, 2, 3]
  );
  assert.deepStrictEqual(
    valueof([1, 2, 3], (d: unknown) => `${d}`, Array),
    ["1", "2", "3"]
  );
  assert.deepStrictEqual(
    valueof([1, 2, 3], (d: unknown) => d as number, Float64Array),
    Float64Array.of(1, 2, 3)
  );

  // data can be functions or other things
  assert.deepStrictEqual(
    valueof([(d: number) => d, new Promise(() => {})], (d: unknown) => `(${d})`),
    ["(d=>d)", "([object Promise])"]
  );

  // data can be nullish and generated by the transform method
  assert.deepStrictEqual(valueof(undefined, {transform: () => [1, "text"]}), [1, "text"]);
  assert.deepStrictEqual(valueof(null, {transform: () => [1, "text"]}, Float32Array), Float32Array.of(1, NaN));
  assert.deepStrictEqual(valueof(null, {transform: () => new Float64Array(2)}, Array), [0, 0]);

  // ts type tests
  valueof([1, 2, 3], (d: unknown) => d as number, Float32Array);
  valueof(["1", 2, 3], (d: unknown) => d as string | number);
  valueof(["1", 2, 3], (d: unknown) => d as string | number, Array);
  valueof(["1", 2, 3], (d: unknown) => d as string | number, Float64Array);
  valueof(["1", 2, 3], (d: unknown) => +(d as number), Float32Array);
  valueof(new Set(["1", 2, 3]), (d: unknown) => +(d as number), Float32Array);
});

it("valueof does not crash on non iterable values with an accessor", () => {
  for (const n of [null, undefined])
    assert.strictEqual(
      valueof(n, () => 1),
      n
    );
});

/*

// field names are inferred
valueof([{a: 1}, {b: 2}], "a");
valueof([{a: 1}, {b: 2}], "b");

// TODO: test for ts failure:
valueof([{a: 1}, {b: 2}], "c");

*/
