Public Class Conditions
    Inherits PageBase

#Region "Interactions"

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        lblConditions.Text = ReplaceFirst(GetGlobalResourceObject("Global", "TexteConditions").ToString.Replace("<span style='font-size:16px; color:#ff3700; font-weight:bolder;'>", "<h1>"), "</span>", "</h1>")
    End Sub

#End Region

#Region "Fonctionnalités"

    Public Function ReplaceFirst(ByVal theChaine As String, theChaineARemplacer As String, theChaineDeRemplacement As String) As String
        Dim aPosition As Integer = theChaine.IndexOf(theChaineARemplacer)

        If aPosition < 0 Then
            Return theChaine
        End If

        Return theChaine.Substring(0, aPosition) + theChaineDeRemplacement + theChaine.Substring(aPosition + theChaineARemplacer.Length)
    End Function

#End Region

End Class