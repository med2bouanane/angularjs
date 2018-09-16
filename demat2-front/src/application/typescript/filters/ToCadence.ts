module arvato.demat.filter {
    "use strict";

    /**
     * Calculate cadence of treatment
     * cadence = volume / time
     * Example : volume is 1, and time is 30 minitues then cadence = 2
     */
    export function calculateCadence(): any {
        return function (time: number, volume: number): any {
            if (!time || !volume) return '-';
            return Math.round(volume / (time / 3600)).toFixed(1);
        }
    }

    app.filter("toCadence", calculateCadence);
}
