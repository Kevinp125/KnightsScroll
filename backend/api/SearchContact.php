<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "root2", "password1234", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // Prepare the SQL query to search for partial matches in firstName, lastName, phone, or email
    $stmt = $conn->prepare("SELECT ID, firstName, lastName, phone, email FROM Contacts WHERE (firstName LIKE ? OR lastName LIKE ?) AND UserID = ?");
    if (!$stmt) {
        returnWithError("Failed to prepare statement: " . $conn->error);
    }

    // Add wildcards for partial matching
    $searchTerm = "%" . $inData["search"] . "%";
    $userId = $inData["userId"];
    $stmt->bind_param("ssi", $searchTerm, $searchTerm, $userId);
    $stmt->execute();

    $result = $stmt->get_result();

    // Build the JSON response with matching contacts
    while ($row = $result->fetch_assoc())
    {
        if ($searchCount > 0)
        {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"id":' . $row["ID"] . ',"firstName":"' . $row["firstName"] . '","lastName":"' . $row["lastName"] . '","phone":"' . $row["phone"] . '","email":"' . $row["email"] . '"}';
    }

    if ($searchCount == 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":[' . $searchResults . '],"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
