<?php
    require_once('config.php');
    require_once('Database.php');
    $db = new Database();
    $submit = $_POST['submit'] ?? 'getData';
    $table = $_GET['table'];
    unset($_POST['submit']);
    $array_key = array_keys($_POST);
    

    function getData($db, $table){
        if(isset($_GET['id'])){
            $id = $_GET['id'];
            $db->query("select * from $table where id = '$id'");
            return $db->single();
        }else if(isset($_POST['cari'])){
            $kunci = $_POST['cari'];
            $array_key = $_POST['column'];
            $field = [];
            foreach($array_key as $a){
                array_push($field, "$a LIKE '%$kunci%'");
            }
            $field = implode(" OR ", $field);
            $db->query("SELECT * FROM $table WHERE $field");
            return $db->resultSet();
        }else{
            $db->query("select * from $table");
            return $db->resultSet();
        }
    }

    function tambah($db, $table,$array_key){
        $key = $array_key;
        $field = [];
        $param = [];
        foreach($key as $key){
            if($_POST[$key] != ""){
                array_push($field,$key); 
                array_push($param,":$key"); 
            }
        }
        $field = implode(",",$field);
        $param = implode(",",$param);
        $sql = "INSERT INTO $table($field) VALUES($param)";
        $db->query($sql);
        foreach($array_key as $a){
            if($_POST[$a] != ""){
                echo $db->bind(":$a", $_POST["$a"]);
            }
        }
        $db->execute();
        return $db->rowCount();
    }

    function ubah($db, $table,$array_key){
        $key = $array_key;
        $field = [];
        foreach($key as $key){
            if($_POST[$key] != "" && $key != "id"){
                array_push($field,"$key=:$key"); 
            }
        }
        $field = implode(",",$field);
        $sql = "UPDATE $table SET $field WHERE id=:id";
        $db->query($sql);
        foreach($array_key as $a){
            if($_POST[$a] != ""){
                if($a == "password"){
                    $db->bind(":$a", md5($_POST["$a"]));
                }else{
                    $db->bind(":$a", $_POST["$a"]);
                }
            }
        }
        $db->execute();
        return $db->rowCount();
    }

    function hapus($db, $table){
        $id = $_POST['id'];
        $sql = "DELETE FROM $table WHERE id='$id'";
        $db->query($sql);
        $db->execute();
        return $db->rowCount();
    }

    echo json_encode($submit($db, $table,$array_key));
?>