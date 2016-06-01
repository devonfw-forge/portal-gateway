export function addHomeStateDef ($stateProvider:angular.ui.IStateProvider) {
  $stateProvider.state('home', {
    url: '/portal/home',
    templateUrl: 'general/home/home.html'
  });
}
