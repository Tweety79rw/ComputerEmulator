class Instruction {
  constructor(name, fn, cycles) {
    this.name = name;
    this.operate = fn;
    this.cycles = cycles;
  }
}
