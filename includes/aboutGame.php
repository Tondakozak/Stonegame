<h2>About Game</h2>
<p>Have a fun and play new game called "Tondova hra". Control the ball by arrows on keyboard or touch your screen and avoid stones and collect coins for which you can buy extra balls (lives) before each game.

<p>This page a coursework of the module CSD2550 – Web Applications and Databases, second year Computer Science in Middlesex University in London.

    
<?php
// the text above is not part of PHP code thus it is outputed as echo
// the paragraphs don't have closing tags because these tags are optional. The paragraph element is closed before the next starts.

// show current date
function show_date() {
    $today = new DateTime(); // today's date
    $page_published = new DateTime("2016-12-15"); // a date when the page was published
    $between = $page_published->diff($today); // difference between these dates
    $formated = $between->format("%y years, %m months and %d days"); // formating output
    return $formated;
}

echo "<!-- This page runs for: ".show_date()."-->";