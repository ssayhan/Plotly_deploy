function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samplesArray= data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSamples= samplesArray.filter(data => data.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filterSamples[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).map(id => 'OTU' + id).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: " Top 10 Bacteria Cultures Found",
      titlefont: {"size":25},
      xaxis: {title: "Sample Value"}
      };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'BuRd'
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title:"OTU ID"},
      yaxis: {title:"Sample Value"},
      titlefont: {"size":25},
      hovermode: "closest"
    };

    console.log(bubbleLayout);

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
// Gauge Chart

    // Create a variable that holds the samples array. 
    // dropdown menu on the webpage
    var meta_Data = data.metadata;

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // filter the data for the object with desired sample
    var resultArray = meta_Data.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    //var filterSamples= samplesArray.filter(data => data.id == sample);


    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];
    console.log(result);

    // 3. Create a variable that holds the washing frequency.
    var wash_freg = result.wfreq;
  
    //console.log(meta_Data.map( d => d.wfreg))
    
    // Arrrange min max level for gauge chart
    var minfreq =  Math.max( ...meta_Data.map((d) => d.wfreq ));
    var maxfreq = Math.min(...meta_Data.map((d) => d.wfreq));
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash_freg,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [maxfreq, minfreq], tickwidth: 1},
        bar: {color: "red"},
        bgcolor: "white",
        borderwidth: 3,
        bordercolor:"silver",
        steps:[
          {range: [minfreq, minfreq+(maxfreq-minfreq)*0.33],
          color: "lightgreen" },
          {range: [minfreq + ( maxfreq - minfreq) * 0.33,
          minfreq + (maxfreq - minfreq) * 0.66],
          color: "green" },
          {range: [minfreq + (maxfreq-minfreq)*0.66, maxfreq],
          color:"orange"}
        ], 
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      titlefont: {"size": 25}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}