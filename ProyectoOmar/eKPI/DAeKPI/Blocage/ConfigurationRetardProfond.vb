Public Class ConfigurationRetardProfond
    Inherits DataAccessBase.Base
#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"

    Public Function SelectWithIdSite(ByVal theIdSite As Integer) As DCeKPI.ConfigurationRetardProfond
        myCommand.Parameters.Clear()
        myCommand.CommandText = "ConfigurationRetardProfond_SelectWithIdSite"
        myCommand.Parameters.AddWithValue("@IdSite", theIdSite)
        Return DirectCast(Fill(New DCeKPI.ConfigurationRetardProfond), DCeKPI.ConfigurationRetardProfond)
    End Function

    'Public Function SelectAllWithPeriode() As DCeKPI.ConfigurationRetardProfond
    '    myCommand.Parameters.Clear()
    '    myCommand.CommandText = "ConfigurationRetardProfond_SelectAllWithPeriode"
    '    Return DirectCast(Fill(New DCeKPI.ConfigurationRetardProfond), DCeKPI.ConfigurationRetardProfond)
    'End Function

#End Region

#Region "Insertion/Modification"

#End Region
End Class
