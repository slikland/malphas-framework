<?php
namespace module;

class Mail
{
	private $_settings = array(
		'name' => 'Name',
		'email' => 'Email',
		'user' => 'User',
		'pass' => 'Pass',
		'server' => 'Server',
		'port' => 'Port',
	);

	private $_name = NULL;

	public function name()
	{
		if(!$this->_name)
		{
			$name = (String)__CLASS__;
			$name = preg_replace('/.*?([^\\\\]+)$/', '$1', $name);
			$this->_name = $name;
		}
		return $this->_name;
	}

	function getSettings($fullObject = FALSE)
	{
		$prefix = $this->name();
		$settings = array();
		foreach($this->_settings as $k=>$v)
		{
			if($fullObject)
			{
				$settings[] = array('name'=>$prefix . '-' . $k, 'value'=>Setting::get($prefix . '-' . $k), 'label'=>$v);
			}else{
				$settings[$k] = Setting::get($prefix . '-' . $k);
			}
		}
		return $settings;
	}

	function setSettings($data)
	{
		$prefix = $this->name();
		foreach($this->_settings as $k=>$v)
		{
			$value = @$data[$k];
			Setting::set($prefix . '-' . $k, $value);
		}
	}

	function __construct()
	{
		require 'vendors/phpmailer/PHPMailerAutoload.php';
		$this->removeImages = array();
	}

	private function _initMail()
	{
		$settings = $this->getSettings();

		if(!@$settings['server'] || empty($settings['server'])) return FALSE;

		$mail = new PHPMailer();
		// $mail->SMTPDebug  = 2;
		$mail->isSMTP();
		$mail->CharSet = 'UTF-8';
		$mail->Host = $settings['server'];
		$mail->SMTPAuth = true;
		$mail->Username = $settings['user'];
		$mail->Password = $settings['pass'];

		$types = array('465'=>'ssl', '587'=>'tls');

		$port = $settings['port'];
		$mail->Port = $settings['port'];
		if(isset($types[$port]))
		{
			$mail->SMTPSecure = $types[$port];
		}

		$mail->setFrom($settings['email'], $settings['name']);
		return $mail;
	}

	function send($to, $subject, $message, $replaceData = NULL, $html = TRUE)
	{
		$mail = $this->_initMail();
		if(!$mail) return;
		$addresses = $this->getAddresses($to);
		foreach($addresses as $address)
		{
			$mail->addAddress($address[0], $address[1]);
		}
		if($html)
		{
			$mail->isHTML(TRUE);
		}
		$this->mail = $mail;

		if($replaceData)
		{
			$message = $this->replacePlaceholders($message, $replaceData);
		}

		$message = preg_replace_callback('/\{image\=([^\}]*)\}/', array($this, 'replaceMessage'), $message);
		$message = preg_replace('/\{([^\}]*)\}/', '', $message);
		$this->mail = NULL;

		$mail->Subject = $subject;
		$mail->Body = $message;
		$sent = $mail->send();

		foreach($this->removeImages as $image)
		{
			unlink($image);
		}

		return (bool)$sent;
	}

	function getTemplateByName($template)
	{
		$db = db();
		$email = $db->fetch_one('SELECT pk_email_template id, name, subject, html FROM email_template WHERE name = ? OR pk_email_template = ?', array($template, $template));
		return $email;
	}

	function sendTemplate($to, $template, $data = array())
	{
		$db = db();
		$email = $db->fetch_one('SELECT * FROM email_template WHERE name = ? OR pk_email_template = ?', array($template, $template));
		if(!$email)
		{
			throw new ServiceError('Email template '.$template.' not found.');
		}
		$subject = $email['subject'];
		if($data)
		{
			$subject = $this->replacePlaceholders($subject, $data);
		}
		$subject = preg_replace('/\{([^\}]*)\}/', '', $subject);

		return $this->send($to, $subject, $email['message'], $data, $email['html']);

	}

	private function getAddresses($addresses)
	{
		if(!is_array($addresses))
		{
			$addresses = array($addresses);
		}
		$response = array();
		$addresses = \slikland\utils\ArrayUtils::flatten($addresses);
		$l = count($addresses);
		$i = -1;
		while(++$i < $l)
		{
			$name = $email = $addresses[$i];
			if(\validation\String::email($email))
			{
				if(isset($addresses[$i+1]))
				{
					$value = $addresses[$i + 1];
					if(!\validation\String::email($value))
					{
						$name = $value;
						$i++;
					}
				}
				$response[] = array($email, $name);
			}
		}
		return $response;
	}

	private function replaceMessage($matches)
	{
		$image = $matches[1];
		$name = explode('/', $image);
		$name = $name[count($name) - 1];
		$path = $image;
		$removeAfterUse = FALSE;
		if(!preg_match('/^http/', $path))
		{
			$path = ROOT_PATH . $path;
		}else{
			$image = file_get_contents($path);
			\slikland\fs\File::mkdir(DYNAMIC_PATH . 'tmp/');
			$path = DYNAMIC_PATH . 'tmp/' . $name;
			file_put_contents($path, $image);
			$this->removeImages[] = $path;
		}
		$this->mail->AddEmbeddedImage($path, $name);
		return 'cid:' . $name;
	}

	function replacePlaceholders($message, $data)
	{
		$this->replaceData = $data;
		$message = preg_replace_callback('/\{([^\{\}]*)\}/', array($this, 'replacePlaceholder'), $message);
		$this->replaceData = NULL;
		return $message;
	}

	private function replacePlaceholder($matches)
	{
		if(isset($this->replaceData[$matches[1]]))
		{
			return $this->replaceData[$matches[1]];
		}
		return $matches[0];
	}


}
