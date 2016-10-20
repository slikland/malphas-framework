<?php
namespace slikland\message;
class SimpleMail{
	public static function send($params)
	{
		$mail = new SimpleMail($params);
		return $mail->send;
	}

	/*
	*	Pass a object with following content
	*	from:
	*	replyTo:
	*	message:
	*	subject:
	*	to:
	*/
	function __construct($params)
	{
		$this->to = '';
		$this->subject = '';
		$this->message = '';
		$this->headers = array();
		$this->setHeader('MIME-version', '1.0');
		$this->setHeader('Content-type', 'text/html; charset=utf-8');
		if(isset($params['from']))
		{
			$this->setHeader('From', $params['from']);
			$this->setHeader('Reply-To', $params['from']);
			$this->setHeader('Return-Path', $params['from']);
		}
		if(isset($params['replyTo']))
		{
			$this->setHeader('Reply-To', $params['replyTo']);
			$this->setHeader('Return-Path', $params['replyTo']);
		}
		if(isset($params['to']))
		{
			$this->to = $params['to'];
		}
	}

	function send()
	{
		if(empty($this->to)){
			throw new Error("To is not defined", 1);
		}
		if(empty($this->subject)){
			throw new Error("Subject is not defined", 1);
		}
		if(empty($this->message)){
			throw new Error("message is not defined", 1);
		}
		$header = '';
		foreach($this->headers as $k=>$v)
		{
			$header .= $k . ': ' . $v . "\n";
		}
		return mail($this->to, $this->subject, $this->message, $header);
	}

	function setHeader($name, $value)
	{
		$this->headers[$name] = $value;
	}

	function getHeader($name)
	{
		return $this->headers[$name];
	}

	function attachFile($filename, $file)
	{

	}

	function __get($name)
	{
		switch($name)
		{
			case 'to':
				return $this->to;
			case 'from':
				return $this->getHeader('From');
			case 'subject':
				return $this->subject;
			case 'message':
				return $this->message;
			default:
				break;
		}

	}

	function __set($name, $value)
	{
		switch($name)
		{
			case 'to':
				$this->to = $value;
				break;
			case 'from':
				$this->setHeader('From', $value);
				$this->setHeader('Reply-To', $value);
				$this->setHeader('Return-Path', $value);
				break;
			case 'subject':
				$this->subject = $value;
				break;
			case 'message':
				$this->message = $value;
				break;
			default:
				break;
		}

	}
}

?>