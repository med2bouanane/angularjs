Public Class Commande
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélections"
    Public Function SelectWithNumAccuse(ByVal theNumAccuse As Integer) As DCeKPI.Commande
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Commande_SelectWithNumeroAccuse"
        myCommand.Parameters.AddWithValue("@NumeroAccuse", theNumAccuse)
        Return DirectCast(Fill(New DCeKPI.Commande), DCeKPI.Commande)
    End Function

    Public Function SelectRecherche() As DCeKPI.Commande
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Commande_SelectRechercheKPI"

        Return DirectCast(Fill(New DCeKPI.Commande), DCeKPI.Commande)
    End Function
#End Region

#Region "Insertions/Modifications"

#End Region

End Class
