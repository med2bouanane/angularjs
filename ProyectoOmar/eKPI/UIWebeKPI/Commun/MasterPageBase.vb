Public Class MasterPageBase
    Inherits System.Web.UI.MasterPage

#Region "Déclarations"

    Private myUtilisateurCourant As BOeKPI.Utilisateur

#End Region

#Region "Propriétés"

    Protected ReadOnly Property UtilisateurCourant() As BOeKPI.Utilisateur
        Get
            Me.EnsureChildControls()
            If myUtilisateurCourant Is Nothing AndAlso Threading.Thread.CurrentPrincipal.Identity.Name <> String.Empty Then
                myUtilisateurCourant = New BOeKPI.Utilisateur(Threading.Thread.CurrentPrincipal.Identity.Name, BOeKPI.Utilisateur.TypeChaine.Identifiant)
            End If
            Return myUtilisateurCourant
        End Get
    End Property

    ReadOnly Property CodeLangueUI As String
        Get
            Me.EnsureChildControls()
            Return Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName
        End Get
    End Property

#End Region
End Class
