//条件语句生成

(function($){
	
	$.fn.RulesFilter = (function() {
		
		//初始参数
	    $.fn.RulesFilter.prototype.defaults = {
	      boxClass: '',
	      animateClass: '',
	      offset: 0,
	      mobile: true,
	      live: true,
	      callback: null,
	      scrollContainer: null
    	};
    	//构造函数
	  	function RulesFilter(options) {
	      if (options == null) {
	        options = {};
	      }
	       this.config = $.extend(options, this.defaults);
	    }
	  	//原型封装
		
	  	$.fn.RulesFilter.fn = $.Condition.prototype;
	  	//初始化
  		$.fn.Condition.fn.init = function(a){
		      return a;
  		}
		$.fn.Condition.fn.distray = function(){
			this.init = $.noop
  		}
	
		
		return Condition;
	});
})(jQuery)
