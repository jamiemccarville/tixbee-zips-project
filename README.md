# Tixbee Zips Project

## Overview

This was one of the projects that I worked on during my internship with Tixbee from March - May 2020.  This was a page that was part of a larger app built with Laravel and Vue.js.  

### User Story

The idea with this page is that a user should be able to select a date range and then generate some charts that show the zip codes from all customers for the selected dates.  There are three charts, 2 donut graphs and a table, each representing the data slightly differently.

### Behind the Scenes

When a user selects a date range, the dates selected should be used to generate a database query.  The information returned in the response from the database should be used to generate the charts.

### Implementation

#### Vue.js

- pulled in a date picker component

  - used v-model to bind the output from the date picker to a data property

  - used computed properties to format the dates from the date picker to be used in an axios request


- used an async function to:
  - validate that a date range has been selected

    - display message if no date range selected

    - message removed if function called with range selected

  - start the loading animation while awaiting axios call
  
  - make an axios put request to send the date range to Laravel

  - assign the response data from the axios call to a data property

  - display message if there is no data for dates selected

  - if there is data, call the chart building function to generate the charts

There should be 3 charts displayed on the screen.

#### Laravel

- create a route in web.php that handles the axios call and fires a method in ZipsController.php

- the 

