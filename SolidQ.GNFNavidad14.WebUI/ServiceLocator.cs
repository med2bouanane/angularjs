using Autofac;
using Autofac.Integration.Mvc;
using SolidQ.GNFNavidad14.BootStrap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace SolidQ.GNFNavidad14.WebUI
{
    public class ServiceLocator
    {
        IContainer container;

        public ServiceLocator()
        {

            var locator = new Locator();

            //Register Controller
            locator.Builder.RegisterControllers(Assembly.GetExecutingAssembly());

            //Register WebApi
            //builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Register Model Binders that implement IModelBinder
            locator.Builder.RegisterModelBinders(Assembly.GetExecutingAssembly());
            locator.Builder.RegisterModelBinderProvider();

            // Inject HTTP Abstractions
            locator.Builder.RegisterModule(new AutofacWebTypesModule());

            // Inject Dependencies into View Pages
            locator.Builder.RegisterSource(new ViewRegistrationSource());

            // Set the Dependency Resolver
            locator.BuildContainer();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(locator.container));
        }
    }
}