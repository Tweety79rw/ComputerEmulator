const segmentOnOff = [
  '01111110', // 0
  '00110000', // 1
  '01101101', // 2
  '01111001', // 3
  '00110011', // 4
  '01011011', // 5
  '01011111', // 6
  '01110000', // 7
  '01111111', // 8
  '01111011', // 9
  '01110111', // A
  '00011111', // B
  '01001110', // C
  '00111101', // D
  '01001111', // E
  '01000111'  // F
];

class SevenSegment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.out;
    this.segments = [];
    this.segments.push(new Segment(x + 25, y + 45, 1, 0));      // decimal point
    this.segments.push(new Segment(x + 5, y + 5, 10, 0));       // a
    this.segments.push(new Segment(x + 20, y + 10, 10, PI/2));  // b
    this.segments.push(new Segment(x + 20, y + 30, 10, PI/2));  // c
    this.segments.push(new Segment(x + 15, y + 45, 10, PI));    // d
    this.segments.push(new Segment(x + 0, y + 40, 10, -PI/2));  // e
    this.segments.push(new Segment(x + 0, y + 20, 10, -PI/2));  // f
    this.segments.push(new Segment(x + 5, y + 25, 10, 0));      // g
  }
  reset() {
    for(let segment of this.segments) {
      segment.setOn(false);
    }
  }
  setSegments(val) {
    if(val >= 0 && val < 16) {
      let segmentSettings = segmentOnOff[val];
      for(let i = 0; i < segmentSettings.length; i++) {
        this.segments[i].setOn(segmentSettings[i] == '0'?false:true);
      }
    } else {
      this.reset();
    }
  }
  render() {
    for(let segment of this.segments) {
      segment.render();
    }
  }
}
