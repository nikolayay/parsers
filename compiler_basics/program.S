  .global _main

  .text

plus:
  ADD RDI, RSI
  MOV RAX, RDI
  RET

_main:
  PUSH RDI
  PUSH RSI
  MOV RDI, 3
  MOV RSI, 2
  CALL plus
  POP RSI
  POP RDI

  MOV RDI, RAX
  MOV RAX, 0x2000001
  SYSCALL
