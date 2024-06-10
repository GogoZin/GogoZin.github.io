
<?php
	if($_SERVER["SERVER_PORT"] != '443' ) {
		$https_login = "https://" . $_SERVER["SERVER_NAME"] . '/index.html' ;
		header("Location: $https_login");
		exit();
		}
?>
