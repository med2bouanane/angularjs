/**
 * Created by MBouanane on 24/10/14.
 */

angular.module('animacion',[])
.animation('.animar',function(){
        return{
            leave:function(elem,done){
                elem.text('Adios');
                elem.addClass('difuminar');
                done();
            },
            enter:function(elem,done){
                elem.text('Hola!!');
                elem.addClass('difuminar');
                done();
            }
        }
    });
