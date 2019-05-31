class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.visited = false;
        this.walls = [true, true, true, true]; //top, right, bottom, left
    }

    index(i, j) {
        if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
            return undefined;
        }
        return grid[i][j];
    }

    checkNeighbours() {
        const neigh = [];

        const top = this.index(this.i - 1, this.j);
        const right = this.index(this.i, this.j + 1);
        const bottom = this.index(this.i + 1, this.j);
        const left = this.index(this.i, this.j - 1);

        if (top && !top.visited) {
            neigh.push(top);
        }

        if (right && !right.visited) {
            neigh.push(right);
        }

        if (bottom && !bottom.visited) {
            neigh.push(bottom);
        }
        if (left && !left.visited) {
            neigh.push(left);
        }

        if (neigh.length > 0) {
            const r = floor(random(neigh.length));
            return neigh[r];
        } else {
            return undefined;
        }
    }

    show(c, strk) {
        push();
        noFill();
        stroke(c);
        strokeWeight(strk);
        const y = this.i * w;
        const x = this.j * w;

        if (this.walls[0]) {
            line(x, y, x + w, y);
        }
        if (this.walls[1]) {
            line(x + w, y, x + w, y + w);
        }
        if (this.walls[2]) {
            line(x, y + w, x + w, y + w);
        }
        if (this.walls[3]) {
            line(x, y, x, y + w);
        }

        if (this.visited) {
            fill(0);
            noStroke();
            rect(x, y, w, w);
        }
        pop();
    }
}
