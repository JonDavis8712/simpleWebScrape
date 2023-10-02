const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// This allows you to serve static assets (CSS, JavaScript, Images, etc.)
app.use(express.static('public'))

// URL to an article about companies that will let you work from home and are hiring now via a flexjobs report.
const url = 'https://www.cnbc.com/2023/01/09/companies-that-will-let-you-work-from-home-and-are-hiring-now-flexjobs-report.html';

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    // This finds the <p> tag element that contains "Remote jobs" and its sibling <p> elements
    const remoteJobsElement = $('p:contains("Remote jobs")');
    
    // This part of the code extracts and filters job titles from the text found in the <p> element
    const jobTitles = remoteJobsElement.map((index, element) => { // Iterate through each element in remoteJobsElement
      const text = $(element).text(); // Get the text of the <p> element, utilizing cheerio
      const jobTitleMatches = text.match(/Remote jobs: (.+)$/); // Check if the text contains "Remote jobs", and if so, return the job title
      return jobTitleMatches ? jobTitleMatches[1] : null; // This line checks if jobTitleMatches is not null.
    }).get().filter(Boolean); // This line filters out null values from the jobTitles array, to convert the result back to a standard JavaScript array.

    console.log('Job Titles:', jobTitles); // Log the results from the Article, to show a list of all remote job titles.
    app.get('/jobTitles', (req, res) => {
        res.render('jobTitles', { jobTitles });
    })

  })
  .catch((error) => {
    console.log(error);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
