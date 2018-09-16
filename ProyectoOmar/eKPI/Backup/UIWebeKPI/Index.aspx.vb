Public Class Index
    Inherits PageBase

#Region "Interactions"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        AfficherDate()

    End Sub

#End Region

#Region "Fonctionnalités"

    Private Sub AfficherDate()
        Dim aStringbuilder As New Text.StringBuilder
        aStringbuilder.Append(StrConv(Now.ToString("dddd"), VbStrConv.ProperCase)).Append(",<br />").Append(Now.Day.ToString).Append(" ").Append(Now.ToString("MMMM")).Append(" ").Append(Now.ToString("yyyy"))
        lblDate.Text = aStringbuilder.ToString
        aStringbuilder = Nothing
    End Sub

    
#End Region





End Class