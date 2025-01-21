<?php
     $inData = getRequestInfo();

     $firstName = trim($inData["firstName"]);
     $lastName = trim($inData["lastName"]);
     $login = trim($inData["login"]);
     $password = trim($inData["password"]);

     $conn = new mysqli("localhost", "root2", "password1234", "COP4331");


    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $checkStmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
        if (!$checkStmt) {
            returnWithError("Prepare failed: " . $conn->error);
            $conn->close();
            exit();
        }

        $checkStmt->bind_param("s", $login);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows > 0) {
            returnWithError("Username already taken.");
            $checkStmt->close();
            $conn->close();
            exit();
        }
        $checkStmt->close();

        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            returnWithError("Prepare failed: " . $conn->error);
            $conn->close();
            exit();
        }

        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);

        if ($stmt->execute()) {
            $newId = $stmt->insert_id;
            returnWithInfo($firstName, $lastName, $newId);
        } else {
            if ($conn->errno === 1062) {
                returnWithError("Username already exists.");
            } else {
                returnWithError("Execution failed: " . $stmt->error);
            }
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
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>
