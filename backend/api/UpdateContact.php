<?php
    // incoming json payload
    $inData = getRequestInfo();
    
    // split payload into vars
    $contactId = $inData["contactId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $pNumber = $inData["pNumber"];
    $email = $inData["email"];

    // database user is root2, password is password1234
    $conn = new mysqli("localhost", "root2", "password1234", "COP4331");
    
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // first check for if the user exists

        // to do this, we grab ID from users table
        $checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ?");
        if (!$checkStmt) 
        {
            returnWithError($stmt->error);
        }      

        // bind userId parameter
        $checkStmt->bind_param("s", $contactId);
        if (!$checkStmt->execute()) 
        {
            returnWithError($stmt->error);
        }

        $checkStmt->store_result();
        
        // see if it returned nothing
        if ($checkStmt->num_rows === 0) 
        {
            // id does not exist in Users table
            $checkStmt->close();
            $conn->close();
            returnWithError("Contact ID does not exist. Contact ID is: " . $contactId);
        }
        $checkStmt->close();
        
        // insert into contact databse entries, as labeled below
        $stmt = $conn->prepare("UPDATE Contacts SET UserID = ?, FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
        
        // bind my vars to database vars in this order
        $stmt->bind_param("ssssss", $userId, $firstName, $lastName, $pNumber, $email, $contactId);
        
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
