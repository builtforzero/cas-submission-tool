/* STATE */
let state = {
  // Google Sheets data
  facilityList: null,

  // Form data
  facility: null,
  otherName: null,
  name: null,
  phone: null,
  email: null,
  date: null,
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
};


/* SUBMIT DATA TO GOOGLE SHEETS */
let scriptURL = "https://script.google.com/macros/s/AKfycbwaZWG2T8NDItYRzcUO-WKlgfczOxfxdnYzonzvhKGNkWJp7rc/exec";
let form = document.forms["submitToGoogleSheet"];
function submitData(scriptURL, form) {
  form.addEventListener("submit", (e) => {
    console.log("Submitting Data!");
    e.preventDefault();
    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
      })
      .then((response) => console.log("Success!", response))
      .catch((error) => console.error("Error!", error.message));
  });
}


/* LOAD GOOGLE SHEETS DATA */
// Initialize Tabletop.js with data source URL and callback function
let docURL = "https://docs.google.com/spreadsheets/d/1DPQURKRfsfkJEhroeEoXbESJw4nzKJ6s0Et0NO62SK4/edit#gid=0";
function init() {
  Tabletop.init({
    key: docURL,
    callback: loadData,
    simpleSheet: true
  })
}
// Assign Google Sheets data to state, then call the app
function loadData(data, tabletop) {
  state.facilityList = data.flat();
  console.log(state.facilityList);
  app();
}


init();


/* APP */

function app() {
  // Submit form data to Google Sheets
  submitData(scriptURL, form);
}