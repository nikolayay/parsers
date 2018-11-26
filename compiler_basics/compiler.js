function emit(depth, code) {
  const indent = new Array(depth + 1).map(() => "").join("  ");
  console.log(indent + code);
}

function compile_argument(arg, destination) {
  // If arg AST is a list, call compile_call on it
  if (Array.isArray(arg)) {
    compile_call(arg[0], arg.slice[1], destination);
    return;
  }

  // Else must be a literal number, store in destination register
  emit(1, `MOV ${destination}, ${arg}`);
}

const BUILTIN_FUNCTIONS = { "+": "plus" };
const PARAM_REGISTERS = ["RDI", "RSI", "RDX"];

function compile_call(fun, args, destination) {
  // Save param registers to the stack
  args.forEach((_, i) => emit(1, `PUSH ${PARAM_REGISTERS[i]}`));
  // Compile arguments and store in param registers
  args.forEach((arg, i) => compile_argument(arg, PARAM_REGISTERS[i]));
  // Call function
  emit(1, `CALL ${BUILTIN_FUNCTIONS[fun] || fun}`);
  // Restore param registers from the stack
  args.forEach((_, i) =>
    emit(1, `POP ${PARAM_REGISTERS[args.length - i - 1]}`)
  );
  // Move result into destination if provided
  if (destination) {
    emit(1, `MOV ${destination}, RAX`);
  }
  emit(0, ""); // For nice formatting
}

function emit_prefix() {
  // Assembly prefix
}

function emit_postfix() {
  // Assembly postfix
}

module.exports.compile = function parse(ast) {
  emit_prefix();
  compile_call(ast[0], ast.slice(1));
  emit_postfix();
};
