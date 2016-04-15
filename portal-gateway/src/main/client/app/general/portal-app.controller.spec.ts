import 'angular';

describe('PortalAppCtrl: ', function () {
  let portalAppCtrl:any;

  beforeEach(angular.mock.module('portal.general'));

  beforeEach(inject(($controller:ng.IControllerService) => {
    portalAppCtrl = $controller('PortalAppCtrl');
  }));

  it('exposes some text', function () {
    expect(portalAppCtrl.text).toBe('Text from PortalAppCtrl');
  });
});
