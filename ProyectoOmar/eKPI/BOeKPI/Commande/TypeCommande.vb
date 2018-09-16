Public Class TypeCommande
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.TypeCommande, DCeKPI.TypeCommande.TypeCommandeRow)

#Region "Déclarations"


#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public Property IdTypeCommande As Integer
        Get
            Return ProprieteIntegerGenerique("IdTypeCommande")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdTypeCommande") = value
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

    Public Property Description As String
        Get
            Return ProprieteStringGenerique("Description")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Description") = value
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

#End Region

#Region "Objets liés"
   
#End Region

#End Region

#Region "Constructeurs"

    Public Sub New()
        MyBase.New(New DCeKPI.TypeCommande)
    End Sub

    Public Sub New(ByVal theCode As String)
        MyBase.New(New DAeKPI.TypeCommande().SelectWithCode(theCode), True)
    End Sub

    Friend Sub New(ByVal theTypeCommandeRow As DCeKPI.TypeCommande.TypeCommandeRow)
        MyBase.New(theTypeCommandeRow)
    End Sub

#End Region

#Region "Fonctionnalités"

#End Region

End Class

Public Class TypeCommandeCollection
    Inherits List(Of TypeCommande)

#Region "Constructeurs"
  
#End Region

#Region "Fonctionnalités"

    Private Sub Init(ByVal theDCTypeCommande As DCeKPI.TypeCommande)
        For Each aTypeCommande As DCeKPI.TypeCommande.TypeCommandeRow In theDCTypeCommande._TypeCommande.Rows
            Me.Add(New TypeCommande(aTypeCommande))
        Next
    End Sub

#End Region

End Class