Public Class OrganisationCommerciale
    Inherits DataAccessBase.Base

#Region "Connstructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectWithIdOrganisationCommerciale(ByVal theIdOrganisationCommerciale As Integer) As DCeKPI.OrganisationCommerciale
        myCommand.Parameters.Clear()
        myCommand.CommandText = "OrganisationCommerciale_SelectWithIdOrganisationCommerciale"
        myCommand.Parameters.AddWithValue("@IdOrganisationCommerciale", theIdOrganisationCommerciale)
        Return DirectCast(Fill(New DCeKPI.OrganisationCommerciale), DCeKPI.OrganisationCommerciale)
    End Function
#End Region

#Region "Insertion/Modification"

#End Region

End Class
