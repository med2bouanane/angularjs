/**
 * Created by MBouanane on 12/10/14.
 */
angular.module('TareasFactory',[])
.factory('Tareas',function(){
    return [{nombre:'Practicas',estado:'Hecho'},
        {nombre:'Despliegue',estado:'Pendiente'},
        {nombre:'Producción',estado:'En proceso'}
    ];
});