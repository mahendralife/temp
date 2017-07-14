 'use strict';
/*
Singletons – Each component dependent on a service gets a reference to the 
single instance generated by the service factory
	
*/

angular.module('appraiser')
//bx slider 
.directive('bxSlider',['$timeout',function($timeout){
	return {
		restrict: 'E',
		scope:{
			data:'=' ,
			config:'='
		},
		template:[
		'<div class="bx-slider">',
		'<div class="bx-slider-loader"  layout="column" layout-align="center center">',
		'<md-progress-circular md-diameter="30" md-mode="indeterminate"></md-progress-circular>',
		'</div>',
		'<ul class="owl-carousel"  style="visibility:hidden">',
		'<li  ng-repeat="item in data">{{item}}</li>',
		'</ul></div>'].join(''),

		link: function(scope, ele,attr){
			
			scope.sliderConfig = scope.$eval(scope.config) || {};

			scope.$watch('data', function(data){
				if(data){
					scope.initSlider(scope.sliderConfig);
				}
			});

			scope.initSlider = function(config){
				$timeout(function(){
					ele.find('.bx-slider-loader').fadeOut();
					ele.find('.owl-carousel').bxSlider(config);
					ele.find('.owl-carousel').css({'visibility':'visible'});
				},10);

			};
			
			
		}
	};

}]);


