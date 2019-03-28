'use strict';

document.addEventListener('DOMContentLoaded', function () {
  console.log('Hello Mars!');
});

// establish variables
var parentDiv = document.getElementById('solarsystem');

var w     = parentDiv.clientWidth;
var h     = parentDiv.clientWidth;
var solar_center = {"x": w/2, "y": h/2}
var draw_sol_scale_factor = 100

// insert svg element
var svg = d3.select(parentDiv).insert("svg")
    .attr("width", w)
    .attr("height", h);

// sun
svg.append("circle")
    .attr("r", 10)
    .attr("cx", solar_center.x )
    .attr("cy", solar_center.y)
    .attr("id", "sun");

draw_orbit(svg,
  1, draw_sol_scale_factor, solar_center,
  {
    "color": '#aaa'
  }
)

draw_orbit(svg,
  1.562, draw_sol_scale_factor, solar_center,
  {
    "color": "#aaa"
  }
)




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
      setTimeout(self.update_date, 1000)
    },
    update_solar_system: function () {

      var date = new Date()
      var mars = new Orb.VSOP("Mars");
      var earth = new Orb.VSOP("Earth");

      var mars_xyz = mars.xyz(date)
      var earth_xyz = earth.xyz(date)

      var earth_coor = {"x":earth_xyz.x * draw_sol_scale_factor + solar_center.x,
      "y": earth_xyz.y * draw_sol_scale_factor + solar_center.y}
      var mars_coor = {"x":mars_xyz.x * draw_sol_scale_factor + solar_center.x,
      "y": mars_xyz.y * draw_sol_scale_factor + solar_center.y}

        draw_planet(svg,
          mars_xyz, draw_sol_scale_factor, solar_center, 5, {
            "text": "Mars",
            "x": 10,
            "y": 10,
            "color": "#FF3333"
          }
          )
        draw_planet(svg,
          earth_xyz, draw_sol_scale_factor, solar_center, 5, {
          "text": "Earth",
          "x": 10,
          "y": 10,
          "color": "#3366cc"
        })
        draw_planet(svg,
          {"x": 0, "y": 0}, draw_sol_scale_factor, solar_center, 10, {
            "text": "Sun",
            "x": 15,
            "y": 10,
            "color": "#FF8700"
          }
          )
        svg.append("line")
            .style("stroke", "green") 
            .attr("x1", earth_coor.x )
            .attr("y1", earth_coor.y ) 
            .attr("x2", mars_coor.x )
            .attr("y2",  mars_coor.y )
            .style("stroke-dasharray", ("3, 3")); 


        svg.append("text")
            .attr("x", (earth_coor.x + mars_coor.x)/2 )
            .attr("y", (earth_coor.y + mars_coor.y)/2 )
            .attr("dy", ".05em")
            .attr("text-anchor", "start")
            .text(
              this.earth_mars_distance_lm + "min (" + parseFloat(this.earth_mars_distance_lm * lm2km).toFixed(0) + "km)"
              )
            .style("font-size", "10px")
            .style("fill", "grey");



    },
    plot_distance: function () {
        var me_dist_dates = [];
        var me_dist_values = []

        for (var i = 0; i < 1000; i++) {
          me_dist_dates[i] = dateSub( new Date(), i )
          me_dist_values[i] = this.mars.radec( dateSub( new Date(), i ) ).distance  * au2km/lm2km
        }

        var data = [
          {
            x: me_dist_dates,
            y: me_dist_values,
            type: 'scatter'
          }
        ];

        var layout = {
          title: 'One Way Communication Latency History',
          xaxis: {
            title: 'Date',
            showgrid: false,
            zeroline: false,
            fixedrange: true
          },
          yaxis: {
            title: 'One Way Communication Latency (Minutes)',
            showline: false,
            fixedrange: true
          }
        };

        var options = {
          displayModeBar: false,
        };

        Plotly.newPlot('distance-chart', data, layout, options);

    }
  },
  mounted: function() {
    this.update_date()
    this.update_solar_system()
    this.plot_distance()
  },
  computed: {
    mars: function () {
      return new Orb.VSOP("Mars")
    },
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





