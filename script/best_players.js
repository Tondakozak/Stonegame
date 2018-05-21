/* Filling the table of the best players on this computer */
function bestPlayersTable() {
    /* put the best players to the ranking table*/
    var users = JSON.parse(localStorage.users); // load users
    var scores = [];

    // load scores and users' names to a new array
    for (var i = 0; i < users.length; i++) {
        var user = localStorage.getItem(users[i]);
        if (user !== null && user.charAt(0) === "{") {
            user = JSON.parse(user);
            if (user.meters > 0) { // if the user has null score, he is excluded from the table
                scores.push({name: user.name, meters: user.meters});
            }
        }
    }
    // sort the array - best score first (selection sort)
    for (var i = 0; i < scores.length; i++) {
        var greatestId = i;
        var greatestMeters = scores[i].meters;
        for (var x = i+1; x < scores.length; x++) {
            if (greatestMeters < scores[x].meters) {
                greatestId = x;
                greatestMeters = scores[x].meters;
            }
        }
        var temp = scores[i];
        scores[i] = scores[greatestId];
        scores[greatestId] = temp;
    }

    // add users to the table
    var tableContent = "";
    for (var i = 0; i < scores.length; i++) {
        tableContent += "<tr><td>"+(i+1)+"</td><td>"+scores[i].name+"</td><td>"+scores[i].meters+" m</td></tr>"; // add the table row to table content string
    }
    document.getElementById("bestComputer").innerHTML = tableContent; // fill the table
}

bestPlayersTable();