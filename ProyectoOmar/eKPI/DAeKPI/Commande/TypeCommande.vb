Public Class TypeCommande
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"

    Public Function SelectWithCode(ByVal theCode As String) As DCeKPI.TypeCommande
        myCommand.Parameters.Clear()
        myCommand.CommandText = "TypeCommande_SelectWithCode"
        myCommand.Parameters.AddWithValue("Code", theCode)
        Return DirectCast(Fill(New DCeKPI.TypeCommande), DCeKPI.TypeCommande)
    End Function

#End Region

#Region "Insertion/Modification"

#End Region

#Region "Suppression"

#End Region

End Class
