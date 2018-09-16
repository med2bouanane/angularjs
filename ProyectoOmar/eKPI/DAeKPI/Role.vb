Public Class Role
    Inherits DataAccessBase.Base

#Region "Constructeurs"

    Public Sub New()
        MyBase.New()
        If ConnectionString = String.Empty Then
            ConnectionString = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringWorkflow")
        End If
    End Sub

#End Region

#Region "Selections"

    Public Function SelectWithIdUtilisateur(ByVal theIdUtilisateur As Integer) As DCeKPI.Role
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Role_SelectWithIdUtilisateur"
        myCommand.Parameters.AddWithValue("@IdUtilisateur", theIdUtilisateur)
        Return DirectCast(Fill(New DCeKPI.Role), DCeKPI.Role)
    End Function

    Public Function SelectWithIdRole(ByVal theIdRle As Integer) As DCeKPI.Role
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Role_SelectWithIdRole"
        myCommand.Parameters.AddWithValue("@IdRole", theIdRle)
        Return DirectCast(Fill(New DCeKPI.Role), DCeKPI.Role)
    End Function

    Public Function SelectWithNomRole(ByVal theNomRole As String) As DCeKPI.Role
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Role_SelectWithNomRole"
        myCommand.Parameters.AddWithValue("@NomRole", theNomRole)
        Return DirectCast(Fill(New DCeKPI.Role), DCeKPI.Role)
    End Function

    Public Function SelectWithEnfantIdGroup(ByVal theIdRole As Integer) As DCeKPI.Role
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Role_SelectWithIdRoleEnfant"
        myCommand.Parameters.AddWithValue("@IdRoleEnfant", theIdRole)
        Return DirectCast(Fill(New DCeKPI.Role), DCeKPI.Role)
    End Function

    Public Function SelectWithParentIdGroup(ByVal theIdRole As Integer) As DCeKPI.Role
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Role_SelectWithIdRoleParent"
        myCommand.Parameters.AddWithValue("@IdRoleParent", theIdRole)
        Return DirectCast(Fill(New DCeKPI.Role), DCeKPI.Role)
    End Function


#End Region

#Region "Insertions/Modifications"

#End Region

#Region "Suppresstions"

#End Region


End Class
