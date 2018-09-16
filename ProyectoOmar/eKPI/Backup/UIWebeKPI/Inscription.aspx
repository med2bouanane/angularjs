<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="Inscription.aspx.vb" Inherits="UIWebeKPI.Inscription" culture="auto"  uiculture="auto" meta:resourcekey="PageResource1"  %>
<%@ Register src="ControlesUtilisateur/ValidatorSummaryControl.ascx" tagname="ValidatorSummaryControl" tagprefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="cphEnTete" runat="server">
   	<script type="text/javascript" src="Scripts/Inscription.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="cphContenu" runat="server">
    c<table width="100%">
        <tr>
            <td style="padding-left:15px">
                <h1><asp:Label ID="lblTitreGlobal" runat="server" 
                         Text="Registration" meta:resourcekey="lblTitreGlobalResource1" 
                        ></asp:Label></h1>
            </td>
        </tr>
        <tr>
            <td >
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr id="trSteps" runat="server"  >
                        <td>
                             <table id="steps" class="steps" runat="server" cellpadding="0" cellspacing="0" border="0">
                                <tr style="height:20px;">
                                    <td runat="server" id="tdDebutEtape1" class="DebutEtapeGrise" style="width:10px">
                                    </td>
                                    <td id="tdEtape1" runat="server" 
                                        class="EtapeGrise" style="padding-right:5px; padding-left:5px;">
                                        <asp:Label ID="lblEtape1" runat="server" 
                                            text="" meta:resourcekey="lblEtape1Resource1" 
                                               ></asp:Label>
                                    </td>
                                    <td id="tdDebutEtape2" runat="server" class="DebutEtapeGrisClair EtapeGrise">
                                        </td>
                                    <td id="tdEtape2" runat="server" class="EtapeFondGrisClair" style="padding-right:5px; padding-left:5px;">
                                        <asp:Label ID="lblEtape2" runat="server"  text=""  
                                            ></asp:Label>
                                    </td>
                                    <td id="tdFinEtape2" runat="server" class="FinEtapeGrisClair EtapeFondGrisClair">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-left:10px" >
                            <uc1:ValidatorSummaryControl  ID="wucInscription" runat="server" 
                                CssClass="texterouge" />    
                        </td>
                     </tr>
                     <tr>
                     <asp:HiddenField ID="hdnCurrentStep" runat="server" />
                     </tr>
                     <tr>
                         <td style="padding-left:10px; padding-top:10px; line-height:23px">
                                <asp:Wizard ID="wzdInscription" runat="server" DisplaySideBar="False" 
                                    ActiveStepIndex="0" Width="100%" meta:resourcekey="wzdInscriptionResource1" 
                                    >
                                    <StartNextButtonStyle CssClass="btdefaut" />
                                    <FinishCompleteButtonStyle CssClass="btdefaut" />
                                    <StepNextButtonStyle CssClass="btdefaut" />
                                    <FinishPreviousButtonStyle CssClass="btdefaut" />
                                    <NavigationButtonStyle CssClass="btdefaut" />
                                    <SideBarStyle VerticalAlign="Top" />
                                    <StepPreviousButtonStyle CssClass="btdefaut" />
                                    <CancelButtonStyle CssClass="btdefaut" />
                                    <StepStyle HorizontalAlign="Left" VerticalAlign="Top" Width="100%" CssClass="wzdTopAligned" />
                                    <WizardSteps>
                                        <asp:WizardStep ID="WizardStep1" runat="server" Title="Etape 1" meta:resourcekey="WizardStep1Resource1" 
                                            >
                                             <table id="tblTypeCompte" runat="server">
                                                <tr>
                                                    <td valign="top" style="padding-top:2px; width:150px">
                                                        <asp:label id="lblTypeUtilisateur" runat="server" meta:resourcekey="lblTypeUtilisateurResource1"  ></asp:label></td>
                                                    <td>
                                                        <asp:RadioButton ID="rbtCompteExistant" runat="server" Checked="true" GroupName="typeUtilisateur" Text="Oui"  meta:resourcekey="rbtCompteExistantResource1"/>   &nbsp;&nbsp;
                                                        <asp:RadioButton ID="rbtCompteNoExistant" runat="server" GroupName="typeUtilisateur" Text="Non"  meta:resourcekey="rbtCompteNoExistantResource1"  />
                                                    </td>
                                                </tr>
                                              </table>
                                              <table id="tblVueConecte" runat="server">
                                                <tr>
                                                    <td valign="top" style="padding-top:2px; width:150px">
                                                    <asp:label id="lblIdentifiantExiste" runat="server"  meta:resourcekey="lblIdentifiantExisteResource1"></asp:label></td>
                                                    <td>
                                                        <asp:textbox id="txtIdentifiant" runat="server" CssClass="zonetxtoblig" Width="170px" MaxLength="50"  ></asp:textbox>
<%--						                                <asp:RequiredFieldValidator id="rfvIdentifiant" runat="server" ControlToValidate="txtIdentifiant" ErrorMessage="Les champs marqués avec * sont obligatoires"
							                                 CssClass="texterouge" >*</asp:RequiredFieldValidator>--%>
                                                             <asp:CustomValidator ID="cuvIdentifiant" runat="server" ClientValidationFunction="validerCompte" ControlToValidate="txtIdentifiant" ValidateEmptyText="True"
                                                             ErrorMessage="Les champs marqués avec * sont obligatoires" CssClass="texterouge" meta:resourcekey="cuvIdentifiantResource1" >*</asp:CustomValidator>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td valign="top" style="padding-top:2px; width:150px"><asp:label id="lblMotPassExistant" runat="server" meta:resourcekey="lblMotPassExistantResource1" >Mot de passe</asp:label>
                                                    </td>
                                                    <td>
                                                        <asp:textbox id="txtMotPasse" runat="server" Width="170px"  CssClass="zonetxtoblig" MaxLength="50" TextMode="Password"></asp:textbox>
						                                <%--<asp:RequiredFieldValidator id="rfvMotPasse" runat="server" ControlToValidate="txtMotPasse" ErrorMessage="Les champs marqués avec * sont obligatoires"
							                                 CssClass="texterouge" >*</asp:RequiredFieldValidator>--%>
                                                        <asp:CustomValidator ID="cuvMotPasse" runat="server" ClientValidationFunction="validerCompte" ControlToValidate="txtMotPasse" ValidateEmptyText="True"
                                                             ErrorMessage="Les champs marqués avec * sont obligatoires" CssClass="texterouge"   meta:resourcekey="cuvMotPasseResource1">*</asp:CustomValidator>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table id="tblDescription" width="100%" style="padding-top:6px; padding-bottom:6px">
                                                <tr>
                                                    <td align="left" ><asp:Label ID="lblDescription" runat="server" 
                                                            
                                                            
                                                            Text="Introduisez ici vos informations de profils. Ces informations sont destinées uniquement à être utilisées par ArcelorMittal Industeel
                                                            dans le cadre de l’amélioration de la relation client. Ces informations ne seront pas transmises à une tierce partie." meta:resourcekey="lblDescriptionResource1" 
                                                            ></asp:Label></td>
                                                </tr>
                                            </table>
                                            <table width="100%" id="tblVueNoConecte" runat="server">
                                                <tr>
					                                <td valign="top"  style="padding-top:2px; width:150px">
                                                        <asp:label ID="lblTitre" runat="server" Text="Titre" meta:resourcekey="lblTitreResource1"  ></asp:label>
                                                    </td>
					                                <td valign="top">
                                                        <asp:RadioButton ID="rbtM" runat="server" Text="Sir" 
                                                             GroupName="Title" meta:resourcekey="rbtMResource1" Checked="true"/>   &nbsp;&nbsp;
                                                        <asp:RadioButton ID="rbtMme" runat="server" Text="Mme" 
                                                             GroupName="Title" meta:resourcekey="rbtMmeResource1" /> &nbsp; &nbsp;  
                                                        <asp:RadioButton ID="rbtMlle" runat="server" Text="Ms" 
                                                             GroupName="Title" meta:resourcekey="rbtMlleResource1"/>
                                                    </td>
				                                </tr>
                                                <tr>
					                                <td valign="top" style="padding-top:2px; width:150px"><asp:label ID="lblNom" runat="server" Text="Nom" meta:resourcekey="lblNomResource1"
                                                            ></asp:label></td>
					                                <td valign="top">
                                                        <asp:textbox id="txtNom" runat="server" cssclass="zonetxtoblig" Width="350px"></asp:textbox>
                                                        <%--<asp:requiredfieldvalidator id="rfvNom" runat="server" 
                                                            ControlToValidate="txtNom" CssClass="texterouge"  ErrorMessage="Les champs marqués avec * sont obligatoires"
                                                             >*</asp:requiredfieldvalidator>--%>
                                                        <asp:CustomValidator ID="cuvNom" runat="server" ClientValidationFunction="validerCompte"  ControlToValidate="txtNom" ValidateEmptyText="True"
                                                             ErrorMessage="Les champs marqués avec * sont obligatoires" CssClass="texterouge"  meta:resourcekey="cuvNomResource1">*</asp:CustomValidator>
                                                    </td>
				                                </tr>
				                                <tr>
					                                <td valign="top" style="padding-top:2px; width:150px">
                                                        <asp:label ID="lblPrenom" runat="server" Text="Prénom" meta:resourcekey="lblPrenomResource1"
                                                            ></asp:label>
                                                        
                                                        </td>
					                                <td valign="top">
                                                        <asp:textbox id="txtPrenom" runat="server"  cssclass="zonetxtoblig"
                                                            Width="350px"></asp:textbox>
                                                        <%--<asp:requiredfieldvalidator id="rfvPrenom" runat="server" 
                                                            ControlToValidate="txtPrenom" CssClass="texterouge"  ErrorMessage="Les champs marqués avec * sont obligatoires"
                                                             >*</asp:requiredfieldvalidator>--%>
                                                        <asp:CustomValidator ID="cuvPrenom" runat="server" ClientValidationFunction="validerCompte" ControlToValidate="txtPrenom" ValidateEmptyText="True"
                                                        ErrorMessage="Les champs marqués avec * sont obligatoires" CssClass="texterouge"  meta:resourcekey="cuvPrenomResource1" >*</asp:CustomValidator>
                                                    </td>
				                                </tr>
				                                <tr>
					                                <td valign="top" style="padding-top:2px; width:150px">
                                                        <asp:label ID="lblFonction" runat="server" Text="Fonction" meta:resourcekey="lblFonctionResource1"
                                                            ></asp:label>
                                                    </td>
					                                <td valign="top"><asp:textbox id="txtFonction" runat="server" 
                                                            Width="350px"></asp:textbox></td>
				                                </tr>
                                                <tr>
					                                <td valign="top" style="padding-top:2px; width:150px"><asp:label ID="lblEmail" runat="server" meta:resourcekey="lblEmailResource1"
                                                            Text="Email" ></asp:label></td>
					                                <td valign="top"><asp:textbox id="txtEmail" runat="server" 
                                                            cssclass="zonetxtoblig" Width="350px"></asp:textbox>
                                                        <%--<asp:requiredfieldvalidator id="rfvEmail" runat="server" 
                                                            ControlToValidate="txtEmail" CssClass="texterouge" 
                                                             ErrorMessage="Les champs marqués avec * sont obligatoires" >*</asp:requiredfieldvalidator>--%>
                                                             <asp:CustomValidator ID="cuvMail" runat="server" ClientValidationFunction="validerCompte"  ControlToValidate="txtEmail" ValidateEmptyText="True"
                                                        ErrorMessage="Les champs marqués avec * sont obligatoires" CssClass="texterouge" meta:resourcekey="cuvMailResource1" >*</asp:CustomValidator>

                                                        <%--<asp:regularexpressionvalidator id="revDestinataires" runat="server"
                                                            CssClass="texterouge" ControlToValidate="txtEmail"
							                                ErrorMessage="Un ou plusieurs champs ne respectent pas le format requis"
                                                            ValidationExpression="(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*;)*(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$" 
                                                             >*</asp:regularexpressionvalidator>--%>

                                                        <asp:CustomValidator ID="cuvDestinataires" runat="server" ClientValidationFunction="validerExpression"  ControlToValidate="txtEmail" ValidateEmptyText="false"
                                                        ErrorMessage="Un ou plusieurs champs ne respectent pas le format requis" CssClass="texterouge" meta:resourcekey="cuvDestinatairesResource1" >*</asp:CustomValidator>
                                                        </td>
				                                </tr>
                                                <tr>
					                                <td valign="top"><asp:label ID="lblPhone" runat="server" 
                                                            Text="Téléphone" meta:resourcekey="lblPhoneResource1"></asp:label></td>
					                                <td valign="top"><asp:textbox id="txtTelephone" runat="server" 
                                                            Width="350px"></asp:textbox></td>
				                                </tr>
                                                <tr>
					                                <td valign="top"><asp:label ID="lblLangue" runat="server" 
                                                            Text="Langue" meta:resourcekey="lblLangueResource1"></asp:label></td>
					                                <td valign="top">
                                                        <asp:DropDownList ID="ddlLangueUtilisateur" runat="server" 
                                                             Width="356px">
                                                        </asp:DropDownList>
                                                    </td>
				                                </tr>
                                            </table>
                                        </asp:WizardStep>
                                        <asp:WizardStep ID="WizardStep2" runat="server" Title="Etape 2" 
                                            StepType="Finish" AllowReturn="false" meta:resourcekey="WizardStep2Resource1" 
                                             >
                                            <table>
                                                <tr>
                                                    <td style="width:150px">
                                                        <asp:label id="lblIdentifiant" runat="server" Text="Identifiant" meta:resourcekey="lblIdentifiantResource1"
                                                            ></asp:label></td>
					                                <td>
						                                <asp:textbox id="txtIdentifiantAcces" runat="server" Width="170px"  
                                                            MaxLength="50" CssClass="zonetxtgris2" ReadOnly="true" meta:resourcekey="txtIdentifiantAccesResource1" 
                                                            ></asp:textbox>
					                                </td>
                                                </tr>
                                                <tr>
                                                    <td><asp:label id="lblMotPasse" runat="server"  Text="Mot de passe" meta:resourcekey="lblMotPasseResource1"
                                                            ></asp:label></td>
					                                <td>
						                                <asp:textbox id="txtMotPasseAcces" runat="server" Width="170px" 
                                                            CssClass="zonetxtoblig" MaxLength="50"  TextMode="Password" meta:resourcekey="txtMotPasseAccesResource1" 
                                                            ></asp:textbox>
						                                <%--<asp:RequiredFieldValidator id="rfvMotPasseAcces" runat="server" 
                                                            ErrorMessage="Les champs marqués avec * sont obligatoires" ControlToValidate="txtMotPasseAcces"
							                                CssClass="texterouge"  >*</asp:RequiredFieldValidator>--%>
                                                            <asp:CustomValidator ID="cuvMotPasseAcces" runat="server" 
                                                            ClientValidationFunction="validerCompte" 
                                                            ControlToValidate="txtMotPasseAcces" ValidateEmptyText="True"
                                                        ErrorMessage="Les champs marqués avec * sont obligatoires" 
                                                            CssClass="texterouge" meta:resourcekey="cuvMotPasseAccesResource1"  >*</asp:CustomValidator>
                                                         <%--<asp:RegularExpressionValidator id="revMotPasseAcces" runat="server" 
                                                            ControlToValidate="txtMotPasseAcces"  ErrorMessage="Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et 6 caractères de longueur"
                                                            ValidationExpression="^.*(?=.{6,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$"
															CssClass="texterouge"  >*</asp:RegularExpressionValidator>--%>

                                                            <asp:CustomValidator ID="cuvMotPasseAccesValidation" runat="server" 
                                                            ClientValidationFunction="validerExpression"  ControlToValidate="txtMotPasseAcces"
                                                            ValidateEmptyText="false" ErrorMessage="Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et 6 caractères de longueur" 
                                                            CssClass="texterouge" 
                                                            meta:resourcekey="cuvMotPasseAccesValidationResource1"   >*</asp:CustomValidator>
					                                </td>
                                                </tr>
                                                 <tr>
                                                    <td><asp:label id="lblConfirmerMotPasseAcces" runat="server"  Text="Confirmation" meta:resourcekey="lblConfirmerMotPasseAccesResource1"
                                                             ></asp:label></td>
					                                <td>
						                                <asp:textbox id="txtConfirmerMotPasseAcces" runat="server" Width="170px"  
                                                            CssClass="zonetxtoblig" MaxLength="50" TextMode="Password" meta:resourcekey="txtConfirmerMotPasseAccesResource1" 
                                                            ></asp:textbox>
						                                <%--<asp:RequiredFieldValidator id="rfvConfirmerMotPasseAccess" runat="server" 
                                                            ErrorMessage="Les champs marqués avec * sont obligatoires" ControlToValidate="txtConfirmerMotPasseAcces"
							                                CssClass="texterouge"  >*</asp:RequiredFieldValidator>--%>
                                                            <asp:CustomValidator ID="cuvConfirmerMotPasseAccess" runat="server" 
                                                            ClientValidationFunction="validerCompte" ControlToValidate="txtConfirmerMotPasseAcces"
                                                        ErrorMessage="Les champs marqués avec * sont obligatoires" 
                                                            CssClass="texterouge" ValidateEmptyText="True" meta:resourcekey="cuvConfirmerMotPasseAccessResource1" 
                                                             >*</asp:CustomValidator>
                                                            <%--<asp:comparevalidator id="covNouveauMotPasse" runat="server" ErrorMessage="Les mots de passe ne correspondent pas"
																				ControlToValidate="txtConfirmerMotPasseAcces" ControlToCompare="txtMotPasseAcces" Operator="Equal"
																				CssClass="texterouge"  >*</asp:comparevalidator>--%>
                                                        
                                                        <asp:CustomValidator ID="cuvNouveauMotPasse" runat="server" 
                                                            ClientValidationFunction="validerExpression"  ControlToValidate="txtConfirmerMotPasseAcces"
                                                        ErrorMessage="Les mots de passe ne correspondent pas" CssClass="texterouge"  
                                                            ValidateEmptyText="false" meta:resourcekey="cuvNouveauMotPasseResource1"
                                                              >*</asp:CustomValidator>
					                                </td>
                                                </tr>
                                            </table>
                                        </asp:WizardStep>
                                        <asp:WizardStep ID="WizardStep3" runat="server" Title="Etape 3" 
                                            StepType="Complete" AllowReturn="false" meta:resourcekey="WizardStep3Resource1" 
                                             >
                                            <table>
                                            </table>
                                        </asp:WizardStep>
                                    </WizardSteps>
                                </asp:Wizard>
                            </td>
                        </tr>
                </table>
            </td>
        </tr>
    </table>
</asp:Content>
