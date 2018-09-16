Public Class Autorisation

#Region "Declarations"
    Private myAutorisationRow As DCeKPI.Autorisation.AutorisationRow
    Private myUtilisateurCollection As UtilisateurCollection
#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public ReadOnly Property IdAutorisation() As Integer
        Get
            Return myAutorisationRow.IdAutorisation
        End Get
    End Property

    Public Property Nom() As String
        Get
            Return myAutorisationRow.Nom
        End Get
        Set(ByVal Value As String)
            myAutorisationRow.Nom = Value
        End Set
    End Property

    Public Property Description() As String
        Get
            Return myAutorisationRow.Description
        End Get
        Set(ByVal Value As String)
            myAutorisationRow.Description = Value
        End Set
    End Property

    Public Property IdApplication() As Integer
        Get
            Return myAutorisationRow.IdApplication
        End Get
        Set(ByVal Value As Integer)
            myAutorisationRow.IdApplication = Value
        End Set
    End Property

    Public Property Actif() As Boolean
        Get
            Return myAutorisationRow.Actif
        End Get
        Set(ByVal Value As Boolean)
            myAutorisationRow.Actif = Value
        End Set
    End Property

#End Region

#Region "Objets liés"

    Public Property Utilisateurs() As UtilisateurCollection
        Get
            Return New BOeKPI.UtilisateurCollection(Me.IdAutorisation, UtilisateurCollection.TypeChaineEnum.Autorisation)
        End Get
        Set(ByVal theValue As UtilisateurCollection)
            myUtilisateurCollection = theValue
        End Set
    End Property

#End Region

#End Region

#Region "Constructeurs"

    Friend Sub New(ByVal theAutorisationRow As DCeKPI.Autorisation.AutorisationRow)
        myAutorisationRow = theAutorisationRow
    End Sub

    Public Sub New(ByVal theIdAutorisation As Integer)
        Dim aDCAutorisation = New DAeKPI.Autorisation().SelectWithIdAutorisation(theIdAutorisation)
        If aDCAutorisation._Autorisation.Count = 1 Then
            myAutorisationRow = aDCAutorisation._Autorisation(0)
        End If
    End Sub

    Public Sub New(ByVal theNomAutorisation As String)
        Dim aDCAutorisation = New DAeKPI.Autorisation().SelectWithNomAutorisation(theNomAutorisation)
        If aDCAutorisation._Autorisation.Count = 1 Then
            myAutorisationRow = aDCAutorisation._Autorisation(0)
        End If
    End Sub

#End Region

End Class

Public Class AutorisationCollection
    Inherits List(Of Autorisation)

#Region "Declarations"
    Enum TypeChaine
        Role
        Utilisateur
        Autorisation
    End Enum
#End Region

#Region "Constructeurs"

    Sub New(ByVal theId As Integer, ByVal theTypeId As TypeChaine)
        If theTypeId = TypeChaine.Role Then
            'Desactivé
            'Init(New DAeKPI.Autorisation().SelectWithIdRole(theId))
        ElseIf theTypeId = TypeChaine.Utilisateur Then
            Init(New DAeKPI.Autorisation().SelectWithIdUtilisateur(theId))
        Else
            Init(New DAeKPI.Autorisation().SelectWithIdAutorisation(theId))
        End If

    End Sub

    Private Sub Init(ByVal theDCAutorisation As DCeKPI.Autorisation)
        Me.Clear()
        For Each aAutorisationRow As DCeKPI.Autorisation.AutorisationRow In theDCAutorisation._Autorisation.Rows
            Me.Add(New Autorisation(aAutorisationRow))
        Next
    End Sub

#End Region

#Region "Fonctionnalités"


#End Region

    Function ContenirAutorizaction(ByVal theAutorisation As Autorisation) As Boolean
        For Each aAutorizaction In Me
            If aAutorizaction.IdAutorisation = theAutorisation.IdAutorisation Then
                Return True
            End If
        Next
        Return False
    End Function

End Class