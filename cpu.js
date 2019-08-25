const CFlag = 0x1;
const ZFlag = 0x2;
class Cpu {
  constructor(bus) {
    this.bus = bus;

    // the different registers
    this.flags = 0;
    this.a = 0;
    this.b = 0;
    this.pc = 0;
    this.out = 0;

    // some local variables
    this.cycles = 0;
    this.opCode = 0;
    this.halt = false;

    // the currently read in arrdess, the lower 4 bits of a instruction byte
    this.addr_abs = 0;

    // lookup table for the instruction, in this way the op code in memory
    // (0 to 15) is the index of the instruction to perform.
    this.lookup = [
      new Instruction('NOP', this.NOP, 5),
      new Instruction('LDA', this.LDA, 5),
      new Instruction('ADD', this.ADD, 5),
      new Instruction('SUB', this.SUB, 5),
      new Instruction('STA', this.STA, 5),
      new Instruction('LDI', this.LDI, 5),
      new Instruction('JMP', this.JMP, 5),
      new Instruction('JC',  this.JC,  5),
      new Instruction('JZ',  this.JZ,  5),
      new Instruction('NOP', this.NOP, 5),
      new Instruction('NOP', this.NOP, 5),
      new Instruction('NOP', this.NOP, 5),
      new Instruction('NOP', this.NOP, 5),
      new Instruction('NOP', this.NOP, 5),
      new Instruction('OUT', this.OUT, 5),
      new Instruction('HLT', this.HLT, 5)
    ];
  }
  complete() {
    return this.cycles == 0 || this.halt;
  }
  setFlag(flag, v) {
    if(v) {
      this.flags |= flag;
    } else {
      this.flags &= ~flag;
    }
  }
  getFlag(flag) {
    return ((this.flags & flag) > 0)? 1 : 0;
  }
  // instruction set
  NOP() {

  }
  LDA() {
    this.fetch();
    this.a = this.fetched;
    this.setFlag(ZFlag, this.a === 0);
  }
  ADD() {
    this.fetch();
    this.b = this.fetched;
    let temp = this.a + this.b;
    this.setFlag(CFlag, temp > 255);
    this.setFlag(ZFlag, (temp & 0xFF) == 0);
    this.a = temp & 0xFF;
  }
  SUB() {
    this.fetch();
    this.b = (this.fetched ^ 0xFF) + 1;
    let temp = this.a + this.b;
    this.setFlag(CFlag, temp > 255);
    this.setFlag(ZFlag, (temp & 0xFF) == 0);
    this.a = temp & 0xFF;
  }
  STA() {
    this.write(this.addr_abs, this.a);
  }
  LDI() {
    this.a = this.addr_abs;
  }
  JMP() {
    this.pc = this.addr_abs;
  }
  JC() {
    if(this.getFlag(CFlag)) {
      this.pc = this.addr_abs;
    }
  }
  JZ() {
    if(this.getFlag(ZFlag)) {
      this.pc = this.addr_abs;
    }
  }
  OUT() {
    this.out = this.a;
  }
  HLT() {
    this.halt = true;
    this.cycles = 1;
  }
  // access the bus more specifically the ram
  read(address) {
    return this.bus.read(address);
  }
  write(address, val) {
    this.bus.write(address, val);
  }
  // perform the instruction then wait the apropriate number of cycles per instruction
  clock() {
    if(!this.halt && this.cycles == 0) {
      this.opCode = (this.read(this.pc) & 0xF0) >> 4;
      this.addr_abs = this.read(this.pc) & 0x0F;
      this.pc++;
      this.cycles = this.lookup[this.opCode].cycles;
      this.lookup[this.opCode].operate.call(this);
    }
    this.cycles--;
  }
  // reset the cpu
  reset() {
    this.halt = false;
    this.pc = 0;
    this.a = 0;
    this.b = 0;
    this.flags = 0;
    this.addr_abs = 0;
    this.cycles = 0;
  }
  // fetch from the memory address
  fetch() {
    this.fetched = this.read(this.addr_abs);
    return this.fetched;
  }
}
