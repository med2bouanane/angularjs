
Public Class Role

#Region "Déclarations"
    Private myRoleRow As DCeKPI.Role.RoleRow
    Private myAutorisations As BOeKPI.AutorisationCollection
    Private myRolesParents As BOeKPI.RoleCollection
    Private myRolesEnfants As BOeKPI.RoleCollection
#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public ReadOnly Property IdRole() As Integer
        Get
            Return myRoleRow.IdRole
        End Get
    End Property

    Public Property Nom() As String
        Get
            Return myRoleRow.Nom
        End Get
        Set(ByVal Value As String)
            myRoleRow.Nom = Value
        End Set
    End Property

    Public Property Description() As String
        Get
            Return myRoleRow.Description
        End Get
        Set(ByVal Value As String)
            myRoleRow.Description = Value
        End Set
    End Property

    Public Property Actif() As Boolean
        Get
            Return myRoleRow.Actif
        End Get
        Set(ByVal Value As Boolean)
            myRoleRow.Actif = Value
        End Set
    End Property

#End Region

#Region "Objets liés"

    Public Property Autorisations As BOeKPI.AutorisationCollection
        Get
            If myAutorisations Is Nothing Then
                myAutorisations = New BOeKPI.AutorisationCollection(Me.IdRole, AutorisationCollection.TypeChaine.Role)
            End If
            Return myAutorisations
        End Get
        Set(theValue As BOeKPI.AutorisationCollection)
            myAutorisations = theValue
        End Set
    End Property

    Public Property RolesEnfants As BOeKPI.RoleCollection
        Get
            If myRolesParents Is Nothing Then
                myRolesParents = New BOeKPI.RoleCollection(Me.IdRole, RoleCollection.TypeChaine.RoleParent)
            End If
            Return myRolesParents
        End Get
        Set(theValue As BOeKPI.RoleCollection)
            myRolesParents = theValue
        End Set
    End Property

    Public Property RolesParent As BOeKPI.RoleCollection
        Get
            If myRolesEnfants Is Nothing Then
                myRolesEnfants = New BOeKPI.RoleCollection(Me.IdRole, RoleCollection.TypeChaine.RoleEnfants)
            End If
            Return myRolesEnfants
        End Get
        Set(theValue As BOeKPI.RoleCollection)
            myRolesEnfants = theValue
        End Set
    End Property

#End Region
#End Region

#Region "Constructeurs"

    Friend Sub New(ByVal theRoleRow As DCeKPI.Role.RoleRow)
        myRoleRow = theRoleRow
    End Sub


    Public Sub New(ByVal theIdGroup As Integer)
        Dim DCRole = New DAeKPI.Role().SelectWithIdRole(theIdGroup)
        If DCRole._Role.Count = 1 Then
            myRoleRow = DCRole._Role(0)
        End If
    End Sub

    Public Sub New(ByVal theNomGroup As String)
        Dim DCRole = New DAeKPI.Role().SelectWithNomRole(theNomGroup)
        If DCRole._Role.Count = 1 Then
            myRoleRow = DCRole._Role(0)
        End If
    End Sub

#End Region

#Region "Fonctionalités"

    Friend Function ContenirRole(ByVal theRole As BOeKPI.Role) As Boolean
        'Si le Role n'a pas de Roles enfants, on compare l'identificateur du Role a chercher avec celui de la clase
        If Me.RolesEnfants.Count = 0 Then
            Return Me.IdRole = theRole.IdRole
        Else
            'Si le Role a de Roles enfants, on compare l'identificateur du Role a chercher avec celui de la clase, puis dans les Roles enfants
            Return Me.IdRole = theRole.IdRole OrElse Me.RolesEnfants.ContenirRole(theRole)
        End If
    End Function

#End Region

End Class

Public Class RoleCollection
    Inherits List(Of Role)

#Region "Declarations"
    Enum TypeChaine
        RoleParent
        RoleEnfants
    End Enum
#End Region

#Region "Constructeurs"


    Friend Sub New(ByVal theIdUtilisateur As Integer)
        Init(New DAeKPI.Role().SelectWithIdUtilisateur(theIdUtilisateur))
    End Sub

    Friend Sub New(ByVal theIdRole As Integer, theTypeChaine As TypeChaine)
        If theTypeChaine = TypeChaine.RoleParent Then
            'Obtenir Parents
            Init(New DAeKPI.Role().SelectWithParentIdGroup(theIdRole))
        Else
            'Obtenir Enfants
            Init(New DAeKPI.Role().SelectWithEnfantIdGroup(theIdRole))
        End If

    End Sub

    Private Sub Init(ByVal theDCRole As DCeKPI.Role)
        Me.Clear()
        For Each aRoleRow As DCeKPI.Role.RoleRow In theDCRole._Role.Rows
            Me.Add(New Role(aRoleRow))
        Next
    End Sub

#End Region

#Region "Fonctionnalités"

    Public Function ContenirRole(theRole As BOeKPI.Role) As Boolean
        For Each aGroup In Me
            If aGroup.ContenirRole(theRole) Then
                Return True
            End If
        Next
        Return False
    End Function

#End Region

End Class


