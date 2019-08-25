class Bus {
  constructor() {
    this.ram = Array(16).fill(0);
    this.cpu = new Cpu(this);
  }
  read(address) {
    if(address >= 0 && address < 16)
      return this.ram[address];
    return 0;
  }
  write(address, val) {
    if(address >= 0 && address < 16)
      this.ram[address] = val;
  }
}
