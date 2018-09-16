Public Class Bordereau
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.Bordereau, DCeKPI.Bordereau.BordereauRow)

#Region "Déclarations"

#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property NumBord As Integer
        Get
            Return ProprieteIntegerGenerique("NumBord")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NumBord") = value
        End Set
    End Property

    Public Property IdBackOffice As Integer
        Get
            Return ProprieteIntegerGenerique("IdBackOffice")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBackOffice") = value
        End Set
    End Property

    Public Property DateBord As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateBord")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateBord") = value
        End Set
    End Property

    Public Property CodeCli As String
        Get
            Return ProprieteStringGenerique("CodeCli")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeCli") = value
        End Set
    End Property

    Public Property Cancelled As Boolean
        Get
            Return ProprieteBooleanGenerique("Cancelled")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Cancelled") = value
        End Set
    End Property

    Public Property Hd As Boolean
        Get
            Return ProprieteBooleanGenerique("Hd")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Hd") = value
        End Set
    End Property

    Public Property Sent As Boolean
        Get
            Return ProprieteBooleanGenerique("Sent")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Sent") = value
        End Set
    End Property

    Public Property DateSent As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateSent")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateSent") = value
        End Set
    End Property

    Public Property Printed As Boolean
        Get
            Return ProprieteBooleanGenerique("Printed")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Printed") = value
        End Set
    End Property

    Public Property DatePrinted As DateTime
        Get
            Return ProprieteDateTimeGenerique("DatePrinted")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DatePrinted") = value
        End Set
    End Property

    Public Property SentNormal As Boolean
        Get
            Return ProprieteBooleanGenerique("SentNormal")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("SentNormal") = value
        End Set
    End Property

    Public Property DateSentNormal As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateSentNormal")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateSentNormal") = value
        End Set
    End Property

    Public Property PrintedNormal As Boolean
        Get
            Return ProprieteBooleanGenerique("PrintedNormal")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("PrintedNormal") = value
        End Set
    End Property

    Public Property DatePrintedNormal As DateTime
        Get
            Return ProprieteDateTimeGenerique("DatePrintedNormal")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DatePrintedNormal") = value
        End Set
    End Property

    Public Property TonnageTotal As Double
        Get
            Return ProprieteDoubleGenerique("TonnageTotal")
        End Get
        Set(value As Double)
            ProprieteDoubleGenerique("TonnageTotal") = value
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

    Public Property ICONVuDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONVuDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONVuDate") = value
        End Set
    End Property

    Public Property ICONVuIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONVuIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONVuIDUtilisateur") = value
        End Set
    End Property

    Public Property ICONTelechargeDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONTelechargeDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONTelechargeDate") = value
        End Set
    End Property

    Public Property ICONTelechargeIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONTelechargeIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONTelechargeIDUtilisateur") = value
        End Set
    End Property

    Public Property ICONEnvoyeDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONEnvoyeDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONEnvoyeDate") = value
        End Set
    End Property

    Public Property ICONEnvoyeIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONEnvoyeIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONEnvoyeIDUtilisateur") = value
        End Set
    End Property
#End Region

#Region "Objets liés"

#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.Bordereau)
    End Sub

    Public Sub New(ByVal theNumeroBordereau As Integer)
        MyBase.New(New DAeKPI.Bordereau().SelectWithIdBordereau(theNumeroBordereau), True)
    End Sub
#End Region

#Region "Fonctionnalités"

#End Region

End Class
