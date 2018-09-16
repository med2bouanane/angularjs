Public Class Utilisateur
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

    Public Function SelectWithIdentifiant(ByVal theIdentifiant As String) As DCGapCommerce.Utilisateur
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Utilisateur_SelectWithIdentifiant"
        myCommand.Parameters.AddWithValue("@Identifiant", theIdentifiant)
        Return DirectCast(Fill(New DCGapCommerce.Utilisateur), DCGapCommerce.Utilisateur)
    End Function

    Function SelectWithIdRole(ByVal theIdRole As Integer) As DCGapCommerce.Utilisateur
        myCommand.CommandText = "Utilisateur_SelectWithIDRole"
        myCommand.Parameters.Clear()
        myCommand.Parameters.AddWithValue("@IDRole", theIdRole)
        Return DirectCast(Fill(New DCGapCommerce.Utilisateur), DCGapCommerce.Utilisateur)
    End Function

    Function SelectWithIdAutorisation(ByVal theIdAutorisation As Integer) As DCGapCommerce.Utilisateur
        myCommand.CommandText = "Utilisateur_SelectWithIdAutorisation"
        myCommand.Parameters.Clear()
        myCommand.Parameters.AddWithValue("@IdAutorisation", theIdAutorisation)
        Return DirectCast(Fill(New DCGapCommerce.Utilisateur), DCGapCommerce.Utilisateur)
    End Function

#End Region

#Region "Insertions/Modifications"

    Public Sub UpdateMotDePasse(ByVal theIDUtilisateur As Integer, ByVal theMotDePasse As String, ByVal theDateModificationMotDePasse As DateTime)
        myCommand.CommandText = "Utilisateur_UpdateMotDePasse"
        myCommand.Parameters.Clear()
        myCommand.Parameters.AddWithValue("@IDUtilisateur", theIDUtilisateur)
        myCommand.Parameters.AddWithValue("@NouveauPassword", theMotDePasse)
        myCommand.Parameters.AddWithValue("@DateModificationMotPasse", theDateModificationMotDePasse)
        ExecuteNonQuery()
    End Sub

#End Region

#Region "Suppresstions"

#End Region










End Class
