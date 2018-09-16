Public Class IncotermSAP
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.IncotermSAP, DCeKPI.IncotermSAP.IncotermSAPRow)

#Region "Déclarations"
    Private myLibelle As String
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property IdIncotermSAP As Integer
        Get
            Return ProprieteIntegerGenerique("IdIncotermSAP")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdIncotermSAP") = value
        End Set
    End Property

    Public Property IDBackOffice As Integer
        Get
            Return ProprieteIntegerGenerique("IDBackOffice")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IDBackOffice") = value
        End Set
    End Property

    Public Property CodeIncotermSAP As String
        Get
            Return ProprieteStringGenerique("CodeIncotermSAP")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeIncotermSAP") = value
        End Set
    End Property

    Public Property CodeAffichage As String
        Get
            Return ProprieteStringGenerique("CodeAffichage")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeAffichage") = value
        End Set
    End Property

    Public Property Franco As Boolean
        Get
            Return ProprieteBooleanGenerique("Franco")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Franco") = value
        End Set
    End Property

    Public Property CodeIncotermSAP2 As String
        Get
            Return ProprieteStringGenerique("CodeIncotermSAP2")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeIncotermSAP2") = value
        End Set
    End Property

    Public Property Camion As Boolean
        Get
            Return ProprieteBooleanGenerique("Camion")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Camion") = value
        End Set
    End Property

    Public Property Wagon As Boolean
        Get
            Return ProprieteBooleanGenerique("Wagon")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Wagon") = value
        End Set
    End Property

    Public Property Allege As Boolean
        Get
            Return ProprieteBooleanGenerique("Allege")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Allege") = value
        End Set
    End Property

    Public Property Maritime As Boolean
        Get
            Return ProprieteBooleanGenerique("Maritime")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Maritime") = value
        End Set
    End Property

    Public Property Ordre As Integer
        Get
            Return ProprieteIntegerGenerique("Ordre")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("Ordre") = value
        End Set
    End Property

    Public Property Supprime As Boolean
        Get
            Return ProprieteBooleanGenerique("Supprime")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Supprime") = value
        End Set
    End Property

    Public Property Aerien As Boolean
        Get
            Return ProprieteBooleanGenerique("Aerien")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Aerien") = value
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
#End Region

#Region "Objets liés"
    Public Property Libelle As String
        Get
            If String.IsNullOrEmpty(myLibelle) Then
                myLibelle = ProprieteLibelleMultilingue(Generiques.DaDataSetGenerique.DbSource.Frontoffice, "IncotermSAP", IdIncotermSAP)
            End If
            Return myLibelle
        End Get
        Set(value As String)
            myLibelle = value
        End Set
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.IncotermSAP)
    End Sub

    Public Sub New(ByVal theIdIncoterm As Integer)
        MyBase.New(New DAeKPI.IncotermSAP().SelectWithIdIncotermSAP(theIdIncoterm), True)
    End Sub

    Friend Sub New(ByVal theIncotermSAPRow As DCeKPI.IncotermSAP.IncotermSAPRow)
        MyBase.New(theIncotermSAPRow)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Sauver()
        Dim aIncotermSAPDA As New DAeKPI.IncotermSAP
        aIncotermSAPDA.InsertUpdate(DataSetRow)
    End Sub
#End Region

End Class

Public Class IncotermSAPCollection
    Inherits List(Of IncotermSAP)

#Region "Constructeurs"
    Public Sub New()
        Init(New DAeKPI.IncotermSAP().SelectAll())
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub Init(ByVal theIncotermSAPDc As DCeKPI.IncotermSAP)
        For Each aIncotermSAPRow As DCeKPI.IncotermSAP.IncotermSAPRow In theIncotermSAPDc._IncotermSAP.Rows
            Me.Add(New BOeKPI.IncotermSAP(aIncotermSAPRow))
        Next
    End Sub
#End Region

End Class