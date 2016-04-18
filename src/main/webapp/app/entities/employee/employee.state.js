(function() {
    'use strict';

    angular
        .module('rotamanagerApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('employee', {
            parent: 'entity',
            url: '/employee',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Employees'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/employee/employees.html',
                    controller: 'EmployeeController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('employee-detail', {
            parent: 'entity',
            url: '/employee/{id}',
            data: {
                authorities: ['ROLE_STORE'],
                pageTitle: 'Employee'
            },
            views: {
                'content@authenticated': {
                    templateUrl: 'app/entities/employee/employee-detail.html',
                    controller: 'EmployeeDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Employee', function($stateParams, Employee) {
                    return Employee.get({id : $stateParams.id});
                }]
            }
        })
        .state('employee.new', {
            parent: 'employee',
            url: '/new',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/employee/employee-dialog.html',
                    controller: 'EmployeeDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                employeeIdExternal: null,
                                firstName: null,
                                lastName: null,
                                email: null,
                                phoneNumber: null,
                                picture: null,
                                pictureContentType: null,
                                hiredDate: null,
                                hourlyRate: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('employee', null, { reload: true });
                }, function() {
                    $state.go('employee');
                });
            }]
        })
        .state('employee.edit', {
            parent: 'employee',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/employee/employee-dialog.html',
                    controller: 'EmployeeDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Employee', function(Employee) {
                            return Employee.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('employee', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('employee.delete', {
            parent: 'employee',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_STORE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/employee/employee-delete-dialog.html',
                    controller: 'EmployeeDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Employee', function(Employee) {
                            return Employee.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('employee', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
