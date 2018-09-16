<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="EncodageRetardsProfonds.aspx.vb" Inherits="UIWebeKPI.RetardsProfonds" MasterPageFile="~/Site.Master" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
<table width="100%" class="TablePrincipale">
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server">Livraison</asp:Label></h1>
                <h2>
                    <asp:Label ID="lblTitreSecondaire" runat="server">Encodages retards profonds</asp:Label></h2>
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
<%--                            <input id="rbtTous" type="radio" checked="checked" />
                            <label for="rbtTous" >Tous</label>--%>
                            <input id="rbtIB" type="radio" />
                            <label for="rbtIB" >IB</label>
                            <input id="rbtIC" type="radio" />
                            <label for="rbtIC" >IC</label>
                            <input id="rbtIL" type="radio" />
                            <label for="rbtIL" >IL</label>
                        </td>
                    </tr>
                    <%--<tr>
                        <td>
                            <asp:Label runat="server" ID="lblBlocageClient" Text="Blocage client" />
                        </td>
                        <td>
                            <input id="rbtToutes" type="radio"  checked="checked" />
                            <label for="rbtToutes" >Toutes</label>
                            <input id="rbtSans" type="radio" />
                            <label for="rbtSans" >Sans</label>
                        </td>
                        <td rowspan="2" valign="bottom" align="right">
                            <asp:Button runat="server" ID="btnRechercher" Text="Rechercher" />
                        </td>
                    </tr>--%>
                </table>
            </td>
        </tr>
            <tr>
                <td>
                    <asp:Button ID= "btnAjouter" runat ="server" Text="Ajouter" />
                    <asp:Button ID= "btnEditer" runat ="server" Text="Editer"/>
                    <asp:Button ID= "btnEliminer" runat ="server" Text="Supprimer"/>
                </td>
            </tr>
            <tr>
            <td>
                <asp:GridView runat="server" ID="gvwAccuse" AutoGenerateColumns="false" AllowPaging="true" Width="100%">
                    <Columns>
                        <asp:BoundField DataField="Période" HeaderText="Période" />
                        <asp:BoundField DataField="Tonnage" HeaderText="Tonnage" />
                        <asp:BoundField DataField="TonnageSansBlocage" HeaderText="Tonnage sans blocage" />
                    </Columns>
                </asp:GridView>
            </td>
        </tr>
    </table>
</asp:Content>