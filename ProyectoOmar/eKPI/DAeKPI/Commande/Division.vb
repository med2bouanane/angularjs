Public Class Division
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice")
        End If
    End Sub
#End Region

#Region "Sélections"

    Public Function SelectWithIdDivision(ByVal theIdDivision As Integer) As DCeKPI.Division
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Division_SelectWithIdDivision"
        myCommand.Parameters.AddWithValue("@IdDivision", theIdDivision)
        Return DirectCast(Fill(New DCeKPI.Division), DCeKPI.Division)
    End Function

    Public Function SelectWithCode(ByVal theCode As String) As DCeKPI.Division
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Division_SelectWithCode"
        myCommand.Parameters.AddWithValue("@Code", theCode)
        Return DirectCast(Fill(New DCeKPI.Division), DCeKPI.Division)
    End Function

#End Region

#Region "Modification/Insertion"

#End Region
End Class
