class Particle {
    constructor(vec) {
        this.pos = vec;
        this.head = 0;
        this.rays = [];
        this.fov = 30; // field of view
        this.ray_pos = vec; // for rays to move with the ball; KEEP it as it is!
        this.next_pos = this.pos.copy();
        this.collide = false;
        this.diameter = 10;

        for (let i = -this.fov; i < this.fov; i += 0.5) {
            this.rays.push(new Ray(this.pos, radians(i)));
        }
    }

    rot(ang) {
        let index = 0;
        this.head += ang;

        for (let a = -this.fov; a < this.fov; a += 0.5) {
            this.rays[index].setAngle(radians(a) + this.head);
            index++;
        }
    }

    move(mag) {
        this.next_pos = this.pos.copy().add(p5.Vector.fromAngle(this.head, mag));
        if (!this.collide) {
            this.pos = this.next_pos;
            this.ray_pos.add(p5.Vector.fromAngle(this.head, mag));
        }
    }

    update(walls) {
        this.collide = false;
        const dmax = 5;
        for (let wall of walls) {
            if (wall.a.x == wall.b.x) {
                if (abs(this.next_pos.x - wall.a.x) < dmax) {
                    this.collide = true;
                }
            } else if (wall.a.y == wall.b.y) {
                if (abs(this.next_pos.y - wall.a.y) < dmax) {
                    this.collide = true;
                }
            }
        }
    }

    look(walls) {
        let scene = [];
        let pts = {};
        for (let w = 0; w < walls.length; w++) {
            pts[w] = [];
        }

        for (let ray of this.rays) {
            let closest = null;
            let record = Infinity;
            let minW = 0;

            for (let w = 0; w < walls.length; w++) {
                let pt = ray.cast(walls[w]);
                if (pt) {
                    let d = p5.Vector.dist(this.pos, pt);
                    const a = ray.dir.heading() - this.head;
                    d *= cos(a);

                    if (d < record) {
                        record = d;
                        closest = pt;
                        minW = w;
                    }
                }
            }
            if (closest) {
                pts[minW].push(closest);
                stroke(255, 50);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            }
            scene.push(record);
        }
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        for (let i = 0; i < walls.length; i++) {
            beginShape();
            if (pts[i].length > 0) {
                for (let j = 0; j < pts[i].length; j++) {
                    vertex(pts[i][j].x, pts[i][j].y);
                }
            }
            endShape();
        }
        pop();
        return scene;
    }

    show() {
        // for (let ray of this.rays) {
        //     ray.show();
        // }
        fill(255, 200);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 10);
    }
}
