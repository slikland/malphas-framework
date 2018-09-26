<?php
namespace core\Utils;


class Filter
{
    public static function vetor($keysValid, $toFilter)
    {
        $filtered = [];

        foreach ($keysValid as $key) {

            if(!empty($toFilter[$key])) {
                $filtered[$key] = $toFilter[$key];
            }
        }

        return $filtered;
    }

}