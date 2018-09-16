<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Redefinition.aspx.vb" Inherits="UIWebeKPI.Redefinition" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ Register src="ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table id="tblHead" width="100%">
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server" meta:resourcekey="lblTitreGlobalResource1">New password</asp:Label></h1>
            </td>
        </tr>
        <tr>
            <td>
                <h2>
                    <asp:Label ID="lblTitreSecondaire" runat="server" meta:resourcekey="lblTitreSecondaireResource1">Update Profile</asp:Label></h2>
            </td>
        </tr>
        <br />
        <tr>
            <td align="left" style="padding-left:10px" colspan="3" >
                <uc1:validatorsummarycontrol  ID="wcuNotification" runat="server" 
                    CssClass="texterouge" />    
            </td> 
        </tr>
    </table>
    
    <table id="tblNouveauMotPasse" runat="server">
        <tr>
            <td style="width: 200px;">
                <asp:Label ID="lblLoginEmailLibelle" runat="server" meta:resourcekey="lblLoginEmailLibelleResource1">Login</asp:Label>
            </td>
            <td>
                <asp:Label ID="lblLogin" runat="server" meta:resourcekey="lblLoginEmailResource1" CssClass="zonetxtgris2"></asp:Label>
            </td>
        </tr>
        <tr>
            <td>
                <asp:Label ID="lblAncienMotPasse" runat="server" meta:resourcekey="lblAncienMotPasseResource1">Old password</asp:Label>
            </td>
            <td>
                <asp:TextBox ID="txtAncienMotPasse" runat="server" TextMode="Password" Width="250px"
                    meta:resourcekey="txtAncienMotPasseResource1"  CssClass="zonetxtoblig" MaxLength="50"></asp:TextBox><asp:RequiredFieldValidator
                        ID="rfvAncienMotPasse" runat="server" Text=" * " ForeColor="#FF3700" Display="Dynamic"
                        ControlToValidate="txtAncienMotPasse" meta:resourcekey="rfvAncienMotPasseResource1"></asp:RequiredFieldValidator>
            </td>
        </tr>
        <tr>
            <td>
                <asp:Label ID="lblNouveauMotPasse" runat="server" meta:resourcekey="lblNouveauMotPasseResource1">New password</asp:Label>
            </td>
            <td>
                <asp:TextBox ID="txtNouveauMotPasse" runat="server" TextMode="Password" Width="250px"   CssClass="zonetxtoblig" MaxLength="50"
                    meta:resourcekey="txtNouveauMotPasseResource1"></asp:TextBox>
                <asp:CompareValidator ID="cpvNouveauMotPasse" runat="server" Text="*" ControlToValidate="txtNouveauMotPasse"
                    ControlToCompare="txtAncienMotPasse" Operator="NotEqual" ForeColor="#FF3700"
                    Display="Dynamic" meta:resourcekey="cpvNouveauMotPasseResource1"></asp:CompareValidator>
                <asp:RequiredFieldValidator ID="rfvNouveauMotPasse" runat="server"
                    Text=" * " ForeColor="#FF3700" Display="Dynamic" ControlToValidate="txtNouveauMotPasse"
                    meta:resourcekey="rfvNouveauMotPasseResource1"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="revMotPasse" runat="server" ControlToValidate="txtNouveauMotPasse"
                    ValidationExpression="^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$" ForeColor="#FF3700"
                    meta:resourcekey="revMotPasseResource1">*</asp:RegularExpressionValidator>
            </td>
        </tr>
        <tr>
            <td>
                <asp:Label ID="lblNouveauMotPasseConfirmation" runat="server" meta:resourcekey="lblNouveauMotPasseConfirmationResource1">Confirm new password</asp:Label>
            </td>
            <td>
                <asp:TextBox ID="txtNouveauMotPasseConfirmation" runat="server" TextMode="Password" CssClass="zonetxtoblig" MaxLength="50"
                    Width="250px" meta:resourcekey="txtNouveauMotPasseConfirmationResource1"></asp:TextBox>
                    <asp:RequiredFieldValidator
                        ID="rfvNouveauMotPasseConfirmation" runat="server" Text=" * " ForeColor="#FF3700"
                        Display="Dynamic" ControlToValidate="txtNouveauMotPasseConfirmation" meta:resourcekey="rfvNouveauMotPasseConfirmationResource1"> </asp:RequiredFieldValidator>
                    <asp:CompareValidator ID="cevConfirmacion" runat="server" Text="*" ForeColor="#FF3700"
                        ControlToValidate="txtNouveauMotPasseConfirmation" ControlToCompare="txtNouveauMotPasse"
                        meta:resourcekey="cevConfirmerPasseResource1"> </asp:CompareValidator>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: right; padding-right: 8px;">
                <asp:Button ID="btnValider" runat="server" Text="Validate" meta:resourcekey="btnValiderResource1" />
            </td>
        </tr>
        <tr>
            <td colspan="2">
            </td>
        </tr>
    </table>
</asp:Content>
