<?php
header('Content-type: application/json');

require 'vendor-php/php-mailer/PHPMailerAutoload.php';

$name = $_POST['name'];
$email = $_POST['email'];
$company = $_POST['company'];
$phoneNumber = $_POST['phone_number'];
$message = $_POST['message'];
$formcontent="<b>From:</b> $name <br><b>Company:</b> $company <br><b>Phone Number:</b> $phoneNumber <br><br>$message";
$recipient = "tim.a@uxauthority.com";

$mail = new PHPMailer(true);
$mail->IsHTML(true);

$mail->AddAddress($recipient, 'Tim Antanov');
$mail->SetFrom($email, $name);
$mail->Subject = "Hire!! ATTENTION!!";
$mail->Body = $formcontent;

try{
    $mail->Send();
    $response_array['status'] = 'success';
} catch(Exception $e){
    //Something went bad
    $response_array['status'] = 'error';
    $response_array['msg'] = $mail->ErrorInfo;
}

echo json_encode($response_array);
?>