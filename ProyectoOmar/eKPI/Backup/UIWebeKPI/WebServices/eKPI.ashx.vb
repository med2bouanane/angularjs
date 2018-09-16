Imports System.Web
Imports System.Web.Services
Imports Outils.DateTimeExtensions

Public Class eKPI
    Implements System.Web.IHttpHandler
#Region "Déclarations"

#End Region

#Region "Propriétés"
    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

    Public ReadOnly Property DateDebut As DateTime
        Get
            Return DateDeFin.AddDays(-7 * 52)
        End Get
    End Property

    Public ReadOnly Property DateDeFin As DateTime
        Get
            Dim aSemaineFin As Integer = DateTime.Now.NumeroSemaine
            aSemaineFin -= 1
            Return Outils.DateTimeExtensions.DateOutils.DernierJourDeLaSemaine(aSemaineFin, DateTime.Now.Year)
        End Get
    End Property

#End Region

#Region "Interractions"
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim aReponse As String
        context.Response.ContentType = "text/json"

        Select Case context.Request("Mode")
            Case "VueEnsemble"
                aReponse = GenererInfoVueEnsemble(context)
            Case "ObjectifDeLivraison"
                aReponse = GenererInfoObjectifDeLivraison()
            Case "Test"
                aReponse = Test(context)
            Case Else
                aReponse = String.Empty
        End Select

        context.Response.Write(aReponse)
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Function GenererInfoVueEnsemble(ByVal theContext As HttpContext) As String
        Dim aIdSite As Integer = CInt(theContext.Request("IDSite"))
        Dim aTypeCommande As Integer = CInt(theContext.Request("TypeCommande"))
        Dim aInfoBlocageClient As Integer = CInt(theContext.Request("BlocageClient"))
        Dim aIndicateurInferieur As Integer = CInt(theContext.Request("IndicateurInferieur"))
        Dim aIndicateurSuperieur As Integer = CInt(theContext.Request("IndicateurSuperieur"))

        Dim aBlocageClient As Boolean?

        Select Case aInfoBlocageClient
            Case 1
                aBlocageClient = True
            Case 2
                aBlocageClient = False
            Case Else
                aBlocageClient = Nothing
        End Select

        Dim aAccuses As New BOeKPI.AccuseCollection(aIdSite, aTypeCommande, aBlocageClient, DateDebut, DateDeFin)

        Dim aJavaScriptSerializer As New System.Web.Script.Serialization.JavaScriptSerializer
        Return aJavaScriptSerializer.Serialize(aAccuses.OrderBy(Function(a) a.DateDeSortie).ToList)
    End Function

    Private Function GenererInfoObjectifDeLivraison() As String
        Dim aJavascriptSerializer As New System.Web.Script.Serialization.JavaScriptSerializer
        Dim aObjectifsLivraisonCollectionn As New BOeKPI.ConfigurationObjectifLivraisonCollection
        Return aJavascriptSerializer.Serialize(aObjectifsLivraisonCollectionn)
    End Function

    Private Function Test(ByRef theContext As HttpContext) As String
        Dim aNombreA As Integer = CInt(theContext.Request("A"))
        Dim aNombreB As Integer = CInt(theContext.Request("B"))
        theContext.Response.ContentType = "text/plain"
        Return (aNombreA + aNombreB).ToString
    End Function
#End Region

End Class
