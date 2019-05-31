const w = 30; // width of each square block

let start, end, current;
let rows, cols, grid;

let particleBlock;

const sceneW = 120,
    sceneH = 450;

let endR = false,
    mazeFinish = false,
    showMaze = false,
    showPath = false;

let prevCell = [],
    stack = [],
    userTrack = [];

function reset() {
    endR = false;
    mazeFinish = false;
    showMaze = false;
    showPath = false;

    prevCell = [];
    stack = [];
    userTrack = [];
    setup();
}

function removeWall(a, b) {
    const y = a.i - b.i;
    const x = a.j - b.j;

    if (x == -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    } else if (x == 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    }

    if (y == -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    } else if (y == 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    }
}

function setup() {
    createCanvas(1200, 450);
    rows = floor(height / w);
    cols = floor(width / (2 * w));
    grid = new Array(rows);
    // frameRate(200);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    start = grid[floor(random(rows))][floor(random(cols))];
    end = grid[floor(random(rows))][floor(random(cols))];

    particle = new Particle(createVector(end.j * w + w / 2, end.i * w + w / 2));

    current = start;
    current.visited = true;

    prevCell.push(current);
    stack.push(current);
}

function draw() {
    background(0);
    for (let s = 0; s < 5; s++) {
        maze();
    }
    if (!mazeFinish) {
        push();
        textSize(64);
        textAlign(CENTER);
        stroke(200, 20, 255, 200);
        strokeWeight(4);
        fill(255);
        text("Creating Maze", width / 2, 100);
        pop();
    }

    if (mazeFinish) {
        if (showPath) {
            push();
            beginShape();
            noFill();
            strokeWeight(3);
            stroke(200, 20, 200);
            for (let pr of prevCell) {
                vertex(pr.j * w + w / 2, pr.i * w + w / 2);
            }
            endShape();
            pop();
        }

        ball();
    }

    fill(0, 0, 255);
    ellipse(current.j * w + w / 2, current.i * w + w / 2, w / 2);
    fill(0, 255, 0);
    ellipse(start.j * w + w / 2, start.i * w + w / 2, w / 2);
    fill(255, 0, 0);
    ellipse(end.j * w + w / 2, end.i * w + w / 2, w / 2);

    if (keyIsDown(LEFT_ARROW)) {
        particle.rot(-0.1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        particle.rot(0.1);
    }

    if (keyIsDown(UP_ARROW)) {
        particle.move(2);
    } else if (keyIsDown(DOWN_ARROW)) {
        particle.move(-2);
    }

    particle.show();
}

function keyPressed() {
    if (key == "p") {
        showPath = !showPath;
    }
    if (key == "m") {
        showMaze = !showMaze;
    }
    if (key == "r") {
        reset();
    }
}

function maze() {
    if (stack.length > 0) {
        neigh = current.checkNeighbours();
        if (neigh) {
            neigh.visited = true;
            removeWall(current, neigh);
            current = neigh;
            stack.push(neigh);
            if (current != end && !endR) {
                prevCell.push(current);
            } else if (current == end) {
                endR = true;
                prevCell.push(end);
            }
        } else {
            if (current != end && !endR) {
                prevCell.pop();
            } else if (current == end) {
                endR = true;
            }
            current = stack.pop();
        }
    } else {
        mazeFinish = true;
    }

    for (let j = 0; j < cols; j++) {
        grid[0][j].walls[0] = true;
        grid[rows - 1][j].walls[2] = true;
    }
    for (let i = 0; i < rows; i++) {
        grid[i][0].walls[3] = true;
        grid[i][cols - 1].walls[1] = true;
    }
}

function index(i, j) {
    if (i < 0 || i > rows - 1 || j < 0 || j > cols - 1) {
        return;
    } else {
        return true;
    }
}

function highlight(c, strk) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(c, strk);
        }
    }
}

function ball() {
    let bound = [];
    let blockWall = [];

    const y_pos = floor(particle.pos.x / w);
    const x_pos = floor(particle.pos.y / w);
    const particleReach = grid[x_pos][y_pos];
    const c = color(255);

    userTrack.push([floor(particle.pos.x), floor(particle.pos.y)]);

    for (let i = -2; i <= 2; i++) {
        let xi = x_pos + i;
        for (let j = -2; j <= 2; j++) {
            let yj = y_pos + j;

            if (index(xi, yj)) {
                particleBlock = grid[xi][yj];

                if (showMaze) {
                    particleBlock.show(c, 3);
                }

                const yWall = grid[xi][yj].i * w;
                const xWall = grid[xi][yj].j * w;

                const top = particleBlock.walls[0];
                const right = particleBlock.walls[1];
                const bottom = particleBlock.walls[2];
                const left = particleBlock.walls[3];

                if (top) {
                    bound.push(new Boundary(xWall, yWall, xWall + w, yWall));
                    if (i == 0 && j == 0) {
                        blockWall.push(new Boundary(xWall, yWall, xWall + w, yWall));
                    }
                }
                if (right) {
                    bound.push(new Boundary(xWall + w, yWall, xWall + w, yWall + w));
                    if (i == 0 && j == 0) {
                        blockWall.push(new Boundary(xWall + w, yWall, xWall + w, yWall + w));
                    }
                }
                if (bottom) {
                    bound.push(new Boundary(xWall, yWall + w, xWall + w, yWall + w));
                    if (i == 0 && j == 0) {
                        blockWall.push(new Boundary(xWall, yWall + w, xWall + w, yWall + w));
                    }
                }
                if (left) {
                    bound.push(new Boundary(xWall, yWall, xWall, yWall + w));
                    if (i == 0 && j == 0) {
                        blockWall.push(new Boundary(xWall, yWall, xWall, yWall + w));
                    }
                }
            }
        }
    }

    particle.update(blockWall);
    const scene = particle.look(bound);
    const wid = width / (2 * scene.length);
    const wSq = sceneW * sceneW;

    push();
    noStroke();
    translate(width / 2, 0);
    fill(255, 80);
    rect(0, 0, width / 2, sceneH);
    fill(255, 0, 0, 80);
    rect(0, sceneH / 2, width / 2, sceneH);

    for (let sc = 0; sc < scene.length; sc++) {
        const sq = scene[sc] * scene[sc];

        const b = map(sq, 0, wSq, 255, 0);
        const h = 4000 / scene[sc]; //h = constant/scene[sc];

        fill(255 - b, abs(127 - b), b);
        rectMode(CENTER);
        rect(sc * wid + wid / 2, sceneH / 2, wid + 1, h);
    }
    pop();

    const endColor = color(floor(random(255)), floor(random(255)), floor(random(255)));

    if (particleReach == start) {
        highlight(endColor, 4);
        push();
        textSize(64);
        textAlign(CENTER);
        stroke(200, 20, 255);
        strokeWeight(4);
        fill(255);
        text("Finish!!", width / 2, 100);
        pop();
    }

    push();
    beginShape();
    noFill();
    stroke(0, 255, 0);
    for (let u of userTrack) {
        vertex(u[0], u[1]);
    }
    endShape();
    pop();
}
