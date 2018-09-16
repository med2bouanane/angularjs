Public Class MiseJourProfil
    Inherits PageBase

#Region "Declarations"

#End Region

#Region "Intéractions"
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            ChargerProfil()
        End If


    End Sub
#End Region

#Region "Fonctionalité"
    Private Sub ChargerProfil()

        If UtilisateurCourant.IdTitre = 1 Then
            rbtM.Checked = True
        ElseIf UtilisateurCourant.IdTitre = 2 Then
            rbtMme.Checked = True
        ElseIf UtilisateurCourant.IdTitre = 3 Then
            rbtMme.Checked = True
        End If
        lblLogin.Text = UtilisateurCourant.Login
        txtEmail.Text = UtilisateurCourant.Email
        txtFonction.Text = UtilisateurCourant.FonctionLibelle
        txtNom.Text = UtilisateurCourant.Nom
        txtPrenom.Text = UtilisateurCourant.Prenom
        txtTelephone.Text = UtilisateurCourant.Telephone
    End Sub


    Protected Sub btnValider_Click(sender As Object, e As EventArgs) Handles btnValider.Click
        If rbtM.Checked Then
            UtilisateurCourant.IdTitre = 1
        ElseIf rbtMme.Checked Then
            UtilisateurCourant.IdTitre = 2
        ElseIf rbtMme.Checked Then
            UtilisateurCourant.IdTitre = 3
        End If
        UtilisateurCourant.Email = txtEmail.Text
        UtilisateurCourant.FonctionLibelle = txtFonction.Text
        UtilisateurCourant.Nom = txtNom.Text
        UtilisateurCourant.Prenom = txtPrenom.Text
        UtilisateurCourant.Telephone = txtTelephone.Text
        UtilisateurCourant.Sauver()
        tblMiseAjourProfil.Visible = False
        wcuNotification.NotifierMessage(GetLocalResourceObject("msgProfilActualise").ToString)
    End Sub
#End Region

End Class