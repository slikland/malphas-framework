<?php

namespace module;
include_once('vendors/aws/aws-autoloader.php');
use GuzzleHttp\Promise;
use GuzzleHttp\Promise\RejectedPromise;
use Aws\Credentials\CredentialProvider;
use Aws\S3\S3Client;
use Aws\Credentials\Credentials;

class AWS
{
	function test()
	{


// Use the default credential provider
// $provider = CredentialProvider::defaultProvider();

// Pass the provider to the client.
		$client = new S3Client([
		    'region'      => 'us-east-1',
		    'version'     => '2006-03-01',
		    'credentials' => new Credentials('AKIAIJCTJMNG5HFMYPWA', '8OjHK24iNLma92b9DusnFAOoeOtNg5tdBcjq4E19')
		]);
		// $s3Client = \Aws\S3\S3Client::factory(array(
		// 	'credentials' => array(
		// 		'key'    => 'AKIAIJCTJMNG5HFMYPWA',
		// 		'secret' => '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',
		// 	)
		// ));

		$bucket = 'staticqa.ofertasford.com.br';
		// $result = $client->getObject(array('Bucket'=>$bucket, 'Key'=>'data2.txt'));
		// var_dump(get_class($result['Body']));
		// var_dump((string)$result['Body']);
		// return;
		// var_dump($result->getBody());
		$result = $client->putObject(array(
		    'Bucket' => $bucket,
		    'Key'    => 'data2.txt',
		    'Body'   => 'Hello!'
		));
		var_dump($result);
		var_dump($client->getObjectUrl($bucket, 'data2.txt', '+10 minutes'));

		$iterator = $client->getIterator('ListObjects', array(
		    'Bucket' => 'staticqa.ofertasford.com.br'
		));

		foreach ($iterator as $object) {
		    echo $object['Key'] . "\n";
		}		if($client)

		return 1;
	}


	// This function CREATES a credential provider.
	public static function credentials()
	{
	    // This function IS the credential provider.
	    return function () {
	            return Promise\promise_for(
	                new Credentials('AKIAIJCTJMNG5HFMYPWA', '8OjHK24iNLma92b9DusnFAOoeOtNg5tdBcjq4E19')
	            );
	        // return new RejectedPromise(new CredentialsException('Credentials Not Found'));
	    };
	}	
}