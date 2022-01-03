<?php
require('../vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
var_dump($_ENV["database"]);

class Database{
  public $conn;  
  function __construct($conn){
    $this->init();
  }

  function init(){
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }
  }
    
  }
  

?>