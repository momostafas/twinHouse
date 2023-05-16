( function( $ ) {

	"use strict";

	/**
	* ----------------------------------------------------------------------------------------
	*    Elementor Functions
	* ----------------------------------------------------------------------------------------
	*/

	var isAdminBar		= false,
		isEditMode		= false;

	var getGlobalSettings = function( section ) {
		
		if ( section in elementorFrontendConfig.settings ) {
			return elementorFrontendConfig.settings[section];
		}

		return false;
	}

	var getElementSettings = function( $element ) {
		var elementSettings = {},
			modelCID 		= $element.data( 'model-cid' );

		if ( isEditMode && modelCID ) {
			var settings = elementorFrontend.config.elements.data[modelCID],
			    type = settings.attributes.widgetType || settings.attributes.elType;

			var settingsKeys = elementorFrontend.config.elements.keys[type];

			if (!settingsKeys) {
				settingsKeys = elementorFrontend.config.elements.keys[type] = [];

				jQuery.each(settings.controls, function (name, control) {
					if (control.frontend_available) {
						settingsKeys.push(name);
					}
				});
			}

			jQuery.each(settings.getActiveControls(), function (controlKey) {
				if (-1 !== settingsKeys.indexOf(controlKey)) {
					elementSettings[controlKey] = settings.attributes[controlKey];
				}
			});
		} else {
			elementSettings = $element.data('settings') || {};
		}

		return elementSettings;
	};

	/**
	* ----------------------------------------------------------------------------------------
	*    On Style Change Event
	* ----------------------------------------------------------------------------------------
	*/
	/*
	    Usage: 
	    $ele.on('style', function(e, prop, value) {
	        if (prop == 'left') {
	            console.debug('new value for left: ' + value);
	        }
	    });
	*/

	(function() {
	    var ev = new $.Event('style');

	    // trigger 'style' event when a css property changes because a new style value is applied
	    var origCss = $.fn.css;
	    $.fn.css = function(prop, value) {
	        if (isSimpleAssignment(prop, value)) {
	            this.trigger(ev, [prop, value]);
	        }
	        return origCss.apply(this, arguments);

	        // true if: $ele.css('prop', 'some value' || 1234)
	        function isSimpleAssignment(prop, value) {
	            return $.type(prop) === 'string' && ($.type(value) === 'undefined' || $.type(value) === 'null' || $.type(value) === 'string' || $.type(value) === 'number');
	        }
	    };

	    // trigger 'style' event when all css properties change (and revert back to inherited) because the style attribute is removed
	    var origRemoveAttr = $.fn.removeAttr;
	    $.fn.removeAttr = function(attr) {
	        if (attr === 'style') {
	            var ele = this;
	            $.each(ele.styleProperties(), function(index, cssProperty) {
	                ele.removeStyle(cssProperty); // remove so we can get the original value
	                ele.trigger(ev, [cssProperty, ele.css(cssProperty)]);
	            });
	        }
	        // by now all classes are gone, but perhaps jquery wants to fire some event
	        return origRemoveAttr.apply(this, arguments);
	    };

	    // helper plugins to iterate and remove individual css styles
	    $.fn.styleProperties = function() {
	        var styleProperties = [];
	        var styles = $(this).attr('style').split("; ");
	        for (var i in styles) {
	            styleProperties.push(styles[i].split(": ")[0]);
	        }
	        return styleProperties;
	    };

	    $.fn.removeStyle = function(style) {
	        var search = new RegExp(style + '[^;]+;?', 'g');

	        return this.each(function() {
	            $(this).attr('style', function(i, style) {
	                return style.replace(search, '');
	            });
	        });
	    };
	})();

	/**
	* ----------------------------------------------------------------------------------------
	*   Set Background Image
	* ----------------------------------------------------------------------------------------
	*/

	var BGImageElement = function( $scope ) {

		var $bgImage = $scope.find('.bg-image');
		$bgImage.each(function(){
			var $this = $(this);
			if ( $this.data('bg-image') ) {	
				var imageUrl = $this.data('bg-image');
				if ( $this.css('background-image') != 'url("' + imageUrl + '")' ) {
					$this.css('background-image', 'url("' + imageUrl + '")' );
				}
			}

		})
	}


	/**
	* ----------------------------------------------------------------------------------------
	*   Set Background Color
	* ----------------------------------------------------------------------------------------
	*/

	var BGColorElement = function( $scope ) {

		var $bgColor = $scope.find('.bg-color');

		$bgColor.each(function(){
			var $this = $(this);

			var color = $this.data('bg-color');
			if ( $this.css('background-color') != color ) {
				$this.css('background-color', color);
			}

			var opacity = $this.data('opacity');
			if ( typeof $this.data('opacity') != 'undefined' && $this.css('opacity') != opacity ) {
				$this.css('opacity', opacity);
			}
		})

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Product Before Image
	* ----------------------------------------------------------------------------------------
	*/

	var BGBeforeElement = function( $scope ) {

		var $productImage = $scope.find('.image-has-rotate');
		$productImage.each(function(){
			var $this = $(this);
			if ( $this.find('img') && $this.find('.rotate-before-image') ) {
				var img = $this.find('img');
				var beforeImg = $this.find('.rotate-before-image');
				beforeImg.css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(' + img.attr('src') + ')');
			}
		})

	}
	

	/**
	* ----------------------------------------------------------------------------------------
	*   Set SVG Icon Bg Color
	* ----------------------------------------------------------------------------------------
	*/

	var SVGIcon = function( $scope ){

		var $svgIcon = $scope.find('.icon-svg');

		$svgIcon.each(function(){
			var $this = $(this);

			var svgColor = $this.data('bg-color');
			if ( svgColor != undefined && $this.parent().css('background-color') != svgColor ) {
				$this.parent().css('background-color', svgColor );
			}
		})
	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Countdown Init
	* ----------------------------------------------------------------------------------------
	*/

	var countdownElement = function( $scope ) {

		var $countdown = $scope.find('.is-jscountdown');

		var dayText = skytower.day;
		var daysPluralText = skytower.days;
		var hourText = skytower.hour;
		var hoursPluralText = skytower.hours;
		var minuteText = skytower.minute;
		var minutesPluralText = skytower.minutes;

		$countdown.each(function(){
			var $this = $(this);
			var finalDate = $this.data('release-date');

			$this.countdown(finalDate)
			.on('update.countdown', function(event) {

				var format = '%H:%M:%S';

				if ( $this.data('short') ) {

					if( event.offset.totalDays > 0 ) {
						format = '%-D %!D:' + dayText + ' ,' + daysPluralText + ' ;';
					} else if ( event.offset.hours > 0 ) {
						format = '%-H %!H:' + hourText + ' ,' + hoursPluralText + ' ;';
					} else {
						format = '%-M %!M:' + minuteText + ' ,' + minutesPluralText  + ' ;';
					}

					$this.data('started', 'true');
					$this.html(event.strftime(format));

				} else if(event.offset.totalDays > 0) {
					var daysFormat = '%-D';

					$this.data('started', 'true');
					$this.html('<span class="jscountdown-number">' + 
						event.strftime(daysFormat) +
						'</span>' + 
						'<span class="jscountdown-text">' + 
						event.strftime('%!D:' + dayText + ' ,' + daysPluralText + ' ;') + 
						'</span>' +
						'<span class="jscountdown-number">' +
						event.strftime(format) + 
						'</span>');
					
				} else {
					$this.data('started', 'true');
					$this.html('<span class="jscountdown-number">' + event.strftime(format) + '</span>');
				}

			})
			.on('finish.countdown', function(event) {
				$this.parent().addClass('countdown-expired')
			})

		})
	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Content Slider
	* ----------------------------------------------------------------------------------------
	*/

	var ContentSliderImages = function( $scope ) {

		var $imagesSlider = $scope.find('.ssd-content-slider-images'),
			elementSettings = getElementSettings( $scope ),
			slidesToShow = +elementSettings.slides_to_show || 1,
			isSingleSlide = 1 === slidesToShow,
			breakpoints = elementorFrontend.config.breakpoints;

		var setEqualHeight = function(){
			if ( $imagesSlider.hasClass('content-slider-images--equal-height') ) {
				$imagesSlider.find('.content-slider-image').height($imagesSlider.siblings('.ssd-content-slider-text').outerHeight());
				$imagesSlider.find('.slick-list').height('');
			}
		}

		var slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplay_speed,
			infinite: 'yes' === elementSettings.infinite,
			adaptiveHeight: 'yes' === elementSettings.autoheight,
			speed: elementSettings.speed,
			arrows: -1,
			dots: -1,
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_tablet || ( isSingleSlide ? 1 : 2 ),
						slidesToScroll: 1
					}
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_mobile || 1,
						slidesToScroll: 1
					}
				}
			]
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		}

		setEqualHeight();

		$imagesSlider.slick( slickOptions );
		$imagesSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
			$imagesSlider.next('.ssd-content-slider-text').slick('slickGoTo', nextSlide );
		})
	

		// Resize image on Elementor "Image Width" change
		$imagesSlider._resize( function() {
			setEqualHeight();
			$imagesSlider.slick( 'setHeight' );
			$imagesSlider.slick( 'setPosition' );
			$imagesSlider.slick( 'setDimensions' );
		});

	}

	var ContentSliderText = function( $scope ) {

		var $contentSlider = $scope.find('.ssd-content-slider-text'),
			elementSettings = getElementSettings( $scope ),
			slidesToShow = +elementSettings.slides_to_show || 1,
			isSingleSlide = 1 === slidesToShow,
			breakpoints = elementorFrontend.config.breakpoints;

		var slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: false,
			infinite: 'yes' === elementSettings.infinite,
			adaptiveHeight: 'yes' === elementSettings.autoheight,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_tablet || ( isSingleSlide ? 1 : 2 ),
						slidesToScroll: 1
					}
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_mobile || 1,
						slidesToScroll: 1
					}
				}
			]
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		}

		$contentSlider.slick( slickOptions );
		$contentSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
			// var sliderImage = event.page.index;
			$contentSlider.prev('.ssd-content-slider-images').slick('slickGoTo', nextSlide );
		})

		// Resize Text on Elementor "Image Width" change
		$contentSlider._resize( function() {
			$contentSlider.slick( 'setHeight' );
			$contentSlider.slick( 'setPosition' );
		});

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Product Slider
	* ----------------------------------------------------------------------------------------
	*/

	var ProductSlider = function( $scope ) {

		var $productSlider = $scope.find('.is-product-slider'),
			elementSettings = getElementSettings( $scope ),
			slidesToShow = +elementSettings.slides_to_show || 3,
			isSingleSlide = 1 === slidesToShow,
			breakpoints = elementorFrontend.config.breakpoints;

		var centerPadding = elementSettings.center_padding == null ? 160 : elementSettings.center_padding.size;
		var centerMode = elementSettings.center_slide == 'yes' ? true : false;

		var slickOptions = {
			centerMode: centerMode,
			centerPadding: centerPadding + 'px',
			slidesToShow: slidesToShow,
			touchThreshold: 10,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplay_speed,
			infinite: 'yes' === elementSettings.infinite,
			pauseOnHover: 'yes' ===  elementSettings.pause_on_hover,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_tablet || ( isSingleSlide ? 1 : 2 ),
						centerPadding: elementSettings.center_padding_tablet == null ? 80 : elementSettings.center_padding_tablet.size
					}
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_mobile || 1,
						centerPadding: elementSettings.center_padding_mobile == null ? 0 : elementSettings.center_padding_mobile.size
					}
				}
			]
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		}

		$productSlider.slick( slickOptions );

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Blog Slider
	* ----------------------------------------------------------------------------------------
	*/

	var BlogSlider = function( $scope ) {

		var $blogSlider = $scope.find('.is-blog-slider'),
			elementSettings = getElementSettings( $scope ),
			slidesToShow = +elementSettings.slides_to_show || 1,
			isSingleSlide = 1 === slidesToShow,
			breakpoints = elementorFrontend.config.breakpoints;

		var slickOptions = {
			slidesToShow: slidesToShow,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplay_speed,
			infinite: 'yes' === elementSettings.infinite,
			pauseOnHover: 'yes' ===  elementSettings.pause_on_hover,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			responsive: [
				{
					breakpoint: breakpoints.lg,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_tablet || ( isSingleSlide ? 1 : 2 ),
						centerMode: true,
						centerPadding: '0px',
						slidesToScroll: 1
					}
				},
				{
					breakpoint: breakpoints.md,
					settings: {
						slidesToShow: +elementSettings.slides_to_show_mobile || 1,
						centerMode: true,
						centerPadding: '0px',
						slidesToScroll: 1
					}
				}
			]
		};

		if ( isSingleSlide ) {
			slickOptions.fade = 'fade' === elementSettings.effect;
		}

		$blogSlider.slick( slickOptions );

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Poster
	* ----------------------------------------------------------------------------------------
	*/

	var SSDPoster = function( $scope ) {
		var player                     = null,
			isYTVideo                  = null,
			$backgroundVideoContainer  = $scope.find('.poster-background-video-container'),
			$backgroundVideoEmbed      = $backgroundVideoContainer.children('.poster-background-video-embed'),
			$backgroundVideoHosted     = $backgroundVideoContainer.children('.poster-background-video-hosted'),
			elementSettings            = getElementSettings($scope);

		var calcVideosSize = function() {
			var containerWidth = $backgroundVideoContainer.outerWidth(),
			containerHeight = $backgroundVideoContainer.outerHeight(),
			aspectRatioSetting = '16:9', //TEMP
			aspectRatioArray = aspectRatioSetting.split( ':' ),
			aspectRatio = aspectRatioArray[ 0 ] / aspectRatioArray[ 1 ],
			ratioWidth = containerWidth / aspectRatio,
			ratioHeight = containerHeight * aspectRatio,
			isWidthFixed = containerWidth / containerHeight > aspectRatio;

			return {
				width: isWidthFixed ? containerWidth : ratioHeight,
				height: isWidthFixed ? ratioWidth : containerHeight
			};
		};

		var changeVideoSize = function() {
			var $video = isYTVideo ? jQuery( player.getIframe() ) : $backgroundVideoHosted,
			size = calcVideosSize();

			$video.width( size.width ).height( size.height );
		};

		var startVideoLoop = function() {

			// If the section has been removed
			if ( ! player.getIframe().contentWindow ) {
				return;
			}

			var startPoint = elementSettings.background_video_start || 0,
				endPoint = elementSettings.background_video_end;

			player.seekTo( startPoint );

			if ( endPoint ) {
				var durationToEnd = endPoint - startPoint + 1;

				setTimeout( function() {
					startVideoLoop();
				}, durationToEnd * 1000 );
			}
		};
		
		var prepareYTVideo = function( YT, videoID ) {
			var startStateCode = YT.PlayerState.PLAYING;

			// Since version 67, Chrome doesn't fire the `PLAYING` state at start time
			if ( window.chrome ) {
				startStateCode = YT.PlayerState.UNSTARTED;
			}

			$backgroundVideoContainer.addClass( 'elementor-loading elementor-invisible' );

			player = new YT.Player( $backgroundVideoEmbed[ 0 ], {
				videoId: videoID,
				events: {
					onReady: function() {
						player.mute();

						changeVideoSize();

						startVideoLoop();

						player.playVideo();
					},
					onStateChange: function( event ) {
						switch ( event.data ) {
							case startStateCode:
							$backgroundVideoContainer.removeClass( 'elementor-invisible elementor-loading' );

							break;
							case YT.PlayerState.ENDED:
							player.seekTo( elementSettings.background_video_start || 0 );
						}
					}
				},
				playerVars: {
					controls: 0,
					showinfo: 0,
					rel: 0
				}
			} );

			elementorFrontend.getElements( '$window' ).on( 'resize', changeVideoSize );
		};

		var activate = function() {
			var videoLink = elementSettings.background_video_link,
			videoID = elementorFrontend.utils.youtube.getYoutubeIDFromURL( videoLink );

			isYTVideo = !! videoID;

			if ( videoID ) {
				elementorFrontend.utils.youtube.onYoutubeApiReady( function( YT ) {
					setTimeout( function() {
						prepareYTVideo( YT, videoID );
					}, 1 );
				} );
			} else {
				$backgroundVideoHosted.attr( 'src', videoLink ).one( 'canplay', changeVideoSize );
			}
		};

		var deactivate = function() {
			if ( isYTVideo && player.getIframe() ) {
				player.destroy();
			} else {
				$backgroundVideoHosted.removeAttr( 'src' );
			}
		};

		var run = function() {
			if ( 'video' === elementSettings.background_background && elementSettings.background_video_link ) {
				activate();
			} else {
				deactivate();
			}
		};

		run();
	}

	/**
	* ----------------------------------------------------------------------------------------
	*   Text Rotator
	* ----------------------------------------------------------------------------------------
	*/

	var textRotator = function( $scope ){
		
		var $textRotator = $scope.find('.is-text-rotator');
		var svgColor = $textRotator.data('fill');

		$textRotator.css('width', '');

		$textRotator.css({
			'visibility': 'visible'
  		});

		$textRotator.textrotator({
			animation: $textRotator.data('effect'),
			separator: "||",
			speed: $textRotator.data('speed')
		});
	}

	/**
	* ----------------------------------------------------------------------------------------
	*   Background Parallax
	* ----------------------------------------------------------------------------------------
	*/

	var bgParallax = function( $scope ){

		if ( 'section' !== $scope.data('element_type') )
			return;

		var $element = $scope,
			elementSettings = getElementSettings( $scope );

		if ( $element.data('ssd-jarallax-enabled') == true ) {
			$element.data('ssd-jarallax-enabled', false);
			$element.jarallax('destroy');
		}
		if ( elementSettings.parallax_enable == 'yes' ) {

			var parallaxOptions = {}

			if ( elementSettings.background_image ) {
				parallaxOptions.parallaxBgImage = elementSettings.background_image['url'];
			}
			if ( elementSettings.parallax_position ) {
				if ( elementSettings.parallax_position == 'custom' ) {
					parallaxOptions.imgPosition = elementSettings.parallax_position_x.size + elementSettings.parallax_position_x.unit + ' ' + elementSettings.parallax_position_y.size + elementSettings.parallax_position_y.unit;
				} else {
					parallaxOptions.imgPosition = elementSettings.parallax_position;
				}
			}
			if ( elementSettings.parallax_repeat ) {
				parallaxOptions.imgRepeat = elementSettings.parallax_repeat;
			}
			if ( elementSettings.parallax_size ) {
				parallaxOptions.imgSize = elementSettings.parallax_size;
			}
			if ( elementSettings.parallax_speed ) {
				parallaxOptions.speed = elementSettings.parallax_speed;
			}

			parallaxOptions.disableParallax = /iPad|iPhone|iPod|Android/;

			setTimeout( function(){
				$element.data('ssd-jarallax-enabled', true);
				$element.jarallax(parallaxOptions);
			}, 1)

			new ResizeSensor($element, function(){
				$element.jarallax('onResize');
			});
		}
	}

	/**
	* ----------------------------------------------------------------------------------------
	*   Google Maps
	* ----------------------------------------------------------------------------------------
	*/

	var GoogleMaps = function( $scope ) {

		var $googleMap = $scope.find('.is-elementor-google-map'),
			elementSettings = getElementSettings( $scope );

		var render_map = function( $el ) {

			var args = {
				zoom				: elementSettings.zoom.size ? elementSettings.zoom.size : 15,
				center				: new google.maps.LatLng(0, 0),
				disableDefaultUI	: elementSettings.disable_default_ui == 'yes' ? true : false,
				scrollwheel 		: elementSettings.disable_scroll == 'yes' ? false : true,
				mapTypeId			: google.maps.MapTypeId.ROADMAP,
				styles: elementSettings.json_style ? JSON.parse(elementSettings.json_style) : [{"featureType": "all","elementType": "labels.text","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "labels","stylers": [{"visibility": "on"}]},{"featureType": "landscape","elementType": "all","stylers": [{"visibility": "off"},{"color": "#ff0000"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#e9e9e9"},{"visibility": "simplified"}]},{"featureType": "landscape.natural","elementType": "geometry.fill","stylers": [{"color": "#f5f5f2"},{"visibility": "on"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi","elementType": "labels.text","stylers": [{"visibility": "on"}]},{"featureType": "poi","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "poi.attraction","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi.attraction","elementType": "labels.icon","stylers": [{"visibility": "on"}]},{"featureType": "poi.business","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi.business","elementType": "labels","stylers": [{"visibility": "on"},{"saturation": "-69"},{"lightness": "0"}]},{"featureType": "poi.government","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi.government","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "poi.medical","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi.medical","elementType": "labels","stylers": [{"visibility": "on"},{"saturation": "-12"}]},{"featureType": "poi.park","elementType": "all","stylers": [{"color": "#a4b65d"},{"gamma": "1.51"},{"saturation": "0"},{"lightness": "15"}]},{"featureType": "poi.park","elementType": "labels.text","stylers": [{"visibility": "on"}]},{"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"visibility": "on"},{"color": "#528441"}]},{"featureType": "poi.park","elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"lightness": "20"}]},{"featureType": "poi.park","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "poi.place_of_worship","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi.school","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "poi.sports_complex","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi.sports_complex","elementType": "geometry","stylers": [{"color": "#c7c7c7"},{"visibility": "off"}]},{"featureType": "road.highway","elementType": "geometry","stylers": [{"visibility": "simplified"},{"color": "#fffae8"}]},{"featureType": "road.highway","elementType": "labels.text","stylers": [{"visibility": "simplified"},{"color": "#696969"}]},{"featureType": "road.highway","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "road.arterial","elementType": "all","stylers": [{"visibility": "simplified"}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"visibility": "simplified"}]},{"featureType": "road.local","elementType": "all","stylers": [{"color": "#fdfdfd"}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"visibility": "on"}]},{"featureType": "road.local","elementType": "labels","stylers": [{"visibility": "simplified"},{"color": "#9b9b9b"}]},{"featureType": "transit","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "water","elementType": "all","stylers": [{"color": "#a0d3d3"}]},{"featureType": "water","elementType": "labels","stylers": [{"visibility": "simplified"},{"color": "#7b7b7b"}]}]
			};


			// Create map	        	
			var map = new google.maps.Map( $el[0], args);

			// Disable Scroll
			google.maps.event.addListener(map, 'click', function(event){
				this.setOptions({scrollwheel:true});
			});

			google.maps.event.addListener(map, 'drag', function(event){
				this.setOptions({scrollwheel:true});
			});

			// Set lat ang lng
			var geocoder = new google.maps.Geocoder();
			var location;
			geocoder.geocode( { 'address': elementSettings.address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					location = results[0].geometry.location;

					map.markers = [];

					add_marker( $el, map, location );
					center_map( map );		

					$window.on('resize', function(){
						center_map(map);
					})

				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});

		}


		var add_marker = function( $el, map, location ) {
			var marker = new google.maps.Marker({
				position	: location,
				map			: map,
				icon		: elementSettings.marker.url
			});

			map.markers.push( marker );
		}


		var center_map = function( map ) {
			var bounds = new google.maps.LatLngBounds();

			$.each( map.markers, function( i, marker ){
				var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
				bounds.extend( latlng );
			});

			if( map.markers.length == 1 )
			{
				map.setCenter( bounds.getCenter() );
			}
			else
			{
				map.fitBounds( bounds );
			}
		}


		$googleMap.each(function(){
			render_map( $(this) );
		});

	}


	/**
	* ----------------------------------------------------------------------------------------
	*   Hotspots
	* ----------------------------------------------------------------------------------------
	*/

	var Hotspots = function( $scope ){

		var $element = $scope,
			elementSettings = getElementSettings( $scope );

		$element.find('.ssd-hotspot-point').each(function(){
			var $hotspot = $(this);

			$hotspot.on('click', function(){
				// $element.find('.ssd-hotspot-point').removeClass('ssd-hotspot-point--active')
				// $hotspot.addClass('ssd-hotspot-point--active');
				changeActiveTab($hotspot.data('id'));
			})
		})



		// Hotspots Accordion
		var $activeContent = null;
		var settings = {
			selectors: {
				tabTitle: '.elementor-tab-title',
				tabContent: '.elementor-tab-content'
			},
			classes: {
				active: 'elementor-active'
			},
			showTabFn: 'show',
			hideTabFn: 'hide',
			toggleSelf: false,
			hidePrevious: true,
			autoExpand: true
		};

		var $tabTitles = $element.find('.elementor-tab-title');
		var $tabContents = $element.find('.elementor-tab-content');
		var defaultActiveTab = 1;

		var activateDefaultTab = function activateDefaultTab() {
		    changeActiveTab(defaultActiveTab);
		}

		var deactivateActiveTab = function deactivateActiveTab(tabIndex) {
			var activeClass = settings.classes.active,
			activeFilter = tabIndex ? '[data-tab="' + tabIndex + '"]' : '.' + activeClass,
			$activeTitle = $tabTitles.filter(activeFilter),
			$activeContent = $tabContents.filter(activeFilter),
			activeFilter = tabIndex ? '[data-tab="' + tabIndex + '"]' : '.' + activeClass,
			$activeTitle = $tabTitles.filter(activeFilter),
			$hotspot = tabIndex ? $element.find('.ssd-hotspot-point[data-id="' + tabIndex + '"]') : $element.find('.ssd-hotspot-point.ssd-hotspot-point--active');
			$activeTitle.add($activeContent).removeClass(activeClass);
			$activeContent.slideUp();
			$hotspot.tooltipster('close');
			$hotspot.removeClass('ssd-hotspot-point--active');
		}

		var activateTab = function activateTab(tabIndex) {
			var activeClass = settings.classes.active,
			$requestedTitle = $tabTitles.filter('[data-tab="' + tabIndex + '"]'),
			$requestedContent = $tabContents.filter('[data-tab="' + tabIndex + '"]'),
			$hotspot = $element.find('.ssd-hotspot-point[data-id="' + tabIndex + '"]');
			$requestedTitle.add($requestedContent).addClass(activeClass);
			$requestedContent.slideDown();
			$hotspot.tooltipster('open');
			$hotspot.addClass('ssd-hotspot-point--active');
		}

		var isTabActiveCheck = function isTabActiveCheck(tabIndex) {
			return $tabTitles.filter('[data-tab="' + tabIndex + '"]').hasClass(settings.classes.active);
		}

		var bindEvents = function bindEvents() {

			$tabTitles.on({
				keydown: function keydown(event) {
					if ('Enter' === event.key) {
						event.preventDefault();
						changeActiveTab(event.currentTarget.getAttribute('data-tab'));
					}
				},
				click: function click(event) {
					event.preventDefault();
					changeActiveTab(event.currentTarget.getAttribute('data-tab'));
				}
			});
		}

		var changeActiveTab = function changeActiveTab(tabIndex) {
			var isActiveTab = isTabActiveCheck(tabIndex);

			if ((settings.toggleSelf || !isActiveTab) && settings.hidePrevious) {
				deactivateActiveTab();
			}

			if (!settings.hidePrevious && isActiveTab) {
				deactivateActiveTab(tabIndex);
			}

			if (!isActiveTab) {
				activateTab(tabIndex);
			}
		}


		activateDefaultTab();
		bindEvents();

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Template Tab Slider
	* ----------------------------------------------------------------------------------------
	*/

	var TemplateTabSlider = function( $scope ) {

		var $tabSlider = $scope.find('.is-tt-slider'),
			elementSettings = getElementSettings( $scope ),
			adaptiveHeight = elementSettings.autoheight == 'yes' ? true : false,
			sliderSpeed = 450;


		var slickOptions = {
			slidesToShow: 1,
			autoplay: false,
			infinite: false,
			draggable: false,
			adaptiveHeight: adaptiveHeight,
			speed: sliderSpeed,
			arrows: false,
			dots: false,
			fade: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: true,
						infinite: true,
					}
				},
			]
		};

		$tabSlider.on('init', function(){
			var slideIndex = $('.slick-current').data('slick-index');
			var $tab = $tabSlider.siblings('.ssd-tt-slider-tabs').find('.ssd-tt-slider-tab[data-slide-index="' + slideIndex + '"]');
			$tab.addClass('ssd-tt-slider-tab--current');
		});



		$tabSlider.slick( slickOptions );

		// Tabs Go To
		$('.ssd-tt-slider-tab').on('click', function() {
			var $this = $(this);
			var $tabsParent = $this.parents('.ssd-tt-slider-tabs');
			var slideIndex = $this.data('slide-index');
			if ( !$tabsParent.hasClass('ssd-tt-slider-tabs--transitioning') ) {
				$tabsParent.addClass('ssd-tt-slider-tabs--transitioning');
				$tabsParent.find('.ssd-tt-slider-tab--current').removeClass('ssd-tt-slider-tab--current');
				$tabsParent.find('.ssd-tt-slider-tab[data-slide-index="' + slideIndex + '"]').addClass('ssd-tt-slider-tab--current');
				$tabSlider.slick('slickGoTo', slideIndex );
				setTimeout(function(){
					$tabsParent.removeClass('ssd-tt-slider-tabs--transitioning');
				}, sliderSpeed)
			}
		})

		// Resize image on Elementor "Image Width" change
		$tabSlider.parent()._resize( function() {
			$tabSlider.slick( 'setHeight' );
			$tabSlider.slick( 'setPosition' );
			$tabSlider.slick( 'setDimensions' );
		});

	}

	/**
	* ----------------------------------------------------------------------------------------
	*    Template Slider
	* ----------------------------------------------------------------------------------------
	*/

	var TemplateSlider = function( $scope ) {

		var $templateSlider = $scope.find('.ssd-template-slider'),
			elementSettings = getElementSettings( $scope );


		var slickOptions = {
			slidesToShow: 1,
			autoplay: 'yes' === elementSettings.autoplay,
			autoplaySpeed: elementSettings.autoplay_speed,
			draggable: 'yes' === elementSettings.draggable,
			infinite: 'yes' === elementSettings.infinite,
			adaptiveHeight: 'yes' === elementSettings.autoheight,
			speed: elementSettings.speed,
			arrows: -1 !== [ 'arrows', 'both' ].indexOf( elementSettings.navigation ),
			dots: -1 !== [ 'dots', 'both' ].indexOf( elementSettings.navigation ),
			rtl: 'rtl' === elementSettings.direction,
			// fade: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: true,
						infinite: true,
					}
				},
			]
		};

		$templateSlider.slick( slickOptions );

		// Resize image on Elementor "Image Width" change
		// $templateSlider.parent()._resize( function() {
		// 	$templateSlider.slick( 'setHeight' );
		// 	$templateSlider.slick( 'setPosition' );
		// 	$templateSlider.slick( 'setDimensions' );
		// });

	}


	/**
	* ----------------------------------------------------------------------------------------
	*   Hooks
	* ----------------------------------------------------------------------------------------
	*/

	var $window = $(window);
	var $document = $(document);

	$(window).on( 'elementor/frontend/init', function() {

		if ( elementorFrontend.isEditMode() ) {
			isEditMode = true;
		}

		if ( $('body').is('.admin-bar') ) {
			isAdminBar = true;
		}

		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	BGImageElement );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	BGColorElement );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	BGBeforeElement );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	SVGIcon );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	bgParallax );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/global',                         	countdownElement );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_multi_heading.default',      	textRotator );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_content_slider.default',     	ContentSliderImages );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_content_slider.default',     	ContentSliderText );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_product_slider.default',     	ProductSlider );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_blog_slider.default',   			BlogSlider );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_poster.default',             	SSDPoster );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_google_maps.default',        	GoogleMaps );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_hotspots.default',        		Hotspots );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_template_tab_slider.default',	TemplateTabSlider );
		elementorFrontend.hooks.addAction( 'frontend/element_ready/ssd_template_slider.default',		TemplateSlider );

		elementorFrontend.hooks.addFilter( 'frontend/handlers/menu_anchor/scroll_top_distance', function( scrollTop ) {
			return scrollTop - 150;
		} );


	});

})(jQuery);
