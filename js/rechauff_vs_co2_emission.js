var margin_3 = {
        top: 20,
        right: 100,
        bottom: 30,
        left: 100
    };
var width_3 = 800- margin_3.left - margin_3.right;
var height_3 = 600- margin_3.top - margin_3.bottom;

var parseTime = d3.timeParse("%d-%b-%y");
var x_3 = d3.scaleTime()
    .domain([new Date(1950,0,0),new Date(2050,1,1)])
    .range([0, width_3]);

var y_3 = d3.scaleLinear()
    .range([height_3*0.5, 0]);

var y1_3 = d3.scaleLinear().range([height_3,height_3*0.52]);
var color_3 = d3.scale.category10();

var xAxis_3 = d3.axisBottom(x_3)
    .tickFormat(d3.timeFormat("%Y"));

var yAxis_3 = d3.axisLeft(y_3);

var yAxis1_3 = d3.axisLeft(y1_3);



var line_3 = d3.svg.line()
//.interpolate("basis")
    .x(function(d) {
        return x_3(new Date(d.year,0,0));
    })
    .y(function(d) {
        return y_3(d.mean_temp);
    });
var line1_3 = d3.svg.line()
//.interpolate("basis")
    .x(function(d) {
        return x_3(new Date(d.year,0,0));
    })
    .y(function(d) {
        return y1_3(d.mean_temp);
    });

var svg_3 = d3.select(".chart_1").append("svg")
    .attr("width", width_3 + margin_3.left + margin_3.right)
    .attr("height", height_3 + margin_3.top + margin_3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_3.left + "," + margin_3.top + ")");

d3.csv("csv/rechauffement_clim.csv", function(error, data) {
    if (error) throw error;
    // mean changements c'est la moyenne de changement pour chaque année par rapport a GCAG et GISTEMP
    var table_3 = ["GCAG","GISTEMP","emission"];
    var means_changements_3 = table_3.map(function (name) {
        return{
            name : name,
            values:data.map(function (d) {
                //console.log(d);
                return{
                    year:Number(d.Year),
                    mean_temp : Number(d[name])
                }
            })
        }
    });

    //x.domain([1950,2050]);

    y_3.domain([
        -1.5,1.5
    ]);
    y1_3.domain([2000000,11300030]);
    svg_3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_3 + ")")
        .call(xAxis_3);

    svg_3.append("g")
        .attr("class", "y axis")
        .call(yAxis_3)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Annual Mean changement with celcuis");

    svg_3.append("g")
        .attr("class", "y axis")
        .call(yAxis1_3)



    var mean_changement_3 = svg_3.selectAll(".mean_changement3")
        .data(means_changements_3)
        .enter().append("g")
        .attr("class", "mean_changement3");


    mean_changement_3.append("path")
        .attr("class", "line3")
        .attr("d", function(d) {
            if(d.name === "emission") {
                return line1_3(d.values);
            }else{
                return line_3(d.values);
            }
        })
        .attr("fill","none")
        .style("stroke", function(d) {
            return color_3(d.name);
        });

    mean_changement_3.append("text")
        .datum(function(d) {
            return {
                name: d.name,
                value: d.values[0]
            };
        })
        .attr("x", 40)
        .attr("y", function (d,i) {
            return i*25;
        })
        .attr("fill",function (d) {
            console.log(color_3(d.name));
            return color_3(d.name)
        })
        .attr("id","legend")
        .text(function(d) {

            return d.name == "emission" ?"Co2 Emission":d.name;
        });

    var mouseG_3 = svg_3.append("g")
        .attr("class", "mouse-over-effects");


    // ici c'est la bar verticale qui s'affiche
    mouseG_3.append("path")
        .attr("class", "mouse-line3")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    // ici on recupère tous les graphes de line chart
    var lines_3 = document.getElementsByClassName('line3');

    var mousePerLine_3 = mouseG_3.selectAll('.mouse-per-line3')
        .data(means_changements_3)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line3");

    mousePerLine_3.append("circle")
        .attr("r", 8)
        .style("stroke", function(d) {
            return color_3(d.name);
        })
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

    mousePerLine_3.append("text")
        .attr("transform", function (d,i) {
            return "translate(" +10+","+(i*8)+")";
        });

    mouseG_3.append('svg:rect') // append a rect to catch mouse movements on canvas
        .attr('width', width_3) // can't catch mouse events on a g element
        .attr('height', height_3)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function() { // on mouse out hide line, circles and text
            d3.select(".mouse-line3")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line3 circle")
                .style("opacity", "0");
            d3.selectAll(".mouse-per-line3 text")
                .style("opacity", "0");
        })
        .on('mouseover', function() { // on mouse in show line, circles and text
            d3.select(".mouse-line3")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line3 circle")
                .style("opacity", "1");
            d3.selectAll(".mouse-per-line3 text")
                .style("opacity", "1");
        })
        .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line3")
                .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height_3;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                });
            d3.selectAll(".mouse-per-line3")
                .attr("transform", function(d, i) {

                    var beginning = 0,
                        end = lines_3[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines_3[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x < mouse[0]) beginning = target;
                        else if (pos.x > mouse[0]) end = target;
                        else break;
                    }

                    d3.select(this).select('text')
                        .text(function (){ if(d.name === "emission") return y1_3.invert(pos.y).toFixed(2);else return y_3.invert(pos.y).toFixed(2)});

                    return "translate(" + mouse[0] + "," + pos.y + ")";
                });
        });


});
