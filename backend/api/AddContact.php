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
        // first check for if the user exists

        // to do this, we grab ID from users table
        $checkStmt = $conn->prepare("SELECT ID FROM Users WHERE ID = ?");
        if (!$checkStmt) 
        {
            returnWithError($stmt->error);
        }      

        // bind userId parameter
        $checkStmt->bind_param("s", $userId);
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
            returnWithError("User ID does not exist.");
        }
        $checkStmt->close();      	    
        
        // insert into contact databse entries, as labeled below
        $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
        
        // bind my vars to database vars in this order
        $stmt->bind_param("sssss", $userId, $firstName, $lastName, $pNumber, $email);
        
        if($stmt->execute())
        {
            // returns contact id and empty error code for success
            $contactId = $stmt->insert_id;
            returnWithInfo();
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

    function returnWithInfo($contactId)
    {
        $retValue = '{"contactId":' . $contactId . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>
