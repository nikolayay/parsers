// MOV: store one register's content into another, or store a literal number into a register
// ADD: store the sum of two register's contents in the first register
// PUSH: store a register's content on the stack
// POP: remove the top - most value from the stack and store in a register
// CALL: enter a new section of the stack and start running the function
// RET: enter the calling functions stack and return to evaluating from the next instruction after the call
// SYSCALL: like CALL but where the function is handled by the kernel

const os = require("os");

const SYSCALL_MAP =
  os.platform() === "darwin"
    ? {
        exit: "0x2000001"
      }
    : {
        exit: 60
      };

const BUILTIN_FUNCTIONS = { "+": "plus" };
const PARAM_REGISTERS = ["RDI", "RSI", "RDX"];

function emit(depth, code) {
  const indent = new Array(depth + 1).map(() => "").join("  ");
  console.log(indent + code);
}

function compile_argument(arg, destination) {
  // If arg AST is a list, call compile_call on it
  if (Array.isArray(arg)) {
    compile_call(arg[0], arg.slice(1), destination);
    return;
  }

  // Else must be a literal number, store in destination register
  emit(1, `MOV ${destination}, ${arg}`);
}

function compile_call(fun, args, destination) {
  // Save param registers to the stack
  args.map((_, i) => emit(1, `PUSH ${PARAM_REGISTERS[i]}`));
  // Compile arguments and store in param registers
  args.map((arg, i) => compile_argument(arg, PARAM_REGISTERS[i]));
  // Call function
  emit(1, `CALL ${BUILTIN_FUNCTIONS[fun] || fun}`);
  // Restore param registers from the stack
  args.map((_, i) => emit(1, `POP ${PARAM_REGISTERS[args.length - i - 1]}`));
  // Move result into destination if provided
  if (destination) {
    emit(1, `MOV ${destination}, RAX`);
  }
  emit(0, ""); // For nice formatting
}

function emit_prefix() {
  // Assembly prefix
  emit(1, ".global _main\n");
  emit(1, ".text\n");

  // Built-in functions
  emit(0, "plus:");
  emit(1, "ADD RDI, RSI");
  emit(1, "MOV RAX, RDI");
  emit(1, "RET\n");

  emit(0, "_main:");
}

function emit_postfix() {
  // Assembly postfix
  emit(1, "MOV RDI, RAX"); // Set exit arg
  emit(1, `MOV RAX, ${SYSCALL_MAP["exit"]}`); // Set syscall number
  emit(1, "SYSCALL");
}

module.exports.compile = function parse(ast) {
  emit_prefix();
  compile_call(ast[0], ast.slice(1));
  emit_postfix();
};
