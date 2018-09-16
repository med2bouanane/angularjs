<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Conditions.aspx.vb" Inherits="UIWebeKPI.Conditions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
        <link rel="stylesheet" href="Styles/stock.css" type="text/css" media="screen" />
        <style type="text/css">
        p
        {
            margin:0;
            padding:0;
            border:0;
        }
        
        body
        {
            background-color:White;    
        }
        
        h1
        {
            margin:0;
            padding:0;
            border:0; 
        }
    </style>
</head>
<body>
    <div style="height:390px; width:100%; overflow:auto;">
        <asp:Label ID="lblConditions" runat="server"></asp:Label>
    </div>
</body>
</html>