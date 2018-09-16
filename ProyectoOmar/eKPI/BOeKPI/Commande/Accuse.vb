Public Class Accuse
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.Accuse, DCeKPI.Accuse.AccuseRow)

#Region "Déclarations"
    Public Enum TypeCommande As Integer
        CommandeStandart = 1
        Pack = 2
    End Enum

    Private myCommandes As CommandeCollection
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property NumAccuse As Integer
        Get
            Return ProprieteIntegerGenerique("NumAccuse")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("NumAccuse") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property IdBackOffice As Integer
        Get
            Return ProprieteIntegerGenerique("IdBackOffice")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdBackOffice") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property DateAccuse As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateAccuse")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateAccuse") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property CodeCli As String
        Get
            Return ProprieteStringGenerique("CodeCli")
        End Get
        Set(value As String)
            ProprieteStringGenerique("CodeCli") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Sent As Boolean
        Get
            Return ProprieteBooleanGenerique("Sent")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Sent") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property DateSent As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateSent")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateSent") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Printed As Boolean
        Get
            Return ProprieteBooleanGenerique("Printed")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Printed") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property DatePrinted As DateTime
        Get
            Return ProprieteDateTimeGenerique("DatePrinted")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DatePrinted") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Preliminaire As Boolean
        Get
            Return ProprieteBooleanGenerique("Preliminaire")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Preliminaire") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Revision As Integer
        Get
            Return ProprieteIntegerGenerique("Revision")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("Revision") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property DateCloture As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateCloture")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateCloture") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONVuDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONVuDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONVuDate") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONVuIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONVuIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONVuIDUtilisateur") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONTelechargeDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONTelechargeDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONTelechargeDate") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONTelechargeIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONTelechargeIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONTelechargeIDUtilisateur") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONEnvoyeDate As DateTime
        Get
            Return ProprieteDateTimeGenerique("ICONEnvoyeDate")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("ICONEnvoyeDate") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property ICONEnvoyeIDUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("ICONEnvoyeIDUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("ICONEnvoyeIDUtilisateur") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property IdTypeCommande As Integer
        Get
            Return ProprieteIntegerGenerique("IdTypeCommande")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdTypeCommande") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property EstSolde As Boolean
        Get
            Return Commandes.Where(Function(c) c.EstSolde).Count = Commandes.Count
        End Get
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property DateDeSortie As DateTime
        Get
            Return DerniereCommandeSortie.DateDeSortie
        End Get
    End Property

    Public ReadOnly Property IndicePerformance As Integer
        Get
            Return DerniereCommandeSortie.IndicateurPerformanceLivraison
        End Get
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property SemaineLivraison As Integer
        Get
            Return DerniereCommandeSortie.SemaineLivraison
        End Get
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property SemaineLivraisonEsperee As Integer
        Get
            Return DerniereCommandeSortie.SemaineLivraisonEsperee
        End Get
    End Property

    Public ReadOnly Property DateSortieMoisAnnee As String
        Get
            Return DatePart(DateInterval.WeekOfYear, DateDeSortie) & "/" & DatePart(DateInterval.Year, DateDeSortie)
        End Get
    End Property
#End Region

#Region "Objets liés"
    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Commandes As BOeKPI.CommandeCollection
        Get
            If myCommandes Is Nothing Then
                myCommandes = New BOeKPI.CommandeCollection(NumAccuse)
            End If
            Return myCommandes
        End Get
        Set(value As BOeKPI.CommandeCollection)
            myCommandes = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property DerniereCommandeSortie As BOeKPI.Commande
        Get
            Return Commandes.OrderByDescending(Function(c) c.DateDeSortie).First
        End Get
    End Property

#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.Accuse)
    End Sub

    Public Sub New(ByVal theNumAccuse As Integer)
        MyBase.New(New DAeKPI.Accuse().SelectWithIdAccuse(theNumAccuse), True)
    End Sub

    Friend Sub New(ByVal theAccuseRow As DCeKPI.Accuse.AccuseRow)
        MyBase.New(theAccuseRow)
    End Sub
#End Region

#Region "Fonctionnalités"
    
#End Region

End Class

Public Class AccuseCollection
    Inherits List(Of Accuse)

#Region "Constructeurs"
    Public Sub New(Optional theIdSite As Integer = 0,
                   Optional theTypeCommande As Integer = 0,
                   Optional theBlocageClient As Boolean? = Nothing,
                   Optional theDateDebut As DateTime? = Nothing,
                   Optional theDateFin As DateTime? = Nothing)

        Init(New DAeKPI.Accuse().SelectRecherche(theIdSite,
                                                 theTypeCommande,
                                                 theBlocageClient,
                                                 theDateDebut,
                                                 theDateFin))

    End Sub

    Public Sub New(ByVal theIdTypeCommande As Accuse.TypeCommande)
        Init(New DAeKPI.Accuse().SelectWithIdTypeCommande(theIdTypeCommande))
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub Init(ByVal theDCAccuse As DCeKPI.Accuse)
        For Each aAccuse As DCeKPI.Accuse.AccuseRow In theDCAccuse._Accuse.Rows
            Me.Add(New Accuse(aAccuse))
        Next
    End Sub
#End Region

End Class