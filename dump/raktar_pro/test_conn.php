<?php
$mysqli = new mysqli("localhost", "root", "root", "webaruhaz", 8889, "/Applications/MAMP/tmp/mysql/mysql.sock");
if ($mysqli->connect_error) {
  die("FAIL: " . $mysqli->connect_error);
}
echo "OK, kapcsolat él.";
