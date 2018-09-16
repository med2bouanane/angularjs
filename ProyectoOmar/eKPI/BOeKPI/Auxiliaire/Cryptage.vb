Imports System.IO
Imports System.Text
Imports System.Security.Cryptography

Public Class Cryptage

    Private myDES As New TripleDESCryptoServiceProvider
    Private Function MD5Hash(ByVal value As String) As Byte()
        Dim myMD5 As New MD5CryptoServiceProvider
        Return myMD5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(value))
    End Function

    Public Function Crypter(ByVal theChaineAcrypter As String) As String
        Dim cle As String = obtenirCle()
        myDES.Key = MD5Hash(cle)
        myDES.Mode = CipherMode.ECB
        Dim Buffer As Byte() = ASCIIEncoding.ASCII.GetBytes(theChaineAcrypter)
        Return Convert.ToBase64String(myDES.CreateEncryptor().TransformFinalBlock(Buffer, 0, Buffer.Length))
    End Function

    Public Function Decrypter(ByVal theChainecrypté As String) As String
        Try
            Dim cle As String = obtenirCle()
            myDES.Key = MD5Hash(cle)
            myDES.Mode = CipherMode.ECB
            Dim Buffer As Byte() = Convert.FromBase64String(theChainecrypté)
            Return ASCIIEncoding.ASCII.GetString(myDES.CreateDecryptor().TransformFinalBlock(Buffer, 0, Buffer.Length))
        Catch ex As Exception
            Return Nothing
        End Try
    End Function

    Private Function obtenirCle() As String
        'Creer un cle dans la base de donnée et changer dans chaque acces
        Return "MaCle"
    End Function

End Class
