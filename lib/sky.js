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

var your_location = {
    "latitude": 6.92640,
    "longitude": 50.95110,
    "altitude": 0
}

var date = new Date();

// Position of planets
var mars = new Orb.VSOP("Mars");

var observe_mars = new Orb.Observation({
    "observer": your_location,
    "target": mars
});
var horizontal = observe_mars.azel(date); // horizontal coordinates(azimuth, elevation)

var mars_sky = sky.addCustomObject(horizontal.azimuth, horizontal.elevation, {
    name: 'Mars',
    clickData: 'Mars is here'
});

var m42 = sky.addCustomObject(5.58814, -4.92319, {
    name: 'Orion Nebula',
    clickData: 'M42 - the Great Orion Nebula'
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