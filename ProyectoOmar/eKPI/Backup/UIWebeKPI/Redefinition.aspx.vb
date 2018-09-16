Public Class Redefinition
    Inherits PageBase

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not Page.IsPostBack Then
            If Not UtilisateurCourant Is Nothing Then
                lblLogin.Text = UtilisateurCourant.Login
            ElseIf Not Request.QueryString("guid") Is Nothing Then
                Try
                    Dim aUtilisateur As New BOeKPI.Utilisateur(Request.QueryString("guid"), BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
                    lblAncienMotPasse.Visible = False
                    txtAncienMotPasse.Visible = False
                    lblLogin.Text = aUtilisateur.Login
                    rfvAncienMotPasse.Enabled = False
                    cpvNouveauMotPasse.Enabled = False
                Catch ex As BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
                    wcuNotification.NotifierMessage(GetLocalResourceObject("LienPerime").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
                    tblNouveauMotPasse.Visible = False
                End Try
            Else
                Response.Redirect("./index.aspx")
            End If
        End If
    End Sub

    Protected Sub btnValider_Click(sender As Object, e As EventArgs) Handles btnValider.Click
        If Not UtilisateurCourant Is Nothing Then
            If txtAncienMotPasse.Text = UtilisateurCourant.MotPasse Then
                UtilisateurCourant.MotPasse = txtNouveauMotPasse.Text
                UtilisateurCourant.DateModificationMotPasse = DateTime.Now
                UtilisateurCourant.MettreAJourMotDePasse()
                wcuNotification.NotifierMessage(GetLocalResourceObject("MotDePasseChange").ToString)
                tblNouveauMotPasse.Visible = False
            Else
                wcuNotification.NotifierMessage(GetLocalResourceObject("ErreurAncienMotdePasseIncorrecte").ToString, ValidatorSummaryControl.EnumImageStatus.NoOK)
            End If
        ElseIf Not Request.QueryString("guid") Is Nothing Then
                Dim aUtilisateur As New BOeKPI.Utilisateur(Request.QueryString("guid"), BOGapCommerce.Utilisateur.TypeGuid.GuidChangementMotPasse)
                aUtilisateur.MotPasse = txtNouveauMotPasse.Text
                aUtilisateur.DateModificationMotPasse = DateTime.Now
                aUtilisateur.MettreAJourMotDePasse()
                wcuNotification.NotifierMessage(GetLocalResourceObject("MotDePasseChange").ToString)
            tblNouveauMotPasse.Visible = False
        End If
    End Sub
End Class