Public Class Evaluation

    Private myParser As New parser(Me)
#Region "Declarations"
    Private Enum eTokenType
        none
        end_of_formula
        open_parenthesis
        close_parenthesis
        operator_and
        operator_or
        operator_not
        value_true
        value_false
        value_identifier
    End Enum

    Private Enum ePriority
        none = 0
        [or] = 1
        [and] = 2
        [not] = 3
    End Enum
#End Region
#Region "Fonctionalités"

    Public Function Evaluer(ByVal theString As String) As Boolean
        Return myParser.Eval(theString.ToLower)
    End Function

#End Region

    Private Class tokenizer

#Region "Declarations"
        Private myString As String
        Private myLen As Integer
        Private myPos As Integer
        Private myCurChar As Char
        Public myStartpos As Integer
        Public myType As eTokenType
        Public myValue As New System.Text.StringBuilder
        Private myParser As parser
#End Region
#Region "Constructeurs"
        Sub New(ByVal TheParser As parser, ByVal theString As String)
            myString = theString
            myLen = theString.Length
            myPos = 0
            myParser = TheParser
            NextChar()   ' start the machine
        End Sub

        Sub NextChar()
            If myPos < myLen Then
                myCurChar = myString.Chars(myPos)
                If myCurChar = Chr(147) Or myCurChar = Chr(148) Then
                    myCurChar = """"c
                End If
                myPos += 1
            Else
                myCurChar = Nothing
            End If
        End Sub
#End Region
#Region "Fonctionalités"
        Public Sub NextToken()
            myStartpos = myPos
            myValue.Length = 0
            myType = eTokenType.none
            Do
                Select Case myCurChar
                    Case Nothing
                        myType = eTokenType.end_of_formula
                    Case "("c
                        NextChar()
                        myType = eTokenType.open_parenthesis
                    Case ")"c
                        NextChar()
                        myType = eTokenType.close_parenthesis
                    Case Chr(0) To " "c
                        ' Ne rien faire
                    Case Else
                        ParseIdentifier()
                End Select
                If myType <> eTokenType.none Then Exit Do
                NextChar()
            Loop
        End Sub

        Public Sub ParseIdentifier()
            While (myCurChar >= "0"c And myCurChar <= "9"c) _
               Or (myCurChar >= "a"c And myCurChar <= "z"c) _
               Or (myCurChar >= "A"c And myCurChar <= "Z"c) _
               Or (myCurChar >= "A"c And myCurChar <= "Z"c) _
               Or (myCurChar >= Chr(128)) _
               Or (myCurChar = "_"c)
                myValue.Append(myCurChar)
                NextChar()
            End While
            Select Case myValue.ToString
                Case "and"
                    myType = eTokenType.operator_and
                Case "or"
                    myType = eTokenType.operator_or
                Case "not"
                    myType = eTokenType.operator_not
                Case "true", "yes"
                    myType = eTokenType.value_true
                Case "false", "no"
                    myType = eTokenType.value_false
                Case Else
                    myType = eTokenType.value_identifier
            End Select
        End Sub

        Public Sub ParseString(ByVal theObjectif As Boolean)
            Dim aOriginalChar As Char
            If theObjectif Then
                aOriginalChar = myCurChar
                NextChar()
            End If

            Do While myCurChar <> Nothing
                If theObjectif AndAlso myCurChar = aOriginalChar Then
                    NextChar()
                    If myCurChar = aOriginalChar Then
                        myValue.Append(myCurChar)
                    Else
                        Exit Sub
                    End If
                ElseIf myCurChar = "%"c Then
                    NextChar()
                    If myCurChar = "["c Then
                        NextChar()
                        Dim aSaveValue As System.Text.StringBuilder = myValue
                        Dim SaveStartPos As Integer = myStartpos
                        Me.myValue = New System.Text.StringBuilder
                        Me.NextToken()
                        Dim subExpr As Object
                        Try
                            subExpr = myParser.ParseExpr(0, ePriority.none)
                            If subExpr Is Nothing Then
                                Me.myValue.Append("<nothing>")
                            Else
                                Me.myValue.Append(subExpr.ToString)
                            End If
                        Catch ex As Exception
                            Me.myValue.Append("<error " & ex.Message & ">")
                        End Try
                        aSaveValue.Append(myValue.ToString)
                        myValue = aSaveValue
                        myStartpos = SaveStartPos
                    Else
                        myValue.Append("%"c)
                    End If
                Else
                    myValue.Append(myCurChar)
                    NextChar()
                End If
            Loop
        End Sub
#End Region



    End Class

    Private Class parser

#Region "Declarations"
        Private myTokenizer As tokenizer
        Private myEvaluator As Evaluation
#End Region
#Region "Constructeurs"
        Sub New(ByVal theEvaluator As Evaluation)
            myEvaluator = theEvaluator
        End Sub
#End Region
#Region "Fonctionalités"
        Friend Function ParseExpr(ByVal theAcc As Object, ByVal thePriority As ePriority) As Object
            Dim aValueLeft, aValueRight As Object
            Do
                Select Case myTokenizer.myType
                    Case eTokenType.operator_not
                        myTokenizer.NextToken()
                        aValueLeft = ParseExpr(0, ePriority.not)
                        If TypeOf aValueLeft Is Boolean Then
                            aValueLeft = Not DirectCast(aValueLeft, Boolean)
                        End If
                    Case eTokenType.value_true
                        aValueLeft = True
                        myTokenizer.NextToken()
                        Exit Do
                    Case eTokenType.value_false
                        aValueLeft = False
                        myTokenizer.NextToken()
                        Exit Do
                    Case eTokenType.open_parenthesis
                        myTokenizer.NextToken()
                        aValueLeft = ParseExpr(0, ePriority.none)
                        If myTokenizer.myType = eTokenType.close_parenthesis Then
                            ' good we eat the end parenthesis and continue ...
                            myTokenizer.NextToken()
                            Exit Do
                        End If
                    Case Else
                        Exit Do
                End Select
            Loop
            Do
                Dim aTokenTypet As eTokenType
                aTokenTypet = myTokenizer.myType
                Select Case aTokenTypet
                    Case eTokenType.end_of_formula
                        ' end of line
                        Return aValueLeft
                    Case eTokenType.operator_or
                        If thePriority < ePriority.or Then
                            myTokenizer.NextToken()
                            aValueRight = ParseExpr(aValueLeft, ePriority.or)
                            If TypeOf aValueLeft Is Boolean _
                               And TypeOf aValueRight Is Boolean Then
                                aValueLeft = CBool(aValueLeft) Or CBool(aValueRight)
                            End If
                        Else
                            Exit Do
                        End If
                    Case eTokenType.operator_and
                        If thePriority < ePriority.and Then
                            myTokenizer.NextToken()
                            aValueRight = ParseExpr(aValueLeft, ePriority.and)
                            If TypeOf aValueLeft Is Boolean _
                               And TypeOf aValueRight Is Boolean Then
                                aValueLeft = CBool(aValueLeft) And CBool(aValueRight)
                            End If
                        Else
                            Exit Do
                        End If
                    Case Else

                        Exit Do
                End Select
            Loop
            Return aValueLeft
        End Function

        Public Function Eval(ByVal theString As String) As Boolean
            If Len(theString) > 0 Then
                myTokenizer = New tokenizer(Me, theString)
                myTokenizer.NextToken()
                Dim ERes As Object = ParseExpr(Nothing, ePriority.none)
                If myTokenizer.myType = eTokenType.end_of_formula Then
                    Try
                        Return Boolean.Parse(CStr(ERes))
                    Catch ex As Exception
                        Throw
                    End Try
                End If
            End If

        End Function
#End Region

    End Class

End Class