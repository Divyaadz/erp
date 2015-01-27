var app = angular.module("POSApp", [ 'ngRoute', 'infinite-scroll' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/Products', {
		templateUrl : 'static/views/category.list.html',
		controller : 'ProductCtrl'

	}).when('/Categories', {
		templateUrl : 'static/views/category.list.html',
		controller : 'CategoryCtrl'
	}).otherwise({
		redirectTo : '/Products'
	});
} ]);

app.controller("InventoryCtrl", function($scope, $http) {

	$scope.selectedTab = 'Products';

	$scope.setSelectedTab = function(tabName) {
		$scope.selectedTab = tabName;
	}

});

app
		.controller(
				"ProductCtrl",
				function($scope, $http, $window, $route, $filter) {
					$scope.products = [];

					result = null;
					$scope.currentPage = 0;
					this.busy = false;

					$scope.selectedTab = 'Products';

					$scope.invokeLoadProducts = function() {

						$scope.loadProducts(1000);
					}

					$scope.loadProducts = function(limit) {

						if (this.busy)
							return;
						this.busy = true;
						$scope.selectedTab = 'Products';

						$scope.currentPage++;

						$http
								.get(
										"/Product/list/p" + $scope.currentPage
												+ "/" + limit)
								.success(
										function(result) {

											for (var index = 0; index < result.length; index++) {

												$scope.products
														.push(result[index]);
											}

										}).error(function() {
									$scope.products = null;
									alert("Unable to load Product")
								})

						this.busy = false;

					};

					$scope.createProduct = function(Product, productForm,
							productInstanceId) {

						if (!productForm.$valid) {
							alert("Please check the entered data.")
							return;
						}

						if (productInstanceId == null) {
							$scope.invokeAddProduct(Product, productForm);
						} else if (productInstanceId != null) {
							$scope.invokeUpdateProduct(Product, productForm,
									productInstanceId);
						}

					}

					$scope.invokeAddProduct = function(Product, productForm) {

						$http(
								{
									method : 'post',
									url : '/Product/create',
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									},
									data : $.param(Product)
								})
								.success(
										function(data, status, headers, config) {

											$window
													.alert("Product information is persisted successfully");
											$('#addProductModal').modal('hide');

											// Loading Employee section alone..
											// No full page reload
											$location = $window.location.origin
													+ '/master#/Products';
											$route.reload();

										})
								.error(function(data, status, headers, config) {
									$window.alert("Product is not persisted")
								});
					}

					$scope.invokeUpdateProduct = function(Product, productForm,
							productInstanceId) {

						$http(
								{
									method : 'put',
									url : '/Product/' + productInstanceId
											+ '/update',
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									},
									data : $.param(Product)
								})
								.success(
										function(data, status, headers, config) {

											$window
													.alert("Product information is persisted successfully");
											$('#addProductModal').modal('hide');

											// Loading Employee section alone..
											// No full page reload
											$location = $window.location.origin
													+ '/master#/Products';
											$route.reload();

										})
								.error(function(data, status, headers, config) {
									$window.alert("Product is not persisted")
								});
					}

					/*
					 * Below functionality is used for save and save another.
					 */
					$scope.createProductAndSaveAnother = function(Product,
							productForm) {

						$scope.successMsg = "";

						if (!productForm.$valid) {
							alert("Please check the entered data.")
							return;
						}

						$http(
								{
									method : 'post',
									url : '/Product/create',
									headers : {
										'Content-Type' : 'application/x-www-form-urlencoded'
									},
									data : $.param(Product)
								})
								.success(
										function(data, status, headers, config) {

											$scope.resetForm(productForm);
											$scope.successMsg = "Product is saved succesfully. Please save another Product"

										})
								.error(function(data, status, headers, config) {
									$window.alert("Product is not persisted")
								});

					}

					$scope.resetForm = function(productForm) {
						productForm.$setPristine();
						$scope.Product = {};
					}

					$scope.resetProductAddForm = function(product) {

						$scope.product = {};

					}

					$scope.openwindow = function(product) {

						$scope.product = product;
					}

				});

app
.controller(
		"CategoryCtrl",
		function($scope, $http, $window, $route, $filter) {
			$scope.categories = [];

			result = null;
			$scope.currentPage = 0;
			this.busy = false;

			$scope.selectedTab = 'Categories';

			$scope.invokeLoadCategories = function() {

				$scope.loadCategories(1000);
			}

			$scope.loadCategories = function(limit) {

				if (this.busy)
					return;
				this.busy = true;
				$scope.selectedTab = 'Categories';

				$scope.currentPage++;

				$http
						.get(
								"/Category/list/p" + $scope.currentPage
										+ "/" + limit)
						.success(
								function(result) {

									for (var index = 0; index < result.length; index++) {

										$scope.categories
												.push(result[index]);
									}

								}).error(function() {
							$scope.categories = null;
							alert("Unable to load Category")
						})

				this.busy = false;

			};

			$scope.createCategory = function(Category, categoryForm,
					categoryInstanceId) {

				if (!categoryForm.$valid) {
					alert("Please check the entered data.")
					return;
				}

				if (categoryInstanceId == null) {
					$scope.invokeAddCategory(Category, categoryForm);
				} else if (categoryInstanceId != null) {
					$scope.invokeUpdateCategory(Category, categoryForm,
							categoryInstanceId);
				}

			}

			$scope.invokeAddCategory = function(Category, categoryForm) {

				$http(
						{
							method : 'post',
							url : '/Category/create',
							headers : {
								'Content-Type' : 'application/x-www-form-urlencoded'
							},
							data : $.param(Category)
						})
						.success(
								function(data, status, headers, config) {

									$window
											.alert("Category information is persisted successfully");
									$('#addCategoryModal').modal('hide');

									// Loading Employee section alone..
									// No full page reload
									$location = $window.location.origin
											+ '/master#/Categories';
									$route.reload();

								})
						.error(function(data, status, headers, config) {
							$window.alert("Category is not persisted")
						});
			}

			$scope.invokeUpdateCategory = function(Category, categoryForm,
					categoryInstanceId) {

				$http(
						{
							method : 'put',
							url : '/Category/' + categoryInstanceId
									+ '/update',
							headers : {
								'Content-Type' : 'application/x-www-form-urlencoded'
							},
							data : $.param(Category)
						})
						.success(
								function(data, status, headers, config) {

									$window
											.alert("Category information is persisted successfully");
									$('#addCategoryModal').modal('hide');

									// Loading Employee section alone..
									// No full page reload
									$location = $window.location.origin
											+ '/master#/Categories';
									$route.reload();

								})
						.error(function(data, status, headers, config) {
							$window.alert("Category is not persisted")
						});
			}

			/*
			 * Below functionality is used for save and save another.
			 */
			$scope.createCategoryAndSaveAnother = function(Category,
					categoryForm) {

				$scope.successMsg = "";

				if (!categoryForm.$valid) {
					alert("Please check the entered data.")
					return;
				}

				$http(
						{
							method : 'post',
							url : '/Category/create',
							headers : {
								'Content-Type' : 'application/x-www-form-urlencoded'
							},
							data : $.param(Category)
						})
						.success(
								function(data, status, headers, config) {

									$scope.resetForm(categoryForm);
									$scope.successMsg = "Category is saved succesfully. Please save another Category"

								})
						.error(function(data, status, headers, config) {
							$window.alert("Category is not persisted")
						});

			}

			$scope.resetForm = function(categoryForm) {
				categoryForm.$setPristine();
				$scope.Category = {};
			}

			$scope.resetCategoryAddForm = function(category) {

				$scope.category = {};

			}

			$scope.openwindow = function(category) {

				$scope.category = category;
			}

		});