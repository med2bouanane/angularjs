<%@ Page Title="" Language="vb" AutoEventWireup="false" CodeBehind="Confidentialite.aspx.vb" MasterPageFile="~/Site.Master" Inherits="UIWebeKPI.Confidentialite" culture="auto" meta:resourcekey="PageResourceFr" uiculture="auto" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
    <title>eKPI</title>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table style='width:100%; padding-left: 10px; padding-right: 10px; padding-top: 5px'>
            <tr>
                <td colspan = "3" >
                    <h1><asp:Label ID="lblTitreGlobal" runat="server" 
                            meta:resourcekey="lblTitreGlobalResource1">      
                    </asp:Label></h1>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblTextConfidencialite" runat="server"
                        meta:resourcekey="lblTextConfidencialiteResource1">
                    </asp:Label>
                </td>
              </tr>
         </table>
</asp:Content>
