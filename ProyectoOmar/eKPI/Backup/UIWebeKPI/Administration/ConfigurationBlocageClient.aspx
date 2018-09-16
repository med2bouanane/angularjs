<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="ConfigurationBlocageClient.aspx.vb" Inherits="UIWebeKPI.ConfigurationBlocageClient" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
    <link href="../Styles/jquery-ui-1.8.14.custom.css" rel="stylesheet" type="text/css" />
    <link href="../Styles/jquery.colorbox.css" rel="stylesheet" type="text/css" />
    <script src="../Scripts/jquery.colorbox-min.js" type="text/javascript"></script>
    <script src="../Scripts/Accordeon.js" type="text/javascript"></script>
    <script src="../Scripts/CaseCocheHistorique.js" type="text/javascript"></script>
    <script src="../Scripts/ConfigurationBlocageClient.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table>
        <tr>
            <td>
                <h1><asp:Label runat="server" ID="lblTitreGlobal" Text="Administration"/></h1>
                <h2><asp:Label runat="server" ID="lblTitreSecondaire" Text="Configuration du blocage client" /></h2>
            </td>
        </tr>
        <tr>
            <td>
                <div class="accordeon">
                    <div class="accordeonEnTete">
                        <img src="../Images/flechebas.gif" alt="" height="14" width="12" /><asp:Label runat="server" ID="lblVersionActuelle" Text="Version actuelle"></asp:Label>
                    </div>
                    <div class="accordeonContenu" id="divActuel" >
                        <table width="100%">
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
                            <tr>
                                <td colspan="2">
                                    <asp:Button runat="server" id="btnValider" Text="Valider" />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="accordeonEnTete">
                        <img src="../Images/flechebas.gif" alt="" height="14" width="12" /><asp:Label runat="server" ID="Label1" Text="Historique"></asp:Label>
                    </div>
                    <div class="accordeonContenu">
                        <input type="button" id="btnAfficherDetailHistorique" value="Afficher" />
                        <asp:GridView runat="server" ID="gvwHistoriqueBlocageClient" AutoGenerateColumns="false" CssClass="DatagridItemStyle" 
                            AlternatingRowStyle-CssClass="DatagridAlternatingItemStyle" HeaderStyle-CssClass="DatagridHeader" Width="100%" >
                            <Columns>
                                <asp:TemplateField>
                                    <ItemTemplate>
                                        <asp:CheckBox runat="server" ID="chkSelection" CssClass="CaseCocheHistorique" />
                                        <asp:HiddenField runat="server" ID="hdnIdHistoriqueBlocageClient" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField>
                                    <HeaderTemplate>
                                        <asp:Label runat="server" ID="lblTitreDate" Text="Date" />
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <asp:Label runat="server" ID="lblDate" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField>
                                    <HeaderTemplate>
                                        <asp:Label runat="server" ID="lblTitreDescription" Text="Description" />
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <asp:Label runat="server" ID="lblDescription" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:TemplateField>
                                    <HeaderTemplate>
                                        <asp:Label runat="server" ID="lblTitreIdentifiant" Text="Identifiant" />
                                    </HeaderTemplate>
                                    <ItemTemplate>
                                        <asp:Label runat="server" ID="lblIdentifiant" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                            </Columns>
                        </asp:GridView>
                    </div>
                    <input type="text" class="accordeonConfiguration" value="DeployerTout=0;OuvertureMultiple=1;" />
                    <input type="text" class="accordeonOuverture" value="divActuel" />
                </div>

            </td>
        </tr>
    </table>
    

</asp:Content>
