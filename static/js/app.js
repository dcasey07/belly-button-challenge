// Define the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set a variable for checking console data
var data_1;

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);

  // Copy data to the variable set outside of the then function
  data_1 = data;

  // Bar Chart
  // Create a function to update the bar chart and display it
  function updateBar(sample) {
    var samples = data.samples;
    var resultArray = samples.filter(s => s.id === sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var top10 = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Set the parameters for the horizontal bar chart
    var barTrace = [
      {
        y: top10,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    var barLayout = {
      margin: {t:10, l:90}
    };

    // Link the plot to the html
    Plotly.newPlot("bar", barTrace, barLayout);
  }

  // Display the first Subject ID info by default
  updateBar(data.names[0]);

  // Bubble Chart
  // Create a function to update the bubble chart and display it
  function updateBubble(sample) {
    var samples = data.samples;
    var resultArray = samples.filter(s => s.id == sample);
    var result = resultArray[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var bubbleTrace = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      }
    ];
    var bubbleLayout = {
      margin: {t:0},
      xaxis: {title:"OTU ID"},
      margin: {t:30}
    };

    // Link the plot to the html
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
  }

  // Display the first Subject ID info by default
  updateBubble(data.names[0]);


  // Demographic Info Table
  // Create a function to update the demographic information table as display it
  function updateDemo(sample) {
    var metadata = data.metadata;
    var resultArray = metadata.filter(s => s.id == sample);
    var result = resultArray[0];

    // Create a variable that links to the html
    var table = d3.select("#sample-metadata");

    // Use the variable to clear any existing metadata 
    table.selectAll("*").remove();

    // Append the panel with each key and value pair in the metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  }

  // Display the first Subject ID info by default
  updateDemo(data.names[0]);

  // Subject ID Dropdown Menu
  // Populate a dropdown menu with all the Subject ID numbers
  var dropdownMenu = d3.select("#selDataset");
  data.names.forEach(function(name) {
    dropdownMenu.append("option").text(name).property("value", name);
  });  

  // Trigger updated data visualizations when a Subject ID is selected from the dropdown
  d3.select("#selDataset").on("change", function() {
    var updatedSample = d3.select(this).property("value");
    updateBar(updatedSample);
    updateBubble(updatedSample);
    updateDemo(updatedSample);
  });

});




