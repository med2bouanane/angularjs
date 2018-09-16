Public Class ConfigurationRetardProfond
#Region "Déclarations"
    Private myConfigurationRetardProfondRow As DCeKPI.ConfigurationRetardProfond.ConfigurationRetardProfondRow
#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public ReadOnly Property IdConfigurationRetardProfond() As Integer
        Get
            Return myConfigurationRetardProfondRow.IdConfigurationRetardProfond
        End Get
    End Property

    Public Property IdIdUtilisateurCreateur() As Integer
        Get
            If myConfigurationRetardProfondRow.IsIdUtilisateurCreateurNull Then
                Return 0
            Else
                Return myConfigurationRetardProfondRow.IdUtilisateurCreateur
            End If

        End Get
        Set(ByVal theValue As Integer)
            If theValue > 0 Then
                myConfigurationRetardProfondRow.IdUtilisateurCreateur = theValue
            Else
                myConfigurationRetardProfondRow.SetIdUtilisateurCreateurNull()
            End If
        End Set
    End Property

    Public Property IdIdUtilisateurModificateur() As Integer
        Get
            If myConfigurationRetardProfondRow.IsIdUtilisateurModificateurNull Then
                Return 0
            Else
                Return myConfigurationRetardProfondRow.IdUtilisateurModificateur
            End If

        End Get
        Set(ByVal theValue As Integer)
            If theValue > 0 Then
                myConfigurationRetardProfondRow.IdUtilisateurModificateur = theValue
            Else
                myConfigurationRetardProfondRow.SetIdUtilisateurModificateurNull()
            End If
        End Set
    End Property

    Public Property DateCreation() As Date
        Get
            Return myConfigurationRetardProfondRow.DateCreation
        End Get
        Set(ByVal theValue As Date)
            myConfigurationRetardProfondRow.DateCreation = theValue
        End Set
    End Property

    Public Property DateModification() As Date
        Get
            Return myConfigurationRetardProfondRow.DateModification
        End Get
        Set(ByVal theValue As Date)
            myConfigurationRetardProfondRow.DateModification = theValue
        End Set
    End Property

    Public Property IdSite() As Short
        Get
            Return myConfigurationRetardProfondRow.IdSite
        End Get
        Set(ByVal theValue As Short)
            myConfigurationRetardProfondRow.IdSite = theValue
        End Set
    End Property

    Public Property Description() As String
        Get
            Return myConfigurationRetardProfondRow.Description
        End Get
        Set(ByVal Value As String)
            myConfigurationRetardProfondRow.Description = Value
        End Set
    End Property

    Public Property Periode() As Date
        Get
            Return myConfigurationRetardProfondRow.Periode
        End Get
        Set(ByVal theValue As Date)
            myConfigurationRetardProfondRow.Periode = theValue
        End Set
    End Property

    Public Property Tonnage() As Double
        Get
            Return myConfigurationRetardProfondRow.Tonnage
        End Get
        Set(ByVal theValue As Double)
            myConfigurationRetardProfondRow.Tonnage = theValue
        End Set
    End Property

    Public Property TonnageSansBlocage() As Double
        Get
            Return myConfigurationRetardProfondRow.TonnageSansBlocage
        End Get
        Set(ByVal theValue As Double)
            myConfigurationRetardProfondRow.TonnageSansBlocage = theValue
        End Set
    End Property

    Public Property ObjectifTonnage() As Double
        Get
            Return myConfigurationRetardProfondRow.ObjectifTonnage
        End Get
        Set(ByVal theValue As Double)
            myConfigurationRetardProfondRow.ObjectifTonnage = theValue
        End Set
    End Property

    Public Property Actif() As Boolean
        Get
            Return myConfigurationRetardProfondRow.Actif
        End Get
        Set(ByVal theValue As Boolean)
            myConfigurationRetardProfondRow.Actif = theValue
        End Set
    End Property
#End Region

#Region "Objets liés"

    Public ReadOnly Property SiteLibelle As String
        Get
            Return New BOGapCommerce.Site(Me.IdSite).Libelle
        End Get
    End Property

#End Region

#End Region

#Region "Constructeurs"
    Friend Sub New(ByVal theDCConfigurationRetardProfond As DCeKPI.ConfigurationRetardProfond.ConfigurationRetardProfondRow)
        myConfigurationRetardProfondRow = theDCConfigurationRetardProfond
    End Sub
#End Region

#Region "Fonctionalité"

#End Region
End Class


Public Class ConfigurationRetardProfondCollection
    Inherits List(Of ConfigurationRetardProfond)

#Region "Declarations"
    Enum FiltreEnumerateur
        Tous
        periode
    End Enum

#End Region

#Region "Constructeurs"


    Public Sub New(ByVal theIdSite As Integer)
        Init(New DAeKPI.ConfigurationRetardProfond().SelectWithIdSite(theIdSite))
    End Sub

    'Public Sub New(ByVal theFiltre As FiltreEnumerateur)
    '    If theFiltre = FiltreEnumerateur.DeuxAns Then
    '        Init(New DAeKPI.ConfigurationRetardProfond().SelectAllWithPeriode())
    '    End If
    'End Sub

    Private Sub Init(ByVal theDCConfigurationRetardProfond As DCeKPI.ConfigurationRetardProfond)
        Me.Clear()
        For Each aConfigurationRetardProfond As DCeKPI.ConfigurationRetardProfond.ConfigurationRetardProfondRow In theDCConfigurationRetardProfond._ConfigurationRetardProfond.Rows
            Me.Add(New ConfigurationRetardProfond(aConfigurationRetardProfond))
        Next
    End Sub

#End Region

#Region "Fonctionnalités"



#End Region

End Class
