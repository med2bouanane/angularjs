Public Class UtilisateurMenu
#Region "Déclarations"
    Private myUtilisateurMenuRow As DCeKPI.UtilisateurMenu.UtilisateurMenuRow

#End Region

#Region "Propriétés"

    Sub New(ByVal theMenuRow As DCeKPI.UtilisateurMenu.UtilisateurMenuRow)

        myUtilisateurMenuRow = theMenuRow
    End Sub

    Public Property IdUtilisateur() As Integer
        Get
            Return myUtilisateurMenuRow.IdUtilisateur
        End Get
        Set(ByVal value As Integer)
            myUtilisateurMenuRow.IdUtilisateur = value
        End Set
    End Property
    Public Property IdMenu() As Integer
        Get
            If Not myUtilisateurMenuRow Is Nothing Then
                Return myUtilisateurMenuRow.IdMenu
            Else
                Return 0
            End If

        End Get
        Set(ByVal value As Integer)
            myUtilisateurMenuRow.IdMenu = value
        End Set
    End Property
#End Region

#Region "Constructeurs"

    Public Sub New(ByVal theIdUtilisateur As Integer, ByVal theIdMenu As Integer)
        myUtilisateurMenuRow = New DCeKPI.UtilisateurMenu()._UtilisateurMenu.NewUtilisateurMenuRow
        myUtilisateurMenuRow.IdMenu = theIdMenu
        myUtilisateurMenuRow.IdUtilisateur = theIdUtilisateur
        myUtilisateurMenuRow.SetIdUtilisateurMenuNull()
    End Sub


    Public Sub New(ByVal theIdUtilisateur As Integer)
        Init(New DAeKPI.UtilisateurMenu().SelectWithIdUtilisateur(theIdUtilisateur))
    End Sub
#End Region


#Region "Fonctionalités"

    Public Sub Sauver()
        Dim aDAUtilisateurMenu As New DAeKPI.UtilisateurMenu()
        aDAUtilisateurMenu.InsertUpdate(myUtilisateurMenuRow)
    End Sub

    Private Sub Init(ByVal theUtilisateurMenu As DCeKPI.UtilisateurMenu)
        If theUtilisateurMenu._UtilisateurMenu.Rows.Count = 1 Then
            myUtilisateurMenuRow = theUtilisateurMenu._UtilisateurMenu.Item(0)
        End If
    End Sub
#End Region






End Class


Public Class UtilisateurMenuCollection
    Inherits List(Of UtilisateurMenu)

#Region "Declarations"

#End Region

#Region "Constructeurs"

#End Region

#Region "Fonctionalités"
    Private Sub Init(ByVal theUtilisateurMenu As DCeKPI.UtilisateurMenu)
        Dim aUtilisateurMenu As BOeKPI.UtilisateurMenu
        For Each aMenuRow As DCeKPI.UtilisateurMenu.UtilisateurMenuRow In theUtilisateurMenu._UtilisateurMenu.Rows
            aUtilisateurMenu = New UtilisateurMenu(aMenuRow)
            Me.Add(aUtilisateurMenu)
        Next
    End Sub
#End Region






End Class
