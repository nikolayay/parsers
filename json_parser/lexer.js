const lexString = string => {
  let json_string = "";

  // see if first character is a quote
  if (string[0] === '"') {
    string = string.substring(1);
  } else {
    // if not then parse nothing and return string
    return ["", string];
  }

  // parse until next quote
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (char === '"') {
      rest = string.substring(i + 1);
      return [json_string, rest];
    } else {
      json_string += char;
    }
  }

  return ["", string];
};

const lexNumber = string => {
  json_number = "";

  let number_chars = [];

  for (let i = 0; i < 10; i++) {
    number_chars.push(i.toString());
  }

  for (let i = 0; i < string.length; i++) {
    char = string[i];
    if (number_chars.includes(char)) {
      json_number += char;
    } else {
      break;
    }
  }

  string = string.substring(json_number.length);

  if (!json_number.length) {
    return ["", string];
  }
  if (json_number.split("").some(c => c === "."))
    return [parseFloat(json_number), string];

  return [parseInt(json_number), string];
};

const lexNull = string => {
  const NULL_LENGTH = "null".length;
  if (
    string.length >= NULL_LENGTH &&
    string.substring(0, NULL_LENGTH) === "null"
  ) {
    return [null, string.substring(NULL_LENGTH)];
  }
  return ["", string];
};

const lexBool = string => {
  const TRUE_LENGTH = "true".length;
  const FALSE_LENGTH = "false".length;
  if (
    string.length >= TRUE_LENGTH &&
    string.substring(0, TRUE_LENGTH) === "true"
  ) {
    return [true, string.substring(TRUE_LENGTH)];
  }
  if (
    string.length >= FALSE_LENGTH &&
    string.substring(0, FALSE_LENGTH) === "false"
  ) {
    console.log([false, string.substring(FALSE_LENGTH)]);
    return [false, string.substring(FALSE_LENGTH)];
  }
  return ["", string];
};

const SYNTAX = ["{", "}", ":", ",", "[", "]"];

function lex(string) {
  const tokens = [];

  while (string.length > 0) {
    let [parsed, rest] = lexString(string);
    if (parsed) {
      tokens.push(parsed);
    }
    string = rest;

    [parsed, rest] = lexNumber(string);
    if (parsed) {
      tokens.push(parsed);
    }
    string = rest;

    [parsed, rest] = lexBool(string);
    if (parsed.toString().length) {
      tokens.push(parsed);
    }
    string = rest;

    [parsed, rest] = lexNull(string);
    if (parsed === null) {
      tokens.push(parsed);
    }
    string = rest;

    if (string[0] === " ") {
      string = string.substring(1);
    } else if (SYNTAX.includes(string[0])) {
      tokens.push(string[0]);
      string = string.substring(1);
    } else break;
  }

  return [tokens, string];
}

module.exports = lex;
// console.log(lexString('"he"'));
