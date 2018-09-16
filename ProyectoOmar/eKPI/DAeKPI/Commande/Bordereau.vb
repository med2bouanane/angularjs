Public Class Bordereau
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectWithIdBordereau(ByVal theNumBordereau As Integer) As DCeKPI.Bordereau
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Bordereau_SelectWithIDBordereau"
        myCommand.Parameters.AddWithValue("@IDBordereau", theNumBordereau)
        Return DirectCast(Fill(New DCeKPI.Bordereau), DCeKPI.Bordereau)
    End Function
#End Region

#Region "Insertion/Modification"

#End Region

End Class
