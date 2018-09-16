//-------------------------------------------------------------------------//
//------------------------------Inscription--------------------------------//
//-------------------------------------------------------------------------//

function Initialiser() {
   if ($("[id$='rbtCompteExistant']").attr("checked")) {
       ActiverVueConecte(true);
    }
   else {
       ActiverVueConecte(false);
   }
}

function ActiverVueOUI() {
    $("[id$='rbtCompteExistant']").attr("checked", "true");
    ActiverVueConecte('true');
}

function ActiverVueConecte(theVal) {
    if (theVal){
        
        $("[id$='tblVueNoConecte']").attr("style", "display:none");
        $("[id$='tblDescription']").attr("style", "display:none");
        $("[id$='tblVueConecte']").attr("style", "display:block");
       // $("[id$='tblSaisiCredencial']").attr("style", "display:none");
        $("[id$='tdDebutEtape2']").attr("class","FinEtapeGrisFonce")
        $("[id$='tdEtape2']").attr("style", "visibility: hidden")
        $("[id$='tdFinEtape2']").attr("style", "visibility: hidden")

        ViderControles(["txtNom", "txtPrenom", "txtEmail", "txtFonction", "txtTelephone"]);
    }
    else {
     
        $("[id$='tblDescription']").attr("style", "display:block");
        $("[id$='tblVueNoConecte']").attr("style", "display:block");        
        $("[id$='tblVueConecte']").attr("style", "display:none");
        //-----
        if ($("[id$='hdnCurrentStep']").val() == '1') {
            $("[id$='tdDebutEtape2']").attr("class", "DebutEtapeGrise EtapeFondGrisClair");
        }
        else {
            $("[id$='tdDebutEtape2']").attr("class", "FinEtapeGrisFonce EtapeFondGrisClair");          
        }
        
        $("[id$='tdEtape2']").attr("style", "visibility: visible")
        $("[id$='tdFinEtape2']").attr("style", "visibility: visible")
        ViderControles(["txtIdentifiant", "txtMotPasse"])
    }
}

function validerExpression(oSrc, args) {
    var aArr = oSrc.id.split('_');
    var aId = aArr[aArr.length - 1];
    var aRegexp=null;
    switch (aId) {
        case "cuvDestinataires":
            aRegexp = /(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*;)*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
            args.IsValid = aRegexp.test($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvMotPasseAccesValidation":
                aRegexp = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
                args.IsValid = aRegexp.test($("[id='" + oSrc.controltovalidate + "']").val());
                break;
        case "cuvNouveauMotPasse":
            args.IsValid = $("[id='" + oSrc.controltovalidate + "']").val() == ($("[id$='txtMotPasseAcces']").val());
            break;         
    }
}

function validerCompte(oSrc, args) {
    var aArr = oSrc.id.split('_');
    var aId = aArr[aArr.length - 1];
    if ($("[id$='rbtCompteExistant']").attr("checked")) {
        switch (aId) {
            case "cuvIdentifiant":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvMotPasse":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvNom":
                args.IsValid = true;
                break;
            case "cuvPrenom":
                args.IsValid = true;
                break;
            case "cuvMotPasse":
                args.IsValid = true;
                break;
            case "cuvMail":
                args.IsValid = true;
                break;
            case "cuvMotPasseAcces":
                args.IsValid = true;
                break;
            case "cuvConfirmerMotPasseAccess":
                args.IsValid = true;
                break;
            case "cuvDestinataires":
                args.IsValid = true;
                break;
        }
    }
    else {
        switch (aId) {
            case "cuvIdentifiant":
                args.IsValid = true;
                break;
            case "cuvMotPasse":
                args.IsValid = true;
                break;
            case "cuvNom":
                args.IsValid =!isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvPrenom":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvMotPasse":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvMail":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvMotPasseAcces":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvConfirmerMotPasseAccess":
                args.IsValid = !isNullOrEmpty($("[id='" + oSrc.controltovalidate + "']").val());
                break;
            case "cuvDestinataires":
                validerExpresion(oSrc, args);
                break;
        }
    }  
}

function isNullOrEmpty(theVal) {
    return (theVal == undefined || theVal == null || theVal.length <= 0) ? true : false;
}

function ViderControles(theList) {
    for (i = 0; i < theList.length; i++) {
        $("[id$='" + theList[i] + "']").val('');
    }
}

//-----------------------------------------------------------------------//
//----------------------------Mot de passe perdu-------------------------//
//-----------------------------------------------------------------------//

function ValiderEmail(oSrc, args) {
    var aArr = oSrc.id.split('_');
    var aId = aArr[aArr.length - 1];
    if ($("[id$='rbtIdentifiant']").attr("checked")) {
        args.IsValid = true;
    }
    else {
        aRegexp = /(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*;)*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
        args.IsValid = aRegexp.test($("[id='" + oSrc.controltovalidate + "']").val());
    }
}