Public Class Division
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.Division, DCeKPI.Tole.ToleRow)

#Region "Déclarations"
    Private myLibelle As String
    Private myOrganisationCommerciale As BOeKPI.OrganisationCommerciale
#End Region

#Region "Propriétés"
#Region "Accesseurs"
    Public Property IdDivision As Integer
        Get
            Return ProprieteIntegerGenerique("IdDivision")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdDivision") = value
        End Set
    End Property

    Public Property IdOrganisationCommerciale As Integer
        Get
            Return ProprieteIntegerGenerique("IdOrganisationCommerciale")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdOrganisationCommerciale") = value
        End Set
    End Property

    Public Property Code As String
        Get
            Return ProprieteStringGenerique("Code")
        End Get
        Set(value As String)
            ProprieteStringGenerique("Code") = value
        End Set
    End Property

    Public Property Libelle As String
        Get
            If String.IsNullOrEmpty(myLibelle) Then
                myLibelle = ProprieteLibelleMultilingue(Generiques.DaDataSetGenerique.DbSource.Frontoffice, "Division", IdDivision)
            End If
            Return myLibelle
        End Get
        Set(value As String)
            myLibelle = value
        End Set
    End Property

    Public Property Actif As Boolean
        Get
            Return ProprieteBooleanGenerique("Actif")
        End Get
        Set(value As Boolean)
            ProprieteBooleanGenerique("Actif") = value
        End Set
    End Property
#End Region

#Region "Objets liés"
    Public ReadOnly Property OrganisationCommerciale As BOeKPI.OrganisationCommerciale
        Get
            If myOrganisationCommerciale Is Nothing AndAlso IdOrganisationCommerciale <> 0 Then
                myOrganisationCommerciale = New BOeKPI.OrganisationCommerciale(IdOrganisationCommerciale)
            End If
            Return myOrganisationCommerciale
        End Get
    End Property
#End Region
#End Region

#Region "Constructeur"
    Public Sub New()
        MyBase.New(New DCeKPI.Division)
    End Sub

    Public Sub New(ByVal theIdDivision As Integer)
        MyBase.New(New DAeKPI.Division().SelectWithIdDivision(theIdDivision))
    End Sub

    Public Sub New(ByVal theCode As String)
        MyBase.New(New DAeKPI.Division().SelectWithCode(theCode))
    End Sub

#End Region

#Region "Fonctionnalités"

#End Region
End Class
