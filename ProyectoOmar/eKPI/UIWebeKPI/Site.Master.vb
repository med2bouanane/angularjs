Public Class Site
    Inherits MasterPageBase

#Region "Déclaration"

    Public Event LoggedIn()

#End Region

#Region "Propriétés"


#End Region

#Region "Interactions"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Request.Browser.IsMobileDevice Then
            'TODO
            ' Response.Redirect(".aspx")
        End If

        If Not IsPostBack Then
            ChargerDdlLangue()
            Dim aMenu As BOeKPI.MenuCollection
            If Not UtilisateurCourant Is Nothing Then
                If UtilisateurCourant.Autorisations().ContenirAutorizaction(New BOeKPI.Autorisation("AccesPortail")) Then
                    aMenu = UtilisateurCourant.Menus(CInt(System.Configuration.ConfigurationManager.AppSettings("IdApplication")))
                    afficherMenu(aMenu)
                Else
                    aMenu = New BOeKPI.MenuCollection(CInt(System.Configuration.ConfigurationManager.AppSettings("IdApplication")), BOeKPI.MenuCollection.TypeChrgementEnum.Evalue)
                    afficherMenu(aMenu)
                End If
            Else
                aMenu = New BOeKPI.MenuCollection(CInt(System.Configuration.ConfigurationManager.AppSettings("IdApplication")), BOeKPI.MenuCollection.TypeChrgementEnum.Evalue)
                afficherMenu(aMenu)
            End If
        End If
        If Context.User.Identity.Name = String.Empty Then
            'Pas connecté
            divMenu.Visible = False
            If Not Request.CurrentExecutionFilePath.ToLower.Contains("inscription.aspx") AndAlso Not liveKPI.FindControl("lgneKPI") Is Nothing Then
                DirectCast(liveKPI.FindControl("lgneKPI").FindControl("lnkInscription"), HyperLink).Visible = True
                DirectCast(liveKPI.FindControl("lgneKPI").FindControl("lnkInscription"), HyperLink).NavigateUrl = ResolveUrl("~/Inscription.aspx")
                DirectCast(liveKPI.FindControl("lgneKPI").FindControl("spnSeparateur"), HtmlGenericControl).Visible = True
            End If
        Else
            DirectCast(liveKPI.FindControl("HeadLoginName"), System.Web.UI.WebControls.LoginName).FormatString = UtilisateurCourant.PrenomNom
            'TODO
            'ChargerMenu()
        End If

        divFondBlanc.Visible = (Not Request.CurrentExecutionFilePath.ToLower.Contains("index.aspx"))
        lnkAccueil.HRef = ResolveUrl("Index.aspx")

        Dim aUrlImg As String = System.Configuration.ConfigurationManager.AppSettings("URLBase") & "Images/nook.gif"
        Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "AsignerImageUrl", "var myUrlImg ='" & aUrlImg & "';", True)
    End Sub

    Private Sub ddlLangueEKPI_SelectedIndexChanged(sender As Object, e As System.EventArgs) Handles ddlLangueEKPI.SelectedIndexChanged
        If ddlLangueEKPI.SelectedValue <> String.Empty Then
            Dim aCookieLangue As New System.Web.HttpCookie("LangueEKPI")
            aCookieLangue.Values("LangueEKPI") = ddlLangueEKPI.SelectedValue
            aCookieLangue.Expires = Now.AddDays(3)
            Response.Cookies.Add(aCookieLangue)

            If Request.QueryString.ToString <> String.Empty Then
                Response.Redirect(Request.Path & "?" & Request.QueryString.ToString())
            Else
                Response.Redirect(Request.Path)
            End If

        End If
    End Sub

    Protected Sub OnLoggedIn()
        RaiseEvent LoggedIn()
    End Sub

    Protected Sub OnLoggedOut()
        Session.Abandon()
    End Sub

#End Region

#Region "Fonctionnalités"

    Public Sub ChargerDdlLangue()
        ddlLangueEKPI.DataSource = New BOGapCommerce.LangueCollection(True)
        ddlLangueEKPI.DataTextField = "Libelle"
        ddlLangueEKPI.DataValueField = "CodeLangue"
        ddlLangueEKPI.DataBind()
        ddlLangueEKPI.Items.FindByValue("en").Text = GetLocalResourceObject("Anglais").ToString

        Dim aCookie As HttpCookie = Request.Cookies("LangueEKPI")
        If Not IsNothing(aCookie) AndAlso aCookie.Value <> String.Empty Then
            ddlLangueEKPI.SelectedValue = aCookie.Values("LangueEKPI").ToLower
        End If
    End Sub

    Private Sub afficherMenu(ByVal theMenus As BOeKPI.MenuCollection)
        'Seulement ceux qui ont un null parent (Menu principal)
        Dim aNewMenuItem As MenuItem
        For Each aMenu In theMenus
            If aMenu.IdMenuParent = 0 Then
                aNewMenuItem = New MenuItem(aMenu.Libelle(CodeLangueUI).ToString(), aMenu.IdMenu.ToString())
                mnueKPI.Items.Add(aNewMenuItem)
                InsererMenuEnfant(aNewMenuItem, theMenus)
            End If
        Next
    End Sub

    'A refaire avesdes objet lié
    Private Sub InsererMenuEnfant(ByVal ParentMenuItem As MenuItem, ByVal theMenus As BOeKPI.MenuCollection)
        Dim aNewMenuItem As MenuItem
        For Each aMenu In theMenus
            If aMenu.IdMenuParent <> 0 AndAlso aMenu.IdMenuParent = CInt(ParentMenuItem.Value) Then
                anewMenuItem = New MenuItem(aMenu.Libelle(CodeLangueUI).ToString(), aMenu.IdMenu.ToString())
                ParentMenuItem.ChildItems.Add(anewMenuItem)
                InsererMenuEnfant(aNewMenuItem, theMenus)
                If Not String.IsNullOrEmpty(aMenu.Url) Then
                    aNewMenuItem.NavigateUrl = aMenu.Url
                End If
            End If
        Next
    End Sub

#End Region

End Class
