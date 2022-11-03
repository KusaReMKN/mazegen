'use strict';

const ctx = canvas.getContext('2d');
const map = [
	[ 0, 0, 0, 0, 0, ],
	[ 0, 1, 0, 1, 0, ],
	[ 0, 1, 0, 1, 0, ],
	[ 0, 1, 1, 1, 0, ],
	[ 0, 0, 0, 0, 0, ],
];

const print = (...args) => debug.textContent += args;

function
cell(x, y)
{
	const narrow = narrowwall.checked;
	const cwidth  = x & 1 || !narrow ? 5 : 1;
	const cheight = y & 1 || !narrow ? 5 : 1;
	const posx = (x >> 1) * (narrow ? 6 : 10)
			+ (x & 1) * (narrow ? 1 : 5);
	const posy = (y >> 1) * (narrow ? 6 : 10)
			+ (y & 1) * (narrow ? 1 : 5);
	ctx.fillStyle
		= (map[y][x] ? wallcolor : loadcolor).value;
	ctx.fillRect(posx, posy, cwidth, cheight);
}

function
render()
{
	const narrow = narrowwall.checked;
	const w = +mazewidth.value;
	const h = +mazeheight.value;
	canvas.width  = narrow ? w * 6 + 1 : w * 10 + 5;
	canvas.height = narrow ? h * 6 + 1 : h * 10 + 5;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (const i in map)
		for (const j in map[i])
			cell(+j, +i);
}

async function
generate()
{
	const w = +mazewidth.value;
	const h = +mazeheight.value;
	map.length = 0;
	for (const i in [...Array(2*h+1)]) {
		const t = [];
		for (const j in [...Array(2*w+1)])
			t.push(true);
		map.push(t);
	}

	const sx = 2 * (Math.random()*w | 0) + 1;
	const sy = 2 * (Math.random()*h | 0) + 1;
	map[sy][sx] = false;
	const stack = [[sx, sy]];
	render();

	while (stack.length > 0) {
		const [x, y] = stack.pop();
		const movable = [];
		if (map[y]   && map[y][x+2]) movable.push([x+2, y]);
		if (map[y]   && map[y][x-2]) movable.push([x-2, y]);
		if (map[y+2] && map[y+2][x]) movable.push([x, y+2]);
		if (map[y-2] && map[y-2][x]) movable.push([x, y-2]);
		if (movable.length === 0)
			continue;
		stack.push([x, y]);
		const [nx, ny] = movable[Math.random()*movable.length | 0];
		map[ny][nx] = false;
		map[ny+y>>1][nx+x>>1] = false;
		stack.push([nx, ny]);
		if (animation.checked) {
			cell(nx+x>>1, ny+y>>1);
			cell(nx, ny);
			await new Promise(r => setTimeout(r));
		}
	}
	render();
}

play.addEventListener('click', generate);
