;(function($){
	$.RuleEditor = function(selector,options){
		var fn = $.RuleEditor.prototype,
		_RE = this;
		fn.defaults = {
			// 条件Json
			ruleExprs: [],
			// 代码追加位置
			selector: 'body',
			// 模型
			tmp:{
				block:'<div class="RuleEditor">'+
						'<dl class="RE_group">'+
							'<dt class="RE_group_tit">'+
								'<div class="group_conditions">'+
									'<input data-condition="AND" type="button" value="AND">'+
									'<input data-condition="OR" type="button" value="OR">'+
								'</div>'+
								'<input data-add="rule" type="button" value="添加条件">'+
								'<input data-add="group" type="button" value="添加组">'+
							'</dt>'+
							'<dd class="RE_group_body">'+
								'<ul class="RE_group_list">'+
									'<li class="RE_rule">'+
										'<dl class="RE_item">'+
											'<dt class="RE_rule_tit">'+
												'<input data-delete="rule"  type="button" value="删除">'+
											'</dt>'+
											'<dd class="RE_rule_body">'+
												'<div class="rule_fliter">'+
													'<select name="" id="">'+
														'<option value="0">0</option>'+
													'</select>'+
												'</div>'+
												'<div class="rule_operator">'+
													'<select name="" id="">'+
														'<option value="0">0</option>'+
													'</select>'+
												'</div>'+
												'<div class="rule_value">'+

												'</div>'+
											'</dd>'+
										'</dl>'+
									'</li>'+
								'</ul>'+
							'</dd>'+
						'</dl>'+
						'</div>',
				group: '<dl class="RE_group">'+
							'<dt class="RE_group_tit">'+
								'<div class="group_conditions">'+
									'<input data-condition="AND" type="button" value="AND">'+
									'<input data-condition="OR" type="button" value="OR">'+
								'</div>'+
								'<input data-add="rule" type="button" value="添加条件">'+
								'<input data-add="group" type="button" value="添加组">'+
								'<input data-delete="group"  type="button" value="删除">'+
							'</dt>'+
							'<dd class="RE_group_body">'+
								'<ul class="RE_group_list">'+
									'<li class="RE_rule">'+
										'<dl class="RE_item">'+
											'<dt class="RE_rule_tit">'+
												'<input data-delete="rule"  type="button" value="删除">'+
											'</dt>'+
											'<dd class="RE_rule_body">'+
												'<div class="rule_fliter">'+
													'<select name="" id="">'+
														'<option value="0">0</option>'+
													'</select>'+
												'</div>'+
												'<div class="rule_operator">'+
													'<select name="" id="">'+
														'<option value="0">0</option>'+
													'</select>'+
												'</div>'+
												'<div class="rule_value">'+

												'</div>'+
											'</dd>'+
										'</dl>'+
									'</li>'+
								'</ul>'+
							'</dd>'+
						'</dl>',
				rule:'<li class="RE_rule">'+
						'<dl class="RE_item">'+
							'<dt class="RE_rule_tit">'+
								'<input data-delete="rule"  type="button" value="删除">'+
							'</dt>'+
							'<dd class="RE_rule_body">'+
								'<div class="rule_fliter">'+
									'<select name="" id="">'+
										'<option value="0">0</option>'+
									'</select>'+
								'</div>'+
								'<div class="rule_operator">'+
									'<select name="" id="">'+
										'<option value="0">0</option>'+
									'</select>'+
								'</div>'+
								'<div class="rule_value">'+

								'</div>'+
							'</dd>'+
						'</dl>'+
					'</li>'
			},

			// 规则套件
			exprTmp:{
				base:{
					conj: 'AND'
				},
				group:{
					exprs: []
				},
				rule:{
					field: '',
					op: '=',
					values: []
				}
			},
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
			]
		};
		
		if(arguments.length == 2){
			this.config = $.extend({}, this.defaults, options, {selector: arguments[0]});
		}else{
			this.config = $.extend({}, this.defaults, arguments[0]);
		}
		
		// 功能套件
		var Util = {
			construction :function(){
				_RE.id = 'RE' +　Math.floor(Math.random() * 100000);
				$(_RE.config.selector).append($(_RE.config.tmp.block).attr('id',_RE.id));
				_RE.el = $('#' + _RE.id);
			},
			add:function(el){
				var type = $(el).data('add') ? $(el).data('add') : 'rule';
				$(el).closest('.RE_group').find('.RE_group_list:first').append(_RE.config.tmp[type]);
			},
			remove: function(el){
				var type = $(el).data('delete') ? $(el).data('delete') : 'rule';
				$(el).closest('.RE_'+ type).remove();
				// _RE.remove(type);
			},
			bindEvent: function(){
				// $('#' +　_RE.id)
				$('body').on('click','[data-condition]',function(){
					
				})
				.on('click','[data-add]',function(){
					Util.add(this);
				})
				.on('click','[data-delete]',function(){
					Util.remove(this);
				})
			},
			setRules:function(){
				
			},
			distory: function(){
				_RE.el.remove();
			}
		}
		// 原型方法
		$.extend(fn,{
			version: '0.0.1',
			init: function() {
				Util.construction();
				Util.bindEvent();
				Util.setRules();
				return this;
			},
			setRules: function(){

			},
			getRules: function(){

			},
			get: function(){},
			set: function(){},
			distory: function(){
				Util.distory();
			}
		});
		return this;
	}
	
})(jQuery);