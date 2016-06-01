export class ViewContainerManager {

  /* @ngInject */
  constructor(private $q:ng.IQService, private $document:ng.IDocumentService) {
  }

  private static hideElement(element:any):void {
    if (element) {
      element.style.display = 'none';
    }
  }

  private static showElement(element:any):void {
    if (element) {
      element.style.display = 'block';
    }
  }

  hideCurrentAppOrStateAndShowRequestedApp(idOfAppToHide:string, requestedAppId:string, requestedAppSrc:string):ng.IPromise {
    this.hideApplicationOrState(idOfAppToHide);
    return this.showApplication(requestedAppId, requestedAppSrc);
  }

  hideApplicationAndShowState(idOfAppToHide:string) {
    this.hideApplicationAndContainer(idOfAppToHide);
    this.showState();
  }

  private hideApplicationOrState(appId:string):void {
    if (appId) {
      this.hideApplicationAndContainer(appId);
    }
    let stateContainer = this.getStateContainer();
    if (stateContainer) {
      ViewContainerManager.hideElement(stateContainer);
    }
  }

  private showState():void {
    let stateContainer = this.getStateContainer();
    if (stateContainer) {
      ViewContainerManager.showElement(stateContainer);
    }
  }

  private hideApplicationAndContainer(appId:string):void {
    if (appId) {
      let appIframe = this.getAppIframe(appId);
      if (appIframe) {
        ViewContainerManager.hideElement(appIframe);
      }
    }
    let appIframeContainer = this.getAppContainer();
    if (appIframeContainer) {
      ViewContainerManager.hideElement(appIframeContainer);
    }
  }

  private showApplication(appId:string, appSrc:string):ng.IPromise {
    let promise:ng.IPromise;
    let appIframeContainer = this.getAppContainer();
    let appIframe = this.getAppIframe(appId);

    if (appIframe) {
      ViewContainerManager.showElement(appIframe);
      promise = this.$q.when();
    } else {
      let deferredLoading:ng.IDeferred = this.$q.defer();
      promise = deferredLoading.promise;

      let appIframe = this.createAppIframe(appId, appSrc);
      appIframe.onload = function () {
        deferredLoading.resolve();
      };
      appIframeContainer.appendChild(appIframe);
    }
    ViewContainerManager.showElement(appIframeContainer);

    return promise;
  }

  private createAppIframe(appId:string, appSrc:string):any {
    let appIframe = this.getCurrentDocument().createElement('iframe');
    appIframe.setAttribute('id', appId);
    appIframe.setAttribute('src', appSrc);
    appIframe.setAttribute('scrolling', 'yes');
    appIframe.style.border = 'none';
    appIframe.style.width = '100%';
    appIframe.style.height = '99%';

    return appIframe;
  }

  private getCurrentDocument():any {
    return this.$document[0];
  }

  private getAppIframe(appId:string):any {
    let currentDocument = this.getCurrentDocument();
    return currentDocument.getElementById(appId);
  }

  private getStateContainer():any {
    let currentDocument = this.getCurrentDocument();
    return currentDocument.getElementById('ui-router-states');
  }

  private getAppContainer():any {
    let currentDocument = this.getCurrentDocument();
    return currentDocument.getElementById('portal-apps');
  }
}
