<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>door mangment</title>
</head>

<body>
    <?php
    include("./components/header.php")
    ?>
    <h1>overview of the acces logs</h1>
    <?php
    include_once("./database/database.php");
    $db = new Database($conn);
    $db->init();
    

    var_dump($conn);
?>

</body>

</html>