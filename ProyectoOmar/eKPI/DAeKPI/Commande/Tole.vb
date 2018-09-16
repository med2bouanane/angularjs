Public Class Tole
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélecion"
    Public Function SelectWithNumCommande(ByVal theNumeroCommande As String) As DCeKPI.Tole
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Tole_SelectWithNumCom"
        myCommand.Parameters.AddWithValue("@NumCom", theNumeroCommande)
        Return DirectCast(Fill(New DCeKPI.Tole), DCeKPI.Tole)
    End Function
#End Region
End Class
