function ShowUsedQuestionnaires() {
    $("#box_container").empty();

    $.getJSON("data/Publications/UsedQuestionnairesWithSources.json", function(json) {
        json.forEach(paper =>{

            var authors = paper.Authors.substring(0, paper.Authors.indexOf(".") + 1);
            var years = paper.Authors.substring(paper.Authors.indexOf(".") + 1, paper.Authors.length);
            html = '<div class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">' +
            '<div class="flex justify-end px-4 pt-4">' +
                '<a href="' + paper.ArticleURL + '" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Access</a>' +
            '</div>' +
            '<div class="flex flex-col items-center py-4">' +
                '<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">' +                
                authors + years +                       
                    '</h5>' +
                '<span class="text-sm text-gray-500 dark:text-gray-400">'+
                paper.Title +
                     '</span>' +
                '<div class="flex mt-4 space-x-3 md:mt-6">' +
                    '<a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" id="btn_show_' + paper.Authors.replaceAll(" ", "_") + '" onclick="Show(this.id)">Show More</a>' +
                    '</div>' +
            '</div>' +
            '<div id="table-container" class="grid grid-cols-12 gap-4 py-4">' +
                '<div></div>' +        
                '<div class="col-span-10" id="table_' + paper.Authors.replaceAll(" ", "_") + '">' +
                '</div>' +
                '<div></div>' +
            '</div>' +
        '</div>';
            
            
            
    //     '<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">' +
    //     '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">' +
    //         '<tr>
    //             '<th scope="col" class="px-6 py-3">' +
    //                 Title     
    //             '</th>' +
    //             '<th scope="col" class="px-6 py-3">' +
    //                 Authors
    //             '</th>' +
    //             '<th scope="col" class="px-6 py-3">' +
    //                 Year
    //             '</th>' +
    //             '<th scope="col" class="px-6 py-3">' +
    //                 Source
    //             '</th>' +
    //             '<th scope="col" class="px-6 py-3">' +
    //                 DOI
    //             '</th>' +
    //             '<th scope="col" class="px-6 py-3">' +
    //                 Link
    //            '</th>' +                              
    //         '</tr>' +
    //     '</thead>' +
    //     '<tbody id="list_publications">' +
    //         '<tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">' +
    //             '<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">' +
    //                 Apple MacBook Pro 17
    //             '</th>' +
    //             '<td class="px-6 py-4">' +
    //                 Sliver
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 Laptop
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 $2999
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 $2999
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 '<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Access</a>' +
    //             '</td>' +
    //         '</tr>' +
            
    //     '</tbody>' +
    // '</table>' +
            
            
        //     '<div class="box">' +
        //     '<article class="media">' +
        //         '<div class="media-left">' +
        //             '<a class="button is-small is-info" href="' + paper.ArticleURL + '" target="_blank"> Article </a>' +
        //         '</div>' +

        //         '<div class="media-content">' +
        //             '<div class="content">' +
        //             '<p>' +
        //                 '<strong>' + authors + '</strong> <small>' + years + '</small>' +
        //                 '<br>' +
        //                 paper.Title +
        //             '</p>' +
        //             '</div>' +
        //             '<nav class="level is-mobile">' +
        //                 '<div class="level-left">' +
        //                     '<a class="level-item" aria-label="like" id="btn_show_' + paper.Authors.replaceAll(" ", "_") + '" onclick="Show(this.id)">' +
        //                         '<small>show more</small>' +
        //                     '</a>' +
        //                 '</div>' +                                              
        //             '</nav>' +
        //             '<div id="table_' + paper.Authors.replaceAll(" ", "_") + '">' +
                        
        //             '</div> ' + 
        //         '</div>' +
        //     '</article>' +
        // '</div>';

            $("#box_container").append(html);
        });

    });

}

function Show(id)
{
    var text = $(document.getElementById(id)).html();
    var checkName =  id.replaceAll("btn_show_", "").replaceAll("_", " ");

    if(text == "Show More")
    {
        $.getJSON("data/Publications/UsedQuestionnairesWithSources.json", function(json) {
            json.forEach(paper =>{
                if(paper.Authors == checkName)
                {
                    var html = '<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">' +
                                    '<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">' +
                                        '<tr>' +
                                            '<th scope="col" class="px-6 py-3">Title</th>' +
                                            '<th scope="col" class="px-6 py-3">Authors</th>' +
                                            '<th scope="col" class="px-6 py-3">Year</th>' +
                                            '<th scope="col" class="px-6 py-3">Source</th>' +
                                            '<th scope="col" class="px-6 py-3">DOI</th>' +
                                            '<th scope="col" class="px-6 py-3">Link</th>' +                              
                                        '</tr>' +
                                    '</thead>' +
                                    '<tbody>';
    //         '<tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">' +
    //             '<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">' +
    //                 Apple MacBook Pro 17
    //             '</th>' +
    //             '<td class="px-6 py-4">' +
    //                 Sliver
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 Laptop
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 $2999
    //             '</td>' +
    //             '<td class="px-6 py-4">' +
    //                 $2999
    //             '</td>' +
                // '<td class="px-6 py-4">' +
                //     '<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Access</a>' +
                // '</td>' +
    //         '</tr>' +
            
    //     '</tbody>' +
    // '</table>' +
    
                    paper.Papers.forEach(p =>{
                        html += '<tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">' + 
                            '<th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white">' + p.Title + "</th>" +  
                            "<td>" + p.Authors + "</td>" + 
                            "<td>" + p.Year + "</td>" + 
                            "<td>" + p.Journal + "</td>" + 
                            "<td>" + p.DOI + "</td>" + 
                            '<td class="px-6 py-4">' +
                                '<a href="' + p.ArticleURL + '" target="_blank" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Access</a>' +
                            '</td>' +
                        "</tr>";
    
                    });
    
                    html += '</tbody>' + '</table>';
    
                    var table = "table_" + checkName.replaceAll(" ", "_");
    
                    $(document.getElementById(table)).empty();
                    $(document.getElementById(table)).append(html);

                    $(document.getElementById(id)).html("hide");
                }
    
            });
        });
    }
    else{
        var table = "table_" + checkName.replaceAll(" ", "_");

        $(document.getElementById(table)).empty();

        $(document.getElementById(id)).html("Show More");
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





