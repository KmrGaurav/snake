"use strict";
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
var x = 0;
function update() {
    x++;
}
function draw() {
    context.fillRect(x, 200, 40, 40);
    context.fill();
}
(function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
})();
