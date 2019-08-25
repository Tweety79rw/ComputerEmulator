
let bus;
let outDisplays = [];
function drawRam(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(255);
  for(let i = 0; i < bus.ram.length; i++) {
    let mem = bus.ram[i];
    text(bus.cpu.lookup[mem >> 4].name, 0, i * 25);
    text(bus.read(mem & 0xF), 50, i * 25);
    text(mem.toString(2).padStart(8, '0'), 100, i * 25);
  }
  pop();
}
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
  let program = [0x0E0, 0x12F, 0x274, 0x360, 0x43F, 0x5E0, 0x680, 0x764, 0xF32];
  for(let line of program) {
    bus.ram[(line & 0xF00) >> 8] = line & 0xFF;
  }
  for(let i = 0; i < 4; i++) {
    outDisplays.push(new SevenSegment(400 + i*35,200));
  }
}
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
let count = 0;
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
  drawCpu(175, 50);
  outDisplays[1].setSegments(floor(bus.cpu.out / 100 % 10));
  outDisplays[2].setSegments(floor(bus.cpu.out / 10 % 10));
  outDisplays[3].setSegments(bus.cpu.out % 10);
  for(let display of outDisplays) {
    display.render();
  }
  // computer.render();
}
