<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Preferences.aspx.vb" Inherits="UIWebeKPI.Preferences" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ Register src="ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
<table id="Heading" width="100%">
        <tr>
            <td><h1>
                <asp:Label ID="lblTitreGlobal" runat="server" Text="Administration" 
                    meta:resourcekey="lblTitreGlobalResource"></asp:Label></h1></td>
        </tr>
        <tr>
            <td> <h2>
                <asp:Label ID="lblTitre" runat="server" Text="Préférence" 
                    meta:resourcekey="lblTitreResource"></asp:Label></h2></td>
        </tr>
        <tr>
            <td align="left" style="padding-left:10px" colspan="3" >
                <uc1:validatorsummarycontrol  ID="wcuNotification" runat="server" 
                    CssClass="texterouge" />    
            </td> 
        </tr>
   </table>
   <table id="tblPreference" runat="server">
        <tr>
            <td><asp:Label ID="lblLangue" runat="server" Text="Langue" Width="250px"
                    meta:resourcekey="lblLangueResource"></asp:Label></td>
            <td><asp:DropDownList ID="ddlLangue" runat="server" Width="205px" 
                    meta:resourcekey="ddlLangueResource"></asp:DropDownList></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><asp:Label ID="lblPageAccueil" runat="server" Text="Page d'accueil" Width="250px"
                    meta:resourcekey="lblPageAccueilResource"></asp:Label></td>
            <td><asp:DropDownList ID="ddlPageAccueil" runat="server" Width="205px" 
                    meta:resourcekey="ddlPageAccueilResource"></asp:DropDownList></td>
            <td></td>
            <td></td>
        </tr>
        <tr><td></td></tr>
        <tr>
            <td align="right" colspan="3">
                <asp:Button ID="btnValider" runat="server" Text="Valider" Width="70px" 
                    meta:resourcekey="btnValiderResource" />
            </td>
        </tr>
   </table>

</asp:Content>
