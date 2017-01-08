
//todo if user move any other tab remmove page data set template false

var _j= jQuery.noConflict();
app.controller("cover", coverCtrl);
function coverCtrl($location,$scope,$log,http,$rootScope,filterFilter, $filter,$timeout,$window,  $mdToast,  $mdDialog,  $http)
{
   //set edit tool
   console.log("is edit :" + isEdit);
  if(isEdit=='true')
  {
      $scope.isEdit=true;
  }
  else
  {
    $scope.isEdit=false;
    console.log("no edit tool");
    sessionStorage.removeItem('isOffLoad');

    http.clearStorage();

  }

    $scope.isTipOpen=true;
    $scope.colorConfig = {};
  // page color
    $scope.colorConfig.backgroundOptions = {
        hasBackdrop: true,
        clickOutsideToClose: true,
        random: false,
        openOnInput: true,
        alphaChannel: false,
        history: false,
        mdColorMaterialPalette:false,
        mdColorRgb:false,
        defaultTab: 1,
    };

  $scope.colorConfig.showPreview = true;


//start app function;
  $scope.startApp= function()
  {
  var backupAdditionalCost;
  $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
  $scope.pagedataColor1={};
  $scope.data={};
  $scope.pageData={};
  $scope.magazineInfo={};
  $scope.dataContent={};
  $scope.magazinePageContent={};
  $scope.activeCategory={};
  $scope.OpenPage=[];
  $scope.space=[];
  $scope.highlight_features=[];
  $scope.openpageActive;
  $scope.coverfile={};
  $scope.fields={};
  $scope.stepOver={};
  $scope.discountCount=0;
  $scope.records={};
  $scope.pageListbackup={};
  $scope.coverPhoto={};
  $scope.personalstoryCount=0;
  $scope.discount=0;
  $scope.pagelayoutdata=[1,2];
  $scope.pagelayouts= $scope.pagelayoutdata[0];
  $scope.additionalCost={};
  $scope.menuactive=0;
  $scope.layoutsData=[1,2];
  $scope.isCostAdded=false;
  $scope.isLayoutBackup;
  $scope.ispageIdBackup;
  $scope.isPageLayoutChanged=true;
  $scope.isAdsLayout=false;

  var pageIdBackup;
  var appUrl=$rootScope.appUrl;


$scope.updateUserStep =function()
{
$timeout(function(){

  http.storage("magazine_data","pageList", $scope.pageList);
  http.storage("magazine_data","navList", $scope.navList);
  http.storage("magazine_data","pageListBackup", $scope.pageListbackup);

var key={};
var storage={};
var data=["API_DATA","isOffLoad"];
//alert("session length"+sessionStorage.length)
Object.keys(sessionStorage).filter(function(value)
{

if(sessionStorage[value])
{
if(data.indexOf(value)==-1)
{
    if(sessionStorage[value])
    {
      //open comment
      storage[value]=JSON.parse(sessionStorage[value]);
    }
}
}
});

var user=userInfo;
    user["lastInsertedId"]=sessionStorage["lastInsertedId"];
    key["userInfo"]=user;

if(storage)
{
  key["data"]=storage;
}


http.get_data(sendUserData,key,function(response)
{
  if(response.status==true)
  {
     $log.info("data send ");
  }
});
},100)
}

$scope.checkFile= function(data,data1)
{
  var flag=false;
  if(data)
  {
      if(Object.keys(data).length==0)    {    flag=false;  }
      else {      flag=true;   }
  }
else if(data1){
  if(Object.keys(data1).length==0) {   flag=false; }
  else {   flag=true; }
}
  if(flag==true){  return false; }
  else {  return true; }
}


$scope.defaultPage=function(data){
    if(data){

        angular.forEach($scope.pageList, function(value,key){
        value.pageActive=false;
        });

      angular.forEach(data, function(value,key)
      {
        if(value<$scope.pageList.length)
        {
        $scope.pageList[value].pageActive=true;
        }
        });
}
}

$scope.changeLayout=function(layout)
{
  var arr=[];
  for(var i=0; i<($scope.pageList.length-1);i++){
    if($scope.pageList[i].isSuccess==false){
      arr.push(i);
    }
  }

  if($scope.isPageLayoutChanged==true)
  {
    $scope.pagelayouts=layout;
    $scope.setPageActive(layout, $scope.OpenPage[0]);

    if( $scope.activePageId)
      {
      $scope.ispageIdBackup=$scope.activePageId
      $scope.activePageId=undefined;
      }
  }
  else
  {
    if(arr.length<2)
    {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .htmlContent("Page layout not allowed you don't have empty page")
          .ariaLabel('Alert page layout')
          .ok('Ok')

      );

        $scope.selectbox=false;
        $timeout(function()
        {
           $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
           $scope.pagelayouts=1;
           $scope.layoutDisabled=false;
      },1)

    }
  }

}

$scope.changeTemplate= function(type){
  $scope.templateLoading=true;
    var type="image-text";
    //set static variables
    angular.forEach($rootScope.template, function(value){
      if(value.type==type)
      {
        $scope.formTemplate=value.template;
        $scope.noTemplate=true;
      }
    });

    $timeout(function(){
    $scope.templateLoading=false;
  },800);
  }

  //page count and copies
  $scope.isCopiesError=false;
  $scope.createPages= function(pages,scroll)
  {
      var lastpage;
  var backup=http.storageParse('magazine_data');
  if(backup)
  {
  if(backup.hasOwnProperty('pageListBackup'))
  {
    $scope.pageListbackup=backup['pageListBackup'];
    lastpage=$scope.pageList[$scope.pageList.length-1];

  }
}
  page=pages;

  $scope.pageData.defaultPage=pages;
  $scope.pageList=http.pageList(page);

if(Object.keys($scope.pageListbackup).length>0)
{
    $scope.stepOver["pageContent"]=false;
    for(var i=0; i<$scope.pageList.length;i++)
    {
        if(i<=$scope.pageListbackup.length-2)
        {
          if($scope.pageListbackup[i].isSuccess===true)
            {
                $scope.pageList[i]=$scope.pageListbackup[i];
            }
        }
    }
  $scope.pageList[ $scope.pageList.length-1]=$scope.pageListbackup[$scope.pageListbackup.length-1];
  lastpage.info['page']=[$scope.pageList.length-1];
  $scope.pageList[ $scope.pageList.length-1]=lastpage;

  http.storage("magazine_data","navList", $scope.navList);

  console.log("backup:"+ $scope.pageListbackup.length);
  console.log("page:"+ $scope.pageList.length);

  }
if(!scroll)
{
  $timeout(function(){  _j('body,html').animate({scrollTop:0},500);},200)
}

}

$scope.changeCopies =function(){
  //process to change ads discount;
  if( $scope.additionalCost["discount"])
    {
    angular.forEach($scope.additionalCost["discount"], function(value){
      var discount=$filter('filter')($scope.spaceDiscount,{id:value.mainId});
      value.discount=http.getDiscount(discount[0].data, $scope.pageData.copies);
    });
  }

}
//load data form session
$scope.loadStep2Data=function(){
if(http.storageParse('magazine_data')) //check session
{
    var step2=http.storageParse('magazine_data');
    var tabs=step2["stepTab"];
    step2=step2["step2"];
    if(step2)
    {
    $scope.pageData=step2;
    $scope.createPages(step2.defaultPage);
    $scope.selectedTab=tabs;
    }
}
}
$scope.loadStep2Data();

$scope.updateInfo=function(item,scroll)
  {

    if(Object.keys(item).length >0) //check key value exist or not
    {
      $scope.pageCount=item.pages.pageCountGroup;
      $scope.pageData={'defaultPage':$scope.pageCount[0]};
      $scope.pageData.copies=item.pages.copies[0];
      $scope.createPages($scope.pageCount[0],scroll);
      $scope.copies=item.pages.copies;
     }

     $scope.loadStep2Data();
  }

    $scope.setItemDefault= function(item){
      $scope.selectedCover=item;
      $scope.updateInfo(item);
    }


//call api data
var template=$rootScope.appUrl+'template/popup-message.html';

$scope.set_data=function(data)
{
  var response=data;
  $scope.category_list=response.records;
  $scope.data["cover"]=$scope.category_list[0];
  $scope.colorImage=response.colorImages;
  $scope.navList=response.pageCategory;
  $scope.messageStyle=response.messageImage[1].shapeStyle;
  $scope.messageImage=response.messageImage[0].messsage;
  $scope.setItemDefault($scope.category_list[0]);
  $scope.featureHeadingImage=response.featureHeadingImage;
  $scope.pageLayoutImage=response.pageImage;
  $rootScope.modal=response.popupContent;
  $scope.contentMessage=response.step4Content;
  $rootScope.step4ContentInfo=response.step4ContentInfo;


//open modal

var modal=http.storageParse("modal");

$timeout(function()
{
  if(!modal)
  {
  $mdDialog.show({
      controller: DialogController,
      templateUrl: template,
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: false
     });
}

},500)
}

if(http.storageParse('API_DATA'))
{
    $scope.set_data(http.storageParse('API_DATA'));
}
else
{
http.get_data(category_url,"",function(response)
      {
      $scope.set_data(response);
      //store data on session
     http.sessionStorage("API_DATA",response);

  });
}





//get discount data
http.get_data(getDiscountData,"",function(response)
      {
       //store data on session
      $scope.spaceDiscount=response;//.addSpaceDiscount;
  ;

  });

  //cover filter change
$scope.filterChange=function(item)
{
  if(item)
  {
  $scope.selectedCover=item;
  $scope.updateInfo(item);
  }
}


$scope.changeCover=function(item){
  if(item)
  {

  $scope.selectedCover=item;
  $scope.updateInfo(item,'isScroll');
  }
}
//load cover data form session if data exist on local machine


if(http.storageParse('magazine_data')) //check session
{
  $timeout(function(){
    var step1=http.storageParse('magazine_data');
    if(step1)
    {

      step1=step1.step1;
      $scope.data=step1[0];
      $scope.selectedCover=step1[1];
      $scope.coverfile=step1[2];
    }

    if(http.storageParse("price"))
    {
        $scope.additionalCost=http.storageParse("price");
    }
    else {
      $scope.additionalCost={};
    }

  },200);
}

$scope.userMagazineId=sessionStorage["lastInsertedId"];

$scope.submitForm=function(data,form,coverphoto)
//submit cover form
{


    if(form.$valid) //if form is valid
    {
      $scope.isLoading=true;
      var temp;
      temp=data;
      temp["coverphoto"]=data.coverphoto;

      //set data on local
      $scope.selectedCover=data["cover"];
      $scope.isSave=true;
      $scope.data=data;

      $timeout(function()
      {

      $scope.selectedTab=1;
      $timeout(function(){  _j('body,html').animate({scrollTop:0},500);},200)
      $scope.isLoading=false;
      //store data on session
      var cover=data;
      delete cover["coverphoto"];
      var $data=[];
      var $info={};
     // $info.push();
    var categorydata={};
    categorydata=$scope.selectedCover;
    categorydata["id"]=$scope.selectedCover.id;
    categorydata["mainHeading"]=data.mainHeading;
    categorydata["subHeading"]=data.subHeading;
    $info["userInfo"]=userInfo;
    $info["categoriesData"]=categorydata;

      if($scope.coverfile)
      {
          if(Object.keys($scope.coverfile).length>0)
          {
          $info["coverFiles"]=$scope.coverfile;

          }
      }
      var caption=[];
      angular.forEach($scope.coverphotoData, function(value){
        var key={};

        if(value.hasOwnProperty('caption'))
        {
          key["caption"]=value.caption
    }
        if(value.hasOwnProperty('name'))
        {
          key["name"]=value.name
        }
        if(value.hasOwnProperty('id'))
        {
          key["id"]=value.id
        }


        if(angular.equals({},key)==false)
        {
            caption.push(key);
        }
        $data.push(value.value);
      });
      if(caption.length>0)
      {
      $info["caption"]=caption;
      }


      http.upload_file(uploadFile, $data,$info,function(response){
          var $array=[];
          $array.push(cover);
          $array.push($scope.selectedCover);
          $array.push(response.files);
          //store data on local session

          http.storage("magazine_data","step1", $array);

          $scope.stepOver["cover"]="success";
          http.storage("magazine_data","stepOver", $scope.stepOver);
          //must be update on live
          $scope.userMagazineId=response.lastInsertedId;
          sessionStorage["lastInsertedId"]=$scope.userMagazineId;
        $scope.updateUserStep();
        });
      },50)
  //  }
  }
}


//step-2 submit page count and their data
$scope.submitPageCount= function(data,form){

  if(form.$valid)
  {
    $scope.isLoading=true;
    $timeout(function(){
    $scope.selectedTab=2;
    $scope.isLoading=false;
    $timeout(function(){  _j('body,html').animate({scrollTop:0},500);},200);
    http.storage("magazine_data","step2", data)
    http.storage("magazine_data","stepTab", $scope.selectedTab);
    $scope.stepOver["pageCount"]="success";
    http.storage("magazine_data","stepOver", $scope.stepOver);

    },500)

  }
  else
  {
    $scope.isCopiesError=true;
  }
}


//load data form session
if(http.storageParse('magazine_data')) //check session
{
  $timeout(function(){

    var step3=http.storageParse('magazine_data');
    var tabs=step3["stepTab"];
    var stepover=step3["stepOver"];
    var page=step3["contentPage"];
    step3=step3["step3"];

    if(stepover)
    {
      $scope.stepOver=stepover;
      if($scope.stepOver.cover)
      {
        $scope.isSave=true;
      }

      if($scope.stepOver.pageContent)
      {
        $scope.pageContentStep=true;
      }


    }

    if(step3)
    {
    $scope.pagedataColor1=step3;
    $scope.selectedTab=tabs;
    $scope.selectedPage=page;
    }

  },200)

}

$scope.submitPageColor=function(data, form){

  var message;
  if(form.$valid)
  {
      //  $scope.pagedataColor1=http.storageParse("colors");
      $scope.selectedTab=3;
      $scope.selectedPage=0;
      $timeout(function(){  _j('body,html').animate({scrollTop:0},500);},200)
      http.storage("magazine_data","step3", data)
      http.storage("magazine_data","stepTab", $scope.selectedTab);
      http.storage("magazine_data","contentPage", $scope.selectedPage);
      $scope.stepOver["pageColor"]="success";
      http.storage("magazine_data","stepOver", $scope.stepOver);
  }
  else {
      if(!data)
      {
          message="Choose theme colors for your magazine";
      }
      else{
      if(!data.maincolor)
      {
          message="Choose your main color";
      }
     else if(!data.secondary)
      {
          message="Choose your secondary color";
      }
    else if(!data.accent)
      {
          message="Choose your accent color";
      }
    }
      http.alert(message,"error-toast");
  }
}

$scope.send_data_server=function(){
  //send data on server
    var $data={};
    $data["categoryId"]=$scope.selectedCover.id;
    $data["magazinetitle"]=$scope.selectedCover.title;
    $data["pageCount"]=$scope.pageData;
    $data["colorTheme"]=$scope.pagedataColor1;
    $data["user"]=userInfo;
    $data["lastInsertedId"]=$scope.userMagazineId;

  http.get_data(upload_data_url, $data, function(response)
  {
      if(response.status==true)
      {
        $log.info("Data has been successfully uploaded");
      }
      else
      {
      $log.info(response);
      }

 });
}

//move to content page
$scope.openPage=function(page)
{

  $scope.formTemplate=false;

$scope.noTemplate=false;
var length=0;
angular.forEach($scope.pageList, function(value, key){
    if(value.isSuccess==true)
    {
          length=length+1;
          console.log(length)
    }

});

if(length==$scope.pageList.length){
  $scope.pageContentStep=true;
}
else {
        $scope.pageContentStep=false;
}
var modal=http.storageParse("modalContent");
if(!modal)
{
  if($rootScope.step4ContentInfo)
  {
  //open popup
  $mdDialog.show({
      controller: contentPoup,
      templateUrl: template,
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: false
     });
}
}

  var added=[];

  angular.forEach($scope.pageList, function(value,index)
  {
          if(value.isSuccess==true)
        {
          added.push(value);
        }
  })

  $scope.selectedPage=page;
  if(added.length==0)
  {
  $scope.magazineInfo["pageActive"]=$scope.OpenPage;
  $scope.OpenPage=[0]; //set the page 1 active
  $scope.pageList[0].pageActive=true;
  $scope.isPageActive=0;
  $scope.menuActive=0;
  http.storage("magazine_data","contentPage", $scope.selectedPage);
  http.storage("magazine_data","OpenPage",   $scope.OpenPage);
  http.storage("magazine_data","pageList", $scope.pageList);
}
  $scope.send_data_server();
  $scope.updateUserStep();
}


if(http.storageParse('magazine_data')) //check session
{

  $timeout(function()
    {
        var data=http.storageParse('magazine_data');
        var hightlights_step1=data["hightlights_form_step1"];
        var hightlights_step2=data["hightlights_form_step2"];
        var pageList=data["pageList"];
        var pageListBackup=data["pageListBackup"];
        var navList=data["navList"];
        var openPage=data["OpenPage"];
        var layouts=data["layouts"];
        var stepOver=data["stepOver"];

        if(stepOver){
          $scope.stepOver=stepOver;
        }
        var cost=http.storageParse('addCost');

        if(hightlights_step1)
        {
          $scope.hightlights_step_1_data=hightlights_step1;
        }
        if(hightlights_step2)
        {
          $scope.highlight_data=hightlights_step2;

        }
          if(cost)
          {
            $scope.personalCoverStory=cost.cost;
            $scope.personalstoryCount=cost.count;
          }
          $scope.highlight_features=http.storageParse('hightlightFeatures');

        if(pageList)
        {
          $scope.pageList=pageList;
        }
        if(pageListBackup)
        {
          $scope.pageListbackup=pageListBackup;
        }

        if(openPage)
        {
            $scope.OpenPage=openPage;
            $scope.isPageActive=$scope.OpenPage[0];
          }

        if(navList)
        {
           $scope.navList=navList;
        }
  },500);
}


$scope.setPageActive=function(layout,index)
{


  if($scope.pageList.length-1==index)
  {
    $scope.backPage=true;
  }
  else
  {
      $scope.backPage=false;
  }

  angular.forEach($scope.pageList, function(value,key)
  {
    value.pageActive=false;
  });

    if(layout==2)
    {
      var arr=[];
      angular.forEach($scope.pageList, function(value,key)
      {
        if(value.isSuccess==true){
          arr.push(value);
        }
      });


      if(arr.length<$scope.pageList.length-2)
      {
      var pageLeft,pageRight;
      if($scope.pageList[index-1]){
            pageLeft =$scope.pageList[index-1].isSuccess;
      }
      if($scope.pageList[index+1])
      {
          pageRight=$scope.pageList[index+1].isSuccess;
      }
      if(pageLeft==false)
      {
          $scope.OpenPage=[index-1,index];
      }
      if(pageRight==false)
      {
        $scope.OpenPage=[index,index+1];
      }
      if(pageLeft==true &&  pageRight==true)
      {
        $scope.pageList[index].pageActive=true;
        $scope.OpenPage=[index];
        $scope.isPageActive=index;
        $scope.menuActive=$scope.isPageActive;
        // $scope.selectbox=false;
        // $scope.pagelayouts=1;
          $timeout(function(){
            //   $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
          },5)
          http.alert("Page layout not allowed" ,'error-toast');
      }
      else
      {
        angular.forEach($scope.OpenPage, function(value){
        $scope.pageList[value].pageActive=true;
      });
        $scope.isPageActive=$scope.OpenPage[0];
        $scope.pageList[$scope.isPageActive].pageActive=true;
        $scope.menuActive=$scope.isPageActive;
      // alert("ok");
      }
    }
    else
    {
      //http.alert("Not allowed, You don't have empty pages.",'error-toast');
      var newindex=index;
      var page=$scope.pageList[newindex];
      if(page)
      {
        $scope.pageList[newindex].pageActive=true;
        $scope.isPageActive=newindex;
        $scope.OpenPage=[newindex];
        $scope.menuActive=newindex;
        $scope.layoutDisabled=false;

          $scope.selectbox=false;
            $scope.pagelayouts=1;
            $timeout(function(){
              $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
          },5)

      }


    }
    $scope.layoutDisabled=false;
    }
    else //if layouts==1
    {
      $scope.pageList[index].pageActive=true;
      $scope.isPageActive=index;
      $scope.OpenPage=[index];
      $scope.menuActive=index;
      $scope.layoutDisabled=false;
    }
    $scope.magazineInfo["pageActive"]=$scope.OpenPage;
    http.storage("magazine_data","OpenPage", $scope.OpenPage);
}

$scope.checkValidation=function()
{

var flag=true;
if($scope.records){
if(Object.keys($scope.records).length>0)
{
  angular.forEach($scope.records, function(value){
    if(value[0].value)
    {
        flag=false;
    }

  });
}
}

  if(flag==false)
  {

      if($scope.isDelete==true)
      {
          flag=true;
           return true;
      }
      else
      {
            return false;
      }
      return false;

  }
  if(flag==true)
  {
      return true;
  }


}

$scope.onPageChange=function(index,success, active,ispace,ev)
{
  var index=index;
  var success=success;
  var active=active;
  var ispace=ispace;
/*
//check page
var flag=0;
angular.forEach($scope.pageList, function(value,key){
  if(value.isSuccess==true &&  value.hasOwnProperty('isValid')==false){
    flag=1;
  }
})

*/
flag=0;
  if(flag==0)
  {
  $scope.isCostAdded=false;
  $scope.menuactive=0;

if($scope.checkValidation()==true)
  {
      $scope.pageSelected(index,success, active,ispace);
  }
    else
     {
      var confirm = $mdDialog.confirm()
              .title('Confirm')
              .textContent('Making this selection may result in loss of information. Do you want to process?')
              .ariaLabel('confirm')
              .ok('Yes')
              .clickOutsideToClose(true)
              .cancel('No');
              $mdDialog.show(confirm).then(function()
              {
                $scope.pageSelected(index,success, active,ispace);
          }, function() {
        });

    }
}
else {
  http.alert("You need to complete last page before move next new page","error-toast");
}

  }
$scope.pageSelected=function(index,success, active,ispace)
{

$scope.isPageActive=index;
$scope.menuActive=index;
var nodata=false;

if($scope.pageList.length-1==index)
{
  $scope.backPage=true;

}
else{
    $scope.backPage=false;
}

angular.forEach($scope.pageList, function(value,key)
{
  value.pageActive=false;
});

if($scope.pageList.length === (index+1))
{
  $scope.pagelayouts=1;
}

  var layout=$scope.pagelayouts;
  var page,pagedata,data, keyIndex,count=0,pageId,pageData;

if(success==true) //if data exit on local
    {
      var info=$scope.pageList[index].info;


        $scope.OpenPage=info.page;
        $scope.pagelayouts=info.layout;
        $scope.layoutDisabled=true;
        $scope.defaultPage(info.page);
        console.log($scope.pageList[index]);
        $scope.isLayoutBackup=undefined;
        //check page layout allowed or not
      var allowed=0;
      var pageLeft=$scope.pageList[index-1];
      var pageRight=$scope.pageList[index+1];
      var currentPage=$scope.pageList[index];

      var isFullAdd=http.validateAdsFullPage(currentPage.isSpaceList);
      if(isFullAdd==false){

      if(pageLeft)
      {
            if((pageLeft.isCategory==currentPage.isCategory ))
            {
            //  alert("ok Left")
              allowed=1;
            }
              if((pageLeft.id==false))
            {
              allowed=1;
            }
      }
  if(pageRight)
  {
  if((pageRight.isCategory===currentPage.isCategory) )
  {
  allowed=1;
  }
    if((pageRight.id==false))
    {
      allowed=1;
    }
      }
      }
      if(allowed==0)
      {
        $scope.isPageLayoutChanged=undefined;
        $scope.layoutDisabled=true;

      }
      if(allowed==1)
      {
         $scope.isPageLayoutChanged=true;
         $scope.layoutDisabled=false;
      }
        if(ispace)

        {
        var spaceList=$scope.pageList[index].isSpace;

        pageId=http.getPageId($scope.isPageActive, info.layout,ispace);
        if($scope.backPage==true){
          pageId='backPage';
        }

        }
        else
        {

          pageId=http.getPageId($scope.OpenPage, $scope.pagelayouts);
          if($scope.backPage==true){
            pageId='backPage';
          }

        }

        console.log(pageId);
        console.log($scope.magazinePageContent);

        var pageData=$scope.magazinePageContent[pageId];
          console.log(pageData);
      if(pageData)
        {
          $timeout(function(){ _j('body,html').animate({scrollTop:540},300);},200);

          delete $scope.magazineInfo['selectedCategory'];
          $scope.records={};
          $scope.noTemplate=false;
          $scope.allowedAddedd=true;

        //  $scope.OpenPage=pageData.page;
          $scope.activePageId=pageData.pageId;

          if(pageData.page.length==1)
          {
          $scope.pagelayouts=1;
          }
          if(pageData.page.length==2)
          {
          $scope.pagelayouts=2;
          }

          data=pageData.content;
          type=pageData.category[1].type;
          //layoutImage
        $scope.pagelayout1Image=pageData['layoutImage'].layout1;
        $scope.pagelayout2Image=pageData['layoutImage'].layout2;
        $scope.pagelayout3Image=pageData['layoutImage'].layout3;


        $scope.isAdsLayout=false;
        $scope.layoutDisabled=false;
          if(pageData["addSpces"])
          {
              $scope.layoutDisabled=true;
            $scope.isAdsLayout=true;
            $scope.space=pageData.content;
            $scope.addSpces=pageData["addSpces"];
            $scope.isCategoryValue=false;

          }
          else
          {
            $scope.space=false;
            $scope.addSpces=false;
            $scope.isCategoryValue=true;
          }

          $scope.magazineInfo['selectedCategory']=pageData.category;
          $scope.changeTemplate(type);

            // angular.forEach($scope.pageLayoutImage, function(data){
            //   console.log(data);
            //       if(data.id==value.category[2].value.id)
            //       {
            //         $scope.pagelayout1Image=data.layout1;
            //         $scope.pagelayout2Image=data.layout2;
            //         $scope.pagelayout3Image=data.layout3;
            //         flag=true;
            //       }
            //       else {
            //         $scope.pagelayout1Image=false;
            //         $scope.pagelayout2Image=false;
            //         $scope.pagelayout3Image=false;
            //       }
            // })
          $scope.records={};
          $scope.records=data;
          $scope.isDelete=true;
          //move to content page
        $scope.selectedTab=3;
        }
        else
        {
            //process no data
              $scope.isDelete=false;
              $scope.pageList[$scope.OpenPage[0]].pageActive=true;

              if($scope.OpenPage.length>1)
              {
                $scope.pageList[$scope.OpenPage[1]].pageActive=true;
              }
              delete $scope.magazineInfo['selectedCategory'];
              $scope.records={};
              $scope.noTemplate=false;

            }
    }
if(success==false)
    {

    $scope.additionalCost=http.storageParse("price");
    $timeout(function(){  _j('body,html').animate({scrollTop:540},300);},200);
      $scope.OpenPage=[];
      $scope.allowedAddedd=false;
      $scope.pagelayout1Image=false;
      $scope.pagelayout2Image=false;
      $scope.pagelayout3Image=false;
      $scope.isAdsLayout=false;
      $scope.layoutDisabled=false;
      $scope.isDelete=false;
      $scope.pagelayouts=1;
      $scope.setPageActive(1, index);
      delete $scope.magazineInfo['selectedCategory'];
      $scope.records={};
      $scope.noTemplate=false;
      $scope.isPageLayoutChanged=true;
      $scope.ispageIdBackup=undefined;
       $scope.layoutDisabled=false;
      $scope.selectbox=false;

      $timeout(function()
      {
         $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
      },200)
    }
}

$scope.collapseAll = function(data)
{
  angular.forEach($scope.navList[0].subCategory, function(value)
  {
    if(value!=data){
        value.expanded=false;
    }
  })
    data.expanded = !data.expanded;
  };

$scope.getLayoutImage=function(catgId,id){
  var flag=false;
  $scope.noCategoryImages=false;

  var data={"categoryId":id,"magazineId":catgId };
  $scope.pageLoading=true;
  http.get_data(layoutImage, data, function(response)
  {

    $scope.pagelayout1Image=response.layout1;
    $scope.pagelayout2Image=response.layout2;
    $scope.pagelayout3Image=response.layout3;


     $scope.pageLoading=false;
     flag=true;

     if(response.ack="fail")
     {
       $scope.noCategoryImages=true;
     }

  });
  if(flag==false)
  {
    $scope.pagelayout1Image=false;
    $scope.pagelayout2Image=false;
    $scope.pagelayout3Image=false;
  }
}

//select category for current pager
$scope.updateNavalist=function(type,id,x,x1,x2,added)
{
    $scope.additionalCost=http.storageParse("price");
  var flag=false;
  var typeObj=type;
  var id=type.id;
  var type=type.type;
  if(type)
  {
  var data=[];
  var id=id;
  if(type)
  {
    data.push({"key":[x,x1,x2]},{"type":type});
  }
  else
  {
      data.push({"key":[x,x1,x2]});
  }
  angular.forEach(data[0].key, function(value,index) //remove null value from array
  {
  if(!value)
  {
      data[0].key.splice(index);
  }
  });

var keys=data;
data.push({"value":typeObj});
//process to check data exits on selected pageList
  var page=$scope.pageList[$scope.isPageActive];
  var result=false;
  var $alert;
  var selectedpage=setSpaceClassName(data);

  if(page.isSuccess===true)
  {
  angular.forEach(page.isSpaceList, function(value){
    if(value.indexOf('full')>=0)
    {
    hasKey=true;
    result=true;
    $alert='Selection is not allowed on this page, Make a different page?Â ';
    }
  });

    var selectedpage=setSpaceClassName(data);
    var ads2=0,ads4=0;
    angular.forEach(page.isSpaceList, function(value)
    {
    if(value.indexOf('one-2')>=0)
      {

        ads2=ads2+1;
      }
      if(value.indexOf('one-4')>=0)
      {

        ads4=ads4+1;
      }
    });

    if(ads4>0)
    {
  if(page.isCategory){
    if((ads2+ads4)>=3)
    {

     hasKey=true;
     result=true;
     $alert='Selection is not allowed on this page, Make a different page?Â ';
    }
    }
    else {
      if((ads2+ads4)>=4)
      {

       hasKey=true;
       result=true;
       $alert='Selection is not allowed on this page, Make a different page?Â ';

      }
    }
    }
      if(page.isCategory || page.isSpace)
      {
      if(selectedpage.indexOf('full')>=0)
      {
      hasKey=true;
      result=true;
      $alert='Selection is not allowed on this page, Make a different page?Â ';
      }
      }

  if(page.isSpace)
  {
    var node=data[0].key[data[0].key.length-1];
    var key=page.isSpaceList.indexOf(selectedpage);
    if(result==false)
    {
      if(key==-1)
      {
        //check condition allowed added or not
        var nodeKey=node.split(' ');
        var hasKey=false;
        var pagetype=selectedpage.indexOf('one-2');  //current page selected
        var vertical=0, horizontal=0;

        //calculate space
        var length=page.isSpaceList.length;
        var adsData=[],vertical=0,horizontal=0,half=0, oneFour=0;

        angular.forEach(page.isSpaceList, function(value)
        {
            adsData.push(value);
            if(value.indexOf('one-2')>=0)
            {
              half++;
            }
            if(value.indexOf('one-4')>=0)
            {
              oneFour++;
            }
            if(value.indexOf('vertical')>=0)
            {
              vertical++;
            }
            if(value.indexOf('horizontal')>=0)
            {
              horizontal++;
            }
        });
        //not allowed horizontal if vertical is exist
        if(vertical>=2)
        {
             hasKey=true;
        }
        if(vertical>0)
        {
          if(selectedpage.indexOf('horizontal')>=0){
             hasKey=true;
          }
        }
        if(horizontal>=2)
        {
             hasKey=true;
        }
        if(horizontal>0)
        {
          if(selectedpage.indexOf('vertical')>=0){
             hasKey=true;

          }
        }
      if(selectedpage.indexOf('one-4')>=0 || selectedpage.indexOf('one-2')>=0)
      {
        var node=selectedpage.split(' ');
        //remove blank node;
        node = node.filter(function( element ) {
        if(element!="" || element==null)
        {
        return element;
        }
        });
        var count=0;
        angular.forEach(adsData, function(value,key){
            var data=value.split(' ');
            data = data.filter(function( element ) {
            if(element!="" || element==null)
            {
            return element;
            }
            });
          var ele=[data[data.length-1],data[data.length-2]];
          if(selectedpage.indexOf('one-2')>=0 && value.indexOf('one-2')>=0)
          {
            if(page.isCategory)
            {
              if(page.isSpaceList.length>=1){
               hasKey=true;
               }
            }
          }
          if(selectedpage.indexOf('one-2')>=0 && value.indexOf('one-4')>=0)
          {
            if(page.isCategory)
            {
              if(page.isSpaceList.length>=2){
               hasKey=true;
               }
            }
              angular.forEach(ele, function(index){
                    angular.forEach(node,function(key){
                      if(index.indexOf(key)>=0)
                      {
                         hasKey=true;
                      }
                    })
              })
          }
          if(selectedpage.indexOf('one-4')>=0 && value.indexOf('one-2')>=0)
          {
            if(page.isCategory){
              if(page.isSpaceList.length>=2){
               hasKey=true;
               }
            }
              angular.forEach(ele, function(index)
              {
                    angular.forEach(node,function(key){
                      if(index.indexOf(key)>=0)
                      {
                         hasKey=true;
                      }
                    })
              })
        }
        });
      }
      }
      if(key>=0 || hasKey==true)
      {
          result=true;
          $alert='Selection is not allowed on this page, Make a different Content Categories form left side?Â ';
      }
      else {  result=false;   }
      }
  }
}// if page is true contain ads or data
//}

if(result==true)
{
    //$scope.formTemplate=false;
    var confirm = $mdDialog.alert()
    .title('Make a different Content Categories')
    .textContent($alert)
    .ariaLabel('alert')
    .ok('OK')
    .clickOutsideToClose(false)
    $mdDialog.show(confirm);
    $timeout(function()
    {
    $scope.menuactive=0;
    },100)
  }

  if(result==false)
  {
    //get layout image for server
    $scope.getLayoutImage($scope.selectedCover.id,typeObj.id);
    if(http.storageParse("price"))
    {
        $scope.additionalCost=http.storageParse("price");
    }
    else
    {
      $scope.additionalCost={};
    }

    $scope.activePageId=false;
    if($scope.isCostAdded==false)
    {

        if(typeObj.cost)
        {
          $scope.isTempPrice={"id":typeObj.id,"title":"addition","data":{"id":typeObj.id, "title":keys[0].key,"addition":typeObj.cost}};
          $scope.additionalCost=http.addPrice($scope.isTempPrice.data, 'addition', $scope.additionalCost);
        }
        else if(typeObj.discount)
        {
          var discount=$filter('filter')($scope.spaceDiscount,{id:typeObj.discount});
          var discountAmount=http.getDiscount(discount[0].data, $scope.pageData.copies);
          $scope.isTempPrice={"id":typeObj.id,"title":"discount",
          "data":{"id":typeObj.id, "title":keys[0].key,"discount":discountAmount,"mainId":typeObj.discount}
        }
          $scope.additionalCost=http.addPrice($scope.isTempPrice.data, 'discount', $scope.additionalCost);
        }
        else
        {
            $scope.isTempPrice=false;
        }
    }
    $scope.space=[];
    $scope.isAdsLayout=false;
    $scope.layoutDisabled=false;
    if(type=="space")
    {

      $scope.layoutDisabled=true;
      $scope.isAdsLayout=true;
      $scope.space.push(typeObj);
      $scope.space.push(id);
      $scope.space.push(setSpaceClassName(data));
    }
    else
    {
      $scope.space=[];
    }

    $scope.magazineInfo["selectedCategory"]=data;
    $scope.activeCategory=typeObj;
    $scope.isDelete=false;

    if(added==false)
    {
      $scope.isDelete=false;
    }
    if(typeObj.info)
    {
      $scope.isPersonalStory=true;
    }
    else
    {
      $scope.isPersonalStory=false;
    }

    if(typeObj.addSpace)
    {
      $scope.addSpace=typeObj.addSpace;
    }
    else
    {
      $scope.addSpace=false;
    }

      if(typeObj.textValues)
      {
        $scope.records={}
        var text=[];
        angular.forEach(typeObj.textValues, function(field){
          text.push({"placeholder":field,"value":''});
        })
        $scope.records["textbox"]=text;
      }
      if(typeObj.imageValues)
      {
          var file=[];
          angular.forEach(typeObj.imageValues, function(field){
            file.push({"placeholder":field});
          });

          $scope.records["file"]=file;
      }
      if(Object.keys($scope.records).length==0){
        $scope.noFormData=true;
    }
    else {
          $scope.noFormData=false;
    }



  $scope.changeTemplate(type);


  }
  // }
  }
}
$scope.onSelectCategoryChange=function(type,id,x,x1,x2,added,ev)
{
      if($scope.checkValidation()==true )
      {
      // $scope.checkPersonalCoverStory();
      $scope.selectCategory(type,id,x,x1,x2,added,ev);
      }
      else
       {
        var confirm = $mdDialog.confirm()
                .title('Confirm')
                .textContent('Making this selection may result in loss of information. Do you want to process?')
                .ariaLabel('confirm')
                .targetEvent(ev)
                .ok('Yes')
                .clickOutsideToClose(true)
                .cancel('No');

                $mdDialog.show(confirm).then(function()
                {

                    $scope.selectCategory(type,id,x,x1,x2,added,ev);

            }, function()
            {
              $scope.menuactive=0;

            });

      }
}
$scope.selectCategory=function(type,id,x,x1,x2,added,ev)
{

//$scope.layoutDisabled=false;
var isAdded=false;
if(type.type)
{

angular.forEach($scope.pageList , function(value, key){
    if(value.isCategory==type.title)
    {
      isAdded=true;
    }

  });

  if(isAdded==true)
  {
    var confirm = $mdDialog.confirm()
              .title('Confirm')
              .textContent('Selection has already been made - Proceed? or Make a different selection?')
              .ariaLabel('confirm')
              .targetEvent(ev)
              .ok('Yes')
              .clickOutsideToClose(true)
              .cancel('No');
              $mdDialog.show(confirm).then(function()
        {

        $scope.updateNavalist(type,id,x,x1,x2,added);
        }, function() {

        });
  }

  else
  {
     $scope.updateNavalist(type,id,x,x1,x2,added);
  }

}
}

$scope.select= function(index) {
      $scope.selected = index;
};

$scope.backPageContent={};

// $timeout(function(){
//   var pageIdList=[];
//   angular.forEach($scope.pageList, function(value, index){
//     if(value.info.id){
//       pageIdList.push(value.info.id);
//     }
//     //console.log(JSON.stringify(value.info.id));
//   });
//
//   console.log(pageIdList);
//   // var data=$scope.additionalCost.filter( function(value){
//   //     console.log(value);
//   // })
//   angular.forEach($scope.additionalCost,function(value,index){
//     angular.forEach(value, function(value, index){
//       console.log(value.id);
//     })
//
//   })
// },1000);



//add content on local array
$scope.addContent = function(form,data)
{
  //get selectedCategory
  var category= $scope.magazineInfo.selectedCategory[0].key[$scope.magazineInfo.selectedCategory[0].key.length-1];

  if(form.$valid)
  {
    //define variables
    var flag=true;
    var content={},key="", pageId="";
    var $alert;

    if($scope.isPageLayoutChanged==true)
    {
      //delete old page;
      if($scope.ispageIdBackup)
      {
        var pageId=$scope.ispageIdBackup;
        var selectedpage=$scope.pageList[$scope.isPageActive];
        var spaceList=selectedpage.isSpace;
        var changeId=[],newSpaceList=[];
        if(spaceList.length>=1)
        {
            angular.forEach(spaceList, function(value){
            var pageData=$scope.magazinePageContent[value];
            //check it
            id=http.getPageId($scope.isPageActive, $scope.pagelayouts,pageData.addSpces);
            newSpaceList.push(id);
            changeId.push({"page":selectedpage.page,"oldId":value ,"newId":id,"pageLayout":$scope.OpenPage.length});
            pageData["pagelayouts"]=$scope.OpenPage.length;
            pageData["pageId"]=id;
            pageData["page"]=$scope.OpenPage;
            $scope.magazinePageContent[id]=pageData;
            $scope.submitPageOnServer(pageData); //push data on server
            delete $scope.magazinePageContent[value];
            //delete server
            $scope.deletePageDataOnServer(value);
          });

      $scope.pageList[$scope.isPageActive].isSpace=newSpaceList;
      }
      angular.forEach(selectedpage.info.page, function(value)
        {
        if(value!=$scope.isPageActive)
          {
              $scope.pageList[value]={
                "page":value+2,
                "id":false,
                "isSuccess":false,
                "pageActive":false,
                "isServer":false,
                "isSpace":[],
                "isSpaceList":[],
                "info":false,
                "isCategory":false}
          }
        });
        //delete page data and submit again
        delete $scope.magazinePageContent[pageId];
        $scope.deletePageDataOnServer(pageId);
      }
    }

  var checkSelectedPage=$scope.pageList[$scope.isPageActive].info;

  console.log("Active page id:"+ $scope.activePageId)
    if($scope.activePageId)
    {
      key=$scope.activePageId;
    }
    else
    {
      var pagelayout;
      if(checkSelectedPage && !$scope.ispageIdBackup)
      {
        pagelayout=checkSelectedPage.layout
      }
      else
       {
          pagelayout=$scope.pagelayouts
      }
      if(Object.keys($scope.space).length>0) //if make selection for adds
         {
            key=http.getPageId($scope.isPageActive, pagelayout,$scope.space[2]);
            if($scope.backPage==true){
              key='backPage';
            }
         }
         else
         {
            key=http.getPageId($scope.OpenPage, $scope.pagelayouts,$scope.space[2]);
            if($scope.backPage==true){
              key='backPage';
            }

         }

    }

flag=true
$timeout(function()
{
if(flag==false){

    var confirm = $mdDialog.alert()
          .title('Make a different Content Categories')
          .textContent($alert)
          .ariaLabel('alert')
          .ok('OK')
          .clickOutsideToClose(false)
          $mdDialog.show(confirm)
}
if(flag==true)
{

  if($scope.OpenPage.length==1) //if page loyout==1
  {
    angular.forEach($scope.OpenPage, function(key,index){
              $scope.pageList[key].isSuccess=true;
            if(checkSelectedPage && !$scope.ispageIdBackup)
            {
              $scope.pageList[key].info={"page":checkSelectedPage.page,"layout":checkSelectedPage.layout}
            }
            else
            {
              $scope.pageList[key].info={"page":$scope.OpenPage,"layout":$scope.pagelayouts};
            }

    });

      //add layout image

    if(Object.keys($scope.space).length>0) //if adds make selection
       {
         content["addSpces"]=$scope.space[2];
         if(!$scope.activePageId)
         {
           $scope.pageList[$scope.isPageActive].isSpaceList.push($scope.space[2]);
           $scope.pageList[$scope.isPageActive].isSpace.push(key);
          }
          content["page"]=[$scope.isPageActive]; //current page

      }
      else
      {
          $scope.pageList[$scope.isPageActive].isCategory=category;
          $scope.pageList[$scope.isPageActive].id=key;
          content["page"]=$scope.OpenPage; //current page
      }

  }
  else if($scope.OpenPage.length==2) //if page layout==2
  {
    angular.forEach($scope.OpenPage, function(key,index){
            $scope.pageList[key].isSuccess=true;
            if(checkSelectedPage && !$scope.ispageIdBackup)
            {
                $scope.pageList[key].info={"page":checkSelectedPage.page,"layout":checkSelectedPage.layout}
            }
            else
            {
                $scope.pageList[key].info={"page":$scope.OpenPage,"layout":$scope.pagelayouts};
            }
    });

    //add layout image
  if(Object.keys($scope.space).length>0) //if adds make selection
     {
      content["addSpces"]=$scope.space[2];
      if(!$scope.activePageId)
      {
        $scope.pageList[$scope.isPageActive].isSpaceList.push($scope.space[2]);
        $scope.pageList[$scope.isPageActive].isSpace.push(key);
      }
      content["page"]=[$scope.isPageActive]; //current page
    }
    else
    {
      content["page"]=$scope.OpenPage; //current page
      angular.forEach($scope.OpenPage, function(data,index){
            $scope.pageList[data].isCategory=category;
            $scope.pageList[data].id=key;
      });
    }
    }
      content["layoutImage"]={
      'layout1':$scope.pagelayout1Image,
      "layout2":$scope.pagelayout2Image,
      "layout3":$scope.pagelayout3Image};
        content["content"]=data; //content
        content["category"]=$scope.magazineInfo.selectedCategory; //active page category
        content["pageId"]=key;
        if($scope.pagelayouts)
        {
          content["pagelayouts"]=$scope.pagelayouts;
        }
        else
        {
          content["pagelayouts"]=1;
        }
          //push final data on local variables
       $scope.magazinePageContent[key]=content;
       console.log($scope.magazinePageContent);

      //push page data on server
      var message=category+" has been successfully submitted.";
      http.alert(message);
      http.validatePage($scope.pageList)

var count=0, pos=0, array=[];
angular.forEach($scope.pageList, function(value,key){

if(value.hasOwnProperty("isValid")==false)
{
    pos=count;
    array.push(count);
}
count++;
  });
  $timeout(function(){
      if(pos==0)
      {
        angular.forEach($scope.pageList, function(value,key)
        {
          value.pageActive=false;
        });
         console.log("All pages are done move next step;");
         http.alert("All pages are done move to next step Highlights");
         $scope.stepOver["pageContent"]="success";
         http.storage("magazine_data","stepOver", $scope.stepOver);
         http.storage("magazine_data","stepTab", $scope.selectedTab);

          //   //set highlight fetaure on array
          //   var arr=[];
          //   angular.forEach($scope.magazinePageContent, function(value , key){
          //   var page='';
          //   angular.forEach(value.page , function(value){
          //       page+='Page-'+ (value+2) +',';
          //   });
          //   page=page.slice(0,page.length-1);
          //   arr.push({"title":value.category[2].value.title + " ("+page+")","disabled":false});
          // });

          // //  $scope.highlight_features=arr.unique(arr);
          // $scope.highlight_features=arr;
          // sessionStorage["hightlightFeatures"]=JSON.stringify($scope.highlight_features);
          // $scope.category_list=http.storageParse("category");
          $scope.selectedTab=4;
          $scope.hightlights_step1=true;
      }
      else if(pos!=0)
       {
         pos=0;
          if($scope.pageList[$scope.isPageActive].isValid==true){
            $scope.setPageActive($scope.pagelayouts, array[0]);
        }

      //    var node=content["category"][2].value.title.toLowerCase();
      //    if(node.indexOf('full')>=0 && node.indexOf('ads')>=0)
      //    {
      //      $scope.setPageActive(1,array[0]);
      //    }
      //    else
      //    {
      //    if(Object.keys($scope.space).length>0) //if adds make selection
      //    {
      //      var page=content["page"]
      //     if(page.length==2)
      //     {
      //        $scope.pageList[page[0]].pageActive=true;
      //        $scope.openPage=[page[0],page[1]];
      //      }
      //      if(page.length==1){
      //         $scope.pageList[page[0]].pageActive=true;
      //         $scope.openPage=[page[0]];
      //      }
      //    }
      //    else
      //    {
      //     $scope.setPageActive(1, array[0]);
      //      //$scope.selectbox=false;
      //      $timeout(function()
      //      {
      //         $scope.pagelayouts=1;
      //         $scope.selectbox=$rootScope.appUrl+"template/selectbox.html";
      //         $scope.layoutDisabled=false;
      //      },200)
      //
      //    }
      // }
       }
  },100)



if($scope.activePageId==false)
{
if($scope.isTempPrice)
{
  http.sessionStorage("price",$scope.additionalCost);
}
}

if(http.storageParse("price"))
{
    $scope.additionalCost=http.storageParse("price");
}

        //set highlight fetaure on array
            var arr=[];
            angular.forEach($scope.magazinePageContent, function(value , key){
            var page='';
            angular.forEach(value.page , function(value){
                page+='Page-'+ (value+2) +',';
            });
            page=page.slice(0,page.length-1);
            arr.push({"title":value.category[2].value.title + " ("+page+")","disabled":false});
          });

          //  $scope.highlight_features=arr.unique(arr);
          $scope.highlight_features=arr;
          sessionStorage["hightlightFeatures"]=JSON.stringify($scope.highlight_features);
          $scope.category_list=http.storageParse("category");

$scope.menuactive=0;
delete $scope.magazineInfo['selectedCategory'];
$scope.isContent=true;
$scope.records={};
$scope.pageListbackup=$scope.pageList;
http.storage("magazine_data","pageListBackup", $scope.pageList);
$scope.formTemplate=false;

$scope.noTemplate=false;
$scope.isCostAdded=false;
 //reset form
form.$submitted=false;
form.$dirty=false;
$scope.pagelayout1Image=false;
$scope.pagelayout2Image=false;
$scope.pagelayout3Image=false;
$scope.layoutDisabled=true;
$scope.isAdsLayout=false;
$scope.ispageIdBackup=undefined;
angular.forEach(
    angular.element(".file-group-custom input[type='file']"),
    function(inputElem) {
      angular.element(inputElem).val(null);
    });

$scope.submitPageOnServer(content);

}//end if condition
},500);
  $timeout(function(){_j('body,html').animate({scrollTop:0},500);},500);

} //end form valid
  else
  {
      angular.forEach(form.$error.required, function(field)
      {
        field.$dirty=true;
      })
      http.alert("Enter your "+ category +" details.","error-toast");
  }
}

$scope.submitPageOnServer=function(content){

  //=============================================================================

  //send additional data for current user

  //send data on server through rest API
  var PAGE_DATA=[];
  var FILES=[];
  var PAGE=[];
  var caption=[];
  content["lastInsertedId"]=$scope.userMagazineId;
  content["userInfo"]=userInfo;

  //push file on array
  angular.forEach(content.content.file, function(value,key){
    angular.forEach(value.value, function(value,key){
        FILES.push(value.value);
        var key={};
        if(value.hasOwnProperty('caption'))
        {
          key["caption"]=value.caption
        }
        if(value.hasOwnProperty('name'))
        {
          key["name"]=value.name
        }
        if(value.hasOwnProperty('id'))
        {
          key["id"]=value.id
        }

        if(angular.equals({},key)==false)
        {
            caption.push(key);
        }


      });
  });


  PAGE_DATA=content;
  PAGE=PAGE_DATA['page'];
  if(caption.length>0)
  {
    PAGE_DATA["caption"]=caption;
  }

  //PAGE_DATA['magazine_data']=http.storageParse('magazine_data');

  //set loader on current page
    angular.forEach(PAGE, function(value,index)
    {
        $scope.pageList[value].isLoading=true;
    });


  http.upload_file(uploadPagedata, FILES,PAGE_DATA,function(response)
  {
    if(response.status==true)
    {
      angular.forEach(PAGE, function(value,index){
        delete $scope.pageList[value]["isLoading"];
      });

      $scope.updateUserStep();

    }
    else
    {
    //  $log.info(response);
    }
  });

  //==============================================================================

}
$scope.deletePageDataOnServer=function(pageId)
{
  var pageInfo={"userInfo": userInfo, "lastInsertedId": $scope.userMagazineId,"pageId":pageId};
  http.get_data(delete_page_data,pageInfo,function(response)
  {
  });
}
//delete data form local variables
$scope.deleteFeature=function (id)
{
// if($scope.activePageId)
// {
    var pageId;
    if(id)
    {
      pageId=id;
    }
    else
    {
      pageId=$scope.activePageId;
    }

    var pageData=$scope.magazinePageContent[pageId];
    delete $scope.magazinePageContent[pageId];

    //process to delete local data
    var page=$scope.pageList[$scope.isPageActive];

    var ads=[],adsList=[];
      angular.forEach(page.isSpace, function(key,index){
        if(key!=pageId)
        {
          ads.push(page.isSpace[index]);
          adsList.push(page.isSpaceList[index]);
        }
      });

      if(page.info.layout==2 && pageData.category[2].value.type=="content")
      {
        angular.forEach($scope.OpenPage,function(key)
        {
          $scope.pageList[key].id=false;
          $scope.pageList[key].isCategory=false;
        });
      }

        if(page.id==pageId)
        {
          page.isCategory=false;
        }

      page.isSpace=ads;
      page.isSpaceList=adsList;
      $scope.pageList[pageId]=page;
      delete $scope.magazineInfo['selectedCategory'];

      var category=page.isCategory;
      var ads=page.isSpace;

      if(Object.keys(category).length==0 && Object.keys(ads).length==0)
      {

        angular.forEach($scope.OpenPage,function(key){
              $scope.pageList[key].isSuccess=false;
              $scope.pageList[key].id=false;

              delete $scope.pageList[key]["isValid"];

        });

      }

///delete price and adds
if(pageData.category[2].value.cost)
{
$scope.additionalCost=http.removePrice(pageData.category[2].value.id, 'addition', $scope.additionalCost);
http.sessionStorage("price",$scope.additionalCost);
}
if(pageData.category[2].value.type=='space')
{
$scope.additionalCost=http.removePrice(pageData.category[2].value.id, 'discount', $scope.additionalCost);
http.sessionStorage("price",$scope.additionalCost);
}

    $scope.records={};
    $scope.noTemplate=false;
    $scope.isDelete=false;
    angular.forEach(
    angular.element(".file-group-custom input[type='file']"),
    function(inputElem) {
      angular.element(inputElem).val(null);
    });
    http.alert("You have successfully deleted this feature.","error-toast");
    $scope.pagelayout1Image=false;
    $scope.pagelayout2Image=false;
    $scope.pagelayout3Image=false;

    //call api to delete data
    $scope.deletePageDataOnServer(pageId)



    http.storage("magazine_data","pageList", $scope.pageList);
    http.storage("magazine_data","navList", $scope.navList);
    $scope.updateUserStep();
}
//check delete function
$scope.deleteContent= function(ev,form,data)
  {
    var confirm = $mdDialog.confirm()
              .title('Delete')
              .textContent('Are you sure you want to delete this feature?')
              .ariaLabel('deleteData')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('No');
        $mdDialog.show(confirm).then(function() {
          //$scope.status = 'You decided to get rid of your debt.';
          $scope.deleteFeature();
        }, function(){
          //$scope.status = 'You decided to keep your debt.';
        });


  }


$scope.final= function(){
    $mdDialog.hide();
}

/*color preview */
$scope.changeImageColor = function(data)
{

    angular.forEach($scope.colorImage, function(value, key){
        if(value.type==data)
        {
          if($scope.colorImagePreview!=value.image)
          {
          $scope.colorImageTag=value.title;
          $scope.colorImagePreview=value.image;
        }
        }
    });
}

$scope.isbgColor=false;
$scope.$on('removeColor', function(event, args) {
  angular.forEach($scope.pagedataColor1, function(value, key){
      if(value==args)
      {
        delete $scope.pagedataColor1[key];
      }

  })
});

$scope.$on('colorChnaged', function(event, args)
{
$scope.isbgColor=true;
$scope.bgColor=args;
});

$scope.hideColor =function(id)
{
  $scope.isbgColor=false;
}
/*hightlight*/
$scope.hightlights_step1=true;
$scope.highlight_data={};
$scope.highlight_data={"style":"Strip"};
$scope.hightlights_step_1_data={};

$scope.hightlights_form_step1=function(data,form){

  if(form.$valid)
  {
    $scope.highlightsisLoading=true;
    $timeout(function()
    {
        $scope.highlightsisLoading=false;
        $scope.hightlights_step2=true;
        $scope.hightlights_step1=false;
        $scope.stepOver["pageHighlight1"]="success";
        http.storage("magazine_data","stepOver", $scope.stepOver);
        http.storage("magazine_data","hightlights_form_step1", data);
        $scope.updateUserStep();

        },100)
  }
  else{
    angular.forEach(form.$error.required, function(e){
      e.$dirty=true;
    })
  }
}


//disabled highlight dropdown menu
$scope.disabledFeature=function(value1,value2,value3)
{
// angular.forEach($scope.highlight_features, function(value,key){
//   value.disabled=false;
//   })
//
//   angular.forEach($scope.highlight_features, function(value,key){
//     if(value.title===value1)
//     {
//     value.disabled=true;
//     }
//     if(value.title===value2)
//     {
//     value.disabled=true;
//     }
//     if(value.title===value3)
//     {
//     value.disabled=true;
//     }
//     })
}

$scope.enableFeature=function(data){
  $timeout(function()
  {
  angular.forEach($scope.highlight_features, function(value,key)
  {
    if(value.title===data)
    {
      value.disabled=false;
    }
  })
  },100)
}


//check page list and delete page data
$scope.checkPageAndUpdate=function(){
console.log($scope.pageListbackup.length);

  var pages=[], backupPages=[], pageIds=[];
  angular.forEach($scope.pageList, function(value, index){
    if(value.isSuccess==true){
        pages.push(value);
    }

  });
  angular.forEach($scope.pageListbackup, function(value, index){
    if(value.isSuccess==true)
    {
        backupPages.push(value);
    }

  });

console.log(backupPages);
console.log(pages);
  if(backupPages.length>pages.length )
  {

      for(var i=pages.length-1; i<=backupPages.length-2;i++)
      {

        if(backupPages[i].id)
          {
              pageIds.push(backupPages[i].id);
          }

        var ads=backupPages[i].isSpace;
        if(ads.length>0){
          angular.forEach(ads, function(value, key){
            pageIds.push(value);
          });
        }
      }
      if(pageIds)
      {
        pageIds=pageIds.getUnique();
      }
      console.log(pageIds)
      //process to delete data
      angular.forEach(pageIds,function(value){

        $scope.deletePageDataOnServer(value);
      });
       $scope.pageListbackup=$scope.pageList;
       http.storage("magazine_data","pageListbackup", $scope.navList);
  }

}
$scope.hightlights_form= function(data,form)
{

  $scope.checkPageAndUpdate();
  return false;
  if(form.$valid)
  {

    $scope.highlightsisLoading=true;
    http.storage("magazine_data","stepOver", $scope.stepOver);
    http.storage("magazine_data","hightlights_form_step2", data);
    var data=data;
    var DATA={}
    DATA["hightlight_step_1"]=$scope.hightlights_step_1_data;
    DATA["hightlight_step_2"]=data;
    DATA["additionalCost"]=$scope.additionalCost;
    DATA["userInfo"]=userInfo;
    DATA["lastInsertedId"]=$scope.userMagazineId;
    DATA["magazineId"]=$scope.selectedCover.id;
    var price={};
    //{{(((selectedCover.priceperCopies * pageData.defaultPage) * pageData.copies) + addvalue )-discountVal }}

    DATA["total"]=($scope.selectedCover.priceperCopies * $scope.pageData.defaultPage) * $scope.pageData.copies;
    $scope.updateUserStep();
    http.get_data(addToCart, DATA, function(response){
        if(response.status==true)
          {
            $scope.updateUserStep();
            $scope.stepOver["pageHighlight2"]="success";
            http.storage("magazine_data","stepOver", $scope.stepOver);

            location.assign(response.url);
            $scope.highlightsisLoading=false;
        }
        else if(response.status==false)
        {
          http.alert("Please try again?","error-toast");
          $scope.highlightsisLoading=false;
        }
      });
    }
  else{
    angular.forEach(form.$error.required, function(e){
      e.$dirty=true;
    })
  }
}

$scope.ChnageMessageImage= function(data)
{
  if(data.image)
  {
    $scope.styleImage=data.image;
  }
  else
   {
    if($scope.styleImage!=data)
    {
      $scope.styleImage=data;
    }
  }
}

var tabs=[
    {"id":0,"text":"COVER"},
    {"id":1,"text":"PAGE COUNT & COPIES"},
    {"id":2,"text":"COLORS"},
    {"id":3,"text":"CONTENT"},
    {"id":4,"text":"HIGHLIGHTS"}
];

$scope.backPage=function()
{
angular.forEach(tabs, function(value,key)
{
    if(($scope.selectedTab-1)===value.id)
    {
      $scope.backToltip=value.text;
    }
})
  $scope.selectedTab= ($scope.selectedTab-1);
}

$scope.$watch('selectedTab', function(val){
  angular.forEach(tabs, function(value,key)
  {
      if(($scope.selectedTab-1)===value.id)
      {
        $scope.backToltip=value.text;
      }
  })
});

$scope.$watch('stepOver', function(value){  $timeout(function(){
    var ele=angular.element(document.querySelectorAll('md-tab-item'));
    angular.forEach(ele, function(e){
      if(angular.element(e).find('i').hasClass('success')==true)
        {
          angular.element(e).addClass('success');
        }
    })

  },2000)
});

//set default when page is reload
//load default data form server if page is reload
$scope.checkEmpty= function(data){
  if(Object.keys(data).length==0){
    return false;
  }
}

//load page data  for server
$scope.loadPageData= function()
{
  if($scope.userMagazineId)
  {
  $timeout(function(){
        var request={};
        request["userInfo"]=userInfo;
        request["lastInsertedId"]=$scope.userMagazineId;
        var pageData;

          http.get_data(pageDataURL,request,function(response)
                {
                  $scope.magazinePageContent={};

                  angular.forEach($scope.pageList,function(data,key){
                        delete $scope.pageList[key]["isLoading"];
                  });
                  angular.forEach(response.pagedata, function(value, key)
                  {
                      $scope.magazinePageContent[key]=value;
                  });

                  angular.forEach($scope.magazinePageContent,function(data,key)
                  {
                      var fileURL=response.fileList[key];

                      angular.forEach(data.content.file, function(value, key){
                        if(fileURL[key])
                        {
                            var file=fileURL[key];
                            angular.forEach(value.value, function(node, index){
                                  node.url=file[index].url;
                            });
                        }
                      })

                  });

          });

      },50);

  }
  // var request={};
  // request["userInfo"]=userInfo;
  // request["lastInsertedId"]=$scope.userMagazineId;
  // var pageData;
  // $scope.magazinePageContent={};
  // var count=0, flag=0;
  //
  // angular.forEach($scope.pageList,function(data,key){
  //     if(data.isSuccess==true)
  //     {
  //         data.isLoading=true;
  //         flag=1;
  //     }
  // });
//
// $timeout(function(){
//
// if(flag==1)
// {
  // http.get_data(pageDataURL,request,function(response)
  //       {
  //         angular.forEach($scope.pageList,function(data,key){
  //               delete $scope.pageList[key]["isLoading"];
  //         });
  //         angular.forEach(response.pagedata, function(value, key)
  //         {
  //             $scope.magazinePageContent[key]=value;
  //         });
  //         angular.forEach($scope.magazinePageContent,function(data,key)
  //         {
  //             var fileURL=response.fileList[key];
  //             angular.forEach(data.content.file, function(value, key){
  //               var file=fileURL[key];
  //               angular.forEach(value.value, function(node, index){
  //                     node.url=file[index];
  //               })
  //             })
  //
  //         });

  // });

  // },200);

}
  $scope.loadPageData();
}//end start app function

//check user data condition based;

$scope.showConfirm= function(message,title,btn,btn1){
  var confirm = $mdDialog.confirm()
    .title(title)
    .htmlContent(message)
    .ariaLabel('infoBOX')
    .parent(angular.element(document.body))
    .ok(btn)
    .cancel(btn1);
    return confirm;
};

$scope.confirmDeleteData= function(id){
  //delete all previous data from current data;
  http.alertLoader("Please wait while we'r clear your previous unsaved work,<br> it will take less time.</span>");
  var data=userInfo;
  data["lastInsertedId"]=id;
  http.get_data(deleteUserDataAll, data, function(response){
      if(response.status==true)
      {
          $scope.startApp();
         sessionStorage["isOffLoad"]=true;
      }
  });

}

$scope.setSesstionStartApp= function(data){
  var $data=data;
  if($data)
  {
  angular.forEach($data, function(value,key){
    var data=angular.toJson(value);
    sessionStorage[key]=data;
  });
  }
  sessionStorage["isOffLoad"]=true;
  $scope.startApp();
}

if(!sessionStorage['isOffLoad'])
{
/* check user exist data on server*/
  http.get_data(checkUserDetails, userInfo, function(response){

    if(response.status==true)
    {
      //new user nothing to do just start APP
        http.alertLoader("Please wait while we'r loading ,<br> it will take less time.</span>");
        $scope.startApp();
    }
  if(response.status==false)
    {
      //if existing user coming with unsaved data
      var $data=response.data.data;
      //var confirm=$scope.showConfirm("You have some existing work. click on below one of the button <br> to start a new page or continue form last left.",'Are you Sure?',"No",'Yes ');
	  if(isEdit=='true'){
	  var confirm=$scope.showConfirm("You have some unsaved work click below to confirm, <br>  if you click YES delete your last created magazine data or no to load last work undone.",'Are you Sure?',"No",'Yes ');
	  }else{
	  var confirm=$scope.showConfirm("You have some unsaved work click below to confirm, <br>  if you click YES delete your last created magazine data or no to load last work undone.",'Are you Sure?',"No",'Yes ');
	  }

      $mdDialog.show(confirm).then(function() {
        //if click on continue
          sessionStorage["isOffLoad"]=true;
         $scope.setSesstionStartApp($data);
         http.alertLoader("Please wait while we'r processing your request,<br> it will take less time.</span>");
      }, function()
      {

        $scope.confirmDeleteData($data.lastInsertedId);

      });

      }
});
}
else {
    $scope.startApp();
}

//save and exit tool
$scope.saveExit= function(id,url){
  var btn;
  if(id=="save")
  {
    btn="Save & Exit";
  }
  if(id=="edit")
  {
    btn="Save & Go to Cart";
  }
  var message={"title":"Confirm","message":"Are you sure you want to go? <br><small>your work will be saved. </small>"};
  var confirm = $mdDialog.confirm()
    .title(message.title)
    .htmlContent(message.message)
    .ariaLabel('save')
    .parent(angular.element(document.body))
    .ok(btn)
    .cancel("No");

      $mdDialog.show(confirm).then(function() {
        //if click on continue
        if(url)
        {

          http.clearStorage();
          http.alertLoader("Please wait while we'r processing your request,<br> it will take less time.</span>");
          location.assign(url);
        }

        }, function() {

      });

}



}//end controller


Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
