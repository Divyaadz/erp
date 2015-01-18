var app = angular.module("POSApp", [ 'ngRoute', 'infinite-scroll']);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/Customers', {
		templateUrl : 'static/views/customer.list.html',
		controller : 'CustomerCtrl'
	}).when('/Employees', {
		templateUrl : 'static/views/employee.list.html',
		controller : 'EmployeeCtr1'
	}).when('/addCustomer', {
		templateUrl : 'static/views/customer.form.html',
		controller : 'CustomerCtrl'
	})

	.otherwise({
		redirectTo : '/Customers'
	});
} ]);

app.controller("MasterCtrl", function($scope, $http) {

	$scope.selectedTab = 'Customers';
	$scope.sidebarSelectedTab = 'Contacts';

	$scope.setSelectedTab = function(tabName) {
		$scope.selectedTab = tabName;
	}

	$scope.open = function(size) {

		var modalInstance = $modal.open({
			templateUrl : 'myModalContent.html',
			controller : 'ModalInstanceCtrl',
			size : size,
			resolve : {
				items : function() {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.setSidebarSelectedTab = function(tabName) {
		$scope.sidebarSelectedTab = tabName;
	}

});

app.controller("EmployeeCtr1", function($scope, $http) {
	$scope.employees = [];
	result = null;
	$scope.currentPage = 0;
	this.busy = false;

	// __init__ methods
	$scope.invokeLoadEmployees = function() {

		// $scope.currentPage++;

		$scope.loadEmployees(1000);
	}

	$scope.loadEmployees = function(limit) {

		if (this.busy)
			return;
		this.busy = true;
		$scope.selectedTab = 'Employees';

		$scope.currentPage++;

		$http.get("/User/list/p" + $scope.currentPage + "/" + limit).success(
				function(result) {

					for (var index = 0; index < result.length; index++) {

						$scope.employees.push(result[index]);
					}

				}).error(function() {
			alert("Unable to load Employee")
		})

		this.busy = false;

	};

	$scope.openwindow = function(productId) {
		$scope.product = $filter('filter')($scope.products, {
			instanceId : productId
		})
		document.getElementById('editProductWindow').show();
	}

});

app.controller("CustomerCtrl", function($scope, $http, $window, $routeParams) {

	$scope.customers = [];
	$scope.currentPageCustomers = [];
	$scope.customer = null;
	result = null;
	$scope.currentPage = 0;
	this.busy = false;
	
	
	
	$scope.addCustomer = function() {

		alert(document.getElementById('addCustomerDialogue'));
		document.getElementById('sampledialog').show();
	}

	$scope.invokeLoadCustomers = function() {

		$scope.loadCustomers(1000);
	}

	$scope.loadCustomers = function(limit) {

		if (this.busy)
			return;
		this.busy = true;
		$scope.selectedTab = 'Customers';

		$scope.currentPage++;

		$http.get("/Customer/list/p" + $scope.currentPage + "/" + limit)
				.success(function(result) {

					for (var index = 0; index < result.length; index++) {

						$scope.customers.push(result[index]);
					}

				}).error(function() {
					$scope.products = null;
					alert("Unable to load Customer")
				})

		this.busy = false;

	};

		
	
	$scope.createCustomer = function(customer){
		
		if (!$scope.customerForm.phoneNumber.$valid){
			alert("Please check the entered data.")
			return;
		}
	
		
		$http({
			method : 'post',
			url : '/Customer/create',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			data : $.param(customer)
		}).success(function(data, status, headers, config) {

			
			$window.alert("Customer information is persisted successfully")
			$('#addCustomerModal').modal('hide');
			
			
			// May be need to look for better approach.. as this method refresh the page.
			$window.location = 'master';
	
		}).error(function(data, status, headers, config) {
			$window.alert("Customer is not persisted")
		});
	}
	
	
	/*
	 * Below functionality is used for save and save another. Success msg is getting retained after between form submit in dom. This need to be checked in later release.
	 */
	
	/*	$scope.createCustomerAndSaveAnother = function(customer){
	$http({
		method : 'post',
		url : '/Customer/create',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		data : $.param(customer)
	}).success(function(data, status, headers, config) {

		$scope.resetForm();
		
	
		
		// May be need to look for better approach.. as this method refresh the page.
		//$window.location = 'static/views/customer.form.html';

	}).error(function(data, status, headers, config) {
		$window.alert("Customer is not persisted")
	});
	//$scope.resetForm($scope.customerForm);
	}
	
	$scope.resetForm = function() {
	      angular.copy({},$scope.customer);
	}
	*/

});
