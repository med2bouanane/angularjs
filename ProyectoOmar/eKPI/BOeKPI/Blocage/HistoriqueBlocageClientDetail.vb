Public Class HistoriqueBlocageClientDetail
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.HistoriqueBlocageClientDetail, DCeKPI.HistoriqueBlocageClientDetail.HistoriqueBlocageClientDetailRow)

#Region "Déclarations"
    Private myHistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property IdHistoriqueBlocageClientDetail As Integer
        Get
            Return ProprieteIntegerGenerique("IdHistoriqueBlocageClientDetail")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdHistoriqueBlocageClientDetail") = value
        End Set
    End Property

    Public Property IdHistoriqueBlocageClient As Integer
        Get
            Return ProprieteIntegerGenerique("IdHistoriqueBlocageClient")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdHistoriqueBlocageClient") = value
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

    Public Property IdBlocageLivraison As Integer
        Get
            Return ProprieteIntegerGenerique("IdBlocageLivraison")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBlocageLivraison") = value
        End Set
    End Property
#End Region

#Region "Objets liés"
    Public ReadOnly Property HistoriqueBlocageClient As BOeKPI.HistoriqueBlocageClient
        Get
            If myHistoriqueBlocageClient Is Nothing Then
                myHistoriqueBlocageClient = New BOeKPI.HistoriqueBlocageClient(IdHistoriqueBlocageClient)
            End If
            Return myHistoriqueBlocageClient
        End Get
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.HistoriqueBlocageClientDetail)
    End Sub

    Friend Sub New(ByVal theHistoriqueBlocageClientDetailRow As DCeKPI.HistoriqueBlocageClientDetail.HistoriqueBlocageClientDetailRow)
        MyBase.New(theHistoriqueBlocageClientDetailRow)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Sauver()
        Dim aHistoriqueBlocageClientDetailDA As New DAeKPI.HistoriqueBlocageClientDetail
        aHistoriqueBlocageClientDetailDA.InsertUpdate(DataSetRow)
    End Sub
#End Region

End Class

Public Class HistoriqueBlocageClientDetailCollection
    Inherits List(Of HistoriqueBlocageClientDetail)

#Region "Constructeurs"
    Public Sub New()
        MyBase.New()
    End Sub

    Public Sub New(ByVal theIdHistoriqueBlocageClient As Integer)
        Init(New DAeKPI.HistoriqueBlocageClientDetail().SelectWithIdHistoriqueBlocageClient(theIdHistoriqueBlocageClient))
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub Init(ByVal theHistoriqueBlocageClientDetailDC As DCeKPI.HistoriqueBlocageClientDetail)
        For Each aRow As DCeKPI.HistoriqueBlocageClientDetail.HistoriqueBlocageClientDetailRow In theHistoriqueBlocageClientDetailDC._HistoriqueBlocageClientDetail.Rows
            Me.Add(New HistoriqueBlocageClientDetail(aRow))
        Next
    End Sub
#End Region

End Class