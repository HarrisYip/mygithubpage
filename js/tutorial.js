var Comment = React.createClass({displayName: 'Comment',
	render: function(){
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("h2", {className: "commentAuthor"}, 
					this.props.author
				), 
				this.props.children
			)	
		)
	}
})
var CommentList = React.createClass({displayName: 'CommentList',
	render: function(){
		var commentNodes = this.props.data.map(function (comment){
			return (
				React.createElement(Comment, {author: comment.author}, comment.text)
			);
		});
		return (
			React.createElement("div", {className: "commentList"}, 
				commentNodes
			)
		);
	}
});

var CommentForm = React.createClass({displayName: 'CommentForm',
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
			React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
				React.createElement("input", {type: "text", placeholder: "Name", ref: "author_form"}), 
				React.createElement("input", {type: "text", placeholder: "Comment", ref: "comment_form"}), 
				React.createElement("input", {type: "submit", value: "Post"})
			)	
		);
	}
});

var CommentBox = React.createClass({displayName: 'CommentBox',
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
			React.createElement("div", {className: "commentBox"}, 
				React.createElement("h1", null, "Comments"), 
				React.createElement(CommentList, {data: this.state.data}), 
				React.createElement(CommentForm, {onCommentSubmit: this.handleSubmit})
			)
		);
	}
});

React.render(
	React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
	document.getElementById('content')
);

var Resume = React.createClass({displayName: 'Resume',
	render: function() {
		return (
			React.createElement("div", null, " TEST ")
		);
	}
});

var menuItems = ["Home", "Resume"];

var SideBarItem = React.createClass({displayName: 'SideBarItem',
	handleOnClick: function(event, key) {
		console.log(event);
	},
	render: function(){
		var children = this.props.children;
		return (
			React.createElement("li", {className: "menuItem", onClick: this.props.onClick.bind(null, children)}, " ", children, " ")
		);
	}
});

var SideBar = React.createClass({displayName: 'SideBar',
	showHomeView: function() {
		$('#resume').hide();
		$('#content').show();
		toggleSidebar();

		React.render(
			React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
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
				React.createElement(SideBarItem, {
				 key: i, 
				 onClick: handleOnClick
				}, " ", item, " ")
			);
		});
		return (
			React.createElement("ul", {id: "sidebarList"}, 
				menuNodes
			)
		);
	}
});

React.render(
	React.createElement(SideBar, null),
	document.getElementById('sidebar')
); 