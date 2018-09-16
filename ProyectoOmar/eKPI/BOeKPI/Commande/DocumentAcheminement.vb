Public Class DocumentAcheminement
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.DocumentAcheminement, DCeKPI.DocumentAcheminement.DocumentAcheminementRow)

#Region "Déclarations"

#End Region

#Region "Propriétés"
    Public Property IdDocumentAcheminement As Integer
        Get
            Return ProprieteIntegerGenerique("IdDocumentAcheminement")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdDocumentAcheminement") = value
        End Set
    End Property

    Public Property Numero As String
        Get
            Return ProprieteStringGenerique("Numero")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Numero") = value
        End Set
    End Property

    Public Property StatutSextant As Integer
        Get
            Return ProprieteIntegerGenerique("StatutSextant")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("StatutSextant") = value
        End Set
    End Property

    Public Property LettreVoiture As String
        Get
            Return ProprieteStringGenerique("LettreVoiture")
        End Get
        Set(value As String)
            ProprieteStringGenerique("LettreVoiture") = value
        End Set
    End Property

    Public Property CodeModeTransport As Integer
        Get
            Return ProprieteIntegerGenerique("CodeModeTransport")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("CodeModeTransport") = value
        End Set
    End Property

    Public Property DateSortieMarchandise As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateSortieMarchandise")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateSortieMarchandise") = value
        End Set
    End Property

    Public Property DateDocumentAcheminement As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateDocumentAcheminement")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateDocumentAcheminement") = value
        End Set
    End Property
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.DocumentAcheminement)
    End Sub

    Public Sub New(ByVal theIdDocumentAcheminement As Integer)
        MyBase.New(New DAeKPI.DocumentAcheminement().SelectWithIdDocumentAcheminement(theIdDocumentAcheminement), True)
    End Sub
#End Region

#Region "Fonctionnalités"

#End Region

End Class
