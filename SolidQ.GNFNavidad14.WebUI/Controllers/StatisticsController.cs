using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SolidQ.GNFNavidad14.Communication.Abstract.IServices;
using SolidQ.GNFNavidad14.Communication.Abstract.Resources;
using SolidQ.GNFNavidad14.Domain.Abstract.IServices;
using SolidQ.GNFNavidad14.Model;
using SolidQ.GNFNavidad14.WebUI.ViewModels;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SolidQ.GNFNavidad14.WebUI.Controllers
{
    public class StatisticsController : Controller
    {

        IEmailContentService _emailContentService;
        ICampaignService _campaignService;
        ICommunicationService _sendGridService;

        public StatisticsController(IEmailContentService emailContentService,ICampaignService campaignService,ICommunicationService sendGridService)
        {
            _emailContentService = emailContentService;
            _campaignService = campaignService;
            _sendGridService = sendGridService;
        }


        // GET: Statistics
        public ActionResult Index()
        {
            List<EmailContent> remitentes = new List<EmailContent>();
            var emails = _emailContentService.GetAll();

            foreach (var e in emails)
            {
                remitentes.Add(e);
            }

            //return View(
            remitentes.GroupBy(g => g.PartitionKey)
            .Select(group => new
            {
                email = group.Key,
                sents = group.Count()
            }).ToList();

            return View(remitentes);
        }


        // Desde la tabla EmailContent
        public JsonResult Graphic()
        {
            StatisticsVM SVM;
            List<StatisticsVM> listSVM = new List<StatisticsVM>();

            List<EmailContent> emailContents = new List<EmailContent>();
            var emails = _emailContentService.GetAll();

            foreach (var e in emails)
            {
                emailContents.Add(e);
            }

            // Agrupo por remitentes
            var rems = emailContents.GroupBy(g => g.PartitionKey)
            .Select(group => new
            {
                email = group.Key,
                sents = group.Count()
            }).ToList();

            // Agrupo por fecha
            var dates = emailContents.GroupBy(g => g.Timestamp.ToString("dd-MM-yyyy"))
            .Select(group => new
            {
                email = group.Key,
                sents = group.Count()
            }).ToList();


            foreach (var e in emails)
            {
                DateTimeOffset dto = e.Timestamp;
                DateTime dt = dto.UtcDateTime;
                string date = dt.ToString("dd MM yyyy");
                emailContents.Add(e);
            }



            return Json(dates, JsonRequestBehavior.AllowGet);
        }


        // Desde la tabla EmailContent
        public JsonResult GraphicLanguage()
        {
            
            List<StatisticsVM> listSVM = new List<StatisticsVM>();

            List<EmailContent> remitentes = new List<EmailContent>();
            var Sends = _emailContentService.GetAll();

            foreach (var e in Sends)
            {
                remitentes.Add(e);
            }


            var res = remitentes.Where(s=>s.Status.Equals("Sent"))
                                    .GroupBy(g => g.Language)
                                    .Select(group => new
                                    {
                                        idioma = group.Key,
                                        sents = group.Count(),
                                        fails = remitentes.Where(f => !f.Status.Equals("Sent")).Count()
                                    }).ToList();

            foreach (var item in res)
            {
                StatisticsVM SVM = new StatisticsVM();
                SVM.Sends = item.sents;
                SVM.Languages = item.idioma;
                SVM.Fails = item.fails;

                listSVM.Add(SVM);
            }

            return Json(listSVM, JsonRequestBehavior.AllowGet);
        }

        // DESDE SENDGRID
        public JsonResult Statistics()
        {
            
            List<StatisticsVM> listSVM = new List<StatisticsVM>();
            CultureInfo provider = CultureInfo.InvariantCulture;

            JArray json = _sendGridService.Statistics(StadisticsOptions.start_date, "2014-11-10");

            string data = "";
            foreach (JObject obj in json.Children<JObject>())
            {
                StatisticsVM SVM = new StatisticsVM();
                foreach (JProperty p in obj.Properties())
                {
                     SVM.Fails = 0;

                    data = data + "<" + p.Name + "," + p.Value + ">\n";
                    
                    // Fecha
                    if (p.Name.ToString().ToLower().Equals("date")) 
                    {
                       //DateTime date = Convert.ToDateTime(p.Value.ToString());
                       //string strDate = date.ToString("dd-MM-yyyy");
                       SVM.Date = p.Value.ToString();
                        
                    }
                        
                    // Enviados
                    if (p.Name.ToString().ToLower().Equals("delivered"))
                        SVM.Sends = Convert.ToInt32(p.Value.ToString());
                    // Fallidos
                    if (p.Name.ToString().ToLower().Equals("blocked") || p.Name.ToString().ToLower().Equals("invalid_email"))
                        SVM.Fails = SVM.Fails + Convert.ToInt32(p.Value.ToString());
                    // Abiertos
                    if (p.Name.ToString().ToLower().Equals("opens"))
                        SVM.Opens = Convert.ToInt32(p.Value.ToString());

                }
                listSVM.Add(SVM);
            }
            string res = data;
            return Json(listSVM, JsonRequestBehavior.AllowGet);
        }
    }
}