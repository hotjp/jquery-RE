;(function($){
	$.RuleEditor = function(selector,options){
		var fn = $.RuleEditor.prototype,
		_RE = this;
		fn.defaults = {
			// 初始化条件Json
			ruleExprs: [],
			// 代码追加位置
			selector: 'body',
			// 模型
			tmp:{
				block:'<div class="RuleEditor ">'+
						'<dl class="RE_group">'+
							'<dt class="RE_group_tit">'+
								// '<div class="group_conditions">'+
								// 	'<input data-condition="AND" type="button" value="AND">'+
								// 	'<input data-condition="OR" type="button" value="OR">'+
								// '</div>'+
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
									// '<select name="" id="">'+
									// 	'<option value="0">0</option>'+
									// '</select>'+
								'</div>'+
								'<div class="rule_values">'+

								'</div>'+
							'</dd>'+
						'</dl>'+
					'</li>'
			},

			// 规则套件
			exprTmp:{
				group:{
					conj: 'AND',
					exprs: []
				},
				rule:{
					conj: 'AND',
					field: '',
					op: '=',
					values: []
				}
			},
			/* -------------- 常量 -------------- */
			// 所有数字类字段
			NUMBER_TYPE:['NUMBER'],
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
			// 找到当前条件事件触发行
			getEventEl:function(el){
				if($(el).closest('.RE_rule').length){
					return $(el).closest('.RE_rule');
				}
				return $(el).closest('.RE_group');
			},
			// 带有data-rule的element ，key ，val
			changeRule:function(el,key,val){
				var ruleStr = el.attr('data-rule'),
					val = val ? val : '';
					rule = JSON.parse(ruleStr);
					rule[key] = val;
					el.attr('data-rule',JSON.stringify(rule));
			},
			// 带有data-rule的rule element 生成规则到el
			getRule:function(el){
				var _RE = this.getRE();
				var ruleTmp = _RE.config.exprTmp.rule;
				var rule = $.extend({},ruleTmp);
			
				rule.conj = el.find('input.active').attr('data-conj');
				rule.field = el.find('.rule_field option:selected').val();
				rule.op = el.find('.rule_op option:selected').val();
				rule.values = (function(el){
						function toNumber(el,val,needChange){
							if(!needChange){
								return val;
							}
							if(val != parseFloat(val)){
								$(el).addClass('error');
								return parseFloat(val);
							}else{
								$(el).removeClass('error');
								return parseFloat(val);
							}
							
						}
					var values = [],needChange = false;
					if(-1 != $.inArray(el.find('.rule_field option:selected').attr('data-dbType'),_RE.config.NUMBER_TYPE)){
						needChange = true
					}
					el.find('.rule_values input[type=text]').each(function(i,el){
						// TODO: 项目中正确的赋值后在这取值$(el).attr('data-text')，暂时用value填充text
						
						values[i] = {
							value: toNumber(el,$(el).val(),needChange),
							text: toNumber(el,$(el).val(),needChange)
						}
					})
					return values;
				})(el);
				el.attr('data-rule',JSON.stringify(rule));
			},
			getJson:function(el){
				el = el ? $(el) : _RE;
				var _this = this,arr=[];
				el.find('.RE_group_list:first').children().each(function(){
					var rule = JSON.parse($(this).attr('data-rule'));
					if('object' == typeof rule.exprs){
						rule.exprs = _this.getJson(this);
					}
					arr.push(rule);
				});
				return arr;
			},
			// 获取实例化后对象
			getRE:function(){
				return _RE;
			},
			// 构建外层结构
			construction :function(){
				_RE.id = 'RE' +　Math.floor(Math.random() * 100000);
				$(_RE.config.selector).append($(_RE.config.tmp.block).attr('id',_RE.id));
				_RE.el = $('#' + _RE.id);
			},
			// 新增组或条件
			add:function(el){
				var type = $(el).data('add') ? $(el).data('add') : 'rule',
				_this = this;

				$(el).closest('.RE_group').find('.RE_group_list:first').append(
					_this.makeDom(
						$(_RE.config.tmp[type]).attr('data-rule',JSON.stringify(_RE.config.exprTmp[type])),
						_RE.config.exprTmp[type],
						type
						)
					);

			},
			// 删除当前组或条件
			remove: function(el){
				var type = $(el).data('delete') ? $(el).data('delete') : 'rule';
				$(el).closest('.RE_'+ type).remove();
				// _RE.remove(type);
			},
			// 绑定事件
			bindEvent: function(){
				var _this = this;
				// and||or
				_RE.el.on('click','[data-conj]',function(){
					$(this).addClass('active').siblings().removeClass('active');
					_this.changeRule(_this.getEventEl(this),'conj',$(this).attr('data-conj'));
					
				})
				// 新增组或条件
				.on('click','[data-add]',function(){
					Util.add(this);
				})
				// 删除组或条件
				.on('click','[data-delete]',function(){
					Util.remove(this);
				})
				// 增加一个values
				.on('click','.add_ipt',function(){
					var el = _this.getEventEl(this);
					var rule = JSON.parse(el.attr('data-rule'));
					rule.values.push({value:'',text:''});
					_this.makeDom(el,rule,'rule');
				})
				// 删除一个values
				.on('click','.del_ipt',function(){
					var el = _this.getEventEl(this);
					$(this).prev().remove();
					_this.getRule(el);
					_this.makeDom(el,JSON.parse(el.attr('data-rule')),'rule');
				})
				// field切换事件
				.on('change','.rule_field select',function(){
					var el = _this.getEventEl(this);
					_this.changeRule(el,'field',$(this).val());
					_this.makeDom(el,JSON.parse(el.attr('data-rule')),'rule');
					_this.getRule(el)
				})
				// op切换事件
				.on('change','.rule_op select',function(){
					var el = _this.getEventEl(this);
					_this.changeRule(el,'op',$(this).val());
					_this.makeDom(el,JSON.parse(el.attr('data-rule')),'rule');
					_this.getRule(el)
				})
				// values input onchange事件
				.on('change','.rule_values input[type=text]',function(){
					var el = _this.getEventEl(this);
					_this.getRule(el)
				})
			},
			// 设置数据
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
			// 构建组或条件行
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
					dom.find('.'+ type + '_field').html(_this.makeField(rules.field,rules));
					// op: select(k)
					var dataSource = dom.find('.'+ type + '_field option:selected').attr('data-datasource');
					if(!dataSource){
						return dom;
					}
					var opSelect = _this.makeOp(dataSource,rules.op)
					dom.find('.'+ type + '_op').html(opSelect);
					// values 
					var op = dom.find('.'+ type + '_op option:selected').val();
					dom.find('.'+ type + '_values').attr('data-dbType',rules.dbType).html(_this.makeValues(op,rules.values));
				}
				
				return dom;
			},
			// 条件field字段
			makeField: function(field,rules){
				var _RE = this.getRE(),opts = ['<option value="0">请选择</option>'],isOk = false;
				var config = _RE.config;
				for (var i = 0; i < config.sysModelFields.length; i++) {
					var selected = '';
					if(config.sysModelFields[i].dbName == field){
						selected = 'selected="selected"';
						isOk = true;
					}
					var opt = '<option data-dbType="'+ config.sysModelFields[i].dbType +'" data-dataSource="'+ config.sysModelFields[i].dataSource +'" '+ selected +' value="'+ config.sysModelFields[i].dbName +'">'+ config.sysModelFields[i].name +'</option>';
					opts.push(opt);
				};
				if(!isOk && field){
					console.warn('field:'+ field +'\n和列表业务字段不匹配，请检查')
				}
				return $('<select></select>').append(opts.join(''));
			},
			// 条件op字段
			makeOp: function(type,op){
				var _RE = this.getRE(),opts = [],isOk = false;
				var config = _RE.config;
				_type = type.split(':')[0];
				optData = config.DATA_SOURCE_OPERATORS[_type];
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
						isOk = true;
					}
					var opt = '<option '+ selected +' value="'+ optData[i] +'">'+ optData[i] +'</option>';
					opts.push(opt);
				};
				if(!isOk){
					console.warn('type:'+ type +'\nop:'+ op +'\n不匹配，请检查')
				}
				return $('<select></select>').append(opts.join(''));
			},
			// 条件values字段
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
				return (function(len,values,op){
					var html = [],btn='',delBtn='',addBtn = '<input class="add_ipt" type="button" value="增加" />';
						if ('string' == typeof len) {
							len = values.length ? values.length : 1;
							btn = addBtn;
						};

						if(op == 'IN' || op == 'NOT IN'){
							delBtn = '<i class="del_ipt">X</i>'
						}
						for (var i = 0; i < len; i++) {
							// if('object' != typeof values[i]){
							// 	values[i].value = values[i];
							// 	values[i].text = values[i];
							// }
							var val = values[i] ? values[i] : {value:'',text:''}
							if (0 == i) {button = ''}else{button = delBtn};
							html[i] = '<input data-text="'+ val.text +'" type="text" value="'+ val.value +'">' + button;
						};
						html.push(btn);
					return html.join('')
				})(valueNum,values,op);

			},
			distory: function(){
				_RE.el.remove();
			}
		}
		// 原型方法
		$.extend(fn,{
			version: '0.0.2',
			init: function() {
				Util.construction();
				Util.bindEvent();
				
				_RE.ruleExprs = $.extend([],_RE.config.ruleExprs);
				
				this.setRules(_RE.el,_RE.ruleExprs);
				return this;
			},
			setRules: function(el,rules){
				Util.setRules(el,rules);
			},
			reset: function(){
				this.distory();
				this.init();
			},
			getJson: function(){
				_RE.ruleExprs = Util.getJson(this.el);
				return _RE.ruleExprs;
			},
			distory: function(){
				Util.distory();
			}
		});
		return this;
	}
	
})(jQuery);