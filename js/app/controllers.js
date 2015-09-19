angular.module('bishomen.controllers', [])
.controller('MainCtrl',['$state',function($state){

}])
.controller('HomeCtrl',['$scope','$state','$timeout',function($scope,$state,$timeout){

	$scope.images = [
		{
			title: 'BISHOMEN',
			description: "Es belleza en su máxima expresión",
			url: "images/images/slides/1.jpg",
			button: "Conócelo"
		},
		{
			title: 'BISHOMEN',
			description: "Es solo para hombres",
			url: "images/images/slides/2.jpg",
			button: "¿Por qué?"
		}		
	];

	$scope.smallBanners = [
		{
			url: 'images/images/banner_accesorios.jpg'
		},
		{
			url: 'images/images/banner_salud.jpg'
		},
		{
			url: 'images/images/banner_belleza.jpg'
		}
	];

	$scope.products_grid = [
		{
			title: 'TrendItUp X-treme Styler',
			description: "Gel de larga duración para cabello húmedo, perfecto para esas rumbas y noches largas.",
			url: "images/images/trenditupxtreme.jpg",
			button: "Agregar"
		},
		{
			title: 'Kit de Relajación',
			description: "La crema de manos perfecta, especial para masaje de dedos, junto con el mejor jabón aromático en cristales y un sensual bálsamos de cereza para los labios.",
			url: "images/images/kamil_dresdner_und_lip.jpg",
			button: "Agregar"
		},	
		{
			title: 'Crema Blanqueadora de Dientes',
			description: "Sonríe como si no fumaras o no tomaras café. Dos variedades especiales para cada caso de un excelente blanqueador dental que además te protege.",
			url: "images/images/zahnweiss.jpg",
			button: "Agregar"
		},
		{
			title: 'Spray de alta fijación',
			description: "Consigue el peinado perfecto y que además tu cabello se mantenga en su lugar por horas.",
			url: "images/images/trenditup_spray.jpg",
			button: "Agregar"
		}		
	];
	
}]);
