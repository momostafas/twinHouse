jQuery(document).ready(function($){

	"use strict";

	/**
	 * ----------------------------------------------------------------------------------------
	 *    GLOBALS
	 * ----------------------------------------------------------------------------------------
	 */

	 var $window = $(window);
	 var $document = $(document);
	 var $html = $('html');
	 var $body = $('body');
	 var $footer = $('.footer-main');
	 var isMobile = false;

	 var $mainContent = $( '.ssd-main-content' );
	 var $mainNavigation = $( '.main-navigation' );


	 var initBgSegmentsFunction = false;

	 if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	 	isMobile = true;
	 }

	/**
	* ----------------------------------------------------------------------------------------
	*    Functions
	* ----------------------------------------------------------------------------------------
	*/
	// Get URL Parameter
	function getUrlParameter(url, name) {
		return (RegExp(name + '=' + '(.*?)(&|$)').exec(url)||['',''])[1];
	}

	// Get Page Index
	function getPageIndex(url) {
		return (RegExp(/(?:(page\/)|(paged=))(\d+)\/*/).exec(url)||['','']);
	}
	
	/**
	* ----------------------------------------------------------------------------------------
	*    JS Checker
	* ----------------------------------------------------------------------------------------
	*/

	document.documentElement.className = document.documentElement.className.replace("no-js","js");

	/**
	* ----------------------------------------------------------------------------------------
	*    Fixes Bug on iOS that stops hovered elements from hiding when tapped outside
	* ----------------------------------------------------------------------------------------
	*/

	if ( isMobile ) {
		$body.css('cursor', 'pointer');
	}

	/**
	* ----------------------------------------------------------------------------------------
	*    GLOBAL Functions
	* ----------------------------------------------------------------------------------------
	*/

	/**
	* Returns a random integer between min (inclusive) and max (inclusive)
	* Using Math.round() will give you a non-uniform distribution!
	*/
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	*  Shade Color
	*/
	function shadeColor(color, percent) {   
		var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}

	/**
	*  Converts rgba(xxx, xxx, xxx, x) to hex
	*/
	function hexc(colorval) {
		var parts = colorval.match(/^rgba*\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(?:\d+)*.*(?:\d+)*)*\)$/);
		if (!parts) {
			return;
		}
		delete(parts[0]);
		for (var i = 1; i <= 3; ++i) {
			parts[i] = parseInt(parts[i]).toString(16);
			if (parts[i].length == 1) parts[i] = '0' + parts[i];
		}
		return '#' + parts.join('');
	}

	/**
	*  Checks of color is dark
	*/
	function isColorDark(hexColor){
		var c = hexColor.substring(1);      // strip #
		var rgb = parseInt(c, 16);   // convert rrggbb to decimal
		var r = (rgb >> 16) & 0xff;  // extract red
		var g = (rgb >>  8) & 0xff;  // extract green
		var b = (rgb >>  0) & 0xff;  // extract blue

		var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

		if (luma < 40) {
			return true;
		}
		return false;
	}


	/**
	*  Scroll in View
	*/
	$.fn.inView = function() {
		var $this = this;
		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();
		var elemTop = $this.offset().top;
		var elemBottom = elemTop + $this.height() + 160;
		if ( ((docViewTop <= elemBottom) && (docViewBottom >= elemTop)) || (isMobile == true) ) {
			return true;
		}
		else {
			return false;
		}
	}


	/**
	*  Get Parent Background
	*/
	$.fn.getParentBG = function() {

		var $this = this;

		if ( $this.children('.bg-color').length ) {
			return $this.children('.bg-color').css("background-color");
		}
		
		// Is current element's background color set?
		var color = $this.css("background-color");
		if ( color == 'transparent' ) {
			color = 'rgba(0, 0, 0, 0)';
		}
		if ( color !== 'rgba(0, 0, 0, 0)' ) {
			// if so then return that color
			return color;
		}

		// are you at the body element?
		if ($this.is("body")) {
			// return known 'false' value
			return false;
		} else {
			// call getParentBG with parent item
			return $this.parent().getParentBG();
		}

	}
	

	/**
	* ----------------------------------------------------------------------------------------
	*    Activate and Reset anim- Animations
	* ----------------------------------------------------------------------------------------
	*/

	$.fn.activateAnimations = function() {

		var self = this;

		self.find('*').filter(function(){

			if (typeof this.className == 'string') {
				var classes = this.className.split(' ');
				var found = false;

				if ( classes ) {
					for (var i = 0, len = classes.length; i < len; i++) {
						if (/^anim-/.test(classes[i])) found = true;
						if (/^anim-onload/.test(classes[i])) return false;
					}
					if (found == true) {
						return true;
					}
				}
			}
			
			return false; 
		}).each(function(){
			$(this).addClass('anim-activated');
		})

	};



	$.fn.resetAnimations = function() {

		var self = this;

		self.find('*').filter(function(){

			if (typeof this.className == 'string') {
				var classes = this.className.split(' ');
				var found = false;

				if ( classes ) {
					for (var i = 0, len = classes.length; i < len; i++) {
						if (/^anim-/.test(classes[i])) found = true;
						if (/^anim-onload/.test(classes[i])) return false;
					}
					if (found == true) {
						return true;
					}
				}
			}
			
			return false;
		}).each(function(){
			$(this).removeClass('anim-activated');
		})

	};


	/**
	* ----------------------------------------------------------------------------------------
	*   Set Background Image or Color
	* ----------------------------------------------------------------------------------------
	*/

	function setBgImage(){
		var $bgimage = $('.bg-image');
		$bgimage.each(function(){
			var $this = $(this);
			if ( $this.data('bg-image') ) {
				var bgimage = $this.data('bg-image');
				if ( $this.css('background-image') != 'url("' + bgimage + '")' ) {
					$this.css('background-image', 'url("' + bgimage + '")' );
				}
				if ( $this.data('bg-position') ) {
					$this.css('background-position', $this.data('bg-position') );
				}
			}
			
		})

		var $bgColor = $('.bg-color');
		$bgColor.each(function(){
			var $this = $(this);
			var bgColor = $this.data('bg-color');
			if ( $this.css('background-color') != bgColor ) {
				$this.css('background-color', bgColor);
			}
			var opacity = $this.data('opacity');
			if ( typeof $this.data('opacity') != 'undefined' && $this.css('opacity') != opacity ) {
				$this.css('opacity', opacity);
			}
		})
	}

	setBgImage();

	$window.on('refreshisotope', function(e){
		setBgImage();
	});


	/**
	* ----------------------------------------------------------------------------------------
	*   Set SVG Icon Bg Color
	* ----------------------------------------------------------------------------------------
	*/

	function setSVGColor(){
		var $svgIcon = $('.icon-svg');
		$svgIcon.each(function(){
			var $this = $(this);
			var svgColor = $this.data('bg-color');
			if ( svgColor != undefined && $this.parent().css('background-color') != svgColor ) {
				$this.parent().css('background-color', svgColor );
			}
		})
	}

	setSVGColor();


	/**
	* ----------------------------------------------------------------------------------------
	*    Remove Empty Paragraphs
	* ----------------------------------------------------------------------------------------
	*/

	$('p').filter(function(){
		return !$.trim($(this).html());
	}).remove();


	/**
	 * ----------------------------------------------------------------------------------------
	 *    Show Content from External Elementor Container
	 * ----------------------------------------------------------------------------------------
	 */
	 
	$('.is-elementor-container').fadeTo(0, 1);


	/**
	 * ----------------------------------------------------------------------------------------
	 *    Select 2 on dropdowns
	 * ----------------------------------------------------------------------------------------
	 */

	$('select').each(function(){
		var $this = $(this);
		if ( !$this.hasClass('select2-hidden-accessible') ) {
			$this.select2({
				width: '100%'
			});
		}
	})


	/**
	 * ----------------------------------------------------------------------------------------
	 *    Inline input submit buttons
	 * ----------------------------------------------------------------------------------------
	 */

	$document.on('focus', '.widget .select2-selection--multiple',  function(e){
		var $this = $(e.target);
		if ( $this.closest('.select2-container').siblings('button[type="submit"]').length == 1 && $this.siblings('input:not([type="hidden"])').length == 0 ) {
			$this.css('padding-right', $this.closest('.select2-container').siblings('button[type="submit"]').outerWidth() + 5);
		}
	});


	/**
	* ----------------------------------------------------------------------------------------
	*    Admin Bar
	* ----------------------------------------------------------------------------------------
	*/

	// Makes the bar have better visibility on desktop and mobile

	$('#wpadminbar').css('z-index', '99999999');

	function positionAdminBar(){
		var windowWidth = window.innerWidth;

		if ( windowWidth <= 600 ) {
			$('#wpadminbar').css('position', 'fixed');
		}
	}

	$window.on('resize',function(){
		positionAdminBar();
	});


	/**
	* ----------------------------------------------------------------------------------------
	*    Isotope
	* ----------------------------------------------------------------------------------------
	*/

	var isotopeCols = 0;
	var itemGutter = 0;
	var isotopeType = null

	var startIsotopemethods = {
		init : function(options) {


			var $this = (this);

			$this.startIsotope('setOptions');

			isotopeType = $this.data('isotope-type');

			if ( isotopeType == null ) {
				isotopeType = 'masonry';
			}

			if(typeof $this.data('isotope-gutter') != 'undefined') {
				itemGutter = $this.data('isotope-gutter');
			} else {
				itemGutter = 0;
			}


			// Fires Layout when all images are loaded
			$this.imagesLoaded( function() {
				$this.show();

				// Isotope Init
				$this.isotope({
					transitionDuration: '.2s',
					layoutMode: isotopeType,
					masonry: {
						gutter: itemGutter
					},
				});

				if ( $this.hasClass('is-lightbox-gallery') ) {
					$this.isotope( 'on', 'layoutComplete', function() {
						setTimeout(function(){
							initSimpleLightbox();
						}, 0)
					});
				}

				$window.trigger('refreshisotope');
			});


			// Set the items width on resize
			// $window.on('resize refreshisotope', function (){
				$window.on('refreshisotope', function (){
					$this.startIsotope('refresh');
				});


			},
			setOptions : function(){

				var $this = $(this);

				$this.imagesLoaded(function(){

				// SET ISOTOPE GUTTER AND SPACINGS
				$this.width($this.parent().width() + 1);

				if(typeof $this.data('isotope-gutter') != 'undefined') {
					itemGutter = $this.data('isotope-gutter');
				} else {
					itemGutter = 0;
				}

				if( itemGutter != 0 ) {

					$this.css({
						'margin-right' : - itemGutter + 'px',
					})

					$this.children().css({
						'margin-bottom' : itemGutter + 'px',
						'overflow' : 'hidden'
					})

					if ( isotopeType == 'masonryHorizontal' || isotopeType == 'fitColumns' ) {
						$this.children().css({
							'margin-right' : itemGutter + 'px',
						})
					}

				}

		 		// SET ISOTOPE COLUMNS

		 		var windowWidth = window.innerWidth;

		 		if ( windowWidth <= 478 ) {
		 			if(typeof $this.data('isotope-cols-xs') != 'undefined') {
		 				isotopeCols = $this.data('isotope-cols-xs');
		 			} else {
		 				isotopeCols = 1;
		 			}
		 		}
		 		else if ( windowWidth <= 768 ) {
		 			if(typeof $this.data('isotope-cols-xs') != 'undefined') {
		 				isotopeCols = $this.data('isotope-cols-xs');
		 			} else if(typeof $this.data('isotope-cols-sm') != 'undefined') {
		 				isotopeCols = $this.data('isotope-cols-sm');
		 			} else if ( $this.data('isotope-cols') == 1){
		 				isotopeCols = 1;
		 			} else {
		 				isotopeCols = 2;
		 			}
		 		} else if ( windowWidth < 992 ) {
		 			if(typeof $this.data('isotope-cols-sm') != 'undefined') {
		 				isotopeCols = $this.data('isotope-cols-sm');
		 			} else if ( $this.data('isotope-cols') > 2 ) {
		 				isotopeCols = $this.data('isotope-cols') - 1;
		 			} else {
		 				isotopeCols = $this.data('isotope-cols');
		 			}

		 		} else {
		 			if ( typeof $this.data('isotope-cols') == 'undefined' ) {
		 				isotopeCols = 3;
		 			} else {
		 				isotopeCols = $this.data('isotope-cols');
		 			}

		 		}

		 		if ( isotopeCols >= 2 ) {
		 			$this.children().not('.isotope-item-width-2').css('width', Math.floor(($this.width() - (itemGutter * (isotopeCols - 1))) / isotopeCols) + 'px' );
		 			$this.children('.isotope-item-width-2').css('width', Math.floor(($this.width() / isotopeCols) * 2 - 2) + 'px' );
		 		} else {
		 			$this.children().css('width', $this.width() / isotopeCols - 1 + 'px' );
		 		}

		 		if( $this.data('isotope-square') == true ) {
		 			var itemsHeight = $this.children().not('.isotope-item-width-2').width();
		 			$this.children().css('height', itemsHeight + 'px' );
		 		}

		 		if ( $this.find('.is-aspectratio').length > 0 ) {

		 			var elWidth = $this.find('.is-aspectratio').width();

		 			$this.find('.is-aspectratio').each(function(){
		 				var $el = $(this);
		 				var height = 0;
		 				var landscapeHeight = 0;

		 				if ( $el.hasClass('ar_4_3') ) {
		 					height = elWidth / 1.333 ;
		 				}
		 				if ( $el.hasClass('ar_1_1') ) {
		 					height = elWidth;
		 				}
		 				if ( $el.hasClass('ar_3_2') ) {
		 					height = elWidth / 1.5;
		 				}
		 				if ( $el.hasClass('ar_16_9') ) {
		 					height = elWidth / 1.777;
		 				}
		 				if ( $el.hasClass('ar_3_1') ) {
		 					height = elWidth / 3 ;
		 				}

		 				if ( $el.hasClass('ar_3_4') ) {
		 					height = elWidth / 0.75;
		 				}
		 				if ( $el.hasClass('ar_2_3') ) {
		 					height = elWidth / 0.666;
		 				}
		 				if ( $el.hasClass('ar_9_16') ) {
		 					height = elWidth / 0.5625;
		 				}
		 				if ( $el.hasClass('ar_1_3') ) {
		 					height = elWidth / 0.333;
		 				}

			 			// searches if there are landcape items
			 			landscapeHeight = $this.find('.is-autox-landscape').height();

			 			// checks if the current item is portrait
			 			if ( $el.hasClass('is-autox-portrait') ) {
			 				if ( landscapeHeight > 0 ) {
			 					$el.height(Math.floor(landscapeHeight*2 + $this.data('isotope-gutter')));	
			 				} else {
			 					$el.height(Math.floor(height));	
			 				}

			 			} else {
			 				$el.height(Math.floor(height));
			 			}

			 		})
		 		}

			}) //imagesLoaded

		},
		refresh : function(){
			var $this = $(this);
			var windowWidth = window.innerWidth;

			$this.startIsotope('setOptions');

			setTimeout(function(){
				$this.isotope('layout');
				if ( $this.hasClass('is-isotope-match-height') ) {
					if ( windowWidth <= 478 ) {
						$this.find('.is-matchheight').matchHeight({
							remove: true,
						});
					} else {
						$this.find('.is-matchheight').matchHeight({
							byRow: false,
						});
					}
				}
			}, 100)

		}
	};


	$.fn.startIsotope = function(methodOrOptions) {
		if ( startIsotopemethods[methodOrOptions] ) {
			return startIsotopemethods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
	        // Default to "init"
	        return startIsotopemethods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.startIsotope' );
	    }    
	};


	var $isotopeContainer = $('.is-isotope');

	var triggerRefreshIsotope;

	function initResizeSensorIsotope($selector){
		$selector.wrap( "<div class='is-resize-sensor'></div>" );
		$selector.startIsotope();
		$selector.addClass('isotope-loaded');

		new ResizeSensor($selector.closest('.is-resize-sensor'), function(){
			clearTimeout(triggerRefreshIsotope);
			triggerRefreshIsotope = setTimeout(ResizeSensorTriggerRefreshIsotope, 300);
		});
	}

	function ResizeSensorTriggerRefreshIsotope(){
		$window.trigger('refreshisotope');
	}


	$isotopeContainer.each(function(){
		var $this = $(this);
		if ( !$this.parents(':hidden').length ){
			initResizeSensorIsotope($this);
		}
		
	})

	$window.on('throttledresize', function(){
		$('.is-isotope').each(function(){
			var $this = $(this);

			if ( !$this.parents(':hidden').length && !$this.hasClass('isotope-loaded') ){
				initResizeSensorIsotope($this);
			}
		})
	})


	/**
	* ----------------------------------------------------------------------------------------
	*    Isotope Filter
	* ----------------------------------------------------------------------------------------
	*/

	$document.on('click', '.is-isotope-filter a', function(e){
		e.preventDefault();
		var $this = $(this);
		var data_target = $this.parents('.is-isotope-filter').data('target');
		var $target = $(data_target);
		var selector = $this.attr('data-filter');
		$this.parents('.is-isotope-filter').find('.selected').removeClass('selected');
		$this.parent('li').addClass('selected');

		$target.isotope({ filter: selector });

		return false;

	});

	if ( $('.is-isotope-filter').data('hide-show-all') == '1' ) {
		$('.is-isotope-filter li:first-child a').trigger('click');
	}


	/**
	* ----------------------------------------------------------------------------------------
	*    Nav Menu
	* ----------------------------------------------------------------------------------------
	*/

	$('.is-slicknav').each(function(){
		var $this = $(this);
		if ( $this.find('.main-navigation-menu > ul').length < 1 ) {
			$this.find('.main-navigation-menu').append('<ul></ul>')
		}
		$this.find('.main-navigation-menu > ul').slicknav({
			label: '',
			init: function(){
				if ( $this.find('.main-navigation-logo .main-navigation-logo-mobile').length > 0 ) {
					var $brandLogo = $this.find('.main-navigation-logo .main-navigation-logo-mobile').clone();
				} else {
					var $brandLogo = $this.find('.main-navigation-logo h1').clone();
				}
				$('.slicknav_menu').prepend($brandLogo);
				$brandLogo.wrap('<div class="slicknav_menu_logo"></div>');
			}
		})
	})

	// Nav Offset
	var $navigation = $('.slicknav_menu');
	var $navOffset = $('.is-nav-offset');
	var navHeight = $navigation.innerHeight();


	function navOffset() {
		if ( $('.slicknav_menu').is(':visible') ) {
			$navOffset.css('padding-top', $('.slicknav_menu_logo').innerHeight());
		} else if ( !$mainNavigation.hasClass('is-main-nav-transparent') ) {
			$navOffset.css('padding-top', $mainNavigation.outerHeight());
		} else {
			$navOffset.css('padding-top', '0');
		}
	}

	navOffset();

	$window.on('resize',function(){
		navOffset();
	});



	// Add dropdown arrow
	$('.is-navmenu').find('.menu-item-has-children a').each(function(){

		var $this = $(this);

		if ( $this.next().hasClass('sub-menu') ) {
			if ( $this.closest('.sub-menu').length > 0 ) {
				$this.append('<i class="fa fa-chevron-right"></i>');
			} else {
				$this.append('<i class="fa fa-chevron-down"></i>');
			}
		}

	})

	// Open Sub Nav n Hover
	$('.menu-item-has-children').on('mouseenter', function(){
		var $this = $(this);
		var $subMenu = $this.find('.sub-menu').first();

		if ( $subMenu.length > 0 ) {
			$subMenu.addClass('sub-menu--open');

			var rightOffset = ($(window).width() - ($subMenu.offset().left + $subMenu.outerWidth()));
			if ( rightOffset < 0 ) {
				$subMenu.css({
					'left' : 'auto',
					'right' : '100%'
				})
			}
		}

	})
	$('.menu-item-has-children').on('mouseleave', function(){
		var $this = $(this);
		var $subMenu = $this.find('.sub-menu').first();
		$subMenu.removeClass('sub-menu--open');
	})

	/**
	 * ----------------------------------------------------------------------------------------
	 *    Header on Scroll
	 * ----------------------------------------------------------------------------------------
	 */

	 var $navigationTransparent = $('.is-main-nav-transparent');
	 var navHeight = $navigationTransparent.height();

	 function removeNavTransparency() {

	 	navHeight = $navigationTransparent.height();

	 	if ( $('.is-slicknav').css('display') != 'none' ) {
	 		if ( $window.scrollTop() > navHeight ){
	 			$navigationTransparent.removeClass('main-nav-transparent');

			} else if ( $window.scrollTop() == 0 ){
				$navigationTransparent.addClass('main-nav-transparent');
			}

		}
		
		

	}

	removeNavTransparency();

	$window.scroll(function(){
		removeNavTransparency();
	});

	$window.on('resize',function(){
		removeNavTransparency();
	});

	/**
	* ----------------------------------------------------------------------------------------
	*    Perfect Scrollbar
	* ----------------------------------------------------------------------------------------
	*/


	var perfectScrollbars = null;

	function initPerfectScrollbar(){

		if ( perfectScrollbars ) {
			perfectScrollbars.destroy();
			perfectScrollbars = null;
		}

		var $perfectScrollbars = $('.is-perfect-scrollbar');
		$('.is-perfect-scrollbar').each(function(){ 
			perfectScrollbars = new PerfectScrollbar($(this)[0], {
				scrollYMarginOffset: 0,
				suppressScrollX: true,
				wheelPropagation: false
			});
		});
	}

	if ( $('.is-perfect-scrollbar').length > 0 ) {
		initPerfectScrollbar();
	}


	$window.on('throttledresize',function(){
		if ( perfectScrollbars ) {
			perfectScrollbars.update();
		}
	});

	/**
	* ----------------------------------------------------------------------------------------
	*    Parallax
	* ----------------------------------------------------------------------------------------
	*/

	function parallaxScroll(){
		var windowWidth = window.innerWidth;

		if ( windowWidth < 992 || isMobile ) {
			$('.is-parallax').each(function(){
				var $this = $(this);
				$this.css('background-position', '');
				$this.css('background-size', 'cover');
			});
			$('.is-floating').each(function(){
				var $this = $(this);
				$this.css({
					'-webkit-transform' : '',
					'-ms-transform' : '',
					'transform' : ''
				});
			});
			return;
		}

		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();

		$('.is-parallax').each(function(){
			var $this = $(this);

			var top = 0;
			top = docViewBottom - $this.offset().top;

			if ( $this.offset().top <= $window.scrollTop() + $window.height() + 200 ) {
				$this.css('background-position', 'left 50% ' + 'top ' + ( 110 - top * 0.08) + '%');
			} else {
				$this.css('background-position', 'left 50% top 100%');
			}		

		})

		$('.is-floating').each(function(){
			var $this = $(this);
			var top = 0;
			if ( $this.inView() ) {
				top = docViewBottom - $this.offset().top;
				var translateY = 100 - (top * 0.18);
				$this.css({
					'-webkit-transform' : 'translateY(' + translateY + 'px)',
					'-ms-transform' : 'translateY(' + translateY + 'px)',
					'transform' : 'translateY(' + translateY + 'px)'
				});
			}
		})
	}

	parallaxScroll();

	$window.on('scroll throttledresize', function(e){
		parallaxScroll();
	});

	/**
	* ----------------------------------------------------------------------------------------
	*    Post Share Buttons
	* ----------------------------------------------------------------------------------------
	*/

	$('.is-shareable .facebook').on('click', function(e){
		e.preventDefault();
		var postUrl = $(this).closest('.is-shareable').data('post-url');
		window.open('http://www.facebook.com/sharer.php?u=' + postUrl,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	})

	$('.is-shareable .twitter').on('click', function(e){
		e.preventDefault();
		var postUrl = $(this).closest('.is-shareable').data('post-url');
		window.open('https://twitter.com/share?url=' + postUrl,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	})

	$('.is-shareable .google-plus').on('click', function(e){
		e.preventDefault();
		var postUrl = $(this).closest('.is-shareable').data('post-url');
		window.open('https://plus.google.com/share?url=' + postUrl,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	})

	$('.is-shareable .pinterest').on('click', function(e){
		e.preventDefault();
		var postUrl = $(this).closest('.is-shareable').data('post-url');
		var img = $('.ssd-single-header .bg-image').data('bg-image');
		window.open('http://pinterest.com/pin/create/button/?url=' + postUrl + '&media=' + img,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	})

	/**
	* ----------------------------------------------------------------------------------------
	*    Match Height
	* ----------------------------------------------------------------------------------------
	*/
	
	// Section Shortcode
	function triggerMatchHeight() {
		var windowWidth = window.innerWidth;
		if ( windowWidth <= 768 ) {
			$('.is-matchheight').matchHeight({
				remove: true,
			});
			$('.is-matchheight-group').each(function(){
				var $this = $(this);
				$this.children().matchHeight({
					remove: true,
					property: 'min-height',
				});
			})
			$('.is-matchheight-container .row, .is-matchheight-container .fw-row').each(function(){
				var $this = $(this);

				if (!$this.parents('.fullscreen-wrapper').length) {
					$this.find('[class^="fw-col-"], [class^="col-"]').matchHeight({
						remove: true
					});
				}
				
			})
		} else {
			$('.is-matchheight').matchHeight({
				byRow: false
			});
			$('.is-matchheight-group').each(function(){
				var $this = $(this);
				$this.children().matchHeight({
					byRow: true,
				});
			})
			$('.is-matchheight-container .row, .is-matchheight-container .fw-row').each(function(){
				var $this = $(this);

				if (!$this.parents('.fullscreen-wrapper').length) {
					$this.find('[class^="fw-col-"], [class^="col-"]').matchHeight({
						byRow: false
					});
				}
				
			})
		}
	}

	triggerMatchHeight();
	
	$window.on('throttledresize',function(){
		setTimeout(function(){
			triggerMatchHeight();
			$window.trigger('googlemapsresize');
		}, 400)
	});


	/**
	* ----------------------------------------------------------------------------------------
	*    Simple Lightbox
	* ----------------------------------------------------------------------------------------
	*/

	var $lightboxes = '';

	var lightbox = [];
	var $lightboxImages = '';

	function initSimpleLightbox(){

		var arrayLength = lightbox.length;
		for (var i = 0; i < arrayLength; i++) {
			lightbox[i].destroy();
		}

		$('.is-lightbox-gallery').each(function(){
			var $this = $(this);
			$lightboxImages = $this.find('*:visible a, a:visible');

			lightbox.push(new $.SimpleLightbox({
				$items: $lightboxImages,
				nextBtnClass: ' arrow-right',
				prevBtnClass: ' arrow-left',
				prevBtnCaption: '',
				nextBtnCaption: '',
				videoRegex: new RegExp(/youtube.com|vimeo.com/),
			}));

		});

		$('.is-lightbox').simpleLightbox({
			urlAttribute: 'data-lightbox'
		});

	}
	
	setTimeout(function(){
		initSimpleLightbox();
	}, 100)


	$('.tablepress').on( 'page.dt', function () {
		setTimeout(function(){
			initSimpleLightbox();
		}, 100)
	} );
	


	/**
	* ----------------------------------------------------------------------------------------
	*    Page Flip
	* ----------------------------------------------------------------------------------------
	*/

	/**
	* AJAX Success.
	*/

	function ajaxSuccess(html){
		$( '.book-container' ).remove()
		$('body').prepend(html);

		var Page = (function() {

			var $container = $( '.book-container' ),
				$bookBlock = $( '#bb-bookblock' ),
				$items = $bookBlock.children(),
				itemsCount = $items.length,
				current = 0,
				bb = $( '#bb-bookblock' ).bookblock( {
					speed : 800,
					perspective : 2000,
					shadowSides	: 0.8,
					shadowFlip	: 0.4,
					onEndFlip : function(old, page, isLimit) {
						
						current = page;
						// update TOC current
						updateTOC();
						// updateNavigation
						updateNavigation( isLimit );
						initPerfectScrollbar();
					}
				} ),
				$navNext = $( '#bb-nav-next' ),
				$navPrev = $( '#bb-nav-prev' ).hide(),
				$menuItems = $container.find( 'ul.menu-toc > li' ),
				$tblcontents = $( '#tblcontents' ),
				transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				},
				transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
				supportTransitions = Modernizr.csstransitions;

			function init() {
				updateNavigation( current === itemsCount - 1 );
				// initialize perfectScrollbar on the content div of the first item
				initPerfectScrollbar();
				initEvents();
				updateTOC();
			}
			
			function initEvents() {

				// add navigation events
				$navNext.on( 'click', function() {
					bb.next();
					return false;
				} );

				$navPrev.on( 'click', function() {
					bb.prev();
					return false;
				} );
				
				// add swipe events
				$items.on( {
					'swipeleft'		: function( event ) {
						if( $container.data( 'opened' ) ) {
							return false;
						}
						bb.next();
						return false;
					},
					'swiperight'	: function( event ) {
						if( $container.data( 'opened' ) ) {
							return false;
						}
						bb.prev();
						return false;
					}
				} );

				// show table of contents
				$tblcontents.on( 'click', toggleTOC );

				// show table of contents
				$tblcontents.on( 'hover', function(){
					$tblcontents.removeClass('hovered');
				} );

				// click a menu item
				$menuItems.on( 'click', function() {

					var $el = $( this ),
						idx = $el.index(),
						jump = function() {
							bb.jump( idx + 1 );
						};
					
					current !== idx ? closeTOC( jump ) : closeTOC();

					return false;
					
				} );


			}

			function updateTOC() {
				$menuItems.removeClass( 'menu-toc-current' ).eq( current ).addClass( 'menu-toc-current' );
			}

			function updateNavigation( isLastPage ) {
				if( current === 0 && itemsCount == 1 ) {
					$navNext.hide();
					$navPrev.hide();
				} else if( current === 0 ) {
					$navNext.show();
					$navPrev.hide();
				}
				else if( isLastPage ) {
					$navNext.hide();
					$navPrev.show();
				}
				else {
					$navNext.show();
					$navPrev.show();
				}

			}

			function toggleTOC() {
				var opened = $container.data( 'opened' );
				opened ? closeTOC() : openTOC();
			}

			function openTOC() {
				$navNext.hide();
				$navPrev.hide();
				$container.addClass( 'slideRight' ).data( 'opened', true );
				$tblcontents.find('span').text(skytower.hideChapters);
				$tblcontents.find('i').removeClass('fas fa-search').addClass('far fa-times-circle');
			}

			function closeTOC( callback ) {

				updateNavigation( current === itemsCount - 1 );
				$container.removeClass( 'slideRight' ).data( 'opened', false );
				$tblcontents.find('span').text(skytower.showChapters);
				$tblcontents.find('i').removeClass('far fa-times-circle').addClass('fas fa-search');
				if( callback ) {
					if( supportTransitions ) {
						$container.on( transEndEventName, function() {
							$( this ).off( transEndEventName );
							callback.call();
						} );
					}
					else {
						callback.call();
					}
				}

			}

			return { init : init };

		})();

		Page.init();

	}

	/**
	* Read Book button.
	*/

	function prevDef(event){
		event.preventDefault();
	}


	

	function openFlipBook(event){
		event.preventDefault();

		var $this = $(this);

		$this.off('click', openFlipBook)
		$this.on('click', prevDef)

		// if a normal button was clicked
		if ( $this.hasClass('btn') ) {
			var btnHTML = $this.html();
			var btnWidth = $this.width();
			$this.html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' + skytower.loading);
			$this.width(btnWidth);
			$this.prop('disabled', true);
		}

		var textPopupContent = $this.find('.page-flip-book-ribbon span').text();
		$this.find('.page-flip-book-ribbon').prepend('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
		$this.find('.page-flip-book-ribbon span').text(skytower.loading);

		var id = $(this).data('post-id');

		$.ajax({
			type: 'post',
			dataType: 'html',
			url: skytower.ajaxurl,
			data: {
				action : '_action_skytower_ajax_bookblock_function',
				id : id
			},
			success: function(response) {
				ajaxSuccess(response);
				$('.book-container').addClass('showBook');
				$(window).trigger('resize');

				setTimeout(function(){
					$this.find('.page-flip-book-ribbon span').text(textPopupContent);
					$this.find('.page-flip-book-ribbon i').remove();

					// if a normal button was clicked
					if ( $this.hasClass('btn') ) {
						$this.html(btnHTML);
						$this.css('width', '');
						$this.prop('disabled', false);
					}

					$this.on('click', openFlipBook)
					$this.off('click', prevDef)

				}, 300)
			}
		});

	}

	$('.is-page-flip').on('click', openFlipBook);


	$(document).on('click', '.bb-nav-close', function(event){
		var $this = $(this);
		$this.parents('.book-container').removeClass('showBook');
	})

	/**
	* ----------------------------------------------------------------------------------------
	*    Section Scroll Down
	* ----------------------------------------------------------------------------------------
	*/

	$('.is-scroll-down').each(function(){

		var $this = $(this);

		$this.on('click', function(e){
			e.preventDefault();
			var elemTop = $this.parent().offset().top;
			var height = $this.parent().outerHeight();
			var scrollBottom = height + elemTop;
			$('body,html').animate({
				scrollTop: scrollBottom,
			}, 600
			);

		})

	})

	/**
	* ----------------------------------------------------------------------------------------
	*    Image Upload Field
	* ----------------------------------------------------------------------------------------
	*/

	var mediaUploader;

	$(document).on('click', '.is-ssd-upload-image-button',function(e) {
		e.preventDefault();

		var $uploadButton = $(this);
		var $widgetContainer = $uploadButton.closest('.widget-inside');
		var uploadButtonName = $uploadButton.data('name');

	    // If the uploader object has already been created, reopen the dialog
	    if (mediaUploader) {
	    	mediaUploader.open();
	    	return;
	    }
	    // Extend the wp.media object
	    var mediaUploader = wp.media.frames.file_frame = wp.media({
	    	title: 'Select Image',
	    	button: {
	    		text: 'Select'
	    	},
	    	multiple: false
	    });

	    // When a file is selected, grab the URL and set it as the text field's value
	    mediaUploader.on('select', function() {
	    	var attachment = mediaUploader.state().get('selection').first().toJSON();
	    	$uploadButton.siblings('.is-ssd-upload-image-thumbnail').empty().append('<img src="' + attachment.sizes.skytower_landscape_small.url + '" class="attachment-skytower_landscape_small size-skytower_landscape_small" alt="">');
	    	$('input[type="hidden"][name="' + uploadButtonName + '"]').val(attachment.id );
	    });
	    // Open the uploader dialog
	    mediaUploader.open();
	});

	$(document).on('click', '.is-ssd-upload-remove-image',function(e) {
		e.preventDefault();

		var $removeImageButton = $(this);
		var removeImageButtonName = $removeImageButton.data('image-remove');

		$removeImageButton.siblings('.is-ssd-upload-image-thumbnail').empty();
	    $('input[type="hidden"][name="' + removeImageButtonName + '"]').val('');
		
	});

	/**
	* ----------------------------------------------------------------------------------------
	*    Product Before Image
	* ----------------------------------------------------------------------------------------
	*/

	function setProductBeforeImage(){
		var $productImage = $('.image-has-rotate');
		$productImage.each(function(){
			var $this = $(this);
			if ( $this.find('img') && $this.find('.rotate-before-image') ) {
				var img = $this.find('img');
				var beforeImg = $this.find('.rotate-before-image');
				beforeImg.css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(' + img.attr('src') + ')');
			}
		})
	}

	setProductBeforeImage();


})