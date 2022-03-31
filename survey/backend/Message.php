<?php
class Message{
    public static function flash($msg, $col){
       $_SESSION['f_msg'] = $msg; 
       $_SESSION['f_col'] = $col; 
    }

    public static function showFlash(){
        if(isset($_SESSION['f_msg'])){
            echo "<div class='alert alert-".$_SESSION['f_col']." alert-dismissible fade show' role='alert'>".$_SESSION['f_msg']."<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";

            unset($_SESSION['f_msg']);
            unset($_SESSION['f_col']);
        }
    }
}
?>