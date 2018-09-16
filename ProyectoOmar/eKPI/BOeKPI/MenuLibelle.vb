Public Class MenuLibelle

#Region "Declaratios"
    Private myMenuLibelleRow As DCeKPI.MenuLibelle.MenuLibelleRow
#End Region
#Region "Propriétés"

#Region "Accesseurs"

    Public Property IdMenu() As Integer
        Get
            Return myMenuLibelleRow.IdMenu
        End Get
        Set(ByVal Value As Integer)
            myMenuLibelleRow.IdMenu = Value
        End Set
    End Property

    Public Property CodeLangue() As String
        Get
            Return myMenuLibelleRow.CodeLangue
        End Get
        Set(ByVal Value As String)
            myMenuLibelleRow.CodeLangue = Value
        End Set
    End Property

    Public Property Libelle() As String
        Get
            Return myMenuLibelleRow.Libelle
        End Get
        Set(ByVal Value As String)
            myMenuLibelleRow.Libelle = Value
        End Set
    End Property


#End Region

#Region "Objets liés"



#End Region
#End Region

#Region "Fonctionalités"

#End Region
End Class
