<?php
if(!session_id()) session_start();
require_once('Database.php');
require_once('message.php');

$db = new Database();

define('BASEURL',$_SERVER['REQUEST_SCHEME']."://".$_SERVER['SERVER_NAME'].str_replace(basename($_SERVER['SCRIPT_NAME']),'',$_SERVER['SCRIPT_NAME']));
?>