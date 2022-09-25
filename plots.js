// specify the bbb dataset url
const bbb_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// define the demographic elements
let demographic_id = d3.select("#demographic_id");
let demographic_ethnicity = d3.select("#demographic_ethnicity");
let demographic_gender = d3.select("#demographic_gender");
let demographic_age = d3.select("#demographic_age");
let demographic_location = d3.select("#demographic_location");
let demographic_bbtype = d3.select("#demographic_bbtype");
let demographic_wfreq = d3.select("#demographic_wfreq");

// asynchronously bring in the data
d3.json(bbb_url).then(function(data)
{
    // log the incoming data
    console.log(data);

    // store the incoming data into objects
    let data_metadata = Object.values(data.metadata);
    let data_ids = Object.values(data.names);
    let data_samples = Object.values(data.samples);

    // add the retrieved ids to the data selector
    d3.select("#data_selector")
        .selectAll("myOptions")
        .data(data_ids)
        .enter()
        .append("option")
        .text(x => x)
        .attr("value", x => x);

    // define the selection change event
    d3.select("#data_selector").on("change", GetData);

    // define the initialization function
    function init()
    {
        // specify placeholder data
        let initial_dataset = data_samples[0];

        // define the bar data object
        let bar_trace = {
            x: initial_dataset.sample_values.slice(0, 10).reverse(),
            y: initial_dataset.otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse(),
            text: initial_dataset.otu_labels.slice(0, 10).reverse(),
            name: "top_ten_otus",
            type: "bar",
            orientation: "h"};
        
        // define the gauge data object
        let gauge_trace = {
            domain: { x: [0, 1], y: [0, 1]},
            value: data_metadata.filter(x => x.id == initial_dataset.id)[0].wfreq,
            type: "indicator",
            mode: "gauge+number+delta",
            delta: { reference: 1 },
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 4.5], color: "lightgray" },
                    { range: [4.5, 0], color: "gray" }],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 8.9}}};

        // define the bubble data object
        let bubble_trace = {
            x: initial_dataset.otu_ids,
            y: initial_dataset.sample_values,
            text: initial_dataset.otu_labels,
            name: "otu_sample_distribution",
            mode: "markers",
            type: "bubble",
            marker: {
                colorscale: "Earth",
                size: initial_dataset.sample_values,
                color: initial_dataset.otu_ids}};

        // store the traces in arrays
        let bar_traceData = [bar_trace];
        let gauge_traceData = [gauge_trace];
        let bubble_traceData = [bubble_trace];
        
        // define the layouts
        let bar_layout = {
            margin: {
                l: 60,
                r: 25,
                t: 25,
                b: 25}};
        let gauge_layout = {
            margin: {
                l: 25,
                r: 25,
                t: 25,
                b: 25}};
        let bubble_layout = {
            margin: {
                l: 75,
                r: 25,
                t: 25,
                b: 75}};
        
        // initialize the plots
        Plotly.newPlot("bar", bar_traceData, bar_layout);
        Plotly.newPlot("gauge", gauge_traceData, gauge_layout);
        Plotly.newPlot("bubble", bubble_traceData, bubble_layout);

        // retrieve the current demographic data
        let currentID = initial_dataset.id;
        let demographic_data = data_metadata.filter(x => x.id == currentID)[0];

        // set the demographic info
        demographic_id.text(`${demographic_data.id}`);
        demographic_ethnicity.text(`${demographic_data.ethnicity}`);
        demographic_gender.text(`${demographic_data.gender}`);
        demographic_age.text(`${demographic_data.age}`);
        demographic_location.text(`${demographic_data.location}`);
        demographic_bbtype.text(`${demographic_data.bbtype}`);
        demographic_wfreq.text(`${demographic_data.wfreq}`);
    }

    // define the data assignment function
    function GetData()
    {
        // define the data selector
        let data_selector = d3.select("#data_selector");

        // get the selected data
        let dataset_id = data_selector.property("value");

        // filter the samples down to the selected id
        let dataset = data_samples.filter(x => x.id == dataset_id)[0];
        let metadata = data_metadata.filter(x => x.id == dataset_id)[0];

        // update the bar plot
        Plotly.restyle("bar", "x", [dataset.sample_values.slice(0, 10).reverse()]);
        Plotly.restyle("bar", "y", [dataset.otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse()]);
        Plotly.restyle("bar", "text", [dataset.otu_labels.slice(0, 10).reverse()]);

        // update the gauge plot
        Plotly.restyle("gauge", "value", [metadata.wfreq]);

        // update the bubble plot
        Plotly.restyle("bubble", "x", [dataset.otu_ids]);
        Plotly.restyle("bubble", "y", [dataset.sample_values]);
        Plotly.restyle("bubble", "text", [dataset.otu_labels]);
        Plotly.restyle("bubble", "marker", [{colorscale: "Earth",
                                            size: dataset.sample_values,
                                            color: dataset.otu_ids}]);
        
        // update the demographic info
        demographic_id.text(`${metadata.id}`);
        demographic_ethnicity.text(`${metadata.ethnicity}`);
        demographic_gender.text(`${metadata.gender}`);
        demographic_age.text(`${metadata.age}`);
        demographic_location.text(`${metadata.location}`);
        demographic_bbtype.text(`${metadata.bbtype}`);
        demographic_wfreq.text(`${metadata.wfreq}`);
    }
    init();
});