Public Class ConfigurationObjectifLivraison
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.ConfigurationObjectifLivraison, DCeKPI.ConfigurationObjectifLivraison.ConfigurationObjectifLivraisonRow)

#Region "Déclarations"
    Private myUtilisateur As BOeKPI.Utilisateur
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property IdConfigurationObjectifLivraison As Integer
        Get
            Return ProprieteIntegerGenerique("IdConfigurationObjectifLivraison")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdConfigurationObjectifLivraison") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property IdUtilisateur As Integer
        Get
            Return ProprieteIntegerGenerique("IdUtilisateur")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdUtilisateur") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property DateCreation As DateTime
        Get
            Return ProprieteDateTimeGenerique("DateCreation")
        End Get
        Set(value As DateTime)
            ProprieteDateTimeGenerique("DateCreation") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Description As String
        Get
            Return ProprieteStringGenerique("Description")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Description") = value
        End Set
    End Property

    Public Property CommandeStandardMoinsDeuxPlusZero As Integer
        Get
            Return ProprieteIntegerGenerique("CommandeStandardMoinsDeuxPlusZero")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("CommandeStandardMoinsDeuxPlusZero") = value
        End Set
    End Property

    Public Property CommandeStandardMoinsDeuxPlusDeux As Integer
        Get
            Return ProprieteIntegerGenerique("CommandeStandardMoinsDeuxPlusDeux")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("CommandeStandardMoinsDeuxPlusDeux") = value
        End Set
    End Property

    Public Property CommandePackMoinsZeroPlusZero As Integer
        Get
            Return ProprieteIntegerGenerique("CommandePackMoinsZeroPlusZero")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("CommandePackMoinsZeroPlusZero") = value
        End Set
    End Property

    Public Property CommandePackMoinsZeroPlusUn As Integer
        Get
            Return ProprieteIntegerGenerique("CommandePackMoinsZeroPlusUn")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("CommandePackMoinsZeroPlusUn") = value
        End Set
    End Property

    <System.Web.Script.Serialization.ScriptIgnore()>
    Public Property Actif As Boolean
        Get
            Return ProprieteBooleanGenerique("Actif")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Actif") = value
        End Set
    End Property

    Public ReadOnly Property SemaineCreation As String
        Get
            Return DatePart(DateInterval.WeekOfYear, DateCreation) & "/" & DatePart(DateInterval.Year, DateCreation)
        End Get
    End Property
#End Region

#Region "Objets liés"
    <System.Web.Script.Serialization.ScriptIgnore()>
    Public ReadOnly Property Utilisateur As BOeKPI.Utilisateur
        Get
            If myUtilisateur Is Nothing Then
                myUtilisateur = New BOeKPI.Utilisateur(IdUtilisateur)
            End If
            Return myUtilisateur
        End Get
    End Property
#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.ConfigurationObjectifLivraison)
    End Sub

    Public Sub New(ByVal theIdConfigurationObjectifLivraison As Integer)
        MyBase.New(New DAeKPI.ConfigurationObjectifLivraison().SelectWithIdConfigurationObjectifLivraison(theIdConfigurationObjectifLivraison), True)
    End Sub

    Friend Sub New(ByVal theConfigurationObjectifLivraisonRow As DCeKPI.ConfigurationObjectifLivraison.ConfigurationObjectifLivraisonRow)
        MyBase.New(theConfigurationObjectifLivraisonRow)
    End Sub
#End Region

#Region "Fonctionnalités"
    Public Sub Sauver()
        Dim aConfigurationObjectifLivraisonDA As New DAeKPI.ConfigurationObjectifLivraison
        aConfigurationObjectifLivraisonDA.InsertUpdate(DataSetRow)
    End Sub
#End Region

End Class

Public Class ConfigurationObjectifLivraisonCollection
    Inherits List(Of ConfigurationObjectifLivraison)

#Region "Constructeurs"
    Public Sub New()
        Init(New DAeKPI.ConfigurationObjectifLivraison().SelectAll)
    End Sub
#End Region

#Region "Fonctionnalités"
    Private Sub Init(ByVal theConfigurationObjectifLivraisonCollection As DCeKPI.ConfigurationObjectifLivraison)
        For Each aConfigurationObjectifLivraisonCollectionRow As DCeKPI.ConfigurationObjectifLivraison.ConfigurationObjectifLivraisonRow In theConfigurationObjectifLivraisonCollection._ConfigurationObjectifLivraison.Rows
            Me.Add(New BOeKPI.ConfigurationObjectifLivraison(aConfigurationObjectifLivraisonCollectionRow))
        Next
    End Sub
#End Region

End Class