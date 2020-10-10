const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.style.backgroundColor = "black";

window.addEventListener("resize", () => {

    for (let i = 0; i < 70; i++) {
        let radius = Math.random() + 0.5;
        let x = (Math.random() * (canvas.width - radius * 2)) + radius;
        let y = (Math.random() * (canvas.height - radius * 2)) + radius;
        
        arrayCircle[i].x = x;
        arrayCircle[i].y = y;
        arrayCircle[i].radius = radius;
    }

    ship_x = canvas.width / 2 - 100 / 2;

});

let key = {
    left: 0,
    right: 0
};

let over = 0;
window.addEventListener("keydown", (event) => {
    if (!over) {
        if (event.key == "ArrowLeft")
            key.left = 1;
        if (event.key == "ArrowRight")
            key.right = 1;
    }
});

window.addEventListener("keyup", (event) => {
    if (!over) {
        if (event.key == "ArrowLeft")
            key.left = 0;
        if (event.key == "ArrowRight")
            key.right = 0;
    }
});

canvas.addEventListener("touchstart", (event) => {
    if (event.changedTouches[0].clientX < canvas.width / 2)
        key.left = 1;
    else key.right = 1;
});
canvas.addEventListener("touchend", (event) => {
    if (event.changedTouches[0].clientX < canvas.width / 2)
        key.left = 0;
    else key.right = 0;
});

let start = 0;
canvas.addEventListener("click", () => {
    if (!over)
        start = 1;
});
window.addEventListener("keydown", (event) => {
    if (!over)
        if (event.key == " ")
            start = 1;
});

// The stars

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.6";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();        
        if (start) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3";
            ctx.arc(this.x, this.y - 2, this.radius, 0, Math.PI * 2);
            ctx.fill(); 

            ctx.fillStyle = "rgba(255, 255, 255, 0.1";
            ctx.arc(this.x, this.y - 4, this.radius, 0, Math.PI * 2);
            ctx.fill(); 

            ctx.fillStyle = "rgba(255, 255, 255, 0.05";
            ctx.arc(this.x, this.y - 6, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
            ctx.arc(this.x, this.y - 8, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        

    }

    let v = 0;
    this.update = function() {

        this.y += 4 * v;
        if (start)
            v = 1;

        if (this.y > canvas.height)
            this.y = 4;

        this.draw();
    }

}

let arrayCircle = [];

for (let i = 0; i < 70; i++) {
    let radius = Math.random() + 0.5;
    let x = (Math.random() * (canvas.width - radius * 2)) + radius;
    let y = (Math.random() * (canvas.height - radius * 2)) + radius;
    
    arrayCircle.push(new Circle(x, y, radius));
}

// Planet Express Ship

let ship_image = new Image();
ship_image.src = "/static/game/ship.png"; // 100 x 175

let ship_x = canvas.width / 2 - 100 / 2;
function Ship() {

    this.update = () => {
        ctx.drawImage(ship_image, ship_x, canvas.height - 175 - 20, 100, 175);
        let speed = 7;
        if (key.left && ship_x > speed && start)
            ship_x -= speed * delta_time;
        if (key.right && ship_x < canvas.width - 100 - speed && start)
            ship_x += speed * delta_time;
    }
};
let ship = new Ship();

// Planet Express Ship Projectiles

let target = 0;
let damage = 0;
let damaged = 0;
let projectile_x = ship_x + 50;
let projectile_y = canvas.height - 175 - 20;
function Projectile() {

    this.projectile_spawn = () => {
        if (start) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(255, 0, 0, 1)";
            ctx.arc(projectile_x, projectile_y , 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
            ctx.arc(projectile_x, projectile_y + 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
            ctx.arc(projectile_x, projectile_y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            ctx.arc(projectile_x, projectile_y + 12, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
            ctx.arc(projectile_x, projectile_y + 14, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
            ctx.arc(projectile_x, projectile_y + 18, 3, 0, Math.PI * 2);
            ctx.fill();
            
        }
    }

    this.update = () => {
        if (!target)
            this.projectile_spawn();
        
        if (target && !damaged) {
            damage++;
            damaged = 1;
        }

        if (projectile_y < -3) {
            projectile_x = ship_x + 50
            projectile_y = canvas.height - 175 - 20;
            damaged = 0;
            target = 0;
        }

        projectile_y -= 5 * delta_time;
    }
    
}
let projectile = new Projectile();

let despawn = 0;

// game over function

let over_image = new Image;
over_image.src = "/static/game/gameover.png"; // 250 x 154
let game_over = () => {
    //console.log("game over!");
    start = 0;
    over = 1;

    ctx.drawImage(over_image, canvas.width / 2 - 250 / 2, canvas.height / 2 - 200);

    ctx.beginPath();
    ctx.rect(canvas.width / 2 - 110, canvas.height / 2 + 20, 220, 60)
    ctx.fillStyle = "rgb(90, 90, 90)";
    ctx.fill();

    ctx.font = "50px serif";
    ctx.fillStyle = "black";
    ctx.fillText("Restart", canvas.width / 2 - 70, canvas.height / 2 + 65);
}

canvas.addEventListener("click", (event) => {
    if (event.offsetX >= canvas.width / 2 - 110 && event.offsetX <= canvas.width / 2 + 110 && event.offsetY >= canvas.height / 2 + 20 && event.offsetY <= canvas.height / 2 + 80 && over) {
        start = 0;
        over = 0;
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key == " " && over) {
        start = 0;
        over = 0;
    }
});

// Nimbus Ship

let nimbus_image = new Image();
nimbus_image.src = "/static/game/nimbus-ship.png"; // 200 x 274
let nimbus_x =  canvas.width / 2 - 100;
let nimbus_y = - 275 - 100 - 300;
function Nimbus() {
    let rand_x = [
        canvas.width / 4,
        canvas.width * 3 / 4
    ];
    let index = 0;
    let nimbus_projectile_x = rand_x[index];
    let nimbus_projectile_y = 200;

    function Nimbus_projectile() {

        this.projectile_spawn = (x) => {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y , 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y + 4, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y + 8, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y + 12, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y + 14, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 64, 255)";
            ctx.arc(x, nimbus_projectile_y + 18, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.update = () => {
            this.projectile_spawn(nimbus_projectile_x);
            this.projectile_spawn(canvas.width / 2);

            if (nimbus_projectile_y <= canvas.height) {
                nimbus_projectile_y += 5 * delta_time;
            }
            else {
                if (index == 0)
                    index = 1;
                else index = 0;

                nimbus_projectile_x = rand_x[index];
                nimbus_projectile_y = 200;
            }
            
            if (nimbus_projectile_y >= canvas.height - 175 - 20 && nimbus_projectile_y <= canvas.height - 20 && (index == 0 && ship_x <= canvas.width / 2 || index == 1 && ship_x + 100 >= canvas.width / 2)) {
                game_over();
                nimbus_x =  canvas.width / 2 - 100;
                nimbus_y = - 275 - 100 - 300;
                nimbus_projectile_y = 200;
            }

        };

    }
    let nimbus_projectile = new Nimbus_projectile();

    this.update = () => {
        ctx.drawImage(nimbus_image, nimbus_x, nimbus_y);
        
        if (damage < 15 && nimbus_y >= -50)
            nimbus_projectile.update();
        
        if (nimbus_y <= -50)
            nimbus_y += 5 * delta_time;

        if (projectile_y <= nimbus_y + 255 && projectile_x >= 100 && projectile_x <= 300) {
            target = 1;
        }

        if (damage >= 15 && nimbus_x > -200) {
            nimbus_x -= 5 * delta_time;
        }

        if (damage >= 15 && nimbus_x <= -200) {
            despawn = 1;
            nimbus_x =  canvas.width / 2 - 100;
            nimbus_y = - 275 - 100 - 300;
            projectile_y = 200;
        }

    }

}
let nimbus = new Nimbus();

// Asteroid

let asteroid_image = new Image();
asteroid_image.src = "/static/game/asteroid.png"; // 100 x 100
function Asteroid() {
    this.asteroid_spawn = (x, y) => {
        ctx.drawImage(asteroid_image, x, y);
    }

    let x = [
        75, 200, 325
    ];
    let y1 = -100 - 400;
    let y2 = -canvas.height / 2 - 200 - 400;
    let index = Math.floor(Math.random() * 3);
    let index2 = Math.floor(Math.random() * 3);
    let nr = 0;

    this.update = () => {
        if (nr != 19)
            this.asteroid_spawn(x[index] - 50, y1 - 50);
        this.asteroid_spawn(x[index2] - 50, y2 - 50);

        if (y1 + 50 <= canvas.height + 100)
            y1 += 7 * delta_time;
        else {
            y1 = -100;
            index = Math.floor(Math.random() * 3);
            while (index == index2)
                index = Math.floor(Math.random() * 3);
            nr++;
        }
        
        if (y2 + 50 <= canvas.height + 100)
            y2 += 7 * delta_time;
        else {
            y2 = -100;
            index2 = Math.floor(Math.random() * 3);
            while (index2 == index)
                index2 = Math.floor(Math.random() * 3);
            nr++;
        }

        if (y1 + 50 >= canvas.height - 175 - 20 && y1 - 50 <= canvas.height - 40 && x[index] + 50 >= ship_x && x[index] - 50 <= ship_x + 100) {
            game_over();
            y1 = -100 - 400;
            y2 = -canvas.height / 2 - 200 - 400;
            nr = 0;
        }
        if (y2 + 50 >= canvas.height - 175 - 20 && y2 - 50 <= canvas.height - 40 && x[index2] + 50 >= ship_x && x[index2] - 50 <= ship_x + 100) {
            game_over();
            y1 = -100 - 400;
            y2 = -canvas.height / 2 - 200 - 400;
            nr = 0;
        }
        
        
        if (nr == 20) {
            y1 = -100 - 400;
            y2 = -canvas.height / 2 - 200 - 400;
            nr = 0;
            despawn = 1;
        }

    }
};
let asteroid = new Asteroid();

// Niblonian ship

let niblonian_image = new Image();
niblonian_image.src = "/static/game/niblonian.png"; // 140 x 83
let nib_x = canvas.width / 2;
let nib_y = - 340;
function Niblonian() {
    let speed = 3;
    let nib_projectile_y = 150;
    let nib_projectile_x = Math.random() * (canvas.width - 75 * 4 / 3) + 75 * 2 / 3;

    this.projectile_spawn = () => {
        ctx.strokeStyle = "rgb(0, 204, 255)";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.ellipse(nib_projectile_x, (nib_projectile_y - 40), 55 * 2 / 6, 20 * 1 / 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(nib_projectile_x, (nib_projectile_y - 20), 65 * 2 / 4.5, 20 * 1 / 4.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();        
        ctx.ellipse(nib_projectile_x, nib_projectile_y, 75 * 2 / 3, 20 * 1 / 3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        nib_projectile_y += 3 * delta_time;

        if (nib_projectile_y > canvas.height + 40) {
            nib_projectile_y = 150;
            nib_projectile_x = Math.random() * (canvas.width - 75 * 4 / 3) + 75 * 2 / 3;
        }

        if (nib_projectile_y >= canvas.height - 175 - 20 && nib_projectile_y <= canvas.height - 20 && nib_projectile_x + 75 * 2 / 3 >= ship_x && nib_projectile_x - 75 * 2 / 3 <= ship_x + 100) {
            game_over();
            nib_projectile_y = 150;
            damage = 0;
        }
    }
    let k = 0;
    this.update = () => {
        
        if (k)
            this.projectile_spawn();
        ctx.drawImage(niblonian_image, nib_x - 70, nib_y);

        
        if (nib_y <= 30)
            nib_y += 3;
        else k = 1;
        
        if (k)
            nib_x += speed * delta_time;
        if (nib_x >= canvas.width - 70)
            speed *= -1;
        if (nib_x <= 70)
            speed *= -1;

        
        if (projectile_y >= nib_y && projectile_y <= nib_y + 83 && projectile_x >= nib_x - 70 && projectile_x <= nib_x + 70) {
            target = 1;
        }
        if (damage == 10) {
            nib_projectile_y = 150;
            damage = 0;
            despawn = 1;
        }
        
    }
}
let niblonian = new Niblonian();

// Omocronian ship

let omc = new Image();
omc.src = "/static/game/omocronian.png"; // 120 x 82
let omc_x = [ 70, 200, 330 ];
let omc_y = [ -600, - 700 - canvas.height / 2 ];
let index0 = Math.floor(Math.random() * 3);
let index1 = Math.floor(Math.random() * 3);
while (index0 == index1)
    index1 = Math.floor(Math.random() * 3);

function Omocronian() {
    let damaged0 = 0;
    let damaged1 = 0;
    let damaged2 = 0;
    let damaged3 = 0;
    let damaged4 = 0;
    let damaged5 = 0;

    let nr = 0;

    this.update = () => {
        if (!damaged0 && nr < 19)
            ctx.drawImage(omc, omc_x[index0] - 60, omc_y[0]);
        if (!damaged1 && nr < 19)
            ctx.drawImage(omc, omc_x[index0] - 60, omc_y[0] - 100);
        if (!damaged2 && nr < 19)
            ctx.drawImage(omc, omc_x[index0] - 60, omc_y[0] - 200);
        if (!damaged3)
            ctx.drawImage(omc, omc_x[index1] - 60, omc_y[1]);
        if (!damaged4)
            ctx.drawImage(omc, omc_x[index1] - 60, omc_y[1] - 100);
        if (!damaged5)
            ctx.drawImage(omc, omc_x[index1] - 60, omc_y[1] - 200);

        omc_y[0] += 7 * delta_time;
        omc_y[1] += 7 * delta_time;
        
        if (omc_y[0] >= canvas.height + 200) {
            omc_y[0] = - 100;
            index0 = Math.floor(Math.random() * 3);
            while (index0 == index1)
                index0 = Math.floor(Math.random() * 3);
            damaged0 = 0;
            damaged1 = 0;
            damaged2 = 0;
            nr++;
        }
        if (omc_y[1] >= canvas.height + 200) {
            omc_y[1] = - 100;
            index1 = Math.floor(Math.random() * 3);
            while (index0 == index1)
                index1 = Math.floor(Math.random() * 3);
            damaged3 = 0;
            damaged4 = 0;
            damaged5 = 0;
            nr++;
        }

        if (nr == 20) {
            despawn = 1;
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }

        // Omocronian ship destroy

        if (projectile_y <= omc_y[0] + 100 && projectile_x >= omc_x[index0] - 60 && projectile_x <= omc_x[index0] + 60 && !target && !damaged0) {
            target = 1;
            damaged0 = 1;
        }
        if (projectile_y <= omc_y[0] && projectile_x >= omc_x[index0] - 60 && projectile_x <= omc_x[index0] + 60 && !target && !damaged1) {
            target = 1;
            damaged1 = 1;
        }
        if (projectile_y <= omc_y[0] - 100 && projectile_x >= omc_x[index0] - 60 && projectile_x <= omc_x[index0] + 60 && !target && !damaged2) {
            target = 1;
            damaged2 = 1;
        }
        if (projectile_y <= omc_y[1] + 100 && projectile_x >= omc_x[index1] - 60 && projectile_x <= omc_x[index1] + 60 && !target && !damaged3) {
            target = 1;
            damaged3 = 1;
        }
        if (projectile_y <= omc_y[1] && projectile_x >= omc_x[index1] - 60 && projectile_x <= omc_x[index1] + 60 && !target && !damaged4) {
            target = 1;
            damaged4 = 1;
        }
        if (projectile_y <= omc_y[1] - 100 && projectile_x >= omc_x[index1] - 60 && projectile_x <= omc_x[index1] + 60 && !target && !damaged5) {
            target = 1;
            damaged5 = 1;
        }
        
        // Ship destroy

        if (omc_y[0] + 60 >= canvas.height - 175 - 40 && omc_y[0] - 20 <= canvas.height - 40 && omc_x[index0] + 40 >= ship_x && omc_x[index0] - 40 <= ship_x + 100 && !damaged0) {
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }
        if (omc_y[0] - 40 >= canvas.height - 175 - 40 && omc_y[0] - 120 <= canvas.height - 40 && omc_x[index0] + 40 >= ship_x && omc_x[index0] - 40 <= ship_x + 100 && !damaged1) {
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }
        if (omc_y[0] - 160 >= canvas.height - 175 - 40 && omc_y[0] - 220 <= canvas.height - 40 && omc_x[index0] + 40 >= ship_x && omc_x[index0] - 40 <= ship_x + 100 && !damaged2) {
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }
        if (omc_y[1] + 60 >= canvas.height - 175 - 40 && omc_y[1] - 20 <= canvas.height - 40 && omc_x[index1] + 40 >= ship_x && omc_x[index1] - 40 <= ship_x + 100 && !damaged3) {
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }
        if (omc_y[1] - 40 >= canvas.height - 175 - 40 && omc_y[1] - 120 <= canvas.height - 40 && omc_x[index1] + 40 >= ship_x && omc_x[index1] - 40 <= ship_x + 100 && !damaged4){ 
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }
        if (omc_y[1] - 160 >= canvas.height - 175 - 40 && omc_y[1] - 220 <= canvas.height - 40 && omc_x[index1] + 40 >= ship_x && omc_x[index1] - 40 <= ship_x + 100 && !damaged5) {
            game_over();
            omc_y[0] = -600;
            omc_y[1] = - 700 - canvas.height / 2;
            nr = 0;
        }

    }
}
let omocronian = new Omocronian();

let enemies = [
    "nimbus",
    "asteroid",
    "niblonian",
    "omocronian"
];

let enemy_select = Math.floor(Math.random() * 4);

let press_start = () => {
    ctx.font = "50px serif";
    ctx.fillStyle = "white";
    ctx.fillText("Press to start", canvas.width / 2 - 125, canvas.height / 2);
    key.left = 0;
    key.right = 0;
    score = 0;
};

let score = 0;
let old_time = 0;
let delta_time;
let animate = (time) => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    delta_time = (time - old_time) / 16;
    old_time = time;

    for (let i = 0; i < arrayCircle.length; i++) {
        arrayCircle[i].update();
    }

    let index;
    if (!start && !over) {
        press_start();
        index = Math.floor(Math.random() * 4);
        while (index == enemy_select)
            index = Math.floor(Math.random() * 4);
        enemy_select = index;
    }

    if (over) {
        game_over();
        despawn = 1;
    }

    ship.update();
    if (start)
        projectile.update();

    if (start && !despawn) {
        if (enemies[enemy_select] == "nimbus")
            nimbus.update();
        if (enemies[enemy_select] == "asteroid")
            asteroid.update();
        if (enemies[enemy_select] == "niblonian")
            niblonian.update();
        if (enemies[enemy_select] == "omocronian")
            omocronian.update();
    }

    if (start && despawn) {
        index = Math.floor(Math.random() * 4);
        while (index == enemy_select)
            index = Math.floor(Math.random() * 4);
        enemy_select = index;
        despawn = 0;
        damage = 0;
    }

    // if (start && !despawn)
    //     nimbus.update();

    // if (start && !despawn)
    //     asteroid.update();

    // if (start && !despawn)
    //     niblonian.update();

    // if (start && !despawn)
    //     omocronian.update();
    
    if (start)
        score += 0.3;

    document.getElementById("score").innerHTML = parseInt(score);
}

animate();