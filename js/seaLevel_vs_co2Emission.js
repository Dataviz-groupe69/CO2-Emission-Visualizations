var margin_2 = {
    top: 60,
    right: 20,
    bottom: 30,
    left: 30
}
var width_2 = 800- margin_2.left - margin_2.right
var height_2 = 600- margin_2.top - margin_2.bottom
var svg_2 = d3.select(".chart_2").append("svg")
    .attr("width", width_2 + margin_2.left + margin_2.right)
    .attr("height", height_2 + margin_2.top + margin_2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_2.left + "," + margin_2.top + ")");

var tooltip = d3.select(".chart_2").append("div")
    .attr("class", "hidden tooltip")

// console.log('Coordinates: ', document.getElementsByClassName('chart_2'))

function start() {
    svg_2.selectAll("circle").remove();
    svg_2.selectAll("g.x-axis").remove();
    svg_2.selectAll("g.y-axis").remove();
    svg_2.selectAll("text.label").remove();

    d3.csv("csv/seaLevel_co2.csv",function (error,data) {
        // console.log(data)
        visualization(data)
    })
};


function visualization(data) {
    var colorScale = d3.scaleOrdinal(d3.schemeCategory20)
    let xScale = d3.scaleLinear().domain(d3.extent(data, function(d) {
        return parseInt(d['emission'])
    })).range([0, height_2])
    var yScale = d3.scaleLinear().domain(d3.extent(data, function(d) {
        return parseInt(d['CSIRO'])
    })).range([height_2, 0])

    var xAxis_2 = d3.axisBottom(xScale).ticks(10)
    var yAxis_2 = d3.axisLeft(yScale).ticks(10)

    svg_2.append('g')
        .attr('transform', 'translate(0,' + height_2 + ')')
        .attr('class', 'x-axis')
        .call(xAxis_2)
    svg_2.append('g')
        .attr('class', 'y-axis')
        .call(yAxis_2)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", ".15em");
    svg_2.append('text')
        .attr('x', 40)
        .attr('y', 0)
        .attr('class', 'label')
        .text('sea level (inch)');
    svg_2.append('text')
        .attr('x', height_2)
        .attr('y', height_2 - 5)
        .attr('class', 'label')
        .text('CO2 emission (µg/m³)')

    svg_2.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .transition()
        .delay(function(_, i) { return i*100 })
        .duration(500)
        .attr('r', 8)
        .attr('cx', function(d) { return xScale(d['emission'])})
        .attr('cy', function(d) { return yScale(d['CSIRO'])})
        .style('fill', 'rgb(115, 171, 243)')

    svg_2.selectAll('circle').on('mouseover', mouseover)
        .on('mouseout', mouseout)
}

function mouseover(d) {
    // console.log('Year: ', d['Year'])
    svg_2.selectAll('circle')
        .filter(function(e) {
            return e !== d
        })
        .style('opacity', 0.09)

    let mouse = d3.mouse(svg_2.node()).map(function(x) {
        return parseInt(x)
    })
    // console.log('Mouse: ', mouse)
    let chart_2 = document.getElementsByClassName('chart_2')
    
    tooltip.classed("hidden", false)
        .attr("style", "left:" + (mouse[0] + chart_2[0].offsetLeft) +
            "px; top:" + (mouse[1] + chart_2[0].offsetTop) + "px")
    if(d) {
        tooltip.html('YEAR:' + d['Year'] + '<br/>' + 'CSIRO:' + parseFloat(d['CSIRO']).toFixed(2) + '<br/>' + 'CO2:' + d['emission'] +' µg/m³')

    } else {
        tooltip.html('undefined')
    }
}

function mouseout(d) {
    d3.selectAll('circle')
        .filter(function(e) {
            return e !== d
        })
        .style('opacity', 1)
    tooltip.classed("hidden", true)
}
