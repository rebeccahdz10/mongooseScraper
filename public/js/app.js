function displayAll(scrapeAltPress) {
    scrapreAltPress.array.forEach(data => {
        let beeArticle = data.newArticle
    });
}

// Grab the articles as a json
$.getJSON("/articles", function (data) {
    displayAll(data);
});