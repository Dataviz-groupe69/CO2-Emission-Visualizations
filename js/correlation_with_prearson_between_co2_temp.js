var margin_1 = {top: 5, right: 5, bottom: 50, left: 50},

    width_1 = 800 - margin_1.left - margin_1.right,
    height_1 = 600 - margin_1.top - margin_1.bottom;

var svg1 = d3.select(".chart").append("svg")
    .attr("width", width_1 + margin_1.left + margin_1.right)
    .attr("height", height_1 + margin_1.top + margin_1.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_1.left + "," + margin_1.top + ")");

var x_1 = d3.scaleLinear()
    .range([10,width_1*0.7]);

var y_1 = d3.scaleLinear()
    .range([height_1*0.7,0]);

var xAxis_1 = d3.axisBottom()
    .scale(x_1);

var yAxis_1 = d3.axisLeft()
    .scale(y_1);

d3.csv("csv/rechauffement_clim_normalized.csv", types, function(error, data){

    y_1.domain(d3.extent(data, function(d){ return d.y}));
    x_1.domain(d3.extent(data, function(d){ return d.x}));

    // see below for an explanation of the calcLinear function
    var lg = calcLinear(data, "x", "y", d3.min(data, function(d){ return d.x}), d3.min(data, function(d){ return 3}));


    svg1.append("line")
        .attr("class", "regression")
        .attr("x1", x_1(lg.ptA.x))
        .attr("y1", y_1(lg.ptA.y))
        .attr("x2", x_1(lg.ptB.x))
        .attr("y2", y_1(lg.ptB.y))

        .on("mouseover", function(d){
            svg1.selectAll("#mouseOverValue").data([d]).enter().append("text")
                .attr("id", "mouseOverValue")
                .text("Correlation de Pearson : 0.9095")
                .attr("x", d3.mouse(this)[0]+20)
                .attr("y", d3.mouse(this)[1]+20)
                .style("font-size", "15px");

        })

        .on("mouseout", function(d){
            svg1.selectAll("#mouseOverValue").remove();

        });

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_1*0.7 + ")")
        .call(xAxis_1)


    svg1.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(10,0)")
        .call(yAxis_1)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", ".15em");



    svg1.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 3)
        .attr("cy", function(d){ return y_1(d.y); })
        .attr("cx", function(d){ return x_1(d.x); })
        .attr("fill", "blue");


});

function types(d){
    d.x = +d.x;
    d.y = +d.y;

    return d;
}



function calcLinear(data, x, y, minX, minY){

    var n = data.length;

    var pts = [];
    data.forEach(function(d,i){
        var obj = {};
        obj.x = d[x];
        obj.y = d[y];
        obj.mult = obj.x*obj.y;
        pts.push(obj);
    });

    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;
    pts.forEach(function(pt){
        sum = sum + pt.mult;
        xSum = xSum + pt.x;
        ySum = ySum + pt.y;
        sumSq = sumSq + (pt.x * pt.x);
    });
    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;


    var m = (a - b) / (c - d);

    var e = ySum;

    var f = m * xSum;


    var b = (e - f) / n;

    return {
        ptA : {
            x: minX,
            y: m * minX + b
        },
        ptB : {
            x: (minY - b) / m,
            y: minY

        }
    }

}