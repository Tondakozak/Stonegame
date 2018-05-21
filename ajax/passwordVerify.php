<?php
// return if a password match a hash
if (isset($_POST["password"]) && isset($_POST["passwordHash"])) {
    if (password_verify(trim($_POST["password"]), trim($_POST["passwordHash"]))) {
        echo "true";
    } else {
        echo "false";
    }
}
