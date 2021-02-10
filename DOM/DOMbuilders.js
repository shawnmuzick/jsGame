export function buildCanvas(size = 800) {
	const canvas = document.createElement("canvas");
	canvas.classList.add("canvas");
	canvas.width = size;
	canvas.height = size;
        document.body.appendChild(canvas);
        return canvas;
}
