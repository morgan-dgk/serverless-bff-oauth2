import { CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";
import { map } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.userIsAuthenticated$.pipe(
    map((authResp) => {
      if (authResp !== true) {
        const loginPath = router.parseUrl("/login");
        return new RedirectCommand(loginPath, { skipLocationChange: true });
      } else {
        return true;
      }
    }),
  );
};
