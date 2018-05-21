<?php

include "database.php"; // include DB connection

$players_db = mysqli_query($db, "SELECT name, meters FROM users WHERE meters > 0 ORDER BY meters DESC"); // load the best players

echo "<h2>Best players</h2>";

if (mysqli_num_rows($players_db) > 0) { // if there are some players
    echo "<table class='bestTable'>"; // open table
    
    $i = 1;    
    while ($players = mysqli_fetch_array($players_db)) {
        echo "<tr><td>$i</td><td>".htmlspecialchars($players["name"])."</td><td>".htmlspecialchars($players["meters"])." m</td></tr>"; // add player to the table
        $i += 1;
    }
    
    echo "</table>"; // close table
} else { // no players yet
    echo "<p>Sorry, we can't find any player. :-(</p>";
}
?>

<!-- Table of the best players on this computer -->
<h2>Best on this computer</h2>
<table class="bestTable" id="bestComputer"></table>