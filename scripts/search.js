/**
 * A simple JSON search
 * Requires jQuery (v 1.7+)
 *
 * @author   Mat Hayward - Erskine Design
 * @author   Rishikesh Darandale <Rishikesh.Darandale@gmail.com>
 * @version  1.1
 */

 /* ==========================================================================
    Initialisation
    ========================================================================== */

var q, jsonFeedUrl = "/feeds/feed.json",
  $searchForm = $("[data-search-form]"),
  $searchInput = $("[data-search-input]"),
  $resultTemplate = $("#search-result"),
  $resultsPlaceholder = $("[data-search-results]"),
  $foundContainer = $("[data-search-found]"),
  $foundTerm = $("[data-search-found-term]"),
  $foundCount = $("[data-search-found-count]"),
  allowEmpty = true,
  showLoader = true,
  loadingClass = "is--loading",
  indexVar;


$(document).ready( function() {
  // hide items found string
  $foundContainer.hide();
  // initiate search functionality
  initSearch();
});

 /* ==========================================================================
    Search functions
    ========================================================================== */

/**
 * Initiate search functionality.
 * Shows results based on querystring if present.
 * Binds search function to form submission.
 */
function initSearch() {
  if(!sessionStorage.getItem("lunrIndex")) {
    // get the data
    getData();
  } else {
    // Get search results if q parameter is set in querystring
    if (getParameterByName('q')) {
      q = decodeURIComponent(getParameterByName('q'));
      $searchInput.val(q);
      execSearch(q);
    }
  }

  // Get search results on submission of form
  $(document).on("submit", $searchForm, function(e) {
    e.preventDefault();
    q = $searchInput.val();
    execSearch(q);
  });
}

/**
 * Get the JSON data
 * Get the generated feeds/feed.json file so lunr.js can search it locally.
 * Store the index in sessionStorage
 */
function getData(indexVar) {
  jqxhr = $.getJSON(jsonFeedUrl)
    .done(function(loaded_data){
      // save the actual data as well
      sessionStorage.setItem("actualData", JSON.stringify(loaded_data));
      // set the index fields
      indexVar = lunr(function () {
        this.field('id');
        this.field('title');
        this.field('content', { boost: 10 });
        this.field('author');
        loaded_data.forEach(function (doc, index) {
          if ( doc.search_omit != "true" ) {
            console.log("adding to index: " + doc.title);
            this.add($.extend({ "id": index }, doc));
          }
        }, this)
      });
      // store the index in sessionStorage
      sessionStorage.setItem("lunrIndex", JSON.stringify(indexVar));
      // Get search results if q parameter is set in querystring
      if (getParameterByName('q')) {
        q = decodeURIComponent(getParameterByName('q'));
        $searchInput.val(q);
        execSearch(q);
      }
    })
    .fail( function() {
      console.log("get json failed...");
    })
    .always( function() {
      console.log("finally...");
    });
}

/**
 * Get the search result from lunr
 * @param {String} q
 * @returns search results
 */
function getResults(q) {
  var savedIndexData = JSON.parse(sessionStorage.getItem("lunrIndex"));
  console.log("Indexed var from sessionStorage: " + savedIndexData);
  return lunr.Index.load(savedIndexData).search(q);
}

/**
 * Executes search
 * @param {String} q
 * @return null
 */
function execSearch(q) {
  if (q != '' || allowEmpty) {
    if (showLoader) {
      toggleLoadingClass();
    }
    processResultData(getResults(q));
  }
}

/**
 * Toggles loading class on results and found string
 * @return null
 */
function toggleLoadingClass() {
  $resultsPlaceholder.toggleClass(loadingClass);
  $foundContainer.toggleClass(loadingClass);
}

/**
 * Process search result data
 * @return null
 */
function processResultData(searchResults) {
  $results = [];

  console.log("Search Results: " + searchResults);
  var resultsCount = 0,
      results = "";

  // Iterate over the results
  searchResults.forEach(function(result) {
    var loaded_data = JSON.parse(sessionStorage.getItem("actualData"));
    var item = loaded_data[result.ref];
    var result = populateResultContent($resultTemplate.html(), item);
        resultsCount++;
        results += result;
  });


  if (showLoader) {
    toggleLoadingClass();
  }

  populateResultsString(resultsCount);
  showSearchResults(results);
}

/**
 * Add search results to placeholder
 * @param {String} results
 * @return null
 */
function showSearchResults(results) {
  // Add results HTML to placeholder
  $resultsPlaceholder.html(results);
}

/**
 * Add results content to item template
 * @param {String} html
 * @param {object} item
 * @return {String} Populated HTML
 */
function populateResultContent(html, item) {
  html = injectContent(html, item.title, '##Title##');
  html = injectContent(html, item.link, '##Url##');
  if(item.excerpt)
    html = injectContent(html, item.excerpt, '##Excerpt##');
  else
    html = injectContent(html, "", '##Excerpt##');
  if( item.date)
    html = injectContent(html, item.date, '##Date##');
  else
    html = injectContent(html, "", '##Date##');
  return html;
}

/**
 * Populates results string
 * @param {String} count
 * @return null
 */
function populateResultsString(count) {
  $foundTerm.text(q);
  $foundCount.text(count);
  $foundContainer.show();
}

 /* ==========================================================================
    Helper functions
    ========================================================================== */


/**
 * Gets query string parameter - taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * @param {String} name
 * @return {String} parameter value
 */
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Injects content into template using placeholder
 * @param {String} originalContent
 * @param {String} injection
 * @param {String} placeholder
 * @return {String} injected content
 */
function injectContent(originalContent, injection, placeholder) {
  var regex = new RegExp(placeholder, 'g');
  return originalContent.replace(regex, injection);
}
