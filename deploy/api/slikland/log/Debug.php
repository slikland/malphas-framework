<?php
namespace slikland\log;

class Debug{
	private static $stack = NULL;
	private static $initTime = NULL;
	private static $prevTime = NULL;
	public static function log()
	{
		
	}

	public static function init()
	{
		if(!static::$stack)
		{
			static::$stack = array();
		}
	}

	public static function queue($message = NULL)
	{
		if(!DEBUG) return;
		static::init();
		$t = microtime(TRUE);
		if(!static::$prevTime)
		{
			static::$prevTime = $t;
			static::$initTime = $t;
		}
		$stack = debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 2);
		static::$stack[] = array('stack'=>@$stack[0], 'message'=>$message, 'time'=>$t - static::$prevTime, 'totaltime'=>$t - static::$initTime);
		static::$prevTime = $t;
	}

	public static function getStack()
	{
		return @static::$stack;
	}
}