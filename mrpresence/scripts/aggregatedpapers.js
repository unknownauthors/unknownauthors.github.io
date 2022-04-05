function ShowAggregatedPapers() {
    $("#list_publications").empty();
    $("#home_tiles").empty();

    $.getJSON("data/Publications/AggregatedPapers.json", function(json) {
        var p = '<div class="tile is-parent is-warning" title = "' + json.length + ' aggregated publications">' + 
                        '<article class="tile is-child box is-warning">' +
                            '<p class="title is-3">' + json.length + '</p>' + 
                            '<p class="subtitle is-6"> publications </p>' + 
                        '</article>' +
                    '</div>';
            
            $("#home_tiles").append(p);

        json.forEach(paper =>{
            html = "<tr>" + 
                        "<td>" + paper.Title + "</td>" +  
                        "<td>" + paper.Authors + "</td>" + 
                        "<td>" + paper.Year + "</td>" + 
                        "<td>" + paper.Source + "</td>" + 
                        "<td>" + paper.DOI + "</td>" + 
                        "<td><a class='button is-small is-primary' href='" + paper.ArticleURL + "'> Link</a></td>"
                    "</tr>";

            $("#list_publications").append(html);
        });

    });

}

ShowAggregatedPapers();