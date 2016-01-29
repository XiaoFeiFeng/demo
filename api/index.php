<?php

require('common.inc.php');

try {
    $app = new App();
    $app->run();
} catch (Exception $e) {
    echo $e->getMessage();
}

?>
