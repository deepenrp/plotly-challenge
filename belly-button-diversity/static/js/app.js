
function buildMetadata(sample) {

  // The following function builds the metadata panel

    var metadata_url = "/metadata/" + sample;

    var metadata = d3.select("#sample-metadata");
    metadata.html("");

    d3.json(metadata_url).then(function(sample){

      Object.entries(sample).forEach(([key, value]) => {
        console.log(key,value);
        metadata.append("h6").text(`${key.toUpperCase()}:- ${value}`);
      });
    });


    d3.json(metadata_url).then(function(data){

      var wash_freq = data.WFREQ;
      console.log(wash_freq);

      var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: { text: "Belly Button Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number+range",
        gauge: {
          axis: { range: [0, 10] },
          bar: {color: "darkblue"},
          steps: [
            { range: [0, 1], color: "rgb(204,214,204)" },
            { range: [1, 2], color: "rgb(186,206,186)" },
            { range: [2, 3], color: "rgb(168,199,168)" },
            { range: [3, 4], color: "rgb(150,191,150)" },
            { range: [4, 5], color: "rgb(132,184,132)" },
            { range: [5, 6], color: "rgb(114,176,114)" },
            { range: [6, 7], color: "rgb(96,168,96)" },
            { range: [7, 8], color: "rgb(78,161,78)" },
            { range: [8, 9], color: "rgb(60,153,60)" },
            { range: [9, 10], color: "rgb(42,146,42)" }
          ],
          }
      }
      ];

    var layout = { width: 400, height: 300, margin: { t: 1, b: 1 } };

    Plotly.newPlot('gauge', data, layout);

  });

}


function buildCharts(sample) {

  var sample_url = "/samples/" + sample;

  // Pie Chart using the sample data

  d3.json(sample_url).then(function(data) {

    var sample_values = data.sample_values.slice(0,10);
    console.log(sample_values);
    var otu_labels = data.otu_labels.slice(0,10);
    console.log(otu_labels);
    var otu_ids = data.otu_ids.slice(0,10);
    console.log(otu_ids);

    var data = [{
      values: sample_values,
      labels: otu_ids,
      hovertext: otu_labels,
      type: 'pie'
    }];

    var layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', data, layout);

    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  // Bubble Chart using the sample data

  d3.json(sample_url).then(function(data){
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;
    var size = data.sample_values;
    var colors =  data.otu_ids;
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {color: colors,
              opacity: colors,
                size: size}
      };
    var data = [trace1];
    var layout = {
      xaxis: {title: "OTU ID"}
      };

    Plotly.newPlot('bubble', data, layout);

    });





}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    // console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option", sample)
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
