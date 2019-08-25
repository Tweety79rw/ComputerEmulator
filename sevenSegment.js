const segmentOnOff = [
  '01111110',
  '00110000',
  '01101101',
  '01111001',
  '00110011',
  '01011011',
  '01011111',
  '01110000',
  '01111111',
  '01111011'
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
    if(val >= 0 && val < 10) {
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
