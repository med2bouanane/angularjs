Public Class Menu

#Region "Déclarations"
    Private myMenuRow As DCeKPI.Menu.MenuRow
    Private myIdApplication As Integer
    Private myLibelle As String
    'Delegate Function EvaluerRegleDelegate(ByVal theUtilisateur As Utilisateur, ByVal theRegle As String) As Boolean
#End Region

#Region "Propriétés"

#Region "Accesseurs"

    Public ReadOnly Property IdMenu() As Integer
        Get
            Return myMenuRow.IdMenu
        End Get
    End Property

    Public Property IdMenuParent() As Integer
        Get
            If myMenuRow.IsIdMenuParentNull Then
                Return 0
            Else
                Return myMenuRow.IdMenuParent
            End If

        End Get
        Set(ByVal theValue As Integer)
            If theValue > 0 Then
                myMenuRow.IdMenuParent = theValue
            Else
                myMenuRow.SetIdMenuParentNull()
            End If
        End Set
    End Property

    Public Property Description() As String
        Get
            Return myMenuRow.Description
        End Get
        Set(ByVal Value As String)
            myMenuRow.Description = Value
        End Set
    End Property

    Public Property OrdreAffichage() As Short
        Get
            Return myMenuRow.OrdreAffichage
        End Get
        Set(ByVal Value As Short)
            myMenuRow.OrdreAffichage = Value
        End Set
    End Property

    Public Property RegleAffichage() As String
        Get
            Return myMenuRow.RegleAffichage
        End Get
        Set(ByVal Value As String)
            myMenuRow.RegleAffichage = Value
        End Set
    End Property

    Public Property IdApplication() As Integer
        Get
            Return myMenuRow.IdMenu
        End Get
        Set(ByVal Value As Integer)
            myMenuRow.IdMenu = Value
        End Set
    End Property

    Public Property Url() As String
        Get
            Return myMenuRow.Url
        End Get
        Set(ByVal Value As String)
            myMenuRow.Url = Value
        End Set
    End Property

    Public Property UrlMobile() As String
        Get
            Return myMenuRow.UrlMobile
        End Get
        Set(ByVal Value As String)
            myMenuRow.UrlMobile = Value
        End Set
    End Property

    Public Property Actif() As Boolean
        Get
            Return myMenuRow.Actif
        End Get
        Set(ByVal Value As Boolean)
            myMenuRow.Actif = Value
        End Set
    End Property

#End Region

#Region "Objets liés"

    Public Property Libelle(ByVal theCodeLangue As String) As String
        Get
            Dim aDCMenuLibelle = New DAeKPI.MenuLibelle().SelectWithIdMenuLangue(Me.IdMenu, theCodeLangue)
            If aDCMenuLibelle._MenuLibelle.Count = 1 Then
                Return aDCMenuLibelle._MenuLibelle(0).Libelle
            End If
            Return String.Empty
        End Get
        Set(ByVal Value As String)
            myLibelle = Value
        End Set
    End Property

#End Region

#End Region

#Region "Constructeurs"

    Public Sub New(ByVal theIdApplication As Integer)
        myIdApplication = theIdApplication
    End Sub

    Friend Sub New(ByVal theMenuRow As DCeKPI.Menu.MenuRow)
        myMenuRow = theMenuRow
    End Sub


#End Region

#Region "Fonctionalités"

    'Utilisateur non connectés
    Public Function EvaluerExpression(ByVal theUtilisateur As Utilisateur) As Boolean
        Dim aRegle = New Regle(Me.RegleAffichage)
        Return aRegle.Evaluer(theUtilisateur)
    End Function

    'Utilisateur non connectés
    Public Function EvaluerExpression() As Boolean
        Dim aRegle = New Regle(Me.RegleAffichage)
        Return aRegle.Evaluer()
    End Function

#End Region

End Class

Public Class MenuCollection
    Inherits List(Of Menu)

#Region "Declarations"
    Enum TypeChrgementEnum
        All
        Evalue
    End Enum
#End Region

#Region "Constructeurs"
    'Utilisateur connectés
    Sub New(ByVal theIdApplication As Integer, ByVal theUtilisateur As Utilisateur)
        Init(New DAeKPI.Menu().SelectWithIdApplication(theIdApplication), theUtilisateur)
    End Sub
    'Utilisateur non connectés
    Sub New(ByVal theIdApplication As Integer, ByVal theTypeChargement As TypeChrgementEnum)

        Init(New DAeKPI.Menu().SelectWithIdApplication(theIdApplication), theTypeChargement)

    End Sub

#End Region

#Region "Fonctionnalités"

    'Utilisateur  connectés
    Private Sub Init(ByVal theDCMenu As DCeKPI.Menu, ByVal theUtilisateur As Utilisateur)
        Me.Clear()
        Dim aMenu As Menu
        For Each aMenuRow As DCeKPI.Menu.MenuRow In theDCMenu._Menu.Rows
            aMenu = New Menu(aMenuRow)
            If aMenu.EvaluerExpression(theUtilisateur) Then
                Me.Add(aMenu)
            End If
        Next
    End Sub

    'Utilisateur non connectés
    Private Sub Init(ByVal theDCMenu As DCeKPI.Menu, ByVal theTypeChargement As TypeChrgementEnum)
        Me.Clear()
        Dim aMenu As Menu
        If theTypeChargement = TypeChrgementEnum.Evalue Then
            For Each aMenuRow As DCeKPI.Menu.MenuRow In theDCMenu._Menu.Rows
                aMenu = New Menu(aMenuRow)
                If aMenu.EvaluerExpression() Then
                    Me.Add(aMenu)
                End If
            Next
        Else
            For Each aMenuRow As DCeKPI.Menu.MenuRow In theDCMenu._Menu.Rows
                aMenu = New Menu(aMenuRow)
                If Not String.IsNullOrEmpty(aMenu.Url) Then
                    Me.Add(New Menu(aMenuRow))
                End If
            Next
        End If
    End Sub

    Public Function EvaluerExpression(ByVal theUtilisateur As Utilisateur, ByVal theRegle As String) As Boolean
        Dim aRegle = New Regle(theRegle)
        Return aRegle.Evaluer(theUtilisateur)
    End Function

#End Region

End Class

Friend Class Regle

#Region "Declarations"

    Enum TypeExpressionEnum
        Utilisateur
        DroitAcces
        Groupe
        Any
        Anonymous
    End Enum

    'Private MyUtilisateur As Utilisateur
    Private myRegle As String

#End Region

#Region "Propriétés"

    Public Property Regle() As String
        Get
            Return myRegle
        End Get
        Set(ByVal value As String)
            myRegle = value
        End Set
    End Property

    'Public Property Utilisateur() As Utilisateur
    '    Get
    '        Return MyUtilisateur
    '    End Get
    '    Set(ByVal value As Utilisateur)
    '        MyUtilisateur = value
    '    End Set
    'End Property

#End Region

#Region "Constructeurs"

    Sub New(ByVal theRegle As String)
        myRegle = theRegle
    End Sub

#End Region

#Region "Fonctionalité"

    ''' <summary>
    ''' Evaluer la regle pour les utilisateurs non connectés
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    Public Function Evaluer() As Boolean
        Dim atmpRegle As String = Regle
        Dim aExpression As Expression
        Dim aResult As Boolean
        Dim aArrayExpression() As String = myRegle.Split(New String() {"or", "and", "not"}, StringSplitOptions.RemoveEmptyEntries)
        For aIndex As Integer = 0 To aArrayExpression.Length - 1
            If (aArrayExpression(aIndex).Trim.Contains("anonymous")) Then 'Constant
                aExpression = New Expression(TypeExpressionEnum.Anonymous, aArrayExpression(aIndex), Nothing)
                aResult = aExpression.EvaluerExpression()
                atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
            End If
        Next

        'Dim aOSC As New ScriptControl
        'aOSC.Language = "VBScript"
        'aOSC.Eval(atmpRegle)

        Dim aEvaluateur As New Evaluation
        Return aEvaluateur.Evaluer(atmpRegle)
    End Function

    ''' <summary>
    ''' Evaluer la regle pour les utilisateurs connectés
    ''' </summary>
    ''' <returns></returns>
    ''' <remarks></remarks>
    ''' 
    Public Function Evaluer(ByVal theUtilisateur As Utilisateur) As Boolean
        Dim atmpRegle As String = Regle
        Dim aExpressionEvaluated As String = String.Empty
        Dim aArrayExpression() As String = myRegle.Split(New String() {"or", "and", "not", " ", "(", ")"}, StringSplitOptions.RemoveEmptyEntries)
        Dim aExpression As Expression
        Dim aResult As Boolean
        For aIndex As Integer = 0 To aArrayExpression.Length - 1
            Select Case True
                Case aArrayExpression(aIndex).Trim.StartsWith("any") 'Constant
                    aExpression = New Expression(TypeExpressionEnum.Any, aArrayExpression(aIndex), theUtilisateur)
                    aResult = aExpression.EvaluerExpression()
                    atmpRegle = atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
                Case (aArrayExpression(aIndex).Trim.StartsWith("anonymous")) 'Constant
                    aExpression = New Expression(TypeExpressionEnum.Anonymous, aArrayExpression(aIndex), theUtilisateur)
                    aResult = aExpression.EvaluerExpression()
                    atmpRegle = atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
                Case aArrayExpression(aIndex).Trim.StartsWith("U:") ' utilisateur
                    aExpression = New Expression(TypeExpressionEnum.Utilisateur, aArrayExpression(aIndex).Split(CChar(":"))(1), theUtilisateur)
                    aResult = aExpression.EvaluerExpression()
                    atmpRegle = atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
                Case aArrayExpression(aIndex).Trim.StartsWith("D:") 'Droit acces
                    aExpression = New Expression(TypeExpressionEnum.DroitAcces, aArrayExpression(aIndex).Split(CChar(":"))(1), theUtilisateur)
                    aResult = aExpression.EvaluerExpression()
                    atmpRegle = atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
                Case aArrayExpression(aIndex).Trim.StartsWith("G:") 'Groupe
                    aExpression = New Expression(TypeExpressionEnum.Groupe, aArrayExpression(aIndex).Split(CChar(":"))(1), theUtilisateur)
                    aResult = aExpression.EvaluerExpression()
                    atmpRegle = atmpRegle.Replace(aArrayExpression(aIndex), aResult.ToString)
            End Select
        Next

        Try

            'Dim aOSC As New ScriptControl
            'aOSC.Language = "VBScript"
            'aOSC.Eval(atmpRegle)

            Dim aEvaluateur As New Evaluation
            Return aEvaluateur.Evaluer(atmpRegle)
        Catch ex As Exception
            Throw
        End Try



    End Function

    'A utiliser plutar pour la verification
    'Private Function NombreRepetition(ByVal theChaine As String, ByVal theChar As Char) As Integer
    '    If Not theChaine.Contains(theChar) Then
    '        Return 0
    '    Else
    '        Return 1 + NombreRepetition(theChaine.Substring(theChaine.IndexOf(theChar)), theChar)
    '    End If
    'End Function

#End Region

    Private Class Expression

#Region "Declarations"

        Enum TypeExpressionEnum
            Utilisateur
            DroitAcces
            Groupe
            Any
            Anonymous
            Vrai
            Fault
            Negation
        End Enum

        Private MyElementBase As String
        Private MyTypeExpression As Regle.TypeExpressionEnum
        Private MyUtilisateur As Utilisateur

#End Region

#Region "Propriétés"

        Friend Property ElementBase() As String
            Get
                Return MyElementBase
            End Get
            Set(ByVal value As String)
                MyElementBase = value
            End Set
        End Property

        Friend Property Utilisateur() As Utilisateur
            Get
                Return MyUtilisateur
            End Get
            Set(ByVal value As Utilisateur)
                MyUtilisateur = value
            End Set
        End Property

        Friend Property TypeExpression() As Regle.TypeExpressionEnum
            Get
                Return MyTypeExpression
            End Get
            Set(ByVal value As Regle.TypeExpressionEnum)
                MyTypeExpression = value
            End Set
        End Property

#End Region

#Region "Constructeurs"

        Sub New(ByVal typeExpressionEnum As Regle.TypeExpressionEnum, ByVal theElementBase As String, ByVal theUtilisateur As BOeKPI.Utilisateur)
            MyTypeExpression = typeExpressionEnum
            MyElementBase = theElementBase
            MyUtilisateur = theUtilisateur
        End Sub

#End Region

#Region "Fonctionalité"

        Friend Function EvaluerExpression() As Boolean
            Dim aResultat As Boolean
            Select Case Me.TypeExpression
                Case BOeKPI.Regle.TypeExpressionEnum.Any
                    aResultat = True
                Case BOeKPI.Regle.TypeExpressionEnum.Anonymous
                    aResultat = True
                Case BOeKPI.Regle.TypeExpressionEnum.DroitAcces
                    Return Me.Utilisateur.Autorisations.ContenirAutorizaction(New Autorisation(CInt(Me.ElementBase)))
                Case BOeKPI.Regle.TypeExpressionEnum.Groupe
                    Return Me.Utilisateur.Roles.ContenirRole(New Role(CInt(Me.ElementBase)))
                Case BOeKPI.Regle.TypeExpressionEnum.Utilisateur
                    Return CInt(Me.ElementBase) = Me.Utilisateur.IDUtilisateur
            End Select
            Return aResultat
        End Function

#End Region

    End Class

End Class


