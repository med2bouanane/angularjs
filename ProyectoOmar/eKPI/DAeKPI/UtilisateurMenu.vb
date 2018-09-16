Public Class UtilisateurMenu
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
    Function SelectWithIdUtilisateur(ByVal theIdUtilisateur As Integer) As DCeKPI.UtilisateurMenu
        myCommand.Parameters.Clear()
        myCommand.CommandText = "UtilisateurMenu_SelectWithIdUtilisateur"
        myCommand.Parameters.AddWithValue("@IdUtilisateur", theIdUtilisateur)
        Return DirectCast(Fill(New DCeKPI.UtilisateurMenu), DCeKPI.UtilisateurMenu)
    End Function
#End Region
#Region "Insertion/Modifications"
    Sub InsertUpdate(ByVal theUtilisateurMenuRow As DCeKPI.UtilisateurMenu.UtilisateurMenuRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "UtilisateurMenu_InsertUpdate"
        If Not theUtilisateurMenuRow.IsIdUtilisateurMenuNull Then
            myCommand.Parameters.AddWithValue("@IdUtilisateurMenu", theUtilisateurMenuRow.IdUtilisateurMenu)
        End If
        myCommand.Parameters.AddWithValue("@IdUtilisateur", theUtilisateurMenuRow.IdUtilisateur)
        myCommand.Parameters.AddWithValue("@IdMenu", theUtilisateurMenuRow.IdMenu)
        ExecuteNonQuery()
    End Sub
#End Region




End Class
