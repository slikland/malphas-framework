<?php
namespace service;

class cron
{

	private $services = [
		// 'service/path'=>[data to send],
		'cron/exportRegistration'=>[],
	];

	/**
	@validate
		0: Data.required
	*/
	function execute($data)
	{
		$cronId = @$data[0];
		$cronModule = get_module('core/Cron');
		$t = time();
		$ct = Setting::get('cron_time');
		if(abs($t - $ct) < 60) return;
		Setting::set('cron_time', $t);
		$cronModule->execute($cronId, $this->services);

	}
	/**
	@permission
	*/
	function update($data)
	{
		$cronModule = get_module('core/Cron');
		$cronModule->update();
	}



	function exportRegistration()
	{
		$exportModule = get_module('ford/Exporter');
		$data = $exportModule->exportProcedure();

		if($data)
		{
			$mail = get_module('net/Mail');
			$emails = $exportModule->getExportEmails();

			if(count($emails > 0)){
				foreach($emails as $email)
				{
					if(empty($email)) continue;
					$data['list_url'] = CMS_URL . 'registration/exportList';
					$mail->sendTemplate($email, 'report_email', $data);
				}
			}
		}
	}

	// function verifyExpirePassword()
	// {
	//     $db = db();
	//     $data = $db->fetch_all('SELECT pk_cms_user, name, email FROM cms_user WHERE status = 1 AND password_changed <= DATE(NOW()) - INTERVAL 60 DAY');

	//     if(count($data)>0) {
	//         $mail = get_module('Mail');
	//         foreach ($data as $key => $value) {

	//             $fields['status'] = -1;
	//             if($updated = $db->updateFields('cms_user', $fields, 'pk_cms_user = ' . $value['pk_cms_user'])) {
	//                 $data['name'] = $value['name'];
	//                 $mail->sendTemplate($value['email'], 'notification_block_password', $data);
	//             }

	//         }

	//     }
	// }

	// function verifyPassword()
	// {
	//     $db = db();
	//     $data = $db->fetch_all('SELECT pk_cms_user, name, email FROM cms_user WHERE status = 1 AND password_changed <= DATE(NOW()) - INTERVAL 50 DAY');

	//     if(count($data)>0) {
	//         $mail = get_module('Mail');
	//         foreach ($data as $key => $value) {
	//             $data['name'] = $value['name'];
	//             $mail->sendTemplate($value['email'], 'notification_expire_email', $data);
	//         }

	//     }
	// }
}
