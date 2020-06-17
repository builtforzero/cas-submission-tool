# **COVID-19 Alert System (CAS)**

A lightweight, customizable tool for a facility to submit a daily report on the number of individuals who show symptoms (or have been tested) for COVID-19. The facility can also request PPE equipment, signal needs, and get support.

## [View an example of the tool here.](https://builtforzero.github.io/cas-submission-tool/)

This tool is based on the Symptom Alert System for Shelters (SASS) developed by the [Minnesota Heading Home Alliance](https://headinghomealliance.com/symptom-alert-system-for-shelters-sass/).


<br />

----- 

<br />


## **A. How does it work?**

1. A community interested in using the tool


<br />

----- 

<br />

## **B. Set up your own version of the tool**

1. Fork [this GitHub repository](https://github.com/builtforzero/cas-submission-tool). Then, clone the repository onto your desktop. [Read more about setting up a fork here.](https://help.github.com/en/github/getting-started-with-github/fork-a-repo)

2. Open [this Google Sheet](https://docs.google.com/spreadsheets/d/1ig335662dQcrn20eKKKDfBMjI54Rog9coMIQ9jrd2XE/edit?usp=sharing). Go to **File > Make a Copy** to save a copy of the workbook in your own Google Drive, and rename it if needed. The workbook has two sheets:

    - **Web App Data**: Behind the scenes, a Google Apps Script (viewable by going to **Tools > Script Editor**) takes form responses from the web app and writes them to this sheet. The names of the columns on this sheet should not be edited (although the columns can be moved around).

    - **Facility Names**: Edit the names of facilities

3. Set up the backend sheet to accept form responses and 