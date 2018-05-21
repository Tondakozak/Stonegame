<?php
// update user score in DB
include "../database.php"; // include database connection
if (isset($_POST["id"])) {
    // details
    $id = intval($_POST["id"]);
    $key = mysqli_real_escape_string($db, trim($_POST["key"]));
    $meters = intval($_POST["meters"]);
    $levels = intval($_POST["levels"]);
    $in_db = mysqli_query($db, "SELECT meters FROM users WHERE id = '$id' AND my_key = '$key'"); // previous score
    
    if (mysqli_num_rows($in_db) > 0) { // user is in the DB
        $db_result = mysqli_fetch_array($in_db);
        if ($meters > $db_result["meters"]) {
            // Insert new values to db
            $to_db = mysqli_query($db, "UPDATE users SET meters = '$meters', levels = '$levels', last_game = NOW() WHERE id = '$id'");
            if ($to_db) {
                echo '{"success" : true}';
            } 
        } else {
            echo '{"success" : true, "notice" : "this is not the best score"}';
        }
    } else {
        echo '{"success" : false, "notice" : "user not found - '.  mysqli_error($db).'"}';
    }
}