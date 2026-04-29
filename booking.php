<?php
/**
 * Novaria Limo — booking.php
 *
 * Receives booking form data via POST, validates it,
 * sends an email notification, and returns a JSON response.
 * The JavaScript in script.js calls this via fetch() as a
 * fire-and-forget notification after opening WhatsApp.
 *
 * To enable email: set $emailTo to your business email.
 * Requires PHP with mail() support or swap for PHPMailer.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ---- Configuration ----
$emailTo      = 'your-email@example.com';   // Change to your business email
$emailFrom    = 'noreply@novaria-limo.com';
$emailSubject = 'New Novaria Booking Request';
$sendEmail    = false; // Set to true when mail server is configured

// ---- Helpers ----
function clean(string $val): string {
    return htmlspecialchars(trim(strip_tags($val)), ENT_QUOTES, 'UTF-8');
}

function respond(bool $success, string $message, array $extra = []): void {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

// ---- Only accept POST ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.');
}

// ---- Read & sanitize inputs ----
$service = clean($_POST['service'] ?? '');
$name    = clean($_POST['name']    ?? '');
$phone   = clean($_POST['phone']   ?? '');
$pickup  = clean($_POST['pickup']  ?? '');
$dropoff = clean($_POST['dropoff'] ?? '');
$date    = clean($_POST['date']    ?? '');
$time    = clean($_POST['time']    ?? '');
$vehicle = clean($_POST['vehicle'] ?? '');
$notes   = clean($_POST['notes']   ?? '');

// ---- Server-side validation ----
$errors = [];
if (!$service) $errors[] = 'Service type is required.';
if (!$name)    $errors[] = 'Full name is required.';
if (!$phone)   $errors[] = 'Phone number is required.';
if (!$pickup)  $errors[] = 'Pickup location is required.';
if (!$date)    $errors[] = 'Date is required.';
if (!$time)    $errors[] = 'Time is required.';
if ($service !== 'Hourly Service' && !$dropoff) {
    $errors[] = 'Drop-off location is required for this service type.';
}
if ($date && strtotime($date) < strtotime('today')) {
    $errors[] = 'Date cannot be in the past.';
}

if (!empty($errors)) {
    respond(false, 'Validation failed.', ['errors' => $errors]);
}

// ---- Build WhatsApp URL (returned to client) ----
$msgLines = [
    "🚗 *NOVARIA LIMO BOOKING REQUEST*",
    "",
    "*Service:* {$service}",
    "*Name:* {$name}",
    "*Phone:* {$phone}",
    "*Pickup:* {$pickup}",
    $dropoff ? "*Drop-off:* {$dropoff}" : null,
    "*Date:* {$date}",
    "*Time:* {$time}",
    $vehicle ? "*Vehicle:* {$vehicle}" : null,
    $notes   ? "*Notes:* {$notes}"    : null,
    "",
    "📋 *Status:* PENDING CONFIRMATION",
];
$msgLines = array_filter($msgLines, fn($l) => $l !== null);
$msgText  = implode("\n", $msgLines);
$waNumber = '14704190528';
$waUrl    = "https://wa.me/{$waNumber}?text=" . rawurlencode($msgText);

// ---- Optional email notification ----
if ($sendEmail) {
    $emailBody = "
New booking request received via Novaria website.

Service:   {$service}
Name:      {$name}
Phone:     {$phone}
Pickup:    {$pickup}
Drop-off:  {$dropoff}
Date:      {$date}
Time:      {$time}
Vehicle:   {$vehicle}
Notes:     {$notes}
Status: PENDING CONFIRMATION
    ";

    $headers = "From: {$emailFrom}\r\n"
             . "Reply-To: {$phone}\r\n"
             . "X-Mailer: PHP/" . phpversion() . "\r\n"
             . "Content-Type: text/plain; charset=UTF-8\r\n";

    $sent = mail($emailTo, $emailSubject, $emailBody, $headers);

    if (!$sent) {
        // Email failed but don't block the response — WhatsApp is primary
        error_log("Novaria: mail() failed for booking from {$name}");
    }
}

// ---- Log booking (optional — writes to bookings.log) ----
$logEntry = date('Y-m-d H:i:s') . " | {$service} | {$name} | {$phone} | {$date} {$time} | {$pickup}\n";
@file_put_contents(__DIR__ . '/bookings.log', $logEntry, FILE_APPEND | LOCK_EX);

// ---- Respond ----
respond(true, 'Booking received.', ['whatsapp_url' => $waUrl]);
