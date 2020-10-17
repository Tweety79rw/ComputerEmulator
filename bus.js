// this is the bus for the computer many things can be connected to the bus
class Bus {
  constructor() {
    // fake ram
    this.ram = Array(16).fill(0);
    // the cpu to connect
    this.cpu = new Cpu(this);
  }
  /**
   * Read the ram from the memory address
   * @param {Number} address 
   */
  read(address) {
    if(address >= 0 && address < 16)
      return this.ram[address];
    return 0;
  }
  /**
   * Write to the ram at the memory address
   * @param {Number} address 
   */
  write(address, val) {
    if(address >= 0 && address < 16)
      this.ram[address] = val;
  }
}
