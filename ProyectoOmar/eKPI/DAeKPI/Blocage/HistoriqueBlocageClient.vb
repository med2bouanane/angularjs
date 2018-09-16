Public Class HistoriqueBlocageClient
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectAll() As DCeKPI.HistoriqueBlocageClient
        myCommand.Parameters.Clear()
        myCommand.CommandText = "HistoriqueBlocageClient_SelectAll"
        Return DirectCast(Fill(New DCeKPI.HistoriqueBlocageClient), DCeKPI.HistoriqueBlocageClient)
    End Function

    Public Function SelectWithIdHistoriqueBlocageClient(ByVal theIdHistoriqueBlocageClient As Integer) As DCeKPI.HistoriqueBlocageClient
        myCommand.Parameters.Clear()
        myCommand.CommandText = "HistoriqueBlocageClient_SelectWithIdHistoriqueBlocageClient"
        myCommand.Parameters.AddWithValue("@IdHistoriqueBlocageClient", theIdHistoriqueBlocageClient)
        Return DirectCast(Fill(New DCeKPI.HistoriqueBlocageClient), DCeKPI.HistoriqueBlocageClient)
    End Function
#End Region

#Region "Insertion/Modification"
    Public Sub InsertUpdate(ByRef theDataSetRow As DCeKPI.HistoriqueBlocageClient.HistoriqueBlocageClientRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "HistoriqueBlocageClient_InsertUpdate"

        If Not theDataSetRow.IsIdHistoriqueBlocageClientNull Then
            myCommand.Parameters.AddWithValue("@IdHistoriqueBlocageClient", theDataSetRow.IdHistoriqueBlocageClient)
        End If

        If Not theDataSetRow.IsIdUtilisateurNull Then
            myCommand.Parameters.AddWithValue("@IdUtilisateur", theDataSetRow.IdUtilisateur)
        End If

        If Not theDataSetRow.IsDateCreationNull Then
            myCommand.Parameters.AddWithValue("@DateCreation", theDataSetRow.DateCreation)
        End If

        If Not theDataSetRow.IsDescriptionNull Then
            myCommand.Parameters.AddWithValue("@Description", theDataSetRow.Description)
        End If

        If Not theDataSetRow.IsDateModificationNull Then
            myCommand.Parameters.AddWithValue("@DateModification", theDataSetRow.DateModification)
        End If

        theDataSetRow.IdHistoriqueBlocageClient = ExecuteScalarInteger()
    End Sub
#End Region

End Class
