d3.csv("D:\\GitHub\\MRPresence 2\\files\\Step 3\\Two Phases Final\\TwoPhases_Final.csv", function(d) {
    return {
      year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
      make: d.Make,
      model: d.Model,
      length: +d.Length // convert "Length" column to number
    };
  }, function(error, rows) {
    console.log(rows);
});