import { UserService } from './../user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private _router: Router, private _userService: UserService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._userService.isLogged()) return true; // user logado, pode navegar

    // usuário não logado. Redireciona para página de login
    this._router.navigate(['/login']);
    return false;
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    console.log('canLoad: ', 'Verificando se pode caregar o modulo');
    return this._userService.isLogged();
  }
}
