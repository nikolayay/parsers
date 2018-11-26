const { parse } = require("./parser");
const { compile } = require("./compiler");

function main(args) {
  if (args.length <= 2) {
    console.log("Please provide a string as a second arg");
    return;
  }
  const script = args[2];
  const [ast] = parse(script);
  compile(ast[0]);
}

main(process.argv);
