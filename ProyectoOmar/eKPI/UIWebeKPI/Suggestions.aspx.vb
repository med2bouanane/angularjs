Public Class Suggestions
    Inherits PageBase

#Region "Declarations"

#End Region

#Region "Intéractions"

    Private Sub Page_Load(sender As Object, e As System.EventArgs) Handles Me.Load

        Dim aUrlImg As String = System.Configuration.ConfigurationManager.AppSettings("URLBase") & "Images/nook.gif"
        Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "AsignerImageUrl", "var myUrlImg ='" & aUrlImg & "';", True)

        ddlLangue.SelectedValue = Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName
        If Not UtilisateurCourant Is Nothing Then
            tblVueNoConecte.Visible = False
        Else
            tblVueNoConecte.Visible = True
        End If

    End Sub

    Protected Sub btnEnvoyer_Click(sender As Object, e As EventArgs) Handles btnEnvoyer.Click
        Dim aConnectionStringKPI As String = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON")
        Dim aIdTypeSuiviEnvoi As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IDTypeSuiviEnvoiSuggestionEKPI"))
        Dim aObjetEmailSuggestion As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("ObjetEmailSuggestion")
        Dim aExpediteur As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation")
        Dim aTitre As String = IIf(rbtM.Checked, rbtM.Text, IIf(rbtMlle.Checked, rbtMlle.Text, rbtMme.Text)).ToString
        Dim aMessageContenu As String
        If Not UtilisateurCourant Is Nothing Then
            aMessageContenu = GenererEmailGestionnaire(New BOGapCommerce.Titre(UtilisateurCourant.IdTitre).Libelle, UtilisateurCourant.Nom, UtilisateurCourant.Prenom, UtilisateurCourant.FonctionLibelle, UtilisateurCourant.Email, UtilisateurCourant.Telephone, New BOGapCommerce.UtilisateurPreference(UtilisateurCourant.IDUtilisateur).CodeLangue, txtSujet.Text, txtMessage.Text)
        Else
            aMessageContenu = GenererEmailGestionnaire(aTitre, txtNom.Text, txtPrenom.Text, txtFonction.Text, txtEmail.Text, txtTelephone.Text, ddlLangue.SelectedItem.Text, txtSujet.Text, txtMessage.Text)
        End If


        Dim aUtilisateurCollectionGestionnaire = New BOeKPI.Autorisation("GestionnaireSuggestion").Utilisateurs()
        Dim aUtilisateurCollectionCCi As String = String.Empty
        For Each aUtilisateur In New BOeKPI.Autorisation("EmailSuggestionEnCCI").Utilisateurs()
            aUtilisateurCollectionCCi &= aUtilisateur.Email & ";"
        Next
        aUtilisateurCollectionCCi = aUtilisateurCollectionCCi.Remove(aUtilisateurCollectionCCi.Length - 1)
        For Each aGestionnaire In aUtilisateurCollectionGestionnaire
            Email.Email.Envoyer(aExpediteur, aGestionnaire.Email, aObjetEmailSuggestion, aMessageContenu, False, aIdTypeSuiviEnvoi, "fr", aConnectionStringKPI, , , aUtilisateurCollectionCCi)
        Next

        wcuNotification.NotifierMessage(GetLocalResourceObject("SuggestionEnvoyee").ToString, ValidatorSummaryControl.EnumImageStatus.OK)
        tblVueNoConecte.Visible = False
        tblVueConecte.Visible = False

    End Sub

#End Region

#Region "Fonctionnalités"

    Private Function GenererEmailGestionnaire(ByVal theTitre As String, ByVal thetxtNom As String, ByVal thetxtPrenom As String, ByVal thetxtFonction As String, ByVal thetxtEmail As String, ByVal thetxtTelephone As String, ByVal theddlLangue As String, ByVal thetxtSujet As String, ByVal thetxtMessage As String) As String

        Dim aEmailResource As String = GetLocalResourceObject("emailContenuMessage").ToString
        Return String.Format(aEmailResource, theTitre, thetxtNom, thetxtPrenom, thetxtFonction, thetxtEmail, thetxtTelephone, theddlLangue, thetxtSujet, thetxtMessage)

    End Function

#End Region

#Region "Héritage et polymorphisme"

#End Region





End Class
