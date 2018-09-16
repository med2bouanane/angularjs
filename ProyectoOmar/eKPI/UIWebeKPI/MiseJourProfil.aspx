<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="MiseJourProfil.aspx.vb" Inherits="UIWebeKPI.MiseJourProfil" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ Register src="~/ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
<table id="tblHead" width="100%">
        <tr>
            <td>
                <h1>
                    <asp:Label ID="lblTitreGlobal" runat="server" meta:resourcekey="lblTitreGlobalResource1">Administration</asp:Label></h1>
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

    <table id="tblMiseAjourProfil" runat="server" >
        <tr>
            <td style="width: 200px;">
                <asp:Label ID="lblLoginEmailLibelle" runat="server" meta:resourcekey="lblLoginEmailLibelleResource1">Login</asp:Label>
            </td>
            <td>
                <asp:Label ID="lblLogin" runat="server" meta:resourcekey="lblLoginEmailResource1" CssClass="zonetxtgris2"></asp:Label>
            </td>
        </tr>
        <tr>
		    <td valign="top"  style="padding-top:2px; width:150px">
                <asp:label ID="lblTitre" runat="server" Text="Title" meta:resourcekey="lblTitreResource1"  ></asp:label>
            </td>
		    <td valign="top">
                <asp:RadioButton ID="rbtM" runat="server" Text="Sir" 
                        GroupName="Title" meta:resourcekey="rbtMResource1"/>   &nbsp;&nbsp;
                <asp:RadioButton ID="rbtMme" runat="server" Text="Mme" 
                        GroupName="Title" meta:resourcekey="rbtMmeResource1" /> &nbsp; &nbsp;  
                <asp:RadioButton ID="rbtMlle" runat="server" Text="Ms" 
                        GroupName="Title" meta:resourcekey="rbtMlleResource1"/>
            </td>
	    </tr>
        <tr>
			<td valign="top" style="padding-top:2px; width:150px"><asp:label ID="lblNom" runat="server" Text="Name" meta:resourcekey="lblNomResource1"
                    ></asp:label></td>
			<td valign="top">
                <asp:textbox id="txtNom" runat="server" Width="350px" cssclass="zonetxtoblig"
                    meta:resourcekey="txtNomResource1"></asp:textbox>
                <asp:requiredfieldvalidator id="rfvNom" runat="server" 
                            ControlToValidate="txtNom" CssClass="texterouge"  ErrorMessage="Fields marked with * are required"
                            meta:resourcekey="rfvNomResource1" >*</asp:requiredfieldvalidator>
           </td>
		</tr>
		<tr>
			<td valign="top" style="padding-top:2px; width:150px">
                <asp:label ID="lblPrenom" runat="server" Text="First name" meta:resourcekey="lblPrenomResource1"
                    ></asp:label>
                                                        
                </td>
			<td valign="top">
                <asp:textbox id="txtPrenom" runat="server" cssclass="zonetxtoblig"
                    Width="350px" meta:resourcekey="txtPrenomResource1"></asp:textbox>
                <asp:requiredfieldvalidator id="rfvPrenom" runat="server" 
                            ControlToValidate="txtPrenom" CssClass="texterouge"  ErrorMessage="Fields marked with * are required"
                            meta:resourcekey="rfvPrenomResource1" >*</asp:requiredfieldvalidator>

            </td>
		</tr>
		<tr>
			<td valign="top" style="padding-top:2px; width:150px">
                <asp:label ID="lblFonction" runat="server" Text="Occupation" meta:resourcekey="lblFonctionResource1"
                    ></asp:label>
            </td>
			<td valign="top">
                <asp:textbox id="txtFonction" runat="server" 
                    Width="350px" meta:resourcekey="txtFonctionResource1"></asp:textbox></td>
		</tr>
        <tr>
			<td valign="top" style="padding-top:2px; width:150px"><asp:label ID="lblEmail" runat="server" meta:resourcekey="lblEmailResource1"
                    Text="Email" ></asp:label></td>
			<td valign="top">
                <asp:textbox id="txtEmail" runat="server"  cssclass="zonetxtoblig"
                Width="350px" meta:resourcekey="txtEmailResource1"></asp:textbox>
                <asp:requiredfieldvalidator id="rfvEmail" runat="server" 
                            ControlToValidate="txtEmail" CssClass="texterouge" 
                            meta:resourcekey="rfvEmailResource1" ErrorMessage="Fields marked with * are required">*</asp:requiredfieldvalidator>
                <asp:regularexpressionvalidator id="revDestinataires" runat="server" 
                            CssClass="texterouge" ControlToValidate="txtEmail"
							ErrorMessage="One or more fields do not meet the required format"
                            ValidationExpression="(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*;)*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$" 
                            meta:resourcekey="revDestinatairesResource1" >*</asp:regularexpressionvalidator></td>
		</tr>
        <tr>
			<td valign="top"><asp:label ID="lblPhone" runat="server" 
                    Text="Phone" meta:resourcekey="lblPhoneResource1"></asp:label></td>
			<td valign="top">
                <asp:textbox id="txtTelephone" runat="server" 
                    Width="350px" meta:resourcekey="txtTelephoneResource1"></asp:textbox></td>
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
