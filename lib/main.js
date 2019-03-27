'use strict';

document.addEventListener('DOMContentLoaded', function () {
  console.log('Hello Mars!');
});

// generate date array
var getDateArray = function(start, end) {

  var
    arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;
}

function dateSub( date, sub_days ) {
  return new Date(date.getTime() - (24*60*60*1000) * sub_days)
}

// 1 au = ? km
var au2km = 1.496e8
// convert light minute to km
var lm2km= 299792.458*60

// distance calculation

function distance(planet_a, planet_b,  unit = 'km') {
  var res_distance = Math.sqrt( Math.pow( planet_a.x - planet_b.x , 2) + Math.pow( planet_a.y - planet_b.y , 2) + Math.pow( planet_a.z - planet_b.z , 2) )

  if (unit == 'km') {
    res_distance = res_distance * au2km
  } else if (unit == 'au') { 
    res_distance = res_distance
  } else if (unit=='lm') {
    res_distance = res_distance * au2km/lm2km
  } else {
    throw "unit can only be au or km!";
  }

  return res_distance; 
}





var app = new Vue({
  el: '#app',
  data: {
    message: 'Hi',
    current_date: new Date(),
    timer: ''
  },
  methods: {
    update_date: function() {
      var self = this
      this.current_date = new Date()
      setInterval(self.update_date, 1000)
    }
  },
  mounted: function() {
    this.update_date()
  },
  computed: {
    current_date_string: function () {
      return moment(String(this.current_date)).format('MM/DD/YYYY hh:mm')
    },
    earth_mars_distance_lm: function () {
      var date = this.current_date
      // Position of planets
      var mars = new Orb.VSOP("Mars");
      var mars_xyz = mars.xyz(date); // ecliptic rectangular coordinates(x, y, z)
      var mars_radec = mars.radec(date); // equatorial spherical coordinates(ra, dec, distance)

      // Position of Earth
      var earth = new Orb.VSOP("Earth");
      var earth_xyz = earth.xyz(date); 
      var earth_radec = earth.radec(date); 

      return parseFloat(distance( mars_xyz, earth_xyz, 'lm' )).toFixed(2)
    },
    earth_mars_round_trip: function () {
      var date = this.current_date
      // Position of planets
      var mars = new Orb.VSOP("Mars");
      var mars_xyz = mars.xyz(date); // ecliptic rectangular coordinates(x, y, z)
      var mars_radec = mars.radec(date); // equatorial spherical coordinates(ra, dec, distance)

      // Position of Earth
      var earth = new Orb.VSOP("Earth");
      var earth_xyz = earth.xyz(date); 
      var earth_radec = earth.radec(date); 

      return parseFloat(2*distance( mars_xyz, earth_xyz, 'lm' )).toFixed(2)
    }
  }
})


var draw_sol_scale_factor = 100

var draw_planet = function(orb_obj_xyz, scale_factor, solar_center, size, label) {

  var orb_x = orb_obj_xyz.x * scale_factor + solar_center.x
  var orb_y = orb_obj_xyz.y * scale_factor + solar_center.y

  let c = label.color; // Define color 'c'
  fill(c); // Use color variable 'c' as fill color
  noStroke(); 

  circle(orb_x, orb_y, size);
  text( label.text, orb_x + label.x, orb_y + label.y )
};

function draw_orbit( orb_radius, scale_factor, solar_center, label ) {

  var radius = orb_radius * scale_factor
  let c = label.color; // Define color 'c'
  stroke(c); // Use color variable 'c' as fill color
 noFill()

  circle( solar_center.x, solar_center.y, radius )
}


function setup() {
  var cnv = createCanvas( 500, 500);
  cnv.parent('solarsystem');
}


function draw() {

  var solar_center = {"x": 250, "y": 250}
  var mars = new Orb.VSOP("Mars");
  var earth = new Orb.VSOP("Earth");

  var mars_xyz = mars.xyz(date)
  var earth_xyz = earth.xyz(date)


  draw_orbit(
    1, draw_sol_scale_factor, solar_center,
    {
      "color": color(50,50,50)
    }
  )

  draw_orbit(
    1.562, draw_sol_scale_factor, solar_center,
    {
      "color": color(50,50,50)
    }
  )
  
  draw_planet(
    mars_xyz, draw_sol_scale_factor, solar_center, 5, {
      "text": "Mars",
      "x": 10,
      "y": 10,
      "color": color(255,51,51)
    }
    )

  draw_planet(
    earth_xyz, draw_sol_scale_factor, solar_center, 5, {
    "text": "Earth",
    "x": 10,
    "y": 10,
    "color": color(0,89,179)
  })
  draw_planet(
    {"x": 0, "y": 0}, draw_sol_scale_factor, solar_center, 15, {
      "text": "Sun",
      "x": 15,
      "y": 10,
      "color": color(255,135,0)
    }
    )
}


var me_dist_dates = [];
var me_dist_values = []

for (var i = 0; i < 1000; i++) {
  me_dist_dates[i] = dateSub( new Date(), i )
  
  me_dist_values[i] = mars.radec( dateSub( new Date(), i ) ).distance  * au2km/lm2km

}

var data = [
  {
    x: me_dist_dates,
    y: me_dist_values,
    type: 'scatter'
  }
];

var layout = {
  title: 'One Way Communication Lag History',
  xaxis: {
    title: 'Date',
    showgrid: false,
    zeroline: false
  },
  yaxis: {
    title: 'One Way Communication Lag (Minutes)',
    showline: false
  }
};

var options = {
  displayModeBar: false,
};

Plotly.newPlot('distance-chart', data, layout, options);
