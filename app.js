var main = function()
{	//Place content into panes
	$(".pane").each(function()
	{	$(this).append($(this).prev().children("li"));
	});
	
	//Set up current front page elements to DOM
	for (var i=0;i<(-1+$("#home>div").children().length);i++)
	{	var front = ".front-" + (i+1);
		front = $(front);
		front.first()
		.append(front.last().children().first().siblings().clone());
		var ff = front.first().parent().children().index(front.first());
		var fl = front.last().parent().children().index(front.last());
		$(".pane>li").eq(ff)
		.replaceWith(front.last().parent().siblings().children()
					 .eq(fl).clone()/*.removeClass("splash")*/);
	}
	
	//Prepare page layout
	$("div.splash").siblings().hide();
	$(".column>div").each(function()
	{	$(this).children().first().siblings().hide();
	});
	$(".pane>li>div").each(function()
	{	$(this).prepend($(this).children(".minipic").children().first().clone()
						.css({"width":"65%","height":"50%"}));
	});
	$("#navbar>li:eq(0)").css({"color":"#10001f","background-color":"#099696"});
	$("#navbar>li:eq(1)").css({"color":"#802e19","background-color":"#b39d5d"});
	$("#navbar>li:eq(2)").css({"color":"#59ab4b","background-color":"#660a00"});
	var marker_pillar_color = reskin(location.hash);
	var marker = marker_pillar_color[0];
	var pillar = marker_pillar_color[1];
	var color1 = marker_pillar_color[2];
	var color2 = marker_pillar_color[3];
	pillar.toggleClass("pillar");
	var minipic = $(".minipic>*");
	var reference = $("#footer>a");
	reference.each(function()
	{	$(this).children().first().siblings().hide();
	});
	$(".flip>img").eq(1).css({"float":"right"});
	//$(".flip>img").last().css({"float":"right"});
	//$(".flip>img").first().css({"display":"block"});
	$("#load").remove();
	
	//Reset page on navigation change
	if ("onhashchange" in window)
	{	window.onhashchange = function()
		{	marker_pillar_color = reskin(location.hash);
			pillar.toggleClass("pillar");
			marker = marker_pillar_color[0];
			pillar = marker_pillar_color[1];
			color1 = marker_pillar_color[2];
			color2 = marker_pillar_color[3];
			pillar.toggleClass("pillar");
		};
	}
	
	//Pane controls
	$(".arrow").click(function()
	{	if ($(this).parent().hasClass("flip"))
		{	var col = $(".pane>li").first().children().finish();
			var current = col.first();
			if ($(this).is($(".flip>img").eq(2)))
			{	var upnext = current;
				if (current.children().attr("src").length)
					window.open(current.children().attr("src"),"_blank");
			}
			else if ($(this).is($(".flip>img").eq(0)) && col.length!=1)
			{	var upnext = col.last();
				current.before(upnext);
			}
			else if ($(this).is($(".flip>img").eq(1)) && col.length!=1)
			{	var upnext = current.next();
				col.last().after(current);
			}
			else
			{	/*var escape = 0;
				while (marker.index(current) != (-1+col.length))
				{	col.last().after(current.hide());
					col = $(".pane>li").first().children();
					current = col.first().show();
					escape++; if (escape>20) {alert("fail");break;}
				}*/
				var upnext = current;
			}
			current.fadeOut(0,function(){upnext.fadeIn(0);});
			$(".pane").find("div").first().children().first().after($(".flip"));
			$(".flip b").text(1+marker.index(upnext) + " / " + col.length);
		}
		//else
			//marker = colscroll(!$(this).is($(".scroll>img").last()),pillar);
	});
	
	//Preview picture controls
	minipic.mouseenter(function()
	{	$(this).closest("li>div").children().first().remove();
		$(this).closest("li>div").prepend($(this).clone()
										  .css({"width":"65%","height":"50%"}));
	});
	minipic.click(function()
	{	window.open($(this).attr("src"),"_blank");
	});
	
	//Pillar navigation by up or down
	$("body").on({click:function()
	{	var col = $("div.column").first().children();
		if ($(this).is(col.first()) || $(this).is($(".scroll").next()))
			marker = colscroll(!$(this).is(col.first()),pillar,color1,color2);
		$(this).css("text-shadow","none");
	},
	mouseenter:function()
	{	$(this).not(".inpillar").css("text-shadow","2px 2px 2px white");
	},
	mouseleave:function()
	{	$(this).css("text-shadow","none");
	}
	},".pillar",false);
	
	//Pillar navigation by tabs
	$("body").on({click:function()
	{	var escape = 0;
		var ut = pillar.index($(".inpillar")) - $(".scroll>div").index($(this));
		var dt = $(".scroll>div").index($(this)) - pillar.index($(".inpillar"));
		if (ut < 0)
			ut += pillar.length;
		else
			dt += pillar.length;
		while ($(".scroll>div").index($(this)) != pillar.index($(".inpillar")))
		{	marker = colscroll(dt<ut,pillar,color1,color2);
			escape++; if (escape>20) {alert("fail");break;}
		}
		$(this).animate({right:"0%",width:"100%"},0).children().remove();
	},
	mouseenter:function()
	{	$(this).animate({right:"400%",width:"500%"},"fast")
		.append(pillar.eq($(".scroll>div").index($(this))).children("h1").clone()
				.css({"font-size":"2vw","margin":"0"}));
	},
	mouseleave:function()
	{	$(this).animate({right:"0%",width:"100%"},"fast")
		.children(/*":not(:first-child)"*/).remove();
	}
	},".tabs",false);
	
	//Pillar navigation by mouse wheel
	//http://www.sitepoint.com/html5-javascript-mouse-wheel/
	var scroll_lk = 1;
	if (window.addEventListener) 
	{	window.addEventListener("mousewheel",wheelscroll,false);
		window.addEventListener("DOMMouseScroll",wheelscroll,false);
	}
	else
		window.attachEvent("onmousewheel",wheelscroll);
	function wheelscroll(e)
	{	if (!scroll_lk)
		{	var e = window.event || e;
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			marker = colscroll(delta-1,pillar,color1,color2);
			scroll_lk++;
		}
		else
		{	scroll_lk++;
			if (scroll_lk == 15)
				scroll_lk = 0;
		}
		return false;
	};
	
	//Page navigation
	$("#navbar>li").click(function()
	{	if ($(this).hasClass("home"))
			location.href = "#home";
		else if ($(this).hasClass("projects"))
			location.href = "#projects";
		else if ($(this).hasClass("social"))
			location.href = "#social";
	});
	$("#help").click(function()
	{	$("#footer").show(0,function()
		{	$(this).animate({right:"25%"},"fast",function()
			{	$(this).mouseleave(function()
				{	$(this).animate({right:"101%"},"fast",function(){$(this).hide();});
				});
			});
		});
	});
	
	reference.hover(function()
	{	$(this).children().first().fadeOut(0);
		//.css({"z-index":"0","position":"relative"});
		$(this).children().first().siblings().fadeIn(0);
	},function()
	{	$(this).children().first().fadeIn(0);
		$(this).children().first().siblings().fadeOut(0);
	});
};

/**/

var reskin = function(upfront)
{	//Split hash for manual pane select
	var upsplit = upfront.split("-",2);
	upfront = upsplit[0];
	upsplit = parseInt(upsplit[1]);
	
	//Reorder navbar and safetly move pane controls
	var nav = $("#navbar>li");
	//?//$().toggleClass();
	if (upfront == "#"+nav.first().attr("class"))
		nav.first().toggleClass()
		.before(nav.last().after(nav.eq(1).toggleClass()));//.insertAfter(nav.eq(1));
	else if (upfront == "#"+nav.last().attr("class"))
		nav.last().toggleClass()
		.after(nav.first().before(nav.eq(1).toggleClass()));//.insertBefore(nav.eq(3));
	$("#footer").before($(".flip"));
	
	//Select new page theme
	if (upfront == "#projects")
	{	upfront = $(upfront);
		var color1 = "#099696";
		var color2 = "#10001f";
		$("head>title").text("GATq PROJECTS");
	}
	else if (upfront == "#social")
	{	upfront = $(upfront);
		var color1 = "#660a00";
		var color2 = "#59ab4b";
		$("head>title").text("GATq SOCIAL");
	}
	else
	{	upfront = $("#home");
		var color1 = "#b39d5d";
		var color2 = "#802e19";
		$("head>title").text("GATq HOME");
	}
	$("body").css({"color":color2,"background-color":color1});
	$(".column").css({"color":color1,"background-color":color2});
	$(".ref>a").css({"color":color2,"background-color":color1});
	
	//Return previous column to its original state
	//$(".pane").first().children("li").first().fadeOut(600);
	var escape = 0;
	var dtop = $("#header").next().children("div").children();
	while (!dtop.first().hasClass("splash"))
	{	colscroll(false,dtop,0,0);//parameters do not matter here
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
		nav.eq(1).toggleClass();
	
	//Show new page theme and get new counters and title
	$("#header").after(upfront.show());
	upfront.nextUntil().hide();
	var marker = $(".pane>li").first().children();
	var pillar = upfront.children("div").children();
	$(".pane>li").hide().finish();
	marker.first().show().parent().show();
	$("#header>*").replaceWith(pillar.first().children("h1"));
	
	//Set up pillar view
	pillar.first().show().addClass("inpillar").next().show().prev()
	.after($(".scroll").css({"width":"20%","height":"70%",
							 "display":"inline-block"}))
	.before(pillar.last().show());
	//.end().first().children().show();
	pillar.first().children().show();
	
	//Set up column tabs
	var h = (100/pillar.length) + "%";
	$(".scroll").children().remove().end().append($("<div>").text(1)
	.css({"width":"100%","height":h,"position":"relative"}));
	for (var i=1;i<pillar.length;i++)
		$(".scroll").append($("<div>").text(1+i).addClass("tabs")
							.css({"width":"100%","height":h,"position":"relative",
								  "color":color2,"background-color":color1,
								  "outline":"1px solid","outline-color":color2}));
	
	//Set up pane view
	if (!isNaN(upsplit) && upsplit<=pillar.length && upsplit>0)
	{	for (upsplit--;upsplit>0;upsplit--)
			marker = colscroll(true,pillar,color1,color2);
	}
	//$(".flip").css("background-color",color1);
	//$(".pane").first().append($(".flip").show());
	$(".pane").find("div").first().children().first().after($(".flip").show());
	//$(".pane").first().after($(".flip").show());
	$(".flip b").text("1 / " + marker.length);
	//$(".scroll>b").text("1 / " + pillar.length);
	
	return [marker,pillar,color1,color2];
};

/**/

var colscroll = function(action,pillar,color1,color2)
{	//Set up controls to handle column scrolling and pane organizing
	var col = $(".column").first().children();
	var ctop = col.first();
	var cmid = ctop.next();
	var cbot = $(".scroll").next();
	var list = $(".pane").first().children("li").finish();
	var current = list.first();
	
	if (action)//Increases index (down), get top item and push it to the bottom
	{	col.last().after(ctop.hide());
		cbot.addClass("inpillar").after($(".scroll")).children().show()
		.first().appendTo($("#header"));
		$(".scroll").next().show();
		$(".scroll").children().eq(pillar.index(cbot)).removeClass("tabs")
		.css({"color":color1,"background-color":color2});
		var upnext = current.next();
		list.last().after(current);
	}
	else//Decreases index (up), get bottom item and push it to the top
	{	ctop.before(col.last().show())
		.addClass("inpillar").after($(".scroll")).children().show()
		.first().appendTo($("#header"));
		cbot.hide();
		$(".scroll").children().eq(pillar.index(ctop)).removeClass("tabs")
		.css({"color":color1,"background-color":color2});
		var upnext = list.last();
		current.before(upnext);
	}
	$(".scroll").children().eq(pillar.index(cmid)).addClass("tabs")
	.css({"color":color2,"background-color":color1});
	
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
	current.fadeOut(0,function(){upnext.fadeIn(0);});
	$(".pane").find("div").first().children().first().after($(".flip"));
	$(".flip b").text("1 / " + marker.length);
	
	return marker;
};

/**/

//http://stackoverflow.com/questions/1582534/calculating-text-width-with-jquery
$.fn.textWidth = function()
{	var html_org = $(this).html();
	var html_calc = "<span>" + html_org + "</span>";
	$(this).html(html_calc);
	var width = $(this).find("span:first").width();
	$(this).html(html_org);
	return width;
};

$(main);
