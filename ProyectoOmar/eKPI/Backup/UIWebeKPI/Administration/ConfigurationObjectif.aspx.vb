Public Class ConfigurationObjectif
    Inherits PageBase

#Region "Déclarations"

#End Region

#Region "Propriétés"
    Public ReadOnly Property ConfigurationObjectifLivraisons As List(Of BOeKPI.ConfigurationObjectifLivraison)
        Get
            Return New BOeKPI.ConfigurationObjectifLivraisonCollection().OrderByDescending(Function(c) c.DateCreation).ToList
        End Get
    End Property

    Public ReadOnly Property ConfigurationCourrante As BOeKPI.ConfigurationObjectifLivraison
        Get
            If ConfigurationObjectifLivraisons.Count > 0 Then
                Return ConfigurationObjectifLivraisons.First
            End If
            Return Nothing
        End Get
    End Property
#End Region

#Region "Interractions"
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not Page.IsPostBack Then
            AfficherConfigurationCourrante()
        End If
        gvwConfigurationObjectifLivraison.DataSource = ConfigurationObjectifLivraisons
        gvwConfigurationObjectifLivraison.DataBind()
    End Sub

    Protected Sub btnValider_Click(sender As Object, e As EventArgs) Handles btnValider.Click
        Dim aConfigurationObjectifLivraison As New BOeKPI.ConfigurationObjectifLivraison
        aConfigurationObjectifLivraison.IdUtilisateur = 145 'BOeKPI.Utilisateur.UtilisateurCourant.IDUtilisateur
        aConfigurationObjectifLivraison.Description = txtDescription.Text
        aConfigurationObjectifLivraison.DateCreation = DateTime.Now
        aConfigurationObjectifLivraison.CommandeStandardMoinsDeuxPlusZero = CInt(txtCommandeStandardMoinsDeuxPlusZero.Text)
        aConfigurationObjectifLivraison.CommandeStandardMoinsDeuxPlusDeux = CInt(txtCommandeStandardMoinsDeuxPlusDeux.Text)
        aConfigurationObjectifLivraison.CommandePackMoinsZeroPlusZero = CInt(txtCommandePackMoinsZeroPlusZero.Text)
        aConfigurationObjectifLivraison.CommandePackMoinsZeroPlusUn = CInt(txtCommandePackMoinsZeroPlusUn.Text)
        aConfigurationObjectifLivraison.Actif = True
        aConfigurationObjectifLivraison.Sauver()

        gvwConfigurationObjectifLivraison.DataSource = ConfigurationObjectifLivraisons
        gvwConfigurationObjectifLivraison.DataBind()
    End Sub

    Protected Sub gvwConfigurationObjectifLivraison_RowDataBound(sender As Object, e As System.Web.UI.WebControls.GridViewRowEventArgs) Handles gvwConfigurationObjectifLivraison.RowDataBound
        If e.Row.RowType = DataControlRowType.DataRow Then
            Dim aConfigurationObjectifLivraison As BOeKPI.ConfigurationObjectifLivraison = DirectCast(e.Row.DataItem, BOeKPI.ConfigurationObjectifLivraison)
            DirectCast(e.Row.FindControl("lblIdentifiant"), Label).Text = aConfigurationObjectifLivraison.Utilisateur.Login
            DirectCast(e.Row.FindControl("hdnIdConfigurationObjectifLivraison"), HiddenField).Value = aConfigurationObjectifLivraison.IdConfigurationObjectifLivraison.ToString
        End If
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub AfficherConfigurationCourrante()
        If ConfigurationCourrante IsNot Nothing Then
            txtDescription.Text = ConfigurationCourrante.Description
            txtCommandePackMoinsZeroPlusUn.Text = ConfigurationCourrante.CommandePackMoinsZeroPlusUn.ToString
            txtCommandePackMoinsZeroPlusZero.Text = ConfigurationCourrante.CommandePackMoinsZeroPlusZero.ToString
            txtCommandeStandardMoinsDeuxPlusDeux.Text = ConfigurationCourrante.CommandeStandardMoinsDeuxPlusDeux.ToString
            txtCommandeStandardMoinsDeuxPlusZero.Text = ConfigurationCourrante.CommandeStandardMoinsDeuxPlusZero.ToString
        End If
    End Sub
#End Region

End Class