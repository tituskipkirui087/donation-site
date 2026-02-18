<?php
// card.php - placeholder to simulate payment API
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

// Simple simulated response
echo json_encode([
  'error' => false,
  'pix' => [
    'id' => uniqid('pix_'),
    'status' => 'paid',
    'amount' => isset($input['amount']) ? $input['amount'] : '0.00'
  ]
]);

?>
