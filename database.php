<?php
$db = mysqli_connect ('localhost', 'DB_USER', '', 'DB_NAME');
//$db = mysqli_connect ('localhost', 'DB_USER', '', 'DB_NAME');
if (!$db) { // if the connection failed
    echo "<style>
            #div {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: lightblue;
	background-color: rgba(0,255,255,0.8); text-align: center; padding-top: 20%; font: bold 120% Arial;
        }
        #div h1 {color: red;}
        </style>
        <div id='div'><h1>I am sorry,</h1>  there is a problem with the database.</div>";
  exit();
  
}

$encoding = mysqli_query($db, "set names utf8");

// check if the table "users" exitst
$table_in_db = mysqli_query($db, "SHOW TABLES LIKE 'tables'");
if (mysqli_num_rows($table_in_db) < 1) {
    // create table
    $sql = "CREATE TABLE IF NOT EXISTS `users` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `my_key` varchar(300) NOT NULL,
        `name` varchar(300) NOT NULL,
        `last_game` datetime NOT NULL,
        `meters` int(11) NOT NULL,
        `levels` int(11) NOT NULL,
        PRIMARY KEY (`id`),
        KEY `key` (`my_key`(255)),
        KEY `nevim` (`id`,`my_key`(255))
      ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";
    $create_table = mysqli_query($db, $sql);
}