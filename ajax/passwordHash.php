<?php
// ajax - send back a hash of given string
if (isset($_POST["password"])) {
    echo password_hash(trim($_POST["password"]), PASSWORD_DEFAULT);
}