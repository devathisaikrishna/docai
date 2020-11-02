<?php 

return [
    'url' => env('FRONTEND_URL', 'http://localhost:3000'),
    // path to my frontend page with query param queryURL(temporarySignedRoute URL)
    'email_verify_url' => env('FRONTEND_EMAIL_VERIFY_URL', '/user/verify-email?queryURL='),
    'reset_password_url' => env('FRONTEND_RESET_PASSWORD_URL', '/user/reset_password'),
    'admin_email_verify_url' => env('FRONTEND_ADMIN_RESET_PASSWORD_URL', '/admin/reset_password'),
    'admin_reset_password_url' => env('FRONTEND_ADMIN_RESET_PASSWORD_URL', '/admin/reset_password'),
];