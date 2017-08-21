<?php
namespace module;
require_once 'vendors/PHPExcel.php';

class ExcelExporter extends \PHPExcel
{
	function __construct($title = '')
	{
		$this->hasHeader = FALSE;
		parent::__construct();
		$this->getProperties()
			->setCreator("Slikland CMS")
			->setLastModifiedBy("Slikland CMS")
			->setTitle($title)
			->setSubject($title)
			->setDescription($title);
		$this->setActiveSheet();
		$this->outputFormat = 'Excel2007';
		$this->separator = NULL;
		$this->enclosure = NULL;
	}

	function setOutputFormat($format, $separator = '|')
	{
		if(preg_match('/^xls/i', $format))
		{
			$this->outputFormat = 'Excel2007';
		}else if(preg_match('/^(csv)/i', $format))
		{
			$this->outputFormat = 'CSV';
		}else if(preg_match('/^(txt)/i', $format))
		{
			$this->outputFormat = 'CSV';
			if($separator)
			{
				$this->separator = $separator;
				$this->enclosure = '';
			}
		}
	}

	function setActiveSheet($index = 0)
	{
		$this->setActiveSheetIndex(0);
		$this->activeSheet = $this->getActiveSheet();
	}

	function setHeader($header)
	{
		$sheet = $this->activeSheet;
		$this->hasHeader = TRUE;
		$i = 0;
		foreach($header as $item)
		{
			$sheet->getStyleByColumnAndRow($i, 1)->getFont()->setBold(TRUE);
			$sheet->setCellValueByColumnAndRow($i++, 1, $item);

		}
	}

	function addRows($rows)
	{
		$sheet = $this->activeSheet;
		$i = 0;
		$y = 1;
		if($this->hasHeader)
		{
			$y += 1;
		}
		foreach($rows as $row)
		{
			$i = 0;
			foreach($row as $item)
			{
				$sheet->getCellByColumnAndRow($i, $y)->setValueExplicit(trim($item), PHPExcel_Cell_DataType::TYPE_STRING);
				if(strpos($item, 'http') === 0) $sheet->getCellByColumnAndRow($i, $y)->getHyperlink()->setUrl($item);
				$i++;
			}
			$y++;
		}
	}

	function save($fileName = 'Export.xlsx', $path = NULL)
	{	
		$objWriter = PHPExcel_IOFactory::createWriter($this, $this->outputFormat);
		if(!is_null($this->separator))
		{
			$objWriter->setDelimiter($this->separator);
			if(!is_null($this->enclosure))
			{
				$objWriter->setEnclosure($this->enclosure);
			}
		}

		if($path)
		{
			$objWriter->save($path . $fileName);
		}else{
			header('Content-Type: application/vnd.ms-excel');
			header('Content-Disposition: attachment;filename="'.$fileName.'"');
			header('Cache-Control: max-age=0');
			header('Cache-Control: max-age=1');

			header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
			header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
			header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
			header ('Pragma: public'); // HTTP/1.0
			$objWriter->save('php://output');
			die();
		}
	}
}
