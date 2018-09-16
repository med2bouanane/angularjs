Public Class CheckListBox
    Inherits System.Web.UI.UserControl

#Region "Accesseurs"
    Public Property checkBoxList() As CheckBoxList
        Get
            Return Me.cblCollection
        End Get
        Set(ByVal value As CheckBoxList)
            Me.cblCollection = value
        End Set
    End Property
#End Region

#Region "Fonctionalite"


#End Region




End Class