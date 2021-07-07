import * as io from "io-ts";
import * as either from "fp-ts/Either";

const variantA = io.exact(
  io.type({
    kind: io.literal("a"),
    a: io.string,
  })
);

const variantB = io.exact(
  io.type({
    kind: io.literal("b"),
    b: io.string,
  })
);

const withVersion = <V extends string, R extends Record<string, unknown>>(
  base: io.Type<R>,
  version: V
): io.Type<R & { version: V }> =>
  io.intersection([base, io.type({ version: io.literal(version) })]);

test("union", () => {
  const codec = io.union([variantA, variantB]);
  expect(
    codec.decode({
      kind: "a",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      kind: "a",
      a: "a",
    })
  );

  expect(
    codec.decode({
      kind: "b",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      kind: "b",
      b: "b",
    })
  );
});

test("union of intersections", () => {
  const codec = withVersion(io.union([variantA, variantB]), "1");
  expect(
    codec.decode({
      version: "1",
      kind: "a",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      version: "1",
      kind: "a",
      a: "a",
    })
  );

  expect(
    codec.decode({
      version: "1",
      kind: "b",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      version: "1",
      kind: "b",
      b: "b",
    })
  );
});

test("intersection of unions", () => {
  const codec = io.union([
    withVersion(variantA, "1"),
    withVersion(variantB, "1"),
  ]);
  expect(
    codec.decode({
      version: "1",
      kind: "a",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      version: "1",
      kind: "a",
      a: "a",
    })
  );

  expect(
    codec.decode({
      version: "1",
      kind: "b",
      a: "a",
      b: "b",
    })
  ).toEqual(
    either.right({
      version: "1",
      kind: "b",
      b: "b",
    })
  );
});
