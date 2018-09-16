<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Suggestions.aspx.vb" Inherits="UIWebeKPI.Suggestions" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<%@ Register src="ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">

<table style='width: 100%; padding-left: 10px; padding-right: 10px; padding-top: 5px'>   
    <tr>
        <td>
	        <table width="100%" id="tblEntete" runat="server">
				    <tr>
					    <td height="38" colspan="4"><h1><asp:Label ID="lblTitreGlobal" runat="server" 
                                meta:resourcekey="lblTitreGlobalResource1" >Suggestion</asp:Label></h1>
                        </td>
				    </tr>
				    <tr>
                    <td colspan="4">
                        <div id="divNotification" style="padding-left:10px" >
                            <uc1:ValidatorSummaryControl ID="wcuNotification" runat="server" Visible="true"  />
                        </div>
                    </td>
                    </tr>
             </table>
         </td>
    </tr>
    <tr>
        <td>
        <table width="100%" id="tblVueNoConecte" runat="server">
                <tr>
					<td valign="top" style='width:200px'>
                        <asp:label ID="lblTitre" runat="server" meta:resourcekey="lblTitreResource1"> Title</asp:label>
                    </td>
					<td colspan="2" valign="top">
                    <div>
                        <asp:RadioButton ID="rbtM" runat="server" Text="Sir" Checked ="true"  
                            meta:resourcekey="rbtMResource1" GroupName="Title" />   &nbsp;&nbsp;
                        <asp:RadioButton ID="rbtMme" runat="server" Text="Mme" 
                            meta:resourcekey="rbtMmeResource1" GroupName="Title"/> &nbsp; &nbsp;  
                        <asp:RadioButton ID="rbtMlle" runat="server" Text="Ms" 
                            meta:resourcekey="rbtMlleResource1" GroupName="Title"/>
                    </div>
                    </td>
				</tr>
                <tr>
					<td valign="top"><asp:label ID="lblNom" runat="server" 
                            meta:resourcekey="lblNomResource1">Name</asp:label></td>
					<td colspan="2" valign="top">
                        <asp:textbox id="txtNom" runat="server" cssclass="zonetxtoblig" Width="350px"></asp:textbox>
                        <asp:requiredfieldvalidator id="rfvNom" runat="server" 
                            ControlToValidate="txtNom" CssClass="texterouge"  ErrorMessage="Fields marked with * are required"
                            meta:resourcekey="rfvNomResource1" >*</asp:requiredfieldvalidator>
                    </td>
				</tr>
				<tr>
					<td valign="top"><asp:label ID="lblPrenom" runat="server" 
                            meta:resourcekey="lblPrenomResource1">First name</asp:label></td>
					<td colspan="2" valign="top"><asp:textbox id="txtPrenom" runat="server" 
                            Width="350px"></asp:textbox></td>
				</tr>
				<tr>
					<td valign="top"><asp:label ID="lblFonction" runat="server" 
                            meta:resourcekey="lblFonctionResource1">Fonction</asp:label></td>
					<td colspan="3" valign="top"><asp:textbox id="txtFonction" runat="server" 
                            Width="350px"></asp:textbox></td>
				</tr>
                <tr>
					<td valign="top"><asp:label ID="lblEmail" runat="server" 
                            meta:resourcekey="lblEmailResource1">EMail</asp:label></td>
					<td colspan="2" valign="top"><asp:textbox id="txtEmail" runat="server" 
                            cssclass="zonetxtoblig" Width="350px"></asp:textbox>
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
                            meta:resourcekey="lblPhoneResource1">Phone</asp:label></td>
					<td colspan="2" valign="top"><asp:textbox id="txtTelephone" runat="server" 
                            Width="350px"></asp:textbox></td>
				</tr>
                <tr>
					<td valign="top"><asp:label ID="lblLanguage" runat="server" 
                            meta:resourcekey="lblLanguageResource1">Language</asp:label></td>
					<td colspan="2" valign="top">
                        <asp:DropDownList ID="ddlLangue" runat="server" 
                            meta:resourcekey="ddlLangueResource1" Width="356px">
                            <asp:ListItem Value="fr" meta:resourcekey="ListItemResource1">Français</asp:ListItem>
                            <asp:ListItem Value="en" meta:resourcekey="ListItemResource2">Anglais</asp:ListItem>
                        </asp:DropDownList>
                    </td>
				</tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
        <table width="100%" id="tblVueConecte" runat="server">
                <tr>
					<td  valign="top" style='width:200px'><asp:label ID="lblSubject" runat="server" 
                            meta:resourcekey="lblSubjectResource1">Subject</asp:label></td>
					<td colspan="2" valign="top"><asp:TextBox id="txtSujet" runat="server" 
                            MaxLength="2147483647" CssClass="zonetxtoblig" Width="350px"></asp:TextBox>
                        <asp:requiredfieldvalidator id="rfvSujet" runat="server" 
                            ControlToValidate="txtSujet" CssClass="texterouge" 
                            meta:resourcekey="rfvSujetResource1" ErrorMessage="Fields marked with * are required">*</asp:requiredfieldvalidator></td>
				</tr>
				<tr>
					<td valign="top"><asp:label ID="lblMessage" runat="server" 
                            meta:resourcekey="lblMessageResource1">Message</asp:label></td>
					<td   valign="top" style="padding-right:50px"  >
                        <asp:textbox  id="txtMessage" runat="server" 
                            TextMode="MultiLine" Rows="5" Columns="60" Width="100%"></asp:textbox></td>
				</tr>
				<tr>
					<td>&nbsp;</td>
                    <td align="right" style="padding-right:44px" >
                    <asp:button id="btnEnvoyer" runat="server" Text="Send Message" 
                    colspan="2" meta:resourcekey="btnEnvoyerResource1"></asp:button></td>	
				</tr>

			</table>
        </td>
    </tr>
</table>
</asp:Content>
