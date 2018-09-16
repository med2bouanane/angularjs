using System.Web;
using System.Web.Optimization;

namespace SolidQ.GNFNavidad14.WebUI
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/bootstrap-tab.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularjs").Include(
                        "~/Scripts/angular.min-1.2.23.js"//,"~/Scripts/json2.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/AngularController").Include(
                        "~/Scripts/Angular/Controllers/ContactController.js",
                        "~/Scripts/Angular/Controllers/statisticsController.js",
                        "~/Scripts/Angular/Controllers/statisticsLanguageController.js",
                        "~/Scripts/Angular/main.js",
                        "~/Scripts/Angular/Config/config.js",
                        "~/Scripts/Angular/Factory/factory.js",
                        "~/Scripts/Angular/Directives/directives.js"));


            bundles.Add(new StyleBundle("~/bundles/ngDialog").Include("~/Content/ngDialog.css",
                "~/Content/ngDialog-theme-default.css"));

            bundles.Add(new StyleBundle("~/bundles/progressBar").Include(
                "~/Content/loading-bar.css"));

            
            bundles.Add(new ScriptBundle("~/bundles/libs").Include(
                "~/Scripts/Angular/Libs/hello.js",
                "~/Scripts/Angular/Libs/google.js",
                "~/Scripts/Angular/Libs/yahoo.js",
                "~/Scripts/Angular/Libs/windows.js",
                "~/Scripts/Angular/Libs/facebook.js",
                "~/Scripts/underscore-min.js",
                "~/Scripts/Angular/Libs/angular-translate.min.js"));
                //"~/Scripts/Angular/Libs/angular-translate-loader-url.min.js"
                //"~/Scripts/Angular/Libs/loading-bar.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}
