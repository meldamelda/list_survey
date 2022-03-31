<?php
class Database{
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $dbname = "meldamelda";

    private $stmt;
    private $conn;

    public function __construct(){
        $dsn = "mysql:host=$this->host;dbname=$this->dbname";
        $option = [
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];

        $this->conn = new PDO($dsn, $this->user, $this->pass, $option);
    }

    public function query($query){
        $this->stmt = $this->conn->prepare($query);
    }

    public function bind($par, $val, $type=null){
        if(is_null($type)){
            switch($val){
                case(is_int($val)):
                    $type = PDO::PARAM_INT;
                break;
                case(is_bool($val)):
                    $type = PDO::PARAM_BOOL;
                break;
                case(is_null($val)):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;    
            }
        }

        $this->stmt->bindValue($par, $val, $type);
    }

    public function execute(){
        $this->stmt->execute();
    }

    public function resultSet(){
        $this->execute();
        return $this->stmt->fetchALL(PDO::FETCH_ASSOC);
    }

    public function single(){
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function rowCount(){
        return $this->stmt->rowCount();
    }

    public function simpan(){}
}
?>