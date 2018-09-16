Public Class AfficherHistoriqueBlocageClient
    Inherits PageBase

#Region "Déclarations"

#End Region

#Region "Propriétés"
    Public ReadOnly Property IdHistoriqueBlocageClient As Integer
        Get
            If Not String.IsNullOrEmpty(Request.QueryString("IdHistoriqueBlocageClient")) Then
                Return CInt(Request.QueryString("IdHistoriqueBlocageClient"))
            End If
            Return 0
        End Get
    End Property

    Public ReadOnly Property HistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient
        Get
            If IdHistoriqueBlocageClient <> 0 Then
                Return New BOeKPI.HistoriqueBlocageClient(IdHistoriqueBlocageClient)
            End If
            Return Nothing
        End Get
    End Property

    Public ReadOnly Property IdsIncoterm As List(Of Integer)
        Get
            Return HistoriqueBlocageClient.Details.Select(Function(d) d.IdIncotermSAP).Distinct.ToList
        End Get
    End Property

    Public ReadOnly Property IdsBlocageLivraison As List(Of Integer)
        Get
            Return HistoriqueBlocageClient.Details.Select(Function(d) d.IdBlocageLivraison).Distinct.ToList
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

            AfficherHistorique()
        End If
    End Sub

    Protected Sub rptBlocageLivraison_ItemDataBound(sender As Object, e As System.Web.UI.WebControls.RepeaterItemEventArgs) Handles rptBlocageLivraison.ItemDataBound
        If e.Item.ItemType = ListItemType.AlternatingItem Or e.Item.ItemType = ListItemType.Item Then
            Dim aBlocageLivraison As BOeKPI.BlocageLivraison = DirectCast(e.Item.DataItem, BOeKPI.BlocageLivraison)
            DirectCast(e.Item.FindControl("lblLibelleBlocageLivraison"), Label).Text = aBlocageLivraison.Libelle
            DirectCast(e.Item.FindControl("chkBlocageClient"), CheckBox).Checked = IdsBlocageLivraison.Contains(aBlocageLivraison.IdBlocageLivraison)
            DirectCast(e.Item.FindControl("hdnIdBlocageLivraison"), HiddenField).Value = aBlocageLivraison.IdBlocageLivraison.ToString
        End If
    End Sub

    Protected Sub rptIncoterm_ItemDataBound(sender As Object, e As System.Web.UI.WebControls.RepeaterItemEventArgs) Handles rptIncoterm.ItemDataBound
        If e.Item.ItemType = ListItemType.Item Or e.Item.ItemType = ListItemType.AlternatingItem Then
            Dim aIncotermSAP As BOeKPI.IncotermSAP = DirectCast(e.Item.DataItem, BOeKPI.IncotermSAP)
            DirectCast(e.Item.FindControl("lblLibelleIncoterm"), Label).Text = aIncotermSAP.Libelle
            DirectCast(e.Item.FindControl("chkBlocageIncoterm"), CheckBox).Checked = IdsIncoterm.Contains(aIncotermSAP.IdIncotermSAP)
            DirectCast(e.Item.FindControl("hdnIdIncoterm"), HiddenField).Value = aIncotermSAP.IdIncotermSAP.ToString
        End If
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub AfficherHistorique()
        If HistoriqueBlocageClient IsNot Nothing Then
            lblInformationHistorique.Text = "Configuration - " & HistoriqueBlocageClient.DateCreation.Date & " - " & HistoriqueBlocageClient.Utilisateur.Login
            txtDescription.Text = HistoriqueBlocageClient.Description
        End If
    End Sub
#End Region

End Class