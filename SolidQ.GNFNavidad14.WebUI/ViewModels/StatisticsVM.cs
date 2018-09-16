using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SolidQ.GNFNavidad14.WebUI.ViewModels
{
    public class StatisticsVM
    {
        public string Email { get; set; }
        public int Sends { get; set; }
        public int Opens { get; set; }
        public string Date { get; set; }
        public int Fails { get; set; }
        public string Languages { get; set; }
    }
}