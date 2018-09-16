Public Class Confidentialite
    Inherits PageBase

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub

#Region "Héritage et polymorphisme"

    'Protected Overrides Sub Traduire()
    '    If Threading.Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName.ToLower = "fr" Then
    '        trFrancais.Visible = True
    '        trAnglais.Visible = False
    '    Else
    '        trFrancais.Visible = False
    '        trAnglais.Visible = True
    '    End If
    '    AfficheTraduction(lblTitreGlobal.Text, "TitreConfidentialiteSecurite")
    'End Sub

#End Region

End Class