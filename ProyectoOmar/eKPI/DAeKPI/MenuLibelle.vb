Public Class MenuLibelle
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

    Function SelectWithIdMenuLangue(ByVal theIdMenu As Integer, ByVal theCodeLanguage As String) As DCeKPI.MenuLibelle
        myCommand.Parameters.Clear()
        myCommand.CommandText = "MenuLibelle_SelectWithIdMenuCodeLangue"
        myCommand.Parameters.AddWithValue("@IdMenu", theIdMenu)
        myCommand.Parameters.AddWithValue("@CodeLangue", theCodeLanguage)
        Return DirectCast(Fill(New DCeKPI.MenuLibelle), DCeKPI.MenuLibelle)
    End Function

#End Region

#Region "Insertions/Modifications"

#End Region

#Region "Suppresstions"

#End Region
End Class
