var Comment = React.createClass({
	render: function(){
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				{this.props.children}
			</div>	
		)
	}
})
var CommentList = React.createClass({
	render: function(){
		var commentNodes = this.props.data.map(function (comment){
			return (
				<Comment author={comment.author}>{comment.text}</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		var author = this.refs.author_form.getDOMNode().value.trim();
		var comment = this.refs.comment_form.getDOMNode().value.trim();
		
		if (!author || !comment){
			return;
		}
		this.props.onCommentSubmit({author: author, text: comment});
		this.refs.author_form.getDOMNode().value = '';
		this.refs.comment_form.getDOMNode().value = '';
		return;
	},
	render: function(){
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Name" ref="author_form"/>
				<input type="text" placeholder="Comment" ref="comment_form"/>
				<input type="submit" value="Post" />
			</form>	
		);
	}
});

var CommentBox = React.createClass({
	getInitialState: function(){
		return {data:[]};
	},
	loadCommentsFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				if(this.isMounted()) {
	        		this.setState({data: data});
        		}
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount: function(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	handleSubmit: function(commentObject){
		console.log("WORKS");
		$.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      type: 'POST',
	      data: commentObject,
	      success: function(data) {
	      	if(this.isMounted()) {
	        	this.setState({data: data});
	        }
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
    	});
	},
	render: function(){
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data= {this.state.data}/>
				<CommentForm onCommentSubmit={this.handleSubmit}/>
			</div>
		);
	}
});

React.render(
	<CommentBox url="comments.json" pollInterval={2000}/>,
	document.getElementById('content')
);

var Resume = React.createClass({
	render: function() {
		return (
			<div> TEST </div>
		);
	}
});

var menuItems = ["Home", "Resume"];

var SideBarItem = React.createClass({
	handleOnClick: function(event, key) {
		console.log(event);
	},
	render: function(){
		var children = this.props.children;
		return (
			<li className="menuItem" onClick={this.props.onClick.bind(null, children)}> {children} </li>
		);
	}
});

var SideBar = React.createClass({
	showHomeView: function() {
		$('#resume').hide();
		$('#content').show();
		toggleSidebar();

		React.render(
			<CommentBox url="comments.json" pollInterval={2000}/>,
			document.getElementById('content')
		);
	},
	showResumeView: function() {
		$('#content').hide();
		$('#resume').show();
		toggleSidebar();
		PDFJS.getDocument('harrisWarrenYip.pdf').then(function(pdf) {
			pdf.getPage(1).then(function(page) {
				var scale = 1;
				var viewport = page.getViewport(scale);

				var canvas = document.getElementById('resume');
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				var renderContext = {
				  canvasContext: context,
				  viewport: viewport
				};
				page.render(renderContext);
				$("#resume").css({display: "block"});
			});
		});

	},
	handleOnClick: function(item) {
		if (item[1] === "Home") {
			this.showHomeView();
		} else if (item[1] === "Resume"){
			this.showResumeView();
		}
	},
	render: function(){
		var handleOnClick = this.handleOnClick;
		var menuNodes = menuItems.map(function (item, i){
			return (
				<SideBarItem
				 key={i}
				 onClick={handleOnClick}
				> {item} </SideBarItem>
			);
		});
		return (
			<ul id="sidebarList">
				{menuNodes}
			</ul>
		);
	}
});

React.render(
	<SideBar />,
	document.getElementById('sidebar')
); 