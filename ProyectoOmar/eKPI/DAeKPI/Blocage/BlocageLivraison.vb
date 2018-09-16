Public Class BlocageLivraison
    Inherits DataAccessBase.Base

#Region "Constructeur"

    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub

#End Region

#Region "Sélection"

    Public Function SelectWithCode(ByVal theCode As String) As DCeKPI.BlocageLivraison
        myCommand.Parameters.Clear()
        myCommand.CommandText = "BlocageLivraison_SelectWithCode"
        myCommand.Parameters.AddWithValue("Code", theCode)
        Return DirectCast(Fill(New DCeKPI.BlocageLivraison), DCeKPI.BlocageLivraison)
    End Function

    Public Function SelectAll() As DCeKPI.BlocageLivraison
        myCommand.Parameters.Clear()
        myCommand.CommandText = "BlocageLivraison_SelectAll"
        Return DirectCast(Fill(New DCeKPI.BlocageLivraison), DCeKPI.BlocageLivraison)
    End Function

    Public Function SelectWithIdBlocageLivraison(ByVal theIdBlocageLivraison As Integer) As DCeKPI.BlocageLivraison
        myCommand.Parameters.Clear()
        myCommand.CommandText = "BlocageLivraison_SelectWithIdBlocageLivraison"
        myCommand.Parameters.AddWithValue("@IDBlocageLivraison", theIdBlocageLivraison)
        Return DirectCast(Fill(New DCeKPI.BlocageLivraison), DCeKPI.BlocageLivraison)
    End Function

#End Region

#Region "Insertion/Modification"
    Public Sub InsertUpdate(ByRef theBlocageLivraisonRow As DCeKPI.BlocageLivraison.BlocageLivraisonRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "BlocageLivraison_InsertUpdate"

        If theBlocageLivraisonRow.IdBlocageLivraison <> 0 Then
            myCommand.Parameters.AddWithValue("@IdBlocageLivraison", theBlocageLivraisonRow.IdBlocageLivraison)
        End If
        myCommand.Parameters.AddWithValue("@Code", theBlocageLivraisonRow.Code)
        myCommand.Parameters.AddWithValue("@Actif", theBlocageLivraisonRow.Actif)
        myCommand.Parameters.AddWithValue("@BlocageClient", theBlocageLivraisonRow.BlocageClient)

        theBlocageLivraisonRow.IdBlocageLivraison = ExecuteScalarInteger()
    End Sub
#End Region

#Region "Suppression"

#End Region

End Class
