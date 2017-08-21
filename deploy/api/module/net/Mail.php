<?php
namespace module\net;

class Mail extends \slikland\core\pattern\Singleton
{
	private $_settings = array(
		'subject'=>'Assunto',
		'email'=>'E-mail',
		'name'=>'Nome',
		'user'=>'Usuário',
		'pass'=>'Senha',
		'server'=>'Servidor SMTP',
		'port'=>'Porta',
	);

	private $_name = NULL;

	function __construct()
	{
		$this->_mail = NULL;
	}

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

	private function _initMail()
	{
		if($this->_mail)
		{
			$this->_mail->clearAddresses();
			$this->_mail->clearAttachments();
			$this->_mail->clearCustomHeaders();
			$this->_mail->clearAllRecipients();
			return $this->_mail;
		}
		require 'vendors/phpmailer/PHPMailerAutoload.php';
		$mail = new PHPMailer();

		$settings = $this->getSettings();
		// $mail->SMTPDebug  = 2;
		$mail->isSMTP();
		$mail->CharSet = 'UTF-8';
		$mail->Host = $settings['server'];
		$mail->SMTPAuth = true;
		$mail->Username = $settings['user'];
		$mail->Password = $settings['pass'];

		$types = array('465'=>'ssl', '587'=>'tls', '2465'=>'ssl', '2587'=>'tls');

		$port = $settings['port'];
		$mail->Port = $port;
		if(isset($types[$port]))
		{
			$mail->SMTPSecure = $types[$port];
		}

		$mail->setFrom($settings['email'], $settings['name']);
		$this->_mail = $mail;
		return $mail;
	}

	function send($to, $subject, $message, $html = TRUE)
	{
		$mail = $this->_initMail();
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

		$pathRE = preg_replace('/\//', '\\/', ROOT_PATH);
		$message = preg_replace_callback('/([\'\"])('.$pathRE.'[^\1]*?\/([^\/\1\.]+?)(\.[^\.\1]+?)?)\1/', array($this, 'replaceImages'), $message);

		// if($replaceData)
		// {
		// 	$message = $this->replacePlaceholders($message, $replaceData);
		// }

		// $message = preg_replace_callback('/\{image\=([^\}]*)\}/', array($this, 'replaceMessage'), $message);
		// $message = preg_replace('/\{([^\}]*)\}/', '', $message);
		$this->mail = NULL;

		$mail->Subject = $subject;
		$mail->Body = $message;
		$sent = $mail->send();

		// foreach($this->removeImages as $image)
		// {
		// 	unlink($image);
		// }

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
			throw new Error('Email template '.$template.' not found.');
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
			if(\validation\StringValidation::email($email))
			{
				if(isset($addresses[$i+1]))
				{
					$value = $addresses[$i + 1];
					if(!\validation\StringValidation::email($value))
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

	private function replaceImages($matches)
	{
		if(file_exists($matches[2]))
		{
			$this->mail->AddEmbeddedImage($matches[2], $matches[3]);
			return 'cid:' . $matches[3];
		}
		return $matches[0];
	}

}
