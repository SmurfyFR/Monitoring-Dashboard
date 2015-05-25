<?php

/**
  * This file return a json content with the time to ping a server.
  */

// Parameters
$param = array();
$param['host'] = $_GET['host'];

$return = array();

// Make some logic here !
if(!$param['host']) {
    $return['error'] = true;
    $return['message'] = 'Missing host parameter.';
} else {
    $ping = exec('/bin/ping -w 1 -c 1 '.escapeshellarg($param['host']), $output, $result);
    if($result != 0) {
        $return['error'] = true;
        $return['message'] = 'Cannot ping this server.';
    } else {
        $time = explode('/', (explode(' ', $output[5])[3]))[0];

        $return['host'] = $_GET['host'];
        $return['time'] = round($time);
    }
}

// return a json encoded response
header('Content-Type: application/json');
echo json_encode($return);