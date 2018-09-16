Public Class BlocageLivraison
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.BlocageLivraison, DCeKPI.BlocageLivraison.BlocageLivraisonRow)

#Region "Déclarations"

    Private myLibelle As String = String.Empty

#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public Property IdBlocageLivraison As Integer
        Get
            Return ProprieteIntegerGenerique("IdBlocageLivraison")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBlocageLivraison") = value
        End Set
    End Property

    Public Property Code As String
        Get
            Return ProprieteStringGenerique("Code")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Code") = value
        End Set
    End Property

    Public Property Actif As Boolean
        Get
            Return ProprieteBooleanGenerique("Actif")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Actif") = value
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
                myLibelle = ProprieteLibelleMultilingue(Generiques.DaDataSetGenerique.DbSource.Certificat, "BlocageLivraison", IdBlocageLivraison)
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
        MyBase.New(New DCeKPI.BlocageLivraison)
    End Sub

    Public Sub New(ByVal theDataRow As DCeKPI.BlocageLivraison.BlocageLivraisonRow)
        MyBase.New(theDataRow)
    End Sub

    Public Sub New(ByVal theCode As String)
        MyBase.New((New DAeKPI.BlocageLivraison).SelectWithCode(theCode), True)
    End Sub

    Public Sub New(ByVal theIdBlocageLivraison As Integer)
        MyBase.New(New DAeKPI.BlocageLivraison().SelectWithIdBlocageLivraison(theIdBlocageLivraison), True)
    End Sub

#End Region

#Region "Fonctionnalités"
    Public Sub Sauver()
        Dim aBlocageLivraisonDA As New DAeKPI.BlocageLivraison
        aBlocageLivraisonDA.InsertUpdate(DataSetRow)
    End Sub
#End Region

End Class

Public Class BlocageLivraisonCollection
    Inherits List(Of BlocageLivraison)

#Region "Déclarations"


#End Region

#Region "Constructeurs"
    Public Sub New()
        Init(New DAeKPI.BlocageLivraison().SelectAll())
    End Sub
#End Region

#Region "Fonctionnalités"

    Private Sub Init(ByVal theDCBlocageLivraison As DCeKPI.BlocageLivraison)
        For Each aBlocageLivraison As DCeKPI.BlocageLivraison.BlocageLivraisonRow In theDCBlocageLivraison._BlocageLivraison.Rows
            Me.Add(New BlocageLivraison(aBlocageLivraison))
        Next
    End Sub

#End Region

End Class
