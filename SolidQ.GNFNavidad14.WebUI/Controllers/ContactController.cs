using Microsoft.Exchange.WebServices.Data;
using Microsoft.WindowsAzure;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SendGrid;
using SolidQ.GNFNavidad14.Communication.Abstract.IServices;
using SolidQ.GNFNavidad14.Communication.Abstract.Resources;
using SolidQ.GNFNavidad14.Domain.Abstract.IServices;
using SolidQ.GNFNavidad14.Model;
using SolidQ.GNFNavidad14.Security;
using SolidQ.GNFNavidad14.Utilities.Abstract.IServices;
using SolidQ.GNFNavidad14.WebUI.Controllers.Base;
using SolidQ.GNFNavidad14.WebUI.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace SolidQ.GNFNavidad14.WebUI.Controllers
{
    public class ContactController : BaseController
    {
        ICampaignService _campaignService;
        IContactService _contactService;
        ITempContactService _tempContactService;
        ICommunicationService _sendGridService;
        ISenderService _senderService;
        IEmailContactService _emailContactService;
        IEmailContentService _emailContentService;
        IBlobService _blobService;
        IQueueService _queueService;
        ICsvService _csvService;

        private static List<ContactVM> cvm22;

        public ContactController(ICampaignService campaignService,
            IContactService contactService,
            ITempContactService tempContactService,
            ICommunicationService sendGridService,
            ISenderService senderService,
            IEmailContactService emailContactService,
            IEmailContentService emailContentService,
            IBlobService blobService,
            ICsvService csvService,
            IQueueService queueService)
        {
            _campaignService = campaignService;
            _contactService = contactService;
            _tempContactService = tempContactService;
            _sendGridService = sendGridService;
            _senderService = senderService;
            _emailContactService = emailContactService;
            _emailContentService = emailContentService;
            _blobService = blobService;
            _csvService = csvService;
            _queueService = queueService;
        }

        public ActionResult Create()
        {
            ViewBag.cargarDatos = "true";
            ContactVM contactVM = new ContactVM();
            return View(contactVM);
        }

        [HttpPost]
        public ActionResult Create(List<ContactVM> contacts, string nameUser, string surnameUser, string emailUser)
        {
            try 
	        {	        
		        TempContact tempContact;

                //Creamos un identificador de envío
                string sendingIdentifier = Guid.NewGuid().ToString();

                bool successCreate;

                Campaign campaign = _campaignService.GetAll().FirstOrDefault();
                if(campaign != null)
                {
                    //Creamos un objeto contacto temporal para cada contacto introducido
                    foreach (var item in contacts)
                    {
                        tempContact = new TempContact()
                        {
                            PartitionKey = sendingIdentifier,
                            RowKey = item.Email,
                            Name=item.Name,
                            //Surname = item.Surname,
                            CreationDate = DateTime.Now,
                            OwnerEmail = emailUser
                        };

                        successCreate = _tempContactService.Add(tempContact);
                    }

                    //Registramos al emisor a la espera de confirmación del email
                    Sender sender = _senderService.GetByPartitionKeyAndRowKey(campaign.RowKey,emailUser);
                    if(sender == null)
                    {
                        sender = new Sender(campaign.RowKey, emailUser)
                        {
                            Name = nameUser,
                            //Surname = surnameUser
                        };

                        bool success = _senderService.Add(sender);
                        if(!success)
                            return Json("Error");
                    }
                    
                    //Lanzamos la verificación del email
                    return Json(sender.RowKey + "&" + sendingIdentifier);
                }

                return Json("Error");
	        }
	        catch (Exception)
	        {
                ModelState.AddModelError("", SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.SendingError);//"No se ha podido enviar la felicitación.");
                return Json("Error");
	        }
        }
        
        public JsonResult datos()
        {

            return Json(cvm22, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Outlook(string name, string pass)
        {
            /*
            cvm22 = new List<ContactVM>();
            ContactVM cOutlook = new ContactVM();
            cOutlook.Name = "Mohamed";
            cOutlook.Email = "mbouanane@solidq.com";
            cvm22.Add(cOutlook);

            ContactVM cOutlook2 = new ContactVM();
            cOutlook2.Name = "Miguel";
            cOutlook2.Email = "msepulveda@solidq.com";
            cvm22.Add(cOutlook2);
            */
            try
            {
                cvm22 = new List<ContactVM>();
                ExchangeService svc = new ExchangeService();
                //service.Credentials = new WebCredentials("msepulveda@solidq.com", "Extr3.2014", "office365.com");
                svc.Credentials = new NetworkCredential(name, pass);

                // Set the URL.
                //service.Url = new Uri("https://outlook.office365.com/ews/exchange.asmx");
                svc.AutodiscoverUrl(name, RedirectionCallback);

                foreach (var v in svc.FindItems(WellKnownFolderName.Contacts,
                                       new ItemView(50)))
                {
                    Microsoft.Exchange.WebServices.Data.Contact contact = v as Microsoft.Exchange.WebServices.Data.Contact;

                    if (contact != null)
                    {
                        ContactVM cOutlook = new ContactVM();
                        cOutlook.Name = contact.DisplayName;
                        cOutlook.Email = contact.EmailAddresses[EmailAddressKey.EmailAddress1].Address;
                        cvm22.Add(cOutlook);

                    }

                }
            }
            catch (Microsoft.Exchange.WebServices.Data.AutodiscoverLocalException ex)
            {
                ContactVM cOutlook = new ContactVM();
                cOutlook.Name = "ERROR";
                cvm22.Add(cOutlook);
            }
            catch (System.FormatException ex_format)
            {
                ContactVM cOutlook = new ContactVM();
                cOutlook.Name = "ERROR";
                cvm22.Add(cOutlook);
            }
            catch (Microsoft.Exchange.WebServices.Data.ServiceValidationException e)
            {
                ContactVM cOutlook = new ContactVM();
                cOutlook.Name = "ERROR";
                cvm22.Add(cOutlook);
            }

            /*
            ExchangeService service = new ExchangeService();
            //service.Credentials = new WebCredentials("msepulveda@solidq.com", "Extr3.2014", "office365.com");
            service.Credentials = new NetworkCredential(name, pass);

            // Set the URL.
            //service.Url = new Uri("https://outlook.office365.com/ews/exchange.asmx");
            service.AutodiscoverUrl(name, RedirectionCallback);

            // Get the number of items in the contacts folder. To limit the size of the response, request only the TotalCount property.
            ContactsFolder contactsfolder = ContactsFolder.Bind(service,
                                                                WellKnownFolderName.Contacts,
                                                                new PropertySet(BasePropertySet.IdOnly, FolderSchema.TotalCount));

            // Set the number of items to the number of items in the Contacts folder or 50, whichever is smaller.
            int numItems = contactsfolder.TotalCount < 50 ? contactsfolder.TotalCount : 50;

            // Instantiate the item view with the number of items to retrieve from the Contacts folder.
            ItemView view = new ItemView(numItems);

            // To keep the response smaller, request only the display name.
            view.PropertySet = new PropertySet(BasePropertySet.IdOnly,ContactSchema.DisplayName);

            FindItemsResults<Item> contactItems = service.FindItems(WellKnownFolderName.Contacts, view);


            cvm22 = new List<ContactVM>();
            // Display the list of contacts. (Note that there can be a large number of contacts in the Contacts folder.)
            foreach (Item item in contactItems)
            {
                if (item is Microsoft.Exchange.WebServices.Data.Contact)
                {
                    ContactVM cOutlook = new ContactVM();
                    Microsoft.Exchange.WebServices.Data.Contact contact = item as Microsoft.Exchange.WebServices.Data.Contact;
                    Console.WriteLine(contact.DisplayName);
                    //Microsoft.Exchange.WebServices.Data.EmailAddress emailAdress = item as Microsoft.Exchange.WebServices.Data.EmailAddress;
                    cOutlook.Name = contact.DisplayName;
                    cvm22.Add(cOutlook);
                }
            }
            */
            
            return RedirectToAction("Create");
        }


        [HttpPost]
        public ActionResult LoadContactsFromCSV()//(HttpPostedFileBase file2)
        {
            
            try
            {
                HttpPostedFileBase file = Request.Files[0];
                if (file != null)
                    return Json(JsonConvert.SerializeObject(_csvService.FromCsvToTable(file), Formatting.Indented), JsonRequestBehavior.AllowGet);
                else
                    return Json("Empty");
            }
            catch (Exception)
            {
                return Json("Error");
            }
        }


        static bool RedirectionCallback(string url)
        {
            // Return true if the URL is an HTTPS URL.
            return url.ToLower().StartsWith("https://");
        }

        public ActionResult VerifySenderAddress(string email, string sendingIdentifier, string language)
        {
            try
            {
                string encryptionKey = CloudConfigurationManager.GetSetting("EncryptionKey");

                SendGridMessage myMessage = new SendGridMessage();
                myMessage.AddTo(email);
                myMessage.From = new MailAddress(CloudConfigurationManager.GetSetting("SenderAddress"), "Gas Natural Fenosa");
                myMessage.Subject = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.SendConfirm; //"Confirmación del envío";

                string encrypted = EncryptionHelper.Encrypt(String.Format("{0}&{1}&{2}&{3}",
                    email, DateTime.Now.AddMinutes(60).Ticks,sendingIdentifier,language), encryptionKey);

                //var resetLink = Url.Action("SendingConfirmation", "Contact", null, "http") + "?digest=" + HttpUtility.UrlEncode(encrypted);
               
                //Obtenemos la plantilla de verificación en el idioma correspondiente
                //if (string.IsNullOrEmpty(language) || language == "undefined")
                //{
                //    language = "es";
                //}
                //string html = _blobService.GetTextBlob("templates-verification", "template-" + language + ".html");
                string html = _blobService.GetTextBlob("templates-verification", "template-" + RouteData.Values["culture"].ToString() + ".html");

                foreach (var item in _blobService.GetList("images"))
                {
                    html = html.Replace(item.Name, item.Uri.ToString());
                }

                ////Introducimos en la plantilla el enlace de validación
                string currentLanguage = RouteData.Values["culture"].ToString();
                string routeLanguage = currentLanguage;
                if (currentLanguage == null)
                {
                    routeLanguage = "";
                    currentLanguage = "es";
                }
                else if (currentLanguage != null && currentLanguage.Equals("pt"))
                {
                    routeLanguage = "pt-br";
                }
                else if (currentLanguage != null && currentLanguage.Equals("es"))
                {
                    routeLanguage = "";
                }
                var resetLink = CloudConfigurationManager.GetSetting("WordPressURL") + routeLanguage + "/" + CloudConfigurationManager.GetSetting(currentLanguage) + "?route=" + currentLanguage + "/Contact/SendingConfirmation?digest=" + HttpUtility.UrlEncode(encrypted);

                html = html.Replace("[verificationlink]", resetLink);

                //Reemplazamos el weblink por un enlace al método que muestra la plantilla en la web.
                html = html.Replace("[weblink]", CloudConfigurationManager.GetSetting("WordPressURL") + routeLanguage + "/" + CloudConfigurationManager.GetSetting(currentLanguage) + "?route=" + currentLanguage + "/Contact/ViewTemplate?language=" + currentLanguage + "&wplanguage=" + routeLanguage + "&digest=" + HttpUtility.UrlEncode(encrypted));

                myMessage.Html = html;

                // Create credentials, specifying your user name and password.
                var credentials = new NetworkCredential(CloudConfigurationManager.GetSetting("SendGridUser"), CloudConfigurationManager.GetSetting("SendGridPassword"));

                // Create an Web transport for sending email.
                var transportWeb = new Web(credentials);

                // Send the email.
                transportWeb.Deliver(myMessage);

                ViewBag.Result = "Success";

                return View();
            }
            catch (Exception)
            {
                ViewBag.Result = "Error";

                return View();
            }
        }

        [AllowAnonymous]
        public ActionResult SendingConfirmation(string digest)
        {
            try
            {
                string subject = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.VerifySenderAddress.VerifySenderAddress.Subject;
                string encryptionKey = CloudConfigurationManager.GetSetting("EncryptionKey");

                string code = EncryptionHelper.Decrypt(HttpUtility.UrlDecode(digest), encryptionKey);
                var codes = code.Split('&');
                var time = codes[1];
                var email = codes[0];
                var sendingIdentifier = codes[2];
                var language = codes[3];

                if (DateTime.Now.Ticks > Convert.ToInt64(time))
                {
                    ViewBag.Result = "Error";
                    ViewBag.Message = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.LinkDeprecate;// "El enlace ha caducado.";
                }
                else
                {
                    //Una vez validada la dirección de email, confirmamos el usuario y los contactos y metemos el mensaje en la cola

                    Sender sender = _senderService.GetByRowKey(email).FirstOrDefault();
                    bool success = false;
                    if (sender != null)
                    {
                        success = true;
                    }

                    List<TempContact> tempContactsList = _tempContactService.GetAll().Where(c => !string.IsNullOrEmpty(c.OwnerEmail) && c.OwnerEmail.Equals(sender.RowKey) && c.PartitionKey.Equals(sendingIdentifier)).ToList();

                    EmailContent emailContent = _emailContentService.GetByPartitionKeyAndRowKey(email, sendingIdentifier);
                    if(emailContent == null)
                        {
                        emailContent = new EmailContent(email, sendingIdentifier)
	                    {
                            IdCampaign = sender.PartitionKey,
                            IdTemplate = "ID_PROVISIONAL",
                            Text = "",
                            Subject = subject,
                            Language = language.Equals("undefined") ? "es" : language,
                            Status = "Processing"
                        };
                        success = CreateEmailEntity(emailContent, tempContactsList);

                    if (success)
                    {
                            //Metemos el mensaje en la cola para que el envío sea procesado.
                            _queueService.AddMessage(sendingIdentifier);

                            //Mostramos el mensaje de que el envío ha sido procesado.
                            ViewBag.Result = "Success";
                            ViewBag.Message = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.SendProcessSuccess;//"Las felicitaciones han sido procesadas correctamente para su envío.";
                    }
                        else
                    {
                        ViewBag.Result = "Error";
                        ViewBag.Message = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.SendFails;// "Lo sentimos pero no se han podido enviar las felicitaciones.";
                    }
                    }
                    else
                    {
                        ViewBag.Result = "Error";
                        ViewBag.Message = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.SendProcessAlready;// "Las felicitaciones ya han sido procesadas para ser enviadas.";
                    }
                }
            }
            catch (Exception)
            {
                ViewBag.Result = "Error";
                ViewBag.Message = SolidQ.GNFNavidad14.Multilanguage.Resources.Contact.Create.Create.UrlError;//"URL no válida.";
            }

            return View();
        }

        private bool CreateEmailEntity(EmailContent email,List<TempContact> contacts)
        {
            bool success = _emailContentService.Add(email);
            EmailContact emailContact;

            if(success)
            {
                foreach (var item in contacts)
                {
                    emailContact = new EmailContact(email.RowKey, item.RowKey);
                    if(success)
                        success = _emailContactService.Add(emailContact);
                }

                if (success)
                    return true;
            }

            return false;
        }

        public ActionResult ViewTemplate(string language,string wplanguage, string digest)
        {
            //Obtenemos la plantilla de verificación en el idioma correspondiente
            if (string.IsNullOrEmpty(language) || language == "undefined")
            {
                language = "es";
            }
            string html = _blobService.GetTextBlob("templates-verification", "template-" + language + ".html");

            foreach (var item in _blobService.GetList("images"))
            {
                html = html.Replace(item.Name, item.Uri.ToString());
            }

            string link = CloudConfigurationManager.GetSetting("WordPressURL") + wplanguage + "/" + CloudConfigurationManager.GetSetting(language) + "?route=" + language + "/Contact/SendingConfirmation?digest=" + digest;

            html = html.Replace("[verificationlink]", link);

            html = html.Replace("[weblink]", "#");

            ViewBag.Html = html;

            return View();
        }
    }
}