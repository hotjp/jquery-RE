;(function($){
	$.RuleEditor = function(selector,options){
		var fn = $.RuleEditor.prototype,
		_RE = this;
		fn.defaults = {
			// 初始化条件Json
			ruleExprs: [],
			// 当前条件Json
			ruleExprs_bak:[],
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
									// '<li class="RE_rule">'+
									// 	'<dl class="RE_item">'+
									// 		'<dt class="RE_rule_tit">'+
									// 			'<input data-delete="rule"  type="button" value="删除">'+
									// 		'</dt>'+
									// 		'<dd class="RE_rule_body">'+
									// 			'<div class="rule_fliter">'+
									// 				'<select name="" id="">'+
									// 					'<option value="0">0</option>'+
									// 				'</select>'+
									// 			'</div>'+
									// 			'<div class="rule_operator">'+
									// 				'<select name="" id="">'+
									// 					'<option value="0">0</option>'+
									// 				'</select>'+
									// 			'</div>'+
									// 			'<div class="rule_value">'+

									// 			'</div>'+
									// 		'</dd>'+
									// 	'</dl>'+
									// '</li>'+
								'</ul>'+
							'</dd>'+
						'</dl>'+
						'</div>',
				group: '<dl class="RE_group">'+
							'<dt class="RE_group_tit">'+
								'<div class="group_conditions">'+
									'<input data-conj="AND" type="button" value="AND">'+
									'<input data-conj="OR" type="button" value="OR">'+
								'</div>'+
								'<input data-add="rule" type="button" value="添加条件">'+
								'<input data-add="group" type="button" value="添加组">'+
								'<input data-delete="group"  type="button" value="删除">'+
							'</dt>'+
							'<dd class="RE_group_body">'+
								'<ul class="RE_group_list">'+
									// '<li class="RE_rule">'+
									// 	'<dl class="RE_item">'+
									// 		'<dt class="RE_rule_tit">'+
									// 			'<input data-delete="rule"  type="button" value="删除">'+
									// 		'</dt>'+
									// 		'<dd class="RE_rule_body">'+
									// 			'<div class="rule_field">'+
									// 				'<select name="" id="">'+
									// 					'<option value="0">0</option>'+
									// 				'</select>'+
									// 			'</div>'+
									// 			'<div class="rule_op">'+
									// 				'<select name="" id="">'+
									// 					'<option value="0">0</option>'+
									// 				'</select>'+
									// 			'</div>'+
									// 			'<div class="rule_values">'+

									// 			'</div>'+
									// 		'</dd>'+
									// 	'</dl>'+
									// '</li>'+
								'</ul>'+
							'</dd>'+
						'</dl>',
				rule:'<li class="RE_rule">'+
						'<dl class="RE_item">'+
							'<dt class="RE_rule_tit">'+
								'<div class="rule_conditions">'+
									'<input data-conj="AND" type="button" value="AND">'+
									'<input data-conj="OR" type="button" value="OR">'+
								'</div>'+
								'<input data-delete="rule"  type="button" value="删除">'+
							'</dt>'+
							'<dd class="RE_rule_body">'+
								'<div class="rule_field">'+
									'<select name="" id="">'+
										'<option value="0">0</option>'+
									'</select>'+
								'</div>'+
								'<div class="rule_op">'+
									'<select name="" id="">'+
										'<option value="0">0</option>'+
									'</select>'+
								'</div>'+
								'<div class="rule_values">'+

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
			getRE:function(){
				return _RE;
			},
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
				_RE.el.on('click','[data-condition]',function(){
					
				})
				.on('click','[data-add]',function(){
					Util.add(this);
				})
				.on('click','[data-delete]',function(){
					Util.remove(this);
				})
			},
			setRules:function(el,rules){
				var _el = el,_rules = rules;
				var _pos = _el.find('.RE_group_list:first');
				for(var i = 0; i < _rules.length; i++){
					if('object' == typeof _rules[i].exprs){
						// 组
						var dom = this.makeDom($(_RE.config.tmp['group']),_rules[i],'group');
						_pos.append(dom);
						this.setRules(dom,_rules[i].exprs);
					}else{
						// 条件
						var dom = this.makeDom($(_RE.config.tmp['rule']),_rules[i],'rule');
						_pos.append(dom)
					}
				}

			},
			makeDom: function(dom,rules,type){
				var elRule = $.extend({},rules),_this = this;
				if(type == 'group'){
					// 组
					elRule.exprs = [];
					dom.attr('data-rule',JSON.stringify(elRule))
						// conj的状态
						.find('[data-conj = '+ rules.conj +']').addClass('active')
					
				}else if(type == 'rule'){
					// 条件
					dom.attr('data-rule',JSON.stringify(elRule));
					// conj的状态
					dom.find('[data-conj = '+ rules.conj +']').addClass('active');
					// field：select（k:dbName,val:name）
					dom.find('.'+ type + '_field').html(_this.makeField(rules.field));
					// op: select(k)
					var dataSource = dom.find('.'+ type + '_field option:selected').data('datasource');
					if(!dataSource){
						return;
					}
					var opSelect = _this.makeOp(dataSource,rules.op)
					dom.find('.'+ type + '_op').html(opSelect);
					// values 
					var op = dom.find('.'+ type + '_op option:selected').val();
					dom.find('.'+ type + '_values').html(_this.makeValues(op,rules.values));
				}
				
				return dom;
			},
			makeField: function(field){
				var _RE = this.getRE(),opts = ['<option value="0">请选择</option>'];
				var config = _RE.config;
				for (var i = 0; i < config.sysModelFields.length; i++) {
					var selected = '';
					if(config.sysModelFields[i].dbName == field){
						selected = 'selected="selected"'
					}
					var opt = '<option data-dataSource="'+ config.sysModelFields[i].dataSource +'" '+ selected +' value="'+ config.sysModelFields[i].dbName +'">'+ config.sysModelFields[i].name +'</option>';
					opts.push(opt);
				};
				return $('<select></select>').append(opts.join(''));
			},
			makeOp: function(type,op){
				var _RE = this.getRE(),opts = [];
				var config = _RE.config;
				type = type.split(':')[0];
				optData = config.DATA_SOURCE_OPERATORS[type];
				if('string' == typeof optData){
					optData = (function(){
						var arr = [];
						for (var i = 0; i < config.OPERATORS.length; i++) {
							arr[i] = config.OPERATORS[i].name
						};
						return arr;
					})();
				}
				for (var i = 0; i < optData.length; i++) {
					var selected = '';
					if(optData[i] == op){
						selected = 'selected="selected"';
					}
					var opt = '<option '+ selected +' value="'+ optData[i] +'">'+ optData[i] +'</option>';
					opts.push(opt);
				};
				return $('<select></select>').append(opts.join(''));
			},
			makeValues:function(op,values){
				var _RE = this.getRE(),opts = [];
				var config = _RE.config;
				var valueNum = (function(OPS,op){
						for (var i = 0; i < OPS.length; i++) {
							if(OPS[i].name == op){
								return OPS[i].values
							}
						};
					})(config.OPERATORS,op);
				return (function(len,values){
					var html = [],btn='',addBtn = '<input type="button" value="增加" />';
						if ('string' == typeof len) {
							len = values.length ? values.length : 1;
							btn = addBtn;
						};
						for (var i = 0; i < len; i++) {
							html[i] = '<input data-value="'+ values[i].value +'" type="text" value="'+ values[i].text +'">';
						};
						html.push(btn);
					return html.join('')
				})(valueNum,values);

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
				if (!_RE.config.ruleExprs_bak.length && _RE.config.ruleExprs.length) {
					_RE.config.ruleExprs_bak = $.extend([],_RE.config.ruleExprs);
				};
				this.setRules(_RE.el,_RE.config.ruleExprs);
				return this;
			},
			setRules: function(el,rules){
				Util.setRules(el,rules);
			},
			reset: function(){
				_RE.config.ruleExprs = $.extend([],_RE.config.ruleExprs_bak);
				this.setRules(_RE.el,_RE.config.ruleExprs);
			},
			getRules: function(){

			},
			distory: function(){
				Util.distory();
			}
		});
		return this;
	}
	
})(jQuery);