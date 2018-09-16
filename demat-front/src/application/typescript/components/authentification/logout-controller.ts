module arvato.demat.controller {
    "use strict";

    app.controller('LogoutController', function (AuthSharedService) {
        AuthSharedService.logout();
    })
}