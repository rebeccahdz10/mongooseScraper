function displayAll(scrapeAltPress) {
    $("#text").empty();

    scrapeAltPress.array.forEach(data => {
        let altPressArticle = data.newPress

        var tr = $("<tr>").append(
            $("<td>").text(altPressArticle.title),
            $("<td>").append('<img src="${altPressArticle.image}"/>'),
            $("<td>").text(altPressArticle.summary)
        )
        $("#text").append(tr);
    });
}

// Grab the articles as a json
$.getJSON("/articles", function (data) {
    displayAll(data);
});