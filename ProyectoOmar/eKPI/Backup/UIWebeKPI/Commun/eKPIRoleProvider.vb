Imports System.Web.Security

Public Class eKPIRoleProvider
    Inherits RoleProvider

    Public Overrides Sub AddUsersToRoles(usernames() As String, roleNames() As String)

    End Sub

    Public Overrides Property ApplicationName As String
        Get

        End Get
        Set(value As String)

        End Set
    End Property

    Public Overrides Sub CreateRole(roleName As String)

    End Sub

    Public Overrides Function DeleteRole(roleName As String, throwOnPopulatedRole As Boolean) As Boolean

    End Function

    Public Overrides Function FindUsersInRole(roleName As String, usernameToMatch As String) As String()

    End Function

    Public Overrides Function GetAllRoles() As String()

    End Function

    Public Overrides Function GetRolesForUser(username As String) As String()

    End Function

    Public Overrides Function GetUsersInRole(roleName As String) As String()

    End Function

    Public Overrides Function IsUserInRole(username As String, roleName As String) As Boolean

    End Function

    Public Overrides Sub RemoveUsersFromRoles(usernames() As String, roleNames() As String)

    End Sub

    Public Overrides Function RoleExists(roleName As String) As Boolean

    End Function
End Class
