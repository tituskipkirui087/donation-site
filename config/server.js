const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const basePath = path.resolve(__dirname);
const rootPath = path.join(basePath, '..');
const publicPath = path.join(rootPath, 'public');
const configPath = path.join(rootPath, 'config');

console.log('Server paths:', { basePath, rootPath, publicPath, configPath });
console.log('Public exists:', fs.existsSync(publicPath));
console.log('Config exists:', fs.existsSync(configPath));

app.use(express.static(publicPath));
app.use('/public', express.static(publicPath));
app.use('/config', express.static(configPath));

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Paystack-Signature');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Paystack keys from environment
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'YOUR_PAYSTACK_SECRET_KEY';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'YOUR_PAYSTACK_PUBLIC_KEY';

// API route to get Paystack public key
app.get('/api/paystack-key', (req, res) => {
    res.json({ key: PAYSTACK_PUBLIC_KEY });
});

// Webhook endpoint
app.post('/api/webhook', async (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['paystack-signature'];
    
    // Verify signature (optional in production)
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(payload).digest('hex');
    
    const isValid = hash === signature;
    
    console.log('Webhook received:', {
        event: req.body.event,
        valid: isValid
    });
    
    try {
        if (req.body.event === 'charge.success') {
            const data = req.body.data;
            const reference = data.reference;
            const amount = data.amount / 100; // Paystack sends in kobo
            const email = data.customer?.email;
            
            console.log('Payment successful:', { reference, amount, email });
            
            // In production: Update database, send confirmation email, etc.
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Card payment verification endpoint
app.post('/api/verify-payment', async (req, res) => {
    const { reference } = req.body;
    
    if (!reference) {
        return res.json({ success: false, message: 'Payment reference is required' });
    }
    
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const data = response.data;
        
        if (data.status === true && data.data.status === 'success') {
            res.json({
                success: true,
                status: 'success',
                message: 'Payment verified successfully',
                data: {
                    reference: data.data.reference,
                    amount: data.data.amount / 100,
                    email: data.data.customer?.email,
                    transaction_id: data.data.id
                }
            });
        } else {
            res.json({
                success: false,
                status: 'failed',
                message: 'Payment was not successful'
            });
        }
    } catch (error) {
        console.error('Verification error:', error.response?.data || error.message);
        res.json({
            success: false,
            status: 'error',
            message: error.response?.data?.message || 'Failed to verify payment'
        });
    }
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'about.html'));
});

app.get('/how-to-help', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'how-to-help.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'blog.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'contact.html'));
});

app.get('/testimonials', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'testimonials.html'));
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'faq.html'));
});

// Serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Test endpoint to check static files
app.get('/test-files', (req, res) => {
    const publicPath = path.join(__dirname, '..', 'public');
    const configPath = path.join(__dirname, '..', 'config');
    
    let result = {
        publicDir: publicPath,
        publicExists: fs.existsSync(publicPath),
        configDir: configPath,
        configExists: fs.existsSync(configPath),
        files: {}
    };
    
    if (fs.existsSync(publicPath)) {
        result.files.public = fs.readdirSync(publicPath);
    }
    if (fs.existsSync(configPath)) {
        result.files.config = fs.readdirSync(configPath);
    }
    
    res.json(result);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
