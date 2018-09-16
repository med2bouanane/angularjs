<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="AfficherHistoriqueBlocageClient.aspx.vb" Inherits="UIWebeKPI.AfficherHistoriqueBlocageClient" %>

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
                <td>
                    <asp:Label runat="server" ID="lblInformationHistorique"></asp:Label>
                </td>
            </tr>
            <tr>
                <td style="width: 10%;">
                    <asp:Label runat="server" ID="lblDescription" Text="Description :" />
                </td>
                <td style="width: 90%;">
                    <asp:TextBox runat="server" ID="txtDescription" style="width: 85%;" />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <table cellspacing="20">
                        <tr>
                            <td>
                                <asp:Panel ID="Panel2" runat="server" Width="380px" Height="200px" ScrollBars="Vertical" >
                                    <asp:Repeater runat="server" ID="rptIncoterm">
                                        <HeaderTemplate>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:Label runat="server" ID="lblTitreIncoterm" Text="Incoterms" />
                                                    </td>
                                                </tr>
                                        </HeaderTemplate>
                                        <ItemTemplate>
                                                <tr>
                                                    <td style="width: 90%;">
                                                        <asp:Label runat="server" ID="lblLibelleIncoterm" />
                                                    </td>
                                                    <td style="width: 10%;">
                                                        <asp:CheckBox runat="server" ID="chkBlocageIncoterm" />
                                                        <asp:HiddenField runat="server" ID="hdnIdIncoterm" />
                                                    </td>
                                                </tr>
                                        </ItemTemplate>
                                        <FooterTemplate>
                                            </table>
                                        </FooterTemplate>
                                    </asp:Repeater>
                                </asp:Panel>
                            </td>
                            <td>
                                <asp:Panel ID="Panel1" runat="server" Width="380px" Height="200px" ScrollBars="Vertical" >
                                    <asp:Repeater runat="server" ID="rptBlocageLivraison">
                                        <HeaderTemplate>
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td colspan="2">
                                                        <asp:Label runat="server" ID="lblTitreBlocageLivraison" Text="Suspens d'expedition" />
                                                    </td>
                                                </tr>
                                        </HeaderTemplate>
                                        <ItemTemplate>
                                                <tr>
                                                    <td style="width: 90%;">
                                                        <asp:Label runat="server" ID="lblLibelleBlocageLivraison" />
                                                    </td>
                                                    <td style="width: 10%;">
                                                        <asp:CheckBox runat="server" ID="chkBlocageClient" />
                                                        <asp:HiddenField runat="server" ID="hdnIdBlocageLivraison" />
                                                    </td>
                                                </tr>
                                        </ItemTemplate>
                                        <FooterTemplate>
                                            </table>
                                        </FooterTemplate>
                                    </asp:Repeater>
                                </asp:Panel>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
