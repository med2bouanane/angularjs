Public Class DocumentAcheminement
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectWithIdDocumentAcheminement(ByVal theIdDocumentAcheminmenent As Integer) As DCeKPI.DocumentAcheminement
        myCommand.Parameters.Clear()
        myCommand.CommandText = "DocumentAcheminement_SelectWithIDDocumentAcheminement"
        myCommand.Parameters.AddWithValue("@IDDocumentAcheminement", theIdDocumentAcheminmenent)
        Return DirectCast(Fill(New DCeKPI.DocumentAcheminement), DCeKPI.DocumentAcheminement)
    End Function
#End Region

#Region "Insertion/Modification"

#End Region

End Class
