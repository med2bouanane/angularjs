<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Index.aspx.vb" Inherits="UIWebeKPI.Index" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ MasterType virtualpath="~/Site.Master" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <article>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%">
        <tr>
            <td rowspan="2" class="ImageIdentification">&nbsp;</td>
            <td colspan="3" class="EnteteIdentification">
            <h4><asp:Label ID="lblTitre" runat="server" Text="Bienvenue sur e-KPI" 
                    meta:resourcekey="lblTitreResource1" ></asp:Label></h4> <br />
            <div style="padding-top:10px">
                <asp:Label ID="lblSiteWeb" Font-Bold="True" Font-Size="11pt" runat="server" 
                    Text="Votre site web sécurisé pour accéder aux KPI offerts par Industeel. <br />Ce site vous donne accès aux KPI suivants:" 
                    meta:resourcekey="lblSiteWebResource1" ></asp:Label> <br />
            </div>
            <div style="padding-top:10px; padding-left:25px">
                 <asp:Label ID="lblDescription" Font-Bold="True" Font-Size="10pt" runat="server" 
                     meta:resourcekey="lblDescriptionResource1">
                ▪­ Livraison<br />
                ▪­ Documentation (à venir)<br />
                ▪­ Produit (à venir)<br />
                ▪­ Offre (à venir)<br />
                ▪­ Satisfaction (à venir)
                </asp:Label>
            </div>
           
            </td>
        </tr>
        <tr valign="bottom">
            <td style="padding-left:20px; padding-bottom:10px;width:100px"><asp:Label ID="lblDate"
                    Font-Bold="True" runat="server" meta:resourcekey="lblDateResource1"></asp:Label></td>
            <td   align="center" >
                <h4><asp:Label ID="lblFournisseurPrefere"
                    runat="server" Text="Etre le fournisseur préféré <br />de plaques spéciales !" 
                    meta:resourcekey="lblFournisseurPrefereResource1"></asp:Label></h4>
            </td>
            <td class="LogoCapclient" align="right" style="width:110px" >&nbsp;</td>
        </tr>
        <tr>
            <td colspan="4" class="PiedPageIdentification">
            &nbsp;
            </td>
        </tr>
    </table>
  </article>
</asp:Content>
