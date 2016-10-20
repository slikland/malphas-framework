#namespace components

#import slikland.chart.Chart

class Chart extends chart.Chart
	@SELECTOR: 'chart'
	@ORDER: 0
	constructor:()->
		super
		@_templateNode = @element.templateNode
		@update(@_templateNode.data)
