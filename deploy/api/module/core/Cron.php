<?php
namespace module\core;

class Cron
{
	function update($setCron = TRUE)
	{
		$delimiter = '#---' . HOST . "\n\n\n" . '####' . HOST;
		$delimiterRE = '/(#\-{3}'.HOST.'.*?\n)[\s\S]*?(\n\#\#{3}'.HOST.')/';

		\slikland\fs\File::mkdir(DYNAMIC_PATH . 'cron/');
		shell_exec('crontab -l > ' . DYNAMIC_PATH . 'cron/edit.txt');
		$initContent = $cronContent = file_get_contents(DYNAMIC_PATH . 'cron/edit.txt');
		if(!preg_match($delimiterRE, $cronContent))
		{
			$cronContent .= "\n" . $delimiter;
		}
		$cron_id = Setting::get('cron_id');
		if(!$cron_id)
		{
			$cron_id = uid_encode(time());
			Setting::set('cron_id', $cron_id);
		}

		// $command = '* * * * * ' . "\t" . 'curl -s ' . API_URL . 'cron/execute/' . $cron_id;
		if($setCron)
		{
			$command = '*/5 * * * * ' . "\t" . 'curl -s ' . API_URL . 'cron/execute/' . $cron_id;
		}else{
			$command = '';
		}

		$cronContent = preg_replace($delimiterRE, '$1' . $command . '$2', $cronContent);
		$cronContent = preg_replace('/^\s*\n/', '', $cronContent);

		if($cronContent != $initContent)
		{
			file_put_contents(DYNAMIC_PATH . 'cron/edit.txt', $cronContent);
			shell_exec('crontab ' . DYNAMIC_PATH . 'cron/edit.txt');
		}
	}

	function reset()
	{
		$this->update(FALSE);
	}

	function execute($id, $services)
	{
		$cronId = Setting::get('cron_id');
		if($id != $cronId) return;

		foreach($services as $service=>$data)
		{
			@execute($service, $data, FALSE);
		}
	}
}
