<?php 
class database extends databaseconnect{
    // database connectie en tabel-naam
    public $conn;
    private $table_name = "users";
    // object properties
    public $id;
    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    function 
}