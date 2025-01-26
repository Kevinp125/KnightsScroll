<?php
    // incoming json payload
    $inData = getRequestInfo();
    
    // grab contact ID from payload
    $contactId = $inData["contactId"];

    // database user is root2, password is password1234
    $conn = new mysqli("localhost", "root2", "password1234", "COP4331");
    
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // first check for if the contact exists

        // to do this, we grab ID from contact table
        $checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ?");
        if (!$checkStmt) 
        {
            returnWithError($checkStmt->error);
        }      

        // bind contactId parameter
        $checkStmt->bind_param("i", $contactId);
        if (!$checkStmt->execute()) 
        {
            returnWithError($checkStmt->error);
        }

        $checkStmt->store_result();
        
        // see if it returned nothing
        if ($checkStmt->num_rows === 0) 
        {
            // id does not exist in Contact table
            $checkStmt->close();
            $conn->close();
            returnWithError("Contact ID does not exist.");
        }
        $checkStmt->close();      	    
        
        // delete contact ID
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        
        // bind contact ID into delete statement
        $stmt->bind_param("i", $contactId);
        
        if($stmt->execute())
        {
            // empty error means success
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
