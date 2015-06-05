<?php

/**
  * This file return a json content with SNMP information about KEBAB Server
  */
require_once('../config.php');

$host = $config['snmp']['kebab']['host'];
$community = $config['snmp']['kebab']['community'];
$return = array();

$uptime = explode(' ', snmp2_get($host, $community, "iso.3.6.1.2.1.25.1.1.0"));
array_shift($uptime);
array_shift($uptime);
$return['uptime'] = substr(implode(' ', $uptime), 0, -3);

$return['load1'] = explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.10.1.3.1"))[1]; # Load1
    $return['load1'] = substr($return['load1'], 0, -1);
    $return['load1'] = (float) substr($return['load1'], 1);
$return['load5'] = explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.10.1.3.2"))[1]; # Load5
    $return['load5'] = substr($return['load5'], 0, -1);
    $return['load5'] = (float) substr($return['load5'], 1);
$return['load15'] = explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.10.1.3.3"))[1]; # Load10
    $return['load15'] = substr($return['load15'], 0, -1);
    $return['load15'] = (float) substr($return['load15'], 1);

$ram_total = (float) explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.4.5.0"))[1];
$ram_free = (float) explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.4.6.0"))[1];
$return['ram_percent'] = ceil(($ram_total - $ram_free) / $ram_total * 100);

$return['disk_percent_root'] = (float) explode(' ', snmp2_get($host, $community, ".1.3.6.1.4.1.2021.9.1.9.1"))[1];

// return a json encoded response
header('Content-Type: application/json');
echo json_encode($return);