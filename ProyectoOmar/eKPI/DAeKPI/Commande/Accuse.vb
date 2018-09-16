Public Class Accuse
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringCertificat")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectWithIdAccuse(ByVal theNumAccuse As Integer) As DCeKPI.Accuse
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Accuse_SelectWithNumeroCommande"
        myCommand.Parameters.AddWithValue("@NumeroCommande", theNumAccuse)
        Return DirectCast(Fill(New DCeKPI.Accuse), DCeKPI.Accuse)
    End Function

    Public Function SelectAll() As DCeKPI.Accuse
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Accuse_SelectAll"
        Return DirectCast(Fill(New DCeKPI.Accuse), DCeKPI.Accuse)
    End Function

    Public Function SelectWithIdTypeCommande(ByVal theIdTypeCommande As Integer) As DCeKPI.Accuse
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Accuse_SelectWithIdTypeCommande"

        Return DirectCast(Fill(New DCeKPI.Accuse), DCeKPI.Accuse)
    End Function

    Public Function SelectRecherche(Optional theIdSite As Integer = 0,
                                    Optional theTypeCommande As Integer = 0,
                                    Optional theBlocageClient As Boolean? = Nothing,
                                    Optional theDateDebut As DateTime? = Nothing,
                                    Optional theDateFin As DateTime? = Nothing) As DCeKPI.Accuse
        myCommand.Parameters.Clear()
        myCommand.CommandText = "Accuse_SelectRechercheKPI"

        If theIdSite <> 0 Then
            myCommand.Parameters.AddWithValue("@IdSite", theIdSite)
        End If

        If theTypeCommande <> 0 Then
            myCommand.Parameters.AddWithValue("@IdTypeCommande", theTypeCommande)
        End If

        If theBlocageClient IsNot Nothing Then
            myCommand.Parameters.AddWithValue("@BlocageClient", theBlocageClient)
        End If

        If theDateDebut IsNot Nothing Then
            myCommand.Parameters.AddWithValue("@DateDebut", theDateDebut)
        End If

        If theDateFin IsNot Nothing Then
            myCommand.Parameters.AddWithValue("@DateFin", theDateFin)
        End If

        Return DirectCast(Fill(New DCeKPI.Accuse), DCeKPI.Accuse)
    End Function
#End Region

#Region "Insertion/Modification"

#End Region

#Region "Suppression"

#End Region

End Class
