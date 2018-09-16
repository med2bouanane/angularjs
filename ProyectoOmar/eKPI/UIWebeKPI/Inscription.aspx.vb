Public Class Inscription
    Inherits PageBase

#Region "Declarations"

    Private myDemandeInscription As BOGapCommerce.DemandeInscription

#End Region

#Region "Intéractions"
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Initialiser()
        Page.ClientScript.RegisterStartupScript(Me.GetType(), "Inicialiser", "Initialiser();", True)
        rbtCompteExistant.Attributes.Add("onChange", "Javascript:ActiverVueConecte(true);")
        rbtCompteNoExistant.Attributes.Add("onChange", "Javascript:ActiverVueConecte(false);")
        myDemandeInscription = New BOGapCommerce.DemandeInscription
    End Sub

    Private Sub wzdInscription_FinishButtonClick(sender As Object, e As System.Web.UI.WebControls.WizardNavigationEventArgs) Handles wzdInscription.FinishButtonClick
        If Page.IsValid Then
            Dim aExpediteur As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation")
            Dim aIdTypeSuiviEnvoi As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IDTypeSuiviEnvoiSuggestionEKPI"))
            Dim aConnectionStringKPI As String = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON")
            Dim aEmailTexteClient As String = GetLocalResourceObject("NotificationMessageClient").ToString
            Dim aEmailTexteGestionnaire As String = GetLocalResourceObject("NotificationMessageGestionnaire").ToString
            Dim aTitreMessageClient As String = GetLocalResourceObject("TitreMessageClient").ToString
            Dim aTitreMessageGestionnaire As String = GetLocalResourceObject("TitreMessageGestionnaire").ToString
            Dim aIdApplication As Integer = CInt(System.Configuration.ConfigurationManager.AppSettings("IdApplication"))
            Dim aEmailItSupport As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("EmailItSupport")
            Try
                wucInscription.Initialiser()
                If Not rbtCompteExistant.Checked Then
                    If Not EmailRefuse(txtEmail.Text) Then
                        'Notification client
                        aEmailTexteClient = String.Format(aEmailTexteClient, IIf(rbtM.Checked, rbtM.Text, IIf(rbtMme.Checked, rbtMme.Text, rbtMlle.Text)), UtilisateurCourant.Nom)
                        Email.Email.Envoyer(aExpediteur, txtEmail.Text, aTitreMessageClient, aEmailTexteClient, False, aIdTypeSuiviEnvoi, ddlLangueUtilisateur.Text, aConnectionStringKPI)
                        'Notification Gestionnaire
                        aTitreMessageGestionnaire = String.Format(aTitreMessageGestionnaire, IIf(rbtCompteExistant.Checked, rbtCompteExistant.Text, rbtCompteNoExistant.Text), _
                                                                UtilisateurCourant.Login, UtilisateurCourant.IdTitre, UtilisateurCourant.Nom, UtilisateurCourant.Prenom, _
                                                                 UtilisateurCourant.Fonction, UtilisateurCourant.Email, UtilisateurCourant.Telephone, ddlLangueUtilisateur.SelectedItem.Text)
                        Dim aUtilisateurCollectionGestionnaire = New BOeKPI.Autorisation("GestionValidacionInscription").Utilisateurs()
                        Dim aUtilisateurCollectionCCi As String = String.Empty
                        Dim aAutorisation As New BOeKPI.Autorisation("EmailInscriptiontionEnCCI")
                        aAutorisation.Utilisateurs().ForEach(Sub(x) aUtilisateurCollectionCCi = x.Email & ";")
                        aUtilisateurCollectionCCi = aUtilisateurCollectionCCi.Remove(aUtilisateurCollectionCCi.Length - 1)
                        For Each aGestionnaire In aUtilisateurCollectionGestionnaire
                            Email.Email.Envoyer(aExpediteur, aGestionnaire.Email, aTitreMessageGestionnaire, aEmailTexteGestionnaire, False, aIdTypeSuiviEnvoi, "fr", aConnectionStringKPI, , , aUtilisateurCollectionCCi)
                        Next
                        wucInscription.NotifierMessage(GetLocalResourceObject("EnvoiInscriptionSucces").ToString)
                        GestionEtape(Convert.ToInt16(wzdInscription.ActiveStepIndex))
                        trSteps.Visible = False
                    Else
                        wucInscription.NotifierMessage(GetLocalResourceObject("ErreurEmailExistant").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                        e.Cancel = True
                    End If
                End If
            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
                wucInscription.NotifierMessage(GetLocalResourceObject("IdentifiantMotPasseIncorrect").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurMultiples
                wucInscription.NotifierMessage(GetLocalResourceObject("UtilisateurMultiples").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
            Catch ex As Exception
                wucInscription.NotifierMessage(ex.Message, ValidatorSummaryControl.EnumImageStatus.NoOK)
            End Try
        End If
    End Sub

    Private Sub wzdInscription_NextButtonClick(sender As Object, e As System.Web.UI.WebControls.WizardNavigationEventArgs) Handles wzdInscription.NextButtonClick
        If Page.IsValid Then
            Try
                wucInscription.Initialiser()
                Dim aBOUtilisateur As BOeKPI.Utilisateur
                If rbtCompteExistant.Checked Then
                    Dim aExpediteur As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("MailFromInformation")
                    Dim aIdTypeSuiviEnvoi As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IDTypeSuiviEnvoiSuggestionEKPI"))
                    Dim aConnectionStringKPI As String = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringICON")
                    Dim aEmailTexteClient As String = GetLocalResourceObject("NotificationMessageClient").ToString
                    Dim aEmailTexteGestionnaire As String = GetLocalResourceObject("NotificationMessageGestionnaire").ToString
                    Dim aTitreMessageClient As String = GetLocalResourceObject("TitreMessageClient").ToString
                    Dim aTitreMessageGestionnaire As String = GetLocalResourceObject("TitreMessageGestionnaire").ToString
                    Dim aIdApplication As Integer = CInt(BOGapCommerce.ConfigurationApplication.ObtenirValeur("IdApplication"))
                    Dim aEmailItSupport As String = BOGapCommerce.ConfigurationApplication.ObtenirValeur("EmailItSupport")
                    aBOUtilisateur = New BOeKPI.Utilisateur(txtIdentifiant.Text, BOeKPI.Utilisateur.TypeChaine.Identifiant)
                    Dim aTitre As String = ""
                    If aBOUtilisateur.MotPasse = txtMotPasse.Text Then
                        If aBOUtilisateur.Autorisations().ContenirAutorizaction(New BOeKPI.Autorisation("AccesPortail")) Then
                            wucInscription.NotifierMessage(GetLocalResourceObject("ComptePossedeDroitAcces").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                            e.Cancel = True
                        Else
                            If Not EmailRefuse(aBOUtilisateur.Email) Then
                                If aBOUtilisateur.IdTitre <> 0 Then
                                    aTitre = IIf(aBOUtilisateur.IdTitre > 0, New BOGapCommerce.Titre(aBOUtilisateur.IdTitre).Libelle(CodeLangueUI).ToString, "").ToString
                                End If
                                aEmailTexteClient = String.Format(aEmailTexteClient, aTitre, aBOUtilisateur.Nom)
                                Email.Email.Envoyer(aExpediteur, aBOUtilisateur.Email, aTitreMessageClient, aEmailTexteClient, False, aIdTypeSuiviEnvoi, ddlLangueUtilisateur.Text, aConnectionStringKPI, , , aEmailItSupport)
                                'Notification Gestionnaire
                                aEmailTexteGestionnaire = String.Format(aEmailTexteGestionnaire, IIf(rbtCompteExistant.Checked, rbtCompteExistant.Text, rbtCompteNoExistant.Text), _
                                                                          aBOUtilisateur.Login, aTitre, aBOUtilisateur.Nom, aBOUtilisateur.Prenom, aBOUtilisateur.Fonction, aBOUtilisateur.Email, aBOUtilisateur.Telephone, ddlLangueUtilisateur.SelectedItem.Text)
                                Email.Email.Envoyer(aExpediteur, aBOUtilisateur.Email, aTitreMessageGestionnaire, aEmailTexteGestionnaire, False, aIdTypeSuiviEnvoi, "fr", aConnectionStringKPI, , , aEmailItSupport)
                                wzdInscription.ActiveStepIndex = e.NextStepIndex + 1
                                wucInscription.NotifierMessage(GetLocalResourceObject("EnvoiInscriptionSucces").ToString)
                                GestionEtape(Convert.ToInt16(wzdInscription.ActiveStepIndex))
                            Else
                                wucInscription.NotifierMessage(GetLocalResourceObject("ErreurEmailExistant").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                                e.Cancel = True
                            End If
                        End If
                    Else
                        wucInscription.NotifierMessage(GetLocalResourceObject("IdentifiantMotPasseIncorrect").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                        e.Cancel = True
                    End If
                Else
                    aBOUtilisateur = New BOeKPI.Utilisateur(txtEmail.Text, BOeKPI.Utilisateur.TypeChaine.Email)
                    If aBOUtilisateur Is Nothing Then
                        wzdInscription.ActiveStepIndex = e.NextStepIndex
                        myDemandeInscription = New BOGapCommerce.DemandeInscription
                        hdnCurrentStep.Value = CStr(wzdInscription.ActiveStepIndex)
                        GestionEtape(Convert.ToInt16(wzdInscription.ActiveStepIndex))
                    Else
                        wucInscription.NotifierMessage(GetLocalResourceObject("ComptExistantDemandeAcces").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                        e.Cancel = True
                    End If
                End If

            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
                wucInscription.NotifierMessage(GetLocalResourceObject("IdentifiantMotPasseIncorrect").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                e.Cancel = True
            Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurMultiples
                wucInscription.NotifierMessage(GetLocalResourceObject("UtilisateurMultiples").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                e.Cancel = True
            Catch ex As Exception
                wucInscription.NotifierMessage(ex.Message, ValidatorSummaryControl.EnumImageStatus.NoOK)
                e.Cancel = True
            End Try
        End If

    End Sub

    Private Sub wzdInscription_PreviousButtonClick(sender As Object, e As System.Web.UI.WebControls.WizardNavigationEventArgs) Handles wzdInscription.PreviousButtonClick
        wucInscription.Initialiser()
        wzdInscription.ActiveStepIndex = e.CurrentStepIndex - 1
        hdnCurrentStep.Value = CStr(wzdInscription.ActiveStepIndex)
        GestionEtape(Convert.ToInt16(wzdInscription.ActiveStepIndex))
        Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "RafrechirPage", "ActiverVueConecte('" & rbtCompteExistant.Checked & "');", True)
    End Sub

#End Region

#Region "Fonctionnalités"

    Private Sub Initialiser()
        ddlLangueUtilisateur.DataSource = New BOGapCommerce.LangueCollection
        ddlLangueUtilisateur.DataTextField = "Libelle"
        ddlLangueUtilisateur.DataValueField = "CodeLangue"
        ddlLangueUtilisateur.DataBind()
        ddlLangueUtilisateur.SelectedValue = Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName
    End Sub

    Private Sub GestionEtape(ByVal theEtape As Short)
        Select Case theEtape
            Case 0
                tdDebutEtape1.Attributes("class") = "DebutEtapeGrise"
                tdEtape1.Attributes("class") = "EtapeGrise"
                tdDebutEtape2.Attributes("class") = "DebutEtapeGrisClair EtapeGrise"
                tdEtape2.Attributes("class") = "EtapeFondGrisClair"
                tdFinEtape2.Attributes("class") = "FinEtapeGrisClair EtapeFondGrisClair"
            Case 1
                tdDebutEtape1.Attributes("class") = "DebutEtapeGrisClair"
                tdEtape1.Attributes("class") = "EtapeFondGrisClair"
                tdDebutEtape2.Attributes("class") = "DebutEtapeGrise EtapeFondGrisClair" ' EtapeFondGris
                tdEtape2.Attributes("class") = "EtapeGrise"
                tdFinEtape2.Attributes("class") = "FinEtapeGrisFonce"
            Case 2
                trSteps.Visible = False

        End Select
        SauverValeurs(theEtape)
    End Sub

    Private Sub SauverValeurs(ByVal theEtape As Integer)

        If theEtape <> 0 Then
            txtIdentifiantAcces.Text = BOGapCommerce.Utilisateur.GenererIdentifiant(txtNom.Text, txtPrenom.Text)
        End If

        If Not myDemandeInscription Is Nothing Then
           'myDemandeInscription.IDDemandeInscriptionTypeUtilisateur = BOGapCommerce.Utilisateur.TypeUtilisateur.Client
            myDemandeInscription.NomDemandeur = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(txtNom.Text)
            myDemandeInscription.PrenomDemandeur = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(txtPrenom.Text)
            myDemandeInscription.FonctionDemandeur = txtFonction.Text
            myDemandeInscription.EmailDemandeur = txtEmail.Text
            myDemandeInscription.IDTitreDemandeur = CInt(IIf(rbtM.Checked, 0, IIf(rbtMlle.Checked, 1, 2)))
            myDemandeInscription.TelephoneDemandeur = txtTelephone.Text
            myDemandeInscription.CodeLangueDemandeur = ddlLangueUtilisateur.SelectedItem.Value
            myDemandeInscription.IdentifiantDemandeur = txtIdentifiantAcces.Text
            myDemandeInscription.MotDePasseDemandeur = txtMotPasseAcces.Text
            myDemandeInscription.IDDemandeInscriptionStatut = Convert.ToInt32(BOGapCommerce.DemandeInscriptionStatut.Statut.AValider)
        End If
    End Sub


    Private Function EmailRefuse(ByVal theEmail As String) As Boolean


        Dim aBoDemandeAcces As BOGapCommerce.DemandeAcces
        If BOGapCommerce.ConfigurationApplication.ObtenirValeur("PermettreEmailIdentiqueDemandeInscription").ToString = "0" Then
            If myDemandeInscription.CompterNombreEmailExistantNonRefuse(theEmail) > 0 Then
                Return True
            End If
        End If

        'Sauvegarder Acces
        aBoDemandeAcces = New BOGapCommerce.DemandeAcces(myDemandeInscription.IdentifiantDemandeur, IdApplication)
        aBoDemandeAcces.Sauver()
        myDemandeInscription.IdApplication = 0
        myDemandeInscription.DateDemandeInscription = Now.Date
        myDemandeInscription.IdDemandeAcces = aBoDemandeAcces.IdDemandeAcces
        myDemandeInscription.Sauver(False)
        Return False
    End Function
#End Region

#Region "Héritage et polymorphisme"

#End Region

    
End Class