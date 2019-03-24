'use strict';


document.addEventListener('DOMContentLoaded', function () {
  console.log('Hello Bulma!');
});



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