Public Class ValidatorSummaryControl
    Inherits System.Web.UI.UserControl

#Region "Accesseurs"

    Enum EnumImageStatus
        OK
        NoOK
        Warning
        NoImage
    End Enum

    Private myImageURL As String
    Private myImageStatus As EnumImageStatus

    Public WriteOnly Property ImageStatus() As EnumImageStatus
        Set(ByVal theValue As EnumImageStatus)
            Me.myImageStatus = theValue
            If Me.myImageStatus = EnumImageStatus.OK Then
                Me.imgNotification.ImageUrl = "../Images/ok.gif"
                Me.imgNotification.Visible = True
            ElseIf Me.myImageStatus = EnumImageStatus.NoOK Then
                Me.imgNotification.ImageUrl = "../Images/nook.gif"
                Me.imgNotification.Visible = True
            ElseIf Me.myImageStatus = EnumImageStatus.Warning Then
                Me.imgNotification.ImageUrl = "../Images/warning.gif"
                Me.imgNotification.Visible = True
            ElseIf Me.myImageStatus = EnumImageStatus.NoImage Then
                Me.imgNotification.Visible = False
            End If
        End Set
    End Property

    Public Property lblNotificationControl() As Label
        Get
            Return Me.lblNotification
        End Get
        Set(ByVal theValue As Label)
            Me.lblNotification = theValue
        End Set
    End Property

    Public Property ImgNotificationControl() As Image
        Get
            Return Me.imgNotification
        End Get
        Set(ByVal theValue As Image)
            Me.imgNotification = theValue
        End Set
    End Property

    Public Property VsuNotificationControl() As ValidationSummary
        Get
            Return Me.vsuNotification
        End Get
        Set(ByVal theValue As ValidationSummary)
            Me.vsuNotification = theValue
        End Set
    End Property

    Public Property ImageURL() As String
        Get
            Return Me.myImageURL
        End Get
        Set(ByVal theValue As String)
            Me.myImageURL = theValue
        End Set
    End Property


#End Region

#Region "Fonctionalite"

    Public Sub NotifierMessage(ByVal theMessage As String, Optional theImage As EnumImageStatus = EnumImageStatus.OK)
        ImageStatus = theImage
        If theImage = EnumImageStatus.NoOK Then
            Me.lblNotificationControl.ForeColor = Drawing.Color.Red
        End If
        Me.lblNotificationControl.Text = theMessage

    End Sub

    Sub Initialiser()
        Me.lblNotificationControl.Text = String.Empty
        ImageStatus = EnumImageStatus.NoImage
    End Sub
#End Region



End Class