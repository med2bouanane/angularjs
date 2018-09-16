<%@ Page Title="" Language="vb" AutoEventWireup="false" CodeBehind="Configuration.aspx.vb" MasterPageFile="~/Site.Master" Inherits="UIWebeKPI.Configuration" culture="auto" meta:resourcekey="PageResource1" uiculture="auto" %>
<asp:Content ID="cttHeader" ContentPlaceHolderID="cphEnTete" runat="server">
        <title>Configuration</title>
</asp:Content>
<asp:Content ID="cttContenu" ContentPlaceHolderID="cphContenu" runat="server">
    <table style='width:100%; padding-left: 10px; padding-right: 10px; padding-top: 5px'>
			<tr>
				<td height="38"><h1>
                    <asp:Label ID="lblSousTitre" runat="server" 
                        meta:resourcekey="lblSousTitreResource1" Text="
                    &lt;span&gt;Configuration supported&lt;/span&gt;"></asp:Label></h1>
                </td>
			</tr>
			<tr>
                <td width="582" align="left" valign="middle" >
                <asp:Label ID="lblTextConfidencialite" runat="server" 
                        meta:resourcekey="lblTextConfidencialiteResource1" >              
                </asp:Label>
				</td>
			</tr>
		</table>
</asp:Content>
