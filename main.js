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
  date: "mm/dd/yyyy",
  new: 0,
  staffOut: 0,
  volOut: 0,
  staffWork: 0,
  tested: 0,
  comment: null,
  ppe: null,
  info: null,

  // functions
  timeFormat: d3.timeFormat("%B %d, %Y"),
  parseTime: d3.timeParse("%Y-%m-%d"),

  // Organization Info
  cityName: "Exampleville, CA",
  orgName: "Exampleville Department of Health",
  orgAbbrev: "EDH",
  orgPhone: "555-555-5555",
  orgEmail: "exampleville@email.com"
};


/* DATA SOURCES */

// URL of Google Apps script to get form data
let scriptURL = "https://script.google.com/macros/s/AKfycbwaZWG2T8NDItYRzcUO-WKlgfczOxfxdnYzonzvhKGNkWJp7rc/exec";

// Name of form object in HTML
let form = document.forms["submitToGoogleSheet"];

// URL of Google Sheet with facility names
let sourceURL = "https://docs.google.com/spreadsheets/d/1ig335662dQcrn20eKKKDfBMjI54Rog9coMIQ9jrd2XE/edit#gid=2091058387";



/* INITIALIZE APP AND LOAD DATA */

function init() {
  // Initialize Tabletop.js with data source URL and callback function
  Tabletop.init({
    key: sourceURL,
    callback: loadData,
    simpleSheet: true,
    header: false
  })
  
  // Replace custom city and org information
  d3.selectAll(".city-name").text(state.cityName)
  d3.selectAll(".org-name").text(state.orgName)
  d3.selectAll(".org-abbrev").text(state.orgAbbrev)
  d3.selectAll(".org-phone").text(state.orgPhone)
  d3.selectAll(".org-email").text(state.orgEmail)
}

// Callback function for Tabletop.js
function loadData(data, tabletop) {
  // Load facility names data
  state.facilityList = d3.map(data, d => d.Values).keys().sort();
  state.facilityList.unshift(["Select a Facility"], ["Other (My Facility Is Not Listed Here)"])
  
  // Once data is loaded, unhide the form fields and call the app
  d3.select("#form-wrapper").classed("hide", false)
  app();
}

init();



/* APP FUNCTIONS */

// Toggle showing 'Other Facility' fields
function toggleFields(){
  if (state.facility == "Other (My Facility Is Not Listed Here)") {
    d3.select("#other-facility-info")
      .classed('hide', false);
  } else if (state.facility != "Other (My Facility Is Not Listed Here)") {
    d3.select("#other-facility-info")
    .classed('hide', true);
  }
}

// Check the state of the submit button
// Require entering a facility name and reporting date to enable
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

// Submit form data to Google Sheets
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

        d3.select(".success-wrapper")
        .classed('hide', true),

        d3.select(".success-message")
          .html("<i class='fas fa-check' style='color: var(--main-color);'></i> <br> <b> Thank you for reporting data for " + state.facility + "! <br><br> The " + state.orgName + " will contact you within 24 hours of noticing a trend that requires follow-up. If you have immediate concerns, please reach out to " + state.orgPhone + " or " + state.orgEmail + ".</b><br><br> <div class='submit-again-container'><a class='submit-again' href='https://builtforzero.github.io/cas-submission-tool/'>SUBMIT ANOTHER RESPONSE</a></div>")
          .style("opacity", "0")
          .transition()
          .duration(1000)
          .style("opacity", "1")

          )

      .catch((error) => 
        console.error("Error!", error.message),
        
        );
  });
}


/* APP */

function app() {

  submitData(scriptURL, form);
  buttonState();

  let facilityName = d3.selectAll("#facility-value")
  let reportedDate = d3.selectAll("#date-value")

  // Add facility names to dropdown
  let selectCommunity = d3
    .select("#facility-dropdown")
    .selectAll("option")
    .data(state.facilityList)
    .join("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Update chosen facility from dropdown
  let facilityInput = d3
    .select("#facility-dropdown")
    .on("change", function() {
      state.facility = this.value;
      toggleFields();
      facilityName.text(this.value);
    })

  // Event listener on 'Other Facility' fields
  let otherFacilityInput = d3
    .select("#otherName-input")
    .on("change", function() {
      state.facility = this.value;
      state.otherName = this.value;
      facilityName.text(this.value);
      console.log(state)
      buttonState();
    })

  // Event listener on reported date field
  let dateInput = d3
    .select("#date-input")
    .on("change", function() {
      state.date = state.timeFormat(state.parseTime(this.value));
      reportedDate.text(state.timeFormat(state.parseTime(this.value)));
      buttonState();
    })

}