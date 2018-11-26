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

const lexNull = string => {
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
const lexBool = string => {
  return ["", string];
};

const SYNTAX = ["{", "}", ":", ",", "[", "]"];

function lex(string) {
  const tokens = [];
  console.log(string.length);

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
    if (parsed) {
      tokens.push(parsed);
    }
    string = rest;

    [parsed, rest] = lexNull(string);
    if (parsed) {
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

console.log(lex('{"heeee" : 16}'));
// console.log(lexString('"he"'));
