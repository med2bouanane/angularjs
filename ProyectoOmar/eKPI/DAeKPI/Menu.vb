Public Class Menu
    Inherits DataAccessBase.Base

#Region "Constructeurs"

    Public Sub New()
        MyBase.New()
        If ConnectionString = String.Empty Then
            ConnectionString = System.Configuration.ConfigurationManager.AppSettings("ConnectionStringWorkflow")
        End If
    End Sub

#End Region

#Region "Selections"

    Function SelectWithIdApplication(ByVal theIdApplication As Integer) As DCeKPI.Menu
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Menu_SelectWithIdApplication"
        myCommand.Parameters.AddWithValue("@IdApplication", theIdApplication)
        Return DirectCast(Fill(New DCeKPI.Menu), DCeKPI.Menu)
    End Function

#End Region

#Region "Insertions/Modifications"

#End Region

#Region "Suppresstions"

#End Region




End Class
