Public Class Utilisateur
    Inherits BOGapCommerce.Utilisateur

#Region "Déclarations"

    Private myRoles As BOeKPI.RoleCollection
    Private myHierarchieRoles As BOeKPI.RoleCollection
    Private myAutorisations As BOeKPI.AutorisationCollection
    Private myMenus As BOeKPI.MenuCollection
    Public Enum TypeChaine
        Email = 1
        Identifiant = 2
    End Enum

#End Region

#Region "Propriétés"

#Region "Accesseurs"


#End Region

#Region "Objets liés"

    Public Property Roles As BOeKPI.RoleCollection
        Get
            If myRoles Is Nothing Then
                myRoles = New BOeKPI.RoleCollection(Me.IDUtilisateur)
            End If
            Return myRoles
        End Get
        Set(theValue As BOeKPI.RoleCollection)
            myRoles = theValue
        End Set
    End Property

    'Public Property HierarchieRoles As BOeKPI.RoleCollection
    '    Get
    '        If myHierarchieRoles Is Nothing Then
    '            myHierarchieRoles = New BOeKPI.RoleCollection(Me.IDUtilisateur)
    '        End If
    '        Return myHierarchieRoles
    '    End Get
    '    Set(theValue As BOeKPI.RoleCollection)
    '        myHierarchieRoles = theValue
    '    End Set
    'End Property

    Public Property Autorisations As BOeKPI.AutorisationCollection
        Get
            If myAutorisations Is Nothing Then
                myAutorisations = New BOeKPI.AutorisationCollection(Me.IDUtilisateur, AutorisationCollection.TypeChaine.Utilisateur)
            End If
            Return myAutorisations
        End Get
        Set(theValue As BOeKPI.AutorisationCollection)
            myAutorisations = theValue
        End Set
    End Property

    Public Property Menus(ByVal theIdApplication As Integer) As BOeKPI.MenuCollection

        Get
            If myMenus Is Nothing Then
                myMenus = New BOeKPI.MenuCollection(theIdApplication, Me)
            End If
            Return myMenus
        End Get
        Set(theValue As BOeKPI.MenuCollection)
            myMenus = theValue
        End Set
    End Property

#End Region

#End Region

#Region "Constructeurs"

    Public Sub New(ByVal theIDUtilisateur As Integer, Optional ByVal thePeutEtreInactif As PeutEtreInactif = PeutEtreInactif.Non)
        MyBase.New(theIDUtilisateur, thePeutEtreInactif)
    End Sub

    Public Sub New()
        myUtilisateurRow = New DCGapCommerce.Utilisateur()._Utilisateur.NewUtilisateurRow
    End Sub

    Public Sub New(ByVal theIdentifiant As String, ByVal theTypeChaine As TypeChaine)
        Select Case theTypeChaine
            Case TypeChaine.Email
                Dim aDaUtilisateur As New DAGapCommerce.Utilisateur
                Init(aDaUtilisateur.SelectWithAdresseEmail(theIdentifiant, False)) 'T14082
            Case TypeChaine.Identifiant
                Dim aUtilisateurDA As New DAeKPI.Utilisateur
                Init(aUtilisateurDA.SelectWithIdentifiant(theIdentifiant))
        End Select
    End Sub

    Sub New(ByVal theIdentifiant As String, typeGuid As TypeGuid)
        MyBase.New(theIdentifiant, typeGuid)
    End Sub

    Friend Sub New(ByVal theUtilisateurRow As DCGapCommerce.Utilisateur.UtilisateurRow)
        myUtilisateurRow = theUtilisateurRow
    End Sub


#End Region

#Region "Fonctionalité"

    Private Sub Init(ByVal theUtilisateurDC As DCGapCommerce.Utilisateur)
        If theUtilisateurDC._Utilisateur.Rows.Count = 1 Then
            myUtilisateurRow = theUtilisateurDC._Utilisateur.Item(0)
        ElseIf theUtilisateurDC._Utilisateur.Rows.Count = 0 Then
            Throw New BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurNonExistant
        Else
            Throw New BOGapCommerce.GapCommerceException.Utilisateur.UtilisateurMultiples
        End If
    End Sub

    Public Sub MettreAJourMotDePasse()
        Dim aDAUtilisateur As New DAeKPI.Utilisateur()
        aDAUtilisateur.UpdateMotDePasse(Me.IDUtilisateur, Me.MotPasse, Me.DateModificationMotPasse)
    End Sub
#End Region

End Class

Public Class UtilisateurCollection
    Inherits List(Of Utilisateur)

#Region "Declarations"
    Enum TypeChaineEnum
        Role
        Autorisation
    End Enum

#End Region

#Region "Constructeurs"

    Public Sub New(ByVal theId As Integer, ByVal theTypeChaineEnum As TypeChaineEnum)
        If theTypeChaineEnum = TypeChaineEnum.Role Then
            Init(New DAeKPI.Utilisateur().SelectWithIdRole(theId))
        Else
            Init(New DAeKPI.Utilisateur().SelectWithIdAutorisation(theId))
        End If

    End Sub

    Private Sub Init(ByVal theDCUtilisateur As DCGapCommerce.Utilisateur)
        Me.Clear()
        For Each aUtilisateurRow As DCGapCommerce.Utilisateur.UtilisateurRow In theDCUtilisateur._Utilisateur.Rows
            Me.Add(New Utilisateur(aUtilisateurRow))
        Next
    End Sub

#End Region

#Region "Fonctionnalités"



#End Region

End Class

