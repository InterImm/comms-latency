// generate date array
var getDateArray = function (start, end) {

  var
    arr = new Array(),
    dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;
}

function dateSub(date, sub_days) {
  return new Date(date.getTime() - (24 * 60 * 60 * 1000) * sub_days)
}

// 1 au = ? km
var au2km = 1.496e8
// convert light minute to km
var lm2km = 299792.458 * 60

// distance calculation

function distance(planet_a, planet_b, unit = 'km') {
  var res_distance = Math.sqrt(Math.pow(planet_a.x - planet_b.x, 2) + Math.pow(planet_a.y - planet_b.y, 2) + Math.pow(planet_a.z - planet_b.z, 2))

  if (unit == 'km') {
    res_distance = res_distance * au2km
  } else if (unit == 'au') {
    res_distance = res_distance
  } else if (unit == 'lm') {
    res_distance = res_distance * au2km / lm2km
  } else {
    throw "unit can only be au or km!";
  }

  return res_distance;
}


var draw_planet = function (svg, orb_obj_xyz, scale_factor, solar_center, size, label) {

  var orb_x = orb_obj_xyz.x * scale_factor + solar_center.x
  var orb_y = orb_obj_xyz.y * scale_factor + solar_center.y

  svg.append("circle")
    .attr("r", size)
    .attr("cx", orb_x)
    .attr("cy", orb_y)
    .attr("id", label.text)
    .style("stroke", "none")
    .style("fill", label.color);

  // text( label.text, orb_x + label.x, orb_y + label.y )
  svg.append("text")
    .attr("x", orb_x + 10)
    .attr("y", orb_y)
    .attr("dy", ".1em")
    .attr("text-anchor", "start")
    .text(label.text)
    .style("fill", label.color);

};

function draw_orbit(svg, orb_radius, scale_factor, solar_center, label) {

  var radius = orb_radius * scale_factor
  svg.append("circle")
    .attr("r", radius)
    .attr("cx", solar_center.x)
    .attr("cy", solar_center.y)
    .attr("id", label.text)
    .attr("stroke-width", 0.5)
    .style("stroke", "grey")
    .style("fill", "none");

}

function plot_mars_earth_distance_history(astro_obj,current_date, layout_title, layout_xaxis_title, layout_yaxis_title, target_element = 'distance-chart') {
  
  var me_dist_dates = []
  var me_dist_values = []

  for (var i = 0; i < 1000; i++) {
    var j = i - Math.round(1000 / 2)
    me_dist_dates[i] = dateSub(current_date, j)
    me_dist_values[i] = astro_obj.radec(dateSub(current_date, j)).distance * au2km / lm2km
  }

  var data = [{
    x: me_dist_dates,
    y: me_dist_values,
    type: 'scatter',
    showlegend: false
  },
  {
    x: [current_date],
    y: [astro_obj.radec(current_date).distance * au2km / lm2km],
    name: 'At the moment of choice',
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: '#FF3333',
      size: 10
    },
    showlegend: false
  }];

  var layout = {
    title: layout_title, //'One Way Communication Latency History',
    xaxis: {
      title: layout_xaxis_title,//'Date',
      showgrid: false,
      zeroline: false,
      fixedrange: true
    },
    yaxis: {
      title: layout_yaxis_title,//'One Way Communication Latency (Minutes)',
      showline: false,
      fixedrange: true
    }
  };

  var options = {
    displayModeBar: false,
  };

  Plotly.newPlot(target_element, data, layout, options);
}