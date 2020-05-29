/* STATE */
let state = {
  // Google Sheets data
  facilityList: [],

  // Form data
  facility: "Select a Facility",
  otherName: "",
  name: null,
  phone: null,
  email: null,
  date: "",
  new: 0,
  staffOut: 0,
  volOut: 0,
  staffWork: 0,
  tested: 0,
  comment: null,
  ppe: null,
  info: null,

  // functions
  format: d3.format(","),
  timeFormat: d3.timeFormat("%B %d, %Y"),
};


/* SUBMIT DATA TO GOOGLE SHEETS */
let scriptURL = "https://script.google.com/macros/s/AKfycbwaZWG2T8NDItYRzcUO-WKlgfczOxfxdnYzonzvhKGNkWJp7rc/exec";
let form = document.forms["submitToGoogleSheet"];

d3.select(".loader")

function submitData(scriptURL, form) {
  form.addEventListener("submit", (e) => {
    console.log("Submitting Data!");
    e.preventDefault();
    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
      })
      .then((response) => 
        console.log("Success!", response),

        d3.select(".submit-text")
          .classed('hide', false)
          .text("")
          .html("<i class='fas fa-check'></i>")
          .style("opacity", "0")
          .transition()
          .duration(1000)
          .style("opacity", "1")
          .transition()
          .duration(500)
          .style("opacity", "0")
          .transition()
          .duration(500)
          .style("opacity", "1")
          .text("SUBMIT"),

        d3.select(".success-message")
          .text("Successfully submitted data for " + state.facility)
          .style("opacity", "0")
          .transition()
          .duration(1000)
          .style("opacity", "1")
          .transition()
          .duration(1000)
          .style("opacity", "0"),

          )

      .catch((error) => 
        console.error("Error!", error.message),
        
        );
  });
}


/* LOAD GOOGLE SHEETS DATA */
// Initialize Tabletop.js with data source URL and callback function
let docURL = "https://docs.google.com/spreadsheets/d/1DPQURKRfsfkJEhroeEoXbESJw4nzKJ6s0Et0NO62SK4/edit#gid=0";
function init() {
  Tabletop.init({
    key: docURL,
    callback: loadData,
    simpleSheet: true,
    header: false
  })
}
// Assign Google Sheets data to state, then call the app
function loadData(data, tabletop) {
  state.facilityList = d3.map(data, d => d.Values).keys().sort();
  state.facilityList.unshift(["Select a Facility"], ["Other (My Facility Is Not Listed Here)"])
  d3.select("#form-wrapper").classed("hide", false)
  app();
}



function toggleFields(){
  if (state.facility == "Other (My Facility Is Not Listed Here)") {
    d3.select("#other-facility-info")
      .classed('hide', false);
  } else if (state.facility != "Other (My Facility Is Not Listed Here)") {
    d3.select("#other-facility-info")
    .classed('hide', true);
  }
}


function buttonState() {
  if (
    state.facility === "Select a Facility" || state.date === "" || (state.facility == "Other (My Facility Is Not Listed Here)" && state.otherName == "")
  ) {
    d3.select("#submit-button")
      .attr("disabled", "true")
      .attr("style", "background-color: rgb(211, 211, 211); border: 2px solid rgb(211, 211, 211); color: white;");
    d3.select(".success-message").text(
      "Please enter a facility name and reporting date to continue."
    );
  } else if (
    (state.community != "Select a Facility" && state.population != "") || (state.facility == "Other (My Facility Is Not Listed Here)" && state.otherName != "" && state.population != "")
  ) {
    d3.select("#submit-button").attr("disabled", null).attr("style", "");
    d3.select(".success-message").text("");
  }
}

init();

/* APP */

function app() {
  // Submit form data to Google Sheets
  submitData(scriptURL, form);
  buttonState();

  let facilityName = d3.selectAll("#facility-value")
  let reportedDate = d3.selectAll("#date-value")

  let selectCommunity = d3
    .select("#facility-dropdown")
    .selectAll("option")
    .data(state.facilityList)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d);

  let facilityInput = d3
    .select("#facility-dropdown")
    .on("change", function() {
      state.facility = this.value;
      toggleFields();
      facilityName.text(this.value);
    })

  let otherFacilityInput = d3
    .select("#otherName-input")
    .on("change", function() {
      state.facility = this.value;
      state.otherName = this.value;
      facilityName.text(this.value);
      console.log(state)
      buttonState();
    })

  let dateInput = d3
    .select("#date-input")
    .on("change", function() {
      state.date = this.value;
      reportedDate.text(this.value);
      buttonState();
    })

}