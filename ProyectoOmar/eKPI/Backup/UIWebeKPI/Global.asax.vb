Imports System.Web.SessionState

Public Class Global_asax
    Inherits System.Web.HttpApplication

    Sub Application_Start(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires when the application is started
    End Sub

    Sub Session_Start(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires when the session is started
        Dim aLangue As String = String.Empty
        If Request.Cookies("LangueEKPI") Is Nothing Then
            If aLangue = String.Empty Then
                aLangue = "fr"
            End If
            Dim aCookieLangue As New System.Web.HttpCookie("LangueEKPI")
            aCookieLangue.Values("LangueEKPI") = aLangue
            aCookieLangue.Expires = Now.AddDays(3)
            Response.Cookies.Add(aCookieLangue)
        Else
            Dim aCookieLangue As System.Web.HttpCookie = Request.Cookies("LangueEKPI")
            If aLangue <> String.Empty Then
                aCookieLangue.Values("LangueEKPI") = aLangue
            Else
                aLangue = aCookieLangue.Values("LangueEKPI")
            End If
            aCookieLangue.Expires = Now.AddDays(3)
            Response.Cookies.Add(aCookieLangue)
        End If

        Threading.Thread.CurrentThread.CurrentUICulture = New Globalization.CultureInfo(aLangue)
        Threading.Thread.CurrentThread.CurrentCulture = Globalization.CultureInfo.CreateSpecificCulture(aLangue)
    End Sub

    Sub Application_BeginRequest(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires at the beginning of each request
    End Sub

    Sub Application_AuthenticateRequest(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires upon attempting to authenticate the use
    End Sub

    Sub Application_Error(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires when an error occurs
    End Sub

    Sub Session_End(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires when the session ends
    End Sub

    Sub Application_End(ByVal sender As Object, ByVal e As EventArgs)
        ' Fires when the application ends
    End Sub

End Class