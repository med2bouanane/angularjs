<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master"
    CodeBehind="Contact.aspx.vb" Inherits="UIWebeKPI.Contact" Culture="auto" meta:resourcekey="PageResource1"
    UICulture="auto" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table style='width: 100%; padding-left: 10px; padding-right: 10px; padding-top: 5px'>
        <tr class="titre">
            <td colspan="2">
                <h1><asp:Label ID="lblTitreGlobal" runat="server" meta:resourcekey="lblTitreGlobalResource1" Text="Contact">
                </asp:Label></h1>
            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding-right: 10px">
                <h2><asp:Label ID="lblTitreOperateur" runat="server"  
                    meta:resourcekey="lblTitreOperateurResource1" Font-Names="Arial" 
                     Text="Contact opérateur">
                 </asp:Label></h2>
            </td>
        </tr>
        <tr>

        <td colspan ="3">
            <asp:Repeater ID="dlsOperateur" runat="server">
                <ItemTemplate>
                    <table style="width: 100%">
                        <tr class="Contenu">
                            <td align="center" width="92" style="padding-top: 5px; padding-left: 5px; padding-bottom: 1px">
                                <img id="imgContact" alt="" src="" height="150" width="120"
                                    border="1" style="color: Black" runat="server"/>
                            </td>
                            <td width="215" style="padding-left: 4px; padding-top: 4px" valign="top">
                                <span style="font-weight: bolder">
                                    <br />
                                    <asp:Label ID="lblNomOperateur" runat="server" meta:resourcekey="lblNomOperateurResource1"></asp:Label>wx<br />
                                    <br />
                                </span>
                                <asp:Label ID="lblDescription" runat="server" meta:resourcekey="lblDescriptionResource1"></asp:Label><br />
                                <table>
                                    <tr>
                                        <td>
                                            <asp:Label ID="lblOperateurTelephoneLibelle" runat="server" meta:resourcekey="lblOperateurTelephoneLibelleResource1">Téléphone</asp:Label>
                                        </td>
                                        <td>
                                            :
                                        </td>
                                        <td>
                                            <asp:Label ID="lblOperateurTelephone" runat="server" meta:resourcekey="lblOperateurTelephoneResource1"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="lblOperateurFaxLibelle" runat="server" meta:resourcekey="lblOperateurFaxLibelleResource1">Fax</asp:Label>
                                        </td>
                                        <td>
                                            :
                                        </td>
                                        <td>
                                            <asp:Label ID="lblOperateurFax" runat="server" meta:resourcekey="lblOperateurFaxResource1"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="lblOperateurGsmLibelle" runat="server" meta:resourcekey="lblOperateurGsmLibelleResource1">GSM</asp:Label>
                                        </td>
                                        <td>
                                            :
                                        </td>
                                        <td>
                                            <asp:Label ID="lblOperateurGsm" runat="server" meta:resourcekey="lblOperateurGsmResource1"></asp:Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="lblOperateurEmailLibelle" runat="server" meta:resourcekey="lblOperateurEmailLibelleResource1">E-mail</asp:Label>
                                        </td>
                                        <td>
                                            :
                                        </td>
                                        <td style='width: 100%'>
                                            <asp:Label ID="lblOperateurEmail" runat="server" meta:resourcekey="lblOperateurEmailResource1"></asp:Label>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td class="BordDroitContenu">
                                &nbsp;
                            </td>
                        </tr>
                    </table>
                </ItemTemplate>
            </asp:Repeater>
        </td>
        </tr>
        
        <tr class="titre">
            <td colspan="2" style="padding-right: 10px">
                <h2><asp:Label ID="lblTitreHelpdesk" runat="server" meta:resourcekey="lblTitreHelpdeskResource1" Font-Names="Arial"  Text="Contact technique" >
                </asp:Label></h2>          
            </td>
        </tr>
        <tr class="Contenu">
            <td align="left"  style="padding-top: 5px; padding-left: 5px; padding-bottom: 1px">
                <img id="img1" alt="" width="92px" height="92px" src="Images/helpdesk.jpg" border="1"
                    style="color: Black;" />
            </td>
            <td style="padding-left: 4px; padding-top: 4px" valign="top">
                <asp:Label ID="lblHelpdeskMessage" runat="server" meta:resourcekey="lblHelpdeskMessageResource1">

                </asp:Label>
                <tr>
                    <td>
                    </td>
                    <td style="padding-left: 4px;">
                        <asp:Label ID="lblHelpDescEmailLibelle" runat="server" meta:resourcekey="lblHelpDescEmailLibelleResource1">Email</asp:Label>: 
                        <a style="color:Black" href="mailto:helpdesk.industeelweb@arcelormittal.com">helpdesk.industeelweb@arcelormittal.com</a>
                    </td>
                </tr>
            </td>
        </tr>
    </table>
</asp:Content>
