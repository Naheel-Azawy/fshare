<?php

$maxSize = 2147483648;
$maxAge = 24*60*60;

$file_name =  $_FILES["file"]["name"];
$tmp_name = $_FILES["file"]["tmp_name"];
$target_dir = dirname(__FILE__) . "/../files/";
$target_file = $target_dir . $file_name;

$ok = 1;

// cleanups
$now = time();
foreach (glob($target_dir . "*") as $filename) {
    $age = $now - filemtime($filename);
    if ($age > $maxAge) {
        echo "deleted '", $filename, "' (age = ", $age, ") <br>";
        unlink($filename);
    }
}

if (file_exists($target_file)) {
    echo "File exists";
    $ok = 0;
}

if ($_FILES["file"]["size"] > $maxSize) {
    echo "File too large";
    $ok = 0;
 }

if (!move_uploaded_file($tmp_name, $target_file)) {
    echo "Failed moving file";
    $ok = 0;
 }

if ($ok == 0) {
    echo "<br>Failed uploading";
 }

?>
