var main = function()
{	//Set up current front page elements to DOM
	for (var i=0;i<(-2+$("#home>div").children().length);i++)
	{	var front = ".front-" + (i+1);
		front = $(front);
		front.first()
		.append(front.last().children().first().siblings().clone());
		var ff = front.first().parent().children().index(front.first());
		var fl = front.last().parent().children().index(front.last());
		$(".pane>li").eq(ff)
		.replaceWith(front.last().parent().siblings().children()
					.eq(fl).clone().removeClass("splash"));
	}
	
	//Prepare page layout
	$("div.splash").siblings().hide();
	$(".column>div").each(function()
	{	$(this).children().first().siblings().hide();
	});
	var marker_pillar = reskin(location.hash);
	var marker = marker_pillar[0];
	var pillar = marker_pillar[1];
	pillar.toggleClass("pillar");
	var reference = $("#footer>div>div");
	reference.each(function()
	{	$(this).children().first().siblings().hide();
	});
	$(".flip>img").first().css({"float":"left"});
	$(".flip>img").last().css({"float":"right"});
	$("#load").remove();
	
	//Reset page on navigation change
	if ("onhashchange" in window)
	{	window.onhashchange = function()
		{	marker_pillar = reskin(location.hash);
			pillar.toggleClass("pillar");
			marker = marker_pillar[0];
			pillar = marker_pillar[1];
			pillar.toggleClass("pillar");
		};
	}
	
	$(".arrow").click(function()
	{	if ($(this).parent().hasClass("flip"))
		{	var col = $(".pane>li").first().children().finish();
			var current = col.first();
			if ($(this).is($(".flip>img").eq(0)))
			{	var upnext = current;
				window.open(current.children().attr("src"),"_blank");
			}
			else if ($(this).is($(".flip>img").eq(1)))
			{	var upnext = col.last();
				current.before(upnext);
			}
			else if ($(this).is($(".flip>img").eq(2)))
			{	var upnext = current.next();
				col.last().after(current);
			}
			else
			{	var escape = 0;
				while (marker.index(current) != (-1+col.length))
				{	col.last().after(current.hide());
					col = $(".pane>li").first().children();
					current = col.first().show();
					escape++; if (escape>20) {alert("fail");break;}
				}
				var upnext = current;
			}
			current.fadeOut(600,function(){upnext.fadeIn(600);});
			$(".flip>b").text(1+marker.index(upnext) + " / " + col.length);
		}
		else
			marker = colscroll(!$(this).is($(".scroll>img").last()),pillar);
	});
	
	$("body").on("click",".pillar",function()
	{	var col = $("div.column").first().children();
		if ($(this).is(col.first()) || $(this).is($(".scroll").next()))
			marker = colscroll(!$(this).is(col.first()),pillar);
		return false;
	});
	
	$("#navbar>li").click(function()
	{	if ($(this).hasClass("home"))
			location.href = "#home";
		else if ($(this).hasClass("projects"))
			location.href = "#projects";
		else if ($(this).hasClass("social"))
			location.href = "#social";
		else if ($(this).is($("#navbar>li:nth-child(4)")))
			$("#footer").show(0,function(){$(this).animate({top:"0"},"fast");});
	});
	
	$("#footer>h2").click(function()
	{	$("#footer").animate({top:"101%"},"fast",function(){$(this).hide();});
	});
	
	reference.hover(function()
	{	$(this).children().first().fadeOut(600);
		$(this).children().first().siblings().fadeIn(600);
	},function()
	{	$(this).children().first().fadeIn(600);
		$(this).children().first().siblings().fadeOut(600);
	});
};

var reskin = function(upfront)
{	//Reorder navbar
	var nav = $("#navbar>li");
	if (upfront == "#"+nav.first().attr("class"))
		nav.first().toggleClass()
		.before(nav.last().after(nav.eq(2).toggleClass())).insertAfter(nav.eq(1));
	else if (upfront == "#"+nav.last().attr("class"))
		nav.last().toggleClass()
		.after(nav.first().before(nav.eq(2).toggleClass())).insertBefore(nav.eq(3));
	
	//Select new page theme
	if (upfront == "#projects")
	{	upfront = $(upfront);
		$("head>title").text("GATq PROJECTS");
		$("body").css({"color":"#220040","background-color":"#11a6a6"});
		$(".column").css({"color":"#11a6a6","background-color":"#220040"});
	}
	else if (upfront == "#social")
	{	upfront = $(upfront);
		$("head>title").text("GATq SOCIAL");
		$("body").css({"color":"#5fc24e","background-color":"#cf1500"});
		$(".column").css({"color":"#cf1500","background-color":"#5fc24e"});
	}
	else
	{	upfront = $("#home");
		$("head>title").text("GATq HOME");
		$("body").css({"color":"#3d160c","background-color":"#dfaf20"});
		$(".column").css({"color":"#dfaf20","background-color":"#3d160c"});
	}
	
	//Return previous column to its original state
	var escape = 0;
	var dtop = $("#header").next().children("div").children();
	while (!dtop.first().hasClass("splash"))
	{	colscroll(false,dtop);//parameters do not matter here
		dtop = $("#header").next().children("div").children();
		escape++; if (escape>20) {alert("fail");break;}
	}
	
	//After first page load, return header title to inpillar column,
	//then reorganize previous pane to match column,
	//otherwise, toggle HOME nav icon (off on #home, on otherwise)
	if ($("#header>*").text() != "0")
	{	dtop.eq(1).children().hide();
		dtop.hide().eq(1).removeClass("inpillar")
		.prepend($("#header>*").clone());
		$("ul.pane").first().children("li").first()
		.before($("ul.pane").first().children("li").last());
	}
	else
		nav.eq(2).toggleClass();
	
	//Show new page theme and get new counters and title
	$("#header").after(upfront.show());
	upfront.nextUntil().hide();
	var marker = $(".pane>li").first().children();
	var pillar = upfront.children("div").children();
	$(".pane>li").hide().finish();
	marker.first().show().parent().show();
	$("#header>*").replaceWith(pillar.first().children("h1"));
	
	//Set up column and pane views
	pillar.first().show().addClass("inpillar").next().show().prev()
	.after($(".scroll").css({"width":"20%","height":"70%",
							 "display":"inline-block"}))
	.before(pillar.last().show());
	//.end().first().children().show();
	pillar.first().children().show();
	$(".pane").first().append($(".flip").show());
	$(".flip>b").text("1 / " + marker.length);
	$(".scroll>b").text("1 / " + pillar.length);
	
	return [marker,pillar];
};

var colscroll = function(action,pillar)
{	//Set up controls to handle column scrolling and pane organizing
	var col = $("div.column").first().children();
	var ctop = col.first();
	var cmid = ctop.next();
	var cbot = $(".scroll").next();
	var list = $("ul.pane").first().children("li").finish();
	var current = list.first();
	
	if (action)//Increases index (down), get top item and push it to the bottom
	{	col.last().after(ctop.hide());
		cbot.addClass("inpillar").after($(".scroll")).children().show()
		.first().appendTo($("#header"));
		$(".scroll").next().show();
		$(".scroll>b").text(1+pillar.index(cbot) + " / " + (-1+col.length));
		var upnext = current.next();
		list.last().after(current);
	}
	else//Decreases index (up), get bottom item and push it to the top
	{	ctop.before(col.last().show())
		.addClass("inpillar").after($(".scroll")).children().show()
		.first().appendTo($("#header"));
		cbot.hide();
		$(".scroll>b").text(1+pillar.index(ctop) + " / " + (-1+col.length));
		var upnext = list.last();
		current.before(upnext);
	}
	
	//Return header title back and organize pane to starting state
	cmid.prepend($("#header>*").first())
	.removeClass("inpillar").children().first().siblings().hide();
	var escape = 0;
	var c = current.children();
	while (!c.first().hasClass("splash"))
	{	c.first().before(c.last());
		c = current.children();
		escape++; if (escape>20) {alert("fail");break;}
	}
	c.first().show().siblings().hide();
	var marker = $(".pane>li").first().children();
	current.fadeOut(600,function(){upnext.fadeIn(600);});
	$(".flip>b").text("1 / " + marker.length);
	
	return marker;
};

$(main);