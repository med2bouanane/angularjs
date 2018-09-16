Public Class IncotermSAP
    Inherits DataAccessBase.Base

#Region "Constructeur"
    Public Sub New()
        If Not Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice") Is Nothing Then
            ConnectionString = Configuration.ConfigurationManager.AppSettings("ConnectionStringFrontoffice")
        End If
    End Sub
#End Region

#Region "Sélection"
    Public Function SelectAll() As DCeKPI.IncotermSAP
        myCommand.Parameters.Clear()
        myCommand.CommandText = "IncotermSAP_SelectAll"
        Return DirectCast(Fill(New DCeKPI.IncotermSAP), DCeKPI.IncotermSAP)
    End Function

    Public Function SelectWithIdIncotermSAP(ByVal theIdIncotermSAP As Integer) As DCeKPI.IncotermSAP
        myCommand.Parameters.Clear()
        myCommand.CommandText = "IncortermSAP_SelectWithIdIncotermSAP"
        myCommand.Parameters.AddWithValue("@IdIncotermSAP", theIdIncotermSAP)
        Return DirectCast(Fill(New DCeKPI.IncotermSAP), DCeKPI.IncotermSAP)
    End Function
#End Region

#Region "Insertion/Modification"
    Public Sub InsertUpdate(ByRef theIncotermSapRow As DCeKPI.IncotermSAP.IncotermSAPRow)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "IncotermSAP_InsertUpdate"

        If Not theIncotermSapRow.IsIdIncotermSAPNull Then
            myCommand.Parameters.AddWithValue("@IdIncotermSAP", theIncotermSapRow.IdIncotermSAP)
        End If

        If Not theIncotermSapRow.IsIDBackOfficeNull Then
            myCommand.Parameters.AddWithValue("@IDBackOffice", theIncotermSapRow.IDBackOffice)
        End If

        If Not theIncotermSapRow.IsCodeIncotermSAPNull Then
            myCommand.Parameters.AddWithValue("@CodeIncotermSAP", theIncotermSapRow.CodeIncotermSAP)
        End If

        If Not theIncotermSapRow.IsCodeAffichageNull Then
            myCommand.Parameters.AddWithValue("@CodeAffichage", theIncotermSapRow.CodeAffichage)
        End If

        If Not theIncotermSapRow.IsFrancoNull Then
            myCommand.Parameters.AddWithValue("@Franco", theIncotermSapRow.Franco)
        End If

        If Not theIncotermSapRow.IsCodeIncotermSAP2Null Then
            myCommand.Parameters.AddWithValue("@CodeIncotermSAP2", theIncotermSapRow.CodeIncotermSAP2)
        End If

        If Not theIncotermSapRow.IsCamionNull Then
            myCommand.Parameters.AddWithValue("@Camion", theIncotermSapRow.Camion)
        End If

        If Not theIncotermSapRow.IsWagonNull Then
            myCommand.Parameters.AddWithValue("@Wagon", theIncotermSapRow.Wagon)
        End If

        If Not theIncotermSapRow.IsAllegeNull Then
            myCommand.Parameters.AddWithValue("@Allege", theIncotermSapRow.Allege)
        End If

        If Not theIncotermSapRow.IsMaritimeNull Then
            myCommand.Parameters.AddWithValue("@Maritime", theIncotermSapRow.Maritime)
        End If

        If Not theIncotermSapRow.IsOrdreNull Then
            myCommand.Parameters.AddWithValue("@Ordre", theIncotermSapRow.Ordre)
        End If

        If Not theIncotermSapRow.IsSupprimeNull Then
            myCommand.Parameters.AddWithValue("@Supprime", theIncotermSapRow.Supprime)
        End If

        If Not theIncotermSapRow.IsAerienNull Then
            myCommand.Parameters.AddWithValue("@Aerien", theIncotermSapRow.Aerien)
        End If

        If Not theIncotermSapRow.IsBlocageClientNull Then
            myCommand.Parameters.AddWithValue("@BlocageClient", theIncotermSapRow.BlocageClient)
        End If

        theIncotermSapRow.IdIncotermSAP = ExecuteScalarInteger()
    End Sub

    Public Sub UpdateWithIdBlocageLivraisonBlocageClient(ByVal theIdBlocageClient As Integer, ByVal theBlocageClient As Boolean)
        myCommand.Parameters.Clear()
        myCommand.CommandText = "BlocageLivraison_UpdateWithIdBlocageLivraisonBlocageClient"
        myCommand.Parameters.AddWithValue("@IdBlocageLivraison", theIdBlocageClient)
        myCommand.Parameters.AddWithValue("@BlocageClient", theBlocageClient)
        ExecuteNonQuery()
    End Sub
#End Region
End Class
