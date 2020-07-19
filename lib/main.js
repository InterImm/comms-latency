'use strict';

document.addEventListener('DOMContentLoaded', function () {
  console.log('Hello Mars!');
});

// establish variables
var parentDiv = document.getElementById('solarsystem');

// var w = parentDiv.clientWidth;
// var h = parentDiv.clientWidth;
var w = 600;
var h = 600;
var solar_center = {
  "x": w / 2,
  "y": h / 2
}
var draw_sol_scale_factor = 100


// insert svg element
var svg = d3.select(parentDiv).insert("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", "0 0 " + w + " " + h)
// .attr("width", w)
// .attr("height", h);





var app = new Vue({
  el: '#app',
  data: {
    from_body: 'Earth',
    to_body: 'Mars',
    options_en: [
        { text: 'Mercury', value: 'Mercury' },
        { text: 'Venus', value: 'Venus' },
        { text: 'Earth', value: 'Earth' },
        { text: 'Mars', value: 'Mars' },
        { text: 'Jupiter', value: 'Jupiter' },
        { text: 'Saturn', value: 'Saturn' },
        { text: 'Uranus', value: 'Uranus' },
        { text: 'Neptune', value: 'Neptune' }
      ],
    options_cn: [
        { text: '水星', value: 'Mercury' },
        { text: '金星', value: 'Venus' },
        { text: '地球', value: 'Earth' },
        { text: '火星', value: 'Mars' },
        { text: '木星', value: 'Jupiter' },
        { text: '土星', value: 'Saturn' },
        { text: '天王星', value: 'Uranus' },
        { text: '海王星', value: 'Neptune' }
      ],
    message: 'Mars',
    current_date: new Date(),
    form: {
      'selected_date': new Date().toISOString()
    },
    timer: '',
    plot_distance_layout: {
      'title': 'One Way Communication Latency History',
      'yaxis_title': 'One Way Communication Latency (Minutes)',
      'xaxis_title': 'Date'
    },
    plot_distance_layout_cn: {
      'title': '单向通信延时',
      'yaxis_title': '单向通信延时（分钟）',
      'xaxis_title': '日期'
    },
    draw_sol_scale_factor: draw_sol_scale_factor
  },
  methods: {
    update_date: function () {

      if (this.form.selected_date) {
        this.current_date = new Date(this.form.selected_date)
    }
      // setTimeout(self.update_date, 1000)
    },
    update_solar_system: function () {

      svg.selectAll("circle").remove()
      svg.selectAll("line").remove()
      svg.selectAll("text").remove()

      var date = this.current_date
      var mars = this.mars;
      var earth = this.earth;

      var mars_xyz = mars.xyz(date)
      var to_body_xyz = earth.xyz(date)

      // sun
      svg.append("circle")
      .attr("r", 10)
      .attr("cx", solar_center.x)
      .attr("cy", solar_center.y)
      .attr("id", "sun");

      draw_orbit(svg,
        to_body_xyz, this.draw_sol_scale_factor, solar_center, {
        "color": '#aaa'
        }
      )

      draw_orbit(svg,
        mars_xyz, this.draw_sol_scale_factor, solar_center, {
        "color": "#aaa"
      }
      )



      var earth_coor = {
        "x": to_body_xyz.x * this.draw_sol_scale_factor + solar_center.x,
        "y": to_body_xyz.y * this.draw_sol_scale_factor + solar_center.y
      }
      var mars_coor = {
        "x": mars_xyz.x * this.draw_sol_scale_factor + solar_center.x,
        "y": mars_xyz.y * this.draw_sol_scale_factor + solar_center.y
      }

      draw_planet(svg,
        mars_xyz, this.draw_sol_scale_factor, solar_center, 5, {
          "text": this.from_body_text_en,
          "x": 10,
          "y": 10,
          "color": "#FF3333"
        }
      )
      draw_planet(svg,
        to_body_xyz, this.draw_sol_scale_factor, solar_center, 5, {
          "text": this.to_body_text_en,
          "x": 10,
          "y": 10,
          "color": "#3366cc"
        })
      draw_planet(svg, {
        "x": 0,
        "y": 0
      }, this.draw_sol_scale_factor, solar_center, 10, {
        "text": "Sun",
        "x": 15,
        "y": 10,
        "color": "#FF8700"
      })
      svg.append("line")
        .style("stroke", "green")
        .attr("x1", earth_coor.x)
        .attr("y1", earth_coor.y)
        .attr("x2", mars_coor.x)
        .attr("y2", mars_coor.y)
        .style("stroke-dasharray", ("3, 3"));


      svg.append("text")
        .attr("x", (earth_coor.x + mars_coor.x) / 2)
        .attr("y", (earth_coor.y + mars_coor.y) / 2)
        .attr("dy", ".05em")
        .attr("text-anchor", "start")
        .text(
          this.earth_mars_distance_lm + "min (" + parseFloat(this.earth_mars_distance_lm * lm2km).toFixed(0) + "km)"
        )
        .style("font-size", "10px")
        .style("fill", "grey");

        // setTimeout(self.update_solar_system, 1000)
    },
    plot_distance: function () {

      var cnelementExists = document.getElementById("distance-chart-cn")
      var enelementExists = document.getElementById("distance-chart")

      if (cnelementExists) {
        plot_astro_bodies_distance_history(this.mars, this.earth, this.current_date, this.plot_distance_layout_cn.title, this.plot_distance_layout_cn.xaxis_title, this.plot_distance_layout_cn.yaxis_title, 'distance-chart-cn')
      } else if (enelementExists) {
        plot_astro_bodies_distance_history(this.mars, this.earth, this.current_date, this.plot_distance_layout.title, this.plot_distance_layout.xaxis_title, this.plot_distance_layout.yaxis_title, 'distance-chart')
      }

      // setTimeout(self.plot_distance, 1000)

    },
    update_page: function ( ) {

      this.update_date()
      this.update_solar_system()
      this.plot_distance()

      setTimeout(this.update_page, 1000)
    }
  },
  mounted: function () {

    this.update_page( )

  },
  computed: {
    compute_draw_sol_scale_factor: function () {
      var date = this.current_date
      // Position of planets
      var a_body = new Orb.VSOP(this.to_body);
      var a_body_xyz = a_body.xyz(date); // ecliptic rectangular coordinates(x, y, z)
      var a_body_radius = Math.sqrt( Math.pow(a_body_xyz.x,2) + Math.pow(a_body_xyz.y, 2) )
      this.draw_sol_scale_factor = draw_sol_scale_factor* 1.5/a_body_radius

      return this.draw_sol_scale_factor
    },
    from_body_text_cn: function () {
      var arrayLength = this.options_cn.length;
      for (var i = 0; i < arrayLength; i++) {
        if (this.options_cn[i].value == this.from_body) {
          return this.options_cn[i].text
        }
      }
    },
    to_body_text_cn: function () {
      var arrayLength = this.options_cn.length;
      for (var i = 0; i < arrayLength; i++) {
        if (this.options_cn[i].value == this.to_body) {
          return this.options_cn[i].text
        }
      }
    },
    from_body_text_en: function () {
      var arrayLength = this.options_en.length;
      for (var i = 0; i < arrayLength; i++) {
        if (this.options_en[i].value == this.from_body) {
          return this.options_en[i].text
        }
      }
    },
    to_body_text_en: function () {
      var arrayLength = this.options_en.length;
      for (var i = 0; i < arrayLength; i++) {
        if (this.options_en[i].value == this.to_body) {
          return this.options_en[i].text
        }
      }
    },
    current_date_input: function () { return this.current_date.toString()},
    mars: function () {
      return new Orb.VSOP(this.from_body)
    },
    earth: function () {
      return new Orb.VSOP(this.to_body)
    },
    current_date_string: function () {
      var current_date = this.current_date
      return moment(current_date).format('LLL')
    },
    current_date_string_cn: function () {
      var current_date = this.current_date
      return moment(current_date).locale("zh-cn").format('LLL')
    },
    earth_mars_distance_lm: function () {
      var date = this.current_date
      // Position of planets
      var mars = new Orb.VSOP(this.from_body);
      var mars_xyz = mars.xyz(date); // ecliptic rectangular coordinates(x, y, z)
      var mars_radec = mars.radec(date); // equatorial spherical coordinates(ra, dec, distance)

      // Position of Earth
      var earth = new Orb.VSOP(this.to_body);
      var earth_xyz = earth.xyz(date);
      var earth_radec = earth.radec(date);

      return parseFloat(distance(mars_xyz, earth_xyz, 'lm')).toFixed(2)
    },
    earth_mars_round_trip: function () {
      var date = this.current_date
      // Position of planets
      var mars = new Orb.VSOP(this.to_body);
      var mars_xyz = mars.xyz(date); // ecliptic rectangular coordinates(x, y, z)
      var mars_radec = mars.radec(date); // equatorial spherical coordinates(ra, dec, distance)

      // Position of Earth
      var earth = new Orb.VSOP(this.from_body);
      var earth_xyz = earth.xyz(date);
      var earth_radec = earth.radec(date);

      return parseFloat(2 * distance(mars_xyz, earth_xyz, 'lm')).toFixed(2)
    }
  }
})