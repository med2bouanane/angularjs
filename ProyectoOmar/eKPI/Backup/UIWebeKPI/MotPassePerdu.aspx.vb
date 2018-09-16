Public Class MotPassePerdu
    Inherits PageBase

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub

    Protected Sub btnValider_Click(sender As Object, e As EventArgs) Handles btnValider.Click
        If Page.IsValid Then

            Dim aUtilisateur As BOeKPI.Utilisateur = Nothing
            Try
                If rbtIdentifiant.Checked Then
                    aUtilisateur = New BOeKPI.Utilisateur(txtIdentificacion.Text, BOeKPI.Utilisateur.TypeChaine.Identifiant)
                Else
                    aUtilisateur = New BOeKPI.Utilisateur(txtIdentificacion.Text, BOeKPI.Utilisateur.TypeChaine.Email)
                End If
                Dim aGuid As Guid = Guid.NewGuid()
                aUtilisateur.MettreAJourGuid(aGuid, BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
                Dim aContenuEmail As String = GetLocalResourceObject("EmailRedifinitionMotDePasse").ToString
                Dim aLienRedefinition As String = System.Configuration.ConfigurationManager.AppSettings("URLBase") & "Redefinition.aspx?guid=" & aGuid.ToString 'T14564
                If aUtilisateur.IdTitre > 0 Then
                    aContenuEmail = String.Format(aContenuEmail, New BOGapCommerce.Titre(aUtilisateur.IdTitre).Libelle(CodeLangueUI).ToString, aUtilisateur.Nom, "<a href='" + aLienRedefinition + "'>" + aLienRedefinition + "</a>")
                Else
                    aContenuEmail = String.Format(aContenuEmail, "", aUtilisateur.Nom, "<a href='" + aLienRedefinition + "'>" + aLienRedefinition + "</a>")
                End If
                Email.Email.Envoyer(BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation"), aUtilisateur.Email, GetLocalResourceObject("EmailRedifinitionMotDePasseSujet").ToString, aContenuEmail, True, 5, CodeLangueUI, System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON"))
                wucInscription.NotifierMessage(GetLocalResourceObject("MsgEnvoyeSucces").ToString)
                lblTexteExplicatif.Visible = False
                trLoginEmail.Visible = False
            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurMultiples
                wucInscription.NotifierMessage(GetLocalResourceObject("EmailMultiple").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
        BOCommunication.Erreur.LoggerErreur(ex, Nothing, "Erreur lors d'un changement de mot de passe - Plusieurs emails trouvés pour le même utilisateur  : " + ex.Message)
            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
                If rbtIdentifiant.Checked Then
                    wucInscription.NotifierMessage(GetLocalResourceObject("IdentifiantNonTrouve").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                Else
                    wucInscription.NotifierMessage(GetLocalResourceObject("EmailNonTrouve").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                End If
            End Try
        End If
    End Sub

End Class