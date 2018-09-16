Public Class Contact
    Inherits PageBase


#Region "Declarations"

#End Region

#Region "Intéractions"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        ChargerListeContact()
    End Sub

    Private Sub dlsOperateur_ItemDataBound(sender As Object, e As System.Web.UI.WebControls.RepeaterItemEventArgs) Handles dlsOperateur.ItemDataBound
        If (e.Item.ItemType = ListItemType.Item) Or _
    (e.Item.ItemType = ListItemType.AlternatingItem) Then
            CType(e.Item.FindControl("lblNomOperateur"), Label).Text = CType(e.Item.DataItem, BOeKPI.Utilisateur).NomPrenom
            CType(e.Item.FindControl("lblOperateurEmail"), Label).Text = CType(e.Item.DataItem, BOeKPI.Utilisateur).Email
            CType(e.Item.FindControl("lblOperateurGsm"), Label).Text = CType(e.Item.DataItem, BOeKPI.Utilisateur).Gsm
            CType(e.Item.FindControl("lblOperateurFax"), Label).Text = CType(e.Item.DataItem, BOeKPI.Utilisateur).Fax
            CType(e.Item.FindControl("lblOperateurTelephone"), Label).Text = CType(e.Item.DataItem, BOeKPI.Utilisateur).Telephone
            CType(e.Item.FindControl("imgContact"), HtmlImage).Src = BOGapCommerce.ConfigurationApplication.ObtenirValeur("UrlPhotoeKPI") & CType(e.Item.DataItem, BOeKPI.Utilisateur).Photo
        End If
    End Sub

#End Region

#Region "Fonctionnalités"

    Private Sub ChargerListeContact()

        Dim aRole As New BOeKPI.Role("GestionnairePortail")
        Dim aListContact As New BOeKPI.UtilisateurCollection(aRole.IdRole, BOeKPI.UtilisateurCollection.TypeChaineEnum.Role)
        dlsOperateur.DataSource = aListContact
        dlsOperateur.DataBind()

    End Sub

#End Region

#Region "Héritage et polymorphisme"

#End Region




End Class