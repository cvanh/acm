<?php
class databaseconnect{
   // Database instellingen
   private $host = "localhost";
   private $db_name = "api";
   private $username = "root";
   private $password = "root";
   public $conn;

   public function __construct(){
      $this->getConnection();
   }
   
   public function getConnection(){
      $this->conn = null;
      try{
         $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
      }
      catch(Exception $e)
      {
         echo "Fout tijdens verbinden: " . $e->getMessage();
      }
      return $this->conn;
   }
}