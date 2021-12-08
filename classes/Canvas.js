export default class Canvas {
  constructor(size) {
    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("canvas");
    this.canvas.width = size;
    this.canvas.height = size;
    this.context = this.canvas.getContext("2d");
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    document.body.appendChild(this.canvas);
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
}
