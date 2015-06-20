var Route  = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var Link = ReactRouter.Link;
var RouteHandler = ReactRouter.RouteHandler;


var App = React.createClass({
	var category = this.getParams().category
	render: function() {
		
	}
});
var SideBar = React.createClass({
	render: function(){
		return(
			<div>
				<ul>
					<li><Link to="home">Home</Link></li>
				</ul>
				<RouteHandler/>
			</div>
		)
	}
});

var routes = ( 
	<Route handler={SideBar} path="/">
      <Route name="home" handler={HomePage}/>
    </Route>
);

ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.getElementById('sidebar'));
});