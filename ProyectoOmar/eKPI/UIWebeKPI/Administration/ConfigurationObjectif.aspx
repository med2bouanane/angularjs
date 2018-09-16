<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="ConfigurationObjectif.aspx.vb" Inherits="UIWebeKPI.ConfigurationObjectif" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
    <link href="../Styles/jquery-ui-1.8.14.custom.css" rel="stylesheet" type="text/css" />
    <link href="../Styles/jquery.colorbox.css" rel="stylesheet" type="text/css" />
    <script src="../Scripts/jquery.colorbox-min.js" type="text/javascript"></script>
    <script src="../Scripts/Accordeon.js" type="text/javascript"></script>
    <script src="../Scripts/CaseCocheHistorique.js" type="text/javascript"></script>
    <script src="../Scripts/ConfigurationObjectif.js" type="text/javascript"></script>
    <script src="../Scripts/Fonction.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table>
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server">Administration</asp:Label>
                </h1>
                <h2>
                    <asp:Label ID="lblTitreSecondaire" runat="server">Objectifs livraisons</asp:Label>
                </h2>
                <asp:ValidationSummary runat="server" />
            </td>
        </tr>
        <tr>
            <td>
                <div class="accordeon">
                    <div class="accordeonEnTete">
                         <img src="../Images/flechebas.gif" alt="" height="14" width="12" /><asp:Label runat="server" ID="lblVersionActuelle" Text="Version actuelle"></asp:Label>
                    </div>
                    <div class="accordeonContenu" id="divActuel">
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
                                    <asp:TextBox runat="server" ID="txtCommandeStandardMoinsDeuxPlusZero" CssClass="ChampNumeric zonetxtoblig" />
                                    <asp:RequiredFieldValidator runat="server" ID="rfvCommandeStandardMoinsDeuxPlusZero" ControlToValidate="txtCommandeStandardMoinsDeuxPlusZero" Text="*" />
                                </td>
                                <td>
                                    <asp:Label runat="server" ID="lblCommandePackMoinsZeroPlusZero" Text="Commandes pack [-2;+2]:" />
                                </td>
                                <td>
                                    <asp:TextBox runat="server" ID="txtCommandePackMoinsZeroPlusZero" CssClass="ChampNumeric zonetxtoblig" />
                                    <asp:RequiredFieldValidator runat="server" ID="rfvCommandePackMoinsZeroPlusZero" ControlToValidate="txtCommandePackMoinsZeroPlusZero" Text="*" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <asp:Label runat="server" ID="lblCommandeStandartMoinsDeuxPlusDeux" Text="Commandes standart [-2;+2]:" />
                                </td>
                                <td>
                                    <asp:TextBox runat="server" ID="txtCommandeStandardMoinsDeuxPlusDeux" CssClass="ChampNumeric zonetxtoblig" />
                                    <asp:RequiredFieldValidator runat="server" ID="rfvCommandeStandardMoinsDeuxPlusDeux" ControlToValidate="txtCommandeStandardMoinsDeuxPlusDeux" Text="*" />
                                </td>
                                <td>
                                    <asp:Label runat="server" ID="lblCommandePackMoinsZeroPlusUn" Text="Commandes pack [-0;+1]:" />
                                </td>
                                <td>
                                    <asp:TextBox runat="server" ID="txtCommandePackMoinsZeroPlusUn" CssClass="ChampNumeric zonetxtoblig" />
                                    <asp:RequiredFieldValidator runat="server" ID="rfvCommandePackMoinsZeroPlusUn" ControlToValidate="txtCommandePackMoinsZeroPlusUn" Text="*" />
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4"><asp:Button runat="server" ID="btnValider" Text="Valider" /></td>
                            </tr>
                        </table>
                    </div>
                    <div class="accordeonEnTete">
                         <img src="../Images/flechebas.gif" alt="" height="14" width="12" /><asp:Label runat="server" ID="lblHistorique" Text="Historique"></asp:Label>
                    </div>
                    <div class="accordeonContenu">
                        <input type="button" id="btnAfficherDetailHistorique" value="Afficher" />
                        <asp:GridView runat="server" ID="gvwConfigurationObjectifLivraison" AutoGenerateColumns="false">
                            <Columns>
                                <asp:TemplateField>
                                    <ItemTemplate>
                                        <asp:CheckBox runat="server" ID="chkSelection" CssClass="CaseCocheHistorique" />
                                        <asp:HiddenField runat="server" ID="hdnIdConfigurationObjectifLivraison" />
                                    </ItemTemplate>
                                </asp:TemplateField>
                                <asp:BoundField HeaderText="" DataField="DateCreation" />
                                <asp:BoundField HeaderText="Description" DataField="Description" />
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

                    <input type="text" class="accordeonConfiguration" value="DeployerTout=1;OuvertureMultiple=1;" />
                    <input type="text" class="accordeonOuverture" value="divActuel" />
                </div>
            </td>
        </tr>
    </table>
    
</asp:Content>
