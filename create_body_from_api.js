
function Main_table_Summary(){
    var api = 'https://script.google.com/macros/s/AKfycbyaQC_GED02pn8gBtXDAUVtEbAR1RF1X1zWsQ2bRakJ3MVu_zPzj7sRaCfHYl7HLIQe3w/exec';
    
      fetch(api) //only api works
      .then(res => res.json())
      .then(data => {
          d = data.content;
          CreateStuff(d);
       }
      );
}
function CreateStuff(d){
    
    let Row = '';
    let tableName = '';
    let divName = "";
    let sheetNo = 0; //to check for 1st sheet
    let sheetNames = []; //for nav creation at last
    sheetName = "";
    for (let i = 0; i < d.length; i++) {
        if(d[i][0].includes("#Sheet;")){ //appscript would merge all sheets but will put the sheetname with this prefix on top row

            sheetNo = sheetNo + 1;
            if(sheetNo==1){ //means first sheet/div/table

                sheetName, TypeSheet = get_SheetName_n_Type(d[i][0], sheetNames);

                //document.write(sheetName);
            }
            if(sheetNo>1){ //need to put the data to the table
                if(TypeSheet == "Table"){
                    Create_Div_n_Table(sheetName, Row);
                }
                if(TypeSheet == "Links"){
                    Create_Div_n_Links(sheetName, Row);
                }
                sheetName, TypeSheet = get_SheetName_n_Type(d[i][0], sheetNames);
                Row = "";
                console.log("2. Type :" + TypeSheet);
                console.log("2. # of sheet :" + sheetNo);
                //return;
            }
        }else{
            if(TypeSheet == "Table"){
                Row = Create_Table_Rows(d, i,Row);
            }
            if(TypeSheet == "Links"){
                Row = Create_Links(d, i, Row);
            }
        }
    }

    if(TypeSheet == "Table"){
        Create_Div_n_Table(sheetName, Row);
    }
    if(TypeSheet == "Links"){
        Create_Div_n_Links(sheetName, Row);
    }

    Create_Nav(sheetNames);
    
}

function get_SheetName_n_Type(sheetInfoRow, sheetNames){
    words = sheetInfoRow.split(";");
    sheetName = words[1];
    sheetName = sheetName.replace("Table_", "");
    sheetName = sheetName.replace("Links_", "");
    sheetName = sheetName.trim();

    console.log("1.sheet name = " + sheetName);
    //console.log("1. # of sheet :" + sheetNo);
    sheetNames.push(sheetName);
    if(sheetInfoRow.includes("#Sheet;Table_")){
        TypeSheet = "Table";
    }else{
        TypeSheet = "Links";
    }
    console.log("1. Type :" + TypeSheet);
    return sheetNames, TypeSheet;

}

function Create_Table_Rows(d, i, Row){
    let td = '';
    for (let x = 0; x < d[i].length; x++) {
        /*if (i == 0){
            words = d[i][x].split(";");
            hrf =   "<a href=" + words[1]  + ' target="_blank">' + words[0] + "</a>";
            td = td + '<th>' + hrf + '</th>';
        } else {*/
            if(d[i][x].indexOf(';')>=0){ // includes ';' means 2nd part in https link
                td = td + CreateButton(d[i][x]);
            }else{
                td = td + '<td>' + d[i][x] + '</td>';
                //console.log("Test " + d[i][x]);
            }
        //}
        
    }
    tr =  `<tr>${td}</tr>`;
    //console.log(tr);
    if(!tr.includes("#")){ // doesnot include '#'
        Row =  Row + tr;
        
    }else{
        //console.log("Removed : " + tr);
    }
    return Row;
}


function Create_Links(d, i, Row){  //expects only one col with ; as seperator between text and link.

    //<p><b><a class="HoverChange" href="default.asp" target="_blank">This link changes background-color</a></b></p>
    link_a = '<p><b><a class="LinkHoverChange" href="';
    link_b = '" target="_blank">';
    link_c = '</a></b></p>';
    
    if(d[i][0].indexOf(';')>=0){ // includes ';' means 2nd part in https link
        words = d[i][0].split(";");
        rw =  " " + link_a + words[1] + link_b + words[0] + link_c;
        
    }else{
        rw =  "<br>" + d[i][0];
    }
        
    console.log(rw);
    if(!rw.includes("#")){ // doesnot include '#'
        Row =  Row + rw;
        
    }else{
        //console.log("Removed rw: " + rw);
    }
    return Row;
}


function Create_Nav(sheetNames){

    console.log("in - Create_Nav");
    nav_li ="";
    var ulElement = document.getElementById("nav_Main_Ul"); 

    for (let i = 0; i<sheetNames.length; i++){
        sheetNm = sheetNames[i];
        // Create the <a> element
        var link = document.createElement('a');

        // Set the href attribute
        link.href = "#div_" + sheetNm;

        // Set the link text
        link.textContent = sheetNm ;
        link.setAttribute("data-click", "scroll-to-target");

        var liElement = document.createElement("li");
        //<li class="active">
        if(i==0){
            liElement.setAttribute("class","active"); //make the 1st nav menu as active
        }
        liElement.appendChild(link);
        ulElement.appendChild(liElement);
    }
    
}

function Create_Div_n_Links(sheetName, Row){
    console.log("in - Create_Div_n_Links");
    divName = 'div_' + sheetName;

    //tableName = 'tbl_' + sheetName;

    // Create a new div element
    var div = document.createElement('div');
    div.setAttribute('id', divName);
    div.setAttribute('class',"container");

     // Append the div to the document body or any other parent element
    document.body.appendChild(div);
    //console.log(divName);
    
    //table.setAttribute('id', tableName);
    //console.log();
    Row = "<br><br>'<h3 class><b>" + sheetName + "</b></h3>'" + Row; //br reqd to show it below nav / visibility
    document.getElementById(divName).innerHTML = Row;
    console.log(Row);
    console.log("wrote to div all links")
    return;
}

function Create_Div_n_Table(sheetName, Rows){
    console.log("in - Create_Div_n_Table");
    divName = 'div_' + sheetName;
    tableName = 'tbl_' + sheetName;

    // Create a new div element
    var div = document.createElement('div');
    div.setAttribute('id', divName);
    div.setAttribute('class',"container");

    // Create a new table element
    var table = document.createElement('table');

    // Append the table to the div
    var h3 = document.createElement('h3');
    h3.innerHTML='<br><br><b>' + sheetName + "</b>";  //br is reqd to show it below the nav

    div.appendChild(h3);
    //document.getElementById(divName).innerHTML = '<h3>Test</h3>';
    div.appendChild(table);

    // Append the div to the document body or any other parent element
    document.body.appendChild(div);
    console.log(divName);
    
    table.setAttribute('id', tableName);
    console.log(tableName);
    document.getElementById(tableName).innerHTML = Rows;
    return;
}

function CreateButton(cellVal){
    words = cellVal.split(";");
    button_val = words[0];
    link = words[1].trim();
    words = button_val.split("."); // remove the serial number and dot of the filename numbering  used for sort.
    //console.log("lenght of words = " + words.length)
    if(words.length>1){            // only if '.' is present, else use full
        button_val = words[1];
    }
    hrf = "<button id='btn_tS' onclick=" + '"window.open(' + "'" + link + "', '_blank');"  + '">' 
                                            +  button_val + '</button>';
    td = '<td>' + hrf + '</td>';
    console.log(td);
    return td;
}

function createNav(){
let navStr  = '<nav class="navbar navbar-inverse navbar-fixed-top">\
<div class="container-fluid">\
  <div class="navbar-header">\
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">\
      <span class="icon-bar"></span>\
      <span class="icon-bar"></span>\
      <span class="icon-bar"></span>\
    </button>\
    <a class="navbar-brand" href="https://webzagsolution.com/onescroll.html#">WebSiteName</a>\
  </div>\
  <div class="collapse navbar-collapse" id="myNavbar">\
  <ul class="nav navbar-nav">\
      <!--insert href="#about"-->\
      <li class="active"><a href="#home" data-click="scroll-to-target">Home</a></li>\
      <!--close insert-->\
      <!--<li class="dropdown">\
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">Page 1 <span class="caret"></span></a>\
        <ul class="dropdown-menu">\
          <li><a href="#">Page 1-1</a></li>\
          <li><a href="#">Page 1-2</a></li>\
          <li><a href="#">Page 1-3</a></li>\
        </ul>\
      </li>-->\
      <li><a href="#div2" data-click="scroll-to-target">services</a></li>\
      <li><a href="#footer" data-click="scroll-to-target">footer</a></li>\
    </ul>\
    <ul class="nav navbar-nav navbar-right">\
      <li><a href="https://webzagsolution.com/onescroll.html#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>\
      <li><a href="https://webzagsolution.com/onescroll.html#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>\
    </ul>\
  </div>\
</div>\
</nav>';

}


Main_table_Summary();
