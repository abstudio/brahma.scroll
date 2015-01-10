(function($) {

	var airScroll = function(obj, settings) {
		this.obj = obj;
		this.wrappers = {};
		this.settings = $.extend({
			'runnerStyle': 'fixed',
			'crosslineColor': 'rgba(242,242,242,0.2)',
			'runnerColor': '#626262',
			'runnerHeight': 8,
			'wheelStep': 40,
			'runnerDefaultPosition': 0
		}, settings);
		
		this.options = {};
		this.options.draggerActivate = false; 		this.options.dreggerDownPos = 0; 		this.options.currenPositionPx = 0; 		
		this.options.runner = {
			height: 6
		};
		this.options.crossline = {
			runnerarea: 0
		};
		this.options.disabled = false; 		this.options.needtodisable = false;
		this.options.needtoenabled = false;
		this.options.areaHeight = 0;
		this.options.cssTransitions = true;
		
				if(!document.addEventListener) {
			
			if (this.settings.crosslineColor.indexOf('rgba')==0) this.settings.crosslineColor = this.settings.crosslineColor.replace(/^rgba\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}),[0-9\.]*\)/g, 'rgb($1)');
			if (this.settings.runnerColor.indexOf('rgba')==0) this.settings.runnerColor = this.settings.runnerColor.replace(/^rgba\(([0-9]{1,3},[0-9]{1,3},[0-9]{1,3}),[0-9\.]*\)/g, 'rgb($1)');
		};
		
		this.content = this.obj;
		
		this.build = function() {
						this.wrappers.main = $(this.obj).wrap($("<div />", {
				'class': 'jair-ui-scroll-root'
			}).css({
				
				'display': 'table',
				'position': 'relative'
			})).parent();
			
						this.wrappers.marginableElement = $(this.obj).css({
				'float': 'left',
				'width': this.options.areaWidth
			});
						
			this.options.areaHeight = $(this.obj).height();		
			
			this.options.areaWidth = $(this.obj).width();	

			
			this.wrappers.clipWrapper = $(this.obj).wrap($("<div />", {
				'class': 'jair-ui-scroll-clip'
			}).css({
				'overflow': 'hidden',
				'height': this.options.areaHeight+'px'
			}));
			
			$(this.obj).css({
				'height': 'auto'
			});
			
			
			$(this.wrappers.main).css({
				'padding-right': '+10px',
				'overflow': 'visible',
				'background': 'transparent',
				'border': '0px',
				'margin': '0px',
				'position': ( ($(this.obj).css('position')=='absolute' || $(this.obj).css('position')=='fixed' ) ? $(this.obj).css('position') : 'relative')
			}).disableselection();
			
			
			this.wrappers.s_wrappar = $("<div />", {
				"class": "y"
			}).appendTo($(this.wrappers.main))
			.css({
				'position': 'absolute',
				'top': '0px',
				'right': '0px',
				'width': '11px',
				'height': this.options.areaHeight+'px',
				'background': 'transparent'
			});
			
			
			
			this.options.s_height = $(this.wrappers.s_wrappar).height()-2;
			
			/* ! build runner */
			this.wrappers.s_crossline = $("<div />").appendTo(this.wrappers.s_wrappar)
			.css({
				'height'	: '100%',
				'width'		: '8px',
				'margin'	: '0 auto',
				'background-color'	: this.settings.crosslineColor,
				'border-radius'		: '0px 3px 3px 0px',
				'position': 'relative'
			});
			
			this.wrappers.s_runner = $("<div />").appendTo(this.wrappers.s_crossline)
			.css({
				'width': '8px',
				'height': '8px',
				'border-radius'		: '4px',
				'background'	: this.settings.runnerColor,
				'position': 'absolute'
			});
			
			$(this.wrappers.marginableElement).css({
				'top': '0px'
			});
			
			/* add focus for main object after builds */
			$(this.obj).focus();

		};
		
		this.calculates = function() {
			var that = this;
			
						this.options.fullheight = 0;
			
			
			var areaheight = this.options.areaHeight;
			
			var crosslineHeight = $(this.wrappers.s_crossline).height();
			
			$(this.wrappers.clipWrapper).find('>*').each(function() {
				that.options.fullheight += $(this).outerHeight();
			});
			
						
			if (that.options.fullheight<=areaheight) {		
								
				if (!this.options.disabled) this.options.needtodisable = true; 			} else {
					
				if (this.options.disabled) this.options.needtoenabled = true; 			}
			
						this.options.overflow = this.options.fullheight-areaheight;
			
			
						
			switch(this.settings.runnerStyle) {
				case 'classic':
					
					this.options.runner.height = crosslineHeight*(areaheight/this.options.fullheight);
					if (this.options.runner.height>=crosslineHeight) {
						this.options.runner.height = crosslineHeight;
					} else {
						
					}
				break;
				case 'fixed':
					this.options.runner.height = this.settings.runnerHeight;
				break;
			}
			
						this.options.crossline.runnerarea = (this.options.s_height-this.options.runner.height);
			
			this.rebuild();
		};
		
		this.rebuild = function() {
			
			$(this.wrappers.s_runner).css({
				'height': this.options.runner.height+'px',
				'background-color'	: this.settings.runnerColor
			});
			
			if (this.options.needtodisable) {
				this.disable();
				
			} else if(this.options.needtoenabled) {
				this.enable();
				
			} else {
				this.setPosition();
			};
			
		};
		
		this.disable = function() {
			
			this.setPosition(0);
			this.options.needtodisable = false;
			this.options.disabled = true;
			
			$(this.wrappers.s_runner).hide();
		};
		
		this.enable = function() {
			this.options.needtoenabled = false;
			this.options.disabled = false;
			this.setPosition(this.settings.runnerDefaultPosition);
			$(this.wrappers.s_runner).show();
		}
		
				this.refresh = function() {
			
			this.calculates();
		};
		
		this.down = function() {
			this.setPosition(1);
		};
		
		this.scrollUp = function() {
			if (this.disabled) return;
			this.move(this.settings.wheelStep*-1);
		};
		
		this.scrollDown = function(absolute) {
			var absolute = absolute || false;
			if (absolute) {
				this.setPosition(1, false);
			} else {
				if (this.disabled) return;
				this.move(this.settings.wheelStep);
			};
		};
		
				this.move = function(dif) {
			if ((dif>0) && ((this.options.currenPositionPx+dif)>(this.options.overflow-(dif)))) {
				var p = 1;
				
			} else if ((dif<0) && ((this.options.currenPositionPx+dif)<=(dif))) {
				var p = 0;
				
			} else {
				var p = (this.options.currenPositionPx+dif)/this.options.overflow;
			};			
			
			
			this.setPosition(p, false);
			
		};
		
		this.addeventes = function() {
			var that = this;
			
			Brahma(this.wrappers.clipWrapper).component('wheel', {
				wheelUp: function() {
					that.scrollUp();
				},
				wheelDown: function() {
					that.scrollDown();
				}
			});
			
			$('body').bind('mousemove', function(eventObject) {
			
				if (this.disabled) return;
				if (that.options.draggerActivate) {
					
					that.changePosition(that.options.draggerPagePos-eventObject.clientY);
				}
				return false;
			});
			$('body').bind('mouseup', function(eventObject) {
				if (this.disabled) return;
				if (that.options.draggerActivate) {
					that.options.dreggerDownPos = that.options.dreggerDownPos-(that.options.draggerPagePos-eventObject.clientY);
					that.options.draggerActivate = false;
				}
				return false;
			});
			
			$(this.wrappers.s_wrappar)
			.bind('mousedown', function(eventObject) {
				
				if (this.disabled) return;
				
				var y = eventObject.offsetY==undefined?eventObject.originalEvent.layerY:eventObject.offsetY;
				
				that.setPosition(y/that.options.s_height);
				
				that.options.dreggerDownPos = y;
				that.options.draggerPagePos = eventObject.clientY;
				that.options.draggerActivate = true;
				
				eventObject.preventDefault();
				eventObject.stopPropagation();
				
				return false;
				
			});
			
			$(this.wrappers.s_runner).bind('mousedown', function(eventObject) {
				if (this.disabled) return;
				that.options.draggerPagePos = eventObject.clientY;
				that.options.draggerActivate = true;
				
				eventObject.preventDefault();
				eventObject.stopPropagation();
				
				return false;
				
			});
		};
				
		this.setPosition = function(perc, animate) {
			
			if (typeof(animate) == 'undefined') animate = true;
			if (this.options.disabled) perc = 0;
			if (typeof(perc)=='undefined') perc = false;
			if (perc===false) {
				
								if ( (this.options.currenPositionPx>=this.options.overflow) && !this.options.disabled) {
					
					perc = 1;
				} else {
					return;
				}
			}
			
			this.options.currentPosition = perc;
			
			
			
			if (this.options.currentPosition>1) this.options.currentPosition = 1;
			if (this.options.currentPosition<0) this.options.currentPosition = 0;
			
			
			if (animate && !this.options.cssTransitions) {
				console.log('animate', this.options.crossline.runnerarea*this.options.currentPosition);
				$(this.wrappers.s_runner).animate({
					'top': (this.options.crossline.runnerarea*this.options.currentPosition)+'px'
				}, 100);
			} else {
				
				$(this.wrappers.s_runner).css({
					'top': (this.options.crossline.runnerarea*this.options.currentPosition)+'px'
				});
			};
			
						
			this.setAreaScroll(this.options.currentPosition, animate);
			
		}
		
		this.changePosition = function(dif) {
			this.options.currentPosition = (this.options.dreggerDownPos-dif)/(this.options.crossline.runnerarea);
			if (this.options.currentPosition>1) this.options.currentPosition = 1;
			if (this.options.currentPosition<0) this.options.currentPosition = 0;
			
			
			$(this.wrappers.s_runner).css("top", (this.options.crossline.runnerarea*this.options.currentPosition)+'px');
			
			this.setAreaScroll(this.options.currentPosition);
		}
		
		this.setAreaScroll = function(perc, animate) {
			
			var animate = animate || false;
			this.options.currenPositionPx = this.options.currentPosition*this.options.overflow;
			
			
			if (animate) 
			$(this.wrappers.marginableElement).animate({
				"margin-top": (this.options.currenPositionPx*-1)+'px'
			}, '100');
			else  {
				$(this.wrappers.marginableElement).css({"margin-top": (this.options.currenPositionPx*-1)+'px'});
				
			};
			
		}
		
		this.build();
		
		this.calculates();
		this.addeventes();

		var that = this;
		setTimeout(function() {
			that.calculates();
		}, 10);
	};
	
	$.fn.BrahmaScroll = function(options) {
		var elem = this;
		var options = options || {};
		
		return $.each(elem, function() {
			$(this)[0].airScroll = new airScroll( elem, options );
		});
	};

	if (navigator.userAgent.indexOf('Mozilla') != -1) {
       $.fn.disableselection = function() {
            return $(this).each(function() {
               $(this).css({
                    'MozUserSelect' : 'none'
                });
            });
        };
       $.fn.enableselection = function() {
            return $(this).each(function() {
                $(this).css({
                    'MozUserSelect' : ''
                });
            });
        };
    } else if (navigator.userAgent.indexOf('IE') != -1) {
      $.fn.disableselection = function() {
            return $(this).each(function() {
                $(this).bind('selectstart.disableTextSelect', function() {
                    return false;
                });
            });
        };
       $.fn.enableselection = function() {
            return $(this).each(function() {
               $(this).unbind('selectstart.disableTextSelect');
            });
        };
    } else {
       $.fn.disableselection = function() {
            return $(this).each(function() {
                $(this).bind('mousedown.disableTextSelect', function() {
                    return false;
                });
            });
        };
      $.fn.enableselection = function() {
            return $(this).each(function() {
                $(this).unbind('mousedown.disableTextSelect');
            });
        };
    };

    Brahma.component('scroll', {
    	config: {

    	},
    	execute: function() {
    		$(this.selector).BrahmaScroll(this.config);
    	}
    })


})(jQuery);