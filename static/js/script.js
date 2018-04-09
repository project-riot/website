$(function() {
    console.log("project rIoT");
    changeColor();
});

function changeColor() {
	document.body.style.background = getRandomColor();
	window.setTimeout(changeColor, 1500);
}

function getRandomColor() {
	return '#'+Math.random().toString(16).substr(-6);
}
