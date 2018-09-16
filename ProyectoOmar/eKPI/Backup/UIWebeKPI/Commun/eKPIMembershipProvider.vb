Imports System.Web.Security

Public Class eKPIMembershipProvider
    Inherits MembershipProvider

    'Private myAccesInvite As Boolean = False
    'Public Property AccesInvite As Boolean
    '    Get
    '        Return myAccesInvite
    '    End Get
    '    Set(value As Boolean)
    '        myAccesInvite = value
    '    End Set
    'End Property



    Public Overrides Property ApplicationName As String
        Get

        End Get
        Set(value As String)

        End Set
    End Property

    Public Overrides Function ChangePassword(username As String, oldPassword As String, newPassword As String) As Boolean

    End Function

    Public Overrides Function ChangePasswordQuestionAndAnswer(username As String, password As String, newPasswordQuestion As String, newPasswordAnswer As String) As Boolean

    End Function

    Public Overrides Function CreateUser(username As String, password As String, email As String, passwordQuestion As String, passwordAnswer As String, isApproved As Boolean, providerUserKey As Object, ByRef status As System.Web.Security.MembershipCreateStatus) As System.Web.Security.MembershipUser

    End Function

    Public Overrides Function DeleteUser(username As String, deleteAllRelatedData As Boolean) As Boolean

    End Function

    Public Overrides ReadOnly Property EnablePasswordReset As Boolean
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property EnablePasswordRetrieval As Boolean
        Get

        End Get
    End Property

    Public Overrides Function FindUsersByEmail(emailToMatch As String, pageIndex As Integer, pageSize As Integer, ByRef totalRecords As Integer) As System.Web.Security.MembershipUserCollection

    End Function

    Public Overrides Function FindUsersByName(usernameToMatch As String, pageIndex As Integer, pageSize As Integer, ByRef totalRecords As Integer) As System.Web.Security.MembershipUserCollection

    End Function

    Public Overrides Function GetAllUsers(pageIndex As Integer, pageSize As Integer, ByRef totalRecords As Integer) As System.Web.Security.MembershipUserCollection

    End Function

    Public Overrides Function GetNumberOfUsersOnline() As Integer

    End Function

    Public Overrides Function GetPassword(username As String, answer As String) As String

    End Function

    Public Overloads Overrides Function GetUser(providerUserKey As Object, userIsOnline As Boolean) As System.Web.Security.MembershipUser

    End Function

    Public Overloads Overrides Function GetUser(username As String, userIsOnline As Boolean) As System.Web.Security.MembershipUser

    End Function

    Public Overrides Function GetUserNameByEmail(email As String) As String

    End Function

    Public Overrides ReadOnly Property MaxInvalidPasswordAttempts As Integer
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property MinRequiredNonAlphanumericCharacters As Integer
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property MinRequiredPasswordLength As Integer
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property PasswordAttemptWindow As Integer
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property PasswordFormat As System.Web.Security.MembershipPasswordFormat
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property PasswordStrengthRegularExpression As String
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property RequiresQuestionAndAnswer As Boolean
        Get

        End Get
    End Property

    Public Overrides ReadOnly Property RequiresUniqueEmail As Boolean
        Get

        End Get
    End Property

    Public Overrides Function ResetPassword(username As String, answer As String) As String

    End Function

    Public Overrides Function UnlockUser(userName As String) As Boolean

    End Function

    Public Overrides Sub UpdateUser(user As System.Web.Security.MembershipUser)

    End Sub

    Public Overrides Function ValidateUser(ByVal theIdentifiant As String, ByVal theMotPasse As String) As Boolean
        Return Not (BOeKPI.Utilisateur.Identifier(theIdentifiant, theMotPasse) Is Nothing)
    End Function
End Class



