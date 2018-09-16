Public Class ConfigurationBlocageClient
    Inherits PageBase

#Region "Déclarations"
    Private myHistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient
#End Region

#Region "Propriétés"
    Public ReadOnly Property HistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient
        Get
            If myHistoriqueBlocageClient Is Nothing Then
                myHistoriqueBlocageClient = New BOeKPI.HistoriqueBlocageClient()
            End If
            Return myHistoriqueBlocageClient
        End Get
    End Property

#End Region

#Region "Interractions"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not Page.IsPostBack Then
            rptBlocageLivraison.DataSource = New BOeKPI.BlocageLivraisonCollection
            rptBlocageLivraison.DataBind()

            rptIncoterm.DataSource = New BOeKPI.IncotermSAPCollection
            rptIncoterm.DataBind()

            gvwHistoriqueBlocageClient.DataSource = New BOeKPI.HistoriqueBlocageClientCollection().OrderByDescending(Function(h) h.DateCreation)
            gvwHistoriqueBlocageClient.DataBind()
        End If
        
    End Sub

    Protected Sub rptBlocageLivraison_ItemDataBound(sender As Object, e As System.Web.UI.WebControls.RepeaterItemEventArgs) Handles rptBlocageLivraison.ItemDataBound
        If e.Item.ItemType = ListItemType.AlternatingItem Or e.Item.ItemType = ListItemType.Item Then
            Dim aBlocageLivraison As BOeKPI.BlocageLivraison = DirectCast(e.Item.DataItem, BOeKPI.BlocageLivraison)
            DirectCast(e.Item.FindControl("lblLibelleBlocageLivraison"), Label).Text = aBlocageLivraison.Libelle
            DirectCast(e.Item.FindControl("chkBlocageClient"), CheckBox).Checked = aBlocageLivraison.BlocageClient
            DirectCast(e.Item.FindControl("hdnIdBlocageLivraison"), HiddenField).Value = aBlocageLivraison.IdBlocageLivraison.ToString
        End If
    End Sub

    Protected Sub rptIncoterm_ItemDataBound(sender As Object, e As System.Web.UI.WebControls.RepeaterItemEventArgs) Handles rptIncoterm.ItemDataBound
        If e.Item.ItemType = ListItemType.Item Or e.Item.ItemType = ListItemType.AlternatingItem Then
            Dim aIncotermSAP As BOeKPI.IncotermSAP = DirectCast(e.Item.DataItem, BOeKPI.IncotermSAP)
            DirectCast(e.Item.FindControl("lblLibelleIncoterm"), Label).Text = aIncotermSAP.Libelle
            DirectCast(e.Item.FindControl("chkBlocageIncoterm"), CheckBox).Checked = aIncotermSAP.BlocageClient
            DirectCast(e.Item.FindControl("hdnIdIncoterm"), HiddenField).Value = aIncotermSAP.IdIncotermSAP.ToString
        End If
    End Sub

    Protected Sub btnValider_Click(sender As Object, e As EventArgs) Handles btnValider.Click
        MettreAJourHistoriqueBlocageClient()
        MettreAJourIncoterm()
        MettreAJourSuspensExpedition()

        gvwHistoriqueBlocageClient.DataSource = New BOeKPI.HistoriqueBlocageClientCollection().OrderByDescending(Function(h) h.DateCreation)
        gvwHistoriqueBlocageClient.DataBind()
    End Sub

    Protected Sub gvwHistoriqueBlocageClient_RowDataBound(sender As Object, e As System.Web.UI.WebControls.GridViewRowEventArgs) Handles gvwHistoriqueBlocageClient.RowDataBound
        If e.Row.RowType = DataControlRowType.DataRow Then
            Dim aHistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient = DirectCast(e.Row.DataItem, BOeKPI.HistoriqueBlocageClient)
            DirectCast(e.Row.FindControl("lblDate"), Label).Text = aHistoriqueBlocageClient.DateCreation.ToString
            DirectCast(e.Row.FindControl("lblDescription"), Label).Text = aHistoriqueBlocageClient.Description
            DirectCast(e.Row.FindControl("lblIdentifiant"), Label).Text = aHistoriqueBlocageClient.Utilisateur.Login
            DirectCast(e.Row.FindControl("hdnIdHistoriqueBlocageClient"), HiddenField).Value = aHistoriqueBlocageClient.IdHistoriqueBlocageClient.ToString
        End If
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub MettreAJourHistoriqueBlocageClient()
        If HistoriqueBlocageClient.IdHistoriqueBlocageClient = 0 Then
            HistoriqueBlocageClient.IdUtilisateur = 145 'BOGapCommerce.Utilisateur.UtilisateurCourant.IDUtilisateur 'Remplacer par cette ligne lorsque l'on pourra se connecter
            HistoriqueBlocageClient.Description = txtDescription.Text
            HistoriqueBlocageClient.DateCreation = DateTime.Now
            HistoriqueBlocageClient.Sauver()
        End If
    End Sub

    Private Sub MettreAJourIncoterm()
        For Each aItem As RepeaterItem In rptIncoterm.Items
            If aItem.ItemType = ListItemType.Item Or aItem.ItemType = ListItemType.AlternatingItem Then
                Dim aIncoterm As New BOeKPI.IncotermSAP(CInt(DirectCast(aItem.FindControl("hdnIdIncoterm"), HiddenField).Value))
                If aIncoterm IsNot Nothing AndAlso DirectCast(aItem.FindControl("chkBlocageIncoterm"), CheckBox).Checked <> aIncoterm.BlocageClient Then
                    aIncoterm.BlocageClient = Not aIncoterm.BlocageClient
                    aIncoterm.Sauver()
                End If

                If DirectCast(aItem.FindControl("chkBlocageIncoterm"), CheckBox).Checked Then
                    HistoriqueBlocageClient.AjouterIncoterm(aIncoterm.IdIncotermSAP)
                End If
            End If
        Next
    End Sub

    Private Sub MettreAJourSuspensExpedition()
        For Each aItem As RepeaterItem In rptBlocageLivraison.Items
            If aItem.ItemType = ListItemType.Item Or aItem.ItemType = ListItemType.AlternatingItem Then
                Dim aBlocageLivraison As New BOeKPI.BlocageLivraison(CInt(DirectCast(aItem.FindControl("hdnIdBlocageLivraison"), HiddenField).Value))
                If aBlocageLivraison IsNot Nothing AndAlso aBlocageLivraison.BlocageClient <> DirectCast(aItem.FindControl("chkBlocageClient"), CheckBox).Checked Then
                    aBlocageLivraison.BlocageClient = Not aBlocageLivraison.BlocageClient
                    aBlocageLivraison.Sauver()
                End If

                If DirectCast(aItem.FindControl("chkBlocageClient"), CheckBox).Checked Then
                    HistoriqueBlocageClient.AjouterBlocageLivraison(aBlocageLivraison.IdBlocageLivraison)
                End If
            End If
        Next
    End Sub
#End Region

End Class