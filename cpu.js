
/**
 * a structure to hold some information about the different instructions
 */
class Instruction {
  constructor(name, fn, cycles) {
    this.name = name;
    this.operate = fn;
    this.cycles = cycles;
  }
}


// the masks for the flags register
const CFlag = 0x1;
const ZFlag = 0x2;
/**
 * Made up CPU based off 8-bit breadboard cpu
 */
class Cpu {
  constructor(bus) {
    // local bus
    this.bus = bus;

    // the different registers
    this.flags = 0;
    this.a = 0;
    this.b = 0;
    this.pc = 0;
    this.out = 0;

    // some local variables
    this.cycles = 0; // the number of micro processes that occure 
    this.opCode = 0;
    this.halt = false;

    // the currently read in address, the lower 4 bits of a instruction byte
    this.addr_abs = 0;

    // lookup table for the instruction, in this way the op code in memory
    // (0 to 15) is the index of the instruction to perform.
    this.lookup = [
      new Instruction('NOP', this.NOP, 5), // 0x0
      new Instruction('LDA', this.LDA, 5), // 0x1
      new Instruction('ADD', this.ADD, 5), // 0x2
      new Instruction('SUB', this.SUB, 5), // 0x3
      new Instruction('STA', this.STA, 5), // 0x4
      new Instruction('LDI', this.LDI, 5), // 0x5
      new Instruction('JMP', this.JMP, 5), // 0x6
      new Instruction('JC',  this.JC,  5), // 0x7
      new Instruction('JZ',  this.JZ,  5), // 0x8
      new Instruction('NOP', this.NOP, 5), // 0x9
      new Instruction('NOP', this.NOP, 5), // 0xA 10
      new Instruction('NOP', this.NOP, 5), // 0xB 11
      new Instruction('NOP', this.NOP, 5), // 0xC 12
      new Instruction('NOP', this.NOP, 5), // 0xD 13
      new Instruction('OUT', this.OUT, 5), // 0xE 14
      new Instruction('HLT', this.HLT, 5)  // 0xF 15
    ];
  }
  /**
   * returns true if there are no cycles left or if the halt flag is set
   */
  complete() {
    return this.cycles == 0 || this.halt;
  }
  /**
   * Sets the bit in the flags register using flag as a mask to 1 or 0 depeding on v
   * @param {Number} flag the mask for the flag
   * @param {Boolean} v true if the bit should be set to 1 false otherwise
   */
  setFlag(flag, v) {
    if(v) {
      this.flags |= flag;
    } else {
      this.flags &= ~flag;
    }
  }
  /**
   * gets the value in the flags register using flag as a mask
   * @param {Number} flag 
   * returns 1 if the value in the flags register is 1, 0 otherwise
   */
  getFlag(flag) {
    return ((this.flags & flag) > 0)? 1 : 0;
  }
  // instruction set is the top 4 bits. 
  /**
   * No OPeration
   * Machine Code = 0x00
   */
  NOP() {

  }
  /**
   * LoaD A register
   * Loads the fetched number into the a register
   * Machine Code = 0x10
   */
  LDA() {
    this.fetch();
    this.a = this.fetched;
    this.setFlag(ZFlag, this.a === 0);
  }
  /**
   * adds the a and b register, sets flags if needed and stores the value in the a register;
   */
  add() {
    let temp = this.a + this.b;
    this.setFlag(CFlag, temp > 255);
    this.setFlag(ZFlag, (temp & 0xFF) == 0);
    this.a = temp & 0xFF;
  }
  /**
   * ADDition
   * Loads the fetched number into the b register and adds it to a register and 
   * puts the new value into a register.
   * Machine Code = 0x20
   */
  ADD() {
    this.fetch();
    this.b = this.fetched;
    this.add();
  }
  /**
   * SUBtraction
   * Loads the fetched number into the b register as the twos complemnet then 
   * adds it to the a register and puts the new value into a register.
   * Machine Code = 0x30
   */
  SUB() {
    this.fetch();
    this.b = (this.fetched ^ 0xFF) + 1;
    this.add();
  }
  /**
   * STores what's in the A register to the local address
   * Machine Code = 0x40
   */
  STA() {
    this.write(this.addr_abs, this.a);
  }
  /**
   * LoaDs the number in the lower 4 bits into the a register Immediatly
   * Machine Code = 0x50
   */
  LDI() {
    this.a = this.addr_abs;
  }
  /**
   * JuMP the program counter to the location in address abs
   * Machine Code = 0x60
   */
  JMP() {
    this.pc = this.addr_abs;
  }
  /**
   * Jump if the Carry flag is set
   * Machine Code = 0x70
   */
  JC() {
    if(this.getFlag(CFlag)) {
      this.pc = this.addr_abs;
    }
  }
  /**
   * Jump if the Zero flag is set
   * Machine Code = 0x80
   */
  JZ() {
    if(this.getFlag(ZFlag)) {
      this.pc = this.addr_abs;
    }
  }
  /**
   * OUTput what's in the a register
   * Machine Code = 0xE0
   */
  OUT() {
    this.out = this.a;
  }
  /**
   * HaLT the cpu
   * Machine Code = 0xF0
   */
  HLT() {
    this.halt = true;
    this.cycles = 1;
  }
  // access the bus more specifically the ram
  /**
   * read from ram or rom at the address
   * @param {Number} address ram address
   */
  read(address) {
    return this.bus.read(address);
  }
  /**
   * write to ram or rom at the address
   * @param {Number} address the ram address
   * @param {Number} val the value to write
   */
  write(address, val) {
    this.bus.write(address, val);
  }
  // perform the instruction then wait the apropriate number of cycles per instruction
  clock() {
    if(!this.halt && this.cycles == 0) {
      // read from where the program counter
      let reading = this.read(this.pc);
      // get the top 4 bits to get the op code
      this.opCode = (reading & 0xF0) >> 4;
      // get the top 4 bits to get the op code
      this.addr_abs = reading & 0x0F;
      // increment the program counter
      this.pc++;
      // get the operation
      let operation = this.lookup[this.opCode];
      // get the cycles that this operation 
      this.cycles = operation.cycles;
      // perform the operation
      operation.operate.call(this);
    }
    // decrease the number of cycles
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
