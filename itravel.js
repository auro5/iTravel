noRecordformap=0;
noRecord="";
flagForYelpReviews="";
superData=""
superflagForYelpReviews="";
glat="";
glon="";

function valid1(checkid){

	if(document.getElementById("curLoc").checked)
	{
		if(valid2('keyword'))
		{
			flag2=true
			document.getElementById("search").disabled=false;
		}
	}
	else
	{	document.getElementById("search").disabled=true;
		if(checkid=='locText')
		{
			flag1 = valid2('locText')
			
		}
		if(checkid=='keyword')
		{
			flag2 = valid2('keyword')

		}

		if(flag1==true && flag2==true)
			document.getElementById("search").disabled=false;
	}
}

function valid2(checkid){
	var x = document.getElementById(checkid).value;
	if(checkid=='keyword')
		var err = document.getElementById('err1');
	if(checkid=='locText')
		var err = document.getElementById('err2');
	
    if(x.length==0 || x.trim()=='')
        {   
			err.style.display="block";
            err.style.color="red";
            document.getElementById(checkid).style.border="1px solid red";
			return false;
        }
        else
		{
            err.style.display="none";
            document.getElementById(checkid).style.removeProperty('border');
			autoComplete();  //function call for autocomplete after one letter entered
			return true;
        }
	
}
function autoComplete(){
	var input = document.getElementById("locText");
	var autocomplete = new google.maps.places.Autocomplete(input);
}

function enableLoc(){
	document.getElementById("locText").disabled=false;
	document.getElementById("search").disabled=true;
}

function clearfields(){
	document.getElementById("keyword").value="";
	document.getElementById("dist").value="";
	document.getElementById("locText").value="";
	document.getElementById("category").selectedIndex ="0";
	var tabpart = document.getElementById("part2");
	if(tabpart.hasChildNodes())
	{
		while(tabpart.hasChildNodes())
		tabpart.removeChild(tabpart.lastChild);
	}
	var tabpart1 = document.getElementById("part3");
	if(tabpart1.hasChildNodes())
	{
		while(tabpart1.hasChildNodes())
		tabpart1.removeChild(tabpart1.lastChild);
	}
	var tabpart5 = document.getElementById("part5");
	if(tabpart5.hasChildNodes())
	{
		while(tabpart5.hasChildNodes())
		tabpart5.removeChild(tabpart5.lastChild);
	}				
	initial();
}

function initial(){
				
	document.getElementById("curLoc").checked = true;
	document.getElementById("locText").style.removeProperty('border');
	document.getElementById('err2').style.display="none";
	document.getElementById("search").disabled=true;
	document.getElementById("locText").disabled=true;
				
	$.ajax({
			type: 'GET',
			url: 'http://www.ip-api.com/json',						
			success: function(jsonobj) {
				j1 = jsonobj.lat;
				j2 = jsonobj.lon;
				document.getElementById("latitude").value=j1;
				document.getElementById("longitude").value=j2;
			 }
			});

	
	$("#pills-profile-tab").removeClass("active show");
	$("#pills-profile").removeClass("active show");
	$("#pills-home-tab").addClass("active show");
	$("#pills-home").addClass("active show");
	displayFav();
	var x = document.getElementById('keyword').value;
	if(x.length!=0&&x.trim()!='')
		document.getElementById("search").disabled=false;
//localStorage.clear();			
}

function main(){
	//remove part2 
	$("#pills-profile-tab").removeClass("active show");
	$("#pills-profile").removeClass("active show");
	$("#pills-home-tab").addClass("active show");
	$("#pills-home").addClass("active show");
	document.getElementById("disdetails1").style.visibility="hidden";
		document.getElementById("disdetails1").style.display="none";
	var tabpart = document.getElementById("part2");
	if(tabpart.hasChildNodes())
	{	
		while(tabpart.hasChildNodes())
			tabpart.removeChild(tabpart.lastChild);
	}
	//remove part3
	var tabpart1 = document.getElementById("part3");
	if(tabpart1.hasChildNodes())
	{
		while(tabpart1.hasChildNodes())
		tabpart1.removeChild(tabpart1.lastChild);
	}
	//remove part5
	var tabpart5 = document.getElementById("part5");
	if(tabpart5.hasChildNodes())
	{
		while(tabpart5.hasChildNodes())
		tabpart5.removeChild(tabpart5.lastChild);
	}
	tabpart.style.display='block';
	tabpart.innerHTML = '<div class="progress" id="progressbar" style="margin-top:100px"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 	 aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;"></div></div>';
	
	var inp1 = document.getElementById("keyword").value;
	inp1 = encodeURIComponent(inp1.trim());
	var inp2 = document.getElementById("category").value;
	var inp3 = document.getElementById("dist").value;
	
	if(inp3 == "")
		inp3 = 10;
	var distance = inp3*1609.34;
	
	if(document.getElementById("curLoc").checked)
	{
		glat = document.getElementById("latitude").value;
		glon = document.getElementById("longitude").value;
		
		$.ajax({
			type: 'GET',
			url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/places?key='+inp1+'&category='+inp2+'&dist='+distance+'&latitude='+glat+'&longitude='+glon,						
			success: function(data2) {
				JSONOBJ = data2;
				generateTable(data2);
			 }
			});
		
	}
	else
	{
		
		usertypedloc = document.getElementById("locText").value;
		usertypedloc = encodeURIComponent(usertypedloc.trim());
		console.log(usertypedloc)
			$.ajax({
				type: 'GET',
				url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/geocode?locterm='+usertypedloc,						
				success: function(data1)
				{
				 console.log(data1);
				 
					if(data1.results.length==0)
						noRecord = 1;
					else{
						glat = data1.results[0].geometry.location.lat;
						glon = data1.results[0].geometry.location.lng;
						console.log(glat)
					}
					if(noRecord==1){
						
						tabpart.innerHTML='<div class="alert alert-warning" role="alert">No Records</div>';
					}
					else{//call nearby places api
							$.ajax({
							type: 'GET',
							url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/places?key='+inp1+'&category='+inp2+'&dist='+distance+'&latitude='+glat+'&longitude='+glon,						
							success: function(data2) {
								JSONOBJ = data2;
								generateTable(data2);
							  }
							});
					}
				}
				});

		
	}
	//console.log(glat+" ddd" +glon)
	displayFav();
}//end of main()


function generateTable(jsonObj){
	var star=1
	$("#progressbar").css("display","none");
	OBJ = jsonObj;
	var firstcheck = jsonObj.results.length;
	tableBox = document.getElementById("part2");
	tableBox.innerHTML=""
	////////
	var b=[];
	for(var i=0;i<localStorage.length;i++){
			
		var key = localStorage.key(i);
		var value = JSON.parse(localStorage[key]);
		b.push(value);
	}
	
	////////
	var innerhtmltext="";
	if(firstcheck!=0){
		document.getElementById("disdetails1").style.visibility="visible";
		document.getElementById("disdetails1").style.display="block";
		//innerhtmltext += '<button type="button" class="btn float-right" disabled="true" id="disdetails1">Details <i class="fa fa-chevron-right"></i></button>' ;
		var text1 = '<div class="table-responsive"><table class="table table-hover" id="myTable1"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorite</th><th>Details</th></tr></thead><tbody>'
		
		var reslength = jsonObj.results.length; //to check the length of results google API might return
		if(jsonObj.results.length>20)
			var reslength = 20;
		else
			var reslength = jsonObj.results.length;
		
		for(var i=0;i<reslength;i++){
			//////
			var starClass = 'fa-star-o';
			if(b.length!=0){
			for(var k=0;k<b.length;k++)
			if(jsonObj.results[i].place_id==b[k].place_id)
			{	
				starClass='fa-star';
				break;
			}
			}	
				
			//////
			text1+= '<tr><td><b>'+(i+1)+'</b></td>';
			text1+= '<td><img src="'+jsonObj.results[i].icon+'" style="width:40px"></td>';
			text1+= '<td>'+jsonObj.results[i].name.replace(/ /g,"&nbsp;")+'</td>';
			text1+= '<td>'+jsonObj.results[i].vicinity.replace(/ /g,"&nbsp;")+'</td>';
			text1+= '<td><button type="button" class="btn btn-light smallT" ><i class="fa '+starClass+'" id="star'+star+'" onclick="starFav(OBJ.results['+i+'],this.id)"></i></button></td>';
			text1+= '<td><button type="button" class="btn btn-light smallT" onclick="detailsMenu1(\''+jsonObj.results[i].place_id+'\',\'part2\')"><i class="fa fa-chevron-right"></i></button></td>';	
			
			

		star++;			
		}
		console.log(jsonObj.results[0])
		innerhtmltext+=text1+'</tbody></table></div>';
		
		if(("next_page_token" in jsonObj))
		{
			innerhtmltext+= '<div class="text-center"><button type="button" class="btn" id="next1" onclick="showtable2(\''+jsonObj.next_page_token+'\')">Next</button></div>';
		}
		
		//tableBox.innerHTML=innerhtmltext;
		$(innerhtmltext).appendTo('#part2');
		document.getElementById("part2").style.display='block';
	}
	else{
		tableBox.innerHTML='<div class="alert alert-warning" role="alert">No Records</div>'
		document.getElementById("part2").style.display='block';
	}
}


function starFav(Obj,iid){
	console.log(iid)
	var x = $("#"+iid).attr('class');
	if(x=="fa fa-star-o")
	{
	$("#"+iid).removeClass("fa-star-o");
	$("#"+iid).addClass("fa-star");

	var testObject = { 'icon': Obj.icon, 'name': Obj.name.replace(/ /g,"&nbsp;"), 'addr': Obj.vicinity.replace(/ /g,"&nbsp;"),'time': moment().format(), 'place_id': Obj.place_id };
	localStorage.setItem(Obj.place_id,JSON.stringify(testObject));
	}
	else{
	$("#"+iid).removeClass("fa-star");
	$("#"+iid).addClass("fa-star-o");
	deleteFromFav1(Obj.place_id);
	}
	
	
}
function displayFav(){
	document.getElementById("part3").style.display="none";
	var innerhtmltext="";
	var favtable=document.getElementById("part5");
	favtable.style.display="block";

	if(localStorage.length==0){
		document.getElementById("part5").innerHTML='<div class="alert alert-warning" role="alert">No Records</div>';
	}
	else{
		document.getElementById("disdetails2").style.visibility="visible";
		document.getElementById("disdetails2").style.display="block";
		//innerhtmltext += '<button type="button" class="btn float-right" disabled="true" id="disdetails2">Details <i class="fa fa-chevron-right"></i></button>' ;
		
		var text1 = '<div class="table-responsive"><table id="favTab1"class="table table-hover" id="myFav1"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorite</th><th>Details</th></tr></thead><tbody>'
		var a=[];
	for(var i=0;i<localStorage.length;i++){
		
		//console.log(localStorage.key(i));	
		var key = localStorage.key(i);
		var value = JSON.parse(localStorage[key]);
		
		a.push(value); 
		console.log(value)
	}
	console.log(a);
	a.sort(compare1);
	w1=a;
	for(var i=0;i<a.length&&i<20;i++){
		//console.log(typeof value);
			
			text1+= '<tr><td><b>'+(i+1)+'</b></td>';
			text1+= '<td><img src='+a[i].icon+' style="width:40px"></td>';
			text1+= '<td>'+a[i].name+'</td>';
			text1+= '<td>'+a[i].addr+'</td>';
			text1+= '<td><button type="button" class="btn btn-secondary smallT" onclick="deleteFromFav(\''+a[i].place_id+'\')"><i class="fa fa-trash"></i></button></td>';
			text1+= '<td><button type="button" class="btn btn-secondary smallT" onclick="detailsMenu1(\''+a[i].place_id+'\',\'part5\')"><i class="fa fa-chevron-right"></i></button></td>';	
		w = i; 			
		}
		innerhtmltext+=text1+'</tbody></table></div>';
		if(a.length>20){
			innerhtmltext+='<div class="text-center"><button type="button" class="btn" id="nextFav" onclick="shoFav2(w,w1)">Next</button></div>';
		}
		
		favtable.innerHTML = innerhtmltext;
	}
}
function shoFav2(w,w1){
	document.getElementById("favTab1").style.display='none'
	document.getElementById("nextFav").style.display="none"
	var innerhtmltext='';
	var text1='<div class="table-responsive"><table id="favTab2"class="table table-hover" id="myFav1"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorite</th><th>Details</th></tr></thead><tbody>'
	
	for(var i=w+1;i<w1.length;i++){
		text1+= '<tr><td><b>'+(i+1)+'</b></td>';
			text1+= '<td><img src='+w1[i].icon+' style="width:40px"></td>';
			text1+= '<td>'+w1[i].name+'</td>';
			text1+= '<td>'+w1[i].addr+'</td>';
			text1+= '<td><button type="button" class="btn btn-secondary smallT" onclick="deleteFromFav(\''+w1[i].place_id+'\')"><i class="fa fa-trash"></i></button></td>';
			text1+= '<td><button type="button" class="btn btn-secondary smallT" onclick="detailsMenu1(\''+w1[i].place_id+'\',\'part5\')"><i class="fa fa-chevron-right"></i></button></td>';	
	}
	innerhtmltext+=text1+'</tbody></table></div>';
	innerhtmltext+='<div class="text-center"><button type="button" class="btn" id="prevFav" onclick="displayFav()">Previous</button></div>';
	$(innerhtmltext).appendTo('#part5');
	}
function deleteFromFav(deleteToken){
	localStorage.removeItem(deleteToken);
	displayFav();
}
function deleteFromFav1(deleteToken){
	localStorage.removeItem(deleteToken);
	
}
function disRes(){
	document.getElementById("part2").style.display="block";
	generateTable(JSONOBJ);
}
function showtable2(token){
	var star=21
	PAGE2 = 1;
	TOKEN = token
	
	$.ajax({
		type: 'GET',
		url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/nextpage?token='+token,						
		success: function(data3) {
			OBJ1 = data3
			console.log(data3)
			document.getElementById("myTable1").style.display="none"
			document.getElementById("next1").style.display="none"
			var innerhtmltext='';
			//var tableBox = document.getElementById("part2");
			
			var text1 = '<div class="table-responsive"><table class="table table-hover" id="myTable2"><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorite</th><th>Details</th></tr></thead><tbody>';
			
			var reslength = data3.results.length; //to check the length of results google API might return
			if(data3.results.length>20)
				var reslength = 20;
			else
				var reslength = data3.results.length;
		
			var b=[];
				for(var i=0;i<localStorage.length;i++){
					console.log("chack again   "+localStorage.key(i));	
					var key = localStorage.key(i);
					var value = JSON.parse(localStorage[key]);
					b.push(value);
				}
				
			for(var i=0;i<reslength;i++){
				var starClass = 'fa-star-o';
					if(b.length!=0){
					for(var k=0;k<b.length;k++)
					if(data3.results[i].place_id==b[k].place_id)
					{	
						starClass='fa-star';
						break;
					}
					}
				text1+= '<tr><td><b>'+(i+1)+'</b></td>';
				text1+= '<td><img src="'+data3.results[i].icon+'" style="width:40px"></td>';
				text1+= '<td>'+data3.results[i].name.replace(/ /g,"&nbsp;")+'</td>';
				text1+= '<td>'+data3.results[i].vicinity.replace(/ /g,"&nbsp;")+'</td>';
				text1+= '<td><button type="button" class="btn btn-light smallT"><i class="fa '+starClass+'" id="star'+star+'" onclick="starFav(OBJ1.results['+i+'],this.id)"></i></button></td>';
				text1+= '<td><button type="button" class="btn btn-light smallT" onclick="detailsMenu1(\''+data3.results[i].place_id+'\',\'part2\')"><i class="fa fa-chevron-right"></i></button></td>';		
				
				
				star++;
			}
			
			innerhtmltext+=text1+'</tbody></table></div>';
			
			if(("next_page_token" in data3))
			{
				innerhtmltext+= '<div class="text-center"><button type="button" class="btn" id="prev1" onclick="againshowtable1(1)">Previous</button><button type="button" class="btn" id="next2" onclick="showtable3(\''+data3.next_page_token+'\')">Next</button></div>';
			}
			else{
				innerhtmltext+= '<div class="text-center"><button type="button" class="btn" id="prev1" onclick="againshowtable1(2)">Previous</button></div>';
			}
			
			//tableBox.innerHTML=innerhtmltext;
			$(innerhtmltext).appendTo('#part2');

		}
	});
}
function againshowtable1(x){
	$('#myTable2').remove();
    $('#prev1').remove();
	PAGE2=0
	if(x==1)
		$('#next2').remove();
    document.getElementById("myTable1").style.display="table"
    document.getElementById("next1").style.display="inline"
}


function showtable3(token1){
	var star =22;
	TOKEN1 = token1
	PAGE3 =1;
	$.ajax({
		type: 'GET',
		url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/nextpage?token='+token1,						
		success: function(data4) {
			OBJ2 = data4
			document.getElementById("myTable2").style.display="none";
			document.getElementById("prev1").style.display="none";      
			document.getElementById("next2").style.display="none";
			var innerhtmltext='';
			//var tableBox = document.getElementById("part2");
			
			var text1 = '<div class="table-responsive"><table class="table table-hover" id="myTable3" ><thead><tr><th>#</th><th>Category</th><th>Name</th><th>Address</th><th>Favorite</th><th>Details</th></tr></thead><tbody>';
			
			var reslength = data4.results.length; //to check the length of results google API might return
			if(data4.results.length>20)
				var reslength = 20;
			else
				var reslength = data4.results.length;
		
		
			var b=[];
				for(var i=0;i<localStorage.length;i++){
					console.log("chack again   "+localStorage.key(i));	
					var key = localStorage.key(i);
					var value = JSON.parse(localStorage[key]);
					b.push(value);
				}
				
			for(var i=0;i<reslength;i++){
				
				var starClass = 'fa-star-o';
					if(b.length!=0){
					for(var k=0;k<b.length;k++)
					if(data4.results[i].place_id==b[k].place_id)
					{	
						starClass='fa-star';
						break;
					}
					}
					
				text1+= '<tr><td><b>'+(i+1)+'</b></td>';
				text1+= '<td><img src="'+data4.results[i].icon+'" style="width:40px"></td>';
				text1+= '<td>'+data4.results[i].name.replace(/ /g,"&nbsp;")+'</td>';
				text1+= '<td>'+data4.results[i].vicinity.replace(/ /g,"&nbsp;")+'</td>';
				text1+= '<td><button type="button" class="btn btn-light smallT"><i class="fa '+starClass+'" id="star'+star+'" onclick="starFav(OBJ2.results['+i+'],this.id)"></i></button></td>';
				text1+= '<td><button type="button" class="btn btn-light smallT" onclick="detailsMenu1(\''+data4.results[i].place_id+'\',\'part2\')"><i class="fa fa-chevron-right"></i></button></td>';		
			
				star++;
			}
			
			innerhtmltext+=text1+'</tbody></table></div>';
			
			innerhtmltext+= '<div class="text-center"><button type="button" class="btn" id="prev2" onclick="againshowtable2()">Previous</button></div>';
			
			//tableBox.innerHTML=innerhtmltext;
			$(innerhtmltext).appendTo('#part2');
		}
	});
}

function againshowtable2(){
	$('#myTable3').remove();
    $('#prev2').remove();
    PAGE3 = 0
    document.getElementById("myTable2").style.display="table"
    document.getElementById("prev1").style.display="inline"           
    document.getElementById("next2").style.display="inline"
    
}

function detailsMenu1(placeID1,caller){
	console.log(placeID1);
	console.log(caller);
	if(caller=='part2')
	{
		document.getElementById("disdetails1").disabled=false;
		
		document.getElementById("disdetails2").disabled=false;
		document.getElementById("disdetails2").onclick= function() {disdetails1display(placeID1,"part5")};
		
		document.getElementById("disdetails1").onclick= function() {disdetails1display(placeID1,"part2")};
		
	}
	if(caller=='part5')
	{
		document.getElementById("disdetails2").disabled=false;
		document.getElementById("disdetails2").onclick= function() {disdetails1display(placeID1,"part5")};
	}

	detailsMenu11(placeID1,caller);
}
function disdetails1display(placeID1,caller){
	console.log(caller);
	caller1=caller
	//document.getElementById("part3").style.display='block';
	document.getElementById(caller).style.display='none';
	if(caller=="part2")
		document.getElementById("disdetails1").style.display='none';
	else
		document.getElementById("disdetails2").style.display="none";
	
	detailsMenu11(placeID1,caller1);
}
function detailsMenu11(placeID1,caller){
	
	caller1=caller
	var x = document.createElement("DIV");
	x.setAttribute("id","part4");
	var request = {
		placeId: placeID1
	};
	service = new google.maps.places.PlacesService(x);
	service.getDetails(request, detailsMenu2);
		
}

function detailsMenu2(place, status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		PLACE = place;
		console.log(place);
		console.log(place.place_id);
		MegaPlace = place;
		document.getElementById(caller1).style.display='none';
		document.getElementById("disdetails1").style.display='none';
		//document.getElementById("disdetails1").style.visibility="hidden";
		var menubox = document.getElementById('part3');
		/////////////////
		var b=[];
	for(var i=0;i<localStorage.length;i++){
		//console.log(localStorage.key(i));	
		var key = localStorage.key(i);
		var value = JSON.parse(localStorage[key]);
		b.push(value);
	}
	//////////////////
	starClassd = 'fa-star-o';
			if(b.length!=0){
			for(var k=0;k<b.length;k++)
			if(place.place_id==b[k].place_id)
				starClassd='fa-star';
				}
				///////////////////
		var innerhtmltext='';
		innerhtmltext+='<p class="text-center"><b>'+place.name+'</b></p>';
		var datafortwitter = "https://twitter.com/intent/tweet?text=Check out "+place.name+" located at "+place.formatted_address+". Website: "+"&url="+place.website+"&hashtags=TravelAndEntertainmentSearch";
		console.log(datafortwitter);
		innerhtmltext+= '<button class="btn btn-light smallT" onclick="goback()"><i class="fa fa-chevron-left"></i>List</button><a href="'+datafortwitter+'"><img id="twitter" class="float-right" src="http://cs-server.usc.edu:45678/hw/hw8/images/Twitter.png" width="37"></a><button style="margin-right:10px;" class="btn btn-light smallT float-right"><i id="insideStar" class="fa '+starClassd+'" onclick="starFav(PLACE,this.id)"></i></button><div style="margin-top:10px;"></div>';
		
		//making of tabs
		var tabtext='<ul class="nav nav-tabs justify-content-end" id="myTab" role="tablist"><li class="nav-item"><a class="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Info</a></li><li class="nav-item"><a class="nav-link" id="photo-tab" data-toggle="tab" href="#photo" role="tab" aria-controls="photo" aria-selected="false">Photos</a></li><li class="nav-item"><a class="nav-link" id="map-tab" data-toggle="tab" href="#map" role="tab" aria-controls="map" aria-selected="false">Map</a></li><li class="nav-item"><a class="nav-link" id="review-tab" data-toggle="tab" href="#review" role="tab" aria-controls="review" aria-selected="false">Reviews</a></li></ul><div class="tab-content" id="myTabContent">';
		
		var infoTable = getInfoTable(place);
		var tabInfoTable = '<div class="tab-pane  show active" id="info" role="tabpanel" aria-labelledby="info-tab">'+infoTable+'</div>';
		tabtext+= tabInfoTable;
		
		var photoTab = getPhotoTab(place);
		var tabPhotoTable = '<div class="tab-pane" id="photo" role="tabpanel" aria-labelledby="photo-tab">'+photoTab+'</div>';
		tabtext+= tabPhotoTable;
		
		var mapTable = getMapInfo(place);
		var tabMapTable = '<div class="tab-pane" id="map" role="tabpanel" aria-labelledby="map-tab">'+mapTable+'</div>';
		tabtext+= tabMapTable;
		
		var reviewTable = getRevInfo(place);
		var tabRevTable = '<div class="tab-pane" id="review" role="tabpanel" aria-labelledby="review-tab">'+reviewTable+'</div>';
		
		tabtext+= tabRevTable+'</div>';
		
		menubox.innerHTML=innerhtmltext+tabtext;
			$("#rateYo").rateYo({
		rating: place.rating,
		starWidth: "15px",
		normalFill: "transparent",
		readOnly: true
	});
	makeYelpCalls(place);
	document.getElementById("googler").onclick=function(){googleReviews(place,"Google Reviews");}

	
	//write similarly for yelp reviews
		menubox.style.display='block';
		initMap(place);
		googleReviews(place,"Google Reviews");
 
	//making yelp calls
	
 
		//console.log(place.opening_hours.weekday_text[0])
  }
  else{
	  document.getElementById("part3").innerHTML='<div class="alert alert-warning" role="alert">No Records</div>'
  }
}
function goback(){
		document.getElementById("part3").style.display='none';
		if(caller1=="part2")
		{
			document.getElementById("disdetails1").style.display="block";
			console.log(TOKEN)
			//document.getElementById("disdetails1").style.visibility="visible";
			if(PAGE2==1)
			{//document.getElementById("myTable2").style.display='block';
				$('#myTable2').remove();
				$('#prev1').remove();
				$('#next2').remove();
				showtable2(TOKEN)
			}
			else
				if(PAGE3==1)
				{//document.getElementById("myTable3").style.display='block';
				$('#myTable3').remove();
				$('#prev2').remove();
				showtable3(TOKEN1)
				}
			else
				generateTable(JSONOBJ);
			//document.getElementById("myTable2").style.display='block';
			document.getElementById(caller1).style.display='block';
		}
		else
		{
			document.getElementById(caller1).style.display='block';
			document.getElementById("disdetails2").style.display='block';
		}
		
}
function getInfoTable(place){
	var table1 = '<div class="table-responsive"><table class="table table-striped"><tbody>';
	
	if("formatted_address" in place)
	{
		var x1 = '<tr><td><b>Address</b></td><td>'+place.formatted_address+'</td></tr>';
		table1+= x1;
	}
	if("international_phone_number" in place){
		var x2 = '<tr><td><b>Phone Number</b></td><td>'+place.international_phone_number+'</td></tr>';
		table1+= x2;
	}
	if("price_level" in place){
		var level = place.price_level;
		var x3='';
		switch (level) {
			case 0:
				x3='<tr><td><b>Price Level</b></td><td>0</td></tr>';
				break;
			case 1:
				x3='<tr><td><b>Price Level</b></td><td>$</td></tr>';
				break;
			case 2:
				x3='<tr><td><b>Price Level</b></td><td>$$</td></tr>';
				break;
			case 3:
				x3='<tr><td><b>Price Level</b></td><td>$$$</td></tr>';
				break;
			case 4:
				x3='<tr><td><b>Price Level</b></td><td>$$$$</td></tr>';
				break;

		}
		table1+= x3;
	}
	if("rating" in place){
		var x4 = '<tr><td><b>Rating</b></td><td>'+place.rating+'<div id="rateYo" style="display:inline-block"></div></td></tr>';
		table1+= x4;
	}
	if("url" in place){
		var x5 = '<tr><td><b>Google Page</b></td><td><a href="'+place.url+'">'+place.url+'</a></td></tr>';
		table1+= x5;
	}
	if("website" in place){
		var x6 = '<tr><td><b>Website</b></td><td><a href="'+place.website+'">'+place.website+'</a></td></tr>';
		table1+= x6;
	}
	if("opening_hours" in place){
		var selectday = moment(moment(moment().format()).utcOffset(+place.utc_offset)).day();
		console.log(selectday);
		if(place.opening_hours.open_now==false){
			var statusofShop = 'Closed';
		}
		else{	
			var todaytim = place.opening_hours.weekday_text[selectday-1];
			var statusofShop = 'Open now'+todaytim.substring(todaytim.indexOf(':'));
		}
		statusofShop += '<a href="#" data-toggle="modal" data-target="#myModal">Daily open hours</a>';
		
		var modalb='<div class="table-responsive"><table class="table"><tbody>';
		var j=0
		for(var i = selectday-1;j<7;j++,i++){
			if(i>6)
				i=i-7;
			var x= place.opening_hours.weekday_text[i];
			modalb+='<tr><td>'+x.substring(0,x.indexOf(":"))+'</td><td>'+x.substring(x.indexOf(":")+1)+'</td></tr>'
		}

		
		var modalfoot=' </tbody></table></div>'
		document.getElementById("mbody").innerHTML=modalb+modalfoot;
		var x7 = '<tr><td><b>Hours</b></td><td> '+statusofShop+'</td></tr>';
		table1+= x7;
	}
	table1+= '</tbody></table></div>';
	return table1;
}
function getPhotoTab(place){
	var grid='<div class="row">';
	var grid1='<div class="col-sm-3" style="padding:3px">';
	var grid2='<div class="col-sm-3" style="padding:3px">';
	var grid3='<div class="col-sm-3" style="padding:3px">';
	var grid4='<div class="col-sm-3" style="padding:3px">';
	
	if("photos" in place){
		var photos=place.photos;
		var phlen = photos.length;

		for(var i=0;i<photos.length;i++){
			
			if(i==0 || i==4 || i==8)
				grid1+='<img class="img-fluid img-thumbnail" style="margin-bottom:5px;" src="'+photos[i].getUrl({'maxWidth': photos[i].width, 'maxHeight': photos[i].width})+'"  onclick="window.open(this.src)">';
			
			if(i==1 || i==5 || i==9)
				grid2+='<img class="img-fluid img-thumbnail" style="margin-bottom:5px;" src="'+photos[i].getUrl({'maxWidth': photos[i].width, 'maxHeight': photos[i].width})+'"  onclick="window.open(this.src)">';
			
			if(i==2 || i==6 || i==10)
				grid3+='<img class="img-fluid img-thumbnail" style="margin-bottom:5px;" src="'+photos[i].getUrl({'maxWidth': photos[i].width, 'maxHeight': photos[i].width})+'"  onclick="window.open(this.src)">';
			
			if(i==3 || i==7)
				grid4+='<img class="img-fluid img-thumbnail" style="margin-bottom:5px;" src="'+photos[i].getUrl({'maxWidth': photos[i].width, 'maxHeight': photos[i].width})+'"  onclick="window.open(this.src)">';		
		}
		grid1+='</div>';
		grid2+='</div>';
		grid3+='</div>';
		grid4+='</div>';
		
		grid+=grid1+grid2+grid3+grid4+'</div>';
		return grid;
	}
	else{
		return '<div class="alert alert-warning" role="alert">No Records</div>';
	}
}

function getMapInfo(place){
	if(document.getElementById("curLoc").checked){
		var fromField = 'Your location'
		
	}
	else{
		var fromField = document.getElementById('locText').value;
		
	}
placepass = place
maplat = glat;
maplon = glon;

	var mapForm = '<form ><div class="form-row"><div class="form-group col-sm-4"><label for="inputFrom">From</label><input type="text" class="form-control" id="inputFrom" value="'+fromField+'" onfocusout="valid3(this.id)" onkeyup="valid3(this.id)"></div><div class="form-group col-sm-4"><label for="inputTo">To</label><input type="text" class="form-control" id="inputTo" value="'+place.name+', '+place.formatted_address+'" disabled="true"></div><div class="form-group col-sm-2"><label for="travelmode1">Travel Mode</label><select class="custom-select" id="travelmode1"><option value="DRIVING" selected>Driving</option><option value="BICYCLING">Bicycling</option><option value="TRANSIT">Transit</option><option value="WALKING">Walking</option></select></div><div style="margin-bottom:15px;margin-top:auto;"><button style="left:20px" id="direction" type="button" class="btn btn-primary" onclick="getDirections(placepass)" style="height:40px;margin-top:auto;">Get Directions</button></div></div></form><button class="btn" style="background-color:white" id="butformap" onclick="changemap(this.src)"><img id="imageformaps" src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png" width="37" id="mapchangeIcon" ></button><div id="displayMap" style="width:100%;height:350px;margin-top:10px;margin-bottom:50px"></div><div id="bottom-panel"></div>';
	
	//to display basic map
	
	return mapForm;
}
var panorama;
function initMap(place) {
        var uluru = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
        mainmap = new google.maps.Map(document.getElementById('displayMap'), {
          zoom: 13,
          center: uluru,
		  streetViewControl: false
        });
        marker = new google.maps.Marker({
          position: uluru,
          map: mainmap
        });
		console.log("hii")
	/*	panorama = new google.maps.StreetViewPanorama(
			document.getElementById('displayMap'), {
        position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
        motionTrackingControl: false,
        //linksControl: false,
        panControl: true,
        enableCloseButton: false
		
  });*/
  //panorama.setVisible(false);
	panorama = mainmap.getStreetView();
	panorama.setPosition(uluru);
	panorama.panControl=true;
	panorama.enableCloseButton=false;
	panorama.motionTrackingControl=false;
      }
	  
function changemap(imageid){
	var toggle = panorama.getVisible();
  if (toggle == false) {
	  document.getElementById("imageformaps").src="http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
    panorama.setVisible(true);
  } else {
	 document.getElementById("imageformaps").src="http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png"; 
    panorama.setVisible(false);
  }
}  
function getDirections(place){
				console.log(typeof place)
				$('#bottom-panel div').empty();
				marker.setVisible(false);
		var inpfrm = document.getElementById("inputFrom").value;
		inpfrm = inpfrm.trim();
		console.log(inpfrm)
		if(inpfrm=="Your location" || inpfrm=="My location")
		{	maplat = glat;
			maplon = glon;
			console.log(maplat)
			var directionsDisplay = new google.maps.DirectionsRenderer;
			var directionsService = new google.maps.DirectionsService;
			console.log("jjjj");
			directionsDisplay.setMap(mainmap);
			directionsDisplay.setPanel(document.getElementById('bottom-panel'));
			calculateAndDisplayRoute(directionsService, directionsDisplay,place);
		}
	else{
		
		inpfrm = encodeURIComponent(inpfrm);
			$.ajax({
				type: 'GET',
				url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/geocode?locterm='+inpfrm,						
				success: function(data9)
				{
				
				 
					if(data9.results.length==0)
						noRecordformap = 1;
					else{
						noRecordformap = 0;
						maplat = data9.results[0].geometry.location.lat;
						maplon = data9.results[0].geometry.location.lng;
					
					}
					if(noRecordformap==1){
						document.getElementById("bottom-panel").innerHTML='<div class="alert alert-warning" role="alert">Failed to get Directions</div>';
					}
				else{
					document.getElementById("bottom-panel").innerHTML="";
					var directionsDisplay = new google.maps.DirectionsRenderer;
					var directionsService = new google.maps.DirectionsService;
					console.log("jjjj");
					directionsDisplay.setMap(mainmap);
					directionsDisplay.setPanel(document.getElementById('bottom-panel'));
					calculateAndDisplayRoute(directionsService, directionsDisplay,place);		
			}
				}
			});
	}	
							
 }

 function calculateAndDisplayRoute(directionsService, directionsDisplay,place) {
console.log("kkkkkkkkkkkkkkk");
        directionsService.route({
          origin: {lat: Number(maplat), lng: Number(maplon)},  // Haight.
				  destination: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},  // Ocean Beach.
          travelMode: google.maps.TravelMode[document.getElementById("travelmode1").value],provideRouteAlternatives: true
        }, function(response, status) {
          if (status === 'OK') {
		  console.log(response.routes.length);
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
function autoComplete1(fromid){
	var input = document.getElementById(fromid);
	var autocomplete = new google.maps.places.Autocomplete(input);
}	  
function valid3(fromid){
	var x = document.getElementById(fromid).value;

    if(x.length==0 || x.trim()=='')
        {   
            document.getElementById(fromid).style.border="1px solid red";
			document.getElementById("direction").disabled=true;
        }
        else
		{
            document.getElementById(fromid).style.removeProperty('border');
			document.getElementById("direction").disabled=false;
			autoComplete1(fromid);  //function call for autocomplete after one letter entered	
        }	
}
function getRevInfo(place){

	//var x = googleReviews(place);
	var drops = '<div class="dropdown" style="display:inline;margin-bottom:20px"><button type="button" class="btn btn-secondary dropdown-toggle" id="forReviews" data-toggle="dropdown" >Google Reviews</button><div class="dropdown-menu"><a class="dropdown-item" href="#" id="googler">Google Reviews</a><a class="dropdown-item" href="#" id="yelper">Yelp Reviews </a></div></div> <div class="dropdown" style="display:inline-block;margin-bottom:20px"><button type="button" class="btn btn-secondary dropdown-toggle" id="forSort" data-toggle="dropdown" >Default Order</button><div class="dropdown-menu"><a class="dropdown-item" href="#" onclick="defaultR(this.text)">Default Order</a><a class="dropdown-item" href="#" onclick="HR(this.text)">Highest Rating</a><a class="dropdown-item" href="#" onclick="LR(this.text)">Lowest Rating</a><a class="dropdown-item" href="#" onclick="MR(this.text)">Most Recent</a><a class="dropdown-item" href="#" onclick="leastR(this.text)">Least Recent</a></div></div><div id="reviewCards"></div>';
	
	return drops;
}
function googleReviews(place,call){
	$('#reviewCards div').empty();
	$('.card').remove();
	$('#reviewCards .alert').remove();
	ccards = document.getElementById("reviewCards");
	//console.log(place);
	$("#forReviews").text(call);
	var whichSort = $("#forSort").text();
	if("reviews" in place){
		console.log(whichSort);
		
		if(whichSort=="Default Order")
		{
			for(var i=0;i<place.reviews.length;i++){
				var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = place.reviews[i].rating*15 +10;
				if("author_url" in place.reviews[i]){
				if("profile_photo_url" in place.reviews[i]){
					p1+= '<div style="display:inline"><a href="'+place.reviews[i].author_url+'" target="_blank"><img src="'+place.reviews[i].profile_photo_url+'" width="50px"></a></div>';
				}
					p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+place.reviews[i].author_url+'" target="_blank">'+place.reviews[i].author_name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(place.reviews[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
				}
				else{
					if("profile_photo_url" in place.reviews[i]){
					p1+= '<div style="display:inline"><img src="'+place.reviews[i].profile_photo_url+'" width="50px"></div>';
					}
					p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+place.reviews[i].author_name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(place.reviews[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
				}
				
				var end = '</div></div>';
				ccards.innerHTML+=start+p1+end;
								
				$("#"+i).rateYo({
				starWidth: "15px",
				rating: place.reviews[i].rating,
				normalFill: "transparent",
				readOnly: true
				});			
			}
		}
		else
			if(whichSort=="Highest Rating" || whichSort=="Lowest Rating"){
				rev = place.reviews.slice();
				rev.sort(compare);
				if(whichSort=="Highest Rating")
				{
					for(var i=rev.length-1;i>=0;i--){
				var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
						var p1="";
						var shift = rev[i].rating*15 +10;
						if("author_url" in place.reviews[i]){
						if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><a href="'+rev[i].author_url+'" target="_blank"><img src="'+rev[i].profile_photo_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].author_url+'" target="_blank">'+rev[i].author_name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><img src="'+rev[i].profile_photo_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].author_name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+rev[i].text+'</div>'
						}
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});			
					}
				}
				else{
					for(var i=0;i<rev.length;i++){
				var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
						var p1="";
						var shift = rev[i].rating*15 +10;
						if("author_url" in place.reviews[i]){
						if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><a href="'+rev[i].author_url+'" target="_blank"><img src="'+rev[i].profile_photo_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].author_url+'" target="_blank">'+rev[i].author_name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><img src="'+rev[i].profile_photo_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].author_name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+rev[i].text+'</div>'
						}
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});		
					}
				}
			}
			else
				if(whichSort=="Most Recent" || whichSort=="Least Recent"){
					rev = place.reviews.slice();
					rev.sort(compare1);
					
					if(whichSort=="Most Recent")
				{console.log("here");
					for(var i=rev.length-1;i>=0;i--){
				var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
						var p1="";
						var shift = rev[i].rating*15 +10;
						if("author_url" in place.reviews[i]){
						if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><a href="'+rev[i].author_url+'" target="_blank"><img src="'+rev[i].profile_photo_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].author_url+'" target="_blank">'+rev[i].author_name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><img src="'+rev[i].profile_photo_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].author_name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+rev[i].text+'</div>'
						}
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});		
					}
				}
				else{
					for(var i=0;i<place.reviews.length;i++){
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
						var p1="";
						var shift = rev[i].rating*15 +10;
						if("author_url" in place.reviews[i]){
						if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><a href="'+rev[i].author_url+'" target="_blank"><img src="'+rev[i].profile_photo_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].author_url+'" target="_blank">'+rev[i].author_name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("profile_photo_url" in place.reviews[i]){
							p1+= '<div style="display:inline"><img src="'+rev[i].profile_photo_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].author_name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+moment.unix(rev[i].time).format("YYYY-MM-DD H:mm:ss")+'</div>'+rev[i].text+'</div>'
						}
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});		
					}
				}
			}
		
		console.log(place.reviews[0].author_name)
	}
	else{
		document.getElementById("reviewCards").innerHTML='<div class="alert alert-warning" role="alert">No Records</div>';
	}
}

function compare(a,b){
	if (a.rating < b.rating)
    return -1;
  if (a.rating > b.rating)
    return 1;
  return 0;
}

function compare1(a,b){
	if (a.time < b.time)
    return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}

function compare2(a,b){
if (a.time_created < b.time_created)
    return -1;
  if (a.time_created > b.time_created)
    return 1;
  return 0;
}
function defaultR(a){
	$("#forSort").text(a);
	if($("#forReviews").text()== "Google Reviews")
		googleReviews(MegaPlace,"Google Reviews")
	else
		yelpReviews(superData,"Yelp Reviews");
}
function HR(a){
	$("#forSort").text(a);
	if($("#forReviews").text()== "Google Reviews")
		googleReviews(MegaPlace,"Google Reviews")
	else
		yelpReviews(superData,"Yelp Reviews");
}
function LR(a){
	$("#forSort").text(a);
	if($("#forReviews").text()== "Google Reviews")
		googleReviews(MegaPlace,"Google Reviews")
	else
		yelpReviews(superData,"Yelp Reviews");
}
function MR(a){
	$("#forSort").text(a);
	if($("#forReviews").text()== "Google Reviews")
		googleReviews(MegaPlace,"Google Reviews")
	else
		yelpReviews(superData,"Yelp Reviews");
}
function leastR(a){
	$("#forSort").text(a);
	if($("#forReviews").text()== "Google Reviews")
		googleReviews(MegaPlace,"Google Reviews")
	else
		yelpReviews(superData,"Yelp Reviews");
}
function yelpReviews(place,call){
	$('#reviewCards div').empty();
	$('.card').remove();
	//$('.alert').remove();
	ccards = document.getElementById("reviewCards");
	console.log("check yelp");
	$("#forReviews").text(call);
	var whichSort = $("#forSort").text();
	if(flagForYelpReviews==1 || superflagForYelpReviews==1){
		document.getElementById("reviewCards").innerHTML='<div class="alert alert-warning" role="alert">No Records</div>';
	}
	else{
		if("reviews" in place){
				if(whichSort=="Default Order")
				{
					for(var i=0;i<place.reviews.length;i++){
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = place.reviews[i].rating*15 +10;
						if("url" in place.reviews[i]){
						if("image_url" in place.reviews[i].user){//put p1+= '<div style="width:100px"> outside so that enev if no image you get that empty space
							if(place.reviews[i].user.image_url!=null)
							p1+= '<div style="display:inline"><a href="'+place.reviews[i].url+'" target="_blank"><img src="'+place.reviews[i].user.image_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+place.reviews[i].url+'" target="_blank">'+place.reviews[i].user.name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+place.reviews[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("image_url" in place.reviews[i].user || place.reviews[i].user.image_url!=null){
							p1+= '<div style="display:inline"><img src="'+place.reviews[i].user.image_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+place.reviews[i].user.name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+place.reviews[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: place.reviews[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});			
					}
				}
				else
					if(whichSort=="Highest Rating" || whichSort=="Lowest Rating"){
						rev = place.reviews.slice();
						rev.sort(compare);
						if(whichSort=="Highest Rating")
					{
						for(var i=rev.length-1;i>=0;i--)
						{
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = rev[i].rating*15 +10;
				
						if("url" in place.reviews[i]){
						if("image_url" in place.reviews[i].user){//put p1+= '<div style="width:100px"> outside so that enev if no image you get that empty space
							if(rev[i].user.image_url!=null)
							p1+= '<div style="display:inline"><a href="'+rev[i].url+'" target="_blank"><img src="'+rev[i].user.image_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].url+'" target="_blank">'+rev[i].user.name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("image_url" in place.reviews[i].user ){
								if(place.reviews[i].user.image_url!=null)
									p1+= '<div style="display:inline"><img src="'+rev[i].user.image_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].user.name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});			
					}
				}
				else{
					for(var i=0;i<rev.length;i++){
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = rev[i].rating*15 +10;
				
						if("url" in place.reviews[i]){
						if("image_url" in place.reviews[i].user){//put p1+= '<div style="width:100px"> outside so that enev if no image you get that empty space
							if(rev[i].user.image_url!=null)
							p1+= '<div style="display:inline"><a href="'+rev[i].url+'" target="_blank"><img src="'+rev[i].user.image_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].url+'" target="_blank">'+rev[i].user.name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("image_url" in place.reviews[i].user ){
								if(place.reviews[i].user.image_url!=null)
									p1+= '<div style="display:inline"><img src="'+rev[i].user.image_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].user.name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});					
					}
					}
				}
				else
					if(whichSort=="Most Recent" || whichSort=="Least Recent"){
					rev = place.reviews.slice();
					rev.sort(compare2);
					if(whichSort=="Most Recent")
					{
						for(var i=rev.length-1;i>=0;i--)
						{
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = rev[i].rating*15 +10;
				
						if("url" in place.reviews[i]){
						if("image_url" in place.reviews[i].user){//put p1+= '<div style="width:100px"> outside so that enev if no image you get that empty space
							if(rev[i].user.image_url!=null)
							p1+= '<div style="display:inline"><a href="'+rev[i].url+'" target="_blank"><img src="'+rev[i].user.image_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].url+'" target="_blank">'+rev[i].user.name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("image_url" in place.reviews[i].user ){
								if(place.reviews[i].user.image_url!=null)
									p1+= '<div style="display:inline"><img src="'+rev[i].user.image_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].user.name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});			
					}
				}
				else{
					for(var i=0;i<rev.length;i++){
						var start = '<div class="card" style="margin-bottom:10px;margin-left:-10px"><div class="card-body">'
				var p1="";
				var shift = rev[i].rating*15 +10;
				
						if("url" in place.reviews[i]){
						if("image_url" in place.reviews[i].user){//put p1+= '<div style="width:100px"> outside so that enev if no image you get that empty space
							if(rev[i].user.image_url!=null)
							p1+= '<div style="display:inline"><a href="'+rev[i].url+'" target="_blank"><img src="'+rev[i].user.image_url+'" width="50px"></a></div>';
						}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div><a href="'+rev[i].url+'" target="_blank">'+rev[i].user.name+'</a></div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						else{
							if("image_url" in place.reviews[i].user ){
								if(place.reviews[i].user.image_url!=null)
									p1+= '<div style="display:inline"><img src="'+rev[i].user.image_url+'" width="50px"></div>';
							}
							p1 += '<div style="display:block;margin-left:60px;margin-top:-50px"><div>'+rev[i].user.name+'</div><div style="padding:0;"id="'+i+'"></div><div style="display:block;margin-left:'+shift+'px;margin-top:-20px;color:grey">'+rev[i].time_created+'</div>'+place.reviews[i].text+'</div>'
						}
						
						var end = '</div></div>';
						ccards.innerHTML+=start+p1+end;
										
						$("#"+i).rateYo({
						rating: rev[i].rating,
						starWidth: "15px",
						normalFill: "transparent",
						readOnly: true
						});					
					}
					}
				}
		}
	}
}

function makeYelpCalls(place){
	console.log("yelp");
		var name = place.name;
		if(name.length>64)
			name = name.substring(0,65);
		console.log(name);
		var addr = place.formatted_address;
		addr = addr.substring(0,addr.indexOf(",")); 
		if(addr.length>64)
			addr = addr.substring(0,65);
		console.log(addr);
		var city="";
		var state="";
		var country="";
		for(var i=0;i<place.address_components.length;i++){
			if(place.address_components[i].types[0]=="locality")
				city=place.address_components[i].short_name;
			
			if(place.address_components[i].types[0]=="country")
				country=place.address_components[i].short_name;
			
			if(place.address_components[i].types[0]=="administrative_area_level_1")
				state=place.address_components[i].short_name;
			
		}
			$.ajax({
			type: 'GET',
			url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/yelpbm?name='+name+'&address='+addr+'&city='+city+'&state='+state+'&country='+country,						
			success: function(data12) {
				if(data12=="ERROR" || data12.businesses.length==0)
				{
					console.log("Eooro1")
					flagForYelpReviews=1;
					document.getElementById("yelper").onclick=function(){yelpReviews(superData,"Yelp Reviews");}
				}
			else{
				flagForYelpReviews=0;
					$.ajax({
					type: 'GET',
					url: 'http://auroex8-node.us-east-2.elasticbeanstalk.com/yelpbr?id='+data12.businesses[0].id,						
					success: function(data13) {
						//console.log(data13.reviews[0].text);
					if(data13.reviews.length==0)
					{
						superflagForYelpReviews=1;
						document.getElementById("yelper").onclick=function(){yelpReviews(superData,"Yelp Reviews");}
					}
					else{
						flagForYelpReviews=0;
						superflagForYelpReviews=0;
						superData = data13;
						document.getElementById("yelper").onclick=function(){yelpReviews(superData,"Yelp Reviews");}
					}
				 }
				});
			  }
			 }
		  });
}