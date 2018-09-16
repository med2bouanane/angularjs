/**
 * Created by MBouanane on 12/10/14.
 */
angular.module('EmpleadosFactory',[])
.factory('Empleados',function(){
    return [{nombre:'Mohamed Bouanane',profesion:'Informático'},
        {nombre:'Ahlam Hichou',profesion:'Abogado'},
        {nombre:'Tasnim Bouanane',profesion:'Alumno'}
    ];
});