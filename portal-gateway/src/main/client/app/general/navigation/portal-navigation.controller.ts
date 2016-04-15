import { Router, IApplication } from '../../router/router.service';

export class PortalNavigationCtrl {
  apps:NavigationElement[];

  /* @ngInject */
  constructor(router:Router) {
    this.apps = [];
    this.apps.push(new NavigationElement('#/portal/welcome', 'Home'));
    let applications:IApplication[] = router.getApplicationsUserIsAuthorizedFor();
    applications.forEach((app:IApplication) => {
      let href = '#/' + app.id + '/';
      let label = app.label || app.id;
      this.apps.push(new NavigationElement(href, label));
    });

  }
}

class NavigationElement {
  constructor(public href:string, public label:string) {
  }
}
