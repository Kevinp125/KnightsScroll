<?php
// Decode incoming JSON payload
$inData = getRequestInfo();

// Extract data from the request
$contactId = $inData["contactId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$pNumber = $inData["pNumber"];
$email = $inData["email"];

// Database connection details
$servername = "localhost";
$username = "root2";
$password = "password1234";
$dbname = "COP4331";

// Establish connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    sendResponse(500, "Database connection failed: " . $conn->connect_error);
    exit;
}

// Check if the contact exists
$checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ?");
if (!$checkStmt) {
    sendResponse(500, "Failed to prepare statement: " . $conn->error);
    exit;
}

$checkStmt->bind_param("s", $contactId);
if (!$checkStmt->execute()) {
    sendResponse(500, "Failed to execute statement: " . $checkStmt->error);
    exit;
}

$checkStmt->store_result();
if ($checkStmt->num_rows === 0) {
    $checkStmt->close();
    $conn->close();
    sendResponse(400, "Contact ID does not exist: " . $contactId);
    exit;
}
$checkStmt->close();

// Update contact information
$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
if (!$stmt) {
    sendResponse(500, "Failed to prepare update statement: " . $conn->error);
    exit;
}

$stmt->bind_param("sssss", $firstName, $lastName, $pNumber, $email, $contactId);
if ($stmt->execute()) {
    sendResponse(200, "Contact updated successfully");
} else {
    sendResponse(500, "Failed to update contact: " . $stmt->error);
}

// Clean up
$stmt->close();
$conn->close();

/**
 * Decode JSON request body
 */
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

/**
 * Send JSON response with a specific HTTP status code
 */
function sendResponse($status, $message)
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(["message" => $message]);
}
?>
