;(function($){
	$.RuleEditor = function(selector,options){
		var fn = $.RuleEditor.prototype,
		_this = this;
		fn.defaults = {
			/* -------------- 常量 -------------- */
			// 数据源类型所支持运算符关系，"*"表示支持所有运算符
			DATA_SOURCE_OPERATORS: {
				NUMBER: ["=", "<>", ">", "<", ">=", "<=", "BETWEEN", "NOT BETWEEN", "IN", "NOT IN"],
				TEXT: "*",
				DATE: ["=", "<>", ">", "<", ">=", "<=", "BETWEEN", "NOT BETWEEN"],
				MASTERDATA: ["=", "<>", ">", "<", ">=", "<=", "BETWEEN", "NOT BETWEEN", "IN", "NOT IN"]
			},
			// 运算符清单
	  		// vaulues -> 右值数量，数值代表精确数量，"*"代表任意多个值，但至少要有一个
			OPERATORS: [
				{name: "=",values: 1}, 
				{name: "<>",values: 1}, 
				{name: ">",values: 1}, 
				{name: "<",values: 1}, 
				{name: ">=",values: 1}, 
				{name: "<=",values: 1}, 
				{name: "LIKE",values: 1}, 
				{name: "NOT LIKE",values: 1}, 
				{name: "BETWEEN",values: 2}, 
				{name: "NOT BETWEEN",values: 2}, 
				{name: "IN",values: "*"}, 
				{name: "NOT IN",values: "*"}
			],
			// 条件Json
			ruleExprs: [],
			// 代码追加位置
			selector: 'body',
			// 盒模型
			blockHtml:'<div class="RuleEditor"></div>',
			// 规则dom
			ruleHtml: {
				group:'',

			}

		};
		
		if(arguments.length == 2){
			this.config = $.extend({}, this.defaults, options, {selector: arguments[0]});
		}else{
			this.config = $.extend({}, this.defaults, options);
		}
		
		
		var Util = {
			construction :function(){
				_this.id = 'RE' +　Math.floor(Math.random() * 100000);
				$(_this.config.selector).append($(_this.config.blockHtml).attr('id',_this.id));
			},
			bindEvent: function(){
				$('#' +　_this.id).on('click.RuleEditor',function(){
					alert(1);
				})
			},
			distory: function(){
				$('#' +　_this.id).remove();
			}
		}
		fn = $.extend(fn,{
			version: '0.0.1',
			init: function() {
				Util.construction();
				Util.bindEvent();
				return this;
			},
			distory: function(){
				Util.distory();
				return {};
			}
		});

		return this;
	}
	
})(jQuery);