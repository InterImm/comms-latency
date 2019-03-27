var sky = new SkySphere('sky', {
    width: document.documentElement.clientWidth,
    height: 500,
    customOnClick: function (data) {
    },
    getObjectText: function (data) {
        return data.name;
    }
});

sky.zoom(1.5)

var date = new Date();

// Position of planets
var mars = new Orb.VSOP("Mars");

var radec = mars.radec(date);

var mars_sky = sky.addCustomObject(radec.ra, radec.dec, {
    name: 'Mars',
});


sky.drawSky();
sky.centerSkyPoint(mars_sky)


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
    sky.centerSkyPoint(mars_sky);
});