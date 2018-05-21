<?php
// insert new user to DB
include "../database.php";
if (isset($_POST["user_name"])) {
    $myKey = md5($_POST["user_name"].time());
    $query = "INSERT INTO users (my_key, name) VALUES ('$myKey', '".  mysqli_real_escape_string($db, trim($_POST["user_name"]))."')";
    $to_db = mysqli_query($db, $query);
    $id = mysqli_insert_id($db);
    
    echo '{"id" : "'.$id.'", "myKey" : "'.$myKey.'"}';
}

