Public Class AfficherHistoriqueObjectifLivraison
    Inherits PageBase

#Region "Déclarations"

#End Region

#Region "Propriétés"
    Public ReadOnly Property ConfigurationCourrante As BOeKPI.ConfigurationObjectifLivraison
        Get
            If Not String.IsNullOrEmpty(Request.QueryString("IdConfigurationObjectifLivraison")) Then
                Return New BOeKPI.ConfigurationObjectifLivraison(CInt(Request.QueryString("IdConfigurationObjectifLivraison")))
            End If
            Return Nothing
        End Get
    End Property
#End Region

#Region "Interractions"
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not Page.IsPostBack Then
            AfficherConfiguration()
        End If
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub AfficherConfiguration()
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