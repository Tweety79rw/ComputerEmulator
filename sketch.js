
/**
   * PROGRAM is stored in the ram before starting the cpu and because the limit 
   * of 16 bytes there are no explict places for the stack or places for the cpu 
   * to write to so the top 8 bits are where to store the lower 8 bits in the ram 
   */
  let program = {
    /**
     * this program is the product of 7 and 8
     * 
     *  0 LDA 14
     *  1 SUB 12
     *  2 JC   6
     *  3 LDA 13
     *  4 OUT  0
     *  5 HLT  0
     *  6 STA 13
     *  7 LDA 13
     *  8 ADD 15
     *  9 STA 13
     * 10 JMP  0
     * 11 
     * 12 $01
     * 13 
     * 14 $7
     * 15 $8
     * 
     */
    a:[0x01E, 0x13C, 0x276, 0x31D, 
    0x4E0, 0x5F0, 0x64E, 0x71D, 
    0x82F, 0x94D, 0xA60, 0xC01, 
    0xE07, 0xF08],
    /**
     *  0 OUT  0
     *  1 ADD 15
     *  2 JC   4
     *  3 JMP  0
     *  4 SUB 15
     *  5 OUT  0
     *  6 JZ   0
     *  7 JMP  4
     * 15 $0x32     #50
     */
    b:[0x0E0, 0x12F, 0x274, 0x360, 
      0x43F, 0x5E0, 0x680, 0x764, 
      0xF32]
  };




let bus;
let outDisplays = [];
let run = false;
// helper function to draw the ram
function drawRam(x, y) {
  push();
  translate(x, y);
  let header = 'Operation Code | value Stored at memory location | Bit representation <op> <addr> | Decimal value';
  stroke(255);
  noFill();
  rect(0, 3, header.length*6 + 10, 17 * 25);
  noStroke();
  fill(255);
  text('Memory', 0, 0);
  translate(10, 20);
  let headerElements = header.split('|')
  text(header, 0, 0);
  for(let i = 0; i < bus.ram.length; i++) {
    let mem = bus.ram[i];
    let xPos = floor(headerElements[0].length);
    text(bus.cpu.lookup[mem >> 4].name, xPos/2 * 5, 25 + i * 25);
    xPos += floor(headerElements[1].length);
    text(bus.read(mem & 0xF), (xPos - floor(headerElements[1].length/2)) * 5, 25 + i * 25);
    xPos += floor(headerElements[2].length);
    let memStr = mem.toString(2).padStart(8, '0');
    text(memStr.slice(0, 4) + ' ' + memStr.slice(4), (xPos - floor(headerElements[2].length/2)) * 5, 25 + i * 25);
    xPos += floor(headerElements[3].length);
    text(mem, (xPos - floor(headerElements[3].length/2)) * 5, 25 + i * 25);
  }
  pop();
}
// helper function to draw the cpu state
function drawCpu(x, y) {
  let row = 0;
  let rowOffset = 20;
  push();
  translate(x, y);
  noStroke();
  fill(255);
  let cpu = bus.cpu;
  drawTextValue('Flags:',           cpu.flags.toString(2).padStart(2, '0'),    row++, rowOffset);
  drawTextValue('Register A:',      cpu.a.toString(2).padStart(8, '0'),        row++, rowOffset);
  drawTextValue('Register B:',      cpu.b.toString(2).padStart(8, '0'),        row++, rowOffset);
  drawTextValue('Program Counter:', cpu.pc.toString(2).padStart(4, '0'),       row++, rowOffset);
  drawTextValue('Op Code:',         cpu.opCode.toString(2).padStart(4, '0'),   row++, rowOffset);
  drawTextValue('Address:',         cpu.addr_abs.toString(2).padStart(4, '0'), row++, rowOffset);
  drawTextValue('Out:',             cpu.out,                                   row++, rowOffset);
  drawTextValue('Micro Process:',   5 - cpu.cycles,                            row++, rowOffset);
  pop();
}
function drawTextValue(txt, value, row, rowOffset) {
  text(txt, 0, row * rowOffset);
  text(value, 100, row * rowOffset);
}
function setup() {
  // create a canvas
  createCanvas(1200, 800);
  // create the bus, the thing that connects the cpu to other parts of the computer
  bus = new Bus();
  
  // add the program to ram
  for(let line of program.b) {
    bus.ram[(line & 0xF00) >> 8] = line & 0xFF;
  }
  // create 4 seven segment displays
  for(let i = 0; i < 4; i++) {
    outDisplays.push(new SevenSegment(width - 200 + i * 35, 250));
  }
}
// function to run the cycles until an instruction is complete
function runCycles() {
  do {
    bus.cpu.clock();
  } while(!bus.cpu.complete())
}
/**
 * p5 mouse events
 */
function mouseClicked() {
  runCycles();
}
function keyPressed() {
  if(key === ' ') {
    //runCycles();
    run = !run;
  }
  if(key.toLowerCase() === 'r') {
    bus.cpu.reset();
  }
}
function renderDisplay(val) {
  if(val < 0)
    outDisplays[0].setSegments(17);
  else
    outDisplays[0].setSegments(-1);
  outDisplays[1].setSegments(floor(val / 100 % 10)); // set the 100th place segment
  outDisplays[2].setSegments(floor(val / 10 % 10)); // set the 10th place segment
  outDisplays[3].setSegments(val % 10); // set the 1th place segment
  for(let display of outDisplays) {
    display.render();
  }
}
/**
 * p5 draw loop gets called by p5.js
 */
function draw() {
  background(0);
  if(run) {
    bus.cpu.clock();
  }
  drawRam(5, 20);
  drawCpu(width - 200, 50);
  renderDisplay(bus.cpu.out);
}
