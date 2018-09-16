Public Class Preferences
    Inherits PageBase

#Region "Declarations"

#End Region

#Region "Intéractions"
    Protected Sub Page_Load(sender As Object, e As EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ChargerDdlLangue()
            ChargerDdlPageAccueil()
        End If

    End Sub

    Private Sub btnValider_Click(sender As Object, e As System.EventArgs) Handles btnValider.Click
        Try
            Dim aUtilisateurPreference As New BOGapCommerce.UtilisateurPreference(UtilisateurCourant.IDUtilisateur)
            aUtilisateurPreference.codeLangue = ddlLangue.SelectedValue
            aUtilisateurPreference.Sauver()
            Dim aUtilisateurMenu As New BOeKPI.UtilisateurMenu(UtilisateurCourant.IDUtilisateur)
            If aUtilisateurMenu.IdMenu = 0 Then
                aUtilisateurMenu = New BOeKPI.UtilisateurMenu(UtilisateurCourant.IDUtilisateur, CInt(ddlPageAccueil.SelectedValue))
            Else
                aUtilisateurMenu.IdMenu = CInt(ddlPageAccueil.SelectedValue)
                aUtilisateurMenu.IdUtilisateur = UtilisateurCourant.IDUtilisateur
            End If
                aUtilisateurMenu.Sauver()
                tblPreference.Visible = False
                wcuNotification.NotifierMessage(GetLocalResourceObject("msgSucces").ToString)
        Catch ex As Exception
            wcuNotification.NotifierMessage(ex.Message, ValidatorSummaryControl.EnumImageStatus.NoOK)
        End Try
    End Sub
#End Region

#Region "Fonctionnalités"

    Private Sub ChargerDdlLangue()
        ddlLangue.DataSource = New BOGapCommerce.LangueCollection(True)
        ddlLangue.DataTextField = "Libelle"
        ddlLangue.DataValueField = "CodeLangue"
        ddlLangue.DataBind()
        If Not UtilisateurCourant Is Nothing Then
            Dim aUtilisateurPreference As New BOGapCommerce.UtilisateurPreference(UtilisateurCourant.IDUtilisateur)
            If Not String.IsNullOrEmpty(aUtilisateurPreference.CodeLangue) Then
                ddlLangue.SelectedValue = aUtilisateurPreference.CodeLangue
            End If
        End If
    End Sub

#End Region

    Private Sub ChargerDdlPageAccueil()
        ddlPageAccueil.DataSource = New BOeKPI.MenuCollection(CInt(System.Configuration.ConfigurationManager.AppSettings("IdApplication")), BOeKPI.MenuCollection.TypeChrgementEnum.All)
        ddlPageAccueil.DataTextField = "Url"
        ddlPageAccueil.DataValueField = "IdMenu"
        ddlPageAccueil.DataBind()
        If Not UtilisateurCourant Is Nothing Then
            Dim aUtilisateurMenu As New BOeKPI.UtilisateurMenu(UtilisateurCourant.IDUtilisateur)
            If aUtilisateurMenu.IdMenu <> 0 Then
                ddlPageAccueil.SelectedValue = CStr(aUtilisateurMenu.IdMenu)
            Else
                ddlPageAccueil.SelectedValue = Nothing
            End If
        End If
    End Sub

End Class