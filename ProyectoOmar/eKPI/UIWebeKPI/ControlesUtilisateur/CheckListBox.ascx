<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="CheckListBox.ascx.vb" Inherits="UIWebeKPI.CheckListBox" %>
<link href="../Styles/eKPI.css" type="text/css" rel="stylesheet" />
 <div style="height:132px; overflow-x: hidden; overflow-y: scroll;" >
                <asp:CheckBoxList ID="cblCollection" runat="server"
                    DataTextField="Description" DataValueField="ID" Width="100%" Height="15%">
                </asp:CheckBoxList>
</div>

