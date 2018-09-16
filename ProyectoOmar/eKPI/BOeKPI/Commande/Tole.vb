Public Class Tole
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.Tole, DCeKPI.Tole.ToleRow)

#Region "Déclarations"
    Private myDocumentAcheminement As BOeKPI.DocumentAcheminement
    Private myBordereau As BOeKPI.Bordereau
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property NumTol As String
        Get
            Return ProprieteStringGenerique("NumTol")
        End Get
        Set(value As String)
            ProprieteStringGenerique("NumTol") = value
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

    Public Property NumCom As String
        Get
            Return ProprieteStringGenerique("NumCom")
        End Get
        Set(value As String)
            ProprieteStringGenerique("NumCom") = value
        End Set
    End Property

    Public Property NumCoul As String
        Get
            Return ProprieteStringGenerique("NumCom")
        End Get
        Set(value As String)
            ProprieteStringGenerique("NumCom") = value
        End Set
    End Property

    Public Property IdDossier As Integer
        Get
            Return ProprieteIntegerGenerique("IdDossier")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdDossier") = value
        End Set
    End Property

    Public Property NumBordSAP As Integer
        Get
            Return ProprieteIntegerGenerique("NumBordSAP")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NumBordSAP") = value
        End Set
    End Property

    Public Property NumCoil As Integer
        Get
            Return ProprieteIntegerGenerique("NumCoil")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NumCoil") = value
        End Set
    End Property

    Public Property IdDocumentAcheminement As Integer
        Get
            Return ProprieteIntegerGenerique("IdDocumentAcheminement")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdDocumentAcheminement") = value
        End Set
    End Property

    Public Property IdPaquet As Integer
        Get
            Return ProprieteIntegerGenerique("IdPaquet")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdPaquet") = value
        End Set
    End Property

    Public Property DateReceptionClientLivre As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateReceptionClientLivre")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateReceptionClientLivre") = value
        End Set
    End Property

    Public Property ReferenceTransitaire As String
        Get
            Return ProprieteStringGenerique("ReferenceTransitaire")
        End Get
        Set(value As String)
            ProprieteStringGenerique("ReferenceTransitaire") = value
        End Set
    End Property

    Public Property IDInstruction As Integer
        Get
            Return ProprieteIntegerGenerique("IDInstruction")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IDInstruction") = value
        End Set
    End Property

    Public Property PoidsFacture As Double
        Get
            Return ProprieteDoubleGenerique("PoidsFacture")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("PoidsFacture") = value
        End Set
    End Property

    Public ReadOnly Property DateDeSortie As DateTime
        Get
            If DocumentAcheminement IsNot Nothing AndAlso DocumentAcheminement.CodeModeTransport = 5 Then
                Return DocumentAcheminement.DateSortieMarchandise
            ElseIf Bordereau IsNot Nothing Then
                Return Bordereau.DateSortieMarchandise
            Else
                Return DateTime.MinValue
            End If
        End Get
    End Property
#End Region

#Region "Objets liés"
    Public ReadOnly Property Bordereau As BOeKPI.Bordereau
        Get
            If myBordereau Is Nothing AndAlso NumBordSAP <> 0 Then
                myBordereau = New BOeKPI.Bordereau(NumBordSAP)
            End If
            Return myBordereau
        End Get
    End Property

    Public ReadOnly Property DocumentAcheminement As BOeKPI.DocumentAcheminement
        Get
            If myDocumentAcheminement Is Nothing AndAlso IdDocumentAcheminement <> 0 Then
                myDocumentAcheminement = New BOeKPI.DocumentAcheminement(IdDocumentAcheminement)
            End If
            Return myDocumentAcheminement
        End Get
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.Tole)
    End Sub

    Friend Sub New(ByVal theToleRow As DCeKPI.Tole.ToleRow)
        MyBase.New(theToleRow)
    End Sub
#End Region

#Region "Fonctionnalités"

#End Region

End Class

Public Class ToleCollection
    Inherits List(Of Tole)

#Region "Constructeurs"
    Public Sub New()
        MyBase.New()
    End Sub

    Public Sub New(ByVal theNumCommande As String)
        Init(New DAeKPI.Tole().SelectWithNumCommande(theNumCommande))
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Init(ByVal theToleDc As DCeKPI.Tole)
        For Each aToleRow As DCeKPI.Tole.ToleRow In theToleDc._Tole.Rows
            Me.Add(New Tole(aToleRow))
        Next
    End Sub
#End Region

End Class