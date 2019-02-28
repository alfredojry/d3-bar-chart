document.addEventListener('DOMContentLoaded', function () {});

// Getting JSON with the JavaScript XMLHttpRequest method

req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function() {
  json = JSON.parse(req.responseText);
  let dataset = [...json.data]
  // Setting SVG
  const w = 950;
  const h = 400;
  const svg = d3.select('body')
                .append('svg')
                .attr('width', w)
                .attr('height', h);
  const padding = 50;
  
  const settingDate = item => new Date(item);
  
  // Define the div for the tooltip
  let tooltip = d3.select('body')
                  .append('div')
                  .attr('class', 'div-tooltip')
                  .style('opacity', 0);
  
  const xScale = d3.scaleTime()
                   .domain([d3.min(dataset, d => settingDate(d[0])), d3.max(dataset, d => settingDate(d[0]))])
                   .range([0, w - 2 * padding]);
  
  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(dataset, d => d[1])])
                   .range([padding, h - padding]);
  
  const yAxisScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, d => d[1])])
                       .range([h - padding, padding]);

  
  const quarter = function (date) {
    let [year, month, day] = date.split('-');
    switch (month) {
      case '01':
        return year + ' Q1';
      case '04':
        return year + ' Q2';
      case '07':
        return year + ' Q3';
      case '10':
        return year + ' Q4';
    }
  }
  svg.selectAll('rect')
     .data(dataset)
     .enter()
     .append('rect')
     .attr('width', 3)
     .attr('height', d => yScale(d[1]) - padding)
     .attr('x', (d, i) => padding + xScale(settingDate(d[0])))
     .attr('y', d => h - yScale(d[1]))
     .attr('fill', 'Lime')
     .attr('class', 'bar')
     .attr('data-date', d => d[0])
     .attr('data-gdp', d => d[1])
     .on('mouseover', d => {
                              tooltip.attr('id', 'tooltip')
                                     .attr('data-date', d[0])
                                     .transition()
                                     .duration(200)
                                     .style('opacity', 0.9);
                              tooltip.html(quarter(d[0]) + '<br>$' + Math.round(d[1]) + ' Billion')
                                     .style('left', (d3.event.pageX + 15) + 'px')
                                     .style('top', d3.event.pageY + 'px');
                            })
     .on('mouseout', d => {
                            tooltip.transition()
                                   .duration(200)
                                   .style('opacity', 0);
                          });
  
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yAxisScale);
  
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', 'translate(' + padding + ',' + (h - padding) + ')')
     .call(xAxis);
  
  svg.append('g')
     .attr('id', 'y-axis')
     .attr('transform', 'translate(' + padding + ', 0)')
     .call(yAxis);
  
  d3.select('svg')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -180)
    .attr('y', 80)
    .attr('class', 'text-axis')
    .text('GDP USD Billion');
}