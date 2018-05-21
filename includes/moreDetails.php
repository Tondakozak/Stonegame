<?php
/* create form inputs for additional details */
$othersDetails = [ // [label, type, name]
    ["Tel. number:", "tel", "tel"],
    ["Pet's name:", "text", "pet"],
    ["Age:", "number", "age"],
    ["Gender:", "text", "gender"],
    ["Nationality:", "text", "nationality"],
    ["Favourite movie:", "text", "movie"],
    ["Favourite web browser:", "text", "browser"],
    ["Favourite website:", "text", "website"],
    ["Favourite online forum:", "text", "forum"],
    ["Name of your best friend:", "text", "friend"],
    ["What is your mother's maiden name?", "text", "mother"],
    ["What was the first book you ever read?", "text", "first-book"],
    ["What was the first company you ever workded for?", "text", "first-company"],
    ["In which city was your mother born?", "text", "mother-born-city"],
    ["In which city you get married?", "text", "city-married"],
    ["What is your father's middle name?", "text", "father-middle"],
    ["What is your favourite color?", "text", "color"],
    ["What is the name of your first boyfriend/girlfriend?", "text", "first-boyfriend"],
    ["What is the name of your current boyfriend/girlfriend?", "text", "current-boyfriend"],
    ["Who is your favourite actor?", "text", "actor"],
    ["Who is your favourite musician?", "text", "musician"],
    ["Who is your favourite artist?", "text", "artist"],
    ["What was your first car?", "text", "car"],
    ["What's your dream job?", "text", "job"],
    ["What's your account number?", "text", "account"],
    ["What's your credit/debit card number?", "text", "credit-card"],
    ["What's your Facebook password?", "text", "facebook-passwod"]
];


foreach ($othersDetails as $oneDetail) {
    echo "<label>$oneDetail[0]<input type='$oneDetail[1]' name='$oneDetail[2]'></label>";
}

                        