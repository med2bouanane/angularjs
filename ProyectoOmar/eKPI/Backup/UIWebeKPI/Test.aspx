<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Test.aspx.vb" Inherits="UIWebeKPI.Test" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphEnTete" runat="server">
    <script src="Scripts/Test.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphContenu" runat="server">
    
    <asp:TextBox ID="txtNombre1" runat="server" /> + <asp:TextBox ID="txtNombre2" runat="server" />

    <br />

    <asp:TextBox ID="txtResultat" runat="server" />

    <br />

    <input id="btnTest" type="button" value="Calculer" />


</asp:Content>
