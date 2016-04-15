import { Role } from './role.class';

export class Security {

  /* @ngInject */
  constructor(private $q:ng.IQService) {
  }

  userHasRole(role:Role):ng.IPromise {
    return this.userHasAnyRoleOf([role]);
  }

  userHasAnyRoleOf(role:Role[]):ng.IPromise {
    return this.$q.when(true);
  }
}
