<?php

/**
  * This file return a json content with SNMP information about ARYA Server
  */
require_once('../config.php');

$host = $config['snmp']['arya']['host'];
$community = $config['snmp']['arya']['community'];
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

$return['temperature'] = (float) explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.2021.13.16.2.1.3.1"))[1] / 1000; # Temperature

$return['disk_percent_root'] = (float) explode(' ', snmp2_get($host, $community, ".1.3.6.1.4.1.2021.9.1.9.1"))[1];
$return['disk_percent_raid'] = (float) explode(' ', snmp2_get($host, $community, ".1.3.6.1.4.1.2021.9.1.9.2"))[1];
$return['disk_percent_hdd1'] = (float) explode(' ', snmp2_get($host, $community, ".1.3.6.1.4.1.2021.9.1.9.3"))[1];

$backupsystem = explode(' ', snmp2_get($host, $community, "iso.3.6.1.4.1.27654.3.3.1.1.10.99.104.101.99.107.95.100.97.116.101"))[1];
    $backupsystem = substr($backupsystem, 0, -1);
    $backupsystem = substr($backupsystem, 1);
    $backupsystem = explode('|', $backupsystem);
    array_pop($backupsystem);
    $status = 'OK';
    foreach($backupsystem as $b) {
        $exp = explode(':', $b);
        if($exp[1] == 'error') {
            $status = 'NOK';
            break;
        }
    }
    $return['backupsystem'] = $status;

// return a json encoded response
header('Content-Type: application/json');
echo json_encode($return);