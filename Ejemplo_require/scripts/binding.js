/**
 * Created by Mohamed on 21/03/14.
 */
define(['knockout','modelo_persona'],function(ko,persona){

    var bind = function(){

        var p = new persona.persona();

        ko.applyBindings(p);
    };

    return{bind:bind};
});