
let bus;
let outDisplays = [];
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
  text('Flags:', 0, row * rowOffset);
  text(bus.cpu.flags.toString(2).padStart(2, '0'), 100, row++ * rowOffset);
  text('Register A:', 0, row * rowOffset);
  text(bus.cpu.a.toString(2).padStart(8, '0'), 100, row++ * rowOffset);
  text('Register B:', 0, row * rowOffset);
  text(bus.cpu.b.toString(2).padStart(8, '0'), 100, row++ * rowOffset);
  text('Program Counter:', 0, row * rowOffset);
  text(bus.cpu.pc.toString(2).padStart(4, '0'), 100, row++ * rowOffset);
  text('Op Code:', 0, row * rowOffset);
  text(bus.cpu.opCode.toString(2).padStart(4, '0'), 100, row++ * rowOffset);
  text('Address:', 0, row * rowOffset);
  text(bus.cpu.addr_abs.toString(2).padStart(4, '0'), 100, row++ * rowOffset);
  text('Out:', 0, row * rowOffset);
  text(bus.cpu.out, 100, row++ * rowOffset);
  pop();
}
function setup() {
  // create a canvas
  createCanvas(1200, 800);
  bus = new Bus();
  let program = [0x01E, 0x13C, 0x276, 0x31D, 0x4E0, 0x5F0, 0x64E, 0x71D, 0x82F, 0x94D, 0xA60, 0xC01, 0xE07, 0xF08]; //[0x0E0, 0x12F, 0x274, 0x360, 0x43F, 0x5E0, 0x680, 0x764, 0xF32];
  for(let line of program) {
    bus.ram[(line & 0xF00) >> 8] = line & 0xFF;
  }
  for(let i = 0; i < 4; i++) {
    outDisplays.push(new SevenSegment(width - 200 + i*35,200));
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
    runCycles();
  }
  if(key.toLowerCase() === 'r') {
    bus.cpu.reset();
  }
}
/**
 * p5 draw loop gets called by p5.js
 */
function draw() {
  background(0);
  drawRam(5, 20);
  drawCpu(width - 200, 50);
  outDisplays[1].setSegments(floor(bus.cpu.out / 100 % 10)); // set the 100th place segment
  outDisplays[2].setSegments(floor(bus.cpu.out / 10 % 10)); // set the 10th place segment
  outDisplays[3].setSegments(bus.cpu.out % 10); // set the 1th place segment
  for(let display of outDisplays) {
    display.render();
  }
}
