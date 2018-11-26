const lexString = string => {
  let json_string = "";
  let rest = "";

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

  return ["", rest];
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

    if (string[0] === " ") {
      string = string.substring(1);
    } else if (SYNTAX.includes(string[0])) {
      tokens.push(string[0]);
      string = string.substring(1);
    } else brea;
  }

  return [tokens, string];
}

console.log(lex('{"heeee" : bar"}'));
// console.log(lexString('"he"'));
