const lex = require("./lexer");

test("lexer on empty returns empty", () => {
  expect(lex("")).toEqual([[], ""]);
});

test("lexer on bad syntax fails", () => {
  expect(lex('{"foo":bar"}')).toEqual([["{", "foo", ":"], 'bar"}']);
  expect(lex('{"foo":bar}')).toEqual([["{", "foo", ":"], "bar}"]);
  expect(lex('{"foo"bar"}')).toEqual([["{", "foo"], 'bar"}']);
});

test("can lex simple JSON with strings", () => {
  expect(lex('{"foo" : "bar" }')).toEqual([["{", "foo", ":", "bar", "}"], ""]);
});

test("can lex simple JSON with numbers", () => {
  expect(lex('{"foo" : 5 }')).toEqual([["{", "foo", ":", 5, "}"], ""]);
});

test("can lex simple JSON with booleans and null", () => {
  expect(lex('{"foo" : true }')).toEqual([["{", "foo", ":", true, "}"], ""]);
  expect(lex('{"foo" : false }')).toEqual([["{", "foo", ":", false, "}"], ""]);
  expect(lex('{"foo" : null }')).toEqual([["{", "foo", ":", null, "}"], ""]);
});

test("can lex simple JSON with arrays", () => {
  expect(lex('{"foo" : [1,2,3] }')).toEqual([
    ["{", "foo", ":", "[", 1, ",", 2, ",", 3, "]", "}"],
    ""
  ]);
});

test("can lex nested JSON ", () => {
  expect(lex('{"foo" : { "bar" : "foo" } }')).toEqual([
    ["{", "foo", ":", "{", "bar", ":", "foo", "}", "}"],
    ""
  ]);
});

test("from tutorial", () => {
  expect(lex('{"foo": [1, 2, {"bar": 2}]}')).toEqual([
    ["{", "foo", ":", "[", 1, ",", 2, ",", "{", "bar", ":", 2, "}", "]", "}"],
    ""
  ]);
});
