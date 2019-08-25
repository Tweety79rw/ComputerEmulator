const CFlag = 0x1;
const ZFlag = 0x2;
class Cpu {
  constructor(bus) {
    this.bus = bus;
    this.flags = 0;

    this.a = 0;
    this.b = 0;
    this.pc = 0;
    this.cycles = 0;
    this.opCode = 0;
    this.addr_abs = 0;
    this.out = 0;

    this.halt = false;
    let _this = this;
    this.lookup = [
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('LDA', function() { _this.LDA();}, 5),
      new Instruction('ADD', function() { _this.ADD();}, 5),
      new Instruction('SUB', function() { _this.SUB();}, 5),
      new Instruction('STA', function() { _this.STA();}, 5),
      new Instruction('LDI', function() { _this.LDI();}, 5),
      new Instruction('JMP', function() { _this.JMP();}, 5),
      new Instruction('JC',  function() { _this.JC();},  5),
      new Instruction('JZ',  function() { _this.JZ();},  5),
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('NOP', function() { _this.NOP();}, 5),
      new Instruction('OUT', function() { _this.OUT();}, 5),
      new Instruction('HLT', function() { _this.HLT();}, 5)
    ];
  }
  complete() {
    return this.cycles == 0;
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
  NOP() {

  }
  LDA() {
    this.fetch();
    this.a = this.fetched;
    this.setFlag(Z, this.a === 0);
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
  }

  read(address) {
    return this.bus.read(address);
  }
  write(address, val) {
    this.bus.write(address, val);
  }
  connectBus(bus) {
    this.bus = bus;
    return this;
  }
  clock() {
    if(!this.halt && this.cycles == 0) {
      this.opCode = (this.read(this.pc) & 0xF0) >> 4;
      this.addr_abs = this.read(this.pc) & 0x0F;
      this.pc++;
      this.cycles = this.lookup[this.opCode].cycles;
      this.lookup[this.opCode].operate();
    }
    this.cycles--;
  }
  reset() {
    this.halt = false;
    this.pc = 0;
    this.a = 0;
    this.b = 0;
    this.flags = 0;
    this.addr_abs = 0;
    this.cycles = 0;
  }
  fetch() {
    this.fetched = this.read(this.addr_abs);
    return this.fetched;
  }
}
