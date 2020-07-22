import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from '../_models';

const users: User[] = [
    { id: 1, 
    username: 'admin', 
    password: 'admin', 
    firstName: 'Admin', 
    lastName: 'User', 
    role: Role.Admin,
    roleData: {
    userRole: 'Admin',
    hasHomeAcess: true,
    hasTripsAcess: true,
    hasPastTripsAcess: true,
    hasCreateTripsAccess: true,
    hasAlertAcess: true,
    hasAlertManagementAcess: true,
    hasSensorsAccess: true,
    hasAddSensorsAccess: true,
    hasRoutesAcess: true,
    hasSAddRoutesAccess: true,
    hasUsersAccess: true,
    hasAddUserAccess: true,
    hasDashboardAccess: true,
    hasReportAccess: true,
    hasRoleSettingsAccess: true,
    }
    

},
{ id: 2, 
    username: 'user', 
    password: 'user', 
    firstName: 'Normal', 
    lastName: 'User',
    role: Role.User,
    roleData: {
    userRole: 'User',
    hasHomeAcess: true,
    hasTripsAcess: true,
    hasPastTripsAcess: true,
    hasCreateTripsAccess: true,
    hasAlertAcess: true,
    hasAlertManagementAcess: true,
    hasSensorsAccess: true,
    hasAddSensorsAccess: true,
    hasRoutesAcess: true,
    hasSAddRoutesAccess: true,
    hasUsersAccess: false,
    hasAddUserAccess: true,
    hasDashboardAccess: true,
    hasReportAccess: true,
    hasRoleSettingsAccess: true,
    }
    
},
{   id: 3, 
    username: 'driver', 
    password: 'driver', 
    firstName: 'Admin', 
    lastName: 'User', 
    role: Role.Driver,
    roleData: {
        userRole: 'Driver',
        hasHomeAcess: true,
        hasTripsAcess: true,
        hasPastTripsAcess: true,
        hasCreateTripsAccess: true,
        hasAlertAcess: true,
        hasAlertManagementAcess: true,
        hasSensorsAccess: false,
        hasAddSensorsAccess: true,
        hasRoutesAcess: true,
        hasSAddRoutesAccess: true,
        hasUsersAccess: false,
        hasAddUserAccess: true,
        hasDashboardAccess: true,
        hasReportAccess: true,
        hasRoleSettingsAccess: true,
        }
},
{   id: 4, username: 'fleet manager',
    password: 'fleet manager', 
    firstName: 'Normal', 
    lastName: 'User', 
    role: Role.Fleet_Manager,
    roleData: {
    userRole: 'Fleet Manager',
    hasHomeAcess: true,
    hasTripsAcess: true,
    hasPastTripsAcess: true,
    hasCreateTripsAccess: false,
    hasAlertAcess: true,
    hasAlertManagementAcess: true,
    hasSensorsAccess: true,
    hasAddSensorsAccess: true,
    hasRoutesAcess: false,
    hasSAddRoutesAccess: true,
    hasUsersAccess: true,
    hasAddUserAccess: true,
    hasDashboardAccess: true,
    hasReportAccess: false,
    hasRoleSettingsAccess: true,
    }
},
{   id: 5, 
    username: 'supervisor', 
    password: 'supervisor', 
    firstName: 'Admin', 
    lastName: 'User',
    role: Role.Supervisor,
    roleData: {
    userRole: 'Supervisor',
    hasHomeAcess: true,
    hasTripsAcess: true,
    hasPastTripsAcess: true,
    hasCreateTripsAccess: true,
    hasAlertAcess: true,
    hasAlertManagementAcess: true,
    hasSensorsAccess: true,
    hasAddSensorsAccess: true,
    hasRoutesAcess: true,
    hasSAddRoutesAccess: true,
    hasUsersAccess: true,
    hasAddUserAccess: true,
    hasDashboardAccess: true,
    hasReportAccess: true,
    hasRoleSettingsAccess: true,
    }, 
    
    }

];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'POST':
                        return postUsers();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function postUsers() {
            
            const user = body
            users.push(user)
            localStorage.setItem('users', JSON.stringify(users));

            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(user);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser().role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt(headers.get('Authorization').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
    // genRoles(users: User[]): number {
    //     return users.length > 0 ? Math.max(....map(hero => hero.id)) + 1 : 11;
    //   }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};