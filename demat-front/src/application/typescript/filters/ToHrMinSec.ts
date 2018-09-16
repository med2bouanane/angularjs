module arvato.demat.filter {
    "use strict";

    /**
     * Convert time to formt hh:mm:ss
     * Example: 
     * - time = 4330 seconds, then conversion = 01:12:10
     * - time = 0 seconds, then conversion = -
     */
    export function convertToHrMinSec() {

        return function (time) {

            if (!time) return '-';

            var hours = Math.floor(time / 3600);
            time = time % 3600;
            var minutes = Math.floor(time / 60);
            var seconds = time % 60;
            return (hours ? hours > 9 ? hours + ':' : '0' + hours + ':' : '00:') + (minutes ? minutes > 9 ? minutes + ':' : '0' + minutes + ':' : '00:') + (seconds ? seconds > 9 ? seconds : '0' + seconds : '00');
        }
    }

    app.filter('toHrMinSec', convertToHrMinSec);
}
