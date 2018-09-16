Public Class HistoriqueBlocageClientDetail
    Inherits DataAccessBase.Base

#Region "Constructeurs"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectWithIdHistoriqueBlocageClient(ByVal theIdHistoriqueBlocageClient As Integer) As DCeKPI.HistoriqueBlocageClientDetail
        myCommand.Parameters.Clear()
        myCommand.CommandText = "HistoriqueBlocageClientDetail_SelectWithIdHistoriqueBlocageClient"
        myCommand.Parameters.AddWithValue("@IdHistoriqueBlocageClient", theIdHistoriqueBlocageClient)
        Return DirectCast(Fill(New DCeKPI.HistoriqueBlocageClientDetail), DCeKPI.HistoriqueBlocageClientDetail)
    End Function
#End Region

#Region "Insertion/Modification"
    Public Sub InsertUpdate(ByRef theDataSetRow As DCeKPI.HistoriqueBlocageClientDetail.HistoriqueBlocageClientDetailRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "HistoriqueBlocageClientDetail_InsertUpdate"

        If Not theDataSetRow.IsIdHistoriqueBlocageClientDetailNull Then
            myCommand.Parameters.AddWithValue("@IdHistoriqueBlocageClientDetail", theDataSetRow.IdHistoriqueBlocageClientDetail)
        End If

        If Not theDataSetRow.IsIdHistoriqueBlocageClientNull Then
            myCommand.Parameters.AddWithValue("@IdHistoriqueBlocageClient", theDataSetRow.IdHistoriqueBlocageClient)
        End If

        If Not theDataSetRow.IsIdIncotermSAPNull Then
            myCommand.Parameters.AddWithValue("@IdIncotermSAP", theDataSetRow.IdIncotermSAP)
        End If

        If Not theDataSetRow.IsIdBlocageLivraisonNull Then
            myCommand.Parameters.AddWithValue("@IdBlocageLivraison", theDataSetRow.IdBlocageLivraison)
        End If

        theDataSetRow.IdHistoriqueBlocageClientDetail = ExecuteScalarInteger()
    End Sub
#End Region

End Class
