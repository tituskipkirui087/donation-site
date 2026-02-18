<?php
// webhook.php - placeholder that echoes received data
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

// In real usage you'd verify and process the webhook here
echo json_encode(['received' => $input]);

?>
