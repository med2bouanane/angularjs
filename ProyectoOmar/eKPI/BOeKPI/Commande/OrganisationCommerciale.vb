Public Class OrganisationCommerciale
    Inherits Generiques.BoDataSetGenerique(Of DCeKPI.OrganisationCommerciale, DCeKPI.OrganisationCommerciale.OrganisationCommercialeRow)

#Region "Déclarations"

#End Region

#Region "Propriétés"
#Region "Accesseurs"
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

    Public Property IdSociete As Integer
        Get
            Return ProprieteIntegerGenerique("IdSociete")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdSociete") = value
        End Set
    End Property

    Public Property IdSite As Integer
        Get
            Return ProprieteIntegerGenerique("IdSite")
        End Get
        Set(value As Integer)
            ProprieteIntegerGenerique("IdSite") = value
        End Set
    End Property
#End Region

#Region "Objets liés"

#End Region
#End Region

#Region "Constructeurs"
    Public Sub New()
        MyBase.New(New DCeKPI.OrganisationCommerciale)
    End Sub

    Public Sub New(ByVal theIdOrganisationCommerciale As Integer)
        MyBase.New(New DAeKPI.OrganisationCommerciale().SelectWithIdOrganisationCommerciale(theIdOrganisationCommerciale))
    End Sub
#End Region

#Region "Fonctionnalités"

#End Region

End Class
