import { Router, IApplication } from '../../router/router.service';

export class PortalNavigationCtrl {
  apps:NavigationElement[];
  navCollapsed:boolean = true;

  /* @ngInject */
  constructor(private router:Router) {
    this.apps = [];
    this.apps.push(new NavigationElement('home', '#/portal/home', 'Home'));
    let applications:IApplication[] = router.getApplicationsUserIsAuthorizedFor();
    applications.forEach((app:IApplication) => {
      let href = '#/' + app.id + '/';
      let label = app.label || app.id;
      this.apps.push(new NavigationElement(app.id, href, label));
    });
  }

  toggleNavigation():void {
    this.navCollapsed = !this.navCollapsed;
  }

  isAppCurrentOne(app:NavigationElement):boolean {
    let appIdOrStateName = this.router.getIdOrStateNameOfCurrentApp();
    return app.appId === appIdOrStateName;
  }
}

class NavigationElement {
  constructor(public appId:string, public href:string, public label:string) {
  }
}
