var sky = new SkySphere('sky', {
    width: document.documentElement.clientWidth,
    height: 700,
    customOnClick: function (data) {
        alert(data.clickData);
    },
    getObjectText: function (data) {
        return data.name;
    }
});

var m42 = sky.addCustomObject(5.58814, -4.92319, {name: 'Orion Nebula', clickData: 'M42 - the Great Orion Nebula'});
sky.drawSky();
window.addEventListener('resize', function () {
    sky.setContainerSize(document.documentElement.clientWidth, 400, true);
});

var zoomFactor = 1;

document.getElementById('zoom-out').addEventListener('click', function (e) {
    zoomFactor -= 0.1;
    sky.absoluteZoom(zoomFactor);
});
document.getElementById('zoom-in').addEventListener('click', function (e) {
    zoomFactor += 0.1;
    sky.absoluteZoom(zoomFactor);
});

document.getElementById('target').addEventListener('click', function () {
    sky.centerSkyPoint(m42);
});