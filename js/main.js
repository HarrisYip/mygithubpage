var Route  = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;


var App = React.createClass({displayName: 'App',
	render: function() {
		
	}
});
var SideBar = React.createClass({displayName: 'SideBar',
	render: function(){
		return(
			React.createElement("div", null, 
				React.createElement("ul", null, 
					React.createElement("li", null, React.createElement(Link, {to: "home"}, "Home"))
				), 
				React.createElement(RouteHandler, null)
			)
		)
	}
});

var routes = ( 
	React.createElement(Route, {handler: SideBar, path: "/"}, 
      React.createElement(Route, {name: "home", handler: HomePage})
    )
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('sidebar'));
});