Public Class Autorisation
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

    Function SelectWithIdUtilisateur(ByVal theIdUtilisateur As Integer) As DCeKPI.Autorisation
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Autorisation_SelectWithIdUtilisateur"
        myCommand.Parameters.AddWithValue("@IdUtilisateur", theIdUtilisateur)
        Return DirectCast(Fill(New DCeKPI.Autorisation), DCeKPI.Autorisation)
    End Function

    Function SelectWithNomAutorisation(ByVal theNomUtilisateur As String) As DCeKPI.Autorisation
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Autorisation_SelectWithNomAutorisation"
        myCommand.Parameters.AddWithValue("@NomAutorisation", theNomUtilisateur)
        Return DirectCast(Fill(New DCeKPI.Autorisation), DCeKPI.Autorisation)
    End Function
    'Function SelectWithIdGroupe(ByVal theIdGroupe As Integer) As DCeKPI.Autorisation
    '    'A utiliser plutard
    '    Return Nothing
    'End Function

    Function SelectWithIdAutorisation(ByVal theIdAutorisation As Integer) As DCeKPI.Autorisation
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Autorisation_SelectWithIdAutorisation"
        myCommand.Parameters.AddWithValue("@IdAutorisation", theIdAutorisation)
        Return DirectCast(Fill(New DCeKPI.Autorisation), DCeKPI.Autorisation)
    End Function

#End Region

#Region "Insertions/Modifications"

#End Region

#Region "Suppresstions"

#End Region






End Class

