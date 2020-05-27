# Tixbee Zips Project

## Overview

This was one of the projects that I worked on during my internship with Tixbee from March - May 2020.  This was a page that was part of a larger app built with Laravel and Vue.js.  

### User Story

On this page a user should be able to select a date range and then generate some charts that show the zip codes from all customers for the selected dates.  There are three charts, 2 donut graphs and a table, each representing the data slightly differently.

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

- pulled in Google charts component to display the graphs

  - the charts require the information to be formatted in a specific way, so I used computed properties to manipulate the response data into the format required for the charts.

There should be 3 charts displayed on the screen.

#### Laravel

- create a route in web.php that handles the axios call and fires a method in ZipsController.php

- the dates method receives the start and end dates and assigns them to variables.  These variables are used to make the database query, with the start and end of day times added accordingly.  
  
- The data returned from the database is sent back as the response.

#### Heroku

I used Heroku to host the app.  We used dummy data to populate the zips table in the database.  I exported the table from the database we used for the project and imported it to my own Google Cloud SQL database. I used it for local development while putting the app together.
  
Once I created the Heroku app, it was easier to add a Heroku Postgres database to the app than to connect to the Google SQL database.  When I added the Heroku database, the DATABASE_URL config var was added automatically to my HEROKU app.  I just had to go into database.php and change the default to pgsql.  Once that change was made, I was able to connect to the database.

You can check out the app at https://vast-falls-57882.herokuapp.com/