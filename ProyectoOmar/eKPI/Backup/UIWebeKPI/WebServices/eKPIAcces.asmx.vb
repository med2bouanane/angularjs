Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel
Imports System.Web.Script.Services
Imports System.Reflection
Imports UIWebeKPI

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()> _
<System.Web.Services.WebService(Namespace:="http://tempuri.org/")> _
<System.Web.Services.WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<ToolboxItem(False)> _
Public Class eKPIAcces
    Inherits System.Web.Services.WebService

#Region "Déclaration"
    Enum TypeIdentificateur
        id
        login
        guid
        email
    End Enum
    Const MyLANGUEDEFAULT = "fr"
    Private myResourceManager As System.Resources.ResourceManager
#End Region

#Region "Public"

#Region "Accès"

    <WebMethod()> _
<ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function ObtenirAcces(ByVal theIdentifiant As String, ByVal theMotPasse As String) As String
        Dim aSucces = True
        Dim aUtilisateur As BOeKPI.Utilisateur = Nothing
        Try
            aUtilisateur = New BOeKPI.Utilisateur(theIdentifiant, BOeKPI.Utilisateur.TypeChaine.Identifiant)

            Return New With {Key .succes = aSucces, .id = Cripter(aUtilisateur.IDUtilisateur.ToString)}.ToString
        Catch ex As Exception
            aSucces = False
            Return New With {Key .succes = aSucces, .message = ex.Message}.ToString
        Finally
            aUtilisateur = Nothing
        End Try

    End Function


#End Region

#Region "Redefinition"

    <WebMethod()> _
<ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function ObtenirLoginUtilisateur(ByVal theIdentifiant As String, ByVal theTypeIdentificateur As TypeIdentificateur) As String
        Dim aSucces = True
        Dim aUtilisateur As BOeKPI.Utilisateur = Nothing
        Try
            If theTypeIdentificateur = TypeIdentificateur.id Then
                aUtilisateur = New BOeKPI.Utilisateur(CInt(Decrypter(theIdentifiant)), BOGapCommerce.Utilisateur.PeutEtreInactif.Non)
            ElseIf theTypeIdentificateur = TypeIdentificateur.login Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentifiant, BOeKPI.Utilisateur.TypeChaine.Identifiant)
            ElseIf theTypeIdentificateur = TypeIdentificateur.guid Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentifiant, BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
            End If
            Return New With {Key .succes = aSucces, .login = aUtilisateur.Login}.ToString
        Catch ex As Exception
            aSucces = False
            Return New With {Key .succes = aSucces, .message = ex.Message}.ToString
        Finally
            aUtilisateur = Nothing
        End Try
    End Function

    <WebMethod()> _
        <ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function RedefinirMotPasse(ByVal theLangue As String, ByVal thetxtAncienMotPasse As String, ByVal theNouveauMotPasse As String, ByVal theNouveauMotPasseConfirmation As String, ByVal theIdentificateur As String, ByVal theTypeIdentificateur As TypeIdentificateur) As String
        Dim aSucces As Boolean = True
        Dim aMessage As String = String.Empty
        Dim aUtilisateur As New BOeKPI.Utilisateur
        Try
            Dim aIdentificateurDecripter As String

            If theTypeIdentificateur = TypeIdentificateur.id Then
                aIdentificateurDecripter = Decrypter(theIdentificateur)
                aUtilisateur = New BOeKPI.Utilisateur(CInt(aIdentificateurDecripter), BOGapCommerce.Utilisateur.PeutEtreInactif.Non)
            ElseIf theTypeIdentificateur = TypeIdentificateur.login Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentificateur, BOeKPI.Utilisateur.TypeChaine.Identifiant)
            ElseIf theTypeIdentificateur = TypeIdentificateur.guid Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentificateur, BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
            End If

            If Not aUtilisateur Is Nothing Then
                If thetxtAncienMotPasse = aUtilisateur.MotPasse Then
                    aUtilisateur.MotPasse = theNouveauMotPasse
                    aUtilisateur.DateModificationMotPasse = DateTime.Now
                    aUtilisateur.MettreAJourMotDePasse()
                    aMessage = GetLocalResourceObject(theLangue, "MotDePasseChange", "Redefinition")
                Else
                    aSucces = False
                    aMessage = GetLocalResourceObject(theLangue, "ErreurAncienMotdePasseIncorrecte", "Redefinition")
                End If
                'aMessage = "ok"
            End If
            Return New With {Key .succes = aSucces, .message = aMessage}.ToString
        Catch ex As Exception
            Return New With {Key .succes = False, .message = ex.Message}.ToString
        Finally
            aUtilisateur = Nothing
        End Try
    End Function

#End Region

#Region "Mot de passe perdu"

    <WebMethod()> _
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function RecupererMotPasse(ByVal theLangue As String, ByVal theIdentifiant As String, ByVal theTypeIdentifiant As TypeIdentificateur) As String
        Dim aSucces As Boolean = True
        Dim aMessage As String = String.Empty
        Dim aUtilisateur As BOeKPI.Utilisateur = Nothing
        Try
            If theTypeIdentifiant = TypeIdentificateur.login Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentifiant, BOeKPI.Utilisateur.TypeChaine.Identifiant)
            ElseIf theTypeIdentifiant = TypeIdentificateur.email Then
                aUtilisateur = New BOeKPI.Utilisateur(theIdentifiant, BOeKPI.Utilisateur.TypeChaine.Email)
            Else
                Return New With {Key .succes = False, .message = GetLocalResourceObject(theLangue, "IdentifiantNonPermi", "MotPassePerdu").ToString}.ToString
            End If
            Dim aGuid As Guid = Guid.NewGuid()
            aUtilisateur.MettreAJourGuid(aGuid, BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
            Dim aContenuEmail As String = GetLocalResourceObject(theLangue, "EmailRedifinitionMotDePasse", "MotPassePerdu").ToString
            Dim aLienRedefinition As String = System.Configuration.ConfigurationManager.AppSettings("URLBase") & "Redefinition.html?guid=" & aGuid.ToString
            If aUtilisateur.IdTitre > 0 Then
                aContenuEmail = String.Format(aContenuEmail, New BOGapCommerce.Titre(aUtilisateur.IdTitre).Libelle(theLangue).ToString, aUtilisateur.Nom, "<a href='" + aLienRedefinition + "'>" + aLienRedefinition + "</a>")
            Else
                aContenuEmail = String.Format(aContenuEmail, "", aUtilisateur.Nom, "<a href='" + aLienRedefinition + "'>" + aLienRedefinition + "</a>")
            End If
            Email.Email.Envoyer(BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation"), aUtilisateur.Email, GetLocalResourceObject(theLangue, "EmailRedifinitionMotDePasseSujet", "MotPassePerdu").ToString, aContenuEmail, True, 5, theLangue, System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON"))
            aMessage = GetLocalResourceObject(theLangue, "MsgEnvoyeSucces", "MotPassePerdu").ToString()
            Return New With {Key .succes = aSucces, .message = aMessage}.ToString
        Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurMultiples
            aMessage = GetLocalResourceObject(theLangue, "EmailMultiple", "MotPassePerdu").ToString
            BOCommunication.Erreur.LoggerErreur(ex, Nothing, "Erreur lors d'un changement de mot de passe - Plusieurs emails trouvés pour le même utilisateur  : " + ex.Message)
            Return New With {Key .succes = aSucces, .message = aMessage}.ToString
        Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
            If theTypeIdentifiant = TypeIdentificateur.login Then
                aMessage = GetLocalResourceObject(theLangue, "IdentifiantNonTrouve", "MotPassePerdu").ToString 'Pas de mesage de respourse / a eliminer
            Else
                aMessage = GetLocalResourceObject(theLangue, "EmailNonTrouve", "MotPassePerdu").ToString
            End If
            Return New With {Key .succes = aSucces, .message = aMessage}.ToString
        Finally
            aUtilisateur = Nothing
        End Try
    End Function

#End Region

#Region "Suggestion"

    <WebMethod()> _
<ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function EnvoyerSuggestionConecte(ByVal theIdUtilisateur As String, ByVal theSujet As String, ByVal theMessage As String) As String
        Dim aUtilisateur As BOeKPI.Utilisateur
        Dim aSucces As Boolean = True
        Try
            'myResourceManager = New System.Resources.ResourceManager("Suggestions", Reflection.Assembly.GetAssembly((New ResourcesClass).GetType))
            Dim aConnectionStringKPI As String = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON")
            Dim aIdTypeSuiviEnvoi As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IDTypeSuiviEnvoiSuggestionEKPI"))
            Dim aObjetEmailSuggestion As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("ObjetEmailSuggestion")
            Dim aExpediteur As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation")

            Dim aIdUtilisateur = CInt(Decrypter(theIdUtilisateur))
            Dim aLangueDefault As String
            aLangueDefault = New BOGapCommerce.UtilisateurPreference(aIdUtilisateur).CodeLangue
            If String.IsNullOrEmpty(aLangueDefault) Then
                aLangueDefault = MyLANGUEDEFAULT
            End If

            'Dim aTitre As String = IIf(rbtM.Checked, rbtM.Text, IIf(rbtMlle.Checked, rbtMlle.Text, rbtMme.Text)).ToString
            Dim aMessageContenu As String
            aUtilisateur = New BOeKPI.Utilisateur(aIdUtilisateur, BOGapCommerce.Utilisateur.PeutEtreInactif.Non)
            aMessageContenu = GenererEmailGestionnaire(aLangueDefault, New BOGapCommerce.Titre(aUtilisateur.IdTitre).Libelle, aUtilisateur.Nom, aUtilisateur.Prenom, aUtilisateur.FonctionLibelle, aUtilisateur.Email, aUtilisateur.Telephone, New BOGapCommerce.UtilisateurPreference(aUtilisateur.IDUtilisateur).CodeLangue, theSujet, theMessage)
            Dim aUtilisateurCollectionGestionnaire = New BOeKPI.Autorisation("GestionnaireSuggestion").Utilisateurs()
            Dim aUtilisateurCollectionCCi As String = String.Empty
            For Each aUtilisateur In New BOeKPI.Autorisation("EmailSuggestionEnCCI").Utilisateurs()
                aUtilisateurCollectionCCi &= aUtilisateur.Email & ";"
            Next
            aUtilisateurCollectionCCi = aUtilisateurCollectionCCi.Remove(aUtilisateurCollectionCCi.Length - 1)
            For Each aGestionnaire In aUtilisateurCollectionGestionnaire
                Email.Email.Envoyer(aExpediteur, aGestionnaire.Email, aObjetEmailSuggestion, aMessageContenu, False, aIdTypeSuiviEnvoi, "fr", aConnectionStringKPI, , , aUtilisateurCollectionCCi)
            Next

            Return New With {Key .succes = aSucces, .keyMessage = "msgSucces"}.ToString
        Catch ex As Exception
            Return New With {Key .succes = False, .keyMessage = "msgErreurGeneral"}.ToString
        Finally
            aUtilisateur = Nothing
        End Try
    End Function

    <WebMethod()> _
<ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function EnvoyerSuggestionNonConecte(ByVal theTitre As String, ByVal theNom As String, ByVal thePrenom As String, ByVal theFonction As String, ByVal theEmail As String, ByVal theTelephone As String, ByVal theddlLangue As String, ByVal theSujet As String, ByVal theMessage As String) As String
        Dim aSucces As Boolean = True
        Dim aUtilisateurCollectionGestionnaire As BOeKPI.UtilisateurCollection
        Try

            Dim aConnectionStringKPI As String = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON")
            Dim aIdTypeSuiviEnvoi As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IDTypeSuiviEnvoiSuggestionEKPI"))
            Dim aObjetEmailSuggestion As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("ObjetEmailSuggestion")
            Dim aExpediteur As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation")
            'Dim aTitre As String = IIf(rbtM.Checked, rbtM.Text, IIf(rbtMlle.Checked, rbtMlle.Text, rbtMme.Text)).ToString

            Dim aMessageContenu As String
            aMessageContenu = GenererEmailGestionnaire(MyLANGUEDEFAULT, theTitre, theNom, thePrenom, theFonction, theEmail, theTelephone, theddlLangue, theSujet, theMessage)

            aUtilisateurCollectionGestionnaire = New BOeKPI.Autorisation("GestionnaireSuggestion").Utilisateurs()
            Dim aUtilisateurCollectionCCi As String = String.Empty
            For Each aUtilisateur In New BOeKPI.Autorisation("EmailSuggestionEnCCI").Utilisateurs()
                aUtilisateurCollectionCCi &= aUtilisateur.Email & ";"
            Next
            aUtilisateurCollectionCCi = aUtilisateurCollectionCCi.Remove(aUtilisateurCollectionCCi.Length - 1)
            For Each aGestionnaire In aUtilisateurCollectionGestionnaire
                Email.Email.Envoyer(aExpediteur, aGestionnaire.Email, aObjetEmailSuggestion, aMessageContenu, False, aIdTypeSuiviEnvoi, "fr", aConnectionStringKPI, , , aUtilisateurCollectionCCi)
            Next
            Return New With {Key .succes = aSucces, .keyMessage = "msgSucces"}.ToString
        Catch ex As Exception
            Return New With {Key .succes = False, .keyMessage = "msgErreurGeneral"}.ToString
        Finally
            aUtilisateurCollectionGestionnaire = Nothing
        End Try
    End Function

#End Region

#End Region

#Region "Privé"

    Private Function GetLocalResourceObject(ByVal theLangue As String, ByVal theCle As String, ByVal theResource As String) As String

        Threading.Thread.CurrentThread.CurrentUICulture = New Globalization.CultureInfo(theLangue)
        Threading.Thread.CurrentThread.CurrentCulture = Globalization.CultureInfo.CreateSpecificCulture(theLangue)
        myResourceManager = New System.Resources.ResourceManager(theResource, Assembly.GetExecutingAssembly())
        Return myResourceManager.GetString(theCle)

    End Function

    Private Function Cripter(ByVal TextAcripte As String) As String
        Dim aChinaineCripte As New BOeKPI.Cryptage
        Return aChinaineCripte.Crypter(TextAcripte)
    End Function

    Public Function Decrypter(ByVal TextAcripte As String) As String
        Dim aChinaineCripte As New BOeKPI.Cryptage()
        Return aChinaineCripte.Decrypter(TextAcripte)
    End Function

    Private Function GenererEmailGestionnaire(ByVal theLangue As String, ByVal theTitre As String, ByVal theNom As String, ByVal thePrenom As String, ByVal theFonction As String, ByVal theEmail As String, ByVal theTelephone As String, ByVal theddlLangue As String, ByVal theSujet As String, ByVal theMessage As String) As String
        Try
            Dim aEmailResource As String = GetLocalResourceObject(theLangue, "emailContenuMessage", "UIWebResources.Suggestions")
            'aEmailResource = UIWebResources.My.Resources.Suggestions.
            Return (String.Format(aEmailResource, theTitre, theNom, thePrenom, theFonction, theEmail, theTelephone, theddlLangue, theSujet, theMessage))
        Catch ex As Exception
            Dim aEmailResource As String = GetLocalResourceObject(theLangue, "emailContenuMessage", "App_LocalResources.Suggestions").ToString
        End Try


    End Function


#End Region





End Class