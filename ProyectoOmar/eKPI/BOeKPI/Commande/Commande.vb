Public Class Commande
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.Commande, DCeKPI.Commande.CommandeRow)

#Region "Déclarations"
    Private myToles As BOeKPI.ToleCollection
    Private myDivision As BOeKPI.Division
    Private myAccuse As BOeKPI.Accuse
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property NumCom As String
        Get
            Return ProprieteStringGenerique("NumCom")
        End Get
        Set(value As String)
            ProprieteStringGenerique("NumCom") = value
        End Set
    End Property

    Public Property IdBackOffice As Integer
        Get
            Return ProprieteIntegerGenerique("IdBackOffice")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBackOffice") = value
        End Set
    End Property

    Public Property RefCom As String
        Get
            Return ProprieteStringGenerique("RefCom")
        End Get
        Set(value As String)
            ProprieteStringGenerique("RefCom") = value
        End Set
    End Property

    Public Property DateCom As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateCom")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateCom") = value
        End Set
    End Property

    Public Property NumAccuse As Integer
        Get
            Return ProprieteIntegerGenerique("NumAccuse")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NumAccuse") = value
        End Set
    End Property

    Public Property Segment As String
        Get
            Return ProprieteStringGenerique("Segment")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Segment") = value
        End Set
    End Property

    Public Property IdSite As Integer
        Get
            Return ProprieteIntegerGenerique("IdSite")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdSite") = value
        End Set
    End Property

    Public Property CodeModeTransport As String
        Get
            Return ProprieteStringGenerique("CodeModeTransport")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeModeTransport") = value
        End Set
    End Property

    Public Property Longueur As Double
        Get
            Return ProprieteDoubleGenerique("Longueur")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("Longueur") = value
        End Set
    End Property

    Public Property Largeur As Double
        Get
            Return ProprieteDoubleGenerique("Largeur")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("Largeur") = value
        End Set
    End Property

    Public Property Epaisseur As Double
        Get
            Return ProprieteDoubleGenerique("Epaisseur")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("Epaisseur") = value
        End Set
    End Property

    Public Property IdIncotermSAP As Integer
        Get
            Return ProprieteIntegerGenerique("IdIncotermSAP")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdIncotermSAP") = value
        End Set
    End Property

    Public Property VilleIncoterm As String
        Get
            Return ProprieteStringGenerique("VilleIncoterm")
        End Get
        Set(value As String)
            ProprieteStringGenerique("VilleIncoterm") = value
        End Set
    End Property

    Public Property NombreTole As Integer
        Get
            Return ProprieteIntegerGenerique("NombreTole")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NombreTole") = value
        End Set
    End Property

    Public Property Tonnage As Double
        Get
            Return ProprieteDoubleGenerique("Tonnage")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("Tonnage") = value
        End Set
    End Property

    Public Property DelaiExpedition As DateTime
        Get
            Return ProprieteDateTimeGenerique("DelaiExpedition")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DelaiExpedition") = value
        End Set
    End Property

    Public Property CodeNatureProduit As String
        Get
            Return ProprieteStringGenerique("CodeNatureProduit")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeNatureProduit") = value
        End Set
    End Property

    Public Property DimensionsAnglaise As Boolean
        Get
            Return ProprieteBooleanGenerique("DimensionsAnglaise")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("DimensionsAnglaise") = value
        End Set
    End Property

    Public Property LongueurAnglaise As Double
        Get
            Return ProprieteDoubleGenerique("LongueurAnglaise")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("LongueurAnglaise") = value
        End Set
    End Property

    Public Property LargeurAnglaise As Double
        Get
            Return ProprieteDoubleGenerique("LargeurAnglaise")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("LargeurAnglaise") = value
        End Set
    End Property

    Public Property EpaisseurAnglaise As Double
        Get
            Return ProprieteDoubleGenerique("EpaisseurAnglaise")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("EpaisseurAnglaise") = value
        End Set
    End Property

    Public Property IdDivision As Integer
        Get
            Return ProprieteIntegerGenerique("IdDivision")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdDivision") = value
        End Set
    End Property

    Public Property IdNatureLaminage As Integer
        Get
            Return ProprieteIntegerGenerique("IdNatureLaminage")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdNatureLaminage") = value
        End Set
    End Property

    Public Property IdBlocageLivraison As Integer
        Get
            Return ProprieteIntegerGenerique("IdBlocageLivraison")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBlocageLivraison") = value
        End Set
    End Property

    Public Property BlocageClient As Boolean
        Get
            Return ProprieteBooleanGenerique("BlocageClient")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("BlocageClient") = value
        End Set
    End Property

    Public ReadOnly Property SemaineLivraison As Integer
        Get
            If DateDeSortie = DateTime.MinValue Then
                Return 0
            Else
                Return CalculerSemaine(DateDeSortie)
            End If
        End Get
    End Property

    Public ReadOnly Property DateDeSortie As DateTime
        Get
            Return Toles.OrderByDescending(Function(t) t.DateDeSortie).First.DateDeSortie
        End Get
    End Property

    Public ReadOnly Property SemaineLivraisonEsperee As Integer
        Get
            Return CalculerSemaine(DelaiExpedition)
        End Get
    End Property

    Public ReadOnly Property EstSolde As Boolean
        Get
            Return Toles.Count <> 0 AndAlso Toles.Where(Function(t) t.DateDeSortie <> DateTime.MinValue).Count = Toles.Count
        End Get
    End Property

    Public ReadOnly Property IndicateurPerformanceLivraison As Integer
        Get
            Return CInt(DateDiff(DateInterval.WeekOfYear, DelaiExpedition, DateDeSortie))
        End Get
    End Property
#End Region

#Region "Objets liés"
    Public ReadOnly Property Accuse As BOeKPI.Accuse
        Get
            If myAccuse Is Nothing Then
                myAccuse = New BOeKPI.Accuse(NumAccuse)
            End If
            Return myAccuse
        End Get
    End Property

    Public ReadOnly Property Toles As BOeKPI.ToleCollection
        Get
            If myToles Is Nothing Then
                myToles = New BOeKPI.ToleCollection(NumCom)
            End If
            Return myToles
        End Get
    End Property

    Public ReadOnly Property Division As BOeKPI.Division
        Get
            If myDivision Is Nothing AndAlso IdDivision <> 0 Then
                myDivision = New BOeKPI.Division(IdDivision)
            End If
            Return myDivision
        End Get
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.Commande)
    End Sub

    Friend Sub New(ByVal theCommandeRow As DCeKPI.Commande.CommandeRow)
        MyBase.New(theCommandeRow)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Function CalculerSemaine(ByVal theDate As DateTime) As Integer
        If theDate <> DateTime.MinValue Then
            Return DatePart(DateInterval.WeekOfYear, theDate)
        Else
            Return 0
        End If
    End Function
#End Region

End Class

Public Class CommandeCollection
    Inherits List(Of Commande)
#Region "Constructeurs"
    Public Sub New(ByVal theNumeroAccuse As Integer)
        Init(New DAeKPI.Commande().SelectWithNumAccuse(theNumeroAccuse))
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Init(ByVal theCommandeDc As DCeKPI.Commande)
        For Each aCommandeRow As DCeKPI.Commande.CommandeRow In theCommandeDc._Commande.Rows
            Me.Add(New Commande(aCommandeRow))
        Next
    End Sub
#End Region
End Class