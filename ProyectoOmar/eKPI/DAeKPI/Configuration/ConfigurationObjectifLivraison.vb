Public Class ConfigurationObjectifLivraison
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectAll() As DCeKPI.ConfigurationObjectifLivraison
        myCommand.Parameters.Clear()
        myCommand.CommandText = "ConfigurationObjectifLivraison_SelectAll"
        Return DirectCast(Fill(New DCeKPI.ConfigurationObjectifLivraison), DCeKPI.ConfigurationObjectifLivraison)
    End Function

    Public Function SelectWithIdConfigurationObjectifLivraison(ByVal theIdConfigurationObjectifLivraison As Integer) As DCeKPI.ConfigurationObjectifLivraison
        myCommand.Parameters.Clear()
        myCommand.CommandText = "ConfigurationObjectifLivraison_SelectWithIdConfigurationObjectifLivraison"
        myCommand.Parameters.AddWithValue("@IdConfigurationObjectifLivraison", theIdConfigurationObjectifLivraison)
        Return DirectCast(Fill(New DCeKPI.ConfigurationObjectifLivraison), DCeKPI.ConfigurationObjectifLivraison)
    End Function
#End Region

#Region "Insertion/Modification"
    Public Sub InsertUpdate(ByRef theConfigurationObjectifLivraisonRow As DCeKPI.ConfigurationObjectifLivraison.ConfigurationObjectifLivraisonRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "ConfigurationObjectifLivraison_InsertUpdate"

        If Not theConfigurationObjectifLivraisonRow.IsIdConfigurationObjectifLivraisonNull Then
            myCommand.Parameters.AddWithValue("@IdConfigurationObjectifLivraison", theConfigurationObjectifLivraisonRow.IdConfigurationObjectifLivraison)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsIdUtilisateurNull Then
            myCommand.Parameters.AddWithValue("@IdUtilisateur", theConfigurationObjectifLivraisonRow.IdUtilisateur)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsDateCreationNull Then
            myCommand.Parameters.AddWithValue("@DateCreation", theConfigurationObjectifLivraisonRow.DateCreation)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsDescriptionNull Then
            myCommand.Parameters.AddWithValue("@Description", theConfigurationObjectifLivraisonRow.Description)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsCommandeStandardMoinsDeuxPlusZeroNull Then
            myCommand.Parameters.AddWithValue("@CommandeStandardMoinsDeuxPlusZero", theConfigurationObjectifLivraisonRow.CommandeStandardMoinsDeuxPlusZero)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsCommandeStandardMoinsDeuxPlusDeuxNull Then
            myCommand.Parameters.AddWithValue("@CommandeStandardMoinsDeuxPlusDeux", theConfigurationObjectifLivraisonRow.CommandeStandardMoinsDeuxPlusDeux)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsCommandePackMoinsZeroPlusZeroNull Then
            myCommand.Parameters.AddWithValue("@CommandePackMoinsZeroPlusZero", theConfigurationObjectifLivraisonRow.CommandePackMoinsZeroPlusZero)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsCommandePackMoinsZeroPlusUnNull Then
            myCommand.Parameters.AddWithValue("@CommandePackMoinsZeroPlusUn", theConfigurationObjectifLivraisonRow.CommandePackMoinsZeroPlusUn)
        End If

        If Not theConfigurationObjectifLivraisonRow.IsActifNull Then
            myCommand.Parameters.AddWithValue("@Actif", theConfigurationObjectifLivraisonRow.Actif)
        End If

        theConfigurationObjectifLivraisonRow.IdConfigurationObjectifLivraison = ExecuteScalarInteger()
    End Sub
#End Region

End Class
