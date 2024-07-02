import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  sessionInfo$ = this.apiService.getSessionData();
  userIsAuthenticated$ = this.sessionInfo$.pipe(
    tap(console.log),
    map((sessionInfo) => (sessionInfo.isAuthorized ? true : false)),
  );

  constructor(private apiService: ApiService) {}
}
