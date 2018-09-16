Imports Outils.DateTimeExtensions
Public Class VueEnsemble
    Inherits PageBase

#Region "Déclarations"

#End Region

#Region "Propriétés"
    Public ReadOnly Property IDSite As Integer
        Get
            Return CInt(rblSite.SelectedValue)
        End Get
    End Property

    Public ReadOnly Property TypeCommande As Integer
        Get
            Return CInt(rblTypeCommande.SelectedValue)
        End Get
    End Property

    Public ReadOnly Property BlocageClient As Boolean?
        Get
            Select Case rblBlocageClient.SelectedValue
                Case "0"
                    Return Nothing
                Case "1"
                    Return True
                Case "2"
                    Return False
            End Select
        End Get
    End Property

    Public ReadOnly Property Indicateur As String
        Get
            If TypeCommande = 1 Then
                Return rblIndicateurStandart.SelectedItem.ToString
            Else
                Return rblIndicateursStock.SelectedItem.ToString
            End If
        End Get
    End Property

    Public ReadOnly Property DateDebut As DateTime
        Get
            Return DateDeFin.AddDays(-7 * 52)
        End Get
    End Property

    Public ReadOnly Property DateDeFin As DateTime
        Get
            Dim aSemaineFin As Integer = DateTime.Now.NumeroSemaine
            aSemaineFin -= 1
            Return Outils.DateTimeExtensions.DateOutils.DernierJourDeLaSemaine(aSemaineFin, DateTime.Now.Year)
        End Get
    End Property


    Public ReadOnly Property IndicateurInferieur As Integer
        Get
            Dim aString As String = Indicateur.Replace("["c, String.Empty).Replace("]"c, String.Empty)
            Return CInt(aString.Split(";"c).First)
        End Get
    End Property

    Public ReadOnly Property IndicateurSuperieur As Integer
        Get
            Dim aString As String = Indicateur.Replace("["c, String.Empty).Replace("]"c, String.Empty)
            Return CInt(aString.Split(";"c).Last)
        End Get
    End Property

    Public Property ListeAccuses As BOeKPI.AccuseCollection
        Get
            Return DirectCast(Session("ListeAccuses"), BOeKPI.AccuseCollection)
        End Get
        Set(value As BOeKPI.AccuseCollection)
            Session("ListeAccuses") = value
        End Set
    End Property
#End Region

#Region "Interractions"
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

    End Sub
#End Region

#Region "Fonctionnalités"

#End Region

End Class