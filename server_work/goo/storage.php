<?php
$user_timeout = 300; // THE NUMBER OF SECONDS THAT NEED TO PASS AFTER THE USER LOGGING IN, BEFORE THEYRE AUTOMATICALLY CLASSED AS OFFLINE

$storage_directory = getcwd()."/cloud_indie/";
if(!file_exists($storage_directory)){echo("storage created");mkdir($storage_directory);$f=fopen($storage_directory."index.html","w");fwrite($f,"Permission Denied.");fclose($f);}
if(isset($_REQUEST["game"])){$game = preg_replace("/[^a-zA-Z0-9 ]/", "", $_REQUEST["game"]);;}
if(isset($_REQUEST["username"])){$username = preg_replace("/[^a-zA-Z0-9 ]/", "", $_REQUEST["username"]);}
if(isset($_REQUEST["new_username"])){$new_username = preg_replace("/[^a-zA-Z0-9 ]/", "", $_REQUEST["new_username"]);}
if(isset($_REQUEST["password"])){$password=$_REQUEST["password"];}
if(isset($_REQUEST["query"])){$query=$_REQUEST["query"];}
if(isset($_REQUEST["variable"])){$variable=$_REQUEST["variable"];}
if(isset($_REQUEST["value"])){$value=$_REQUEST["value"]; if($value== "user_ip"){$value = $_SERVER['REMOTE_ADDR'];}}
if(isset($_REQUEST["timeout"])){$timeout=$_REQUEST["timeout"];}
if(isset($_REQUEST["ascending"])){$ascending=$_REQUEST["ascending"];}
if(isset($_REQUEST["data"])){$data=$_REQUEST["data"];}
if(isset($game) && isset($query))
{
	$game_directory = $storage_directory.$game."/";
	$game_exists = file_exists($game_directory);
	
	if(!$game_exists){$game_exists = mkdir($game_directory);} // REMOVE THIS LINE TO NOT LET OTHERS USE THEIR OWN GAME_ID ON YOUR SYSTEM
	
	$game_exists = file_exists($game_directory);
	if($game_exists)
	{
		$users_directory = $game_directory."users/";
		$system_variables = $game_directory."system_variables.txt";
		$timeout_variables = $game_directory."timeout_variables.txt";
		if(!file_exists($users_directory)){mkdir($users_directory);}
		if(!file_exists($system_variables)){$f=fopen($system_variables,'w');fclose($f);}
		if(!file_exists($timeout_variables)){$f=fopen($timeout_variables,'w');fclose($f);}
		$all_users = array();$u = scandir($users_directory);$l = sizeof($u);$user_exists=0;$new_user_exists=0;
		while($l--){if(strtolower($new_username.".txt")==strtolower($u[$l])){$new_user_exists=1;}if(strtolower($username.".txt")==strtolower($u[$l])){$username=str_replace(".txt","",$u[$l]);$user_exists=1;}if(strpos($u[$l],".txt")){$all_users[] = str_replace(".txt","",$u[$l]);}}
		switch($query)
		{
			case 'all_users':
				$output = json_encode($all_users);
			break;
			case 'all_users_online':
				$all_users = array();$u = scandir($users_directory);$l = sizeof($u);$all_users_online=array();
				while($l--)
				{
					if(strpos($u[$l],".txt"))
					{
						$user_file = $users_directory.$u[$l];
						$user = str_replace(".txt","",$u[$l]);
						$f = fopen($user_file,"r");
						$c = fread($f,filesize($user_file));
						fclose($f);
						$user_variables = json_decode($c,true);
						if(time()-$user_variables["lastactive"]<$user_timeout)
						{
							if($user_variables["online"]==1)
							{
								$all_users_online[] = $user;
							}
						}
						else
						{
							$user_variables["online"] = 0;
							$f = fopen($user_file,"w");
							fwrite($f,json_encode($user_variables));
							fclose($f);
						}
					}
				}
				$output = json_encode($all_users_online);
			break;
			case 'all_users_variable':
				$all_users = array();$u = scandir($users_directory);$l = sizeof($u);$all_users_variable=array();
				if(isset($variable))
				{
					while($l--)
					{
						if(strpos($u[$l],".txt"))
						{
							$user_file = $users_directory.$u[$l];
							$user = str_replace(".txt","",$u[$l]);
							$f = fopen($user_file,"r");
							$c = fread($f,filesize($user_file));
							fclose($f);
							$user_variables = json_decode($c,true);
							if(time()-$user_variables["lastactive"]<$user_timeout)
							{
								if($user_variables["online"]==1)
								{
									$all_users_online[] = $user;
								}
							}
							else
							{
								$user_variables["online"] = 0;
								$f = fopen($user_file,"w");
								fwrite($f,json_encode($user_variables));
								fclose($f);
							}
							if(isset($user_variables[$variable]))
							{
								if($variable == "lastactive")
								{
									$all_users_variable[$user] = time()-$user_variables["lastactive"];
								}
								else
								{
									$all_users_variable[$user] = $user_variables[$variable];
								}
							}
						}
					}
					$output = json_encode($all_users_variable);
				}
				$output = json_encode($all_users_variable);
			break;
			case 'all_users_rank':
				$all_users = array();$u = scandir($users_directory);$l = sizeof($u);$all_users_variable=array();
				if(isset($variable) && isset($ascending))
				{
					if($variable!="verification_code" && $variable!="password") 
					{
						while($l--)
						{
							if(strpos($u[$l],".txt"))
							{
								$user_file = $users_directory.$u[$l];
								$user = str_replace(".txt","",$u[$l]);
								$f = fopen($user_file,"r");
								$c = fread($f,filesize($user_file));
								fclose($f);
								$user_variables = json_decode($c,true);
								if(time()-$user_variables["lastactive"]<$user_timeout)
								{
									if($user_variables["online"]==1)
									{
										$all_users_online[] = $user;
									}
								}
								else
								{
									$user_variables["online"] = 0;
									$f = fopen($user_file,"w");
									fwrite($f,json_encode($user_variables));
									fclose($f);
								}
								if(isset($user_variables[$variable]))
								{
									if($variable == "lastactive")
									{
										$all_users_variable[$user] = time()-$user_variables["lastactive"];
									}
									else
									{
										$all_users_variable[$user] = $user_variables[$variable];
									}
								}
							}
						}
						
						asort($all_users_variable);
						if($ascending=="false"||$ascending=="0"||$ascending=0)
						{
							$all_users_variable = array_reverse($all_users_variable,true);
						}
						
						$rankings = array();
						$current = 1;
						$rank = 1;
						
						end($all_users_variable);
						$key = key($all_users_variable); 
						$end_val = $all_users_variable[$key];
						
						foreach($all_users_variable as $user => $val)
						{
							if(!isset($last_val)){$last_val=$val;}
							if($val != $last_val)
							{
								$last_val = $val;
								$rank = $current;
							}
							if($val == $end_val)
							{
								$rank = count($all_users_variable);
							}
							
							$current_user=array();
							$current_user[]=$user;
							$current_user[]=$rank;
							$current_user[]=$val;
							$rankings[] = $current_user;
							$current++;
						}
						$all_users_variable = $rankings;
					}
				}
				$output = json_encode($all_users_variable);
			break;
			case 'system_set_variable':
				$output = 0;
				if(isset($variable) && isset($value))
				{
					if(filesize($system_variables))
					{
						$f = fopen($system_variables,"r");
						$c = fread($f,filesize($system_variables));
						fclose($f);
						$v = json_decode($c,true);
					}
					else
					{
						$v = array();
					}
					$v[$variable]=$value;
					$f = fopen($system_variables,"w");
					if(fwrite($f,json_encode($v)))
					{
						$output =1;
					}
					fclose($f);
				}
			break;
			case 'system_get_variable':
				$output = 0;
				if(isset($variable))
				{
					if(filesize($system_variables))
					{
						$f = fopen($system_variables,"r");
						$c = fread($f,filesize($system_variables));
						fclose($f);
						$v = json_decode($c,true);
						$output = $v[$variable];
					}
				}
			break;
			case 'system_all_variable':
				$output = 0;
				if(filesize($system_variables))
				{
					$f = fopen($system_variables,"r");
					$c = fread($f,filesize($system_variables));
					fclose($f);
					$output = $c;
				}
			break;
			case 'system_exists_variable':
				$output = 0;
				if(filesize($system_variables))
					{
						$f = fopen($system_variables,"r");
						$c = fread($f,filesize($system_variables));
						fclose($f);
						$v = json_decode($c,true);
						if(isset($v[$variable]))
						{
							$output = 1;
						}
					}
			break;
			case 'system_delete_variable':
				$output = 0;
				if(isset($variable) && isset($value))
				{
					if(filesize($system_variables))
					{
						$f = fopen($system_variables,"r");
						$c = fread($f,filesize($system_variables));
						fclose($f);
						$v = json_decode($c,true);
						unset($v[$variable]);
						$f = fopen($system_variables,"w");
						if(fwrite($f,json_encode($v)))
						{
							$output =1;
						}
						fclose($f);
					}
				}
			break;
			case 'timeout_set_variable':
				$output = 0;
				if(isset($variable) && isset($value) && isset($timeout) && isset($data))
				{
					if($value== "user_ip"){$value = $_SERVER['REMOTE_ADDR'];}
				
					$f = fopen($timeout_variables,"r");
					$c = fread($f,filesize($timeout_variables));
					fclose($f);
					
					$v = json_decode($c,true);
					
					foreach($v as $col => $row)
					{
						$column = $v[$col];
						foreach($column as $row => $times)
						{
							if(time() > $times[0]+$times[1])
							{
								unset($v[$col][$row]);
							}
						}
					}
					$f = fopen($timeout_variables,"w");
					fwrite($f,json_encode($v));
					fclose($f);
					
					$values = array();
					$values[] = intval($timeout);
					$values[] = time();
					$values[] = $data;
					$v[$variable][$value] = $values;
					
					$f = fopen($timeout_variables,"w");
					if(fwrite($f,json_encode($v))){$output = 1;};
					fclose($f);
				}
			break;
			case 'timeout_all_variable':
				$output = 0;
				if(isset($variable))
				{
					if($value== "user_ip"){$value = $_SERVER['REMOTE_ADDR'];}
				
					$f = fopen($timeout_variables,"r");
					$c = fread($f,filesize($timeout_variables));
					fclose($f);
					$v = json_decode($c,true);
					
					foreach($v as $col => $row)
					{
						$column = $v[$col];
						foreach($column as $row => $times)
						{
							if(time() > $times[0]+$times[1])
							{
								unset($v[$col][$row]);
							}
						}
					}
					$f = fopen($timeout_variables,"w");
					fwrite($f,json_encode($v));
					fclose($f);
					
					
					$output = array();
					foreach($v[$variable] as $key => $val)
					{
						$r = array();
						$r[] = $key;
						$r[] = $val[2];
						$output[] = $r;
					}
					$output = json_encode($output);
				}
			break;
			case 'timeout_exists_variable':
				$output = 0;
				if(isset($variable) & isset($value))
				{
					if($value== "user_ip"){$value = $_SERVER['REMOTE_ADDR'];}
				
					$f = fopen($timeout_variables,"r");
					$c = fread($f,filesize($timeout_variables));
					fclose($f);
					$v = json_decode($c,true);
					
					foreach($v as $col => $row)
					{
						$column = $v[$col];
						foreach($column as $row => $times)
						{
							if(time() > $times[0]+$times[1])
							{
								unset($v[$col][$row]);
							}
						}
					}
					$f = fopen($timeout_variables,"w");
					fwrite($f,json_encode($v));
					fclose($f);
					
					if(isset($v[$variable][$value])){$output = 1;}
				}
			break;
			case 'timeout_delete_variable':
				$output = 0;
				if(isset($variable) & isset($value))
				{
					if($value== "user_ip"){$value = $_SERVER['REMOTE_ADDR'];}
				
					$f = fopen($timeout_variables,"r");
					$c = fread($f,filesize($timeout_variables));
					fclose($f);
					
					$v = json_decode($c,true);
					unset($v[$variable][$value]);
					
					foreach($v as $col => $row)
					{
						$column = $v[$col];
						foreach($column as $row => $times)
						{
							if(time() > $times[0]+$times[1])
							{
								unset($v[$col][$row]);
							}
						}
					}
					$f = fopen($timeout_variables,"w");
					fwrite($f,json_encode($v));
					fclose($f);
					
					$f = fopen($timeout_variables,"w");
					if(fwrite($f,json_encode($v))){$output=1;};
					fclose($f);
				}
			break;
		}
		if(isset($username))
		{
			$user_file = $users_directory.$username.".txt";
			$user_exists = file_exists($user_file);
			if($user_exists)
			{
				$f=fopen($user_file,"r");
				$s=filesize($user_file);
				$c=fread($f,$s);
				$user_variables = json_decode($c,true);
				fclose($f);
				
				if(time()-$user_variables["lastactive"]>=$user_timeout)
				{
				$user_variables["online"] = 0;
				$f = fopen($user_file,"w");
				fwrite($f,json_encode($user_variables));
				fclose($f);
				}
			}
			
			switch($query)
			{
				case 'user_add':
					$output = 0;
					if(!$user_exists)
					{
						$f = fopen($user_file,"w");
						$u = array();
						$u["lastactive"] = time();
						$u["created"] = time();
						$u["online"] = 0;
						$l = 10;$str = "";
						while($l--){$str.=chr(rand(65,90));}
						$u["verification_code"] = $str;
						if(fwrite($f,json_encode($u))){$output = 1;};
						fclose($f);
					}
				break;
				case 'user_exists':
					$output = $user_exists;
				break;
				case 'user_rename':
					$output = 0;
					if($user_exists)
					{
						$new_user_file = $users_directory.$new_username.".txt";
						if($user_exists && (!$new_user_exists||strtolower($new_username)==strtolower($username)))
						{
							if(rename($user_file,$new_user_file)){$output = 1;}
						}
					}
				break	;
				case 'user_set_password':
					$output = 0;
					if($user_exists)
					{
						$salt = $user_variables["verification_code"];
						$user_variables["password"] = crypt($password,CRYPT_BLOWFISH);
						$f = fopen($user_file,"w");
						if(fwrite($f,json_encode($user_variables)) != false){$output = 1;}
						fclose($f);
					}
				break;
				case 'user_compare_password':
					$output = 0;
					if($user_exists)
					{
						if(isset($user_variables["password"]))
						{
							$salt = $user_variables["verification_code"];
							if($user_variables["password"] == crypt($password,CRYPT_BLOWFISH))
							{
								$output = 1;
								$user_variables["lastactive"] = time();
								$f = fopen($user_file,"w");
								fwrite($f,json_encode($user_variables));
								fclose($f);
							}
						}
					}
				break;
				case 'user_delete':
					$output = 0;
					if($user_exists)
					{
						if(unlink($user_file)){$output = 1;}
					}
				break;
				case 'user_lastactive':
					$output = 0;
					if($user_exists)
					{
						$output = time()-$user_variables["lastactive"];
					}
				break;
				case 'user_online':
					$output = 0;
					if($user_exists)
					{
						if(time()-$user_variables["lastactive"]<$user_timeout)
						{
							if($user_variables["online"]==1)
							{
								$output = 1;
							}
						}
						else
						{
							$user_variables["online"] = 0;
							$f = fopen($user_file,"w");
							fwrite($f,json_encode($user_variables));
							fclose($f);
						}
					}
				break;
				case 'user_logout':
					$output = 0;
					if($user_exists)
					{
						$user_variables["online"] = 0;
						$f = fopen($user_file,"w");
						if(fwrite($f,json_encode($user_variables))){$output = 1;}
						fclose($f);
					}
				break;
				case 'user_login':
					$output = 0;
					if($user_exists)
					{
						$user_variables["lastactive"]=time();
						$user_variables["online"] = 1;
						$f = fopen($user_file,"w");
						if(fwrite($f,json_encode($user_variables))){$output = 1;}
						fclose($f);
					}
				break;
				case 'user_set_variable':
					$output = 0;
					if($user_exists)
					{
						if(isset($variable) && isset($value))
						{
							if($variable!="verification_code" && $variable!="online" && $variable!="password" && $variable!="created" && $variable!="lastactive") 
							{
								$user_variables[$variable] = $value;
								$f = fopen($user_file,"w");
								if(fwrite($f,json_encode($user_variables))){$output = 1;}
								fclose($f);
							}
						}
					}
				break;
				case 'user_get_variable':
					$output = 0;
					if($user_exists)
					{
						if($variable!="verification_code" && $variable!="password") 
						{
							if(isset($user_variables[$variable]))
							{
								$output = $user_variables[$variable];
							}
						}
					}
				break;
				case 'user_all_variable':
					$output = 0;
					if($user_exists)
					{
						unset($user_variables["verification_code"]);
						unset($user_variables["password"]);
						$output = json_encode($user_variables);
					}
				break;
				case 'user_exists_variable':
					$output = 0;
					if($user_exists)
					{
						if(isset($user_variables[$variable]))
						{
							$output = 1;
						}
					}
				break;
				case 'user_delete_variable':
					$output = 0;
					if($user_exists)
					{
						if(isset($user_variables[$variable]) && $variable!="verification_code" && $variable!="online" && $variable!="password" && $variable!="created" && $variable!="lastactive") 
						{
							unset($user_variables[$variable]);
							$f = fopen($user_file,"w");
							if(fwrite($f,json_encode($user_variables))){$output = 1;}
							fclose($f);
						}
					}
				break;
			}
		}
	}
}

echo($output);
?>