Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel
Imports System.Web.Script.Services
Imports Outils.DateTimeExtensions

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
<System.Web.Script.Services.ScriptService()> _
<System.Web.Services.WebService(Namespace:="http://tempuri.org/")> _
<System.Web.Services.WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<ToolboxItem(False)> _
Public Class eKPI1
    Inherits System.Web.Services.WebService

#Region "Déclaration"
    Enum TypeIdentificateur
        id
        login
        guid
    End Enum
#End Region

#Region "Propriétés"
    Public ReadOnly Property DateDebutVueEnsemble As DateTime
        Get
            Return DateDeFinVueEnsemble.AddDays(-7 * 52)
        End Get
    End Property

    Public ReadOnly Property DateDeFinVueEnsemble As DateTime
        Get
            Dim aSemaineFin As Integer = DateTime.Now.NumeroSemaine
            aSemaineFin -= 1
            Return Outils.DateTimeExtensions.DateOutils.DernierJourDeLaSemaine(aSemaineFin, DateTime.Now.Year)
        End Get
    End Property
#End Region
    <WebMethod()> _
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function ObtenirInfoVueEnsemble(ByVal theIdSite As Integer, ByVal theTypeCommade As Integer, ByVal theInfoBlocageClient As Integer) As List(Of BOeKPI.Accuse)
        Dim aBlocageClient As Boolean?

        Select Case theInfoBlocageClient
            Case 1
                aBlocageClient = True
            Case 2
                aBlocageClient = False
            Case Else
                aBlocageClient = Nothing
        End Select

        Dim aAccuses As New BOeKPI.AccuseCollection(theIdSite, theTypeCommade, aBlocageClient, DateDebutVueEnsemble, DateDeFinVueEnsemble)
        Return aAccuses.OrderBy(Function(a) a.DateDeSortie).ToList
    End Function

    <WebMethod()> _
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function ObtenirObjectifsLivraison() As List(Of BOeKPI.ConfigurationObjectifLivraison)
        Dim aObjectifLivraisonCollection As New BOeKPI.ConfigurationObjectifLivraisonCollection
        Return aObjectifLivraisonCollection.OrderBy(Function(o) o.DateCreation).ToList
    End Function


    <WebMethod()> _
    <ScriptMethod(ResponseFormat:=ResponseFormat.Json)> _
    Public Function ObtenirUtilisateur(ByVal theIdentificateur As String, ByVal theTypeIdentificateur As TypeIdentificateur) As BOeKPI.Utilisateur
        Dim aUtilisateur As BOeKPI.Utilisateur = Nothing
        If theTypeIdentificateur = TypeIdentificateur.id Then
            aUtilisateur = New BOeKPI.Utilisateur(CInt(theIdentificateur), BOGapCommerce.Utilisateur.PeutEtreInactif.Non)
        ElseIf theTypeIdentificateur = TypeIdentificateur.login Then
            aUtilisateur = New BOeKPI.Utilisateur(theIdentificateur, BOeKPI.Utilisateur.TypeChaine.Identifiant)
        ElseIf theTypeIdentificateur = TypeIdentificateur.guid Then
            aUtilisateur = New BOeKPI.Utilisateur(theIdentificateur, BOGapCommerce.Utilisateur.TypeGuid.GuidIdentification)
        End If
        Return aUtilisateur
    End Function



End Class
