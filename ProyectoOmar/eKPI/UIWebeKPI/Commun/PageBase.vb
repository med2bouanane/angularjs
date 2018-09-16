Public Class PageBase
    Inherits Page
    Implements ICallbackEventHandler

#Region "Déclarations"

    Private myUtilisateurCourant As BOeKPI.Utilisateur
    Protected myBoiteAttente As BusyBoxDotNet.BusyBox
    Private myResourceManager As System.Resources.ResourceManager
    Private myChaineCarateresSpeciaux As String = "&|""#'(§^!{}°)[]´`=+%¨\<>/,;~* " 'Liste des caractères qui seront supprimés
    Private myChaineCarateresAccentues As String = "ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÌÍÎÏìíîïÙÚÛÜùúûüµÿýÝÑñÇç$£€@"
    Private myChaineCarateresSansAccents As String = "AAAAAAaaaaaaOOOOOOooooooEEEEeeeeIIIIiiiiUUUUuuuuuyyYNnCcSLEA"
    Protected myHiddenFieldID As HiddenField
    Protected myTextBoxMessageUtilisateur As TextBox

#End Region

#Region "Propriétés"

    ReadOnly Property CodeLangueUI As String
        Get
            Me.EnsureChildControls()
            Return Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName
        End Get
    End Property

    Protected ReadOnly Property ResourceManager() As System.Resources.ResourceManager
        Get
            Me.EnsureChildControls()
            If myResourceManager Is Nothing Then
                myResourceManager = CType(Application("ResourceManager"), System.Resources.ResourceManager)
            End If
            Return myResourceManager
        End Get
    End Property

    ReadOnly Property UtilisateurCourant() As BOeKPI.Utilisateur
        Get
            Me.EnsureChildControls()
            If myUtilisateurCourant Is Nothing AndAlso Threading.Thread.CurrentPrincipal.Identity.Name <> String.Empty Then
                myUtilisateurCourant = New BOeKPI.Utilisateur(Threading.Thread.CurrentPrincipal.Identity.Name, BOeKPI.Utilisateur.TypeChaine.Identifiant)
            End If
            Return myUtilisateurCourant
        End Get
    End Property

    Public ReadOnly Property IdApplication() As Integer
        Get
            Dim aIdApplication As Integer = 0
            If Not ConfigurationManager.AppSettings("IdApplication") Is Nothing Then
                Integer.TryParse(ConfigurationManager.AppSettings("IdApplication"), aIdApplication)
            End If
            Return aIdApplication
        End Get
    End Property

#End Region

#Region "Interactions"

    Private Sub Page_Error(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Error
        Dim aErreur As BOCommunication.Erreur = BOCommunication.Erreur.LoggerErreur(Server.GetLastError(), Me)
        Session("Erreur") = aErreur.IdErreur
        Server.ClearError()
        Response.Redirect("~/Pagebase/Erreur.aspx")
    End Sub

    Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles MyBase.Init
        ChargerJQuery()
        If Not Me.Header Is Nothing Then
            Dim scriptControl0 = New HtmlGenericControl("meta")
            scriptControl0.Attributes.Add("http-equiv", "X-UA-Compatible")
            scriptControl0.Attributes.Add("content", "IE=edge")
            Page.Header.Controls.AddAt(1, scriptControl0)
        End If

        If Not ChargerArret() Then
            ChargerModalPopup()
        End If
    End Sub

    Protected Overrides Sub OnPreInit(ByVal e As System.EventArgs)
        MyBase.OnPreInit(e)
    End Sub

    Private Sub Page_Load(sender As Object, e As System.EventArgs) Handles Me.Load
        myBoiteAttente = New BusyBoxDotNet.BusyBox

        With myBoiteAttente
            .ShowBusyBox = BusyBoxDotNet.ShowBehavior.OnLeavingPage
            .BorderWidth = New System.Web.UI.WebControls.Unit(3, System.Web.UI.WebControls.UnitType.Pixel)
            .BorderColor = System.Drawing.Color.FromArgb(255, 55, 0)
            .OverlayColor = System.Drawing.Color.FromArgb(159, 158, 152)
            .Image = BusyBoxDotNet.ImageTemplate.FadingCircles
            .TextFontName = "Arial"
            .TitleFontName = "Arial"
            .KeepPosition = True
            .KeepOverlay = True
            .ImmediatelyOverlay = True
            .Title = GetGlobalResourceObject("Global", "TitreMessagePostBack").ToString
            .Text = GetGlobalResourceObject("Global", "MessagePostBack").ToString
        End With
        Try
            Me.Controls.Add(myBoiteAttente)
            Me.Controls.Add(New System.Web.UI.WebControls.Label)
        Catch ex As Exception
            Dim aLabell As New System.Web.UI.WebControls.Label
            aLabell.Text = ex.ToString()
            Me.Controls.Add(aLabell)
        End Try
    End Sub

    Public Sub RaiseCallbackEvent(ByVal eventArgument As String) Implements System.Web.UI.ICallbackEventHandler.RaiseCallbackEvent
        ' Processes a callback event on the server using the event
        ' argument from the client.
        Dim myStringArray(1) As String
        myStringArray(0) = "[[[[]]]]"

        myTextBoxMessageUtilisateur.Text = eventArgument.Split(myStringArray, StringSplitOptions.RemoveEmptyEntries)(0)
        myHiddenFieldID.Value = eventArgument.Split(myStringArray, StringSplitOptions.RemoveEmptyEntries)(1)
    End Sub

    Public Function GetCallbackResult() As String Implements System.Web.UI.ICallbackEventHandler.GetCallbackResult
        Try
            Dim aParutionAnnonce As New BOCommunication.ParutionAnnonce(CInt(myHiddenFieldID.Value))
            aParutionAnnonce.Message = myTextBoxMessageUtilisateur.Text
            aParutionAnnonce.SauverMessage()
        Catch
        End Try
        ' Returns the results of a callback event to the client.
        Return "Votre message a bien été envoyé"
    End Function

#End Region

#Region "Fonctionnalités"

    Private Function ChargerArret() As Boolean
        Try
            Dim aIdArret As Integer = BOCommunication.Arret.RechercherArretEnCours(IdApplication, DateTime.Now.ToString(New Globalization.CultureInfo("FR-fr")))
            If (aIdArret > 0) Then
                Dim aArret As New BOCommunication.Arret(aIdArret)
                Try
                    If Threading.Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName <> String.Empty Then
                        CType(Page.FindControl("lblMessageArret"), System.Web.UI.WebControls.Label).Text = aArret.Libelle(Threading.Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName)
                    Else
                        CType(Page.FindControl("lblMessageArret"), System.Web.UI.WebControls.Label).Text = aArret.Libelle("fr")
                    End If
                Catch ex As Exception

                End Try
                Try
                    Dim aArretHistorique As New BOCommunication.ArretHistorique()
                    aArretHistorique.IdArret = aIdArret
                    aArretHistorique.IdUtilisateur = BOGapCommerce.Utilisateur.UtilisateurCourant.IDUtilisateur
                    aArretHistorique.Sauver()
                Catch ex As Exception
                End Try
                If Me.GetType().BaseType.Name <> "ArretEnCours" Then
                    Response.Redirect("~/PageBase/ArretEnCours.aspx")
                Else
                    Return True
                End If
            Else
                If Me.GetType().BaseType.Name = "ArretEnCours" Then
                    Try
                        Response.Redirect(ConfigurationManager.AppSettings("URLBase"))
                    Catch ex As Exception
                        Response.Redirect("../default.html")
                    End Try
                End If
            End If
        Catch ex As Exception
            Return False
        End Try

        Return False
    End Function

    Private Sub ChargerModalPopup()
        Try
            If Not Page.IsCallback Then
                Dim aIdApplication As Integer = 0
                If Not ConfigurationManager.AppSettings("IdApplication") Is Nothing Then
                    Integer.TryParse(ConfigurationManager.AppSettings("IdApplication"), aIdApplication)
                End If

                Dim aIDUtilisateurCourant As Integer
                Dim aIDAnnonce As Integer
                Try
                    aIDUtilisateurCourant = UtilisateurCourant.IDUtilisateur
                    aIDAnnonce = BOCommunication.Annonce.RechercherAnnonceAPublierWithIdAnnonceIdUtilisateurDateCourante(aIDUtilisateurCourant, aIdApplication, DateTime.Now)
                Catch
                    aIDUtilisateurCourant = 0
                    aIDAnnonce = 0
                End Try

                If (aIDAnnonce > 0) Then
                    Dim aAnnonce As New BOCommunication.Annonce(aIDAnnonce)

                    Page.ClientScript.RegisterClientScriptInclude(Me.GetType(), "ThickBox", ResolveClientUrl("~/PageBase/jquery.simplemodal.js"))
                    Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "CSSSimplemodal", "<link rel='stylesheet' href='" & ResolveClientUrl("~/PageBase/simplemodal.css") & "' type='text/css' media='screen' />")

                    Dim aDivOverlay As New HtmlGenericControl("div")

                    Dim aDiv As New HtmlGenericControl("div")
                    aDiv.ID = "divPopup"
                    Me.Form.Controls.Add(aDiv)

                    myHiddenFieldID = New HiddenField()
                    aDiv.Controls.Add(myHiddenFieldID)

                    Dim aTable As New Table
                    aDiv.Controls.Add(aTable)
                    aTable.Width = Unit.Percentage(100)
                    Dim aRowMessage As New TableRow
                    Dim aCellMessage As New TableCell

                    aTable.Rows.Add(aRowMessage)
                    aRowMessage.Cells.Add(aCellMessage)

                    Dim aDivRebours As New HtmlControls.HtmlGenericControl("div")
                    aDivRebours.ID = "DivRebours"
                    aDivRebours.Style.Add("margin-right", "0")
                    aDivRebours.Style.Add("float", "right")
                    aDivRebours.Attributes.Add("class", "textegrismodal")
                    aDivRebours.Style.Add("color", "#FFF")
                    aDivRebours.Style.Add("background-color", "#ff3700")
                    aDivRebours.Style.Add("position", "relative")
                    aDivRebours.Style.Add("right", "-9px")
                    aDivRebours.Style.Add("text-align", "center")
                    aDivRebours.Style.Add("top", "-9px")
                    aDivRebours.Style.Add("width", "20px")
                    aDivRebours.Style.Add("height", "17px")
                    aDivRebours.Style.Add("font-weight", "bold")
                    aCellMessage.Controls.Add(aDivRebours)

                    Dim aLiteral As New Label()
                    aLiteral.CssClass = "textegrismodal"
                    aLiteral.Text = aAnnonce.Libelle(System.Threading.Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName)
                    Dim aAnchor As New HtmlAnchor()
                    aAnchor.Attributes.Add("class", "modalCloseImg simplemodal-close")
                    aAnchor.HRef = "#"
                    'test
                    aAnchor.ID = "aAncre"

                    aCellMessage.Controls.Add(aLiteral)

                    Dim aRowTextMessage As New TableRow
                    Dim aCellTextMessage As New TableCell

                    myTextBoxMessageUtilisateur = New TextBox
                    myTextBoxMessageUtilisateur.ID = "txtMessageUtilisateur"

                    myTextBoxMessageUtilisateur.Width = Unit.Percentage(100)
                    myTextBoxMessageUtilisateur.Height = Unit.Pixel(120)
                    myTextBoxMessageUtilisateur.TextMode = TextBoxMode.MultiLine
                    myTextBoxMessageUtilisateur.EnableViewState = True
                    If aAnnonce.MessageUtilisateur Then
                        aTable.Rows.Add(aRowTextMessage)
                        Dim aLiteralTitreMessage As New Label()
                        aLiteralTitreMessage.CssClass = "textegrismodal"
                        aLiteralTitreMessage.Style.Add("font-weight", "bold")
                        aLiteralTitreMessage.Text = "You can leave a message" & "<br>"
                        aCellTextMessage.Controls.Add(aLiteralTitreMessage)
                        aRowTextMessage.Cells.Add(aCellTextMessage)
                        aCellTextMessage.Controls.Add(myTextBoxMessageUtilisateur)

                        Dim aButton As New Button
                        aButton.Attributes.Add("class", "btdefaut")
                        aButton.Text = "Send"

                        Dim aRowButton As New TableRow
                        Dim aCellButton As New TableCell
                        aTable.Rows.Add(aRowButton)
                        aRowButton.Cells.Add(aCellButton)
                        aCellButton.Controls.Add(aButton)
                        aCellButton.Width = Unit.Percentage(100)
                        aCellButton.Style.Add("text-align", "right")

                        Dim aStringBuilderCallBack As New Text.StringBuilder()
                        aStringBuilderCallBack.Append("<script language=""javascript"" type=""text/javascript"">function __onCallbackBtnTermine(result, context){document.getElementById('" & aRowButton.ClientID & "').style.display  = 'none';document.getElementById('" & myTextBoxMessageUtilisateur.ClientID & "').style.display  = 'none';  document.getElementById('" & aLiteralTitreMessage.ClientID & "').innerHTML = result;}</script>")
                        Page.ClientScript.RegisterStartupScript(Me.GetType(), "Callback", aStringBuilderCallBack.ToString())

                        aButton.Attributes.Add("onclick", ClientScript.GetCallbackEventReference(Me, "document.getElementById('" & myTextBoxMessageUtilisateur.ClientID & "').value + '[[[[]]]]' + document.getElementById('" & myHiddenFieldID.ClientID & "').value ", "__onCallbackBtnTermine", "") & ";return false;")
                    End If

                    aDiv.Controls.Add(aAnchor)

                    Dim aStringBuilder As New Text.StringBuilder()

                    aStringBuilder.Append("<script language=""javascript"" type=""text/javascript"">  ").Append(vbCrLf)
                    aStringBuilder.Append("$(function() { ").Append(vbCrLf)
                    aStringBuilder.Append("$('#" & aDiv.ClientID & "').modal({ ").Append(vbCrLf)
                    aStringBuilder.Append("appendTo: 'form', ").Append(vbCrLf)
                    aStringBuilder.Append("opacity: 50, ").Append(vbCrLf)
                    aStringBuilder.Append("onOpen: function (dialog) { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.overlay.fadeIn('slow', function () { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.container.slideDown('slow', function () { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.data.fadeIn('slow'); ").Append(vbCrLf)
                    aStringBuilder.Append("}); ").Append(vbCrLf)
                    aStringBuilder.Append("}); ").Append(vbCrLf)
                    aStringBuilder.Append("} ").Append(vbCrLf)
                    aStringBuilder.Append(", ").Append(vbCrLf)
                    aStringBuilder.Append("onClose: function (dialog) { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.overlay.fadeOut('slow', function () { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.container.slideUp('slow', function () { ").Append(vbCrLf)
                    aStringBuilder.Append("dialog.data.fadeOut('slow'); ").Append(vbCrLf)
                    aStringBuilder.Append("cacherIframeModalPopup(); ").Append(vbCrLf)
                    aStringBuilder.Append("}); ").Append(vbCrLf)
                    aStringBuilder.Append("}); ").Append(vbCrLf)
                    aStringBuilder.Append("} ").Append(vbCrLf)
                    aStringBuilder.Append("}); ").Append(vbCrLf)


                    aStringBuilder.Append("setTimeout('CacherClose()', 100);").Append(vbCrLf)
                    aStringBuilder.Append("setTimeout('AfficherClose()', " & (aAnnonce.TempsAffichage + 1) * 1000 & ");").Append(vbCrLf)
                    aStringBuilder.Append("").Append(vbCrLf)
                    aDivRebours.InnerHtml = aAnnonce.TempsAffichage.ToString

                    aStringBuilder.Append("}); ").Append(vbCrLf)

                    'afin de corriger le bug de l'IFRAME dans IE6
                    aStringBuilder.Append("function cacherIframeModalPopup(){").Append(vbCrLf)
                    aStringBuilder.Append("var aListeIframe = document.getElementsByTagName('IFRAME');").Append(vbCrLf)
                    aStringBuilder.Append("for (i = 0; i<aListeIframe.length; i = i+1){").Append(vbCrLf)
                    aStringBuilder.Append("if (aListeIframe[i].src = 'javascript:false;')").Append(vbCrLf)
                    aStringBuilder.Append("aListeIframe[i].style.display='none';").Append(vbCrLf)
                    aStringBuilder.Append("}}").Append(vbCrLf)

                    aStringBuilder.Append("</script> ").Append(vbCrLf)

                    aStringBuilder.Append("<script language=""javascript"" type=""text/javascript""> ").Append(vbCrLf)
                    aStringBuilder.Append("function Rebours(){ try{").Append(vbCrLf)
                    aStringBuilder.Append(" if (parseInt(document.getElementById('" & aDivRebours.ClientID & "').innerHTML) > 0) { ").Append(vbCrLf)
                    aStringBuilder.Append(" document.getElementById('" & aDivRebours.ClientID & "').innerHTML = parseInt(document.getElementById('" & aDivRebours.ClientID & "').innerHTML) - 1;").Append(vbCrLf)
                    aStringBuilder.Append(" setTimeout('Rebours()', 1000);} else { ").Append(vbCrLf)
                    aStringBuilder.Append(" document.getElementById('" & aDivRebours.ClientID & "').style.display = 'none'; ").Append(vbCrLf)
                    aStringBuilder.Append("}}").Append(vbCrLf)
                    aStringBuilder.Append("catch (e) {}").Append(vbCrLf)
                    aStringBuilder.Append("}").Append(vbCrLf)

                    aStringBuilder.Append("function CacherClose() {  ").Append(vbCrLf)
                    aStringBuilder.Append("$('.simplemodal-close').fadeOut('slow');").Append(vbCrLf)
                    aStringBuilder.Append("if (document.getElementById('" & aAnchor.ClientID & "').style.display != 'none'){ ").Append(vbCrLf)
                    aStringBuilder.Append("setTimeout('CacherClose()', 100);").Append(vbCrLf)
                    aStringBuilder.Append("}else{Rebours();}}").Append(vbCrLf) '
                    aStringBuilder.Append("</script> ").Append(vbCrLf)

                    aStringBuilder.Append("<script language=""javascript"" type=""text/javascript""> ").Append(vbCrLf)
                    aStringBuilder.Append("function AfficherClose() { ").Append(vbCrLf)
                    aStringBuilder.Append("$('.simplemodal-close').fadeIn('slow');").Append(vbCrLf)
                    aStringBuilder.Append("}").Append(vbCrLf)
                    aStringBuilder.Append("</script> ").Append(vbCrLf)

                    Page.ClientScript.RegisterStartupScript(Me.GetType(), "Popup", aStringBuilder.ToString())
                    Dim aParutionAnnonce As New BOCommunication.ParutionAnnonce()
                    aParutionAnnonce.IdAnnonce = aAnnonce.IdAnnonce
                    aParutionAnnonce.IdUtilisateur = UtilisateurCourant.IDUtilisateur
                    aParutionAnnonce.Sauver()
                    myHiddenFieldID.Value = aParutionAnnonce.IdParutionAnnonce.ToString
                End If
            Else
                Dim aDivOverlay As New HtmlGenericControl("div")

                Dim aDiv As New HtmlGenericControl("div")
                aDiv.ID = "divPopup"
                aDiv.Style.Add("display", "none")
                Me.Form.Controls.Add(aDiv)

                myHiddenFieldID = New HiddenField()
                aDiv.Controls.Add(myHiddenFieldID)

                Dim aTable As New Table
                aTable.Width = Unit.Percentage(100)
                Dim aRowMessage As New TableRow
                Dim aCellMessage As New TableCell

                aTable.Rows.Add(aRowMessage)
                aRowMessage.Cells.Add(aCellMessage)

                Dim aDivRebours As New HtmlControls.HtmlGenericControl("div")
                aDivRebours.ID = "DivRebours"
                aDivRebours.Style.Add("margin-right", "0")
                aDivRebours.Style.Add("float", "right")
                aDivRebours.Attributes.Add("class", "textegrismodal")
                aDivRebours.Style.Add("color", "#FFF")
                aDivRebours.Style.Add("background-color", "#ff3700")
                aDivRebours.Style.Add("position", "relative")
                aDivRebours.Style.Add("right", "-9px")
                aDivRebours.Style.Add("text-align", "center")
                aDivRebours.Style.Add("top", "-9px")
                aDivRebours.Style.Add("width", "20px")
                aDivRebours.Style.Add("height", "17px")
                aDivRebours.Style.Add("font-weight", "bold")
                aCellMessage.Controls.Add(aDivRebours)

                Dim aLiteral As New Label()
                aLiteral.CssClass = "textegrismodal"
                Dim aAnchor As New HtmlAnchor()
                aAnchor.Attributes.Add("class", "modalCloseImg simplemodal-close")
                aAnchor.HRef = "#"

                aCellMessage.Controls.Add(aLiteral)

                Dim aRowTextMessage As New TableRow
                Dim aCellTextMessage As New TableCell

                myTextBoxMessageUtilisateur = New TextBox
                myTextBoxMessageUtilisateur.ID = "txtMessageUtilisateur"

                myTextBoxMessageUtilisateur.Width = Unit.Percentage(100)
                myTextBoxMessageUtilisateur.Height = Unit.Pixel(120)
                myTextBoxMessageUtilisateur.TextMode = TextBoxMode.MultiLine
                myTextBoxMessageUtilisateur.EnableViewState = True
                aTable.Rows.Add(aRowTextMessage)
                Dim aLiteralTitreMessage As New Label()
                aLiteralTitreMessage.CssClass = "textegrismodal"
                aRowTextMessage.Cells.Add(aCellTextMessage)
                aCellTextMessage.Controls.Add(myTextBoxMessageUtilisateur)

                Dim aButton As New Button
                aButton.Attributes.Add("class", "btdefaut")

                Dim aRowButton As New TableRow
                Dim aCellButton As New TableCell
                aTable.Rows.Add(aRowButton)
                aRowButton.Cells.Add(aCellButton)
                aCellButton.Controls.Add(aButton)
                aCellButton.Width = Unit.Percentage(100)
                aCellButton.Style.Add("text-align", "right")

                aDiv.Controls.Add(aTable)

                aDiv.Controls.Add(aAnchor)
            End If
        Catch ex As Exception
        End Try
    End Sub

    Private Sub AjouterScriptJQueryUI()
        'If UCase(CodeLangueUI) = "FR" Then
        '    Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "jqDateTimePicker", "<script language=""javascript"" type=""text/javascript"">$(document).ready(function() {$('.jqDatePicker').datetimepicker({lang:'fr', timepicker:false, format:'d/m/Y', onGenerate: function (ct) {jQuery(this).on('mouseleave', function (event) {jQuery(this).hide();});}});$('.jqDateTimePicker').datetimepicker({lang:'fr', timepicker:true, step:30, format:'d/m/Y H:i', onGenerate: function (ct) {jQuery(this).on('mouseleave', function (event) {jQuery(this).hide();});}});});</script>")
        'Else
        '    Page.ClientScript.RegisterClientScriptBlock(Me.GetType(), "jqDateTimePicker", "<script language=""javascript"" type=""text/javascript"">$(document).ready(function() {$('.jqDatePicker').datetimepicker({lang:'en', timepicker:false, format:'m/d/Y', onGenerate: function (ct) {jQuery(this).on('mouseleave', function (event) {jQuery(this).hide();});}});$('.jqDateTimePicker').datetimepicker({lang:'en', timepicker:true, step:30, format:'m/d/Y H:i', onGenerate: function (ct) {jQuery(this).on('mouseleave', function (event) {jQuery(this).hide();});}});});</script>")
        'End If
    End Sub

    Protected Overrides Sub InitializeCulture()
        Dim aLangue As String = String.Empty
        Dim aCookie As HttpCookie = Request.Cookies("LangueEKPI")
        If Not aCookie Is Nothing AndAlso aCookie.Value <> String.Empty Then
            aLangue = aCookie.Values("LangueEKPI")
            Threading.Thread.CurrentThread.CurrentUICulture = New Globalization.CultureInfo(aLangue)
            Threading.Thread.CurrentThread.CurrentCulture = Globalization.CultureInfo.CreateSpecificCulture(aLangue)
        End If
        MyBase.InitializeCulture()
    End Sub

    Public Function SupprimerAccentsCaracteresSpeciaux(ByVal theChaine As String) As String
        For i As Integer = 0 To myChaineCarateresAccentues.Length - 1
            theChaine = theChaine.Replace(myChaineCarateresAccentues(i), myChaineCarateresSansAccents(i))
        Next

        For Each aCaractere As Char In myChaineCarateresSpeciaux
            theChaine = theChaine.Replace(aCaractere, "")
        Next

        Return theChaine
    End Function

    Private Sub ChargerJQuery()
        If Not Page.Header Is Nothing Then
            Dim scriptControlJQueryUI = New HtmlGenericControl("script")
            scriptControlJQueryUI.Attributes("language") = "javascript"
            scriptControlJQueryUI.Attributes("type") = "text/javascript"
            scriptControlJQueryUI.Attributes("src") = ResolveClientUrl("~/Scripts/jquery-ui-1.8.12.custom.min.js")
            Page.Header.Controls.AddAt(1, scriptControlJQueryUI)

            Dim scriptControlJQuery = New HtmlGenericControl("script")
            scriptControlJQuery.Attributes("language") = "javascript"
            scriptControlJQuery.Attributes("type") = "text/javascript"
            scriptControlJQuery.Attributes("src") = ResolveClientUrl("~/Scripts/jquery.min.js")
            Page.Header.Controls.AddAt(1, scriptControlJQuery)
        End If
    End Sub

#End Region

End Class
