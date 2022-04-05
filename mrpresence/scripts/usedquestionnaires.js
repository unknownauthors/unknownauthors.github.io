function ShowUsedQuestionnaires() {
    $("#box_container").empty();

    $.getJSON("data/Publications/UsedQuestionnairesWithSources.json", function(json) {
        json.forEach(paper =>{

            var authors = paper.Authors.substring(0, paper.Authors.indexOf(".") + 1);
            var years = paper.Authors.substring(paper.Authors.indexOf(".") + 1, paper.Authors.length);
            html = '<div class="box">' +
            '<article class="media">' +
                '<div class="media-left">' +
                    '<a class="button is-small is-info" href="' + paper.ArticleURL + '"> Article </a>' +
                '</div>' +

                '<div class="media-content">' +
                    '<div class="content">' +
                    '<p>' +
                        '<strong>' + authors + '</strong> <small>' + years + '</small>' +
                        '<br>' +
                        paper.Title +
                    '</p>' +
                    '</div>' +
                    '<nav class="level is-mobile">' +
                        '<div class="level-left">' +
                            '<a class="level-item" aria-label="like" id="btn_show_' + paper.Authors.replaceAll(" ", "_") + '" onclick="Show(this.id)">' +
                                '<small>show more</small>' +
                            '</a>' +
                        '</div>' +                                              
                    '</nav>' +
                    '<div id="table_' + paper.Authors.replaceAll(" ", "_") + '">' +
                        
                    '</div> ' + 
                '</div>' +
            '</article>' +
        '</div>';

            $("#box_container").append(html);
        });

    });

}

function Show(id)
{
    var text = $(document.getElementById(id)).html();
    var checkName =  id.replaceAll("btn_show_", "").replaceAll("_", " ");

    if(text == "<small>show more</small>")
    {
        $.getJSON("data/Publications/UsedQuestionnairesWithSources.json", function(json) {
            json.forEach(paper =>{
                if(paper.Authors == checkName)
                {
                    var html = '<table class="table" id="reported_papers_table">' +
                                '<thead>' +
                                    '<tr style="background-color: gainsboro;">' +                        
                                        '<th><abbr title="Title">Title</abbr></th>' +
                                        '<th><abbr title="Authors">Authors</abbr></th>' +
                                        '<th><abbr title="Year">Year</abbr></th>' +                        
                                        '<th><abbr title="Source">Source</abbr></th>' +
                                        '<th><abbr title="DOI">DOI</abbr></th>' +
                                        '<th><abbr title="Link">Link</abbr></th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody height="200px">';
    
                    paper.Papers.forEach(p =>{
                        html += "<tr>" + 
                            "<td>" + p.Title + "</td>" +  
                            "<td>" + p.Authors + "</td>" + 
                            "<td>" + p.Year + "</td>" + 
                            "<td>" + p.Journal + "</td>" + 
                            "<td>" + p.DOI + "</td>" + 
                            "<td><a class='button is-small is-primary' href='" + p.ArticleURL + "'> Link</a></td>"
                        "</tr>";
    
                    });
    
                    html += '</tbody>' + '</table>';
    
                    var table = "table_" + checkName.replaceAll(" ", "_");
    
                    $(document.getElementById(table)).empty();
                    $(document.getElementById(table)).append(html);

                    $(document.getElementById(id)).html("<small>hide</small>");
                }
    
            });
        });
    }
    else{
        var table = "table_" + checkName.replaceAll(" ", "_");

        $(document.getElementById(table)).empty();

        $(document.getElementById(id)).html("<small>show more</small>");
    }

    console.log(text);   
}

// When the user clicks on the button, scroll to the top of the document
function GoTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

$(document).ready(function(){
    ShowUsedQuestionnaires();
});





