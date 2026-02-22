<?php
// card.php - Paystack payment verification API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get the request body
$input = json_decode(file_get_contents('php://input'), true);

// Paystack secret key - Replace with your actual secret key
$PAYSTACK_SECRET_KEY = getenv('PAYSTACK_SECRET_KEY') ?: 'YOUR_PAYSTACK_SECRET_KEY';

// Function to verify Paystack transaction
function verifyPaystackTransaction($reference, $secretKey) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.paystack.co/transaction/verify/' . urlencode($reference));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'body' => json_decode($response, true),
        'httpCode' => $httpCode
    ];
}

try {
    // Validate required fields
    if (!isset($input['reference']) || empty($input['reference'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Payment reference is required'
        ]);
        exit;
    }

    $reference = $input['reference'];
    $amount = isset($input['amount']) ? $input['amount'] : 0;
    $email = isset($input['email']) ? $input['email'] : '';

    // Verify the transaction with Paystack
    $verification = verifyPaystackTransaction($reference, $PAYSTACK_SECRET_KEY);
    
    if ($verification['httpCode'] === 200 && $verification['body']['status'] === true) {
        $transaction = $verification['body']['data'];
        
        // Check if transaction was successful
        if ($transaction['status'] === 'success') {
            // Log the successful payment (in production, update your database here)
            $logData = [
                'reference' => $reference,
                'amount' => $amount,
                'email' => $email,
                'status' => 'success',
                'tracking_data' => isset($input['tracking_data']) ? $input['tracking_data'] : [],
                'client_id' => isset($input['client_id']) ? $input['client_id'] : null,
                'transaction_id' => $transaction['id'],
                'paid_at' => $transaction['paid_at']
            ];
            
            // In production: Save to database or update campaign totals
            // file_put_contents('donations.log', json_encode($logData) . "\n", FILE_APPEND);
            
            echo json_encode([
                'success' => true,
                'status' => 'success',
                'message' => 'Payment verified successfully',
                'data' => [
                    'reference' => $reference,
                    'amount' => $amount,
                    'email' => $email,
                    'transaction_id' => $transaction['id']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'status' => 'failed',
                'message' => 'Payment was not successful'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'status' => 'error',
            'message' => isset($verification['body']['message']) ? $verification['body']['message'] : 'Failed to verify payment'
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

?>
