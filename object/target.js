let targets = [];

class Target {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.width = 130;
        this.height = 130;
        this.point = 100;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    update() {

    }
}

function spawnTarget() {
    for (let s = 0; s < 5; s++) {
        const tar = targets[s];

        let rrX = Math.random(s * 300 / 2) * 700;
        let rrY = Math.random(s * 300 / 2) * 700;

        targets.push(new Target(rrX, rrY, target1img));
    }
}

function updateTarget() {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.draw(ctx);
        target.update();
    }
}