<%@ Control Language="vb" AutoEventWireup="false" CodeBehind="ValidatorSummaryControl.ascx.vb" Inherits="UIWebeKPI.ValidatorSummaryControl" %>
<link href="../Styles/eKPI.css" type="text/css" rel="stylesheet" />
<script language="javascript" type="text/javascript">
    $(document).ready(
    function () {
        ValidationSummaryOnSubmit = function (validationGroup) {
            if (typeof (Page_ValidationSummaries) == "undefined")
                return;
            var summary, sums, s;
            var headerSep, first, pre, post, end;
            for (sums = 0; sums < Page_ValidationSummaries.length; sums++) {
                summary = Page_ValidationSummaries[sums];
                summary.style.display = "none";
                if (!Page_IsValid && IsValidationGroupMatch(summary, validationGroup)) {
                    var i;
                    if (summary.showsummary != "False") {
                        summary.style.display = "";
                        if (typeof (summary.displaymode) != "string") {
                            summary.displaymode = "BulletList";
                        }
                        switch (summary.displaymode) {
                            case "List":
                                headerSep = "<br>";
                                first = "";
                                pre = "";
                                post = " <img src=" + myUrlImg + "><br>";
                                end = "";
                                break;
                            case "BulletList":
                            default:
                                headerSep = "";
                                first = "<ul>";
                                pre = "<li>";
                                post = " <img src=" + myUrlImg + "></li>";
                                end = "</ul>";
                                break;
                            case "SingleParagraph":
                                headerSep = " ";
                                first = "";
                                pre = "";
                                post = " ";
                                end = " <img src=" + myUrlImg + "><br>";
                                break;
                        }
                        s = "";
                        if (typeof (summary.headertext) == "string") {
                            s += summary.headertext + headerSep;
                        }
                        s += first;
                        var errormessageCollection = new Array;
                        for (i = 0; i < Page_Validators.length; i++) {
                            if (!Page_Validators[i].isvalid && typeof (Page_Validators[i].errormessage) == "string") {// &&  (!Page_Validators[i].isdisabled) && (Page_Validators[i].validationGroup == "ValidationInscription")) {
                                if  ($.inArray(Page_Validators[i].errormessage, errormessageCollection)) {
                                    s += pre + Page_Validators[i].errormessage + post;
                                    errormessageCollection.push(Page_Validators[i].errormessage);
                                }
                            }
                        }
                        if (errormessageCollection.length > 0) {
                            $('[id$=lblNotification]').attr("style", "visibility: hidden");
                            $('[id$=imgNotification]').attr("style", "visibility: hidden");
                        }
                        errormessageCollection = null;
                        s += end;
                        summary.innerHTML = s;
                        window.scrollTo(0, 0);
                    }
                    if (summary.showmessagebox == "True") {
                        s = "";
                        if (typeof (summary.headertext) == "string") {
                            s += summary.headertext + "\r\n";
                        }
                        var lastValIndex = Page_Validators.length - 1;
                        for (i = 0; i <= lastValIndex; i++) {
                            if (!Page_Validators[i].isvalid && typeof (Page_Validators[i].errormessage) == "string") {
                                switch (summary.displaymode) {
                                    case "List":
                                        s += Page_Validators[i].errormessage;
                                        if (i < lastValIndex) {
                                            s += "\r\n";
                                        }
                                        break;
                                    case "BulletList":
                                    default:
                                        s += "- " + Page_Validators[i].errormessage;
                                        if (i < lastValIndex) {
                                            s += "\r\n";
                                        }
                                        break;
                                    case "SingleParagraph":
                                        s += Page_Validators[i].errormessage + " ";
                                        break;
                                }
                            }
                        }
                        alert(s);
                    }
                }
            }
        }
    });
</script>

<div id="DivSummaryValidator">
    <asp:ValidationSummary ID="vsuNotification" runat="server" DisplayMode="List" CssClass="texterouge" />
    <asp:Label ID="lblNotification" runat="server"  ></asp:Label>
    <asp:Image ID="imgNotification" runat="server" Visible="False"  ImageAlign="AbsMiddle" />
</div>