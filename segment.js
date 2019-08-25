class Segment {
  constructor(x, y, w, r) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.r = r;
    this.c = color(255, 255, 255, 50);
  }
  setOn(on) {
    if(on)
      this.c = color(0, 255, 0);
    else
      this.c = color(255, 255, 255, 50);
  }
  render() {
    push();
    translate(this.x, this.y);
    rotate(this.r);
    strokeWeight(5);
    stroke(this.c);
    line(0, 0, this.w, 0);
    pop();
  }
}
