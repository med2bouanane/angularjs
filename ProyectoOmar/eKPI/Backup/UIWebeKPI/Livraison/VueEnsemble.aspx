<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="VueEnsemble.aspx.vb" Inherits="UIWebeKPI.VueEnsemble" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
    <script src="../Scripts/highcharts.js" type="text/javascript"></script>
    <script src="../Scripts/VueEnsemble.js" type="text/javascript"></script>
    <style type="text/css">
        .RadioButtonListColloneTailleFixe tr td
        {
            width: 70px;
        }
    </style>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table width="100%" class="TablePrincipale">
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server">Livraison</asp:Label></h1>
                <h2>
                    <asp:Label ID="lblTitreSecondaire" runat="server">Vue d'ensemble</asp:Label></h2>
            </td>
        </tr>
        <tr>
            <td>
                <hr title="Filtres" />
                <table width="100%">
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="lblSite" Text="Site" />
                        </td>
                        <td colspan="2">
                            <asp:RadioButtonList runat="server" ID="rblSite" RepeatDirection="Horizontal" CssClass="RadioButtonListColloneTailleFixe">
                                <asp:ListItem Text="Aucun" Value="0" Selected="True" />
                                <asp:ListItem Text="IB" Value="1" />
                                <asp:ListItem Text="IC" Value="2" />
                                <asp:ListItem Text="IL" Value="3" />
                            </asp:RadioButtonList>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="lblTypeCommande" Text="Type de commande" />
                        </td>
                        <td colspan="2">
                            <asp:RadioButtonList runat="server" ID="rblTypeCommande" RepeatDirection="Horizontal" CssClass="RadioButtonListColloneTailleFixe">
                                <asp:ListItem Text="Standart" Value="1" Selected="True" />
                                <asp:ListItem Text="Pack" Value="2" />
                            </asp:RadioButtonList>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="lblBlocageClient" Text="Blocage client" />
                        </td>
                        <td>
                            <asp:RadioButtonList runat="server" ID="rblBlocageClient" RepeatDirection="Horizontal" CssClass="RadioButtonListColloneTailleFixe">
                                <asp:ListItem Text="Toutes" Value="0" Selected="True" />
                                <asp:ListItem Text="Avec" Value="1" />
                                <asp:ListItem Text="Sans" Value="2" />
                            </asp:RadioButtonList>
                        </td>
                        <td rowspan="2" valign="bottom" align="right">
                            <input type="button" id="btnRechercher" value="Rechercher" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <asp:Label runat="server" ID="lblIndicateur" Text="Indicateur" />
                        </td>
                        <td colspan="2">
                            <asp:RadioButtonList runat="server" ID="rblIndicateurStandart" RepeatDirection="Horizontal" CssClass="RadioStandart RadioButtonListColloneTailleFixe">
                                <asp:ListItem Text="[-2;+0]" Value="0" Selected="True" />
                                <asp:ListItem Text="[-2;+2]" Value="1" />
                            </asp:RadioButtonList>
                            <asp:RadioButtonList runat="server" ID="rblIndicateursStock" RepeatDirection="Horizontal" CssClass="RadioStock RadioButtonListColloneTailleFixe">
                                <asp:ListItem Text="[-0;+0]" Value="0" Selected="True"/>
                                <asp:ListItem Text="[-0;+1]" Value="1" />
                            </asp:RadioButtonList>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <hr />
                <div id="graphique"></div>
            </td>
        </tr>
    </table>
    <asp:HiddenField runat="server" ID="hdnInfoGraphique" />
</asp:Content>
