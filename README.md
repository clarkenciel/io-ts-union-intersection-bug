# Demo of an io-ts issue with unions and intersections

I found that intersections can make the validation/decoding behavior of
unions a bit weird and this repo demonstrates that with the test in
`__tests__/bug.spec.ts`.

## Usage

```bash
npm i
npm run test
```

The spec includes some type tests as well, which verify that the types generated
by `io-ts.TypeOf` to match the kinds of tagged unions `io-ts.union` promises to
create, regardless of the presence of intersections.

You can open those in a sufficiently equipped editor to inspect those types.
