<?php
// webhook.php - Paystack webhook handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Paystack-Signature');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Paystack secret key - Replace with your actual secret key
$PAYSTACK_SECRET_KEY = getenv('PAYSTACK_SECRET_KEY') ?: 'YOUR_PAYSTACK_SECRET_KEY';

// Function to verify Paystack webhook signature
function verifyPaystackSignature($payload, $secretKey, $signature) {
    $expectedSignature = hash_hmac('sha512', $payload, $secretKey);
    return $expectedSignature === $signature;
}

// Get the request body
$payload = file_get_contents('php://input');
$input = json_decode($payload, true);

// Get Paystack signature from headers
$signature = isset($_SERVER['HTTP_PAYSTACK_SIGNATURE']) ? $_SERVER['HTTP_PAYSTACK_SIGNATURE'] : '';

// Verify webhook signature (optional but recommended for production)
$isValidSignature = verifyPaystackSignature($payload, $PAYSTACK_SECRET_KEY, $signature);

// Log webhook for debugging (in production, remove or disable this)
$logData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'event' => isset($input['event']) ? $input['event'] : 'unknown',
    'data' => isset($input['data']) ? $input['data'] : [],
    'signature_valid' => $isValidSignature
];
// file_put_contents('webhook.log', json_encode($logData) . "\n", FILE_APPEND);

try {
    // Check if this is a successful payment event
    if (isset($input['event'])) {
        $event = $input['event'];
        
        switch ($event) {
            case 'charge.success':
                // Payment was successful
                $transactionData = $input['data'];
                
                // Process the successful payment
                // In production: Update your database, send confirmation emails, etc.
                
                $reference = isset($transactionData['reference']) ? $transactionData['reference'] : '';
                $amount = isset($transactionData['amount']) ? $transactionData['amount'] / 100 : 0; // Paystack sends in kobo
                $email = isset($transactionData['customer']['email']) ? $transactionData['customer']['email'] : '';
                $status = isset($transactionData['status']) ? $transactionData['status'] : '';
                
                // Process the payment (example: update campaign total)
                // In production: 
                // - Update donation records in database
                // - Update campaign total amount
                // - Send thank you email
                // - Update supporter count
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Webhook processed successfully',
                    'event' => $event,
                    'reference' => $reference
                ]);
                break;
                
            case 'charge.failed':
                // Payment failed
                $transactionData = $input['data'];
                $reference = isset($transactionData['reference']) ? $transactionData['reference'] : '';
                
                // Process failed payment (optional: notify user, log for analysis)
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Failed payment recorded',
                    'event' => $event,
                    'reference' => $reference
                ]);
                break;
                
            case 'customer Identification':
            case 'subscription':
            case 'invoice':
            case 'payment_request':
                // Handle other Paystack events as needed
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Event received',
                    'event' => $event
                ]);
                break;
                
            default:
                // Unknown event
                echo json_encode([
                    'success' => true,
                    'message' => 'Unknown event received',
                    'event' => $event
                ]);
        }
    } else {
        // No event specified - just acknowledge receipt
        echo json_encode([
            'success' => true,
            'message' => 'Webhook received',
            'data' => $input
        ]);
    }
    
} catch (Exception $e) {
    // Log the error
    // file_put_contents('webhook_error.log', date('Y-m-d H:i:s') . ' - ' . $e->getMessage() . "\n", FILE_APPEND);
    
    echo json_encode([
        'success' => false,
        'message' => 'Error processing webhook: ' . $e->getMessage()
    ]);
}

?>
