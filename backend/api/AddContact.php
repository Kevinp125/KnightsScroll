<?php
    // incoming json payload
    $inData = getRequestInfo();
    
    // split payload into vars
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $pNumber = $inData["pNumber"];
    $email = $inData["email"];
    $userId = $inData["userId"]; // a user id

    // database user is root2, password is password1234
    $conn = new mysqli("localhost", "root2", "password1234", "COP4331");
    
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
	// insert into contact databse entries, as labeled below
        $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
        
        // bind my vars to database vars in this order
        $stmt->bind_param("sssss", $userId, $firstName, $lastName, $pNumber, $email);
        
        if($stmt->execute())
        {
            // empty error = success
            returnWithError("");
        }
        else
        {
            returnWithError($stmt->error);
        }
        
        // cleanup
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
