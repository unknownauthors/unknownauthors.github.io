function ShowAggregatedPapers() {
    $("#list_publications").empty();
    $("#home_tiles").empty();

    $.getJSON("data/Publications/AggregatedPapers.json", function(json) {
        var p = '<h5 class="mb-1 text-4xl font-medium text-gray-900 dark:text-white" title = "' + json.length + ' aggregated publications">' + json.length + '</h5>' +
                '<span class="text-lg text-gray-500 dark:text-gray-400"> publications </span>';
        
        // <div class="tile is-parent is-warning" title = "' + json.length + ' aggregated publications">' + 
        //                 '<article class="tile is-child box is-warning">' +
        //                     '<p class="title is-3">' + json.length + '</p>' + 
        //                     '<p class="subtitle is-6"> publications </p>' + 
        //                 '</article>' +
        //             '</div>';
            
            $("#home_tiles").append(p);

        json.forEach(paper =>{
            // html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
            //             "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + source + "</th>" +  
            //             "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
            //             "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
            //             "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
            //             "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
            //             "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
            //             "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
            //         "</tr>";


            html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                        "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 dark:text-white\">" + paper.Title + "</th>" +  
                        "<td>" + paper.Authors + "</td>" + 
                        "<td>" + paper.Year + "</td>" + 
                        "<td>" + paper.Source + "</td>" + 
                        "<td>" + paper.Doi + "</td>" + 
                        "<td class=\"px-6 py-4\"> <a href=\"" + paper.Link + "\" target='_blank'class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>" +
                    "</tr>";

            $("#list_publications").append(html);
        });

    });

}

// When the user clicks on the button, scroll to the top of the document
function GoTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

ShowAggregatedPapers();