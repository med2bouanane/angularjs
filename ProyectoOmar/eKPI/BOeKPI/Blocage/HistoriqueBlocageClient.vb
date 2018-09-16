Public Class HistoriqueBlocageClient
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.HistoriqueBlocageClient, DCeKPI.HistoriqueBlocageClient.HistoriqueBlocageClientRow)

#Region "Déclarations"
    Private myUtilisateur As BOeKPI.Utilisateur
    Private myDetails As BOeKPI.HistoriqueBlocageClientDetailCollection
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property IdHistoriqueBlocageClient As Integer
        Get
            Return ProprieteIntegerGenerique("IdHistoriqueBlocageClient")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdHistoriqueBlocageClient") = value
        End Set
    End Property

    Public Property IdUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("IdUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdUtilisateur") = value
        End Set
    End Property

    Public Property DateCreation As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateCreation")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateCreation") = value
        End Set
    End Property

    Public Property Description As String
        Get
            Return ProprieteStringGenerique("Description")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Description") = value
        End Set
    End Property

    Public Property DateModification As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateModification")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateModification") = value
        End Set
    End Property
#End Region

#Region "Objets liés"
    Public ReadOnly Property Utilisateur As BOeKPI.Utilisateur
        Get
            If myUtilisateur Is Nothing Then
                myUtilisateur = New BOeKPI.Utilisateur(IdUtilisateur)
            End If
            Return myUtilisateur
        End Get
    End Property

    Public ReadOnly Property Details As BOeKPI.HistoriqueBlocageClientDetailCollection
        Get
            If myDetails Is Nothing Then
                myDetails = New BOeKPI.HistoriqueBlocageClientDetailCollection(IdHistoriqueBlocageClient)
            End If
            Return myDetails
        End Get
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.HistoriqueBlocageClient)
    End Sub

    Friend Sub New(ByVal theHistoriqueBlocageClientRow As DCeKPI.HistoriqueBlocageClient.HistoriqueBlocageClientRow)
        MyBase.New(theHistoriqueBlocageClientRow)
    End Sub

    Public Sub New(ByVal theIdHistoriqueBlocageClient As Integer)
        MyBase.New(New DAeKPI.HistoriqueBlocageClient().SelectWithIdHistoriqueBlocageClient(theIdHistoriqueBlocageClient), True)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Sauver()
        Dim aHistoriqueBlocageClientDA As New DAeKPI.HistoriqueBlocageClient
        aHistoriqueBlocageClientDA.InsertUpdate(DataSetRow)
    End Sub

    Public Sub AjouterIncoterm(ByVal theIdIncotermSAP As Integer)
        Dim aHistoriqueBlocageClientDetail As New BOeKPI.HistoriqueBlocageClientDetail
        aHistoriqueBlocageClientDetail.IdHistoriqueBlocageClient = IdHistoriqueBlocageClient
        aHistoriqueBlocageClientDetail.IdIncotermSAP = theIdIncotermSAP
        aHistoriqueBlocageClientDetail.Sauver()
    End Sub

    Public Sub AjouterBlocageLivraison(ByVal theIdBlocageLivraison As Integer)
        Dim aHistoriqueBlocageClientDetail As New BOeKPI.HistoriqueBlocageClientDetail
        aHistoriqueBlocageClientDetail.IdHistoriqueBlocageClient = IdHistoriqueBlocageClient
        aHistoriqueBlocageClientDetail.IdBlocageLivraison = theIdBlocageLivraison
        aHistoriqueBlocageClientDetail.Sauver()
    End Sub
#End Region

End Class

Public Class HistoriqueBlocageClientCollection
    Inherits List(Of HistoriqueBlocageClient)

#Region "Constructeurs"
    Public Sub New()
        Init(New DAeKPI.HistoriqueBlocageClient().SelectAll)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Init(ByVal theHistoriqueBlocageClientDC As DCeKPI.HistoriqueBlocageClient)
        For Each aHistoriqueBlocageClientRow As DCeKPI.HistoriqueBlocageClient.HistoriqueBlocageClientRow In theHistoriqueBlocageClientDC._HistoriqueBlocageClient.Rows
            Me.Add(New HistoriqueBlocageClient(aHistoriqueBlocageClientRow))
        Next
    End Sub
#End Region

End Class