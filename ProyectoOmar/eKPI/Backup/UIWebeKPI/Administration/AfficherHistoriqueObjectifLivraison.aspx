<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="AfficherHistoriqueObjectifLivraison.aspx.vb" Inherits="UIWebeKPI.AfficherHistoriqueObjectifLivraison" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <table width="100%">
                <tr>
                    <td><asp:Label runat="server" ID="lblDescription" Text="Description" /></td>
                    <td colspan="3">
                        <asp:TextBox runat="server" ID="txtDescription" Width="100%" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <asp:Label runat="server" ID="lblCommandeStandartMoinsDeuxPlusZero" Text="Commandes standart [-2;+0]:" />
                    </td>
                    <td>
                        <asp:TextBox runat="server" ID="txtCommandeStandardMoinsDeuxPlusZero" />
                    </td>
                    <td>
                        <asp:Label runat="server" ID="lblCommandePackMoinsZeroPlusZero" Text="Commandes pack [-2;+2]:" />
                    </td>
                    <td>
                        <asp:TextBox runat="server" ID="txtCommandePackMoinsZeroPlusZero" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <asp:Label runat="server" ID="lblCommandeStandartMoinsDeuxPlusDeux" Text="Commandes standart [-2;+2]:" />
                    </td>
                    <td>
                        <asp:TextBox runat="server" ID="txtCommandeStandardMoinsDeuxPlusDeux" />
                    </td>
                    <td>
                        <asp:Label runat="server" ID="lblCommandePackMoinsZeroPlusUn" Text="Commandes pack [-0;+1]:" />
                    </td>
                    <td>
                        <asp:TextBox runat="server" ID="txtCommandePackMoinsZeroPlusUn" />
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><asp:Button runat="server" ID="btnValider" Text="Valider" /></td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
