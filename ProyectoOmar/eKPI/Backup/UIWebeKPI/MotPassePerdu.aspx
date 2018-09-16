<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="MotPassePerdu.aspx.vb" Inherits="UIWebeKPI.MotPassePerdu" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ Register src="~/ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>

<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
   	<script type="text/javascript" src="../Scripts/Inscription.js"></script>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table id="Heading" width="100%">
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server" meta:resourcekey="lblTitreGlobalResource1" 
                        >Lost your password ?</asp:Label></h1>
            </td>
        </tr>
    </table>
    <br />
     <table style="width: 80%">
        <tr>
            <td colspan="3">
                <asp:Label ID="lblTexteExplicatif" runat="server" meta:resourcekey="lblTexteExplicatifResource1" 
                    >You can enter your address here to redefine your password, an email will be sent to this address.<br /> You can find a link in this email which allows you to set a new password.</asp:Label>
            <br />
            </td>
        </tr>
        <tr>
            <td align="left" style="padding-left:10px" colspan="3" >
                <uc1:ValidatorSummaryControl  ID="wucInscription" runat="server" 
                    CssClass="texterouge" />    
            </td> 
        </tr>
        <tr id="trLoginEmail" runat="server" >
            <td>
                <asp:RadioButton ID="rbtIdentifiant" runat="server" Checked="True" 
                    GroupName="typeUtilisateur" Text="Login" 
                    meta:resourcekey="rbtIdentifiantResource1" />   &nbsp;&nbsp;
                <asp:RadioButton ID="rbtAdressEmail" runat="server" GroupName="typeUtilisateur" 
                    Text="Email" meta:resourcekey="rbtAdressEmailResource1"    />
            </td>
            <td style="text-align:center;">
                <asp:TextBox ID="txtIdentificacion" runat="server" Width="300px" meta:resourcekey="txtIdentificacionResource1" 
                    ></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvEmail"
                        runat="server" Text="*" CssClass="texterouge" Display="Dynamic"  
                    ControlToValidate="txtIdentificacion" meta:resourcekey="rfvEmailResource1"></asp:RequiredFieldValidator>
<%--                <asp:RegularExpressionValidator ID="revEmail" runat="server" 
                    ControlToValidate="txtIdentificacion" Text=" * " ForeColor="#FF3700"
                 ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"  
                    Display="Dynamic" meta:resourcekey="revEmailResource1" ></asp:RegularExpressionValidator>--%>
                    <asp:CustomValidator ID="cuvMotPasseAccesValidation" runat="server" ControlToValidate="txtIdentificacion"
                     ClientValidationFunction="ValiderEmail" CssClass="texterouge" meta:resourcekey ="cuvMotPasseAccesValidationResource1">*</asp:CustomValidator> 
            </td>
            <td>
                <asp:Button ID="btnValider" runat="server" Text="Validate" meta:resourcekey="btnValiderResource1" 
                     />
            </td>
        </tr>
    </table>
</asp:Content>
