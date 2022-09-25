// specify the bbb dataset url
const bbb_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// asynchronously bring in the data
d3.json(bbb_url).then(function(data)
{
    // log the incoming data
    console.log(data);

    // store the name data into an object
    let data_ids = Object.values(data.names);

    // store the sample data into an object
    let data_samples = Object.values(data.samples);

    // add the retrieved ids to the data selector
    d3.select("#data_selector")
        .selectAll("myOptions")
        .data(data_ids)
        .enter()
        .append("option")
        .text(x => `User ID: ${x}`)
        .attr("value", x => x);

    // define the selection change event
    d3.select("#data_selector").on("change", GetData);

    // define the initialization function
    function init()
    {
        // specify placeholder data
        let placeholder_dataset = data_samples[0];

        // define the placeholder data object
        let placeholder_trace = {
            x: placeholder_dataset.sample_values.slice(0, 10).reverse(),
            y: placeholder_dataset.otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse(),
            text: placeholder_dataset.otu_labels.slice(0, 10).reverse(),
            name: "top_ten_data_entries",
            type: "bar",
            orientation: "h"};
        
        let traceData = [placeholder_trace];

        // define the layout
        let layout = {
            title: "Top Ten Data Entries",
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 75}};

        // create the horizontal bar chart
        Plotly.newPlot("bar", traceData, layout);
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
        
        // update the horizontal bar plot
        Plotly.restyle("bar", "x", [dataset.sample_values.slice(0, 10).reverse()]);
        Plotly.restyle("bar", "y", [dataset.otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse()]);
        Plotly.restyle("bar", "text", [dataset.otu_labels.slice(0, 10).reverse()]);
    }
    init();
});